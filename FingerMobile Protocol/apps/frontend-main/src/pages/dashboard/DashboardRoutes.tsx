import { Routes, Route } from 'react-router-dom';
import React, {} from 'react';

import LegalCompliancePage from './LegalCompliancePage';

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/legal-compliance" element={<LegalCompliancePage />} />
    </Routes>
  );
};

export default DashboardRoutes;
