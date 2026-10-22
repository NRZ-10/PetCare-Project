const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const BASE_URL = 'http://127.0.0.1:5000/api';

// Create a minimal valid PDF buffer starting with %PDF-
const createValidPdfBlob = (text = 'PetCare Connect Verification Test') => {
    const content = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 72 712 Td (${text}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000216 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n309\n%%EOF`;
    return new Blob([content], { type: 'application/pdf' });
};

// Create an invalid PDF blob (wrong magic bytes)
const createInvalidPdfBlob = () => {
    return new Blob(['This is not a real PDF file despite the extension'], { type: 'application/pdf' });
};

// Create an oversized blob (> 5MB) starting with %PDF-
const createOversizedPdfBlob = () => {
    const size = 6 * 1024 * 1024; // 6MB
    const buf = Buffer.alloc(size);
    buf.write('%PDF-1.4\n', 0);
    return new Blob([buf], { type: 'application/pdf' });
};

async function runTests() {
    console.log('🚀 Starting Verification System Automated Tests (Node fetch)...');
    let passed = 0;
    let failed = 0;

    const assert = (condition, testName) => {
        if (condition) {
            console.log(`  ✅ PASS: ${testName}`);
            passed++;
        } else {
            console.error(`  ❌ FAIL: ${testName}`);
            failed++;
        }
    };

    try {
        // 1. Authenticate Admin
        console.log('\n--- 1. Authentication ---');
        const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@petcare.com', password: 'Admin@123' })
        });
        const adminData = await adminLoginRes.json();
        const adminToken = adminData.token;
        assert(adminToken, 'Admin authentication successful');

        // 2. Register a new test Caregiver
        const testEmail = `test_cg_${Date.now()}@giver.com`;
        const testPassword = 'Password@123';
        const cgRegisterRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Verification Caregiver',
                email: testEmail,
                password: testPassword,
                role: 'caregiver'
            })
        });
        const cgData = await cgRegisterRes.json();
        const cgToken = cgData.token;
        const cgId = cgData._id;
        assert(cgToken, `Caregiver registered: ${testEmail}`);

        // Register a test Owner for search integration testing
        const ownerEmail = `test_owner_${Date.now()}@owner.com`;
        const ownerRegisterRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Owner Searcher',
                email: ownerEmail,
                password: 'Password@123',
                role: 'owner'
            })
        });
        const ownerData = await ownerRegisterRes.json();
        const ownerToken = ownerData.token;
        assert(ownerToken, 'Owner registered successfully');

        // 3. Check Initial Status (Must be 'Not Submitted')
        console.log('\n--- 2. Initial Status Verification ---');
        const initialStatusRes = await fetch(`${BASE_URL}/caregiver/verification/status`, {
            headers: { Authorization: `Bearer ${cgToken}` }
        });
        const initialStatus = await initialStatusRes.json();
        assert(
            initialStatus.verificationStatus === 'Not Submitted',
            `Newly registered caregiver starts with 'Not Submitted' (got '${initialStatus.verificationStatus}')`
        );

        // 4. Test Invalid Upload: Fake PDF (magic bytes check)
        console.log('\n--- 3. Upload Validation Security Tests ---');
        const invalidForm = new FormData();
        invalidForm.append('document', createInvalidPdfBlob(), 'fake_credentials.pdf');

        const fakeUploadRes = await fetch(`${BASE_URL}/caregiver/verification/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${cgToken}` },
            body: invalidForm
        });
        assert(fakeUploadRes.status === 400, 'Fake PDF (lacking %PDF- header) correctly rejected with 400');

        // 5. Test Invalid Upload: Non-PDF extension / MIME type
        const nonPdfForm = new FormData();
        nonPdfForm.append('document', new Blob(['hello text'], { type: 'text/plain' }), 'credentials.txt');

        const nonPdfRes = await fetch(`${BASE_URL}/caregiver/verification/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${cgToken}` },
            body: nonPdfForm
        });
        assert(nonPdfRes.status === 400, 'Non-PDF file (.txt) rejected with 400');

        // 6. Test Oversized PDF (> 5MB)
        const oversizedForm = new FormData();
        oversizedForm.append('document', createOversizedPdfBlob(), 'huge_document.pdf');

        const oversizedRes = await fetch(`${BASE_URL}/caregiver/verification/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${cgToken}` },
            body: oversizedForm
        });
        const oversizedData = await oversizedRes.json();
        assert(
            oversizedRes.status === 400 && oversizedData.message.includes('limit'),
            'Oversized file (> 5MB) rejected with 400 size limit error'
        );

        // 7. Test Valid PDF Upload
        console.log('\n--- 4. Valid PDF Upload & Pending State ---');
        const validForm = new FormData();
        validForm.append('document', createValidPdfBlob('Government ID and Certs'), 'combined_verification_proof.pdf');

        const validUploadRes = await fetch(`${BASE_URL}/caregiver/verification/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${cgToken}` },
            body: validForm
        });
        const validData = await validUploadRes.json();
        assert(validUploadRes.status === 200, 'Valid combined PDF uploaded successfully');
        assert(
            validData.profile.verificationStatus === 'Pending',
            'Verification status updated to Pending upon valid upload'
        );
        const profileId = validData.profile._id;

        // 8. Caregiver status check
        const cgStatusRes = await fetch(`${BASE_URL}/caregiver/verification/status`, {
            headers: { Authorization: `Bearer ${cgToken}` }
        });
        const cgStatusData = await cgStatusRes.json();
        assert(cgStatusData.verificationStatus === 'Pending', 'Status persists as Pending');
        assert(
            cgStatusData.verificationDocumentOriginalName === 'combined_verification_proof.pdf',
            'Original filename stored correctly'
        );

        // 9. Document access tests (Caregiver & Admin)
        console.log('\n--- 5. Document Streaming & Security Tests ---');
        const cgDocRes = await fetch(`${BASE_URL}/caregiver/verification/document`, {
            headers: { Authorization: `Bearer ${cgToken}` }
        });
        assert(cgDocRes.status === 200, 'Caregiver can access their own uploaded document');
        assert(cgDocRes.headers.get('content-type') === 'application/pdf', 'Correct application/pdf header returned');

        // Admin document access
        const adminDocRes = await fetch(`${BASE_URL}/admin/verifications/${profileId}/document`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        assert(adminDocRes.status === 200, 'Admin can securely view caregiver document');

        // Unauthorized access prevention (Owner trying to view caregiver's private document)
        const ownerBlockedRes = await fetch(`${BASE_URL}/admin/verifications/${profileId}/document`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        assert(ownerBlockedRes.status === 403, 'Unauthorized user (Owner role) blocked from viewing verification document (403)');

        // Unauthenticated access blocked
        const unauthBlockedRes = await fetch(`${BASE_URL}/admin/verifications/${profileId}/document`);
        assert(unauthBlockedRes.status === 401, 'Unauthenticated request blocked from document route (401)');

        // 10. Owner Search: Pending caregiver MUST NOT appear
        console.log('\n--- 6. Search Integration: Pending Caregiver Not Searchable ---');
        const searchBeforeRes = await fetch(`${BASE_URL}/caregiver/search`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        const searchBeforeData = await searchBeforeRes.json();
        const foundPending = searchBeforeData.some(c => c.user?._id === cgId);
        assert(!foundPending, 'Pending caregiver does NOT appear in Owner search results');

        // 11. Admin Decision: Request Changes (requires reason)
        console.log('\n--- 7. Admin Decision: Request Changes ---');
        const emptyChangesRes = await fetch(`${BASE_URL}/admin/verifications/${profileId}/request-changes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({ reason: '' })
        });
        assert(emptyChangesRes.status === 400, 'Request changes without reason rejected with 400');

        const changesRes = await fetch(`${BASE_URL}/admin/verifications/${profileId}/request-changes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({ reason: 'Please upload a clearer copy of government ID' })
        });
        const changesData = await changesRes.json();
        assert(
            changesData.profile.verificationStatus === 'Changes Requested',
            'Status updated to Changes Requested'
        );
        assert(
            changesData.profile.verificationNote === 'Please upload a clearer copy of government ID',
            'Correction instructions recorded correctly'
        );

        // 12. Caregiver Re-upload Replacement Document
        console.log('\n--- 8. Caregiver Document Replacement ---');
        const replacementForm = new FormData();
        replacementForm.append('document', createValidPdfBlob('Updated Clearer ID Copy'), 'updated_id_proof.pdf');

        const replaceRes = await fetch(`${BASE_URL}/caregiver/verification/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${cgToken}` },
            body: replacementForm
        });
        const replaceData = await replaceRes.json();
        assert(
            replaceData.profile.verificationStatus === 'Pending',
            'Re-upload resets status back to Pending'
        );
        assert(
            replaceData.profile.verificationNote === '',
            'Re-upload clears previous decision note'
        );

        // 13. Admin Decision: Reject (requires reason)
        console.log('\n--- 9. Admin Decision: Rejection ---');
        const emptyRejectRes = await fetch(`${BASE_URL}/admin/verifications/${profileId}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({ reason: '' })
        });
        assert(emptyRejectRes.status === 400, 'Rejection without reason rejected with 400');

        const rejectRes = await fetch(`${BASE_URL}/admin/verifications/${profileId}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({ reason: 'Expired identification document' })
        });
        const rejectData = await rejectRes.json();
        assert(rejectData.profile.verificationStatus === 'Rejected', 'Status updated to Rejected');
        assert(
            rejectData.profile.verificationNote === 'Expired identification document',
            'Rejection reason recorded'
        );

        // Rejected caregiver must NOT appear in search
        const searchRejectedRes = await fetch(`${BASE_URL}/caregiver/search`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        const searchRejectedData = await searchRejectedRes.json();
        const foundRejected = searchRejectedData.some(c => c.user?._id === cgId);
        assert(!foundRejected, 'Rejected caregiver does NOT appear in Owner search results');

        // 14. Admin Decision: Manual Approval
        console.log('\n--- 10. Admin Decision: Approval & Search Integration ---');
        const approveRes = await fetch(`${BASE_URL}/admin/verifications/${profileId}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({ note: 'All documents verified according to PetCare Connect review process' })
        });
        const approveData = await approveRes.json();
        assert(approveData.profile.verificationStatus === 'Approved', 'Status updated to Approved');
        assert(approveData.profile.verifiedAt !== null, 'verifiedAt timestamp recorded');
        assert(approveData.profile.verifiedBy !== null, 'verifiedBy Admin ID recorded');

        // 15. Owner Search: Approved caregiver MUST appear!
        const searchApprovedRes = await fetch(`${BASE_URL}/caregiver/search`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        const searchApprovedData = await searchApprovedRes.json();
        const foundApproved = searchApprovedData.some(c => c.user?._id === cgId);
        assert(foundApproved, 'Approved caregiver appears in Owner search results');

        // 16. Existing Module Check: Pet & Booking APIs still work
        console.log('\n--- 11. Existing Modules Compatibility ---');
        const petsRes = await fetch(`${BASE_URL}/pets`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        const petsData = await petsRes.json();
        assert(Array.isArray(petsData), 'Owner pets API functions normally');

        const bookingsRes = await fetch(`${BASE_URL}/bookings/owner`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        const bookingsData = await bookingsRes.json();
        assert(Array.isArray(bookingsData), 'Owner bookings API functions normally');

        const adminStatsRes = await fetch(`${BASE_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const adminStatsData = await adminStatsRes.json();
        assert(typeof adminStatsData.pendingVerifications === 'number', 'Admin dashboard stats API works normally');

        console.log(`\n========================================`);
        console.log(`🎯 Test Summary: ${passed} Passed, ${failed} Failed`);
        console.log(`========================================\n`);

        process.exit(failed > 0 ? 1 : 0);
    } catch (error) {
        console.error('Unexpected test error:', error);
        process.exit(1);
    }
}

runTests();
