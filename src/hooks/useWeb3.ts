import { useContext } from 'react';
import { Web3Context, Web3ContextType } from '../contexts/Web3Context';

/**
 * Custom hook to easily consume Web3Context values.
 * Must be wrapped inside a <Web3Provider> to avoid context initialization errors.
 */
export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  
  if (context === undefined || context === null) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }

  return context;
};