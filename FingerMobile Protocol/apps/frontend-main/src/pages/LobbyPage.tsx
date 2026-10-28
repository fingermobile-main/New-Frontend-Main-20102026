import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoCameraIcon, PlusIcon, ArrowLeftIcon, SparklesIcon } from '../icons';

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      // In a real app, this would validate the room code and join a WebSocket session
      navigate(`/live/${roomCode}`);
    }
  };

  const handleCreateRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/live/${newRoomCode}`);
  };

  return (
    <div className="lobby-page min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-md">
            <VideoCameraIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Lobby</h1>
          <p className="text-gray-600">Join a live room or create your own</p>
        </div>

        <form onSubmit={handleJoin} className="mb-6">
          <div className="mb-4">
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1">
              Room Code
            </label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase text-center text-xl tracking-widest text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer min-h-[44px]"
          >
            Join Room
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-700">Or</span>
          </div>
        </div>

        <button
          onClick={handleCreateRoom}
          className="w-full bg-white text-blue-600 font-semibold py-3 px-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition duration-200 cursor-pointer min-h-[44px]"
        >
          Create New Room
        </button>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Lobby Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 flex items-center justify-around gap-1 shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            const input = document.getElementById('roomCode');
            if (input) input.focus();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold text-blue-600 cursor-pointer"
        >
          <VideoCameraIcon className="w-5 h-5 mb-0.5" />
          <span>Join</span>
        </button>
        <button
          type="button"
          onClick={handleCreateRoom}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <PlusIcon className="w-5 h-5 mb-0.5" />
          <span>Host</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/live-streaming')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <SparklesIcon className="w-5 h-5 mb-0.5" />
          <span>Streams</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeftIcon className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>
      </nav>
    </div>
  );
};

export default LobbyPage;
