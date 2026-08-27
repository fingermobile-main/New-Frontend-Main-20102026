import React, {} from 'react';
import MainLayout from '../components/layout/MainLayout';  // Removed .tsx extension
import MarkdownViewer from '../components/common/MarkdownViewer';

const CommunityGuidelinesPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Community Guidelines</h1>
        
        <div className="prose max-w-none">
          <MarkdownViewer filePath="/legal/03_Community_Guidelines.md" />
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunityGuidelinesPage;
