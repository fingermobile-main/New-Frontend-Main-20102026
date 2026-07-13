import React from 'react';
import { Navigate } from 'react-router-dom';

// This appears to be a duplicate or legacy route for Site Menus.
// Redirecting to the correct location to avoid confusion.
const SitePagesMenusPage: React.FC = () => {
    return <Navigate to="/dashboard/site/menus" replace />;
};

export default SitePagesMenusPage;

