import React, { useState, useEffect } from 'react';

interface CallData {
  id: string;
  callerId: number;
  calleeId: number;
  callerName: string;
  calleeName: string;
  status: 'incoming' | 'outgoing' | 'active' | 'ended';
  startTime?: string;
  endTime?: string;
}

interface LushCallModalProps {
  activeCall: CallData;
  onAnswer: () => void;
  onEnd: () => void;
  currentUserId: number;
}

export const LushCallModal: React.FC<LushCallModalProps> = ({
  activeCall,
  onAnswer,
  onEnd,
  currentUserId
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isRinging, setIsRinging] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const isCaller = activeCall.callerId === currentUserId;
  const isCallee = activeCall.calleeId === currentUserId;

  const participantName = isCaller
    ? activeCall.calleeName
    : activeCall.callerName;

  // Calculate call duration if call is active
  useEffect(() => {
    if (activeCall.status === 'active' && activeCall.startTime) {
      const startTime = activeCall.startTime;
      const interval = setInterval(() => {
        const start = new Date(startTime).getTime();
        const now = new Date().getTime();
        setCallDuration(Math.floor((now - start) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeCall.status, activeCall.startTime]);

  // Stop ringing after 30 seconds if not answered
  useEffect(() => {
    if (isRinging && activeCall.status === 'incoming') {
      const timer = setTimeout(() => {
        setIsRinging(false);
        onEnd(); // End the call if not answered
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [isRinging, activeCall.status, onEnd]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {participantName.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{participantName}</h3>
          <p className="text-slate-700 mt-1">
            {activeCall.status === 'incoming' && 'Incoming call'}
            {activeCall.status === 'outgoing' && 'Calling...'}
            {activeCall.status === 'active' && formatTime(callDuration)}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {activeCall.status === 'incoming' && isCallee && (
            <>
              <button
                type="button"
                aria-label="Answer call"
                onClick={onAnswer}
                className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Decline call"
                onClick={onEnd}
                className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}

          {(activeCall.status === 'outgoing' || activeCall.status === 'active') && isCaller && (
            <button
              type="button"
              aria-label="End call"
              onClick={onEnd}
              className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {activeCall.status === 'active' && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              onClick={() => setIsMuted(prev => !prev)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors border font-black ${
                isMuted
                  ? 'bg-red-100 text-red-900 border-red-400'
                  : 'bg-gray-200 text-gray-950 hover:bg-gray-300 border-gray-400'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
              onClick={() => setIsSpeakerOn(prev => !prev)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors border font-black ${
                isSpeakerOn
                  ? 'bg-blue-100 text-blue-900 border-blue-400'
                  : 'bg-gray-200 text-gray-950 hover:bg-gray-300 border-gray-400'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m1.414-4.243a5 5 0 000-7.072m-2.828 9.9a9 9 0 010-12.728" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
