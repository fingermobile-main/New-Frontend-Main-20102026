import { Link } from 'react-router-dom';
import React, {} from 'react';
import LegalDocumentBanner from '../components/legal/LegalDocumentBanner';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-300">
        <div className="p-6 sm:p-10">
          <LegalDocumentBanner
            slug="terms-of-service"
            defaultTitle="FingerMobile Terms & Conditions"
            defaultVersion="2.1.0"
            defaultEffectiveDate="October 31, 2025"
          />
          <h1 className="text-3xl font-black text-slate-900 mb-6">Terms and Conditions</h1>

          <div className="space-y-8">
            <section className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
              <p className="text-slate-700 font-medium leading-relaxed mb-4">
                Welcome to FingerMobile Protocol. These terms and conditions outline the rules and regulations for the use of our services, sovereign communication channels, and decentralized media frameworks.
              </p>
              <p className="text-slate-700 font-medium leading-relaxed">
                By accessing this platform, we assume you accept these terms and conditions in full. Do not continue to use our platform if you do not agree to all of the terms and conditions stated on this page.
              </p>
            </section>

            <section className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Intellectual Property & Digital Rights</h2>
              <p className="text-slate-700 font-medium leading-relaxed mb-4">
                Unless otherwise stated, FingerMobile Protocol and/or its licensors own the intellectual property rights for all proprietary platform protocols, user interface assets, and system telemetry. All intellectual property rights are reserved.
              </p>
              <p className="text-slate-700 font-medium leading-relaxed">
                Creators retain complete provenance and cryptographic ownership of user-generated content, media streams, and storefront digital assets uploaded across our verified nodes.
              </p>
            </section>

            <section className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. User Responsibilities & Sovereign Conduct</h2>
              <p className="text-slate-700 font-medium leading-relaxed mb-4">
                You warrant that you are legally capable of entering into binding contracts and that you comply with all local and international regulatory frameworks applicable to your account.
              </p>
              <p className="text-slate-700 font-medium leading-relaxed">
                You are responsible for maintaining the security of your cryptographic keys, wallet credentials, and biometrics. FingerMobile Protocol cannot and will not be liable for losses resulting from user-side credential exposure.
              </p>
            </section>

            <section className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Limitations of Liability</h2>
              <p className="text-slate-700 font-medium leading-relaxed">
                In no event shall FingerMobile Protocol, its node operators, or contributors be liable for any consequential, indirect, special, or exemplary damages resulting from network connectivity delays, gas fluctuations, or unauthorized device access.
              </p>
            </section>

            <section className="pb-4">
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Governing Law & Dispute Resolution</h2>
              <p className="text-slate-700 font-medium leading-relaxed">
                These terms shall be governed by and interpreted in accordance with the laws and arbitration statutes of the designated sovereign jurisdiction, with priority given to neutral decentralized dispute resolution panels where specified.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-slate-600 font-semibold text-xs">
              Last updated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
