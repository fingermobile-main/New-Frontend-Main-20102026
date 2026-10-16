import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneXMarkIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  TvIcon,
  LockClosedIcon,
  SignalIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  webRtcCallingService,
  CallState,
  CallQualityMetrics
} from '../services/webRtcCallingService';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientAvatar?: string;
  recipientId?: string;
  role?: string;
  isAiAgent?: boolean;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  recipientName = 'Sovereign Peer',
  recipientAvatar,
  recipientId = 'usr-peer',
  role = 'Member',
  isAiAgent = false
}) => {
  const [callState, setCallState] = useState<CallState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [metrics, setMetrics] = useState<CallQualityMetrics | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<any>(null);

  // Initialize and handle WebRTC call session lifecycle
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
      setCallState('idle');
      return;
    }

    const unsubscribe = webRtcCallingService.subscribe({
      onCallStateChange: (state) => {
        setCallState(state);
        if (state === 'connected') {
          if (!timerRef.current) {
            timerRef.current = setInterval(() => {
              setCallDuration((prev) => prev + 1);
            }, 1000);
          }
        } else if (state === 'ended' || state === 'failed') {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      },
      onLocalStream: (stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      },
      onRemoteStream: (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play().catch(() => {});
        }
      },
      onQualityMetrics: (qMetrics) => {
        setMetrics(qMetrics);
      }
    });

    // Start WebRTC Call
    webRtcCallingService.startCall(
      {
        id: recipientId,
        name: recipientName,
        avatar: recipientAvatar,
        role,
        isAiAgent
      },
      'video'
    );

    // Initial stream binding if already cached
    const currentLocal = webRtcCallingService.getLocalStream();
    if (localVideoRef.current && currentLocal) {
      localVideoRef.current.srcObject = currentLocal;
    }
    const currentRemote = webRtcCallingService.getRemoteStream();
    if (remoteVideoRef.current && currentRemote) {
      remoteVideoRef.current.srcObject = currentRemote;
    }

    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, recipientId, recipientName, recipientAvatar, role, isAiAgent]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    const muted = webRtcCallingService.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleVideo = () => {
    const paused = webRtcCallingService.toggleVideo();
    setIsVideoPaused(paused);
  };

  const handleToggleScreenShare = async () => {
    const sharing = await webRtcCallingService.toggleScreenShare();
    setIsScreenSharing(sharing);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleEndCall = () => {
    webRtcCallingService.endCall();
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      {/* Video Call Modal Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl h-[88vh] max-h-[780px] bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between"
      >
        {/* Top Control Bar (Overlay) */}
        <div className="relative z-30 flex items-center justify-between p-4 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent">
          {/* Peer Info & Cryptographic Status */}
          <div className="flex items-center gap-3">
            {recipientAvatar ? (
              <img
                src={recipientAvatar}
                alt={recipientName}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white text-sm">
                {recipientName.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">{recipientName}</h3>
                {isAiAgent && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/30 text-purple-300 border border-purple-400/40 flex items-center gap-1 font-bold">
                    <SparklesIcon className="w-3 h-3" />
                    Pipecat Vision
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <LockClosedIcon className="w-3 h-3" />
                  STERCS™ 1080p HD
                </span>
                <span>•</span>
                <span>
                  {callState === 'connected' ? formatDuration(callDuration) : callState}
                </span>
              </div>
            </div>
          </div>

          {/* Right Metrics & Close */}
          <div className="flex items-center gap-2">
            {metrics && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-xs">
                <SignalIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{metrics.latencyMs}ms</span>
                <span>•</span>
                <span>{metrics.resolution}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="w-4 h-4" />
              ) : (
                <ArrowsPointingOutIcon className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleEndCall}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Close modal"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stage: Remote Video Stream */}
        <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
          {/* Active Remote Video Stream */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Fallback Overlay if Remote is connecting or not yet video-transmitting */}
          {callState !== 'connected' && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center z-10 p-6 text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 animate-pulse flex items-center justify-center text-4xl text-white font-black shadow-2xl">
                  {recipientName.charAt(0)}
                </div>
                <div className="absolute -inset-2 rounded-full border-2 border-emerald-400/50 animate-ping" />
              </div>
              <h4 className="text-lg font-black text-white">{recipientName}</h4>
              <p className="text-xs text-slate-400 mt-1">
                {callState === 'initiating' && 'Negotiating WebRTC DTLS Offer & ICE Candidates...'}
                {callState === 'ringing' && 'Ringing remote peer camera feed...'}
                {callState === 'failed' && 'Session error. Please retry.'}
              </p>
            </div>
          )}

          {/* Picture-in-Picture: Local Camera Preview */}
          <div className="absolute bottom-6 right-6 z-20 w-36 h-48 sm:w-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950 group">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                isVideoPaused ? 'hidden' : 'block'
              }`}
            />

            {isVideoPaused && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2 text-center">
                <VideoCameraSlashIcon className="w-8 h-8 text-slate-500 mb-1" />
                <span className="text-[10px] font-bold">Camera Paused</span>
              </div>
            )}

            {/* Local Stream Tag */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/70 backdrop-blur-sm border border-slate-700 text-[10px] font-bold text-slate-200">
              You {isScreenSharing ? '(Screen)' : ''}
            </div>
          </div>
        </div>

        {/* Bottom Floating Control Bar */}
        <div className="relative z-30 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-4 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-lg">
            {/* Microphone Toggle */}
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-3.5 rounded-xl flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>

            {/* Camera Toggle */}
            <button
              type="button"
              onClick={handleToggleVideo}
              className={`p-3.5 rounded-xl flex items-center justify-center transition-all ${
                isVideoPaused
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isVideoPaused ? 'Resume Camera' : 'Pause Camera'}
            >
              {isVideoPaused ? (
                <VideoCameraSlashIcon className="w-5 h-5" />
              ) : (
                <VideoCameraIcon className="w-5 h-5" />
              )}
            </button>

            {/* Screen Sharing Toggle */}
            <button
              type="button"
              onClick={handleToggleScreenShare}
              className={`p-3.5 rounded-xl flex items-center justify-center transition-all ${
                isScreenSharing
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title="Share Screen"
            >
              <TvIcon className="w-5 h-5" />
            </button>

            {/* End Call Button */}
            <button
              type="button"
              onClick={handleEndCall}
              className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black flex items-center gap-2 shadow-lg shadow-red-600/40 transition-transform active:scale-95"
              title="End Video Session"
            >
              <PhoneXMarkIcon className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider hidden sm:inline">End Call</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoCallModal;
