import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface LushMessage {
  id: string;
  conversationId: string;
  senderId: number;
  body: string;
  timestamp: string;
  isRead: boolean;
}

interface LushConversation {
  id: string;
  userId: number;
  username: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
}

interface LushChatState {
  conversations: LushConversation[];
  activeConversationId: string | null;
  messages: Record<string, LushMessage[]>; // conversationId -> messages
  isConnected: boolean;
  isTyping: Record<string, boolean>; // conversationId -> isTyping
}

type LushChatAction =
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_CONVERSATIONS'; payload: LushConversation[] }
  | { type: 'ADD_CONVERSATION'; payload: LushConversation }
  | { type: 'REMOVE_CONVERSATION'; payload: string }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string | null }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: LushMessage } }
  | { type: 'SET_TYPING'; payload: { conversationId: string; isTyping: boolean } }
  | { type: 'MARK_AS_READ'; payload: { conversationId: string; messageId: string } };

const initialState: LushChatState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  isConnected: false,
  isTyping: {},
};

interface LushChatContextType extends LushChatState {
  state: LushChatState;
  dispatch: React.Dispatch<LushChatAction>;
}

const LushChatContext = createContext<LushChatContextType | undefined>(undefined);

const chatReducer = (state: LushChatState, action: LushChatAction): LushChatState => {
  switch (action.type) {
  case 'SET_CONNECTED':
    return { ...state, isConnected: action.payload };
  case 'SET_CONVERSATIONS':
    return { ...state, conversations: action.payload };
  case 'ADD_CONVERSATION':
    return { ...state, conversations: [...state.conversations, action.payload] };
  case 'REMOVE_CONVERSATION':
    return {
      ...state,
      conversations: state.conversations.filter(c => c.id !== action.payload),
      messages: Object.fromEntries(
        Object.entries(state.messages).filter(([key]) => key !== action.payload)
      )
    };
  case 'SET_ACTIVE_CONVERSATION':
    return { ...state, activeConversationId: action.payload };
  case 'ADD_MESSAGE':
    return {
      ...state,
      messages: {
        ...state.messages,
        [action.payload.conversationId]: [
          ...(state.messages[action.payload.conversationId] || []),
          action.payload.message
        ]
      }
    };
  case 'SET_TYPING':
    return {
      ...state,
      isTyping: {
        ...state.isTyping,
        [action.payload.conversationId]: action.payload.isTyping
      }
    };
  case 'MARK_AS_READ':
    return {
      ...state,
      messages: {
        ...state.messages,
        [action.payload.conversationId]: (state.messages[action.payload.conversationId] || []).map(msg =>
          msg.id === action.payload.messageId ? { ...msg, isRead: true } : msg
        )
      }
    };
  default:
    return state;
  }
};

export const LushChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const value = {
    state,
    dispatch,
    ...state
  };

  return (
    <LushChatContext.Provider value={value}>
      {children}
    </LushChatContext.Provider>
  );
};

export const useLushChatContext = () => {
  const context = useContext(LushChatContext);
  if (!context) {
    throw new Error('useLushChatContext must be used within a LushChatProvider');
  }
  return context;
};
