import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Pin,
  Flame,
} from 'lucide-react';
import widgetService, {
  WidgetEntity,
  RailRotationState,
} from '../../services/widgetService';
import CanaryAdsWidget from './CanaryAdsWidget';
import FingerLuxWidget from './FingerLuxWidget';
import SuperViWidget from './SuperViWidget';
import LoansqrWidget from './LoansqrWidget';
import RotationalWidgetCard from './RotationalWidgetCard';

interface RotatingWidgetRailProps {
  className?: string;
  showRotationTicker?: boolean;
}

export const RotatingWidgetRail: React.FC<RotatingWidgetRailProps> = ({
  className = '',
  showRotationTicker = true,
}) => {
  const [activeRotational, setActiveRotational] = useState<WidgetEntity[]>([]);
  const [permanentWidget, setPermanentWidget] = useState<WidgetEntity | null>(null);
  const [rotationState, setRotationState] = useState<RailRotationState>(() =>
    widgetService.getRotationState()
  );
  const [isRotatingEffect, setIsRotatingEffect] = useState(false);

  const refreshRail = () => {
    setActiveRotational(widgetService.getActiveRotationalWidgets(3));
    setPermanentWidget(widgetService.getPermanentCanaryWidget());
    setRotationState(widgetService.getRotationState());
  };

  useEffect(() => {
    refreshRail();
    const unsub = widgetService.subscribe(() => {
      refreshRail();
    });

    // Update countdown every second
    const interval = setInterval(() => {
      setRotationState(widgetService.getRotationState());
    }, 1000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const handleManualRotate = () => {
    setIsRotatingEffect(true);
    widgetService.forceRotation();
    setTimeout(() => setIsRotatingEffect(false), 500);
  };

  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderWidgetComponent = (w: WidgetEntity) => {
    switch (w.slug) {
      case 'fingerlux':
        return <FingerLuxWidget key={w.id} widget={w} />;
      case 'supervi':
        return <SuperViWidget key={w.id} widget={w} />;
      case 'loansqr':
        return <LoansqrWidget key={w.id} widget={w} />;
      default:
        return <RotationalWidgetCard key={w.id} widget={w} />;
    }
  };

  return (
    <div
      id="protocol-rotating-widget-rail"
      className={`space-y-4 ${className}`}
    >
      {/* 2-Hour Auto-Rotation Telemetry Pill */}
      {showRotationTicker && (
        <div className="bg-white rounded-2xl border border-slate-300 p-2.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-950 border border-emerald-400">
              <Clock className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                  2H Auto-Rotation
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="font-mono text-xs font-black text-slate-900">
                Next change: {formatCountdown(rotationState.remainingSeconds)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleManualRotate}
            title="Simulate / Trigger next 2-hour rotation step"
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-950 border border-slate-300 hover:border-emerald-400 text-[10px] font-bold transition-all"
          >
            <RotateCw
              className={`w-3 h-3 text-slate-700 ${
                isRotatingEffect ? 'animate-spin text-emerald-700' : ''
              }`}
            />
            <span>Rotate (2h)</span>
          </button>
        </div>
      )}

      {/* Dynamic Rotational Widgets Stream */}
      <div
        className={`space-y-4 transition-opacity duration-300 ${
          isRotatingEffect ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {activeRotational.map((w) => renderWidgetComponent(w))}
      </div>

      {/* ======================================================================= */}
      {/* PERMANENT ANCHOR WIDGET: CANARY ADS WIDGET (Bottom Right Column)       */}
      {/* ======================================================================= */}
      <div className="pt-2">
        <CanaryAdsWidget customWidget={permanentWidget || undefined} />
      </div>
    </div>
  );
};

export default RotatingWidgetRail;
