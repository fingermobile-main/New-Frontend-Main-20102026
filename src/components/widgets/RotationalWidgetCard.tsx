import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Tag,
  Clock,
  Layers,
  ShoppingBag,
  Tv,
  Gift,
  BookOpen,
  Store,
  Award,
  Compass,
  FileText,
  CreditCard,
  TrendingUp,
  Palette,
  Film,
} from 'lucide-react';
import widgetService, { WidgetEntity } from '../../services/widgetService';

const WIDGET_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'camus-admaker': Palette,
  luminar: Film,
  catalogue: Layers,
  coupons: Tag,
  'dancia-4tv': Tv,
  giftsshop: Gift,
  lushpressies: Sparkles,
  mylearning: BookOpen,
  storefront: Store,
  nysc: Award,
  gems: Award,
  flamingo: Compass,
  blogs: FileText,
  giftcard: CreditCard,
  loyalty: Award,
  trends: TrendingUp,
};

interface RotationalWidgetCardProps {
  widget: WidgetEntity;
}

export const RotationalWidgetCard: React.FC<RotationalWidgetCardProps> = ({ widget }) => {
  const navigate = useNavigate();
  const IconComponent = WIDGET_ICON_MAP[widget.slug] || Sparkles;

  const handleAction = () => {
    widgetService.recordClick(widget.id);
    if (widget.actionUrl.startsWith('http')) {
      window.open(widget.actionUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(widget.actionUrl);
    }
  };

  return (
    <div
      id={`rotational-widget-${widget.slug}`}
      className="relative rounded-2xl bg-white border border-slate-300 shadow-sm p-4 transition-all hover:border-slate-400 hover:shadow-md group"
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-950 border border-slate-400"
        >
          <IconComponent className="w-3 h-3 text-slate-700" />
          {widget.badgeText || widget.category}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-600">
          <Clock className="w-2.5 h-2.5 text-slate-500" />
          2H ROTATION
        </span>
      </div>

      {/* Main Info */}
      <div className="flex items-start gap-2.5 mb-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 shadow-xs shrink-0"
          style={{ backgroundColor: widget.accentColor || '#059669' }}
        >
          <IconComponent className="w-5 h-5 text-slate-700" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 leading-tight">
            {widget.title}
          </h4>
          <p className="text-[11px] font-medium text-slate-700 mt-0.5">
            {widget.subtitle || widget.category}
          </p>
        </div>
      </div>

      {/* Image Preview if available */}
      {widget.primaryImageUrl && (
        <div className="relative rounded-xl overflow-hidden mb-3 border border-slate-200 aspect-[16/9] bg-slate-100">
          <img
            src={widget.primaryImageUrl}
            alt={widget.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-slate-700 text-[10px]">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {widget.category}
            </span>
            <span className="bg-slate-900/80 px-1.5 py-0.5 rounded font-mono text-[9px]">
              Active Cycle
            </span>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-slate-700 leading-relaxed mb-3">
        {widget.description}
      </p>

      {/* Action CTA */}
      <button
        type="button"
        onClick={handleAction}
        style={{
          background: `linear-gradient(135deg, ${widget.accentColor || '#059669'}, #0f172a)`,
        }}
        className="w-full py-2.5 px-3 rounded-xl text-slate-700 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
      >
        <span>{widget.ctaText || 'Explore Now'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default RotationalWidgetCard;
