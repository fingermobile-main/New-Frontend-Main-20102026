import React, { useEffect, useRef } from 'react';

interface SpecialEffect {
  effect: string;
  onComplete: () => void;
}

const SpecialEffectOverlay: React.FC<SpecialEffect> = ({ effect, onComplete }) => {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  
  React.useEffect(() => {
    // Simulate effect completion after some time
    timerRef.current = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds timeout for demo purposes

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      {effect === "confetti" && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/10 to-transparent animate-pulse">
          {/* Confetti effect would go here */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  animationDelay: `${Math.random() * 2}s`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0'
                }}
              />
            ))}
          </div>
        </div>
      )}
      {effect !== "confetti" && (
        <div className="bg-gray-800/80 text-white p-4 rounded-lg">
          <p>Special effect: {effect}</p>
        </div>
      )}
    </div>
  );
};

export default SpecialEffectOverlay;