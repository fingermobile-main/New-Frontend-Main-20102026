import { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // Adjust speed as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="loader" 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white transition-opacity duration-1000"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="coin-container">
          <div className="infinite-coin">
            <div className="coin-face"></div>
          </div>
        </div>
        <div className="text-3xl font-orbitron font-bold tracking-widest">LUMINA</div>
      </div>
      <div className="w-64 h-[1px] bg-gray-800 relative overflow-hidden">
        <div 
          id="loader-progress" 
          className="loader-bar absolute top-0 left-0 h-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 text-xs text-gray-500 tracking-widest uppercase">
        Synthesizing Gallery...
      </div>
      <div className="mt-2 text-xs text-yellow-400/60 font-mono">
        FMP-GTCR-2025-IFC901X
      </div>
    </div>
  );
};

export default LoadingScreen;