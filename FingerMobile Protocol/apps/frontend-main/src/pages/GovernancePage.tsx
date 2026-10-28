import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import GovernanceDashboard from '../components/GovernanceDashboard';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import { Shield, Info, FileText, Eye, BookOpen, AlertTriangle } from 'lucide-react';

const GovernancePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'dashboard' | 'policies' | 'report'>('overview');

  const scrollToSection = (id: string, section: 'overview' | 'dashboard' | 'policies' | 'report') => {
    setActiveSection(section);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12 pb-28 md:pb-12 max-w-full overflow-x-hidden text-slate-900">
        {/* Hero Section */}
        <section id="governance-hero" className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full">
            <Shield size={14} className="text-blue-500" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Official Protocol Governance</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">AI-Driven Integrity</h1>
          <p className="text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed">
            The FingerMobile Protocol™ utilizes state-of-the-art AI Seekers and automated harmonizers to ensure a safe, fair, and transparent ecosystem for all members.
          </p>
        </section>

        {/* Governance Dashboard */}
        <div id="governance-dashboard">
          <GovernanceDashboard />
        </div>

        {/* Detailed Policies Grid */}
        <div id="governance-policies" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Privacy Manifesto',
              desc: 'Zero-knowledge proof systems ensure your identity remains yours.',
              icon: <Eye className="text-pink-500" />,
              bg: 'bg-pink-500/5'
            },
            {
              title: 'Fair Usage Policy',
              desc: 'Automated revenue share modeling for transparent creator payouts.',
              icon: <FileText className="text-emerald-500" />,
              bg: 'bg-emerald-500/5'
            },
            {
              title: 'AI Ethics Code',
              desc: 'Our seekers are governed by the strict human-centric protocol v4.0.',
              icon: <BookOpen className="text-amber-500" />,
              bg: 'bg-amber-500/5'
            }
          ].map((policy, i) => (
            <Link
              to="/compliance"
              key={i}
              className={`p-8 rounded-[2rem] border border-white/5 ${policy.bg} space-y-4 group hover:scale-[1.02] transition-transform block`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                {policy.icon}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{policy.title}</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{policy.desc}</p>
              <div className="pt-4 flex items-center text-xs font-bold text-white/40 group-hover:text-white transition-colors">
                <span>Read Full Document</span>
                <Info size={14} className="ml-2" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Banner */}
        <div id="governance-report" className="p-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] text-center space-y-6 shadow-2xl shadow-blue-900/40">
          <h2 className="text-3xl font-black text-white tracking-tighter">Secure. Harmonized. FingerMobile.</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/compliance"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-white/90 transition-all shadow-lg inline-block"
            >
              Contact Compliance Officer
            </Link>
            <Link
              to="/feedback"
              className="px-8 py-3 bg-black/20 text-white font-bold rounded-2xl hover:bg-black/30 transition-all border border-white/10 inline-block"
            >
              Report an AI Anomaly
            </Link>
          </div>
        </div>

        {/* Sovereign Platform Ownership Directive */}
        <PlatformOwnershipCard />
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Governance Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 flex items-center justify-around gap-2 shadow-lg"
      >
        <button
          type="button"
          onClick={() => scrollToSection('governance-hero', 'overview')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeSection === 'overview' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-5 h-5 mb-0.5" />
          <span>Overview</span>
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('governance-dashboard', 'dashboard')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeSection === 'dashboard' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-5 h-5 mb-0.5" />
          <span>Integrity</span>
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('governance-policies', 'policies')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeSection === 'policies' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span>Policies</span>
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('governance-report', 'report')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeSection === 'report' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-5 h-5 mb-0.5" />
          <span>Report</span>
        </button>
      </nav>
    </MainLayout>
  );
};

export default GovernancePage;
