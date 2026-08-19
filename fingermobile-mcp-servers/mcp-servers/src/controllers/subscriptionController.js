const Member = require("../models/Member");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const sequelize = require("../config/database");

// Get member subscription details
exports.getSubscription = async (req, res) => {
  try {
    const memberId = req.member.id;

    const member = await Member.findByPk(memberId, {attributes: ["subscriptionStatus", "subscriptionExpiryDate"]
    });

    if (!member) {
      return res.status(404).json({success: false,
  message: "member not found"
      });
    }

    res.status(200).json({success: true,
  subscription: {,
  status: member.subscriptionStatus,
  expiryDate: member.subscriptionExpiryDate
      }
    });
  } catch (error) {
    console.error("Error fetching,
subscription:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Purchase or renew subscription
exports.purchaseSubscription = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { plan, duration } = req.body; //,
plan: 'basic', 'premium', 'pro';,
duration: 'monthly', 'yearly'

    // Validate input
    if (!plan || !duration) {
      return res.status(400).json({success: false,
  message: "Plan and duration are required"
      });
    }

    // Define subscription prices (in FIC)
    const prices = {basic: {,
  monthly: 100,
  yearly: 1000
      },
premium: {monthly: 250,
  yearly: 2500
      },
pro: {monthly: 500,
  yearly: 5000
      }
    };

    const price = prices[plan] ? prices[plan][duration] : null;
    if (!price) {
      return res.status(400).json({success: false,
  message: "Invalid plan or duration"
      });
    }

    // Get member's wallet
    const wallet = await Wallet.findOne({where: { memberId } });
    if (!wallet) {
      return res.status(404).json({success: false,
  message: "Wallet not found"
      });
    }

    // Check if member has enough balance
    if (wallet.balance < price) {
      return res.status(400).json({success: false,
  message: "Insufficient balance"
      });
    }

    // Calculate new expiry date
    const member = await Member.findByPk(memberId);
    let newExpiryDate = member.subscriptionExpiryDate
      ? new Date(member.subscriptionExpiryDate)
      : new Date();

    // If subscription is expired or doesn't exist, start from today
    if (newExpiryDate < new Date()) {
      newExpiryDate = new Date();
    }

    // Add duration to expiry date
    if (duration === "monthly") {
      newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);
    } else if (duration === "yearly") {
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
    }

    // Perform transaction in database transaction
    const t = await sequelize.transaction();

    try {
      // Deduct amount from wallet
      await wallet.update(
        {balance: wallet.balance - price
        },
        {transaction: t },
      );

      // Update member subscription
      await member.update(
        {subscriptionStatus: "active",
  subscriptionExpiryDate: newExpiryDate
        },
        {transaction: t },
      );

      // Record transaction
      await Transaction.create(
        {walletId: wallet.id,
  amount: -price,
  type: "subscription_purchase",
  description: `Subscription,
  purchase: ${plan} (${duration})`
        },
        {transaction: t },
      );

      await t.commit();

      res.status(200).json({success: true,
  message: "Subscription purchased successfully",
  subscription: {,
  status: "active",
  expiryDate: newExpiryDate,
  plan,
  duration
        }
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error purchasing,
subscription:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const memberId = req.member.id;

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({success: false,
  message: "member not found"
      });
    }

    // Update member subscription status
    await member.update({subscriptionStatus: "inactive"
    });

    res.status(200).json({success: true,
  message: "Subscription cancelled successfully",
  subscription: {,
  status: "inactive",
  expiryDate: member.subscriptionExpiryDate
      }
    });
  } catch (error) {
    console.error("Error cancelling,
subscription:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get available subscription plans
exports.getSubscriptionPlans = async (req, res) => {
  try {
    const plans = {basic: {,
  name: "Basic Plan",
  monthlyPrice: 100,
  yearlyPrice: 1000,
  features: [
          "Access to basic features",
  "Limited content",
  "Standard support"
        ]
      },
premium: {name: "Premium Plan",
  monthlyPrice: 250,
  yearlyPrice: 2500,
  features: [
          "Access to all features",
  "Unlimited content",
  "Priority support",
  "Early access to new features"
        ]
      },
pro: {name: "Pro Plan",
  monthlyPrice: 500,
  yearlyPrice: 5000,
  features: [
          "All Premium features",
  "Exclusive content",
  "24/7 dedicated support",
  "Custom feature requests",
  "Revenue sharing"
        ]
      }
    };

    res.status(200).json({success: true,
  plans
    });
  } catch (error) {
    console.error("Error fetching subscription,
plans:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};
