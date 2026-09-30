import { Link } from 'react-router-dom';
import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';

import {
  ShieldCheckIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ClockIcon,
  ArrowRightIcon
} from '../icons';
import LegalDocumentBanner from '../components/legal/LegalDocumentBanner';

const PrivacyPolicyPage: React.FC = () => {
  const { ficBalance } = useAppContext();

  return (
    <MainLayout pageTitle="Privacy Policy">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600">How we collect, use, and protect your information</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-bold text-blue-900">Your Privacy Matters</h2>
                <p className="text-blue-800 text-sm">
                  We are committed to protecting your personal information and maintaining your trust.
                  This policy explains how we handle your data when you use our services.
                </p>
              </div>
            </div>
          </div>

          <LegalDocumentBanner
            slug="privacy-policy"
            defaultTitle="FingerMobile Privacy Policy"
            defaultVersion="2.1.0"
            defaultEffectiveDate="October 31, 2025"
          />

          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">FingerMobile Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Protecting Your Personal Information</p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                FingerMobile.com values your privacy and is committed to protecting your personal information.
                This Privacy Policy explains how FingerMobile.com Ltd. and its affiliated companies worldwide
                ("FingerMobile", "we", "our", or "us") collect, use, and share your Personal Information when
                you access or use our services.
              </p>
              <p className="text-gray-700">
                This Privacy Policy applies to all FingerMobile members, including unregistered visitors,
                registered members, and premium members (collectively, Members", "you", or "your"), and to all
                FingerMobile services, including our websites (including www.FingerMobile.com and any of its
                subdomains, the "Website"), web applications ("FingerMobile Apps"), mobile applications
                ("Mobile Apps"), and related services (collectively, the "Services").
              </p>
              <p className="text-gray-700">
                By accessing or using any of our Services, you acknowledge that you have read, understood,
                and agree to this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                Information We Collect
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">2.1</span>
                Personal Information You Provide
              </h3>
              <p className="text-gray-700 mb-4">
                When you register for our Services, sign up for events, subscribe to our newsletters,
                purchase services, or contact us directly, you may provide:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Payment information</li>
                <li>Communications with us and other members</li>
                <li>Identification documents (e.g., ID card, driver's license, passport)</li>
                <li>Profile information (membername, bio, profile picture)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">2.2</span>
                Information We Collect Automatically
              </h3>
              <p className="text-gray-700 mb-4">
                When you visit, download, or use our Services, we may automatically collect:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Browsing and 'click-stream' activity</li>
                <li>Session heatmaps and scrolls</li>
                <li>Device information (operating system, internet browser, screen resolution)</li>
                <li>Language and keyboard settings</li>
                <li>Internet service provider</li>
                <li>Referring/exit pages</li>
                <li>Date/time stamps</li>
                <li>IP address</li>
                <li>Location data (with your consent)</li>
                <li>Usage data related to your interactions with our platform</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">2.3</span>
                Information from Other Sources
              </h3>
              <p className="text-gray-700">
                We may receive information about you from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Security and fraud detection providers</li>
                <li>Social media platforms (when you log in using your social account)</li>
                <li>Lead enhancement companies</li>
                <li>Advertising and marketing partners</li>
                <li>Third-party services integrated with our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide, maintain, and improve our Services</li>
                <li>Communicate with you</li>
                <li>Process transactions</li>
                <li>Personalize your experience</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Detect and prevent fraud</li>
                <li>Comply with legal obligations</li>
                <li>Analyze usage patterns and trends</li>
                <li>Develop new features and services</li>
                <li>Enable FIC token transactions and wallet functionalities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">4</span>
                Information Sharing and Disclosure
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">4.1</span>
                Service Providers
              </h3>
              <p className="text-gray-700 mb-4">
                Third-party vendors who help us operate our business, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Payment processors</li>
                <li>Cloud storage providers</li>
                <li>Analytics services</li>
                <li>Marketing platforms</li>
                <li>Customer support services</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">4.2</span>
                Legal Requirements
              </h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>To comply with legal obligations</li>
                <li>To respond to legal requests</li>
                <li>To protect our rights and property</li>
                <li>To prevent harm to others</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">4.3</span>
                Business Transfers
              </h3>
              <p className="text-gray-700">
                In connection with a merger, acquisition, or sale of assets.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">5</span>
                Your Rights and Choices
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">5.1</span>
                Access and Correction
              </h3>
              <p className="text-gray-700 mb-4">
                You have the right to access and correct your personal information.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">5.2</span>
                Data Portability
              </h3>
              <p className="text-gray-700 mb-4">
                You may request a copy of your data in a structured, machine-readable format.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">5.3</span>
                Deletion
              </h3>
              <p className="text-gray-700 mb-4">
                You may request deletion of your personal information, subject to certain exceptions.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">5.4</span>
                Objection
              </h3>
              <p className="text-gray-700 mb-4">
                You may object to the processing of your personal information.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">5.5</span>
                Withdrawal of Consent
              </h3>
              <p className="text-gray-700 mb-4">
                You may withdraw your consent to our processing of your information.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-50 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">5.6</span>
                Opt-Out of Marketing
              </h3>
              <p className="text-gray-700">
                You may opt-out of marketing communications at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">6</span>
                Data Retention
              </h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to provide our Services
                and comply with legal obligations. When we no longer need your information, we will
                securely delete it. For FIC wallet transactions, we may retain financial records as
                required by applicable financial regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">7</span>
                Data Security
              </h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures to protect your
                personal information from unauthorized access, use, or disclosure. This includes
                end-to-end encryption for messages, secure storage of FIC wallet keys, and
                industry-standard security protocols.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">8</span>
                International Data Transfers
              </h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your own.
                We ensure appropriate safeguards are in place for such transfers, including adherence
                to GDPR and other applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">9</span>
                Children's Privacy
              </h2>
              <p className="text-gray-700">
                Our Services are not intended for children under 16. We do not knowingly collect
                information from children under 16. If you believe we have collected information
                from a child under 16, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">10</span>
                Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any significant
                changes by posting the new policy on our Website and updating the effective date. We
                encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">11</span>
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700 font-medium">
                privacy@fingermobile.com
              </p>
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-gray-700">
                  <strong>FingerMobile Protocol and our services are provided "As Is" and "Where Is" without warranties of any kind.</strong>
                </p>
              </div>
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
                to="/terms-of-service"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center justify-center"
              >
                Terms of Service
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>

              <Link
                to="/support"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
