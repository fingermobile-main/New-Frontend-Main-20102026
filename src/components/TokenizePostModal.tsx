import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';  // Using absolute path from src
import { XIcon, LockClosedIcon, CurrencyDollarIcon } from '../icons'; // Changed XMarkIcon to XIcon

interface TokenizePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenize: (tokenId: string, metadata: unknown) => void;
  postId: string;
}

const TokenizePostModal: React.FC<TokenizePostModalProps> = ({
  isOpen,
  onClose,
  onTokenize,
  postId
}) => {
  const { ficBalance, showToast } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('1');
  const [royaltyPercentage, setRoyaltyPercentage] = useState('5');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate tokenization process
    setTimeout(() => {
      const tokenId = `ft_${Math.random().toString(36).substr(2, 9)}`;
      const metadata = {
        name: tokenName,
        symbol: tokenSymbol,
        supply: parseInt(initialSupply),
        royalty: parseInt(royaltyPercentage),
        postId,
        createdAt: new Date().toISOString()
      };

      onTokenize(tokenId, metadata);
      showToast('Post tokenized successfully!', 'success');
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Tokenize Post</h3>
            <button
              onClick={onClose}
              className="text-slate-700 hover:text-gray-700"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Token Name</label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                placeholder="e.g. My Awesome Post Token"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Token Symbol</label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md uppercase text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                placeholder="e.g. MAPT"
                maxLength={6}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Supply</label>
              <input
                type="number"
                value={initialSupply}
                onChange={(e) => setInitialSupply(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                min="1"
                max="1000000"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Creator Royalty (%)</label>
              <input
                type="number"
                value={royaltyPercentage}
                onChange={(e) => setRoyaltyPercentage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                min="0"
                max="50"
                required
              />
              <p className="mt-1 text-sm text-slate-700">Percentage of future sales you'll earn</p>
            </div>

            <div className="mb-6 p-4 bg-yellow-50 rounded-md">
              <div className="flex">
                <LockClosedIcon className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Tokenizing this post will create a digital asset that others can buy shares of.
                    You'll earn royalties on future transactions.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Cost to tokenize:</span>
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-1" />
                <span className="font-medium text-green-600">10 FIC</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || ficBalance < 10}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Tokenize Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TokenizePostModal;
