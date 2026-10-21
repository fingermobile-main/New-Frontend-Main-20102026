import React, {} from 'react';

interface FixedAdBannerProps {
  adSlot?: string;
  className?: string;
}

const FixedAdBanner: React.FC<FixedAdBannerProps> = ({ adSlot, className }) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-2 z-40 flex items-center justify-center ${className || ''}`}>
      <p className="text-slate-700 font-medium text-xs italic">Advertisement {adSlot ? `(${adSlot})` : ''}</p>
    </div>
  );
};

export default FixedAdBanner;
