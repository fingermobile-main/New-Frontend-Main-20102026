import React, {  useEffect  } from 'react';
import { useOrganizeThese } from '../contexts/OrganizeTheseContext';
import MainLayout from '../components/layout/MainLayout';
import OrganizationVisualization from '../components/organize-these/OrganizationVisualization';
import AnalyticsDashboard from '../components/organize-these/AnalyticsDashboard';

const OrganizeThesePage: React.FC = () => {
  const { 
    organizedData, 
    isOrganizing, 
    organizationStats,
    organizeMemberData,
    exportData
  } = useOrganizeThese();

  useEffect(() => {
    // Automatically organize data when page loads
    if (!organizedData) {
      organizeMemberData();
    }
  }, [organizedData, organizeMemberData]);

  const handleOrganizeClick = () => {
    organizeMemberData();
  };

  const handleExportPDF = () => {
    exportData('pdf');
  };

  const handleExportCSV = () => {
    exportData('csv');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organize These</h1>
            <p className="text-gray-600 mt-2">
              AI-powered organization of your content, connections, and data
            </p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              disabled={!organizedData || isOrganizing}
             aria-label="Button"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export PDF
            </button>
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              disabled={!organizedData || isOrganizing}
             aria-label="Button"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {organizationStats && (
          <AnalyticsDashboard stats={organizationStats} />
        )}

        {isOrganizing ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Organizing your data with AI</h3>
              <p className="text-gray-600">Analyzing content, connections, and behavioral patterns...</p>
              <div className="mt-4 w-64 bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">75% complete</p>
            </div>
          </div>
        ) : (
          <OrganizationVisualization 
            organizedData={organizedData} 
            onReorganize={handleOrganizeClick} 
          />
        )}
      </div>
    </MainLayout>
  );
};

export default OrganizeThesePage;
