import React, { useState } from 'react';
interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (walletType: string) => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  if (!isOpen) return null;

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect to your MetaMask wallet',
      popular: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Connect with Coinbase Wallet',
      popular: true
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Scan with your mobile wallet',
      popular: false
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      description: 'Connect Phantom wallet',
      popular: false
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Connect Trust Wallet',
      popular: false
    }
  ];

  const handleConnect = async (walletId: string) => {
    try {
      setConnecting(walletId);
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (onConnect) {
        onConnect(walletId);
      }

      onClose();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose} role="button" tabIndex={0}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="border-b border-slate-300 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Connect Wallet</h2>
              <p className="text-sm text-gray-600 mt-1">Choose your preferred wallet</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-700 hover:text-gray-700 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Wallet List */}
          <div className="p-6 space-y-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnect(wallet.id)}
                disabled={connecting !== null}
                className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-all hover:border-blue-500 hover:bg-blue-50 ${
                  connecting === wallet.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-3xl">
                  {wallet.icon}
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                    {wallet.popular && (
                      <span className="px-2 py-1 bg-green-100 text-green-950 border border-green-400 font-bold rounded-full text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{wallet.description}</p>
                </div>

                {/* Loading Indicator */}
                {connecting === wallet.id && (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-300 px-6 py-4 bg-gray-50">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">New to crypto wallets?</p>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={(e) => e.preventDefault()}
              >
                Learn more about wallets →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
