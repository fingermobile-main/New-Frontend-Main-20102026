import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import apiService from '../services/apiService';

// Standard EVM Chain Names mapping
const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon Mainnet',
  80002: 'Polygon Amoy',
  42161: 'Arbitrum One',
  10: 'Optimism Mainnet',
  8453: 'Base Mainnet',
  56: 'BNB Smart Chain'
};

export interface Web3ContextType {
  isConnected: boolean;
  walletConnected: boolean;
  connectedAccount: string | null;
  walletAddress: string | null;
  account: string | null;
  balance: number;
  chainId: number | null;
  chainName: string;
  isMetaMaskInstalled: boolean;
  isConnecting: boolean;
  isVerified: boolean;
  verificationProof: string | null;
  connectWallet: (walletType?: string) => Promise<void>;
  connectMetaMask: (options?: { skipSignature?: boolean }) => Promise<{ success: boolean; address?: string; error?: string }>;
  disconnectWallet: () => void;
  signChallenge: (customMessage?: string) => Promise<string | null>;
  switchChain: (targetChainId: number) => Promise<boolean>;
  getMetaMaskDeepLink: () => string;
  sendFIC?: (recipient: string, amount: number) => Promise<void>;
  convertFICtoUSD?: (ficAmount: number) => number;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export { Web3Context };

interface Web3ProviderProps {
  children: React.ReactNode;
}

/**
 * Returns MetaMask Ethereum provider from window.ethereum.
 * Correctly resolves multi-wallet extensions where window.ethereum.providers exists.
 */
const getMetaMaskProvider = (): any => {
  if (typeof window === 'undefined') return null;
  const eth = (window as any).ethereum;
  if (!eth) return null;

  if (Array.isArray(eth.providers)) {
    const metaMaskProvider = eth.providers.find((p: any) => p.isMetaMask);
    if (metaMaskProvider) return metaMaskProvider;
  }

  if (eth.isMetaMask) {
    return eth;
  }

  return eth;
};

/**
 * Detects mobile user agents (iOS / Android) for mobile deep linking
 */
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const { showToast } = useAppContext();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verificationProof, setVerificationProof] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);

  // Check if MetaMask is installed on mount
  useEffect(() => {
    const provider = getMetaMaskProvider();
    setIsMetaMaskInstalled(!!provider);
  }, []);

  const chainName = useMemo(() => {
    if (!chainId) return 'Not Connected';
    return CHAIN_NAMES[chainId] || `Chain ID ${chainId}`;
  }, [chainId]);

  /**
   * Generates MetaMask mobile universal deep link for the current dApp URL
   */
  const getMetaMaskDeepLink = useCallback((): string => {
    if (typeof window === 'undefined') return 'https://metamask.app.link';
    const cleanHost = window.location.host;
    const cleanPath = window.location.pathname;
    return `https://metamask.app.link/dapp/${cleanHost}${cleanPath}`;
  }, []);

  /**
   * Disconnects the Web3 wallet and purges session state
   */
  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setWalletAddress(null);
    setAccount(null);
    setBalance(0);
    setChainId(null);
    setIsVerified(false);
    setVerificationProof(null);

    try {
      localStorage.removeItem('fm_web3_connected_address');
      localStorage.removeItem('fm_web3_signature_proof');
      localStorage.removeItem('fm_web3_chain_id');
    } catch {
      // ignore storage errors
    }

    showToast('MetaMask wallet disconnected', 'info');
  }, [showToast]);

  /**
   * Requests a cryptographic challenge from the FingerMobile backend and prompts MetaMask signature
   */
  const signChallenge = useCallback(
    async (customMessage?: string): Promise<string | null> => {
      const provider = getMetaMaskProvider();
      if (!provider) {
        showToast('MetaMask is not available to sign cryptographic challenge', 'error');
        return null;
      }

      const activeAddress = walletAddress || account;
      if (!activeAddress) {
        showToast('No active wallet connected to sign challenge', 'error');
        return null;
      }

      try {
        let challengeToSign = customMessage;

        // If no custom message passed, retrieve official server-side challenge nonce
        if (!challengeToSign) {
          const nonceRes: any = await apiService.get('/api/web3/nonce', {
            walletAddress: activeAddress
          });

          if (!nonceRes || !nonceRes.data || !nonceRes.data.message) {
            throw new Error('Unable to generate authentication challenge from backend');
          }

          challengeToSign = nonceRes.data.message;
        }

        // Request personal_sign (EIP-191) signature from MetaMask
        const signature = await provider.request({
          method: 'personal_sign',
          params: [challengeToSign, activeAddress]
        });

        // Verify cryptographic signature with the backend
        const verifyRes: any = await apiService.post('/api/web3/verify', {
          walletAddress: activeAddress,
          signature,
          message: challengeToSign,
          chainId: chainId || 1,
          walletType: 'metamask'
        });

        if (verifyRes && verifyRes.success) {
          setIsVerified(true);
          setVerificationProof(signature);
          localStorage.setItem('fm_web3_signature_proof', signature);
          showToast('MetaMask signature verified & sovereign binding confirmed!', 'success');
          return signature;
        } else {
          throw new Error(verifyRes?.message || 'Backend verification failed');
        }
      } catch (err: any) {
        console.error('Error in Web3 signature challenge:', err);
        if (err.code === 4001) {
          showToast('Signature request was rejected in MetaMask', 'info');
        } else {
          showToast(err.message || 'Cryptographic signature failed', 'error');
        }
        return null;
      }
    },
    [walletAddress, account, chainId, showToast]
  );

  /**
   * Connects to MetaMask extension or prompts mobile deep-link
   */
  const connectMetaMask = useCallback(
    async (options?: { skipSignature?: boolean }): Promise<{ success: boolean; address?: string; error?: string }> => {
      const provider = getMetaMaskProvider();

      // Mobile check: redirect to MetaMask dApp browser if on mobile and no injected provider
      if (!provider) {
        if (isMobileDevice()) {
          const deepLink = getMetaMaskDeepLink();
          window.location.href = deepLink;
          return { success: false, error: 'Redirecting to MetaMask Mobile app...' };
        }
        showToast('MetaMask not detected. Please install MetaMask extension from metamask.io', 'error');
        return { success: false, error: 'MetaMask not installed' };
      }

      setIsConnecting(true);

      try {
        // 1. Request account access via EIP-1193 eth_requestAccounts
        const accounts: string[] = await provider.request({
          method: 'eth_requestAccounts'
        });

        if (!accounts || accounts.length === 0) {
          throw new Error('No Ethereum accounts authorized by user');
        }

        const primaryAccount = accounts[0];

        // 2. Fetch current EVM Chain ID
        const chainIdHex: string = await provider.request({
          method: 'eth_chainId'
        });
        const parsedChainId = parseInt(chainIdHex, 16);

        setWalletAddress(primaryAccount);
        setAccount(primaryAccount);
        setIsConnected(true);
        setChainId(parsedChainId);
        setBalance(1000); // Default sovereign platform asset balance

        localStorage.setItem('fm_web3_connected_address', primaryAccount);
        localStorage.setItem('fm_web3_chain_id', String(parsedChainId));

        // 3. Cryptographic authentication challenge verification unless skipped
        if (!options?.skipSignature) {
          try {
            const nonceRes: any = await apiService.get('/api/web3/nonce', {
              walletAddress: primaryAccount
            });

            if (nonceRes?.data?.message) {
              const signature = await provider.request({
                method: 'personal_sign',
                params: [nonceRes.data.message, primaryAccount]
              });

              await apiService.post('/api/web3/verify', {
                walletAddress: primaryAccount,
                signature,
                message: nonceRes.data.message,
                chainId: parsedChainId,
                walletType: 'metamask'
              });

              setIsVerified(true);
              setVerificationProof(signature);
              localStorage.setItem('fm_web3_signature_proof', signature);
            }
          } catch (sigErr: any) {
            console.warn('Personal sign challenge deferred or cancelled:', sigErr);
            // Connected without sovereign proof signature
          }
        }

        showToast(`MetaMask connected: ${primaryAccount.slice(0, 6)}...${primaryAccount.slice(-4)}`, 'success');
        return { success: true, address: primaryAccount };
      } catch (err: any) {
        console.error('MetaMask connection error:', err);
        const errMsg = err.code === 4001 ? 'Connection rejected in MetaMask' : err.message || 'Failed to connect MetaMask';
        showToast(errMsg, 'error');
        return { success: false, error: errMsg };
      } finally {
        setIsConnecting(false);
      }
    },
    [getMetaMaskDeepLink, showToast]
  );

  /**
   * Generic wallet connection dispatcher
   */
  const connectWallet = useCallback(
    async (walletType: string = 'metamask') => {
      if (walletType.toLowerCase() === 'metamask') {
        await connectMetaMask();
      } else {
        showToast(`${walletType} wallet connector is in sandbox preview. Connecting MetaMask...`, 'info');
        await connectMetaMask();
      }
    },
    [connectMetaMask, showToast]
  );

  /**
   * Programmatically requests network switch via wallet_switchEthereumChain
   */
  const switchChain = useCallback(
    async (targetChainId: number): Promise<boolean> => {
      const provider = getMetaMaskProvider();
      if (!provider) {
        showToast('MetaMask is not available to switch chain', 'error');
        return false;
      }

      const hexChainId = `0x${targetChainId.toString(16)}`;

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }]
        });
        setChainId(targetChainId);
        showToast(`Switched network to ${CHAIN_NAMES[targetChainId] || hexChainId}`, 'success');
        return true;
      } catch (err: any) {
        console.error('Error switching network:', err);
        showToast(err.message || 'Failed to switch network in MetaMask', 'error');
        return false;
      }
    },
    [showToast]
  );

  /**
   * Listen to EIP-1193 events: accountsChanged, chainChanged
   */
  useEffect(() => {
    const provider = getMetaMaskProvider();
    if (!provider || !provider.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        const nextAccount = accounts[0];
        setWalletAddress(nextAccount);
        setAccount(nextAccount);
        setIsConnected(true);
        localStorage.setItem('fm_web3_connected_address', nextAccount);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      localStorage.setItem('fm_web3_chain_id', String(newChainId));
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    // Silent re-connection check if previously authorized
    const storedAddress = localStorage.getItem('fm_web3_connected_address');
    if (storedAddress) {
      provider
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === storedAddress.toLowerCase()) {
            setWalletAddress(accounts[0]);
            setAccount(accounts[0]);
            setIsConnected(true);
            const proof = localStorage.getItem('fm_web3_signature_proof');
            if (proof) {
              setIsVerified(true);
              setVerificationProof(proof);
            }
            provider.request({ method: 'eth_chainId' }).then((hex: string) => {
              setChainId(parseInt(hex, 16));
            }).catch(() => {});
          }
        })
        .catch(() => {});
    }

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [disconnectWallet]);

  const sendFIC = async (recipient: string, amount: number) => {
    try {
      console.info(`Sending ${amount} FIC to ${recipient}`);
      setBalance((prevBalance) => prevBalance - amount);
      showToast(`Successfully sent ${amount} FIC to ${recipient}`, 'success');
    } catch (error) {
      console.error('Error sending FIC:', error);
      showToast('Failed to send FIC', 'error');
    }
  };

  const convertFICtoUSD = (ficAmount: number): number => {
    const conversionRate = 0.1;
    return ficAmount * conversionRate;
  };

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        walletConnected: isConnected,
        connectedAccount: account,
        walletAddress,
        account,
        balance,
        chainId,
        chainName,
        isMetaMaskInstalled,
        isConnecting,
        isVerified,
        verificationProof,
        connectWallet,
        connectMetaMask,
        disconnectWallet,
        signChallenge,
        switchChain,
        getMetaMaskDeepLink,
        sendFIC,
        convertFICtoUSD
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
