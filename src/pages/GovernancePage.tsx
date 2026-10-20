import React, {} from 'react';
import MainLayout from '../layouts/MainLayout';
import GovernanceDashboard from '../components/GovernanceDashboard';
import { Shield, Info, FileText, Eye, BookOpen } from 'lucide-react';

const GovernancePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
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
        <GovernanceDashboard />

        {/* Detailed Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <div key={i} className={`p-8 rounded-[2rem] border border-white/5 ${policy.bg} space-y-4 group hover:scale-[1.02] transition-transform cursor-pointer`}>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                {policy.icon}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{policy.title}</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{policy.desc}</p>
              <div className="pt-4 flex items-center text-xs font-bold text-white/40 group-hover:text-white transition-colors">
                <span>Read Full Document</span>
                <Info size={14} className="ml-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="p-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] text-center space-y-6 shadow-2xl shadow-blue-900/40">
          <h2 className="text-3xl font-black text-white tracking-tighter">Secure. Harmonized. FingerMobile.</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-white/90 transition-all shadow-lg">
                    Contact Compliance Officer
            </button>
            <button className="px-8 py-3 bg-black/20 text-white font-bold rounded-2xl hover:bg-black/30 transition-all border border-white/10">
                    Report an AI Anomaly
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GovernancePage;
