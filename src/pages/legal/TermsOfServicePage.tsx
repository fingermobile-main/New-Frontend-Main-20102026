import React, {} from 'react';
import LegalLayout from '../../components/layout/LegalLayout';
import { DocumentIcon } from '../../components/icons';
import MarkdownViewer from '../../components/common/MarkdownViewer';

const TermsOfServicePage: React.FC = () => {

  return (
    <LegalLayout>
      <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <DocumentIcon className="w-10 h-10 text-brand-blue" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Terms of Service
            </h1>
            <p className="text-gray-600">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>

        <div className="prose max-w-none">
          <MarkdownViewer filePath="/legal/02_Terms_of_Service.md" />
        </div>
      </div>
    </LegalLayout>
  );
};

export default TermsOfServicePage;
