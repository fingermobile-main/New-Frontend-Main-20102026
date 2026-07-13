import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from "../contexts/AppContext";
import MainLayout from '../components/layout/MainLayout';
import { 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  UserCircleIcon, 
  ClockIcon,
  ArrowRightIcon
} from '../icons';

const TermsOfServicePage: React.FC = () => {
  const { ficBalance } = useAppContext();

  return (
    <MainLayout pageTitle="Terms of Service">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <DocumentTextIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-600">Important legal information about using our platform</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="font-bold text-blue-900">Important Notice</h2>
                  <p className="text-blue-800 text-sm">
                    Please read these terms carefully before using the FingerMobile Protocol platform. 
                    By accessing and using our services, you agree to be bound by these terms.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                  Agreement to Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using the FingerMobile Protocol platform, you agree to be bound by these Terms of Service. If you disagree with 
                  any part of these terms, you may not access our platform.
                </p>
                <p className="text-gray-700">
                  Your access to and use of the service is conditioned on your acceptance of and compliance with these Terms. 
                  These Terms apply to all visitors, users, and others who access or use the service.
                </p>
              </section>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                  Communications
                </h2>
                <p className="text-gray-700 mb-4">
                  By creating an account, you agree to receive certain communications in connection with the service. 
                  You may opt-out of receiving some communications by updating your account settings.
                </p>
                <p className="text-gray-700">
                  We may send you service-related emails, including account verification, password reset, and administrative 
                  messages that are essential to your use of our platform.
                </p>
              </section>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                  Content Ownership and Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  Our platform allows you to upload, submit, store, send, or receive content. You retain ownership of any 
                  intellectual property rights you hold in that content.
                </p>
                <p className="text-gray-700">
                  When you share content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, 
                  distribute, display, and perform such content for the purpose of providing our service. However, you maintain 
                  ownership of your content and can remove it at any time subject to these Terms.
                </p>
              </section>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">4</span>
                  Prohibited Uses
                </h2>
                <p className="text-gray-700 mb-4">
                  You may use our platform only for lawful purposes and in accordance with these Terms. You agree not to use 
                  the platform:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>In any way that violates any applicable national or international law or regulation</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material</li>
                  <li>To impersonate or attempt to impersonate the company or other users</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use of the platform</li>
                  <li>To distribute viruses or other harmful computer software</li>
                  <li>To harvest or collect user data for spam or illegal purposes</li>
                </ul>
              </section>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">5</span>
                  Termination
                </h2>
                <p className="text-gray-700">
                  We may terminate or suspend your account immediately, without prior notice, for any reason whatsoever, 
                  including without limitation if you breach the Terms. Upon termination, your right to use the service 
                  will cease immediately. All provisions of this agreement which by their nature should survive termination 
                  shall survive termination, including ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                </p>
              </section>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">6</span>
                  FIC Token and Financial Transactions
                </h2>
                <p className="text-gray-700 mb-4">
                  The FingerMobile platform uses its native token, FIC, for various transactions including gifting, 
                  paylinks, content purchases, and premium features. All financial transactions involving FIC tokens 
                  are final and non-refundable unless otherwise stated in our refund policy.
                </p>
                <p className="text-gray-700">
                  You acknowledge that FIC token values may fluctuate and that you bear the risk of any changes in value. 
                  We are not responsible for any losses resulting from token value fluctuations.
                </p>
              </section>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">7</span>
                  Changes to Terms
                </h2>
                <p className="text-gray-700">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes 
                  through the platform or via email. Continued use of the platform after changes constitute acceptance 
                  of the updated Terms.
                </p>
              </section>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                  <UserCircleIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Your current FIC balance</p>
                  <p className="font-bold text-lg text-gray-900">{ficBalance.toFixed(2)} FIC</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center justify-center"
                >
                  Back to Home
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
                
                <Link 
                  to="/privacy-policy"
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfServicePage;