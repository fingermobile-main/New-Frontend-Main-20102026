import React from 'react';
import { Award, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHallmark } from '../../../contexts/HallmarkContext';
import type { HallmarkApplication } from '../../../types';
import AnimatedAvatar from '../../../components/AnimatedAvatar';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';

const HallmarkApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const { hallmarkApplications, handleApproveHallmarkApplication, handleRejectHallmarkApplication } = useHallmark();

  const pendingApplications = hallmarkApplications.filter((app: HallmarkApplication) => app.status === 'pending');

  const ApplicationCard: React.FC<{ application: HallmarkApplication }> = ({ application }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4">
        <AnimatedAvatar staticUrl={application.applicant.avatarUrl} altText={application.applicant.name} className="w-12 h-12 rounded-full border border-slate-300 shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 text-base">{application.requestedHallmark.name}</h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-950 border border-purple-400">
              Mega Hallmark
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium mt-0.5">
            Applicant: <span className="text-slate-900 font-bold">{application.applicant.name}</span> (@{application.applicant.membername})
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-800 font-bold font-mono">
            <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Slug: /{application.requestedHallmark.slug}
            </span>
            <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Join Fee: {application.requestedHallmark.settings.joinFee} FIC
            </span>
            <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Cap: {application.requestedHallmark.settings.memberLimit.toLocaleString()} Members
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
        <button
          onClick={() => handleRejectHallmarkApplication(application.id)}
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold bg-rose-50 text-rose-950 border border-rose-300 hover:bg-rose-100 rounded-xl transition cursor-pointer"
        >
          Reject Application
        </button>
        <button
          onClick={() => handleApproveHallmarkApplication(application.id)}
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
        >
          Approve Hallmark
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hallmark Approval Queue</h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            Review sovereign mega-community charter applications (up to 250k member capacity)
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="min-h-[44px] flex items-center px-3.5 py-1 rounded-xl text-xs font-bold bg-blue-100 text-blue-950 border border-blue-400">
            {pendingApplications.length} Pending Charters
          </span>
          <button
            onClick={() => navigate('/hallmarks')}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span>Hub</span>
          </button>
        </div>
      </div>

      <PlatformOwnershipCard />

      {pendingApplications.length > 0 ? (
        <div className="space-y-4">
          {pendingApplications.map((app: HallmarkApplication) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="font-black text-slate-900 text-base">The Hallmark approval queue is empty</p>
          <p className="text-sm text-slate-700 font-medium mt-1">No sovereign mega-community applications are currently awaiting review.</p>
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Hallmark Approval Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span>Queue</span>
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 mb-0.5" />
          <span>Refresh</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/hallmarks')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span>Hub</span>
        </button>
      </nav>
    </div>
  );
};

export default HallmarkApprovalPage;
