import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="lobby-page min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
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
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
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
          className="w-full bg-white text-blue-600 font-semibold py-3 px-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition duration-200"
        >
          Create New Room
        </button>
      </div>
    </div>
  );
};

export default LobbyPage;
