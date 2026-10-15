import React, { useState, useEffect } from 'react';

interface CustomCaptchaProps {
  onSuccess: () => void;
}

export const CustomCaptcha: React.FC<CustomCaptchaProps> = ({ onSuccess }) => {
  const [phase, setPhase] = useState<'vertical' | 'horizontal'>('vertical');
  const [target, setTarget] = useState(0);
  const [value, setValue] = useState(0);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (phase === 'vertical') {
      // Random number 11 to 19
      setTarget(Math.floor(Math.random() * 9) + 11);
      setValue(10); // start at bottom
    } else {
      // Random number 11 to 19 (start at 20 so they slide down/left)
      setTarget(Math.floor(Math.random() * 9) + 11);
      setValue(20); // start at top/right
    }
  }, [phase]);

  const handleRelease = () => {
    if (value === target) {
      if (phase === 'vertical') {
        setPhase('horizontal');
      } else {
        setVerified(true);
        onSuccess();
      }
    } else {
      // Reset if failed
      if (phase === 'vertical') setValue(10);
      else setValue(20);
    }
  };

  if (verified) {
    return (
      <div className="text-green-600 font-bold p-4 bg-green-50 border border-green-200 rounded-xl text-center shadow-sm">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span>Captcha Verified Successfully!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-slate-300 shadow-sm rounded-xl bg-white flex flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h3 className="font-semibold text-lg text-slate-800">
          Prove you are human
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          {phase === 'vertical'
            ? `Slide UP to exactly ${target}`
            : `Slide DOWN/LEFT to exactly ${target}`}
        </p>
      </div>

      <div className={`flex items-center justify-center ${phase === 'vertical' ? 'h-48' : 'h-16'} w-full`}>
        <input
          type="range"
          min="10"
          max="20"
          step="1"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className={`cursor-pointer ${phase === 'vertical' ? 'w-48 -rotate-90' : 'w-64'}`}
          style={phase === 'vertical' ? { transformOrigin: 'center' } : {}}
        />
      </div>
      <div className="text-3xl font-bold text-blue-600 w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full border-2 border-blue-200 shadow-inner">
        {value}
      </div>
    </div>
  );
};
