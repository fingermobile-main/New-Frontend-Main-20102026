import { Link } from 'react-router-dom';
import React from 'react';
import RotatingWidgetRail from './widgets/RotatingWidgetRail';

const RightSidebar: React.FC = () => {
  return (
    <div className="hidden md:block w-72 flex-shrink-0 bg-white p-4 h-fit space-y-6 border-l border-slate-200">
      {/* Trending Topics */}
      <div>
        <h2 className="text-base font-black text-slate-900 mb-3">Trending Topics</h2>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-emerald-700 hover:underline font-bold text-xs">#FingerMobile</a>
          </li>
          <li>
            <a href="#" className="text-emerald-700 hover:underline font-bold text-xs">#TechInnovation</a>
          </li>
          <li>
            <a href="#" className="text-emerald-700 hover:underline font-bold text-xs">#Blockchain</a>
          </li>
          <li>
            <a href="#" className="text-emerald-700 hover:underline font-bold text-xs">#SocialMedia</a>
          </li>
          <li>
            <a href="#" className="text-emerald-700 hover:underline font-bold text-xs">#DigitalFuture</a>
          </li>
        </ul>
      </div>

      {/* Dynamic 2-Hour Rotating Widgets + Permanent Canary Ads Bottom Rail */}
      <RotatingWidgetRail />

      {/* Footer Links */}
      <div className="text-xs text-slate-700 px-1 pt-2 border-t border-slate-200">
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 font-medium">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/help" className="hover:underline">Help</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/language" className="hover:underline">Language</Link>
        </div>
        <p className="text-[11px] text-slate-600 font-bold">© 2026 FingerMobile Protocol™</p>
      </div>
    </div>
  );
};

export default RightSidebar;
