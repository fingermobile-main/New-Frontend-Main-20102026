/**
 * LushLapidaire Gifting Service
 * Handles escrowlapidaire gifting and gift exchanges
 */

const db = require('../config/database');

class LushLapidaireGifting {
  /**
   * Create an escrowlapidaire gift
   */
  static async createEscrowGift(senderId, recipientId, giftDetails) {
    try {
      if (!senderId || !recipientId || !giftDetails) {
        throw new Error('Sender ID, recipient ID, and gift details are required');
      }

      // Validate that sender and recipient are connected (matched, etc.)
      const isConnected = await db.areUsersConnected(senderId, recipientId);
      if (!isConnected) {
        throw new Error('Users must be connected to send an escrow gift');
      }

      // Validate sender has sufficient funds/credits
      const hasFunds = await db.hasSufficientFunds(senderId, giftDetails.value);
      if (!hasFunds) {
        throw new Error('Insufficient funds for gift value');
      }

      // Create escrow gift record
      const escrowGift = await db.createEscrowGift({
        senderId,
        recipientId,
        giftDetails,
        status: 'held_in_escrow',
        heldUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Hold for 7 days
        createdAt: new Date()
      });

      // Deduct funds from sender (held in escrow)
      await db.holdFundsInEscrow(senderId, giftDetails.value);

      // Notify recipient of pending gift
      await this.notifyRecipientOfPendingGift(recipientId, senderId, escrowGift);

      return {
        success: true,
        escrowGift
      };
    } catch (error) {
      console.error('Error creating escrow gift:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Release escrow gift to recipient
   */
  static async releaseEscrowGift(giftId, releasingUserId) {
    try {
      if (!giftId || !releasingUserId) {
        throw new Error('Gift ID and releasing user ID are required');
      }

      // Get escrow gift details
      const escrowGift = await db.getEscrowGift(giftId);
      if (!escrowGift) {
        throw new Error('Escrow gift not found');
      }

      // Verify that the releasing user is authorized (either sender or recipient)
      if (releasingUserId !== escrowGift.senderId && releasingUserId !== escrowGift.recipientId) {
        throw new Error('Unauthorized to release escrow gift');
      }

      // Check gift status
      if (escrowGift.status !== 'held_in_escrow') {
        throw new Error('Gift is not in escrow');
      }

      // Update gift status to released
      const updatedGift = await db.updateEscrowGiftStatus(giftId, 'released_to_recipient');

      // Transfer funds from escrow to recipient
      await db.transferFromEscrowToRecipient(escrowGift.senderId, escrowGift.recipientId, escrowGift.giftDetails.value);

      // Notify both parties of gift release
      await this.notifyPartiesOfGiftRelease(escrowGift);

      return {
        success: true,
        gift: updatedGift
      };
    } catch (error) {
      console.error('Error releasing escrow gift:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Refund escrow gift to sender
   */
  static async refundEscrowGift(giftId, refundingUserId, reason = 'unknown') {
    try {
      if (!giftId || !refundingUserId) {
        throw new Error('Gift ID and refunding user ID are required');
      }

      // Get escrow gift details
      const escrowGift = await db.getEscrowGift(giftId);
      if (!escrowGift) {
        throw new Error('Escrow gift not found');
      }

      // Verify that the refunding user is authorized (either sender, recipient, or admin)
      if (refundingUserId !== escrowGift.senderId && 
          refundingUserId !== escrowGift.recipientId && 
          !(await db.isAdmin(refundingUserId))) {
        throw new Error('Unauthorized to refund escrow gift');
      }

      // Check gift status
      if (escrowGift.status !== 'held_in_escrow') {
        throw new Error('Gift is not in escrow');
      }

      // Update gift status to refunded
      const updatedGift = await db.updateEscrowGiftStatus(giftId, 'refunded_to_sender', reason);

      // Return funds to sender
      await db.returnFundsToSender(escrowGift.senderId, escrowGift.giftDetails.value);

      // Notify both parties of refund
      await this.notifyPartiesOfRefund(escrowGift, reason);

      return {
        success: true,
        gift: updatedGift
      };
    } catch (error) {
      console.error('Error refunding escrow gift:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create anlapidaire question
   */
  static async createLapidaireQuestion(userId, question, audience = 'public') {
    try {
      if (!userId || !question) {
        throw new Error('User ID and question are required');
      }

      // Validate question length
      if (question.length < 10 || question.length > 500) {
        throw new Error('Question must be between 10 and 500 characters');
      }

      // Createlapidaire question
      constlapidaire = await db.createLapidaireQuestion({
        userId,
        question,
        audience, // public, matches-only, friends-only
        status: 'active',
        createdAt: new Date()
      });

      // Award gamification points for creating a question
      await db.awardGamificationPoints(userId, 10, 'lapidaire_question_created');

      return {
        success: true,
       lapidaire
      };
    } catch (error) {
      console.error('Error creatinglapidaire question:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Answer anlapidaire question
   */
  static async answerLapidaireQuestion(questionId, userId, answer) {
    try {
      if (!questionId || !userId || !answer) {
        throw new Error('Question ID, user ID, and answer are required');
      }

      // Get the question
      const question = await db.getLapidaireQuestion(questionId);
      if (!question) {
        throw new Error('Lapidaire question not found');
      }

      // Check if user has already answered this question
      const hasAnswered = await db.hasUserAnsweredQuestion(userId, questionId);
      if (hasAnswered) {
        throw new Error('User has already answered this question');
      }

      // Validate answer length
      if (answer.length < 5 || answer.length > 1000) {
        throw new Error('Answer must be between 5 and 1000 characters');
      }

      // Check question audience restriction
      if (question.audience === 'matches-only') {
        const isMatched = await db.areUsersMatched(userId, question.userId);
        if (!isMatched) {
          throw new Error('Only matches can answer this question');
        }
      } else if (question.audience === 'friends-only') {
        const isConnected = await db.areUsersConnected(userId, question.userId);
        if (!isConnected) {
          throw new Error('Only connected users can answer this question');
        }
      }

      // Create answer record
      const answerRecord = await db.createLapidaireAnswer({
        questionId,
        userId,
        answer,
        createdAt: new Date()
      });

      // Award gamification points for answering
      await db.awardGamificationPoints(userId, 5, 'lapidaire_answered');

      // Notify question creator of answer
      await this.notifyQuestionCreatorOfAnswer(question.userId, userId, question.question, answer);

      return {
        success: true,
        answer: answerRecord
      };
    } catch (error) {
      console.error('Error answeringlapidaire question:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Getlapidaire questions for a user
   */
  static async getLapidaireQuestions(userId, audience = 'public', limit = 10) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get questions based on audience and user's connections
      const questions = await db.getLapidaireQuestions(userId, audience, limit);

      return {
        success: true,
        questions,
        count: questions.length
      };
    } catch (error) {
      console.error('Error gettinglapidaire questions:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get answers to a user'slapidaire questions
   */
  static async getAnswersToUserQuestions(userId, limit = 10) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get questions created by user
      const userQuestions = await db.getUserLapidaireQuestions(userId);

      // Get answers for each question
      const questionsWithAnswers = await Promise.all(
        userQuestions.map(async (question) => {
          const answers = await db.getAnswersToQuestion(question.id, limit);
          return {
            ...question,
            answers
          };
        })
      );

      return {
        success: true,
        questions: questionsWithAnswers
      };
    } catch (error) {
      console.error('Error getting answers to user questions:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a gift catalog item
   */
  static async createGiftCatalogItem(adminId, itemDetails) {
    try {
      if (!adminId || !itemDetails) {
        throw new Error('Admin ID and item details are required');
      }

      // Verify admin privileges
      const isAdmin = await db.isAdmin(adminId);
      if (!isAdmin) {
        throw new Error('Unauthorized to create gift catalog item');
      }

      // Validate item details
      if (!itemDetails.name || !itemDetails.description || !itemDetails.price) {
        throw new Error('Name, description, and price are required for gift item');
      }

      // Create gift catalog item
      const catalogItem = await db.createGiftCatalogItem({
        ...itemDetails,
        status: 'active',
        createdAt: new Date(),
        createdBy: adminId
      });

      return {
        success: true,
        item: catalogItem
      };
    } catch (error) {
      console.error('Error creating gift catalog item:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get gift catalog
   */
  static async getGiftCatalog() {
    try {
      const catalogItems = await db.getActiveGiftCatalogItems();

      return {
        success: true,
        catalog: catalogItems
      };
    } catch (error) {
      console.error('Error getting gift catalog:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Purchase a gift from catalog for escrow delivery
   */
  static async purchaseGiftForEscrowDelivery(userId, recipientId, catalogItemId, customMessage = '') {
    try {
      if (!userId || !recipientId || !catalogItemId) {
        throw new Error('User ID, recipient ID, and catalog item ID are required');
      }

      // Get catalog item
      const catalogItem = await db.getGiftCatalogItem(catalogItemId);
      if (!catalogItem || catalogItem.status !== 'active') {
        throw new Error('Catalog item not found or inactive');
      }

      // Validate user has sufficient funds
      const hasFunds = await db.hasSufficientFunds(userId, catalogItem.price);
      if (!hasFunds) {
        throw new Error('Insufficient funds for gift purchase');
      }

      // Create gift details object
      const giftDetails = {
        itemId: catalogItem.id,
        name: catalogItem.name,
        description: catalogItem.description,
        value: catalogItem.price,
        imageUrl: catalogItem.imageUrl,
        customMessage,
        type: 'catalog_purchase'
      };

      // Create escrow gift
      return await this.createEscrowGift(userId, recipientId, giftDetails);
    } catch (error) {
      console.error('Error purchasing gift for escrow delivery:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's pending escrow gifts
   */
  static async getUserPendingGifts(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const pendingGifts = await db.getUserPendingEscrowGifts(userId);

      return {
        success: true,
        pendingGifts
      };
    } catch (error) {
      console.error('Error getting user pending gifts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's sent escrow gifts
   */
  static async getUserSentGifts(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const sentGifts = await db.getUserSentEscrowGifts(userId);

      return {
        success: true,
        sentGifts
      };
    } catch (error) {
      console.error('Error getting user sent gifts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process expired escrow gifts
   */
  static async processExpiredEscrowGifts() {
    try {
      // Get all escrow gifts that have expired
      const expiredGifts = await db.getExpiredEscrowGifts();

      for (const gift of expiredGifts) {
        // Automatically refund expired gifts to sender
        await db.updateEscrowGiftStatus(gift.id, 'refunded_to_sender', 'expired_in_escrow');
        await db.returnFundsToSender(gift.senderId, gift.giftDetails.value);

        // Notify both parties of expiration
        await this.notifyPartiesOfExpiration(gift);
      }

      return {
        success: true,
        processed: expiredGifts.length
      };
    } catch (error) {
      console.error('Error processing expired escrow gifts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Notify recipient of pending gift
   */
  static async notifyRecipientOfPendingGift(recipientId, senderId, gift) {
    console.log(`Notifying recipient ${recipientId} of pending gift from ${senderId}`);
    // In a real implementation, this would send a push notification
  }

  /**
   * Notify parties of gift release
   */
  static async notifyPartiesOfGiftRelease(gift) {
    console.log(`Notifying ${gift.senderId} and ${gift.recipientId} of gift release`);
    // In a real implementation, this would send notifications to both parties
  }

  /**
   * Notify parties of refund
   */
  static async notifyPartiesOfRefund(gift, reason) {
    console.log(`Notifying ${gift.senderId} and ${gift.recipientId} of gift refund: ${reason}`);
    // In a real implementation, this would send notifications to both parties
  }

  /**
   * Notify question creator of answer
   */
  static async notifyQuestionCreatorOfAnswer(questionCreatorId, answererId, question, answer) {
    console.log(`Notifying ${questionCreatorId} of answer from ${answererId} to: ${question}`);
    // In a real implementation, this would send a notification to the question creator
  }

  /**
   * Notify parties of expiration
   */
  static async notifyPartiesOfExpiration(gift) {
    console.log(`Notifying ${gift.senderId} and ${gift.recipientId} of gift expiration`);
    // In a real implementation, this would send notifications to both parties
  }

  /**
   * Get escrow gifting statistics
   */
  static async getEscrowGiftingStats() {
    try {
      const stats = await db.getEscrowGiftingStats();

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error getting escrow gifting stats:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Getlapidaire question statistics
   */
  static async getLapidaireStats() {
    try {
      const stats = await db.getLapidaireStats();

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error gettinglapidaire stats:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = LushLapidaireGifting;