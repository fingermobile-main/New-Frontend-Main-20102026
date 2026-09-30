import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TokenizePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId?: string;
  onTokenize?: (playlistId: string, tokenData: unknown) => void;
}

const TokenizePlaylistModal: React.FC<TokenizePlaylistModalProps> = ({
  isOpen,
  onClose,
  playlistId,
  onTokenize
}) => {
  const [tokenName, setTokenName] = React.useState('');
  const [tokenSymbol, setTokenSymbol] = React.useState('');
  const [supply, setSupply] = React.useState('1000');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTokenize?.(playlistId || '', { tokenName, tokenSymbol, supply });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Tokenize Playlist</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Token Name</label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="My Playlist Token"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Token Symbol</label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              required
              maxLength={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="MPT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Supply</label>
            <input
              type="number"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TokenizePlaylistModal;
