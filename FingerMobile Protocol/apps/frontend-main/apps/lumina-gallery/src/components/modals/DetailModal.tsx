import React, { useEffect, useRef, useState } from 'react'; // FIXED: Imported React namespace safely
import { voiceLinesService } from '../../services/voiceLinesService'; // NEW: Import voice lines service
import { mediaApiService } from '../../services/api';

interface Artwork {
  id: number;
  title: string;
  desc: string;
  img: string;
  color: string;
  stage: string;
  ficReward: number;
  isUserContent?: boolean;
}

interface DetailModalProps {
  artwork: Artwork;
  onClose: () => void;
  onClaimReward: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ artwork, onClose, onClaimReward }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const p2pTimerRef = useRef<NodeJS.Timeout | null>(null); // NEW: Reference to store timer for cleanup
  // NEW: State for P2P matching data
  const [p2pData, setP2pData] = useState<any>(null);
  const [p2pLoading, setP2pLoading] = useState(true);
  const [p2pError, setP2pError] = useState(false);

  // NEW: Function to trigger voice line when reward is claimed
  const triggerRewardVoiceLine = async () => {
    try {
      await voiceLinesService.triggerVoiceLineByCategory('achievement');
    } catch (error) {
      console.error('Error triggering reward voice line:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
      // Clean up timer when component unmounts or dependencies change
      if (p2pTimerRef.current) {
        clearTimeout(p2pTimerRef.current);
      }
    };
  }, [onClose]);

  // Fetch P2P matching data when modal opens
  useEffect(() => {
    const fetchP2PData = async () => {
      setP2pLoading(true);
      setP2pError(false);
      
      try {
        const data = await mediaApiService.getP2PMatching(artwork.id);
        setP2pData(data);
      } catch (error) {
        console.error('Error fetching P2P data:', error);
        setP2pError(true);
      } finally {
        setP2pLoading(false);
      }
    };

    fetchP2PData();
  }, [artwork.id, artwork.isUserContent]);

  return (
    <div 
      id="detail-modal" 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md opacity-0 transition-opacity duration-300"
      style={{ display: 'flex', opacity: 1 }}
    >
      <div 
        ref={modalRef}
        className="glass-panel w-full max-w-5xl h-[85vh] md:h-[650px] m-4 rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl transform scale-100 transition-transform duration-300 border border-yellow-400/20"
        id="modal-content"
      >
        {/* Close Button */}
        <button 
          id="close-modal" 
          className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/40 hover:bg-yellow-400/20 text-white transition-colors border border-white/10"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-3/5 h-1/2 md:h-full bg-black relative overflow-hidden group">
          <img 
            id="modal-img" 
            src={artwork.img} 
            alt={artwork.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
          
          {/* FIC Earn Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="glass-panel p-4 rounded-xl border border-yellow-400/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Viewing Reward</div>
                  <div className="text-xl font-bold text-yellow-400 font-orbitron">+{artwork.ficReward.toFixed(2)} FIC</div>
                </div>
                <button 
                  className="bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-yellow-400/50"
                  onClick={() => {
                    onClaimReward();
                    triggerRewardVoiceLine(); // NEW: Trigger voice line when reward is claimed
                  }}
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full md:w-2/5 h-1/2 md:h-full p-8 md:p-10 flex flex-col justify-center relative overflow-y-auto bg-gradient-to-b from-gray-900/50 to-black/80">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <svg className="w-32 h-32 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold tracking-wider border border-yellow-400/30">
              SYNTHETIC
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-400/10 text-blue-400 text-xs font-bold tracking-wider border border-blue-400/30">
              STAGE <span id="modal-stage">{artwork.stage}</span>
            </span>
          </div>
          
          <h2 id="modal-title" className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-yellow-400 font-orbitron">
            {artwork.title}
          </h2>
          
          <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-orange-500 mb-6 rounded-full"></div>
          
          <p id="modal-desc" className="text-gray-300 leading-relaxed font-light text-base mb-6">
            {artwork.desc}
          </p>

          {/* P2P Matching Indicator - UPDATED */}
          <div className="glass-panel p-4 rounded-xl mb-6 border border-blue-400/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Sentinel P2P Status</span>
              {p2pLoading ? (
                <span className="text-xs text-yellow-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                  Loading...
                </span>
              ) : p2pError ? (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  Error
                </span>
              ) : p2pData ? (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Active
                </span>
              ) : (
                <span className="text-xs text-gray-400">No data</span>
              )}
            </div>
            
            {!p2pLoading && p2pData && (
              <>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500" 
                      style={{ width: `${(p2pData.matchesCount / 10) * 100}%` }} // Scale to max of 10 matches
                    ></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {p2pData.matchesCount} potential matches found for this asset
                </div>
                
                {p2pData.matches && p2pData.matches.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
                    {p2pData.matches.slice(0, 3).map((match: any, idx: number) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-300">{match.name}</span>
                          <span className="text-yellow-400">Bid: {match.bidAmount} FIC</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                          <div 
                            className="h-1 rounded-full bg-green-500" 
                            style={{ width: `${match.credibility * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500 uppercase tracking-widest">
            <span>Digital Collection</span>
            <span id="modal-year">2026</span> {/* Updated to represent production date context */}
          </div>
          
          <div className="mt-4 font-mono text-xs text-gray-600 break-all">
            Hash: <span className="text-yellow-400/60">8b7c589c1a8f2efc02adcb0aa1e3b14fe40bc77db...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;