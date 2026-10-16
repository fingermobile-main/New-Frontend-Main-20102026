import React from 'react';
import type { DigitalProgramOrMembership } from '../../types/fingerLuxScheduling';
import { CheckIcon, ArrowRightIcon } from '../../icons';

interface FingerLuxRevenueProps {
  programs: DigitalProgramOrMembership[];
  formatPrice: (amountInFic: number) => string;
  onPurchaseProgram: (program: DigitalProgramOrMembership) => void;
}

export const FingerLuxRevenue: React.FC<FingerLuxRevenueProps> = ({
  programs,
  formatPrice,
  onPurchaseProgram
}) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-indigo-900 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            Monetize Beyond The Calendar
          </span>
          <h2 className="text-xl font-black text-white mt-1.5">
            Digital Programs, Memberships & Luxury Products
          </h2>
          <p className="text-xs text-indigo-200/80 mt-1 max-w-xl">
            Scale revenue streams 24/7. Sell recorded video masterclasses, recurring VIP prestige memberships, and bespoke physical products directly from your FingerLux booking portal.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
          <span className="text-2xl">📈</span>
          <div>
            <div className="text-xs font-black text-white">Recurring Revenue Active</div>
            <div className="text-[10px] text-emerald-400 font-semibold">+34% vs Standard Bookings</div>
          </div>
        </div>
      </div>

      {/* Programs & Memberships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${item.thumbnail})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-300 border border-amber-300/40">
                    {item.type === 'membership'
                      ? 'VIP Membership'
                      : item.type === 'digital_program'
                      ? 'Digital Masterclass'
                      : 'Physical Product'}
                  </span>
                </div>

                {item.activeSubscribers && (
                  <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                    {item.activeSubscribers} Active Members
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-700 line-clamp-2 mt-1.5 leading-relaxed">
                  {item.description}
                </p>

                {/* Perks Checklist */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                    Included Privileges:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {item.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-[11px] leading-snug font-medium text-slate-800">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="flex justify-between items-center py-3 border-t border-slate-200 mb-3">
                <div>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block">
                    Price
                  </span>
                  <span className="text-xl font-black text-slate-900 block">
                    {formatPrice(item.price)}
                    {item.interval && (
                      <span className="text-xs font-bold text-slate-600">/{item.interval}</span>
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 font-bold block">Protocol Rate</span>
                  <span className="text-xs font-black text-indigo-700 block">
                    {item.price.toLocaleString()} FIC
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onPurchaseProgram(item)}
                className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-indigo-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer border border-amber-600/30"
              >
                <span>{item.type === 'membership' ? 'Join Membership' : 'Instant Enrolment'}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
