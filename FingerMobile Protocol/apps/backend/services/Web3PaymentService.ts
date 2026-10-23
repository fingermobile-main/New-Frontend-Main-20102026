import { ethers } from 'ethers';
import logger from '../utils/logger';
import pool from '../db';
import AICreditBalanceService from './AICreditBalanceService';

interface TransactionReceipt {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  status: number;
}

class Web3PaymentService {
  private provider: ethers.JsonRpcProvider;
  private ficContract: any;
  private contractABI: ethers.InterfaceAbi;
  private contractAddress: string;

  constructor() {
    // Initialize provider
    if (!process.env.WEB3_RPC_URL) {
      throw new Error('WEB3_RPC_URL environment variable is required');
    }
    
    this.provider = new ethers.JsonRpcProvider(process.env.WEB3_RPC_URL);
    
    // Define FIC token contract ABI
    this.contractABI = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address owner) view returns (uint256)',
      'function transfer(address to, uint256 amount) returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)',
      'function approve(address spender, uint256 amount) returns (bool)',
      'event Transfer(address indexed from, address indexed to, uint256 value)',
      'event Approval(address indexed owner, address indexed spender, uint256 value)'
    ];
    
    // Set contract address
    if (!process.env.FIC_CONTRACT_ADDRESS) {
      throw new Error('FIC_CONTRACT_ADDRESS environment variable is required');
    }
    
    this.contractAddress = process.env.FIC_CONTRACT_ADDRESS;
    
    // Initialize contract instance
    this.ficContract = new ethers.Contract(this.contractAddress, this.contractABI, this.provider);
  }

  /**
   * Get FIC token balance for a given address
   */
  async getFICBalance(address: string): Promise<number> {
    try {
      if (!ethers.isAddress(address)) {
        throw new Error(`Invalid Ethereum address: ${address}`);
      }

      const balance = await this.ficContract.balanceOf(address);
      const formattedBalance = Number(ethers.formatUnits(balance, 18)); // Assuming 18 decimals
      
      logger.info(`FIC balance for ${address}: ${formattedBalance}`);
      
      return formattedBalance;
    } catch (error: any) {
      logger.error('Error getting FIC balance:', error);
      throw error;
    }
  }

  /**
   * Transfer FIC tokens from one address to another
   */
  async transferFIC(
    fromPrivateKey: string,
    toAddress: string,
    amount: number,
    userId: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!ethers.isAddress(toAddress)) {
        throw new Error(`Invalid recipient address: ${toAddress}`);
      }

      // Create wallet with private key
      const wallet = new ethers.Wallet(fromPrivateKey, this.provider);
      
      // Convert amount to Wei (assuming 18 decimals for FIC)
      const amountInWei = ethers.parseUnits(amount.toString(), 18);
      
      // For ethers v6, use the contract with populated transaction
      const contractInterface = new ethers.Interface([
        "function transfer(address to, uint256 amount) returns (bool)"
      ]);
      
      // Encode the function data
      const data = contractInterface.encodeFunctionData("transfer", [toAddress, amountInWei]);
      
      // Send the transaction
      const txRequest = {
        to: this.contractAddress,
        data: data,
        // Add other transaction parameters as needed
      };
      
      const tx = await wallet.sendTransaction(txRequest);
      
      logger.info(`FIC transfer initiated: ${tx.hash} from ${wallet.address} to ${toAddress}, amount: ${amount}`);
      
      // Wait for the transaction to be mined
      const receipt: TransactionReceipt = await tx.wait() as unknown as TransactionReceipt;
      
      if (receipt.status === 1) { // Success
        logger.info(`FIC transfer completed: ${receipt.hash}`);
        
        // Record the transaction in the database
        await this.recordTransaction(
          userId,
          receipt.hash,
          amount,
          'CRYPTO_TRANSFER',
          'WEB3',
          'COMPLETED',
          `FIC transfer to ${toAddress}`
        );
        
        // Update user's crypto balance in wallet table
        await this.updateCryptoBalance(userId, toAddress, amount, 'receive');
        
        return {
          success: true,
          transactionHash: receipt.hash,
        };
      } else {
        logger.error(`FIC transfer failed: ${receipt.hash}`);
        return {
          success: false,
          error: 'Transaction failed',
        };
      }
    } catch (error: any) {
      logger.error('Error transferring FIC:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get the FIC contract details
   */
  async getFICDetails(): Promise<{ name: string; symbol: string; totalSupply: string }> {
    try {
      const name = await this.ficContract.name();
      const symbol = await this.ficContract.symbol();
      const totalSupply = await this.ficContract.totalSupply();
      
      return {
        name,
        symbol,
        totalSupply: ethers.formatUnits(totalSupply, 18),
      };
    } catch (error: any) {
      logger.error('Error getting FIC details:', error);
      throw error;
    }
  }

  /**
   * Approve spending of FIC tokens by a spender address
   */
  async approveSpending(
    ownerPrivateKey: string,
    spenderAddress: string,
    amount: number
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!ethers.isAddress(spenderAddress)) {
        throw new Error(`Invalid spender address: ${spenderAddress}`);
      }

      // Create wallet with private key
      const wallet = new ethers.Wallet(ownerPrivateKey, this.provider);
      
      // Convert amount to Wei (assuming 18 decimals for FIC)
      const amountInWei = ethers.parseUnits(amount.toString(), 18);
      
      // For ethers v6, use the contract with populated transaction
      const contractInterface = new ethers.Interface([
        "function approve(address spender, uint256 amount) returns (bool)"
      ]);
      
      // Encode the function data
      const data = contractInterface.encodeFunctionData("approve", [spenderAddress, amountInWei]);
      
      // Send the transaction
      const txRequest = {
        to: this.contractAddress,
        data: data,
        // Add other transaction parameters as needed
      };
      
      const tx = await wallet.sendTransaction(txRequest);
      
      logger.info(`FIC approval initiated: ${tx.hash} by ${wallet.address} for ${spenderAddress}, amount: ${amount}`);
      
      // Wait for the transaction to be mined
      const receipt: TransactionReceipt = await tx.wait() as unknown as TransactionReceipt;
      
      if (receipt.status === 1) { // Success
        logger.info(`FIC approval completed: ${receipt.hash}`);
        
        return {
          success: true,
          transactionHash: receipt.hash,
        };
      } else {
        logger.error(`FIC approval failed: ${receipt.hash}`);
        return {
          success: false,
          error: 'Approval transaction failed',
        };
      }
    } catch (error: any) {
      logger.error('Error approving FIC spending:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get allowance for a spender
   */
  async getAllowance(ownerAddress: string, spenderAddress: string): Promise<number> {
    try {
      if (!ethers.isAddress(ownerAddress) || !ethers.isAddress(spenderAddress)) {
        throw new Error(`Invalid addresses: owner=${ownerAddress}, spender=${spenderAddress}`);
      }

      const allowance = await this.ficContract.allowance(ownerAddress, spenderAddress);
      const formattedAllowance = Number(ethers.formatUnits(allowance, 18));
      
      logger.info(`Allowance for ${spenderAddress} from ${ownerAddress}: ${formattedAllowance}`);
      
      return formattedAllowance;
    } catch (error: any) {
      logger.error('Error getting allowance:', error);
      throw error;
    }
  }

  /**
   * Generate a new Ethereum address (for wallet creation)
   */
  generateNewWallet(): { address: string; privateKey: string } {
    try {
      const wallet = ethers.Wallet.createRandom();
      
      logger.info(`Generated new wallet: ${wallet.address}`);
      
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
    } catch (error: any) {
      logger.error('Error generating new wallet:', error);
      throw error;
    }
  }

  /**
   * Connect user to their wallet and store the address
   */
  async connectWallet(userId: string, walletAddress: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!ethers.isAddress(walletAddress)) {
        throw new Error(`Invalid wallet address: ${walletAddress}`);
      }

      // Verify the address is valid by checking its balance
      await this.getFICBalance(walletAddress);

      // Store the wallet address in the user's wallet record
      const result = await pool.query(
        'SELECT wallet_id FROM user_wallets WHERE user_id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        // Create a wallet if one doesn't exist
        await pool.query(
          'INSERT INTO user_wallets (user_id, crypto_address) VALUES ($1, $2)',
          [userId, walletAddress]
        );
      } else {
        // Update existing wallet record
        await pool.query(
          'UPDATE user_wallets SET crypto_address = $1 WHERE user_id = $2',
          [walletAddress, userId]
        );
      }

      logger.info(`Connected wallet ${walletAddress} to user ${userId}`);

      return {
        success: true,
      };
    } catch (error: any) {
      logger.error('Error connecting wallet:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get user's connected wallet address
   */
  async getUserWalletAddress(userId: string, walletType: string = 'default'): Promise<string | null> {
    try {
      const result = await pool.query(
        'SELECT crypto_address FROM user_crypto_addresses WHERE user_id = $1 AND type = $2',
        [userId, walletType]
      );

      if (result.rows.length > 0) {
        return (result.rows[0] as unknown as { crypto_address: string }).crypto_address;
      }

      return null;
    } catch (error: any) {
      logger.error('Error getting user wallet address:', error);
      throw error;
    }
  }

  /**
   * Record crypto transaction in the database
   */
  private async recordTransaction(
    userId: string,
    referenceId: string,
    amount: number,
    type: string,
    paymentGateway: string,
    status: string,
    description: string
  ): Promise<void> {
    try {
      // Get user wallet ID
      const walletResult = await pool.query(
        'SELECT wallet_id FROM user_wallets WHERE user_id = $1',
        [userId]
      );

      if (walletResult.rows.length === 0) {
        // Create a wallet if one doesn't exist
        const newWalletResult = await pool.query(
          'INSERT INTO user_wallets (user_id) VALUES ($1) RETURNING wallet_id',
          [userId]
        );
        const walletId = (newWalletResult.rows[0] as unknown as { wallet_id: string }).wallet_id;
        
        // Record the transaction
        await pool.query(`
          INSERT INTO transactions (wallet_id, user_id, type, amount, currency, reference_id, payment_gateway, status, description)
          VALUES ($1, $2, $3, $4, 'FIC', $5, $6, $7, $8)
        `, [walletId, userId, type, amount, referenceId, paymentGateway, status, description]);
      } else {
        const walletId = (walletResult.rows[0] as unknown as { wallet_id: string }).wallet_id;
        
        // Record the transaction
        await pool.query(`
          INSERT INTO transactions (wallet_id, user_id, type, amount, currency, reference_id, payment_gateway, status, description)
          VALUES ($1, $2, $3, $4, 'FIC', $5, $6, $7, $8)
        `, [walletId, userId, type, amount, referenceId, paymentGateway, status, description]);
      }

      logger.info(`Recorded crypto transaction for user ${userId}, reference: ${referenceId}`);
    } catch (error: any) {
      logger.error('Error recording crypto transaction:', error);
      throw error;
    }
  }

  /**
   * Update user's crypto balance in the wallet table
   */
  private async updateCryptoBalance(userId: string, address: string, amount: number, type: 'send' | 'receive'): Promise<void> {
    try {
      // For now, we'll just log this action since the actual balance is on-chain
      // In a real implementation, we might want to track off-chain balances for faster lookups
      logger.info(`Crypto balance update for ${address} (user ${userId}): ${type === 'receive' ? '+' : '-'}${amount} FIC`);
    } catch (error: any) {
      logger.error('Error updating crypto balance:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(toAddress: string, amount: number): Promise<number> {
    try {
      if (!ethers.isAddress(toAddress)) {
        throw new Error(`Invalid recipient address: ${toAddress}`);
      }

      const amountInWei = ethers.parseUnits(amount.toString(), 18);
      
      // Estimate gas for a simple transfer
      const estimatedGas = await this.provider.estimateGas({
        to: this.contractAddress,
        data: this.ficContract.interface.encodeFunctionData('transfer', [toAddress, amountInWei]),
      });
      
      logger.info(`Estimated gas for transfer to ${toAddress}: ${estimatedGas}`);
      
      return Number(estimatedGas);
    } catch (error: any) {
      logger.error('Error estimating gas:', error);
      throw error;
    }
  }
}

export default new Web3PaymentService();