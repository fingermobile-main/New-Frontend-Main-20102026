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
      <div className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-5rem)] flex flex-col pb-28 md:pb-6 overflow-x-hidden text-slate-900">
        {!isInMeeting ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl border border-slate-300 shadow-xl max-w-md w-full text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <VideoCameraIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">FingerMobile Video Meeting</h2>
              <p className="text-sm font-medium text-slate-700 mb-6">Enter a room code or start an instant WebRTC conference call</p>

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
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md min-h-[44px]"
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

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setIsInMeeting(true)}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            isInMeeting ? 'text-blue-600 font-bold' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <VideoCameraIcon className="w-5 h-5 text-blue-600" />
          <span className="text-[10px] tracking-tight">Room</span>
        </button>
        <button
          type="button"
          onClick={() => setIsInMeeting(false)}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            !isInMeeting ? 'text-blue-600 font-bold' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <PlusIcon className="w-5 h-5 text-indigo-600" />
          <span className="text-[10px] tracking-tight">New Call</span>
        </button>
        <button
          type="button"
          onClick={() => { setRoomCode('STRATEGIC-SYNC-2026'); setIsInMeeting(true); }}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 text-slate-700 hover:text-slate-900"
        >
          <UserGroupIcon className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] tracking-tight">Sync</span>
        </button>
      </div>
    </MainLayout>
  );
};

export default ConferencePage;
