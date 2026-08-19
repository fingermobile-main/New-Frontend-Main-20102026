const { Transaction, member } = require("../models/associations");
const { encrypt, decrypt } = require("../utils/encryptionUtils");

const createTransaction = async (req, res) => {
  try {
    const { senderId, receiverId, amount, type, description, referenceId } =
      req.body;

    // Basic validation
    if (!senderId || !amount || !type) {
      return res
        .status(400)
        .json({message: "Sender ID,
  amount,
  and type are required." });
    }

    // Check if sender exists
    const sender = await Member.findByPk(senderId);
    if (!sender) {
      return res.status(404).json({message: "Sender not found." });
    }

    // If receiverId is provided, check if receiver exists
    if (receiverId) {
      const receiver = await Member.findByPk(receiverId);
      if (!receiver) {
        return res.status(404).json({message: "Receiver not found." });
      }
    }

    const newTransaction = await Transaction.create({
      senderId,
      receiverId,
      amount,
      type,
      description,
      referenceId
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating,
transaction:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { memberId, type, status } = req.query;
    const whereClause = {};

    if (memberId) {
      whereClause.$or = [{senderId: memberId }, {receiverId: memberId }];
    }
    if (type) {
      whereClause.type = type;
    }
    if (status) {
      whereClause.status = status;
    }

    const transactions = await Transaction.findAll({where: whereClause,
  include: [
        {,
  model: member,
  as: "Sender",
  attributes: ["id", "membername", "email"]
        },
        {model: member,
  as: "Receiver",
  attributes: ["id", "membername", "email"]
        }
      ],
order: [["createdAt", "DESC"]]
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching,
transactions:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id, {include: [
        {,
  model: member,
  as: "Sender",
  attributes: ["id", "membername", "email"]
        },
        {model: member,
  as: "Receiver",
  attributes: ["id", "membername", "email"]
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({message: "Transaction not found." });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction by,
ID:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const updateTransactionstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({message: "Status is required." });
    }

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({message: "Transaction not found." });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error updating transaction,
status:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionstatus
};
