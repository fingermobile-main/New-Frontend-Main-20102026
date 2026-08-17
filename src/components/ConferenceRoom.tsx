import React, { useEffect, useState } from 'react';
interface ConferenceRoomProps {
  roomId?: string;
  roomName?: string;
  participants?: Array<{
    id: string;
    name: string;
    avatar?: string;
    isSpeaking?: boolean;
    isMuted?: boolean;
    hasVideo?: boolean;
  }>;
}

const ConferenceRoom: React.FC<ConferenceRoomProps> = ({
  roomId = 'room123',
  roomName = 'Team Meeting',
  participants = [
    { id: 'p1', name: 'You', avatar: null, isSpeaking: false, isMuted: false, hasVideo: true },
    { id: 'p2', name: 'Alice Johnson', avatar: null, isSpeaking: true, isMuted: false, hasVideo: true },
    { id: 'p3', name: 'Bob Smith', avatar: null, isSpeaking: false, isMuted: true, hasVideo: true },
    { id: 'p4', name: 'Charlie Brown', avatar: null, isSpeaking: false, isMuted: false, hasVideo: false }
  ]
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [duration, setDuration] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLeave = () => {
    if (confirm('Are you sure you want to leave the meeting?')) {
      window.location.href = '/meetings';
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-white font-semibold text-lg">{roomName}</h2>
          <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
            ● Live
          </span>
          <span className="text-gray-400 text-sm">{formatTime(duration)}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            👥 Participants ({participants.length})
          </button>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            💬 Chat
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className={`flex-1 p-4 ${showChat || showParticipants ? 'w-2/3' : 'w-full'}`}>
          <div className="grid grid-cols-2 gap-4 h-full">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`relative bg-gray-800 rounded-lg overflow-hidden border-2 transition-all ${
                  participant.isSpeaking ? 'border-green-500 shadow-lg shadow-green-500/50' : 'border-gray-700'
                }`}
              >
                {/* Video Placeholder */}
                {participant.hasVideo ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <div className="text-center">
                      {participant.avatar ? (
                        <img src={participant.avatar} alt={participant.name} className="w-32 h-32 rounded-full mx-auto mb-2"  />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold text-white mx-auto mb-2">
                          {participant.name.charAt(0)}
                        </div>
                      )}
                      <p className="text-white font-medium">{participant.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold text-white mx-auto mb-2">
                        {participant.name.charAt(0)}
                      </div>
                      <p className="text-white font-medium">{participant.name}</p>
                      <p className="text-gray-400 text-sm mt-1">Camera off</p>
                    </div>
                  </div>
                )}

                {/* Status Indicators */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  {participant.isMuted && (
                    <span className="px-2 py-1 bg-red-600 text-white rounded text-xs">🔇 Muted</span>
                  )}
                  {participant.isSpeaking && (
                    <span className="px-2 py-1 bg-green-600 text-white rounded text-xs animate-pulse">
                      🎤 Speaking
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel - Chat or Participants */}
        {(showChat || showParticipants) && (
          <div className="w-1/3 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            {showChat && (
              <div className="p-4">
                <h3 className="text-white font-semibold mb-4">Meeting Chat</h3>
                <div className="space-y-3">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-300"><strong>Alice:</strong> Hey everyone!</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-300"><strong>Bob:</strong> Ready when you are</p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500" />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Send
                  </button>
                </div>
              </div>
            )}

            {showParticipants && (
              <div className="p-4">
                <h3 className="text-white font-semibold mb-4">Participants</h3>
                <div className="space-y-2">
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-gray-400">
                          {p.isMuted ? '🔇 Muted' : '🎤 Unmuted'} • {p.hasVideo ? '📹 Video on' : '📹 Video off'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
        <div className="flex items-center justify-center gap-4">
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

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span className="text-white text-2xl">🖥️</span>
          </button>

          {/* End Call */}
          <button
            onClick={handleLeave}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all transform hover:scale-110"
          >
            <span className="text-white text-3xl">📞</span>
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

export default ConferenceRoom;
