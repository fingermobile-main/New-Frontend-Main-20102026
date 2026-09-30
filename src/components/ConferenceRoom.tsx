import React, { useEffect, useState, useRef } from 'react';
import {
  MicrophoneIcon,
  VideoCameraIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  CheckCircleIcon
} from '../icons';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isSpeaking: boolean;
  isMuted: boolean;
  hasVideo: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface ConferenceRoomProps {
  roomId?: string;
  roomName?: string;
}

const ConferenceRoom: React.FC<ConferenceRoomProps> = ({
  roomId = 'conf-main-room',
  roomName = 'FingerMobile Protocol Strategic Sync'
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showParticipants, setShowParticipants] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [mediaStreamActive, setMediaStreamActive] = useState<boolean>(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: 'GraceLink Moderator', text: 'Welcome to the FingerMobile Protocol conference room.', timestamp: '14:00' },
    { id: 'm2', sender: 'Tobi Bakare', text: 'Audio and video stream look crystal clear from Lagos.', timestamp: '14:01' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Participants State
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'p1', name: 'You (Host)', isSpeaking: false, isMuted: false, hasVideo: true },
    { id: 'p2', name: 'Amina Bello (Abuja Hub)', isSpeaking: true, isMuted: false, hasVideo: true },
    { id: 'p3', name: 'Chukwudi Nwosu (Port Harcourt)', isSpeaking: false, isMuted: true, hasVideo: true }
  ]);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize WebRTC Media Stream
  useEffect(() => {
    let isMounted = true;
    const initCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (isMounted) {
            streamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            setMediaStreamActive(true);
          }
        }
      } catch {
        // Fallback gracefully if camera is blocked/denied
        setMediaStreamActive(false);
      }
    };

    initCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
    setParticipants(prev =>
      prev.map(p => (p.id === 'p1' ? { ...p, isMuted: !isMuted } : p))
    );
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
    setParticipants(prev =>
      prev.map(p => (p.id === 'p1' ? { ...p, hasVideo: isVideoOff } : p))
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
  };

  const handleLeave = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    window.location.href = '/dashboard';
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-gray-950 rounded-2xl overflow-hidden flex flex-col border border-gray-800 shadow-2xl">
      {/* Room Header */}
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
          <h2 className="text-white font-bold text-base">{roomName}</h2>
          <span className="text-xs text-gray-400 font-mono bg-gray-800 px-2.5 py-1 rounded-lg">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowParticipants(!showParticipants);
              setShowChat(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              showParticipants ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <UserGroupIcon className="w-4 h-4" />
            Participants ({participants.length})
          </button>
          <button
            onClick={() => {
              setShowChat(!showChat);
              setShowParticipants(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              showChat ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>

      {/* Main Video & Grid Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr overflow-y-auto">
          {/* Local Camera Tile */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-lg flex items-center justify-center">
            {mediaStreamActive && !isVideoOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="text-center p-6">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  YOU
                </div>
                <p className="text-sm font-bold text-white">Camera is Off</p>
                <p className="text-xs text-gray-500 mt-1">Tap camera toggle below to stream live video</p>
              </div>
            )}
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-bold text-white flex items-center gap-2">
              <span>You (Host)</span>
              {isMuted && <span className="text-red-400">🔇 Muted</span>}
            </div>
          </div>

          {/* Remote Participants Tiles */}
          {participants.filter(p => p.id !== 'p1').map((p) => (
            <div key={p.id} className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-lg flex items-center justify-center">
              <div className="text-center p-6">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ${
                  p.isSpeaking ? 'ring-4 ring-green-500 animate-pulse' : ''
                }`}>
                  {p.name.charAt(0)}
                </div>
                <p className="text-sm font-bold text-white">{p.name}</p>
                {p.isSpeaking && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                    🎤 Speaking
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-bold text-white flex items-center gap-2">
                <span>{p.name}</span>
                {p.isMuted && <span className="text-red-400">🔇 Muted</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Side Drawer: Chat or Participants */}
        {(showChat || showParticipants) && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col justify-between">
            {/* Chat View */}
            {showChat && (
              <>
                <div className="p-4 border-b border-gray-800">
                  <h3 className="text-sm font-black text-white">Conference Chat</h3>
                </div>

                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="bg-gray-800/80 p-3 rounded-xl border border-gray-700/50">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-bold text-blue-400">{msg.sender}</span>
                        <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-200 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
                    Send
                  </button>
                </form>
              </>
            )}

            {/* Participants View */}
            {showParticipants && (
              <div className="p-4">
                <h3 className="text-sm font-black text-white mb-4">Participants ({participants.length})</h3>
                <div className="space-y-3">
                  {participants.map((p) => (
                    <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-800 text-xs">
                      <span className="text-gray-200 font-medium">{p.name}</span>
                      <span className="text-gray-500">{p.isMuted ? '🔇' : '🎤'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Conference Bottom Action Toolbar */}
      <div className="bg-gray-900 px-6 py-4 border-t border-gray-800 flex items-center justify-center gap-4">
        <button
          onClick={toggleMute}
          className={`p-3.5 rounded-2xl transition-colors shadow-md ${
            isMuted ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <MicrophoneIcon className="w-5 h-5" />
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3.5 rounded-2xl transition-colors shadow-md ${
            isVideoOff ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
          title={isVideoOff ? 'Start Video' : 'Stop Video'}
        >
          <VideoCameraIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`p-3.5 rounded-2xl transition-colors shadow-md ${
            isScreenSharing ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
          title="Share Screen"
        >
          <ComputerDesktopIcon className="w-5 h-5" />
        </button>

        <button
          onClick={handleLeave}
          className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-colors flex items-center gap-2"
        >
          <XCircleIcon className="w-5 h-5" />
          End / Leave Call
        </button>
      </div>
    </div>
  );
};

export default ConferenceRoom;
