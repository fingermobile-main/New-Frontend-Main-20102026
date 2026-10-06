import React from 'react';
import styled from 'styled-components';
import { useLushChatContext } from '../contexts/LushChatContext';

interface Conversation {
  id: number;
  userId: number;
  username: string;
  avatarUrl?: string;
  lastMessage?: string;
  unreadCount: number;
  isOnline: boolean;
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--surface-1);
  border-right: 1px solid var(--border-color);
  height: 100%;
  overflow-y: auto;
`;

const ConversationItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  background: ${props => props.$isActive ? 'var(--surface-2)' : 'transparent'};
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s;

  &:hover {
    background: var(--surface-2);
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-right: 16px;
`;

const Avatar = styled.div<{ $url?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: var(--surface-3);
  background-image: ${props => props.$url ? `url(${props.$url})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const OnlineIndicator = styled.div<{ $isOnline: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background: ${props => props.$isOnline ? 'var(--success-color, #28a745)' : 'var(--text-secondary)'};
  border: 2px solid var(--surface-1);
`;

const InfoContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
`;

const Username = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadBadge = styled.div`
  background: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
`;

const LastMessage = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ConversationList: React.FC<{ conversations: Conversation[] }> = ({ conversations }) => {
  const { activeConversationId, dispatch } = useLushChatContext();

  return (
    <ListContainer>
      {conversations.map(conv => (
        <ConversationItem
          key={conv.id}
          $isActive={activeConversationId === String(conv.id)}
          onClick={() => dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: String(conv.id) })}
        >
          <AvatarContainer>
            <Avatar $url={conv.avatarUrl} />
            <OnlineIndicator $isOnline={conv.isOnline} />
          </AvatarContainer>
          <InfoContainer>
            <HeaderRow>
              <Username>{conv.username}</Username>
              {conv.unreadCount > 0 && <UnreadBadge>{conv.unreadCount}</UnreadBadge>}
            </HeaderRow>
            <LastMessage>{conv.lastMessage || 'No messages yet.'}</LastMessage>
          </InfoContainer>
        </ConversationItem>
      ))}
      {conversations.length === 0 && (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)' }}>
          No conversations yet
        </div>
      )}
    </ListContainer>
  );
};
