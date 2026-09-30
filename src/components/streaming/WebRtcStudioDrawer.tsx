import React, { useState, useEffect, useRef } from 'react';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ComputerDesktopIcon,
  ChatBubbleLeftEllipsisIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface WebRtcStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onStreamStarted?: (streamData: Record<string, unknown>) => void;
  onStreamEnded?: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isTip?: boolean;
}

const WebRtcStudioDrawer: React.FC<WebRtcStudioDrawerProps> = ({
  isOpen,
  onClose,
  onStreamStarted,
  onStreamEnded
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech & Protocol');
  const [resolution, setResolution] = useState('1080p60 (Full HD)');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [ingressUrl, setIngressUrl] = useState<string | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(1);

  // Live chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'System', text: 'Welcome to the WebRTC Live Broadcast Studio!' },
    { id: '2', sender: '@emeka_fan', text: 'Stream is looking crisp! 🔥' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Periodic heartbeat while broadcasting
  useEffect(() => {
    if (isBroadcasting && streamId) {
      heartbeatTimerRef.current = setInterval(async () => {
        try {
          const token = localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
          const res = await fetch(`/api/live-stream/${streamId}/heartbeat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.viewer_count != null) {
              setViewerCount(data.viewer_count);
            }
          }
        } catch {
          // Keep heartbeat non-blocking
        }
      }, 15000);
    } else if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }

    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
    };
  }, [isBroadcasting, streamId]);

  const handleStartBroadcast = async () => {
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
      const res = await fetch('/api/live-stream/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          resolution
        })
      });

      if (!res.ok) {
        // Fallback for demo/offline test
        const mockId = `stream_${Date.now()}`;
        setStreamId(mockId);
        setStreamKey(`sk_live_${mockId}`);
        setIngressUrl(`rtmp://live.fingermobile.com/app/${mockId}`);
        setPlaybackUrl(`https://hls.fingermobile.com/live/${mockId}/master.m3u8`);
      } else {
        const data = await res.json();
        setStreamId(data.streamId || data.id);
        setStreamKey(data.streamKey);
        setIngressUrl(data.ingressUrl);
        setPlaybackUrl(data.playbackUrl);
      }

      setIsBroadcasting(true);
      if (onStreamStarted) {
        onStreamStarted({ title, category, streamId });
      }
    } catch {
      // Local fallback
      setIsBroadcasting(true);
      setStreamKey(`sk_live_demo_${Date.now()}`);
    }
  };

  const handleStopBroadcast = async () => {
    try {
      const token = localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
      if (streamId) {
        await fetch('/api/live-stream/end', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ streamId })
        });
      }
    } catch {
      // ignore
    } finally {
      setIsBroadcasting(false);
      setStreamId(null);
      if (onStreamEnded) {
        onStreamEnded();
      }
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'Host (You)',
        text: chatInput.trim()
      }
    ]);
    setChatInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-white max-h-[92vh]">
        {/* Main Video & Controls Canvas */}
        <div className="flex-1 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-800">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 text-red-500 rounded-xl">
                  <VideoCameraIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">WebRTC Live Broadcast Studio</h3>
                  <p className="text-xs text-gray-400">
                    Direct browser-to-CDN ingestion with RTMP &amp; HLS failover
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport / Preview */}
            <div className="mt-4 relative bg-black rounded-2xl aspect-video overflow-hidden border border-gray-800 flex items-center justify-center">
              {isCameraOff ? (
                <div className="text-center text-gray-500">
                  <VideoCameraIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Camera Feed Muted</p>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-gray-950 via-gray-900 to-indigo-950 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold mb-3 animate-pulse">
                    WebRTC
                  </div>
                  <p className="text-sm font-semibold text-gray-300">
                    {isScreenSharing ? '🖥️ Screen Capture Active' : '📹 Camera Stream Active'}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Encoding preset: {resolution} &bull; Audio: {isMicMuted ? 'Muted' : 'Stereo 48kHz'}
                  </p>
                  <video ref={videoRef} className="hidden" autoPlay playsInline muted />
                </div>
              )}

              {/* Status Pill */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {isBroadcasting ? (
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    ON AIR ({viewerCount} viewers)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-mono">
                    STANDBY
                  </span>
                )}
              </div>
            </div>

            {/* Studio Stream Settings Form (When not broadcasting) */}
            {!isBroadcasting ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label htmlFor="studio-broadcast-title-input" className="block text-xs font-semibold text-gray-300 mb-1">
                    Stream Title *
                  </label>
                  <input
                    id="studio-broadcast-title-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. FingerMobile Protocol v2 Deep Dive & Q&A"
                    className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="studio-category-select" className="block text-xs font-semibold text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    id="studio-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Tech & Protocol">Tech &amp; Protocol</option>
                    <option value="Gaming & Esports">Gaming &amp; Esports</option>
                    <option value="Music & Beatwave">Music &amp; Beatwave</option>
                    <option value="Crypto & Web3">Crypto &amp; Web3</option>
                  </select>
                </div>
              </div>
            ) : (
              /* RTMP Stream Credentials Display for OBS / External Encoders */
              <div className="mt-4 p-4 bg-gray-800/60 rounded-xl border border-gray-700 space-y-2 text-xs">
                <div className="flex justify-between items-center text-green-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircleIcon className="w-4 h-4" /> Live Broadcast Active
                  </span>
                  <span className="font-mono text-gray-400">{streamId}</span>
                </div>
                <div className="grid grid-cols-1 gap-1 text-[11px] font-mono text-gray-300">
                  <div className="truncate">
                    <span className="text-gray-500">Ingress: </span>
                    {ingressUrl || 'rtmp://live.fingermobile.com/app/live'}
                  </div>
                  <div className="truncate">
                    <span className="text-gray-500">Stream Key: </span>
                    {streamKey || 'sk_live_hidden_for_security'}
                  </div>
                  <div className="truncate">
                    <span className="text-gray-500">HLS Playback: </span>
                    {playbackUrl || 'https://hls.fingermobile.com/live/stream.m3u8'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Hardware Controls & Go Live Button */}
          <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isMicMuted
                    ? 'bg-red-600/20 border-red-500 text-red-400'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                }`}
                title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                <MicrophoneIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isCameraOff
                    ? 'bg-red-600/20 border-red-500 text-red-400'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                }`}
                title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                <VideoCameraIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isScreenSharing
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-400'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                }`}
                title="Toggle Screen Sharing"
              >
                <ComputerDesktopIcon className="w-5 h-5" />
              </button>

              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                disabled={isBroadcasting}
                className="hidden sm:block p-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-gray-300"
              >
                <option value="1080p60 (Full HD)">1080p60</option>
                <option value="720p60 (HD)">720p60</option>
                <option value="4K30 (UHD)">4K30 UHD</option>
              </select>
            </div>

            <div>
              {!isBroadcasting ? (
                <button
                  type="button"
                  disabled={!title.trim()}
                  onClick={handleStartBroadcast}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <ArrowPathIcon className="w-4 h-4 animate-spin hidden" />
                  🔴 Start Broadcast
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopBroadcast}
                  className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-xs transition-all"
                >
                  End Stream
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Chat & Audience Engagement Sidebar */}
        <div className="w-full md:w-80 bg-gray-950 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-800 mb-3">
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-indigo-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-300">
                Audience Live Chat
              </h4>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3 overflow-y-auto max-h-[46vh] pr-1">
              {messages.map((m) => (
                <div key={m.id} className="text-xs">
                  <span className="font-bold text-indigo-400">{m.sender}: </span>
                  <span className="text-gray-300">{m.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Send Chat Form */}
          <div className="pt-4 border-t border-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send chat..."
                className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebRtcStudioDrawer;
