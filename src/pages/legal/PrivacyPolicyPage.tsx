import React, {} from 'react';
import LegalLayout from '../../components/layout/LegalLayout';
import { PolicyIcon } from '../../components/icons';
import MarkdownViewer from '../../components/common/MarkdownViewer';

const PrivacyPolicyPage: React.FC = () => {

  return (
    <LegalLayout>
      <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <PolicyIcon className="w-10 h-10 text-brand-blue" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600">Your privacy is important to us.</p>
          </div>
        </div>

        <div className="prose max-w-none">
          <MarkdownViewer filePath="/legal/01_Privacy_Policy.md" />
        </div>
      </div>
    </LegalLayout>
  );
};

export default PrivacyPolicyPage;
