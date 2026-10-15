import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Gem,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import widgetService, { WidgetEntity } from '../../services/widgetService';

interface FingerLuxWidgetProps {
  widget?: WidgetEntity;
}

export const FingerLuxWidget: React.FC<FingerLuxWidgetProps> = ({ widget }) => {
  const navigate = useNavigate();
  const currentWidget = widget || widgetService.getWidgetById('fingerlux-widget') || widgetService.getAllWidgets().find(w => w.slug === 'fingerlux')!;

  const handleAction = () => {
    if (currentWidget?.id) widgetService.recordClick(currentWidget.id);
    navigate(currentWidget?.actionUrl || '/fingerlux');
  };

  return (
    <div
      id="fingerlux-widget-card"
      className="relative rounded-2xl bg-gradient-to-b from-purple-50/70 via-white to-purple-50/30 border border-slate-300 shadow-sm p-4 transition-all hover:border-purple-400 hover:shadow-md group"
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-200">
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-950 border border-purple-400">
          <Crown className="w-3 h-3 text-purple-700" />
          VIP Suite & Luxury
        </span>
        <span className="text-[10px] font-mono font-bold text-purple-900">
          FINGERLUX™
        </span>
      </div>

      {/* Main Info */}
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-fuchsia-600 flex items-center justify-center text-white shadow-xs shrink-0">
          <Gem className="w-5 h-5 text-purple-200" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 leading-tight">
            {currentWidget?.title || 'FingerLux™ Luxury & VIP Suites'}
          </h4>
          <p className="text-[11px] font-medium text-slate-700 mt-0.5">
            {currentWidget?.subtitle || 'High-Net-Worth Sovereign Marketplace'}
          </p>
        </div>
      </div>

      {/* Image Showcase */}
      <div className="relative rounded-xl overflow-hidden mb-3 border border-purple-200 aspect-[16/9] bg-slate-900">
        <img
          src={
            currentWidget?.primaryImageUrl ||
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80'
          }
          alt="FingerLux Luxury"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px]">
          <span className="font-bold flex items-center gap-1 drop-shadow-sm">
            <Sparkles className="w-3 h-3 text-purple-300" />
            Curated Rare Assets
          </span>
          <span className="bg-purple-950/90 text-purple-200 border border-purple-500/30 px-2 py-0.5 rounded font-mono text-[9px]">
            Tier: Black Diamond
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-700 leading-relaxed mb-3">
        {currentWidget?.description ||
          'Bespoke luxury concierge, rare gem vaults, private jet charters, and high-value real estate tokenization.'}
      </p>

      {/* Feature Pills */}
      <div className="grid grid-cols-2 gap-1.5 mb-3 text-[10px] font-bold">
        <div className="flex items-center gap-1 p-1.5 rounded-lg bg-purple-50 text-purple-950 border border-purple-200">
          <CheckCircle2 className="w-3 h-3 text-purple-700" />
          <span>Private Jet Vaults</span>
        </div>
        <div className="flex items-center gap-1 p-1.5 rounded-lg bg-purple-50 text-purple-950 border border-purple-200">
          <CheckCircle2 className="w-3 h-3 text-purple-700" />
          <span>VIP Concierge 24/7</span>
        </div>
      </div>

      {/* Action CTA */}
      <button
        type="button"
        onClick={handleAction}
        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
      >
        <span>{currentWidget?.ctaText || 'Access VIP Suite'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default FingerLuxWidget;
