import React, { useState } from 'react';
import { useAppContext } from './AppContext';

interface Web3ContextType {
  isConnected: boolean;
  walletConnected: boolean;
  connectedAccount: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  walletAddress: string | null;
  account: string | null;
  balance: number;
  sendFIC?: (recipient: string, amount: number) => Promise<void>;
  convertFICtoUSD?: (ficAmount: number) => number;
}

const Web3Context = React.createContext<Web3ContextType | undefined>(undefined);

const useWeb3 = () => {
  const context = React.useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

export { Web3Context, useWeb3 };
export type { Web3ContextType };

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const { showToast } = useAppContext();
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
  const [account, setAccount] = React.useState<string | null>(null);
  const [balance, setBalance] = React.useState<number>(0);

  const connectWallet = async () => {
    try {
      // Implementation to connect wallet
      setIsConnected(true);
      const addr = "0x1234567890abcdef";
      setWalletAddress(addr);
      setAccount(addr);
      setBalance(1000); // Set a default balance for testing
      showToast("Wallet connected successfully", "success");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      showToast("Failed to connect wallet", "error");
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setAccount(null);
    setBalance(0);
    showToast("Wallet disconnected", "info");
  };

  const sendFIC = async (recipient: string, amount: number) => {
    try {
      // Implementation to send FIC
      console.info(`Sending ${amount} FIC to ${recipient}`);
      // Update balance
      setBalance((prevBalance) => prevBalance - amount);
      showToast(`Successfully sent ${amount} FIC`, "success");
    } catch (error) {
      console.error("Error sending FIC:", error);
      showToast("Failed to send FIC", "error");
    }
  };

  const convertFICtoUSD = (ficAmount: number): number => {
    // Simple conversion rate for testing
    const conversionRate = 0.1; // 1 FIC = $0.10
    return ficAmount * conversionRate;
  };

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        walletConnected: isConnected,
        connectedAccount: account,
        connectWallet,
        disconnectWallet,
        walletAddress,
        account,
        balance,
        sendFIC,
        convertFICtoUSD
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
