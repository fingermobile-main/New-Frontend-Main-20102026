import React from 'react';
import { useLushChatContext } from '../../contexts/LushChatContext';

interface Conversation {
  id: string;
  userId: number;
  username: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
}

export const ConversationList: React.FC<ConversationListProps> = ({ conversations }) => {
  const { state, dispatch } = useLushChatContext();

  const handleSelectConversation = (conversationId: string) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversationId });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleSelectConversation(conversation.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              state.activeConversationId === conversation.id
                ? 'bg-indigo-100 border border-indigo-300'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {conversation.username.charAt(0).toUpperCase()}
                </div>
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conversation.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {conversation.lastMessageTime}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-500 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
