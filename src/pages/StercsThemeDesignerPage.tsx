import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import StercsThemeDesigner from '../components/dashboard/StercsThemeDesigner';

const StercsThemeDesignerPage: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const { showToast } = useAppContext();
  return (
    <div className="h-screen flex flex-col">
      <StercsThemeDesigner />
    </div>
  );
};

export default StercsThemeDesignerPage;
