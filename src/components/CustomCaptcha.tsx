import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

interface CustomCaptchaProps {
  onSuccess: () => void;
}

export const CustomCaptcha: React.FC<CustomCaptchaProps> = ({ onSuccess }) => {
  const [targetUp, setTargetUp] = useState<number>(0);
  const [targetDown, setTargetDown] = useState<number>(0);
  
  const [valueUp, setValueUp] = useState<number>(0);
  const [valueDown, setValueDown] = useState<number>(30); // Start higher

  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Use a ref to store the latest onSuccess callback to prevent infinite loops
  const onSuccessRef = React.useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    // Generate random numbers between 11 and 19
    setTargetUp(Math.floor(Math.random() * (19 - 11 + 1)) + 11);
    // Generate random number for down (we'll just pick a target between 11 and 19)
    setTargetDown(Math.floor(Math.random() * (19 - 11 + 1)) + 11);
  }, []);

  useEffect(() => {
    if (valueUp === targetUp && valueDown === targetDown && !isVerified) {
      setIsVerified(true);
      if (onSuccessRef.current) {
        onSuccessRef.current();
      }
    }
  }, [valueUp, valueDown, targetUp, targetDown, isVerified]);

  return (
    <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm max-w-sm mx-auto">
      <h3 className="font-semibold text-lg mb-4 text-center text-gray-800">Prove you're human</h3>
      
      {isVerified ? (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p className="text-green-600 font-medium">Verification Successful</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex gap-8 justify-center">
            {/* Vertical Slider */}
            <div className="flex flex-col items-center space-y-3">
              <label className="text-sm font-medium text-gray-700 text-center">
                Slide UP to <br/><span className="font-bold text-blue-600 text-lg">{targetUp}</span>
              </label>
              <div className="relative h-32 flex items-center justify-center">
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  value={valueUp} 
                  onChange={(e) => setValueUp(parseInt(e.target.value))}
                  className="w-32 h-2 bg-white rounded-lg appearance-none cursor-pointer accent-blue-600 -rotate-90 origin-center text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
              <span className="text-sm font-bold bg-blue-100 text-blue-950 border border-blue-400 font-bold px-3 py-1 rounded-full font-black">{valueUp}</span>
            </div>

            {/* Horizontal Slider */}
            <div className="flex flex-col items-center space-y-3">
              <label className="text-sm font-medium text-gray-700 text-center">
                Slide DOWN to <br/><span className="font-bold text-blue-600 text-lg">{targetDown}</span>
              </label>
              <div className="relative h-32 flex items-center justify-center">
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  value={valueDown} 
                  onChange={(e) => setValueDown(parseInt(e.target.value))}
                  className="w-32 h-2 bg-white rounded-lg appearance-none cursor-pointer accent-blue-600 text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  style={{ direction: 'rtl' }}
                />
              </div>
              <span className="text-sm font-bold bg-blue-100 text-blue-950 border border-blue-400 font-bold px-3 py-1 rounded-full font-black">{valueDown}</span>
            </div>
          </div>
          
          <div className="text-xs text-center text-gray-500 bg-gray-50 p-2 rounded">
            Match both numbers exactly to continue.
          </div>
        </div>
      )}
    </div>
  );
};
