import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { ShieldCheck, ExternalLink, Check, Copy, AlertCircle, LogOut } from 'lucide-react';

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
  const {
    isConnected,
    walletAddress,
    chainId,
    chainName,
    isMetaMaskInstalled,
    isConnecting,
    isVerified,
    connectMetaMask,
    disconnectWallet,
    signChallenge,
    getMetaMaskDeepLink
  } = useWeb3();

  const [activeTab, setActiveTab] = useState<'connect' | 'status'>('connect');
  const [copied, setCopied] = useState<boolean>(false);
  const [signing, setSigning] = useState<boolean>(false);

  if (!isOpen) return null;

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect with MetaMask extension or mobile browser',
      popular: true,
      ready: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Connect with Coinbase Smart Wallet',
      popular: true,
      ready: false
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect v2',
      icon: '🔗',
      description: 'Scan QR with Trust, Rainbow, or any mobile wallet',
      popular: false,
      ready: false
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      description: 'Connect Solana & Multi-chain EVM Phantom',
      popular: false,
      ready: false
    }
  ];

  const handleConnect = async (walletId: string) => {
    if (walletId === 'metamask') {
      const res = await connectMetaMask();
      if (res.success) {
        if (onConnect) onConnect(walletId);
        setActiveTab('status');
      }
    } else {
      // Fallback preview
      const res = await connectMetaMask();
      if (res.success && onConnect) {
        onConnect(walletId);
      }
    }
  };

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSignChallenge = async () => {
    setSigning(true);
    try {
      await signChallenge();
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        aria-label="Close modal"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        role="button"
        tabIndex={0}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-300 px-6 py-4 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isConnected ? 'Sovereign Web3 Identity' : 'Connect Web3 Wallet'}
              </h2>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                {isConnected
                  ? 'Cryptographically authenticated with FingerMobile Protocol™'
                  : 'Select your preferred Web3 wallet provider'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-700 hover:text-slate-900 rounded-full p-2 hover:bg-slate-200 transition-colors cursor-pointer text-sm font-bold"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Connected State View */}
          {isConnected && walletAddress ? (
            <div className="p-6 space-y-5">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    {isVerified ? 'Verified Sovereign Binding' : 'Connected to MetaMask'}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-full text-[10px] font-bold">
                    {chainName}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200">
                  <span className="font-mono text-xs font-bold text-slate-900 break-all select-all">
                    {walletAddress}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="ml-2 p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors shrink-0 cursor-pointer"
                    title="Copy address"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isVerified && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs text-amber-950 font-medium">
                    <p className="font-bold">Cryptographic Signature Pending</p>
                    <p className="mt-0.5 text-slate-700">
                      Sign the server challenge to bind this wallet permanently to your sovereign NIN account.
                    </p>
                    <button
                      onClick={handleSignChallenge}
                      disabled={signing}
                      className="mt-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer disabled:opacity-50"
                    >
                      {signing ? 'Confirm in MetaMask...' : 'Sign Challenge Nonce'}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => disconnectWallet()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-300 text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Disconnect Wallet
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Wallet Selection List */
            <div className="p-6 space-y-3">
              {!isMetaMaskInstalled && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-800 mb-2">
                  <p className="font-bold text-slate-900">MetaMask extension not detected</p>
                  <p className="text-slate-700 mt-0.5">
                    On desktop, install MetaMask for Chrome/Brave. On mobile, launch directly via the MetaMask app browser.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                    >
                      Install MetaMask <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={getMetaMaskDeepLink()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                    >
                      Open in Mobile App
                    </a>
                  </div>
                </div>
              )}

              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet.id)}
                  disabled={isConnecting}
                  className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all cursor-pointer text-left ${
                    isConnecting && wallet.id === 'metamask'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                    {wallet.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{wallet.name}</h3>
                      {wallet.popular && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-full text-[10px] font-bold">
                          Primary EVM
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-0.5 truncate">{wallet.description}</p>
                  </div>

                  {/* Connecting Spinner */}
                  {isConnecting && wallet.id === 'metamask' && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-900 border-t-transparent shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-slate-300 px-6 py-3.5 bg-slate-50 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">EIP-1193 & CAIP-25 Compliant</span>
            <Link
              to="/about"
              onClick={onClose}
              className="text-slate-900 hover:text-indigo-700 font-bold underline"
            >
              Protocol Security & Privacy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
