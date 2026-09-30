import React from 'react';

export const RouteLoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-emerald-400" />
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Loading Stage...</span>
      </div>
    </div>
  );
};
