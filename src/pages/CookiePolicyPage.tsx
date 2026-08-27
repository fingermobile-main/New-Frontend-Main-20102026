import { Link} from 'react-router-dom';
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import MarkdownViewer from '../components/common/MarkdownViewer';

const CookiePolicyPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            FingerMobile Cookie Policy
          </h1>
          <p className="text-gray-600 mb-8">Effective Date: [DATE FROM MD]</p>

          <div className="prose max-w-none">
            <MarkdownViewer filePath="/legal/04_Cookie_Policy.md" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CookiePolicyPage;