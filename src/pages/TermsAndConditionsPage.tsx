import { Link } from 'react-router-dom';
import React, {} from 'react';


const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Terms and Conditions</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Welcome to our platform. These terms and conditions outline the rules and regulations for the use of our services.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                By accessing this website, we assume you accept these terms and conditions. Do not continue to use our platform 
                if you do not agree to all of the terms stated here.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Intellectual Property</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Unless otherwise stated, we own the intellectual property rights for all material on our platform. 
                All intellectual property rights are reserved.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                You are granted a limited license to view and/or copy content for personal use only.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. User Responsibilities</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You warrant that you are capable of entering into binding contracts and that you are over the age of 13.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                You are responsible for maintaining the security of your account and content. We cannot and will not be 
                liable for any loss or damage from your failure to comply with this security obligation.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Limitations of Liability</h2>
              <p className="text-gray-700 dark:text-gray-300">
                In no event shall we be liable for any consequential, incidental, indirect, or special damages arising 
                out of or in connection with your use of the platform, even if we have been advised of the possibility 
                of such damages.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Governing Law</h2>
              <p className="text-gray-700 dark:text-gray-300">
                These terms shall be governed by the laws of your jurisdiction. If any provision is found invalid by a 
                court of competent jurisdiction, the invalidity of such provision shall not affect the validity of the 
                remaining provisions.
              </p>
            </section>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Link 
          to="/"
          className="inline-block px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;