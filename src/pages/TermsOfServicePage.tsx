import { Link } from 'react-router-dom';
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import MarkdownViewer from '../components/common/MarkdownViewer';

const TermsOfServicePage: React.FC = () => {
  return (
    <MainLayout pageTitle="Terms of Service">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-600">Important legal information about using our platform</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="prose prose-gray max-w-none">
              <MarkdownViewer filePath="/legal/02_Terms_of_Service.md" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfServicePage;