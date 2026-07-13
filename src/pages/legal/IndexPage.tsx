import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import LegalLayout from '../../components/layout/LegalLayout';
import { Link } from 'react-router-dom';
import { PolicyIcon, DocumentIcon, MembersIcon } from '../../components/icons';

const LegalIndexPage: React.FC = () => {
  const legalDocuments = [
    {
      icon: <PolicyIcon className="w-8 h-8 text-blue-600" />,
      title: 'Privacy Policy',
      description: 'Learn how we collect, use, and protect your personal information.',
      link: '/legal/privacy-policy'
    },
    {
      icon: <DocumentIcon className="w-8 h-8 text-green-600" />,
      title: 'Terms of Service',
      description: 'Understand the terms and conditions that govern your use of our services.',
      link: '/legal/terms-of-service'
    },
    {
      icon: <MembersIcon className="w-8 h-8 text-purple-600" />,
      title: 'Community Guidelines',
      description: 'Discover the rules and principles that help maintain a respectful community.',
      link: '/legal/community-guidelines'
    }
  ];

  return (
    <LegalLayout>
      <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Legal Center</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Welcome to our Legal Center. Here you'll find important information about your rights and responsibilities 
            when using FingerMobile services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {legalDocuments.map((doc, index) => (
            <Link 
              key={index} 
              to={doc.link}
              className="block group border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {doc.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-gray-600">
                  {doc.description}
                </p>
                <div className="mt-4 text-blue-600 font-medium text-sm">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Our Legal Team</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              If you have any questions about our legal policies or need assistance with a legal matter, 
              please contact our legal team:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">legal@fingermobile.com</p>
              </div>
              <div>
                <p className="font-medium">Mailing Address</p>
                <p className="text-gray-600">
                  FingerMobile Legal Department<br />
                  123 Innovation Street<br />
                  Tech City, TC 10001
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
};

export default LegalIndexPage;
