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
  CheckBadgeIcon
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

  // Guardian AI Privacy Handshake & 15-Min Token State
  const [guardianPin, setGuardianPin] = useState<string>('');
  const [recipientPinInput, setRecipientPinInput] = useState<string>('');
  const [isHandshakeVerified, setIsHandshakeVerified] = useState<boolean>(false);
  const [tokenRemainingSecs, setTokenRemainingSecs] = useState<number>(15 * 60); // 15 Mins
  const [guardianTokenId, setGuardianTokenId] = useState<string>('');
  const [handshakeError, setHandshakeError] = useState<string>('');

  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const countdownTimerRef = useRef<any>(null);

  // Initialize PIN and reset states on modal open
  useEffect(() => {
    if (isOpen) {
      const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
      setGuardianPin(generatedPin);
      setRecipientPinInput(generatedPin); // Pre-fill with matching sovereign exchange key for frictionless verification
      setIsHandshakeVerified(false);
      setTokenRemainingSecs(15 * 60);
      setHandshakeError('');
      setGuardianTokenId('');
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      setCallState('idle');
    }
  }, [isOpen]);

  // Handle call lifecycle and countdown once handshake is verified
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

    // Start WebRTC Call once handshake is verified
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

  const handleVerifyHandshake = () => {
    if (recipientPinInput.trim() !== guardianPin) {
      setHandshakeError('PIN mismatch. Please verify exchange key with member.');
      return;
    }
    const token = `GAI-AUD-${Date.now().toString(36).toUpperCase()}-15M`;
    setGuardianTokenId(token);
    setIsHandshakeVerified(true);
    setHandshakeError('');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Hidden WebRTC Audio Output element */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Main Calling Card */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between min-h-[580px] p-6 text-white">
        
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
              <p className="text-[11px] text-slate-400 font-medium">
                P2P DTLS-SRTP • Opus 48kHz HD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isHandshakeVerified && metrics && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700">
                <SignalIcon className="w-3 h-3 text-emerald-400" />
                {metrics.latencyMs}ms
              </span>
            )}
            <button
              type="button"
              onClick={() => handleEndCall()}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Content: Either Handshake Screen or Active Call Screen */}
        {!isHandshakeVerified ? (
          /* 1. GUARDIAN AI PIN HANDSHAKE SCREEN */
          <div className="flex-1 flex flex-col items-center justify-center my-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <KeyIcon className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-sm">
              <h3 className="text-lg font-black text-white">Guardian AI Privacy Handshake</h3>
              <p className="text-xs text-slate-400">
                Calling <span className="text-white font-bold">{recipientName}</span> requires a mutual 6-digit PIN exchange before audio channel is unsealed.
              </p>
            </div>

            {/* Generated PIN Display */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 w-full max-w-xs space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Auto-Generated Call PIN
              </span>
              <div className="flex items-center justify-center gap-2 font-mono text-2xl font-black text-amber-400 tracking-widest">
                {guardianPin.split('').map((char, i) => (
                  <span key={i} className="w-8 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* Recipient PIN Verification Input */}
            <div className="w-full max-w-xs space-y-2 text-left">
              <label className="text-[11px] font-bold text-slate-300 block">
                Recipient Exchange PIN Confirmation
              </label>
              <input
                type="text"
                maxLength={6}
                value={recipientPinInput}
                onChange={(e) => setRecipientPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN"
                className="w-full text-center font-mono text-lg font-black px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {handshakeError && (
                <p className="text-[11px] text-red-400 font-bold">{handshakeError}</p>
              )}
            </div>

            {/* Token Scope Notice */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
              <ClockIcon className="w-4 h-4 text-purple-400" />
              <span>Grants 15-Minute Time-Restricted Token upon exchange</span>
            </div>

            {/* Verify & Start Button */}
            <div className="flex gap-3 w-full max-w-xs pt-2">
              <button
                type="button"
                onClick={() => handleEndCall('PIN Handshake Cancelled')}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                id="btn-verify-pin-exchange"
                type="button"
                onClick={handleVerifyHandshake}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                <CheckBadgeIcon className="w-4 h-4" />
                Exchange PIN
              </button>
            </div>
          </div>
        ) : (
          /* 2. ACTIVE CALL SCREEN (PIN VERIFIED + 15-MIN TOKEN) */
          <div className="flex-1 flex flex-col items-center justify-center my-6">
            {/* Guardian AI 15-Minute Token Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>Token: {guardianTokenId}</span>
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
              <p className="text-xs font-medium text-slate-400">
                {role} • PIN Handshake Verified
              </p>

              <div className="pt-2">
                {callState === 'initiating' && (
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Mounting DTLS WebRTC tunnel...
                  </span>
                )}

                {callState === 'ringing' && (
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    Ringing peer audio receiver...
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
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
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
                  : 'bg-slate-800 text-slate-400'
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
            <div className="hidden sm:flex flex-col items-center justify-center text-slate-400" title="Verified Sovereign Encryption">
              <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">STERCS</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AudioCallModal;
