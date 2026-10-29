METAMASK

Investigation Report: MetaMask Integration Status
Executive Summary

Current Status: NOT Functionally Integrated (Simulation & Stubs Only) While the platform displays MetaMask in the UI modal and includes Web3 state scaffolding, there is currently no functional connection to the MetaMask Wallet API (window.ethereum) or the modern MetaMask Connect SDK. All connections currently simulate a timer delay and return a hardcoded dummy address (0x1234567890abcdef).

Detailed Codebase Evidence
Component / Layer	Location	Current Reality
Frontend Web3 Context	Web3Context.tsx	Mock Stub: connectWallet() calls setIsConnected(true) and hardcodes address 0x1234567890abcdef with a static balance of 1000. Does not inspect or invoke window.ethereum.
Wallet Connection Modal	WalletConnectModal.tsx	UI Placeholder: Displays the MetaMask option (🦊), but handleConnect() merely runs await new Promise(resolve => setTimeout(resolve, 1500)) before closing the modal without triggering MetaMask.
Dependencies	package.json	Neither @metamask/connect-evm, @metamask/connect-multichain, viem, wagmi, nor ethers are installed in apps/frontend-main.
Backend Web3 Service	web3_service.js	Contains legacy placeholder code referencing the deprecated Ethereum Rinkeby testnet and dummy contract addresses (0x000...000).
Primary Ledger	WalletControllerComplete.js	Operates strictly on the Sovereign off-chain PostgreSQL database (fic_wallets, fic_transactions, and the Alternative Bank treasury rail 0514108422).
Proposed Solution: How to Make MetaMask Work for FingerMobile

To deliver true sovereign authority, tamper-proofing, and frictionless cross-platform access across both desktop and mobile, we recommend a 2-Tier Architecture:

Step-by-Step Implementation Strategy
Phase 1: Native EIP-1193 MetaMask Wallet API (window.ethereum)
Zero Bloat & Instant Loading: Works without large third-party bundles in any browser with the MetaMask extension, Brave, or MetaMask Mobile browser.
Core Functionalities:
Wallet Connection: Call window.ethereum.request({ method: 'eth_requestAccounts' }) to retrieve the active checksummed address.
Event Listeners: Attach accountsChanged and chainChanged listeners to re-render balances dynamically when the user switches accounts in their extension.
Network Auto-Switching: Use wallet_switchEthereumChain (with fallback to wallet_addEthereumChain) to automatically prompt users to connect to the protocol’s preferred EVM network (e.g. Base, Polygon, or Ethereum Mainnet).
Cryptographic Identity Verification: Use personal_sign with an HMAC challenge nonce issued by the backend:
Signature
=
signMessage
(
"FingerMobile Sovereign Auth Nonce: " 
+
nonce
)
Signature=signMessage("FingerMobile Sovereign Auth Nonce: " +nonce)
This guarantees the user actually controls the private keys of the connecting wallet without requiring gas fees.
Phase 2: MetaMask Connect SDK (Cross-Platform Mobile Deeplinking)
Install @metamask/connect-evm to support users browsing on standard mobile browsers (Chrome / Safari on iOS & Android):
Provides CAIP-25 multichain session negotiation.
Launches MetaMask via universal mobile deeplinks (metamask://dapp/...) or QR pairing so mobile users can approve transactions seamlessly.
Phase 3: PostgreSQL Database Binding & Hybrid Sovereign Ledger
Create a user_web3_wallets table in PostgreSQL:
sql
CREATE TABLE IF NOT EXISTS user_web3_wallets (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_address VARCHAR(42) NOT NULL UNIQUE,
  chain_id INTEGER NOT NULL,
  wallet_type VARCHAR(32) DEFAULT 'metamask',
  verified BOOLEAN DEFAULT FALSE,
  signature_proof TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
Connect the verified wallet to the FingerMobile Infinite Coin Lion Medallion and Hallmark systems so members can view their on-chain tokens, NFT medallions, and liquid FIC balances in one place.