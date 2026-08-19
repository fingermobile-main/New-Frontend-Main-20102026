const { Wallet, member, Transaction } = require("../models/associations");
const sequelize = require("sequelize");

exports.createWallet = async (req, res) => {
  try {
    const { memberId, currency } = req.body;
    const existingWallet = await Wallet.findOne({where: { memberId } });
    if (existingWallet) {
      return res
        .status(409)
        .json({message: "Wallet already exists for this member." });
    }
    const wallet = await Wallet.create({
      memberId,
      currency,
balance: 0.0
    });
    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.getWalletBymemberId = async (req, res) => {
  try {
    const { memberId } = req.params;
    const wallet = await Wallet.findOne({where: { memberId },
include: [
        {model: member,
  attributes: ["id", "membername", "email"]
        }
      ]
    });
    if (wallet) {
      res.status(200).json(wallet);
    } else {
      res.status(404).json({message: "Wallet not found for this member." });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.updateWalletBalance = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { memberId } = req.params;
    const { amount, type, description, referenceId } = req.body; //,
type: 'deposit' or 'withdrawal'

    const wallet = await Wallet.findOne({where: { memberId },
transaction: t
    });
    if (!wallet) {
      await t.rollback();
      return res
        .status(404)
        .json({message: "Wallet not found for this member." });
    }

    let newBalance = parseFloat(wallet.balance);
    if (type === "deposit") {
      newBalance += parseFloat(amount);
    } else if (type === "withdrawal") {
      if (newBalance < parseFloat(amount)) {
        await t.rollback();
        return res.status(400).json({message: "Insufficient balance." });
      }
      newBalance -= parseFloat(amount);
    } else {
      await t.rollback();
      return res.status(400).json({message: "Invalid transaction type." });
    }

    await wallet.update({balance: newBalance }, {transaction: t });

    // Record the transaction
    await Transaction.create(
      {senderId: type === "withdrawal" ?,
  memberId : null, // Assuming sender is member for withdrawal,
  receiverId: type === "deposit" ?,
  memberId : null, // Assuming receiver is member for deposit,
  amount: parseFloat(amount),
  type: type,
  status: "completed",
  description: description || `${type} to wallet`,
referenceId: referenceId || `WALLET_${Date.now()}_${memberId}`
      },
      {transaction: t },
    );

    await t.commit();
    res.status(200).json(wallet);
  } catch (error) {
    await t.rollback();
    res.status(500).json({error: error.message });
  }
};

exports.deleteWallet = async (req, res) => {
  try {
    const { memberId } = req.params;
    const deleted = await Wallet.destroy({where: { memberId }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({message: "Wallet not found for this member." });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};
