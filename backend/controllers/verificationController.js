const path = require('path');
const fs = require('fs');
const CaregiverProfile = require('../models/CaregiverProfile');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { secureUploadDir } = require('../middleware/verificationUpload');

/**
 * Validate that the uploaded file begins with PDF magic bytes (%PDF-)
 */
const validatePdfMagicBytes = (filePath) => {
    try {
        const fd = fs.openSync(filePath, 'r');
        const buffer = Buffer.alloc(5);
        fs.readSync(fd, buffer, 0, 5, 0);
        fs.closeSync(fd);
        return buffer.toString('utf-8') === '%PDF-';
    } catch (err) {
        return false;
    }
};

/**
 * Helper to safely remove an old document file
 */
const deleteOldDocumentFile = (filename) => {
    if (!filename) return;
    try {
        const safeBase = path.basename(filename);
        const resolvedPath = path.resolve(secureUploadDir, safeBase);
        if (resolvedPath.startsWith(path.resolve(secureUploadDir)) && fs.existsSync(resolvedPath)) {
            fs.unlinkSync(resolvedPath);
        }
    } catch (err) {
        console.error('Error deleting old document file:', err.message);
    }
};

// ==========================================
// CAREGIVER CONTROLLERS
// ==========================================

// @desc    Upload or replace caregiver's verification document
// @route   POST /api/caregiver/verification/upload
// @access  Private/Caregiver
const uploadVerificationDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please select a PDF document to upload.' });
        }

        // Validate actual PDF content via magic bytes (%PDF-)
        const isValidPdf = validatePdfMagicBytes(req.file.path);
        if (!isValidPdf) {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                message: 'Invalid document content. The file does not appear to be a valid PDF document.'
            });
        }

        let profile = await CaregiverProfile.findOne({ user: req.user._id });
        if (!profile) {
            profile = await CaregiverProfile.create({ user: req.user._id });
        }

        // Delete old document file if one already exists
        if (profile.verificationDocumentPath) {
            deleteOldDocumentFile(profile.verificationDocumentPath);
        }

        // Store secure safe filename and original filename
        profile.verificationDocumentPath = req.file.filename;
        profile.verificationDocumentOriginalName = path.basename(req.file.originalname);
        profile.verificationDocumentUploadedAt = new Date();
        profile.verificationStatus = 'Pending';
        profile.verificationNote = '';
        profile.verifiedAt = null;
        profile.verifiedBy = null;

        await profile.save();

        const populated = await CaregiverProfile.findById(profile._id)
            .populate('user', 'name email phone');

        res.status(200).json({
            message: 'Verification document uploaded successfully. It is now awaiting admin review.',
            profile: populated
        });
    } catch (error) {
        // Clean up uploaded file if database error occurs
        if (req.file && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get caregiver's own verification status
// @route   GET /api/caregiver/verification/status
// @access  Private/Caregiver
const getCaregiverVerificationStatus = async (req, res) => {
    try {
        let profile = await CaregiverProfile.findOne({ user: req.user._id })
            .populate('user', 'name email phone');

        if (!profile) {
            profile = await CaregiverProfile.create({ user: req.user._id });
            profile = await CaregiverProfile.findById(profile._id).populate('user', 'name email phone');
        }

        res.json({
            verificationStatus: profile.verificationStatus,
            verificationDocumentPath: profile.verificationDocumentPath,
            verificationDocumentOriginalName: profile.verificationDocumentOriginalName,
            verificationDocumentUploadedAt: profile.verificationDocumentUploadedAt,
            verificationNote: profile.verificationNote,
            verifiedAt: profile.verifiedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Securely view/download caregiver's own verification PDF
// @route   GET /api/caregiver/verification/document
// @access  Private/Caregiver
const getCaregiverVerificationDocument = async (req, res) => {
    try {
        const profile = await CaregiverProfile.findOne({ user: req.user._id });
        if (!profile || !profile.verificationDocumentPath) {
            return res.status(404).json({ message: 'No verification document found.' });
        }

        const safeFilename = path.basename(profile.verificationDocumentPath);
        const resolvedPath = path.resolve(secureUploadDir, safeFilename);

        // Path traversal prevention
        if (!resolvedPath.startsWith(path.resolve(secureUploadDir)) || !fs.existsSync(resolvedPath)) {
            return res.status(404).json({ message: 'Verification document file not found on server.' });
        }

        const originalName = profile.verificationDocumentOriginalName || 'verification-document.pdf';

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(originalName)}"`);
        res.setHeader('X-Content-Type-Options', 'nosniff');

        const stream = fs.createReadStream(resolvedPath);
        stream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ==========================================
// ADMIN CONTROLLERS
// ==========================================

// @desc    List caregivers with verification details
// @route   GET /api/admin/verifications
// @access  Private/Admin
const getAdminVerifications = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        let query = {};
        if (status) {
            query.verificationStatus = status;
        }

        // Fetch profiles populated with user and admin who verified
        let profiles = await CaregiverProfile.find(query)
            .populate('user', 'name email phone')
            .populate('verifiedBy', 'name email')
            .sort({ verificationDocumentUploadedAt: -1, updatedAt: -1 });

        // Filter by user search if provided
        if (search) {
            const regex = new RegExp(search.trim(), 'i');
            profiles = profiles.filter(p =>
                p.user && (regex.test(p.user.name) || regex.test(p.user.email))
            );
        }

        const total = profiles.length;
        const pages = Math.ceil(total / limitNum) || 1;
        const paginatedData = profiles.slice(skip, skip + limitNum);

        res.json({
            data: paginatedData,
            total,
            page: pageNum,
            pages
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Securely view/download caregiver's verification PDF (Admin)
// @route   GET /api/admin/verifications/:id/document
// @access  Private/Admin
const getAdminCaregiverDocument = async (req, res) => {
    try {
        const profile = await CaregiverProfile.findById(req.params.id);
        if (!profile || !profile.verificationDocumentPath) {
            return res.status(404).json({ message: 'Verification document not found for this caregiver.' });
        }

        const safeFilename = path.basename(profile.verificationDocumentPath);
        const resolvedPath = path.resolve(secureUploadDir, safeFilename);

        // Path traversal prevention
        if (!resolvedPath.startsWith(path.resolve(secureUploadDir)) || !fs.existsSync(resolvedPath)) {
            return res.status(404).json({ message: 'Document file not found on server.' });
        }

        const originalName = profile.verificationDocumentOriginalName || 'verification-document.pdf';

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(originalName)}"`);
        res.setHeader('X-Content-Type-Options', 'nosniff');

        const stream = fs.createReadStream(resolvedPath);
        stream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Approve caregiver verification
// @route   PUT /api/admin/verifications/:id/approve
// @access  Private/Admin
const approveCaregiverVerification = async (req, res) => {
    try {
        const profile = await CaregiverProfile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Caregiver profile not found.' });
        }

        profile.verificationStatus = 'Approved';
        profile.verifiedAt = new Date();
        profile.verifiedBy = req.user._id;
        if (req.body.note !== undefined) {
            profile.verificationNote = req.body.note;
        }

        await profile.save();

        // Send notification to caregiver
        try {
            await Notification.create({
                user: profile.user,
                title: 'Verification Approved',
                message: 'Your caregiver verification documents have been reviewed and approved according to our verification process. Your profile is now visible to pet owners.',
                type: 'system',
                relatedId: profile._id
            });
        } catch (notifErr) {
            console.error('Failed to create notification:', notifErr.message);
        }

        const populated = await CaregiverProfile.findById(profile._id)
            .populate('user', 'name email phone')
            .populate('verifiedBy', 'name email');

        res.json({
            message: 'Caregiver has been approved successfully.',
            profile: populated
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reject caregiver verification with reason
// @route   PUT /api/admin/verifications/:id/reject
// @access  Private/Admin
const rejectCaregiverVerification = async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason || !reason.trim()) {
            return res.status(400).json({ message: 'A rejection reason is required.' });
        }

        const profile = await CaregiverProfile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Caregiver profile not found.' });
        }

        profile.verificationStatus = 'Rejected';
        profile.verificationNote = reason.trim();
        profile.verifiedAt = new Date();
        profile.verifiedBy = req.user._id;

        await profile.save();

        // Send notification to caregiver
        try {
            await Notification.create({
                user: profile.user,
                title: 'Verification Rejected',
                message: `Your verification documents could not be approved. Reason: ${reason.trim()}`,
                type: 'system',
                relatedId: profile._id
            });
        } catch (notifErr) {
            console.error('Failed to create notification:', notifErr.message);
        }

        const populated = await CaregiverProfile.findById(profile._id)
            .populate('user', 'name email phone')
            .populate('verifiedBy', 'name email');

        res.json({
            message: 'Caregiver verification rejected.',
            profile: populated
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Request changes/corrections for caregiver verification with reason
// @route   PUT /api/admin/verifications/:id/request-changes
// @access  Private/Admin
const requestCorrectionCaregiverVerification = async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason || !reason.trim()) {
            return res.status(400).json({ message: 'Correction instructions are required.' });
        }

        const profile = await CaregiverProfile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Caregiver profile not found.' });
        }

        profile.verificationStatus = 'Changes Requested';
        profile.verificationNote = reason.trim();
        profile.verifiedAt = new Date();
        profile.verifiedBy = req.user._id;

        await profile.save();

        // Send notification to caregiver
        try {
            await Notification.create({
                user: profile.user,
                title: 'Document Corrections Requested',
                message: `Admin requested changes to your verification documents: ${reason.trim()}`,
                type: 'system',
                relatedId: profile._id
            });
        } catch (notifErr) {
            console.error('Failed to create notification:', notifErr.message);
        }

        const populated = await CaregiverProfile.findById(profile._id)
            .populate('user', 'name email phone')
            .populate('verifiedBy', 'name email');

        res.json({
            message: 'Document corrections requested from caregiver.',
            profile: populated
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    uploadVerificationDocument,
    getCaregiverVerificationStatus,
    getCaregiverVerificationDocument,
    getAdminVerifications,
    getAdminCaregiverDocument,
    approveCaregiverVerification,
    rejectCaregiverVerification,
    requestCorrectionCaregiverVerification
};
