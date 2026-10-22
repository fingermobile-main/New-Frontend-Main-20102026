import React, {} from 'react';
import LegalLayout from '../../components/layout/LegalLayout';
import { DocumentIcon } from '../../components/icons';
import { useAppContext } from '../../contexts/AppContext';  // Using absolute path from src
import LegalDocumentBanner from '../../components/legal/LegalDocumentBanner';

const TermsOfServicePage = () => {
  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children
  }) => (
    <section className="mb-8">
      <h3 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-2 mb-4">
        {title}
      </h3>
      <div className="text-slate-700 font-medium text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  );

  return (
    <LegalLayout>
      <div className="bg-white rounded-3xl shadow-sm p-6 lg:p-10 border border-slate-300">
        <LegalDocumentBanner
          slug="terms-of-service"
          defaultTitle="FingerMobile Terms of Service"
          defaultVersion="2.1.0"
          defaultEffectiveDate="October 31, 2025"
        />

        <div className="flex items-center gap-4 mb-6">
          <DocumentIcon className="w-10 h-10 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Terms of Service
            </h1>
            <p className="text-slate-700 font-medium text-sm mt-1">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>

        <div>
          <Section title="Acceptance of Terms">
            <p>
              By accessing or using the FingerMobile platform and services, you
              agree to be bound by these Terms of Service and all applicable
              laws and regulations. If you do not agree with any of these terms,
              you are prohibited from using or accessing this site.
            </p>
          </Section>

          <Section title="Description of Service">
            <p>
              FingerMobile provides a social media platform that enables members
              to create, share, and monetize content, connect with others, and
              participate in various digital experiences. The services include
              but are not limited to content creation tools, social networking
              features, marketplace functionalities, and communication tools.
            </p>
          </Section>

          <Section title="Member Responsibilities">
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                You are responsible for maintaining the confidentiality of your
                account and password
              </li>
              <li>
                You agree to accept responsibility for all activities that occur
                under your account
              </li>
              <li>
                You must not use the service for any illegal or unauthorized
                purpose
              </li>
              <li>
                You agree not to reproduce, duplicate, copy, sell, resell, or
                exploit any portion of the service
              </li>
              <li>
                You are responsible for the content you post and must ensure it
                complies with our Community Guidelines
              </li>
            </ul>
          </Section>

          <Section title="Intellectual Property">
            <p>
              The service and its original content, features, and functionality
              are and will remain the exclusive property of FingerMobile and its
              licensors. The service is protected by copyright, trademark, and
              other laws of both the United States and foreign countries.
            </p>
          </Section>

          <Section title="Content Ownership">
            <p>
              You retain ownership of any intellectual property rights that you
              hold in content you submit to the service. By submitting, posting,
              or displaying content on or through the service, you grant
              FingerMobile a worldwide, non-exclusive, royalty-free license to
              use, copy, reproduce, process, adapt, modify, publish, transmit,
              display, and distribute such content in any and all media or
              distribution methods.
            </p>
          </Section>

          <Section title="Termination">
            <p>
              We may terminate or suspend access to our service immediately,
              without prior notice or liability, for any reason whatsoever,
              including without limitation if you breach the Terms. All
              provisions of the Terms which by their nature should survive
              termination shall survive termination, including, without
              limitation, ownership provisions, warranty disclaimers, indemnity,
              and limitations of liability.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              In no event shall FingerMobile, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the service.
            </p>
          </Section>

          <Section title="Governing Law">
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of the United States, without regard to its conflict of law
              provisions. Our failure to enforce any right or provision of these
              Terms will not be considered a waiver of those rights.
            </p>
          </Section>

          <Section title="Changes to Terms">
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days' notice prior to any new terms taking
              effect.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-3 p-5 bg-slate-50 rounded-2xl border border-slate-300 space-y-1">
              <p className="font-bold text-slate-900">FingerMobile Protocol™ Legal Department</p>
              <p className="text-slate-700 font-medium text-xs">Email: <span className="font-bold text-blue-700">info@fingermobileprotocol.com</span> / fingermobileprotocol@gmail.com</p>
              <p className="text-slate-700 font-medium text-xs">Official Website: <a href="https://fingermobileprotocol.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-semibold">https://fingermobileprotocol.com</a></p>
            </div>
          </Section>

          <div className="mt-8 pt-6 border-t border-slate-200 text-xs font-semibold text-slate-600">
            <p>Last Updated: December 20, 2025</p>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
};

export default TermsOfServicePage;
