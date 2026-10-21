import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

interface LushChatContextType {
  // socket: Socket | null;
  activeConversationId: number | null;
  setActiveConversationId: (id: number | null) => void;
  messages: Record<number, Message[]>;
  sendMessage: (conversationId: number, content: string) => void;
  isConnected: boolean;
}

const LushChatContext = createContext<LushChatContextType | undefined>(undefined);

export const LushChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const [socket, setSocket] = useState<Socket | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In a real app, initialize Socket.IO here
    // const newSocket = io('http://localhost:3000', {
    //   auth: { token: localStorage.getItem('token') }
    // });

    // newSocket.on('connect', () => setIsConnected(true));
    // newSocket.on('disconnect', () => setIsConnected(false));

    // newSocket.on('lush:message', (msg: Message & { conversation_id: number }) => {
    //   setMessages(prev => ({
    //     ...prev,
    //     [msg.conversation_id]: [...(prev[msg.conversation_id] || []), msg]
    //   }));
    // });

    // setSocket(newSocket);
    // return () => { newSocket.close(); };
    setIsConnected(true);
  }, []);

  const sendMessage = (conversationId: number, content: string) => {
    // if (socket) {
    //   socket.emit('lush:send_message', { conversationId, content });
    // }

    // Mock local update for UI testing
    const newMsg: Message = {
      id: Date.now(),
      sender_id: 1, // Mock current user
      content,
      created_at: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg]
    }));
  };

  return (
    <LushChatContext.Provider value={{
      // socket,
      activeConversationId,
      setActiveConversationId,
      messages,
      sendMessage,
      isConnected
    }}>
      {children}
    </LushChatContext.Provider>
  );
};

export const useLushChatContext = () => {
  const context = useContext(LushChatContext);
  if (context === undefined) {
    throw new Error('useLushChatContext must be used within a LushChatProvider');
  }
  return context;
};
