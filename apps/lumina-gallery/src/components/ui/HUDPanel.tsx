import { useState } from 'react';
import { voiceLinesService } from '../../services/voiceLinesService'; // NEW: Import voice lines service

interface HUDPanelProps {
  ficBalance: number;
  onUploadToggle?: () => void;
  hasUserMedia?: boolean;
}

const HUDPanel: React.FC<HUDPanelProps> = ({ ficBalance, onUploadToggle, hasUserMedia = false }) => {
  const [autoRotate, setAutoRotate] = useState(true);

  // NEW: Function to trigger voice line when balance is displayed
  const triggerBalanceVoiceLine = async () => {
    try {
      await voiceLinesService.triggerVoiceLineByCategory('achievement');
    } catch (error) {
      console.error('Error triggering balance voice line:', error);
    }
  };

  // NEW: Function to trigger voice line when upload button is clicked
  const triggerUploadVoiceLine = async () => {
    try {
      await voiceLinesService.triggerVoiceLineByCategory('funding');
    } catch (error) {
      console.error('Error triggering upload voice line:', error);
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  return (
    <div className="flex justify-between items-start pointer-events-auto">
      <div className="flex items-center gap-4">
        <div 
          className="hud-panel flex items-center gap-3"
          onClick={triggerBalanceVoiceLine} // NEW: Trigger voice line when balance panel is clicked
        >
          <div className="coin-container" style={{ width: '32px', height: '32px' }}>
            <div className="infinite-coin" style={{ animationDuration: '3s' }}>
              <div className="coin-face" style={{ borderWidth: '1px' }}></div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">FIC Balance</div>
            <div className="text-lg font-bold text-yellow-400 font-orbitron">{ficBalance.toFixed(2)}</div>
          </div>
        </div>

        <div className="hud-panel hidden md:block">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Gallery Status</div>
          <div className="text-sm font-semibold text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            LIVE
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {hasUserMedia && (
          <button 
            className="hud-panel hover:border-purple-400/50 transition-colors flex items-center gap-2"
            title="Add More Content"
            onClick={() => {
              onUploadToggle?.();
              triggerUploadVoiceLine(); // NEW: Trigger voice line when upload button is clicked
            }}
          >
            <svg 
              className="w-4 h-4 text-purple-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span className="hidden sm:inline text-xs">Add Content</span>
          </button>
        )}
        
        {!hasUserMedia && (
          <button 
            className="hud-panel hover:border-yellow-400/50 transition-colors flex items-center gap-2"
            title="Upload Content"
            onClick={() => {
              onUploadToggle?.();
              triggerUploadVoiceLine(); // NEW: Trigger voice line when upload button is clicked
            }}
          >
            <svg 
              className="w-4 h-4 text-yellow-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <span className="hidden sm:inline text-xs">Upload</span>
          </button>
        )}
        
        <button 
          className="hud-panel hover:border-blue-400/50 transition-colors" 
          title="Dashboard"
          onClick={() => {
            // NEW: Trigger voice line when dashboard button is clicked
            voiceLinesService.triggerVoiceLineByCategory('greeting');
          }}
        >
          <svg 
            className="w-5 h-5 text-blue-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HUDPanel;