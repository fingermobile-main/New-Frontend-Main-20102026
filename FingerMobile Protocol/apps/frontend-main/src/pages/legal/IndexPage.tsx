import { Link } from 'react-router-dom';
import React, {} from 'react';
import LegalLayout from '../../components/layout/LegalLayout';
import {
  PolicyIcon,
  DocumentIcon,
  MembersIcon,
  ShieldCheckIcon,
  LockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '../../icons';

const LegalIndexPage: React.FC = () => {
  const legalDocuments = [
    {
      icon: <DocumentIcon className="w-8 h-8 text-emerald-600" />,
      title: 'Platform Service of Use',
      description: 'Statutory agreement: GraceLink Ltd., Singapore governing law, FIC token rules, and AI creation.',
      link: '/platform-service-of-use',
      badge: 'v2.2.0'
    },
    {
      icon: <PolicyIcon className="w-8 h-8 text-blue-600" />,
      title: 'Privacy Policy',
      description: 'NDPA 2023 & GDPR compliance, zero unauthorized sharing, sovereign cryptographic data handling.',
      link: '/legal/privacy-policy',
      badge: 'v2.1.0'
    },
    {
      icon: <DocumentIcon className="w-8 h-8 text-indigo-600" />,
      title: 'Terms of Service',
      description: 'Statutory contract governing decentralized accounts, marketplace exchange, and network conduct.',
      link: '/legal/terms-of-service',
      badge: 'v2.1.0'
    },
    {
      icon: <MembersIcon className="w-8 h-8 text-purple-600" />,
      title: 'Community Guidelines',
      description: 'Standards for civil discourse, anti-harassment policies, and Sentinel content moderation strikes.',
      link: '/legal/community-guidelines',
      badge: 'v2.0.0'
    },
    {
      icon: <ExclamationTriangleIcon className="w-8 h-8 text-rose-600" />,
      title: 'CSAE Prevention Policy',
      description: 'Strict zero-tolerance on child sexual exploitation, perceptual media hashing, and NCMEC reporting.',
      link: '/legal/csae-policy',
      badge: 'v1.5.0'
    },
    {
      icon: <LockIcon className="w-8 h-8 text-amber-600" />,
      title: 'Cookie & Local Storage',
      description: 'Transparent disclosure of cryptographic session tokens, security markers, and local cache storage.',
      link: '/cookie-policy',
      badge: 'v1.2.0'
    },
    {
      icon: <DocumentTextIcon className="w-8 h-8 text-emerald-600" />,
      title: 'Technical Whitepaper',
      description: 'Complete architecture specification for Infinite Coin (IFO/FIC), settlement rails, and smart contracts.',
      link: '/legal/whitepaper',
      badge: 'v1.0.0'
    },
    {
      icon: <ExclamationTriangleIcon className="w-8 h-8 text-rose-500" />,
      title: 'Community Standards: Nudity & Sexual Activity',
      description: 'Statutory policy governing nudity, sexual activity, age-gating, spoiler labels, fetish content prohibitions, and permitted artistic/crisis exceptions.',
      link: '/legal/community-standards-nudity',
      badge: 'v1.0.0'
    }
  ];

  return (
    <LegalLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 lg:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-950 text-xs font-bold rounded-full mb-3 border border-blue-400   font-black">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>FingerMobile Protocol™ Legal Trust Center</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Legal & Compliance Center
          </h1>
          <p className="text-slate-700 font-medium max-w-2xl mx-auto mt-2 text-sm sm:text-base">
            Official repository of protocol agreements, privacy rights, governance frameworks, and statutory compliance under the Nigeria Data Protection Act (NDPA 2023) and global GDPR standards.
          </p>
        </div>

        {/* Core Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {legalDocuments.map((doc, index) => (
            <Link
              key={index}
              to={doc.link}
              className="group border border-slate-300 hover:border-blue-400 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-50/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    {doc.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-950 border border-slate-400">
                    {doc.badge}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">
                  {doc.description}
                </p>
              </div>
              <div className="mt-6 flex items-center text-blue-600 font-bold text-sm">
                <span>View Policy</span>
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* User Rights & Actions Strip */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white mb-10 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">Data Subject Sovereignty</span>
              <h2 className="text-2xl font-black mt-1 text-white">Exercise Your Legal & Privacy Rights</h2>
              <p className="text-slate-300 font-medium text-sm mt-1 max-w-xl">
                Submit NDPA/GDPR Data Subject Requests for access, rectification, or porting of your account data. You may also initiate permanent account termination or report copyright infringement.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/privacy/data-subject-request"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Submit DSR Request
              </Link>
              <Link
                to="/account/delete"
                className="px-4 py-2.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Account Purge
              </Link>
              <Link
                to="/legal"
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                DMCA Desk
              </Link>
              <Link
                to="/governance"
                className="px-4 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                AI Governance
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="pt-8 border-t border-slate-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statutory Contact & Data Protection Officer (DPO)</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Data Protection Officer</p>
                <p className="text-gray-600 text-sm mt-1">info@fingermobileprotocol.com</p>
                <p className="text-xs text-slate-700 mt-0.5">NDPA 2023 Statutory Officer</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">DMCA &amp; Legal Notice</p>
                <p className="text-gray-600 text-sm mt-1">fingermobileprotocol@gmail.com</p>
                <p className="text-xs text-slate-700 mt-0.5">Statutory 48h Response Desk</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Registered Headquarters</p>
                <p className="text-gray-600 text-sm mt-1">
                  FingerMobile Protocol Operations<br />
                  Victoria Island, Lagos, Nigeria
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
