/**
 * useLushChat
 * Manages conversations list + real-time messaging for Lush Pressies.
 * Listens for WebSocket events: lush:message, lush:read_receipt, lush:typing
 */
import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

export interface LushConversation {
  id: string;
  partner_id: number;
  partner_username: string;
  partner_first_name?: string;
  partner_avatar?: string;
  status: 'locked' | 'unlocked' | 'archived';
  last_message_body?: string;
  last_message_type?: string;
  last_message_at?: string;
  unread_count: number;
}

export interface LushMessage {
  id: string;
  conversation_id: string;
  sender_id: number;
  body?: string;
  media_urls: string[];
  message_type: string;
  is_read: boolean;
  created_at: string;
  sender_username?: string;
  sender_first_name?: string;
  sender_avatar?: string;
  reply_to_message_id?: string;
}

function getToken() {
  return (
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('authToken') ||
    ''
  );
}

// ─── Conversations List Hook ───────────────────────────────────────────────
export function useLushConversations() {
  const [conversations, setConversations] = useState<LushConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/lushpressies/conversations`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!resp.ok) throw new Error('Failed to load conversations');
      const data = await resp.json();
      setConversations(data.conversations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { conversations, loading, error, refresh: fetch_, setConversations };
}

// ─── Single Conversation (Messages) Hook ───────────────────────────────────
export function useLushMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<LushMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [locked, setLocked] = useState(false);
  const [typingPartner, setTypingPartner] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Load messages
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const resp = await fetch(
        `${API_BASE}/lushpressies/conversations/${conversationId}/messages`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (resp.status === 403) {
        const data = await resp.json();
        if (data.locked) { setLocked(true); return; }
      }
      if (!resp.ok) throw new Error('Failed to load messages');
      const data = await resp.json();
      setMessages(data.messages);
      setLocked(false);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  // WebSocket: listen for real-time events
  useEffect(() => {
    const wsUrl = (process.env.REACT_APP_WS_URL || 'ws://localhost:5000') + '/ws';
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.event === 'lush:message' && msg.conversationId === conversationId) {
            setMessages((prev) => [...prev, msg.message]);
          }
          if (msg.event === 'lush:typing' && msg.conversationId === conversationId) {
            setTypingPartner(true);
            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => setTypingPartner(false), 3000);
          }
          if (msg.event === 'lush:read_receipt' && msg.conversationId === conversationId) {
            setMessages((prev) =>
              prev.map((m) => ({ ...m, is_read: true }))
            );
          }
        } catch { /* ignore parse errors */ }
      };

      ws.onerror = () => {}; // silent; REST still works
      return () => ws.close();
    } catch { /* WebSocket not available */ }
  }, [conversationId]);

  // Send message
  const sendMessage = useCallback(async (
    body: string,
    options?: {
      mediaUrls?: string[];
      messageType?: string;
      replyToMessageId?: string;
    }
  ) => {
    if (!conversationId || (!body.trim() && !options?.mediaUrls?.length)) return;
    setSending(true);
    try {
      const resp = await fetch(
        `${API_BASE}/lushpressies/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            body: body.trim(),
            mediaUrls: options?.mediaUrls,
            messageType: options?.messageType || 'text',
            replyToMessageId: options?.replyToMessageId,
          }),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        return { error: data.error, rateLimit: data.rateLimit, locked: data.locked };
      }

      // Optimistic append
      setMessages((prev) => [...prev, data.message]);
      return { success: true, message: data.message };
    } catch {
      return { error: 'Network error' };
    } finally {
      setSending(false);
    }
  }, [conversationId]);

  // Delete message
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!conversationId) return;
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    await fetch(
      `${API_BASE}/lushpressies/conversations/${conversationId}/messages/${messageId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    ).catch(() => {});
  }, [conversationId]);

  return {
    messages, loading, sending, locked, typingPartner,
    sendMessage, deleteMessage, refresh: loadMessages,
  };
}

// ─── Unified Chat System Hook ──────────────────────────────────────────────
export function useLushChat(initialConversationId?: string) {
  const { conversations, loading: loadingConversations, refresh: refreshConversations } = useLushConversations();
  const [activeId, setActiveId] = useState<string | null>(initialConversationId || null);

  const activeConversation = conversations.find(c => c.id === activeId) || null;
  const { messages, loading: loadingMessages, sending, locked, typingPartner, sendMessage } = useLushMessages(activeId);

  const selectConversation = (id: string) => {
    setActiveId(id || null);
  };

  const sendTyping = (_isTyping: boolean) => {
    // Typing indicator trigger
  };

  const handleSendMessage = async (body: string, mediaUrls?: string[]) => {
    return sendMessage(body, { mediaUrls });
  };

  return {
    conversations: conversations.map(c => ({
      ...c,
      partner_name: c.partner_first_name || c.partner_username || 'Lush Member',
      last_message: c.last_message_body || '',
      my_user_id: 'me'
    })),
    activeConversation: activeConversation ? {
      ...activeConversation,
      partner_name: activeConversation.partner_first_name || activeConversation.partner_username || 'Lush Member',
      my_user_id: 'me'
    } : null,
    messages: messages.map(m => ({
      ...m,
      sender_id: m.sender_username || 'sender'
    })),
    loadingConversations,
    loadingMessages,
    sending,
    locked,
    typingUsers: activeId && typingPartner ? { [activeId]: true } : {},
    selectConversation,
    sendMessage: handleSendMessage,
    sendTyping,
    refreshConversations
  };
}
