import { Link } from 'react-router-dom';
import React, {} from 'react';


import { useAppContext } from '../../contexts/AppContext';

const LegalCompliancePage: React.FC = () => {
  const { showToast } = useAppContext();
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Legal Compliance</h1>
        <p className="text-gray-600">Overview of legal compliance measures and documentation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            Our comprehensive privacy policy outlines how we collect, use, and protect member data.
          </p>
          <Link 
            to="/privacy-policy" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View Privacy Policy
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms and Conditions</h2>
          <p className="text-gray-700 mb-4">
            Our terms of service govern the use of our platform and services.
          </p>
          <Link 
            to="/terms-and-conditions" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View Terms and Conditions
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookie Policy</h2>
          <p className="text-gray-700 mb-4">
            Information about how we use cookies and similar technologies.
          </p>
          <Link 
            to="/cookies" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View Cookie Policy
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Guidelines</h2>
          <p className="text-gray-700 mb-4">
            Rules and expectations for community members to ensure a positive environment.
          </p>
          <Link 
            to="/guidelines" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View Community Guidelines
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance Summary</h2>
        <div className="prose max-w-none text-gray-700">
          <p>
            FingerMobile is committed to maintaining the highest standards of legal compliance 
            and data protection. Our policies are designed to meet or exceed requirements of 
            major privacy regulations including:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>General Data Protection Regulation (GDPR)</li>
            <li>California Consumer Privacy Act (CCPA)</li>
            <li>Other applicable international privacy laws</li>
          </ul>
          <p className="mt-4">
            We regularly review and update our policies to ensure continued compliance with 
            evolving legal requirements. All team members receive regular training on privacy 
            and compliance matters.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Subject Rights</h2>
        <div className="prose max-w-none text-gray-700">
          <p>Members have the following rights regarding their personal data:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Right to access personal data</li>
            <li>Right to rectify inaccurate data</li>
            <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Rights related to automated decision making</li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, members can contact our Data Protection Officer at:
          </p>
          <p className="font-medium mt-2">privacy@fingermobile.com</p>
        </div>
      </div>
    </div>
  );
};

export default LegalCompliancePage;