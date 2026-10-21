/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import LuminaGalleryScene from './scenes/LuminaGalleryScene';
import NeuralBackground from './components/common/NeuralBackground';
import LoadingScreen from './components/common/LoadingScreen';
import HUDPanel from './components/ui/HUDPanel';
import DetailModal from './components/modals/DetailModal';
import MediaUpload from './components/common/MediaUpload';
import { MediaFile, releaseMediaFile } from './utils/mediaProcessing';
import useMediaUpload from './hooks/useMediaUpload';
import { mediaApiService } from './services/api'; // NEW: Import the API service
import { voiceLinesService } from './services/voiceLinesService'; // NEW: Import voice lines service
import './styles/index.css';

// Type definitions for artwork data
interface ArtworkData {
  id: number;
  title: string;
  desc: string;
  img: string;
  color: string;
  stage: string;
  ficReward: number;
  isUserContent?: boolean;
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkData | null>(null);
  const [ficBalance, setFicBalance] = useState(2.00); // Will be updated from API
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [userMedia, setUserMedia] = useState<MediaFile[]>([]);
  const userId = 'user_123'; // In a real app, this would come from auth
  
  const { uploading, progress, error, uploadedFiles, uploadFiles, reset } = useMediaUpload();
  const greetingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simple deterministic string-to-number hash for id conversion safety
  const stringToUniqueId = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(1000 + (hash % 1000000));
  };

  // Load user balance from API on mount
  useEffect(() => {
    const loadUserBalance = async () => {
      try {
        const balanceData = await mediaApiService.getUserBalance(userId);
        setFicBalance(balanceData.balance);
      } catch (err) {
        // Keep the default balance if API fails
      }
    };
    
    loadUserBalance();
  }, [userId]);

  // Trigger greeting with memory cleanup protection
  useEffect(() => {
    if (!isLoading) {
      greetingTimerRef.current = setTimeout(async () => {
        try {
          await voiceLinesService.triggerVoiceLineByCategory('greeting');
        } catch (err) {
          // Silently fail - greeting is optional
        }
      }, 2000);
    }
    
    return () => {
      if (greetingTimerRef.current) {
        clearTimeout(greetingTimerRef.current);
      }
    };
  }, [isLoading]);

  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  // Handle newly uploaded files safely
  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      setUserMedia(prev => [...prev, ...uploadedFiles]);
      setShowUploadPanel(false);
      
      try {
        voiceLinesService.triggerVoiceLineByCategory('achievement');
      } catch (err) {
        // Voice lines are secondary enhancements
      }
      
      // Clean hook internal arrays to prevent loop triggers
      reset(); 
    }
  }, [uploadedFiles, reset]);

  const handleOpenModal = (artwork: ArtworkData) => {
    setSelectedArtwork(artwork);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArtwork(null);
  };

  const handleClaimReward = async () => {
    if (selectedArtwork) {
      try {
        // NEW: Actually call the API to claim reward
        const result = await mediaApiService.claimReward(userId, selectedArtwork.id);
        setFicBalance(result.balance); // Update balance from API response
        
        // Trigger achievement voice line for claiming reward
        voiceLinesService.triggerVoiceLineByCategory('achievement');
      } catch (err) {
        // Fallback to local state update if API fails
        setFicBalance(prev => prev + selectedArtwork.ficReward);
      }
    }
  };

  const handleUploadFiles = async (files: FileList | File[]) => {
    // Process files collectively or sequentially via the hook array input safely
    try {
      const fileArray = Array.from(files);
      await uploadFiles(fileArray); 
    } catch (err) {
      console.error("File upload batch encountered an error", err);
    }
  };

  const removeUserMedia = (id: string) => {
    setUserMedia(prev => {
      const mediaToRemove = prev.find(m => m.id === id);
      if (mediaToRemove) {
        releaseMediaFile(mediaToRemove); // Clean up object URL
      }
      return prev.filter(m => m.id !== id);
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Abstract conversion payload away from messy jsx clutter 
  const createArtworkPayload = (media: MediaFile): ArtworkData => ({
    id: stringToUniqueId(media.id),
    title: media.metadata.fileName,
    desc: `User uploaded content: ${media.metadata.fileName}`,
    img: media.previewUrl,
    color: "#FFD700",
    stage: "U1",
    ficReward: 0.05,
    isUserContent: true
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-dark-bg text-white">
      {/* Neural Network Background */}
      <NeuralBackground />
      
      {/* 3D Canvas Container */}
      <div id="canvas-container" className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 50 }}>
          {/* @ts-ignore - React Three ForwardRef component type compatibility */}
          <DreiOrbitControls enableZoom={false} enablePan={false} />
          <LuminaGalleryScene 
            onArtworkClick={handleOpenModal} 
            userMedia={userMedia}
          />
          {/* @ts-ignore - Three.js primitive elements */}
          <ambientLight intensity={0.3} color="#ffffff" />
          {/* @ts-ignore - Three.js primitive elements */}
          <spotLight 
            intensity={1} 
            color="#ffffff" 
            angle={0.15} 
            penumbra={1} 
            position={[10, 10, 10]} 
            castShadow 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* @ts-ignore - Three.js primitive elements */}
          <pointLight 
            intensity={0.5} 
            color="#ffffff" 
            position={[-10, -10, -10]} 
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div id="ui-layer" className="absolute inset-0 z-10 p-6 md:p-8 pointer-events-none">
        <HUDPanel 
          ficBalance={ficBalance} 
          onUploadToggle={() => setShowUploadPanel(!showUploadPanel)} 
          hasUserMedia={userMedia.length > 0}
        />
        
        {/* Center Info */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto">
          <div className="hud-panel px-6 py-3 rounded-full bg-[rgba(0,0,0,0.6)] backdrop-blur-sm border border-[rgba(255,215,0,0.2)] border-opacity-20">
            <p className="text-sm text-gray-300 font-light flex items-center gap-3">
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
              </svg>
              <span>Drag to Rotate</span>
              <span className="text-gray-500">•</span>
              <span>Click Art to View</span>
              <span className="text-gray-500">•</span>
              <span className="text-yellow-400">Earn FIC</span>
            </p>
          </div>
        </div>
      </div>

      {/* Upload Panel */}
      {showUploadPanel && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl p-6 border-t border-[rgba(255,215,0,0.2)]">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-neon-gold font-orbitron">UPLOAD MEDIA</h3>
              <button 
                onClick={() => setShowUploadPanel(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <MediaUpload 
                  onUpload={handleUploadFiles}
                  allowedTypes={['image/', 'video/']}
                  maxSizeMB={50}
                />
                
                {uploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-neon-gold h-2.5 rounded-full transition-all duration-300 ease-out" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-400 mt-1">
                      Uploading... {progress}%
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="mt-2 p-3 bg-red-900/50 text-red-200 text-sm rounded-lg">
                    {error}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-300">Your Gallery Content</h4>
                {userMedia.length === 0 ? (
                  <p className="text-gray-500 italic">No user content added yet. Upload images or videos to see them in the gallery!</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {userMedia.map(media => (
                      <div key={media.id} className="aspect-square relative group">
                        <div 
                          className="w-full h-full rounded-lg overflow-hidden cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onClick={() => handleOpenModal(createArtworkPayload(media))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleOpenModal(createArtworkPayload(media));
                            }
                          }}
                        >
                          {media.type === 'image' ? (
                            <img 
                              src={media.previewUrl} 
                              alt={media.metadata.fileName} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video 
                              src={media.previewUrl} 
                              className="w-full h-full object-cover"
                              muted
                              preload="none"
                            />
                          )}
                        </div>
                        
                        <button
                          onClick={() => removeUserMedia(media.id)}
                          className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove file"
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] bg-black/70 text-white">
                          {media.type === 'image' ? 'IMG' : 'VID'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedArtwork && (
        <DetailModal 
          artwork={selectedArtwork} 
          onClose={handleCloseModal} 
          onClaimReward={handleClaimReward}
        />
      )}
    </div>
  );
};

export default App;