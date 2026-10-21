import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Banknote,
  Coins,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import widgetService, { WidgetEntity } from '../../services/widgetService';

interface LoansqrWidgetProps {
  widget?: WidgetEntity;
}

export const LoansqrWidget: React.FC<LoansqrWidgetProps> = ({ widget }) => {
  const navigate = useNavigate();
  const currentWidget = widget || widgetService.getWidgetById('loansqr-widget') || widgetService.getAllWidgets().find(w => w.slug === 'loansqr')!;
  const [loanAmount, setLoanAmount] = useState(100000); // ₦100,000

  const handleAction = () => {
    if (currentWidget?.id) widgetService.recordClick(currentWidget.id);
    navigate(currentWidget?.actionUrl || '/loansqr');
  };

  // Quick interactive repayment calculation
  const monthlyRepayment = Math.round((loanAmount * 1.048) / 6);

  return (
    <div
      id="loansqr-widget-card"
      className="relative rounded-2xl bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 border border-slate-300 shadow-sm p-4 transition-all hover:border-emerald-400 hover:shadow-md group"
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200">
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
          <Banknote className="w-3 h-3 text-emerald-700" />
          Instant Nano-Loans
        </span>
        <span className="text-[10px] font-mono font-bold text-emerald-900">
          LOANSQR™
        </span>
      </div>

      {/* Main Info */}
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-xs shrink-0">
          <Coins className="w-5 h-5 text-emerald-100" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 leading-tight">
            {currentWidget?.title || 'Loansqr™ Instant Nano-Liquidity'}
          </h4>
          <p className="text-[11px] font-medium text-slate-700 mt-0.5">
            {currentWidget?.subtitle || 'Low-APR Collateralized Micro-Loans'}
          </p>
        </div>
      </div>

      {/* Interactive Micro Loan Calculator */}
      <div className="p-3 mb-3 rounded-xl bg-slate-900 text-white border border-slate-700 space-y-2 shadow-inner">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300">Desired Amount:</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">
            ₦{loanAmount.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min="10000"
          max="1000000"
          step="10000"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
        />

        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-300">
          <span>Est. 6-Mo Monthly:</span>
          <span className="font-mono font-bold text-white">
            ₦{monthlyRepayment.toLocaleString()}/mo
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-700 leading-relaxed mb-3">
        {currentWidget?.description ||
          'Instant 60-second credit assessment, ₦5,000 to ₦5,000,000 instant liquidity lines, and direct automated settlement.'}
      </p>

      {/* Loan Perks */}
      <div className="grid grid-cols-2 gap-1.5 mb-3 text-[10px] font-bold">
        <div className="flex items-center gap-1 p-1.5 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-200">
          <Clock className="w-3 h-3 text-emerald-700" />
          <span>60-Sec Decision</span>
        </div>
        <div className="flex items-center gap-1 p-1.5 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-700" />
          <span>APR from 4.8%</span>
        </div>
      </div>

      {/* Action CTA */}
      <button
        type="button"
        onClick={handleAction}
        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
      >
        <span>{currentWidget?.ctaText || 'Calculate & Apply Loan'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default LoansqrWidget;
