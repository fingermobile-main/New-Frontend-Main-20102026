import React from 'react';

export interface CohortCardProps {
  countryName: string;
  totalSeats: number;
  availableSeats: number;
  percentageFilled: number;
  closingDateStr: string;
  isWaitlist?: boolean;
  onSelect: () => void;
}

export const CreatorSpotAvailabilityCard: React.FC<CohortCardProps> = ({
  countryName,
  totalSeats,
  availableSeats,
  percentageFilled,
  closingDateStr,
  isWaitlist = false,
  onSelect,
}) => {
  const isSoldOut = availableSeats <= 0;

  return (
    <div
      className={`border rounded-xl p-5 transition-all text-left shadow-lg ${
        isWaitlist
          ? 'bg-slate-900/80 border-slate-700'
          : 'bg-indigo-950/40 border-indigo-600/50 backdrop-blur-sm'
      }`}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isWaitlist
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          {isWaitlist ? 'Priority Waiting List' : 'Direct Registration'}
        </span>
        <span className="text-xs text-slate-300 font-medium">
          Closes: <strong className="text-slate-200">{closingDateStr}</strong>
        </span>
      </div>

      {/* Main Seat Counter */}
      <div className="mb-2">
        <h3 className="text-lg font-bold text-white tracking-tight">
          {countryName} Regional Intake
        </h3>
        <p className="text-sm text-slate-300 mt-1">
          {isSoldOut ? (
            <span className="text-rose-400 font-semibold">All slots currently reserved</span>
          ) : (
            <>
              <span className="text-2xl font-extrabold text-white">
                {availableSeats.toLocaleString()}
              </span>
              <span className="text-slate-300 font-medium text-sm"> / {totalSeats.toLocaleString()} seats left</span>
            </>
          )}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isWaitlist ? 'bg-amber-400' : 'bg-indigo-500'
          }`}
          style={{ width: `${Math.min(percentageFilled, 100)}%` }}
        />
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onSelect}
        disabled={isSoldOut && !isWaitlist}
        className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all cursor-pointer ${
          isWaitlist
            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 disabled:bg-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed'
        }`}
      >
        {isWaitlist ? 'Reserve Priority Waitlist Spot' : 'Claim Your Creator Seat'}
      </button>
    </div>
  );
};

export default CreatorSpotAvailabilityCard;
