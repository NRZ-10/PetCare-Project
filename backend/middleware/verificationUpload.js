const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Resolve the secure private directory (never served as static files)
const secureUploadDir = process.env.VERIFICATION_DOCS_DIR
    ? path.resolve(process.env.VERIFICATION_DOCS_DIR)
    : path.join(__dirname, '..', 'secure_uploads', 'verification_docs');

// Ensure directory exists securely
if (!fs.existsSync(secureUploadDir)) {
    fs.mkdirSync(secureUploadDir, { recursive: true });
}

// Configurable max file size (default 5 MB)
const maxFileSizeMb = parseInt(process.env.MAX_DOCUMENT_SIZE_MB, 10) || 5;
const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, secureUploadDir);
    },
    filename: (req, file, cb) => {
        // Generate a cryptographically random, safe filename with .pdf extension
        const randomHex = crypto.randomBytes(12).toString('hex');
        const safeName = `doc-${Date.now()}-${randomHex}.pdf`;
        cb(null, safeName);
    }
});

const fileFilter = (req, file, cb) => {
    // Only accept PDF
    const ext = path.extname(file.originalname).toLowerCase();
    const isPdfExt = ext === '.pdf';
    const isPdfMime = file.mimetype === 'application/pdf';

    if (isPdfExt && isPdfMime) {
        cb(null, true);
    } else {
        const error = new Error('Invalid file type. Only PDF documents (.pdf) are allowed.');
        error.code = 'INVALID_FILE_TYPE';
        cb(error, false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxFileSizeBytes }
});

// Wrapper middleware to provide clean error responses for multer errors (e.g. file size)
const handleVerificationUpload = (fieldName = 'document') => {
    const singleUpload = upload.single(fieldName);

    return (req, res, next) => {
        singleUpload(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        message: `File size exceeds the maximum limit of ${maxFileSizeMb} MB.`
                    });
                }
                if (err.code === 'INVALID_FILE_TYPE') {
                    return res.status(400).json({
                        message: err.message
                    });
                }
                return res.status(400).json({
                    message: err.message || 'File upload error'
                });
            }
            next();
        });
    };
};

module.exports = {
    handleVerificationUpload,
    secureUploadDir,
    maxFileSizeMb
};
