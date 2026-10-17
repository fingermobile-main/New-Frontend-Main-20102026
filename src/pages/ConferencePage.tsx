import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ConferenceRoom from '../components/ConferenceRoom';
import {
  VideoCameraIcon,
  // eslint-disable-next-line no-unused-vars
  PlusIcon,
  // eslint-disable-next-line no-unused-vars
  UserGroupIcon
} from '../icons';

const ConferencePage: React.FC = () => {
  const [isInMeeting, setIsInMeeting] = useState<boolean>(true);
  const [roomCode, setRoomCode] = useState<string>('STRATEGIC-SYNC-2026');

  return (
    <MainLayout pageTitle="Conference">
      <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-5rem)] flex flex-col">
        {!isInMeeting ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl border border-slate-300 shadow-xl max-w-md w-full text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <VideoCameraIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">FingerMobile Video Meeting</h2>
              <p className="text-xs text-slate-700 mb-6">Enter a room code or start an instant WebRTC conference call</p>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter Meeting Code..."
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-mono text-center font-bold tracking-wider text-slate-900 border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <button
                  onClick={() => setIsInMeeting(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md"
                >
                  Join Conference Room
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <ConferenceRoom roomId={roomCode} roomName={`Meeting Room: ${roomCode}`} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ConferencePage;
