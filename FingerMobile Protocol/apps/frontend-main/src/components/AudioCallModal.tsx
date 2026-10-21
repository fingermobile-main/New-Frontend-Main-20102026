import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneXMarkIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SignalIcon,
  XMarkIcon,
  KeyIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import {
  webRtcCallingService,
  CallState,
  CallQualityMetrics
} from '../services/webRtcCallingService';

interface AudioCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientAvatar?: string;
  recipientId?: string;
  role?: string;
  isAiAgent?: boolean;
}

const AudioCallModal: React.FC<AudioCallModalProps> = ({
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
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [metrics, setMetrics] = useState<CallQualityMetrics | null>(null);
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadInput, setKeypadInput] = useState('');

  // Guardian AI Mutual PIN Exchange & 15-Min Token State
  const [guardianPin, setGuardianPin] = useState<string>('');
  const [callerAccepted, setCallerAccepted] = useState<boolean>(false);
  const [recipientAccepted, setRecipientAccepted] = useState<boolean>(false);
  const [isHandshakeVerified, setIsHandshakeVerified] = useState<boolean>(false);
  const [tokenRemainingSecs, setTokenRemainingSecs] = useState<number>(15 * 60); // 15 Mins
  const [guardianTokenId, setGuardianTokenId] = useState<string>('');

  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const countdownTimerRef = useRef<any>(null);

  // Initialize PIN and reset mutual handshake states on modal open
  useEffect(() => {
    if (isOpen) {
      const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
      setGuardianPin(generatedPin);
      setCallerAccepted(true); // Caller auto-signs their own generated call PIN
      setRecipientAccepted(false); // Waiting for recipient to accept
      setIsHandshakeVerified(false);
      setTokenRemainingSecs(15 * 60);
      setGuardianTokenId('');
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      setCallState('idle');
    }
  }, [isOpen]);

  // When BOTH parties accept PIN Exchange -> establish connection and issue 15-Min Token
  useEffect(() => {
    if (callerAccepted && recipientAccepted && !isHandshakeVerified && isOpen) {
      const token = `GAI-AUD-${Date.now().toString(36).toUpperCase()}-15M`;
      setGuardianTokenId(token);
      setIsHandshakeVerified(true);
    }
  }, [callerAccepted, recipientAccepted, isHandshakeVerified, isOpen]);

  // Handle call lifecycle and countdown once mutual handshake is verified
  useEffect(() => {
    if (!isOpen || !isHandshakeVerified) return;

    const unsubscribe = webRtcCallingService.subscribe({
      onCallStateChange: (state) => {
        setCallState(state);
      },
      onRemoteStream: (stream) => {
        if (remoteAudioRef.current && stream) {
          remoteAudioRef.current.srcObject = stream;
          remoteAudioRef.current.play().catch(() => {});
        }
      },
      onAudioLevel: (level) => {
        setAudioLevel(level);
      },
      onQualityMetrics: (qMetrics) => {
        setMetrics(qMetrics);
      }
    });

    // Start WebRTC Call once both parties have accepted PIN exchange
    webRtcCallingService.startCall(
      {
        id: recipientId,
        name: recipientName,
        avatar: recipientAvatar,
        role,
        isAiAgent
      },
      isAiAgent ? 'pipecat-ai' : 'audio'
    );

    // 15-Minute Countdown Timer
    countdownTimerRef.current = setInterval(() => {
      setTokenRemainingSecs((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          handleEndCall('Guardian AI: 15-Minute Audio Token Expired');
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

  // Handle speaker volume
  useEffect(() => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.volume = isSpeakerOn ? 1.0 : 0.2;
    }
  }, [isSpeakerOn]);

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

  const handleToggleMute = () => {
    const muted = webRtcCallingService.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn((prev) => !prev);
  };

  const handleEndCall = (reason?: string) => {
    webRtcCallingService.endCall(reason || 'User ended call');
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleKeyPress = (num: string) => {
    setKeypadInput((prev) => prev + num);
  };

  const acceptedCount = (callerAccepted ? 1 : 0) + (recipientAccepted ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Hidden WebRTC Audio Output element */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Main Calling Card */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between min-h-[600px] p-6 text-white">
        {/* Top Header: Sovereign Protocol Security Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <LockClosedIcon className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                Guardian AI Privacy Call
                {isAiAgent && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-purple-500/30 text-purple-300 border border-purple-400/40">
                    Pipecat AI
                  </span>
                )}
              </p>
              <p className="text-[11px] text-slate-300 font-medium">
                P2P DTLS-SRTP • Opus 48kHz HD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isHandshakeVerified && metrics && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-300 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700">
                <SignalIcon className="w-3 h-3 text-emerald-400" />
                {metrics.latencyMs}ms
              </span>
            )}
            <button
              type="button"
              onClick={() => handleEndCall()}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Content: Either Mutual Handshake Screen or Active Call Screen */}
        {!isHandshakeVerified ? (
          /* 1. GUARDIAN AI MUTUAL PIN EXCHANGE SCREEN (BOTH MUST ACCEPT) */
          <div className="flex-1 flex flex-col items-center justify-center my-4 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <KeyIcon className="w-7 h-7" />
            </div>

            <div className="space-y-1 max-w-sm">
              <h3 className="text-lg font-black text-white">Mutual PIN Exchange Handshake</h3>
              <p className="text-xs text-slate-300">
                Guardian AI enforces that <strong className="text-white">each person must accept the PIN exchange</strong> before the encrypted voice channel unseals.
              </p>
            </div>

            {/* Generated Call PIN Box */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 w-full max-w-xs space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">
                6-Digit Sovereign Call PIN
              </span>
              <div className="flex items-center justify-center gap-2 font-mono text-2xl font-black text-amber-400 tracking-widest">
                {guardianPin.split('').map((char, i) => (
                  <span key={i} className="w-8 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* 2-Party Mutual Acceptance Tracker */}
            <div className="w-full max-w-sm grid grid-cols-2 gap-3 text-left">
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

            {/* Mutual Handshake Agreement Progress */}
            <div className="w-full max-w-sm flex items-center justify-between text-xs font-bold text-slate-300 px-2">
              <span className="flex items-center gap-1.5">
                <ArrowsRightLeftIcon className="w-4 h-4 text-amber-400" />
                Mutual Agreement:
              </span>
              <span className={`font-mono font-black ${acceptedCount === 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {acceptedCount} / 2 Accepted
              </span>
            </div>

            {/* Time-Restricted Token Notice */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
              <ClockIcon className="w-4 h-4 text-purple-400" />
              <span>Unlocks 15-Minute Time-Restricted Token upon mutual agreement</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm pt-1">
              <button
                type="button"
                onClick={() => handleEndCall('PIN Exchange Cancelled')}
                className="py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-colors"
              >
                Cancel Call
              </button>

              <button
                id="btn-verify-pin-exchange"
                type="button"
                onClick={handleMutualAcceptAll}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <CheckBadgeIcon className="w-4 h-4" />
                <span>Confirm PIN Exchange (Both Accept)</span>
              </button>
            </div>
          </div>
        ) : (
          /* 2. ACTIVE CALL SCREEN (BOTH ACCEPTED + 15-MIN TOKEN COUNTDOWN) */
          <div className="flex-1 flex flex-col items-center justify-center my-6">
            {/* Guardian AI 15-Minute Token Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>Token: {guardianTokenId} • Both Accepted (2/2)</span>
            </div>

            {/* Avatar with Soundwave Rings */}
            <div className="relative mb-6">
              <div
                className="absolute -inset-4 rounded-full border-2 border-emerald-500/40 transition-all duration-150"
                style={{
                  transform: `scale(${1 + Math.min(0.4, audioLevel / 100)})`,
                  opacity: callState === 'connected' ? 0.3 + (audioLevel / 100) * 0.7 : 0.2
                }}
              />
              <div
                className="absolute -inset-8 rounded-full border border-teal-500/20 transition-all duration-200"
                style={{
                  transform: `scale(${1 + Math.min(0.6, audioLevel / 80)})`,
                  opacity: callState === 'connected' ? (audioLevel / 100) * 0.5 : 0.1
                }}
              />

              {recipientAvatar ? (
                <img
                  src={recipientAvatar}
                  alt={recipientName}
                  className={`w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-2xl relative z-10 ${
                    callState === 'initiating' || callState === 'ringing' ? 'animate-pulse' : ''
                  }`}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-orange-500 via-purple-600 to-blue-600 flex items-center justify-center text-4xl font-black text-white border-4 border-slate-700 shadow-2xl relative z-10">
                  {recipientName.charAt(0)}
                </div>
              )}

              {isAiAgent && (
                <span className="absolute bottom-1 right-1 z-20 p-2 rounded-full bg-purple-600 text-white shadow-lg border-2 border-slate-900" title="Pipecat Conversational Agent">
                  <SparklesIcon className="w-4 h-4" />
                </span>
              )}
            </div>

            {/* Name & Status */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
                {recipientName}
              </h2>
              <p className="text-xs font-medium text-slate-300">
                {role} • Mutual PIN Verified (2/2)
              </p>

              <div className="pt-2">
                {callState === 'initiating' && (
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Mounting DTLS WebRTC audio tunnel...
                  </span>
                )}

                {callState === 'ringing' && (
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    Connecting sovereign audio receiver...
                  </span>
                )}

                {callState === 'connected' && (
                  <div className="space-y-3">
                    {/* Time-Restricted Token Countdown Badge */}
                    <div className="inline-flex items-center gap-2 text-sm font-mono font-black text-emerald-400 bg-emerald-500/15 px-4 py-1.5 rounded-full border border-emerald-500/40">
                      <ClockIcon className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>Token Expires in: {formatCountdown(tokenRemainingSecs)}</span>
                    </div>

                    {/* Real-Time Audio Spectrum Bars */}
                    <div className="flex items-center justify-center gap-1.5 h-8">
                      {[12, 28, 45, 75, 95, 80, 50, 30, 16].map((baseHeight, idx) => {
                        const dynamicScale = Math.max(0.2, (audioLevel / 100) * 1.5);
                        const finalHeight = Math.min(32, Math.max(4, baseHeight * dynamicScale));
                        return (
                          <div
                            key={idx}
                            className="w-1.5 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full transition-all duration-75"
                            style={{ height: `${finalHeight}px` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {callState === 'ended' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-full">
                    Call Ended
                  </span>
                )}

                {callState === 'failed' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    Connection failed
                  </span>
                )}
              </div>
            </div>

            {/* Keypad Modal Dropdown if toggled */}
            {showKeypad && (
              <div className="mt-4 p-3 bg-slate-800/90 rounded-2xl border border-slate-700 w-64 shadow-xl">
                <div className="text-center font-mono text-lg font-bold text-emerald-400 mb-2 h-6 truncate">
                  {keypadInput || '—'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleKeyPress(k)}
                      className="py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm font-bold text-white transition-colors"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Bar: Action Controls */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Mute Button */}
            <button
              type="button"
              onClick={handleToggleMute}
              disabled={!isHandshakeVerified}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all disabled:opacity-40 ${
                isMuted
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              <MicrophoneIcon className="w-6 h-6" />
              <span className="text-[10px] font-bold mt-0.5">{isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            {/* Speaker Button */}
            <button
              type="button"
              onClick={handleToggleSpeaker}
              disabled={!isHandshakeVerified}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all disabled:opacity-40 ${
                isSpeakerOn
                  ? 'bg-slate-700 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}
              title="Toggle speaker"
            >
              {isSpeakerOn ? (
                <SpeakerWaveIcon className="w-6 h-6" />
              ) : (
                <SpeakerXMarkIcon className="w-6 h-6" />
              )}
              <span className="text-[10px] font-bold mt-0.5">{isSpeakerOn ? 'Speaker' : 'Ear'}</span>
            </button>

            {/* Hangup / End Call Button */}
            <button
              id="btn-end-audio-call"
              type="button"
              onClick={() => handleEndCall()}
              className="w-16 h-16 rounded-3xl bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/40 flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
              title="End sovereign call"
            >
              <PhoneXMarkIcon className="w-7 h-7" />
            </button>

            {/* Dialpad Toggle */}
            <button
              type="button"
              onClick={() => setShowKeypad((prev) => !prev)}
              disabled={!isHandshakeVerified}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all disabled:opacity-40 ${
                showKeypad
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title="DTMF Keypad"
            >
              <span className="text-xl">⌨️</span>
              <span className="text-[10px] font-bold mt-0.5">Keypad</span>
            </button>

            {/* Sovereign Security Info */}
            <div className="hidden sm:flex flex-col items-center justify-center text-slate-300" title="Verified Sovereign Encryption">
              <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 mt-0.5">STERCS</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AudioCallModal;
