import React, { useState } from 'react';
interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientAvatar?: string;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  recipientName = 'User',
  recipientAvatar
}) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
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
      {/* Full Screen Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-between p-8">
        {/* Top Bar */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {recipientAvatar ? (
              <img src={recipientAvatar} alt={recipientName} className="w-12 h-12 rounded-full border-2 border-white"  />
            ) : (
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {recipientName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-white font-semibold">{recipientName}</h3>
              <p className="text-gray-300 text-sm">
                {callStatus === 'connecting' && 'Calling...'}
                {callStatus === 'connected' && formatDuration(callDuration)}
                {callStatus === 'ended' && 'Call ended'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 flex items-center justify-center w-full max-w-4xl">
          {callStatus === 'connecting' && (
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-4 animate-pulse">
                {recipientAvatar ? (
                  <img src={recipientAvatar} alt={recipientName} className="w-full h-full rounded-full object-cover"  />
                ) : (
                  <span className="text-6xl text-white font-bold">{recipientName.charAt(0)}</span>
                )}
              </div>
              <p className="text-white text-xl">Connecting...</p>
            </div>
          )}

          {callStatus === 'connected' && (
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
              {/* Remote Video (placeholder) */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white text-lg">Remote video stream</span>
              </div>

              {/* Local Video Preview */}
              <div className="absolute bottom-4 right-4 w-32 h-48 bg-gray-800 rounded-lg border-2 border-white overflow-hidden">
                {!isVideoOff ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs">You</span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <span className="text-gray-500 text-2xl">📹</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {callStatus === 'ended' && (
            <div className="text-center">
              <div className="text-6xl mb-4">📞</div>
              <p className="text-white text-2xl font-bold">Call Ended</p>
              <p className="text-gray-300 mt-2">Duration: {formatDuration(callDuration)}</p>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span className="text-white text-2xl">{isMuted ? '🔇' : '🎤'}</span>
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span className="text-white text-2xl">{isVideoOff ? '📹' : '🎥'}</span>
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all transform hover:scale-110"
          >
            <span className="text-white text-3xl">📞</span>
          </button>

          {/* Speaker */}
          <button className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all">
            <span className="text-white text-2xl">🔊</span>
          </button>

          {/* More Options */}
          <button className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all">
            <span className="text-white text-2xl">⋯</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
