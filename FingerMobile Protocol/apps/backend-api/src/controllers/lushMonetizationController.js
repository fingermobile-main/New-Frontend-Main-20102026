/**
 * Lush Monetization Controller
 * Handles all monetization-related operations for the Lush Pressies app
 */

const db = require('../config/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class LushMonetizationController {
  /**
   * Get available products for purchase
   */
  static async getAvailableProducts() {
    try {
      // In a real implementation, this would come from a database
      const products = [
        {
          id: 'credits_100',
          name: '100 Lush Credits',
          description: '100 credits for using premium features',
          price: 999, // $9.99 in cents
          credits: 100
        },
        {
          id: 'credits_500',
          name: '500 Lush Credits',
          description: '500 credits for using premium features',
          price: 3999, // $39.99 in cents
          credits: 500
        },
        {
          id: 'credits_1000',
          name: '1000 Lush Credits',
          description: '1000 credits for using premium features (best value)',
          price: 6999, // $69.99 in cents
          credits: 1000
        },
        {
          id: 'gift_basic',
          name: 'Virtual Rose',
          description: 'Send a beautiful virtual rose to someone special',
          price: 499, // $4.99 in cents
          type: 'gift'
        },
        {
          id: 'gift_medium',
          name: 'Virtual Bouquet',
          description: 'Send an elegant bouquet to brighten someone\'s day',
          price: 999, // $9.99 in cents
          type: 'gift'
        },
        {
          id: 'gift_premium',
          name: 'Luxury Gift Box',
          description: 'Send an exclusive luxury gift box with surprises',
          price: 1999, // $19.99 in cents
          type: 'gift'
        }
      ];

      return {
        success: true,
        products
      };
    } catch (error) {
      console.error('Error getting available products:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Process a product purchase
   */
  static async processPurchase(userId, productId, paymentMethodId) {
    try {
      // Validate inputs
      if (!userId || !productId || !paymentMethodId) {
        return { success: false, error: 'User ID, product ID, and payment method ID are required' };
      }

      // Get product details
      const products = (await this.getAvailableProducts()).products;
      const product = products.find(p => p.id === productId);
      if (!product) {
        return { success: false, error: 'Invalid product ID' };
      }

      // Process payment using Stripe
      let paymentIntent;
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: product.price,
          currency: 'usd',
          payment_method: paymentMethodId,
          confirm: true,
          return_url: `${process.env.FRONTEND_URL}/purchase-success`,
        });
      } catch (paymentError) {
        return { success: false, error: `Payment failed: ${paymentError.message}` };
      }

      // Create purchase record
      const purchase = await db.createPurchase({
        userId,
        productId,
        productName: product.name,
        amount: product.price,
        currency: 'usd',
        paymentIntentId: paymentIntent.id,
        status: 'completed',
        purchasedAt: new Date()
      });

      // Distribute the purchased item to user
      await this.distributePurchaseItem(userId, product);

      return {
        success: true,
        purchase,
        product
      };
    } catch (error) {
      console.error('Error processing purchase:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Distribute purchased item to user
   */
  static async distributePurchaseItem(userId, product) {
    if (product.credits) {
      // Add credits to user's account
      await db.addCreditsToUser(userId, product.credits);
    } else if (product.type === 'gift') {
      // For gifts, add to user's gift inventory
      await db.addGiftToUserInventory(userId, product.id, product.name, product.description);
    }
  }

  /**
   * Send a gift to another user
   */
  static async sendGift(senderId, recipientId, giftId) {
    try {
      // Validate inputs
      if (!senderId || !recipientId || !giftId) {
        return { success: false, error: 'Sender ID, recipient ID, and gift ID are required' };
      }

      // Check if users are connected (matched, friends, etc.)
      const isConnected = await db.areUsersConnected(senderId, recipientId);
      if (!isConnected) {
        return { success: false, error: 'Users must be connected to send gifts' };
      }

      // Check if sender has the gift in their inventory
      const hasGift = await db.hasGiftInInventory(senderId, giftId);
      if (!hasGift) {
        return { success: false, error: 'Sender does not have this gift in their inventory' };
      }

      // Remove gift from sender's inventory
      await db.removeGiftFromUserInventory(senderId, giftId);

      // Add gift to recipient's received gifts
      const giftRecord = await db.addGiftToRecipient(recipientId, senderId, giftId);

      // Update user stats
      await db.incrementGiftSentCount(senderId);
      await db.incrementGiftReceivedCount(recipientId);

      // Notify recipient of gift
      this.notifyRecipientOfGift(recipientId, senderId, giftId);

      return {
        success: true,
        gift: giftRecord
      };
    } catch (error) {
      console.error('Error sending gift:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Notify recipient of received gift
   */
  static notifyRecipientOfGift(recipientId, senderId, giftId) {
    console.log(`User ${recipientId} received a gift from user ${senderId}`);
    // In a real implementation, this would send a push notification or email
  }

  /**
   * Get user's credit balance
   */
  static async getUserCredits(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const credits = await db.getUserCredits(userId);

      return {
        success: true,
        credits
      };
    } catch (error) {
      console.error('Error getting user credits:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user's purchase history
   */
  static async getUserPurchaseHistory(userId, limit = 10, offset = 0) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const purchases = await db.getUserPurchases(userId, limit, offset);

      return {
        success: true,
        purchases,
        count: purchases.length
      };
    } catch (error) {
      console.error('Error getting user purchase history:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Spend user's credits on a feature
   */
  static async spendCredits(userId, featureId, amount) {
    try {
      // Validate inputs
      if (!userId || !featureId || !amount || amount <= 0) {
        return { success: false, error: 'User ID, feature ID, and positive amount are required' };
      }

      // Get user's current credits
      const currentCredits = await db.getUserCredits(userId);
      if (currentCredits < amount) {
        return { success: false, error: 'Insufficient credits' };
      }

      // Deduct credits
      const updatedCredits = await db.deductCreditsFromUser(userId, amount);

      // Record the transaction
      await db.createCreditTransaction({
        userId,
        featureId,
        amount: -amount,
        balanceAfter: updatedCredits,
        description: `Spent on ${featureId}`,
        timestamp: new Date()
      });

      // Execute the feature activation
      await this.executeFeatureActivation(userId, featureId, amount);

      return {
        success: true,
        remainingCredits: updatedCredits,
        featureId,
        amountSpent: amount
      };
    } catch (error) {
      console.error('Error spending credits:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Execute feature activation after credit deduction
   */
  static async executeFeatureActivation(userId, featureId, amount) {
    // Activate the feature based on the feature ID
    switch (featureId) {
      case 'boost_profile':
        // Implement profile boost logic
        await db.activateProfileBoost(userId, 24 * 60 * 60 * 1000); // 24 hours
        break;
      case 'highlight_profile':
        // Implement profile highlight logic
        await db.activateProfileHighlight(userId, 12 * 60 * 60 * 1000); // 12 hours
        break;
      case 'incognito_mode':
        // Implement incognito mode logic
        await db.activateIncognitoMode(userId, 7 * 24 * 60 * 60 * 1000); // 7 days
        break;
      case 'super_like':
        // Implement super like logic
        await db.grantSuperLike(userId);
        break;
      case 'rewind':
        // Implement rewind logic
        await db.grantRewind(userId);
        break;
      case 'extended_contacts':
        // Implement extended contacts logic
        await db.grantExtendedContactsAccess(userId, 7 * 24 * 60 * 60 * 1000); // 7 days
        break;
      default:
        console.warn(`Unknown feature ID: ${featureId}`);
        break;
    }
  }

  /**
   * Get user's gift inventory
   */
  static async getUserGiftInventory(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const gifts = await db.getUserGiftInventory(userId);

      return {
        success: true,
        gifts
      };
    } catch (error) {
      console.error('Error getting user gift inventory:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user's received gifts
   */
  static async getReceivedGifts(userId, limit = 10, offset = 0) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const gifts = await db.getUserReceivedGifts(userId, limit, offset);

      // Get sender details for each gift
      const giftsWithDetails = await Promise.all(
        gifts.map(async (gift) => {
          const sender = await db.getUser(gift.senderId);
          return {
            ...gift,
            sender: {
              id: sender.id,
              username: sender.username,
              firstName: sender.firstName,
              lastName: sender.lastName,
              avatar: sender.avatar
            }
          };
        })
      );

      return {
        success: true,
        gifts: giftsWithDetails,
        count: giftsWithDetails.length
      };
    } catch (error) {
      console.error('Error getting received gifts:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get monetization statistics
   */
  static async getMonetizationStats() {
    try {
      const stats = await db.getMonetizationStats();

      return {
        success: true,
        stats: {
          totalRevenue: stats.totalRevenue || 0,
          totalPurchases: stats.totalPurchases || 0,
          activePayingUsers: stats.activePayingUsers || 0,
          averageOrderValue: stats.totalPurchases > 0 ? stats.totalRevenue / stats.totalPurchases : 0,
          revenueByProduct: stats.revenueByProduct || {},
          monthlyRevenue: stats.monthlyRevenue || []
        }
      };
    } catch (error) {
      console.error('Error getting monetization stats:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Create a custom gift
   */
  static async createCustomGift(userId, giftDetails) {
    try {
      // Validate inputs
      if (!userId || !giftDetails.name || !giftDetails.description || !giftDetails.price) {
        return { success: false, error: 'User ID and gift details are required' };
      }

      // Check if user has permission to create custom gifts
      const userPermissions = await db.getUserPermissions(userId);
      if (!userPermissions.canCreateCustomGifts) {
        return { success: false, error: 'User does not have permission to create custom gifts' };
      }

      // Create custom gift
      const customGift = await db.createCustomGift({
        ...giftDetails,
        creatorId: userId,
        createdAt: new Date(),
        status: 'pending_approval' // Needs admin approval
      });

      // Notify admins of new custom gift request
      this.notifyAdminsOfCustomGift(customGift);

      return {
        success: true,
        gift: customGift
      };
    } catch (error) {
      console.error('Error creating custom gift:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Notify admins of new custom gift request
   */
  static notifyAdminsOfCustomGift(gift) {
    console.log(`New custom gift request: ${gift.name} from user ${gift.creatorId}`);
    // In a real implementation, this would notify admins via email or dashboard
  }

  /**
   * Get trending gifts
   */
  static async getTrendingGifts(limit = 10) {
    try {
      const trendingGifts = await db.getTrendingGifts(limit);

      return {
        success: true,
        gifts: trendingGifts
      };
    } catch (error) {
      console.error('Error getting trending gifts:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Apply promo code
   */
  static async applyPromoCode(userId, promoCode) {
    try {
      // Validate inputs
      if (!userId || !promoCode) {
        return { success: false, error: 'User ID and promo code are required' };
      }

      // Get promo code details
      const promo = await db.getPromoCode(promoCode);
      if (!promo || promo.status !== 'active') {
        return { success: false, error: 'Invalid or inactive promo code' };
      }

      // Check if promo code is expired
      if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) {
        return { success: false, error: 'Promo code has expired' };
      }

      // Check if user has already used this promo code
      const hasUsed = await db.hasUserUsedPromoCode(userId, promoCode);
      if (hasUsed) {
        return { success: false, error: 'Promo code already used by user' };
      }

      // Apply the promotion
      let reward;
      switch (promo.type) {
        case 'percentage_discount':
          reward = `Discount of ${promo.value}% on next purchase`;
          break;
        case 'fixed_amount_credit':
          reward = `Bonus of ${promo.value} credits`;
          await db.addCreditsToUser(userId, promo.value);
          break;
        case 'free_trial':
          reward = `Free trial extension of ${promo.value} days`;
          break;
        default:
          return { success: false, error: 'Unknown promo code type' };
      }

      // Record usage
      await db.recordPromoCodeUsage({
        userId,
        promoCode,
        reward,
        usedAt: new Date()
      });

      return {
        success: true,
        reward,
        promoCode: promo
      };
    } catch (error) {
      console.error('Error applying promo code:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}

module.exports = LushMonetizationController;