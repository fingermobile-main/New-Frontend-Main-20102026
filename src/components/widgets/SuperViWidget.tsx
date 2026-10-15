import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Activity,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  Radio,
} from 'lucide-react';
import widgetService, { WidgetEntity } from '../../services/widgetService';

interface SuperViWidgetProps {
  widget?: WidgetEntity;
}

export const SuperViWidget: React.FC<SuperViWidgetProps> = ({ widget }) => {
  const navigate = useNavigate();
  const currentWidget = widget || widgetService.getWidgetById('supervi-widget') || widgetService.getAllWidgets().find(w => w.slug === 'supervi')!;

  const handleAction = () => {
    if (currentWidget?.id) widgetService.recordClick(currentWidget.id);
    navigate(currentWidget?.actionUrl || '/security');
  };

  return (
    <div
      id="supervi-widget-card"
      className="relative rounded-2xl bg-gradient-to-b from-sky-50/70 via-white to-sky-50/30 border border-slate-300 shadow-sm p-4 transition-all hover:border-sky-400 hover:shadow-md group"
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-sky-200">
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-100 text-sky-950 border border-sky-400">
          <ShieldCheck className="w-3 h-3 text-sky-700" />
          Super-Verified 99.9%
        </span>
        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-sky-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          SUPERVI™
        </span>
      </div>

      {/* Main Info */}
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-xs shrink-0">
          <Cpu className="w-5 h-5 text-sky-100" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 leading-tight">
            {currentWidget?.title || 'SuperVI™ Neural Vision & Proofs'}
          </h4>
          <p className="text-[11px] font-medium text-slate-700 mt-0.5">
            {currentWidget?.subtitle || 'Consensus Telemetry & Zero-Knowledge Audits'}
          </p>
        </div>
      </div>

      {/* Live Node Proofs Monitor Box */}
      <div className="rounded-xl p-2.5 mb-3 bg-slate-900 text-white border border-slate-700 text-xs font-mono space-y-1.5 shadow-inner">
        <div className="flex items-center justify-between text-[10px] text-slate-300 border-b border-slate-800 pb-1">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Radio className="w-2.5 h-2.5 animate-ping" />
            Consensus Relays
          </span>
          <span className="text-slate-400">1,248 Nodes Online</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-300 font-sans">Heartbeat Latency:</span>
          <span className="font-bold text-emerald-400">14ms (Optimal)</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-300 font-sans">ZK-WORM Proof:</span>
          <span className="font-bold text-sky-300">VALID (SHA-256)</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-700 leading-relaxed mb-3">
        {currentWidget?.description ||
          'Real-time protocol node diagnostics, cryptographic state proofs, and continuous multi-agent cognitive security scans.'}
      </p>

      {/* Security Guarantees */}
      <div className="grid grid-cols-2 gap-1.5 mb-3 text-[10px] font-bold">
        <div className="flex items-center gap-1 p-1.5 rounded-lg bg-sky-50 text-sky-950 border border-sky-200">
          <CheckCircle2 className="w-3 h-3 text-sky-700" />
          <span>WORM Audit Trail</span>
        </div>
        <div className="flex items-center gap-1 p-1.5 rounded-lg bg-sky-50 text-sky-950 border border-sky-200">
          <Lock className="w-3 h-3 text-sky-700" />
          <span>Sovereign HSM</span>
        </div>
      </div>

      {/* Action CTA */}
      <button
        type="button"
        onClick={handleAction}
        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-blue-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
      >
        <span>{currentWidget?.ctaText || 'View Node Proofs'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default SuperViWidget;
