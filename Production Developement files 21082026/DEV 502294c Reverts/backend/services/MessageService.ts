import { Pool } from 'pg';

/**
 * MessageService
 * Business logic for messaging and conversations
 */

class MessageService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Get user conversations with last message preview
   */
  async getConversations(userId: number): Promise<any[]> {
    const query = `
      SELECT 
        c.*,
        m.content as last_message,
        m.created_at as last_message_at,
        m.sender_id as last_sender_id,
        u.name as other_participant_name,
        u.avatar_url as other_participant_avatar,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND is_read = false AND sender_id != $1) as unread_count
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      LEFT JOIN messages m ON c.last_message_id = m.id
      LEFT JOIN users u ON u.id = (
        SELECT participant_id FROM conversation_participants 
        WHERE conversation_id = c.id AND participant_id != $1 
        LIMIT 1
      )
      WHERE cp.participant_id = $1
      ORDER BY c.updated_at DESC
    `;
    
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get messages in a conversation with pagination
   */
  async getConversationMessages(conversationId: number, userId: number, limit: number = 50, before?: string): Promise<any[]> {
    let query = `
      SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
    `;
    
    const values: any[] = [conversationId];
    let paramCount = 1;

    if (before) {
      paramCount++;
      query += ` AND m.created_at < $${paramCount}`;
      values.push(before);
    }

    query += ` ORDER BY m.created_at DESC LIMIT $${paramCount + 1}`;
    values.push(limit);

    const result = await this.pool.query(query, values);
    return result.rows.reverse(); // Return in chronological order
  }

  /**
   * Create new conversation
   */
  async createConversation(initiatorId: number, participantIds: number[], type: string = 'direct', name?: string): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create conversation
      const convQuery = 'INSERT INTO conversations (type, name, created_by) VALUES ($1, $2, $3) RETURNING *';
      const convResult = await client.query(convQuery, [type, name || null, initiatorId]);
      const conversation = convResult.rows[0];

      // Add participants
      const allParticipants = [initiatorId, ...participantIds];
      for (const participantId of allParticipants) {
        await client.query(
          'INSERT INTO conversation_participants (conversation_id, participant_id) VALUES ($1, $2)',
          [conversation.id, participantId]
        );
      }

      await client.query('COMMIT');
      return conversation;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Send message
   */
  async sendMessage(senderId: number, conversationId: number, content: string, type: string = 'text', attachments?: any[]): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Verify sender is participant
      const verifyQuery = 'SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND participant_id = $2';
      const verifyResult = await client.query(verifyQuery, [conversationId, senderId]);
      
      if (verifyResult.rowCount === 0) {
        throw new Error('User is not a participant in this conversation');
      }

      // Insert message
      const msgQuery = `
        INSERT INTO messages (conversation_id, sender_id, content, type, attachments)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const msgResult = await client.query(msgQuery, [
        conversationId,
        senderId,
        content,
        type,
        attachments ? JSON.stringify(attachments) : null
      ]);

      const message = msgResult.rows[0];

      // Update conversation's last message
      await client.query(
        'UPDATE conversations SET last_message_id = $1, updated_at = NOW() WHERE id = $2',
        [message.id, conversationId]
      );

      await client.query('COMMIT');
      return message;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: number, userId: number): Promise<void> {
    const query = 'UPDATE messages SET is_read = true, read_at = NOW() WHERE id = $1 AND sender_id != $2';
    await this.pool.query(query, [messageId, userId]);
  }

  /**
   * Mark all messages in conversation as read
   */
  async markConversationAsRead(conversationId: number, userId: number): Promise<void> {
    const query = 'UPDATE messages SET is_read = true, read_at = NOW() WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false';
    await this.pool.query(query, [conversationId, userId]);
  }

  /**
   * Delete message
   */
  async deleteMessage(messageId: number, userId: number): Promise<boolean> {
    const query = 'DELETE FROM messages WHERE id = $1 AND sender_id = $2';
    const result = await this.pool.query(query, [messageId, userId]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Search messages
   */
  async searchMessages(userId: number, searchTerm: string, limit: number = 20): Promise<any[]> {
    const query = `
      SELECT DISTINCT ON (m.conversation_id) m.*, c.type as conversation_type,
        u.name as sender_name, u.avatar_url as sender_avatar
      FROM messages m
      JOIN conversations c ON m.conversation_id = c.id
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      JOIN users u ON m.sender_id = u.id
      WHERE cp.participant_id = $1
      AND m.content ILIKE $2
      ORDER BY m.conversation_id, m.created_at DESC
      LIMIT $3
    `;
    
    const result = await this.pool.query(query, [userId, `%${searchTerm}%`, limit]);
    return result.rows;
  }
}

export default new MessageService(require('../db').default || require('../db'));
