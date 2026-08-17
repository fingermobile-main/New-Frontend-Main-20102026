import React, { useState } from 'react';
interface AudioCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientAvatar?: string;
}

const AudioCallModal: React.FC<AudioCallModalProps> = ({
  isOpen,
  onClose,
  recipientName = 'User',
  recipientAvatar
}) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-between p-8">
        {/* Top Bar */}
        <div className="w-full flex items-center justify-end">
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Avatar */}
          <div className="mb-8">
            {recipientAvatar ? (
              <img
                src={recipientAvatar}
                alt={recipientName}
                className={`w-40 h-40 rounded-full border-4 border-white shadow-2xl ${
                  callStatus === 'connecting' ? 'animate-pulse' : ''
                }`}
               />
            ) : (
              <div className={`w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl ${
                callStatus === 'connecting' ? 'animate-pulse' : ''
              }`}>
                <span className="text-7xl text-white font-bold">{recipientName.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Name and Status */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{recipientName}</h2>
            <p className="text-xl text-gray-300">
              {callStatus === 'connecting' && 'Calling...'}
              {callStatus === 'connected' && formatDuration(callDuration)}
              {callStatus === 'ended' && 'Call ended'}
            </p>
          </div>

          {/* Audio Wave Animation */}
          {callStatus === 'connected' && (
            <div className="flex items-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-blue-400 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-6 pb-8">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span className="text-white text-3xl">{isMuted ? '🔇' : '🎤'}</span>
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
              isSpeakerOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span className="text-white text-3xl">{isSpeakerOn ? '🔊' : '🔈'}</span>
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
          >
            <span className="text-white text-4xl">📞</span>
          </button>

          {/* Keypad */}
          <button className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all transform hover:scale-110">
            <span className="text-white text-3xl">⌨️</span>
          </button>

          {/* More Options */}
          <button className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all transform hover:scale-110">
            <span className="text-white text-3xl">⋯</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioCallModal;