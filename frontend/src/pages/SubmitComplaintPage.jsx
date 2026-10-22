import React from 'react';
import UserComplaints from './UserComplaints';

const SubmitComplaintPage = ({ role = 'owner' }) => {
    return <UserComplaints role={role} defaultTab="submit" />;
};

export default SubmitComplaintPage;
