import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface Contact {id: string; name: string; avatar: string; lastSeen: string; isOnline: boolean; hasUnread: boolean;
  unreadCount?: number;
  status?: string;
}

interface Message {id: string; senderId: string; content: string; timestamp: string; type: 'text' | 'image' | 'video' | 'voice' | 'gif' | 'file';
  isOwn: boolean; status: 'sent' | 'delivered' | 'read';
}

interface Conversation {id: string; contactId: string; messages: Message[]; lastMessage: string; lastMessageTime: string; unreadCount: number;
}

interface UseMiDataResult {contacts: Contact[]; conversations: Conversation[]; loading: boolean; error: string | null; refreshData: () => void;
}

export const useMiData = (): UseMiDataResult => {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const contactsResponse = await ApiService.request<Contact[]>(
        '/mi/contacts',
        {method: 'GET' },
      );
      if (contactsResponse) {
        setContacts(contactsResponse);
      } else {
        setError('Failed to fetch contacts.');
      }

      const conversationsResponse = await ApiService.request<Conversation[]>(
        '/mi/conversations',
        {method: 'GET' },
      );
      if (conversationsResponse) {
        setConversations(conversationsResponse);
      } else {
        setError(
          'Failed to fetch conversations.',
        );
      }
    } catch (err) {
      setError('Failed to fetch Mi data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = React.useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { contacts, conversations, loading, error, refreshData };
};
