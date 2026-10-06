import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface HumanCaptchaPuzzleProps {
  onVerified: () => void;
}

export const HumanCaptchaPuzzle: React.FC<HumanCaptchaPuzzleProps> = ({ onVerified }) => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [targetPosition] = useState<number>(72); // Target percentage
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    setErrorMsg('');
  };

  const handleCheck = () => {
    const diff = Math.abs(sliderValue - targetPosition);
    if (diff <= 4) {
      setIsSuccess(true);
      setErrorMsg('');
      onVerified();
    } else {
      setErrorMsg('Alignment incomplete. Slide the puzzle piece precisely into the slot.');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md mx-auto shadow-2xl text-left">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold text-white">Security Verification</span>
        </div>
        <span className="text-xs text-slate-400">Prove you're human</span>
      </div>

      {/* Puzzle Viewport Simulation */}
      <div className="relative h-44 w-full bg-gradient-to-r from-blue-900 via-indigo-950 to-purple-900 rounded-lg overflow-hidden border border-slate-700/60 shadow-inner">
        {/* Decorative Grid and Graphic */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="absolute top-4 left-4 text-xs font-mono text-indigo-300/80 bg-slate-950/60 px-2.5 py-1 rounded">
          FingerMobile Guardian AI
        </div>

        {/* Target Slot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-dashed border-white/60 bg-slate-950/70 rounded-md shadow-lg"
          style={{ left: `${targetPosition}%` }}
        />

        {/* Draggable Puzzle Piece */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-md shadow-xl flex items-center justify-center transition-all ${
            isSuccess ? 'bg-emerald-500 border border-emerald-300' : 'bg-indigo-500 border border-indigo-300'
          }`}
          style={{ left: `${sliderValue}%` }}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-white/60"></div>
          )}
        </div>
      </div>

      {/* Slider Control */}
      <div className="mt-5">
        <label className="text-xs text-slate-300 block mb-2 font-medium">
          Drag the slider to fit the piece into the puzzle slot:
        </label>
        <input
          type="range"
          min="0"
          max="88"
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseUp={handleCheck}
          onTouchEnd={handleCheck}
          disabled={isSuccess}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
        />
      </div>

      {errorMsg && (
        <p className="text-xs text-rose-400 mt-2">{errorMsg}</p>
      )}

      {isSuccess && (
        <div className="mt-3 flex items-center space-x-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-600/30 p-2 rounded-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span>Human Verification Complete</span>
        </div>
      )}
    </div>
  );
};

export default HumanCaptchaPuzzle;
