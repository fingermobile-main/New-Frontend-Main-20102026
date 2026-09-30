import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '../icons';
import LegalDocumentBanner from '../components/legal/LegalDocumentBanner';

const CSAEPolicyPage: React.FC = () => {
  return (
    <MainLayout pageTitle="CSAE Policy">
      <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <LegalDocumentBanner
          slug="csae-policy"
          defaultTitle="Child Sexual Abuse and Exploitation (CSAE) Prevention Policy"
          defaultVersion="1.5.0"
          defaultEffectiveDate="October 31, 2025"
        />

        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-200 border border-rose-100">
            <ShieldCheckIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">CSAE Policy</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Our commitment to combating Child Sexual Abuse and Exploitation.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12 space-y-8 text-slate-700 font-medium leading-relaxed">

          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex gap-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-rose-500 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-rose-900 mb-2">Zero Tolerance Policy</h2>
              <p className="text-rose-800">
                FingerMobile Protocol has a strict zero-tolerance policy towards any content or behavior that promotes, facilitates, or depicts the sexual abuse or exploitation of children (CSAE).
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
              <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
              1. Policy Overview
            </h2>
            <p>
              This policy outlines our approach to preventing, detecting, and responding to CSAE on our platform. We comply with all applicable international laws and work closely with law enforcement agencies and specialized organizations to ensure the safety of minors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
              <UserGroupIcon className="w-6 h-6 text-indigo-500" />
              2. User Responsibilities
            </h2>
            <p className="mb-4">
              By using our platform, you agree to:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
                <span>Never upload, share, or request CSAE content.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
                <span>Never engage in grooming behaviors or sexually explicit conversations with minors.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
                <span>Immediately report any suspicious activity or suspected CSAE content using our in-app reporting tools.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
              <ShieldCheckIcon className="w-6 h-6 text-indigo-500" />
              3. Detection and Enforcement
            </h2>
            <p>
              We utilize advanced automated scanning technologies (such as PhotoDNA) and dedicated human moderation teams to detect and remove CSAE content. When such content is found, we immediately:
            </p>
            <ol className="list-decimal pl-6 mt-4 space-y-2">
              <li>Disable the offending account permanently.</li>
              <li>Preserve the evidence as required by law.</li>
              <li>Report the incident to the National Center for Missing & Exploited Children (NCMEC) or relevant local authorities.</li>
            </ol>
          </section>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-500 text-center">
              Last updated: September 7, 2026. For more information or to report an incident, contact our Trust & Safety team at <a href="mailto:safety@fingermobile.com" className="text-indigo-600 font-bold hover:underline">safety@fingermobile.com</a>.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CSAEPolicyPage;
