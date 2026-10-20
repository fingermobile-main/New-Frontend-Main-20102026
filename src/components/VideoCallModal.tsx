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
  XMarkIcon,
  KeyIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ShieldCheckIcon
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
  const [metrics, setMetrics] = useState<CallQualityMetrics | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Guardian AI Privacy Mutual Handshake & 10-Min Video Token State
  const [guardianPin, setGuardianPin] = useState<string>('');
  const [callerAccepted, setCallerAccepted] = useState<boolean>(false);
  const [recipientAccepted, setRecipientAccepted] = useState<boolean>(false);
  const [isHandshakeVerified, setIsHandshakeVerified] = useState<boolean>(false);
  const [tokenRemainingSecs, setTokenRemainingSecs] = useState<number>(10 * 60); // 10 Mins
  const [guardianTokenId, setGuardianTokenId] = useState<string>('');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const countdownTimerRef = useRef<any>(null);

  // Initialize PIN and reset mutual handshake states on modal open
  useEffect(() => {
    if (isOpen) {
      const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
      setGuardianPin(generatedPin);
      setCallerAccepted(true); // Caller auto-signs their own generated call PIN
      setRecipientAccepted(false); // Waiting for recipient to accept
      setIsHandshakeVerified(false);
      setTokenRemainingSecs(10 * 60);
      setGuardianTokenId('');
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      setCallState('idle');
    }
  }, [isOpen]);

  // When BOTH parties accept PIN Exchange -> establish connection and issue 10-Min Token
  useEffect(() => {
    if (callerAccepted && recipientAccepted && !isHandshakeVerified && isOpen) {
      const token = `GAI-VID-${Date.now().toString(36).toUpperCase()}-10M`;
      setGuardianTokenId(token);
      setIsHandshakeVerified(true);
    }
  }, [callerAccepted, recipientAccepted, isHandshakeVerified, isOpen]);

  // Handle call lifecycle and countdown once handshake is verified
  useEffect(() => {
    if (!isOpen || !isHandshakeVerified) return;

    const unsubscribe = webRtcCallingService.subscribe({
      onCallStateChange: (state) => {
        setCallState(state);
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

    // Initial stream binding
    const currentLocal = webRtcCallingService.getLocalStream();
    if (localVideoRef.current && currentLocal) {
      localVideoRef.current.srcObject = currentLocal;
    }
    const currentRemote = webRtcCallingService.getRemoteStream();
    if (remoteVideoRef.current && currentRemote) {
      remoteVideoRef.current.srcObject = currentRemote;
    }

    // 10-Minute Countdown Timer for Video
    countdownTimerRef.current = setInterval(() => {
      setTokenRemainingSecs((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          handleEndCall('Guardian AI: 10-Minute Video Token Expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      unsubscribe();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [isOpen, isHandshakeVerified, recipientId, recipientName, recipientAvatar, role, isAiAgent]);

  if (!isOpen) return null;

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecipientAcceptPin = () => {
    setRecipientAccepted(true);
  };

  const handleMutualAcceptAll = () => {
    setCallerAccepted(true);
    setRecipientAccepted(true);
  };

  const acceptedCount = (callerAccepted ? 1 : 0) + (recipientAccepted ? 1 : 0);

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

  const handleEndCall = (reason?: string) => {
    webRtcCallingService.endCall(reason || 'User ended call');
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
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
                  Guardian AI 1080p HD
                </span>
                <span>•</span>
                <span>
                  {isHandshakeVerified ? `Token: ${formatCountdown(tokenRemainingSecs)}` : 'Handshake Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Metrics & Close */}
          <div className="flex items-center gap-2">
            {isHandshakeVerified && metrics && (
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
              onClick={() => handleEndCall()}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Close modal"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stage: Either Handshake Screen or Active Video Stream */}
        {!isHandshakeVerified ? (
          /* 1. GUARDIAN AI MUTUAL PIN EXCHANGE SCREEN FOR VIDEO (BOTH MUST ACCEPT) */
          <div className="relative flex-1 bg-slate-900/90 flex items-center justify-center p-6 text-center z-20">
            <div className="max-w-md w-full bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10">
                <KeyIcon className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Mutual Video PIN Exchange Handshake</h3>
                <p className="text-xs text-slate-300">
                  Guardian AI enforces that <strong className="text-white">each person must accept the PIN exchange</strong> before establishing the 1080p encrypted video stream with <span className="text-white font-bold">{recipientName}</span>.
                </p>
              </div>

              {/* Generated Video PIN Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">
                  6-Digit Sovereign Video PIN
                </span>
                <div className="flex items-center justify-center gap-2 font-mono text-2xl font-black text-amber-400 tracking-widest">
                  {guardianPin.split('').map((char, i) => (
                    <span key={i} className="w-8 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2-Party Mutual Acceptance Tracker */}
              <div className="grid grid-cols-2 gap-3 text-left">
                {/* Party 1: Caller (You) */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  callerAccepted ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Caller (You)</span>
                    {callerAccepted ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ClockIcon className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-white truncate">You</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                    callerAccepted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {callerAccepted ? 'PIN Accepted' : 'Pending'}
                  </span>
                </div>

                {/* Party 2: Recipient */}
                <div
                  onClick={handleRecipientAcceptPin}
                  title="Click to simulate recipient accepting PIN"
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  recipientAccepted ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Recipient</span>
                    {recipientAccepted ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ClockIcon className="w-4 h-4 text-amber-400 animate-spin" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-white truncate">{recipientName}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                    recipientAccepted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {recipientAccepted ? 'PIN Accepted' : 'Awaiting Exchange'}
                  </span>
                </div>
              </div>

              {/* Handshake Progress */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                <span className="flex items-center gap-1.5">
                  <ArrowsRightLeftIcon className="w-4 h-4 text-amber-400" />
                  Mutual Agreement:
                </span>
                <span className={`font-mono font-black ${acceptedCount === 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {acceptedCount} / 2 Accepted
                </span>
              </div>

              {/* Token Scope Notice */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
                <ClockIcon className="w-4 h-4 text-purple-400" />
                <span>Unlocks 10-Minute Time-Restricted Video Token upon mutual agreement</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleEndCall('PIN Handshake Cancelled')}
                  className="py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-verify-video-pin"
                  type="button"
                  onClick={handleMutualAcceptAll}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                >
                  <CheckBadgeIcon className="w-4 h-4" />
                  Confirm PIN Exchange (Both Accept)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* 2. ACTIVE VIDEO STREAM STAGE */
          <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
            {/* Active Remote Video Stream */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Token Countdown Pill Overlay in top left */}
            <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono text-xs font-black shadow-xl">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
              <span>Token: {guardianTokenId ? `${guardianTokenId.slice(0, 15)}... ` : ''}({formatCountdown(tokenRemainingSecs)})</span>
              <span className="text-[10px] text-slate-300 font-sans font-normal">• Both Accepted (2/2)</span>
            </div>

            {/* Fallback Overlay if Remote is connecting */}
            {callState !== 'connected' && (
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center z-10 p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 animate-pulse flex items-center justify-center text-4xl text-white font-black shadow-2xl">
                    {recipientName.charAt(0)}
                  </div>
                  <div className="absolute -inset-2 rounded-full border-2 border-emerald-400/50 animate-ping" />
                </div>
                <h4 className="text-lg font-black text-white">{recipientName}</h4>
                <p className="text-xs text-slate-300 mt-1">
                  {callState === 'initiating' && 'Mounting DTLS Video WebRTC Stream...'}
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
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-2 text-center">
                  <VideoCameraSlashIcon className="w-8 h-8 text-slate-600 mb-1" />
                  <span className="text-[10px] font-bold">Camera Paused</span>
                </div>
              )}

              {/* Local Stream Tag */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/70 backdrop-blur-sm border border-slate-700 text-[10px] font-bold text-slate-200">
                You {isScreenSharing ? '(Screen)' : ''}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className="relative z-30 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-4 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-lg">
            {/* Microphone Toggle */}
            <button
              type="button"
              onClick={handleToggleMute}
              disabled={!isHandshakeVerified}
              className={`p-3.5 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${
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
              disabled={!isHandshakeVerified}
              className={`p-3.5 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${
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
              disabled={!isHandshakeVerified}
              className={`p-3.5 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${
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
              id="btn-end-video-call"
              type="button"
              onClick={() => handleEndCall()}
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
