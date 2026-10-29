import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, AlertTriangle, Scale, Lock, Download, CheckCircle } from 'lucide-react';
import { legalComplianceService } from '../../services/legalComplianceService';
import { useAppContext } from '../../contexts/AppContext';

const LegalPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [showDmcaModal, setShowDmcaModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dmcaForm, setDmcaForm] = useState({
    claimant_name: '',
    claimant_email: '',
    infringing_url: '',
    original_work_url: '',
    description: '',
    signature: ''
  });

  const handleDmcaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await legalComplianceService.submitDMCA(dmcaForm);
      showToast('DMCA takedown notice submitted. Our legal team will review within 48 hours.', 'success');
      setShowDmcaModal(false);
      setDmcaForm({
        claimant_name: '',
        claimant_email: '',
        infringing_url: '',
        original_work_url: '',
        description: '',
        signature: ''
      });
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to submit notice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const legalLinks = [
    {
      to: '/platform-service-of-use',
      title: 'Platform Service of Use',
      desc: 'Official statutory agreement: GraceLink Business Technologies Group.., Singapore law, FIC tokens, and AI creation rules',
      icon: <FileText className="w-6 h-6 text-emerald-600" />
    },
    {
      to: '/legal/privacy-policy',
      title: 'Privacy Policy',
      desc: 'NDPA 2023 & GDPR cryptographic data handling and privacy rights',
      icon: <Lock className="w-6 h-6 text-blue-600" />
    },
    {
      to: '/legal/terms-of-service',
      title: 'Terms of Service',
      desc: 'Platform usage rules, FIC Vault escrow terms, and creator rights',
      icon: <FileText className="w-6 h-6 text-indigo-600" />
    },
    {
      to: '/legal/csae-policy',
      title: 'CSAE & Child Protection',
      desc: 'Zero-tolerance child sexual abuse prevention & statutory escalation',
      icon: <ShieldCheck className="w-6 h-6 text-red-600" />
    },
    {
      to: '/legal/community-guidelines',
      title: 'Community Guidelines',
      desc: 'Standards for safe discourse, commerce, and media publishing',
      icon: <Scale className="w-6 h-6 text-green-600" />
    },
    {
      to: '/legal/whitepaper',
      title: 'Technical Whitepaper',
      desc: 'Comprehensive architectural, consensus, and tokenomic specifications',
      icon: <Download className="w-6 h-6 text-purple-600" />
    },
    {
      to: '/data-subject-request',
      title: 'Data Subject Request (DSR)',
      desc: 'Exercise your statutory right to access, rectify, or port your data',
      icon: <CheckCircle className="w-6 h-6 text-teal-600" />
    },
    {
      to: '/account-deletion',
      title: 'Account Deletion & Erasure',
      desc: 'Request permanent cascading erasure under NDPA Section 34',
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-300">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Legal & Compliance Hub</h1>
            <p className="mt-2 text-base text-slate-700 font-medium">
              Statutory documents, sovereign rights, cryptographic policies, and dispute mediation.
            </p>
          </div>
          <button
            onClick={() => setShowDmcaModal(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm shadow-sm transition"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            File DMCA Notice
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {legalLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-200">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-700 font-medium">{item.desc}</p>
              </div>
              <div className="mt-4 text-xs font-bold text-blue-600 flex items-center">
                Read document &rarr;
              </div>
            </Link>
          ))}
        </div>

        {/* DMCA Modal */}
        {showDmcaModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto border border-slate-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">File DMCA / Copyright Claim</h2>
                <button
                  onClick={() => setShowDmcaModal(false)}
                  className="text-slate-700 hover:text-slate-900 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleDmcaSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Claimant Full Name</label>
                  <input
                    type="text"
                    required
                    value={dmcaForm.claimant_name}
                    onChange={e => setDmcaForm({ ...dmcaForm, claimant_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Claimant Email</label>
                  <input
                    type="email"
                    required
                    value={dmcaForm.claimant_email}
                    onChange={e => setDmcaForm({ ...dmcaForm, claimant_email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Infringing URL on Platform</label>
                  <input
                    type="url"
                    required
                    placeholder="https://fingermobile.io/posts/..."
                    value={dmcaForm.infringing_url}
                    onChange={e => setDmcaForm({ ...dmcaForm, infringing_url: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Original Work Evidence URL</label>
                  <input
                    type="url"
                    value={dmcaForm.original_work_url}
                    onChange={e => setDmcaForm({ ...dmcaForm, original_work_url: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Infringement Description</label>
                  <textarea
                    rows={3}
                    required
                    value={dmcaForm.description}
                    onChange={e => setDmcaForm({ ...dmcaForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Digital Signature</label>
                  <input
                    type="text"
                    required
                    placeholder="Type legal representative name"
                    value={dmcaForm.signature}
                    onChange={e => setDmcaForm({ ...dmcaForm, signature: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowDmcaModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
          <Link
            to="/legal"
            aria-label="Legal Hub"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
          >
            <span className="text-base">⚖️</span>
            <span>Legal</span>
          </Link>
          <button
            onClick={() => setShowDmcaModal(true)}
            aria-label="File DMCA"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
          >
            <span className="text-base">📜</span>
            <span>DMCA</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            aria-label="Reload Legal Hub"
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
    </div>
  );
};

export default LegalPage;
