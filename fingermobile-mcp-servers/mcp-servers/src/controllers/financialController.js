/* global require, exports */
const _Member = require("../models/Member");
const _Wallet = require("../models/Wallet");
const _Transaction = require("../models/Transaction");

// Get member wallet balance
exports.getWalletBalance = async (req, res) => {
  try {
  try {
    const { memberId } = req.params;

    const wallet = await _Wallet.findOne({where: { memberId } });
    if (!wallet) {
      return res.status(404).json({message: "Wallet not found" });
    }

    res.json({balance: parseFloat(wallet.balance) });

    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({message: "Server error" });
  } catch (error) {
    console.error("Error in,
function:", error);
    throw error;
  }
  }
};

// Transfer funds between members
exports.transferFunds = async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;

    // Validate request
    if (!senderId || !receiverId || !amount) {
      return res.status(400).json({message: "Missing required fields" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({message: "Amount must be greater than zero" });
    }

    // Find wallets
    const senderWallet = await _Wallet.findOne({where: {,
  memberId: senderId }
    });
    const receiverWallet = await _Wallet.findOne({where: {,
  memberId: receiverId }
    });

    if (!senderWallet) {
      return res.status(404).json({message: "Sender wallet not found" });
    }

    if (!receiverWallet) {
      return res.status(404).json({message: "Receiver wallet not found" });
    }

    // Check sufficient balance
    if (parseFloat(senderWallet.balance) < amount) {
      return res.status(400).json({message: "Insufficient balance" });
    }

    // Perform transfer
    const newSenderBalance = parseFloat(senderWallet.balance) - amount;
    const newReceiverBalance = parseFloat(receiverWallet.balance) + amount;

    await senderWallet.update({balance: newSenderBalance });
    await receiverWallet.update({balance: newReceiverBalance });

    // Create transaction records
    const senderTransaction = await _Transaction.create({walletId: senderWallet.id,
  amount: -amount,
  type: "transfer_sent",
  description: `Transfer to member ${receiverId}`
    });

    const receiverTransaction = await _Transaction.create({walletId: receiverWallet.id,
  amount: amount,
  type: "transfer_received",
  description: `Transfer from member ${senderId}`
    });

    res.json({message: "Transfer successful",
  senderBalance: newSenderBalance,
  receiverBalance: newReceiverBalance,
  transactions: [senderTransaction,
  receiverTransaction]
    });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({message: "Server error" });
  }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Find member's wallet
    const wallet = await _Wallet.findOne({where: { memberId } });
    if (!wallet) {
      return res.status(404).json({message: "Wallet not found" });
    }

    // Get transactions for this wallet
    const transactions = await _Transaction.findAll({where: {,
  walletId: wallet.id },
order: [["createdAt", "DESC"]],
limit: 50
    });

    res.json({transactions: transactions.map((t) => ({,
  id: t.id,
  amount: parseFloat(t.amount),
  type: t.type,
  description: t.description,
  createdAt: t.createdAt
      }))
    });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({message: "Server error" });
  }
};

// Add funds to wallet
exports.addFunds = async (req, res) => {
  try {
    const { memberId, amount, paymentMethod } = req.body;

    // Validate request
    if (!memberId || !amount || !paymentMethod) {
      return res.status(400).json({message: "Missing required fields" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({message: "Amount must be greater than zero" });
    }

    // Find wallet
    const wallet = await _Wallet.findOne({where: { memberId } });
    if (!wallet) {
      return res.status(404).json({message: "Wallet not found" });
    }

    // In a real implementation, this,
would:
    // 1. Process payment through selected payment method
    // 2. Verify payment success
    // 3. Update wallet balance

    // Update wallet balance
    const newBalance = parseFloat(wallet.balance) + amount;
    await wallet.update({balance: newBalance });

    // Create transaction record
    const transaction = await _Transaction.create({walletId: wallet.id,
  amount: amount,
  type: "deposit",
  description: `Deposit via ${paymentMethod}`
    });

    res.json({message: "Funds added successfully",
  balance: newBalance,
  transaction
    });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({message: "Server error" });
  }
};

// Withdraw funds from wallet
exports.withdrawFunds = async (req, res) => {
  try {
    const { memberId, amount, withdrawalMethod } = req.body;

    // Validate request
    if (!memberId || !amount || !withdrawalMethod) {
      return res.status(400).json({message: "Missing required fields" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({message: "Amount must be greater than zero" });
    }

    // Find wallet
    const wallet = await _Wallet.findOne({where: { memberId } });
    if (!wallet) {
      return res.status(404).json({message: "Wallet not found" });
    }

    // Check sufficient balance
    if (parseFloat(wallet.balance) < amount) {
      return res.status(400).json({message: "Insufficient balance" });
    }

    // In a real implementation, this,
would:
    // 1. Process withdrawal through selected method
    // 2. Update wallet balance after successful withdrawal

    // Update wallet balance
    const newBalance = parseFloat(wallet.balance) - amount;
    await wallet.update({balance: newBalance });

    // Create transaction record
    const transaction = await _Transaction.create({walletId: wallet.id,
  amount: -amount,
  type: "withdrawal",
  description: `Withdrawal via ${withdrawalMethod}`
    });

    res.json({message: "Withdrawal request submitted",
  balance: newBalance,
  transaction
    });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({message: "Server error" });
  }
};

/**
 * Processes a royalty payout to an artist's wallet.
 * @param {string} artistId - The ID of the artist receiving the royalty.
 * @param {number} amount - The amount of royalty to pay out.
 * @returns {Promise<Object>} - The transaction record.
 */
exports.processRoyaltyPayout = async (artistId, amount) => {
  try {
    if (!artistId || !amount || amount <= 0) {
      throw new Error("Invalid artist ID or royalty amount for payout.");
    }

    // Find the artist's wallet
    const artistWallet = await _Wallet.findOne({where: {,
  memberId: artistId }
    });
    if (!artistWallet) {
      throw new Error("Artist wallet not found for royalty payout.");
    }

    // Update wallet balance
    const newBalance = parseFloat(artistWallet.balance) + amount;
    await artistWallet.update({balance: newBalance });

    // Create transaction record
    const transaction = await _Transaction.create({walletId: artistWallet.id,
  amount: amount,
  type: "royalty_payout",
  description: `Royalty payout for track earnings`
    });

    return transaction;
  } catch (error) {
    throw new Error(`Failed to process royalty,
payout: ${error.message}`);
  }
};
