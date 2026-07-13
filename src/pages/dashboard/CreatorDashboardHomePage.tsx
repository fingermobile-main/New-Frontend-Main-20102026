import React from 'react';
import { Navigate } from "react-router-dom";

const CreatorDashboardHomePage: React.FC = () => {
  // For this application structure, the Business Hub serves as the main dashboard for all roles.
  // We can redirect creators there directly.
  return <Navigate to="/dashboard/hub" replace />;
};

export default CreatorDashboardHomePage;
