import React from 'react';
import LegalLayout from '../../components/layout/LegalLayout';
import { PolicyIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '../../icons';
import LegalDocumentBanner from '../../components/legal/LegalDocumentBanner';
import { Link } from 'react-router-dom';

const CSAEPolicyPage: React.FC = () => {
  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children
  }) => (
    <section className="mb-8">
      <h3 className="text-xl font-black text-slate-900 border-b border-slate-300 pb-2 mb-4">
        {title}
      </h3>
      <div className="prose prose-sm max-w-none text-slate-700 font-medium leading-relaxed">{children}</div>
    </section>
  );

  return (
    <LegalLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 lg:p-8">
        <LegalDocumentBanner
          slug="csae-policy"
          defaultTitle="Child Sexual Abuse and Exploitation (CSAE) Prevention Policy"
          defaultVersion="1.5.0"
          defaultEffectiveDate="October 31, 2025"
        />

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-100 text-red-950 border border-red-400 font-bold rounded-xl">
            <PolicyIcon className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Child Sexual Abuse and Exploitation (CSAE) Policy
            </h1>
            <p className="text-slate-700 font-medium">
              Zero tolerance for child abuse or sexual exploitation across all communication rails.
            </p>
          </div>
        </div>

        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-red-900 text-base">Mandatory Statutory Compliance Notice</h2>
              <p className="text-red-800 text-sm mt-1">
                FingerMobile Protocol maintains a strict zero-tolerance enforcement stance toward Child Sexual Abuse Material (CSAM) and Child Sexual Abuse and Exploitation (CSAE). In compliance with the Nigeria Data Protection Act (NDPA Sec 31), international child safety conventions, and statutory obligations, any detected material results in instant asset seizure, permanent cryptographic blacklisting, and unalterable transmission to law enforcement authorities including NCMEC and local cybercrime divisions.
              </p>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <Section title="1. Purpose & Scope">
            <p>
              This Child Sexual Abuse and Exploitation Prevention Policy applies across all layers of the FingerMobile Protocol, including peer-to-peer messaging, Stercs media editing and publishing, marketplace listings, community group discussions, and file attachment pipelines.
            </p>
          </Section>

          <Section title="2. Automated Cryptographic Detection & Screening">
            <p>
              To maintain proactive perimeter defenses, all image and video media uploaded to the FingerMobile network pass through automated cryptographic perceptual hashing pipelines. Known illicit media hashes are matched against real-time child protection databases before content can be committed to distributed storage or rendered in feeds.
            </p>
          </Section>

          <Section title="3. Immediate Enforcement Actions">
            <p>Upon detection of any CSAE content or grooming activity, the protocol initiates automated defensive protocols:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Zero-Delay Media Neutralization:</strong> Content is immediately isolated, redacted from all network nodes, and frozen from further access.</li>
              <li><strong>Permanent Account Revocation:</strong> The associated account, cryptographic keys, and linked identifiers are terminated without appeal.</li>
              <li><strong>Regulatory Reporting:</strong> Automated incident packets containing audit records, hashes, timestamps, and network origins are dispatched to designated law enforcement bodies.</li>
            </ul>
          </Section>

          <Section title="4. Reporting Violations & Urgent Intervention">
            <p>
              If you discover or suspect any child exploitation material or predatory behavior on the FingerMobile platform, report it immediately through our compliance escalation desk or to public authorities:
            </p>
            <div className="mt-4 flex flex-wrap gap-4 not-prose">
              <Link
                to="/contact-us"
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
              >
                Submit Emergency Safety Report
              </Link>
              <a
                href="https://report.cybertip.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Report to NCMEC CyberTipline
              </a>
            </div>
          </Section>
        </div>
      </div>
    </LegalLayout>
  );
};

export default CSAEPolicyPage;
