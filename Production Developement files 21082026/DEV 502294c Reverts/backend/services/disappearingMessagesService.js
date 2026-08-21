const communicationDb = require("../db");
const cron = require("node-cron");

// Schedule daily cleanup of expired messages
cron.schedule("0 0 * * *", async () => {
  logger.info("Running disappearing messages cleanup task...");
  await cleanupExpiredMessages();
});

/**
 * Schedule a message for deletion after a specified time
 * @param {string} messageId - ID of the message to schedule for deletion
 * @param {number} lifetimeMs - Lifetime in milliseconds
 * @returns {Promise<void>}
 */
async function scheduleMessageDeletion(
  messageId,
  lifetimeMs = 24 * 60 * 60 * 1000,
) {
  // Default 24 hours
  const deleteAt = new Date(Date.now() + lifetimeMs);

  await communicationDb.query(
    `UPDATE messages 
     SET expires_at = $1 
     WHERE id = $2`,
    [deleteAt, messageId],
  );
}

/**
 * Get messages that have expired and should be deleted
 * @returns {Promise<Array>} List of expired message IDs
 */
async function getExpiredMessages() {
  const result = await communicationDb.query(
    `SELECT id FROM messages 
     WHERE expires_at IS NOT NULL AND expires_at < NOW()`,
  );

  return result.rows;
}

/**
 * Delete expired messages from the database
 * @returns {Promise<void>}
 */
async function cleanupExpiredMessages() {
  try {
    const expiredMessages = await getExpiredMessages();

    if (expiredMessages.length > 0) {
      const messageIds = expiredMessages.map((msg) => msg.id);
      const idsList = messageIds.map((_, index) => `$${index + 1}`).join(",");

      await communicationDb.query(
        `DELETE FROM messages WHERE id IN (${idsList})`,
        messageIds,
      );

      logger.info(`Deleted ${expiredMessages.length} expired messages`);
    }
  } catch (error) {
    logger.error("Error cleaning up expired messages:", error);
  }
}

/**
 * Create a message with automatic deletion
 * @param {Object} messageData - Message data
 * @param {number} lifetimeMs - Lifetime in milliseconds
 * @returns {Promise<Object>} Created message
 */
async function createDisappearingMessage(messageData, lifetimeMs) {
  // Set default lifetime if not provided
  if (!lifetimeMs) {
    const { disappearingMessages } = require("../config/security");
    lifetimeMs = disappearingMessages.defaultLifetime;
  }

  // Insert the message
  const result = await communicationDb.query(
    `INSERT INTO messages (member_id, recipient_id, content, message_type, created_at, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      messageData.senderId,
      messageData.recipientId,
      messageData.content,
      messageData.type || "text",
      new Date(),
      new Date(Date.now() + lifetimeMs)
    ],
  );

  return result.rows[0];
}

/**
 * Get message with expiration info
 * @param {string} messageId - ID of the message
 * @returns {Promise<Object|null>} Message data or null if not found
 */
async function getMessage(messageId) {
  const result = await communicationDb.query(
    `SELECT * FROM messages WHERE id = $1`,
    [messageId],
  );

  return result.rows[0] || null;
}

module.exports = {
  scheduleMessageDeletion,
  getExpiredMessages,
  cleanupExpiredMessages,
  createDisappearingMessage,
  getMessage
};
