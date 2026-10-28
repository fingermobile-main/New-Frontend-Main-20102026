import React, {} from 'react';
import LegalLayout from '../../components/layout/LegalLayout';
import { PolicyIcon } from '../../components/icons';
import { useAppContext } from '../../contexts/AppContext';  // Using absolute path from src
import LegalDocumentBanner from '../../components/legal/LegalDocumentBanner';

const PrivacyPolicyPage = () => {
  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children
  }) => (
    <section className="mb-8">
      <h3 className="text-xl font-black text-slate-900 border-b border-slate-300 pb-2 mb-4">
        {title}
      </h3>
      <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">{children}</div>
    </section>
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      <LegalLayout>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-300 p-6 lg:p-10">
        <LegalDocumentBanner
          slug="privacy-policy"
          defaultTitle="FingerMobile Privacy Policy"
          defaultVersion="2.1.0"
          defaultEffectiveDate="October 31, 2025"
        />

        <div className="flex items-center gap-4 mb-6">
          <PolicyIcon className="w-10 h-10 text-brand-blue" />
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-700 font-medium">Your privacy is important to us.</p>
          </div>
        </div>

        <div className="prose max-w-none">
          <Section title="Privacy">
            <p>
              Our overriding objective is to handle all data fairly and
              securely. Any information you give us about yourself will be
              stored on our systems and may be disclosed to, processed and used
              by us, and the other companies that assist us in providing our
              services in accordance with our Privacy Policy.
            </p>
          </Section>

          <Section title="Information Collection">
            <p>
              We collect various types of information in connection with the
              services we provide, including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Personal identification information (Name, email address, phone
                number, etc.)
              </li>
              <li>
                Non-personal identification information (browser name, type of
                computer, technical information, etc.)
              </li>
              <li>Cookies and tracking technologies</li>
              <li>Financial information for transactions</li>
              <li>Content you upload or share on our platform</li>
            </ul>
          </Section>

          <Section title="Data Protection">
            <p>
              We adopt appropriate data collection, storage, and processing
              practices and security measures to protect against unauthorized
              access, alteration, disclosure, or destruction of your personal
              information, membername, password, transaction information, and
              data stored on our site.
            </p>
            <p>
            THIS FINGERMOBILE PROTOCOL PLATFORM, WEBSITE, MOBILE APPLICATION, SERVICES AND FEATURES,
            ARE ALL PROVIDED ON AN *AS IS*, “HOW IS”, “WHERE IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS
            OF ANY KIND OR VARIATION HOWSOEVER, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
            ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY OR NON-INFRINGEMENT.
            </p>
            <p>
              Sensitive and private data exchange between the site and its
              members happens over a SSL secured communication channel and is
              encrypted and protected with digital signatures.
            </p>
          </Section>

          <Section title="Data Retention">
            <p>
              We will retain your information for as long as your account is
              active or as needed to provide you services. We will retain and
              use your information as necessary to comply with our legal
              obligations, resolve disputes, and enforce our agreements.
            </p>
          </Section>

          <Section title="Data Sharing">
            <p>
              We do not sell, trade, or rent members' personal identification
              information to others. We may share generic aggregated demographic
              information not linked to any personal identification information
              regarding visitors and members with our business partners, trusted
              affiliates, and advertisers for the purposes outlined above.
            </p>
          </Section>

          <Section title="Third Party Websites">
            <p>
              Members may find advertising or other content on our site that
              links to the sites and services of our partners, suppliers,
              advertisers, sponsors, licensors, and other third parties. We do
              not control the content or links that appear on these sites and
              are not responsible for the practices employed by websites linked
              to or from our site.
            </p>
          </Section>

          <Section title="Compliance">
            <p>
              We comply with applicable data protection laws in the
              jurisdictions where we operate, including the General Data
              Protection Regulation (GDPR) for EU residents and the California
              Consumer Privacy Act (CCPA) for California residents.
            </p>
          </Section>

          <Section title="Your Rights">
            <p>
              You have the right to access, update, or delete your personal
              information. You may also have the right to data portability and
              the right to object to certain processing activities. To exercise
              these rights, please contact us using the information below.
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              We reserve the right to update this privacy policy at any time.
              When we do, we will revise the updated date at the bottom of this
              page. We encourage members to frequently check this page for any
              changes to stay informed about how we are helping to protect the
              personal information we collect.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              If you have any questions about this Privacy Policy, the practices
              of this site, or your dealings with this site, please contact us
              at:
            </p>
            <div className="mt-3 p-5 bg-slate-50 rounded-2xl border border-slate-300 space-y-1 text-slate-800">
              <p className="font-bold text-slate-900">FingerMobile Protocol™ Data Protection &amp; Legal</p>
              <p className="text-slate-700 font-medium text-xs">Email: <span className="font-bold text-blue-700">info@fingermobileprotocol.com</span> / fingermobileprotocol@gmail.com</p>
              <p className="text-slate-700 font-medium text-xs">Official Website: <a href="https://fingermobileprotocol.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-semibold">https://fingermobileprotocol.com</a></p>
            </div>
          </Section>

          <div className="mt-8 pt-6 border-t border-slate-300 text-sm text-slate-700 font-medium">
            <p>Last Updated: December 20, 2025</p>
          </div>
        </div>
      </div>
    </LegalLayout>

    {/* Sovereign Mobile Navigation Quick Dock */}
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
      <a
        href="/legal"
        aria-label="Legal Center"
        className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
      >
        <span className="text-base">⚖️</span>
        <span>Legal</span>
      </a>
      <a
        href="/contact-us"
        aria-label="Privacy Officer"
        className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
      >
        <span className="text-base">🛡️</span>
        <span>DPO</span>
      </a>
      <button
        onClick={() => window.location.reload()}
        aria-label="Reload Privacy"
        className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
      >
        <span className="text-base">🔄</span>
        <span>Sync</span>
      </button>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to Top"
        className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
      >
        <span className="text-base">⬆️</span>
        <span>Top</span>
      </button>
    </div>
  </div>
  );
};

export default PrivacyPolicyPage;
