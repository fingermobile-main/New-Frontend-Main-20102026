import axios from 'axios';

export interface Message {
  id: string;
  conversation_id?: string;
  sender_id: string;
  receiver_id: string;
  subject?: string;
  content: string;
  message_type: string;
  is_read: boolean;
  is_deleted_by_sender: boolean;
  is_deleted_by_receiver: boolean;
  sent_at: string;
  read_at?: string;
}

export interface Conversation {
  id: string;
  name?: string;
  avatarUrl?: string;
  participants: Array<{
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  }>;
  lastMessage?: string;
  updatedAt: string;
  unreadCount: number;
}

export interface SendMessageRequest {
  recipient_id: string;
  content: string;
  subject?: string;
  message_type?: string;
}

export interface GetConversationsResponse {
  success: boolean;
  data: Conversation[];
}

export type MessageThread = Conversation;

export interface GetMessagesResponse {
  success: boolean;
  data: Message[];
}

export interface SendMessageResponse {
  success: boolean;
  data: Message | null;
}

export interface UnreadCountResponse {
  success: boolean;
  unread_count: number;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class MessageService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    this.api.interceptors.request.use((config: any) => {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('fingermobile_token') ||
        localStorage.getItem('token');
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getConversations(): Promise<GetConversationsResponse> {
    try {
      const response = await this.api.get('/messages/conversations');
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  async getMessages(conversationPartnerId: string): Promise<GetMessagesResponse> {
    try {
      const response = await this.api.get(`/messages/conversations/${conversationPartnerId}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await this.api.post('/messages', request);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        data: null
      };
    }
  }

  async getUnreadCount(): Promise<UnreadCountResponse> {
    try {
      const response = await this.api.get('/messages/unread-count');
      
      if (response.data.success) {
        return {
          success: true,
          unread_count: response.data.unread_count
        };
      } else {
        throw new Error(response.data.error || 'Failed to get unread count');
      }
    } catch (error) {
      console.error('Error getting unread count:', error);
      return {
        success: false,
        unread_count: 0
      };
    }
  }

  async markAsRead(conversationPartnerId: string): Promise<{ success: boolean }> {
    try {
      const response = await this.api.post('/messages/mark-as-read', {
        conversation_partner_id: conversationPartnerId
      });
      
      if (response.data.success) {
        return {
          success: true
        };
      } else {
        throw new Error(response.data.error || 'Failed to mark messages as read');
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return {
        success: false
      };
    }
  }

  async updateMessage(messageId: string, content: string, subject?: string): Promise<{ success: boolean; data?: Message }> {
    try {
      const response = await this.api.put(`/messages/${messageId}`, { content, subject });
      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error updating message:', error);
      return { success: false };
    }
  }

  async deleteMessage(messageId: string): Promise<{ success: boolean }> {
    try {
      const response = await this.api.delete(`/messages/${messageId}`);
      return { success: response.data.success };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { success: false };
    }
  }
}

export const messageService = new MessageService();
export default messageService;