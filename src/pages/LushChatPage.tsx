import React, { useState } from 'react';
import styled from 'styled-components';
import { ConversationList } from '../components/ConversationList';
import { LushChatPanel } from '../components/LushChatPanel';
import { LushCallModal } from '../components/LushCallModal';
import { useLushChatContext } from '../contexts/LushChatContext';
import { useLushCall } from '../hooks/useLushCall';

const PageContainer = styled.div`
  display: flex;
  height: calc(100vh - 64px); // Assuming a header
  background: var(--surface-background);
  color: var(--text-primary);
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: 1px solid var(--border-color);
`;

const Sidebar = styled.div`
  width: 320px;
  min-width: 320px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface-1);
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--surface-2);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`;

export const LushChatPage: React.FC = () => {
  const { activeConversationId, isConnected } = useLushChatContext();
  const { activeCall, answerCall, endCall } = useLushCall();

  // Mock conversations for UI demo
  const [conversations] = useState([
    { id: 1, userId: 101, username: 'Alice', unreadCount: 2, isOnline: true, lastMessage: 'Hey! Want to meet up?' },
    { id: 2, userId: 102, username: 'Bob', unreadCount: 0, isOnline: false, lastMessage: 'Sounds good to me.' }
  ]);

  return (
    <PageContainer>
      <Sidebar>
        <Header>
          <Title>Messages {isConnected ? '🟢' : '🔴'}</Title>
        </Header>
        <ConversationList conversations={conversations} />
      </Sidebar>

      <MainContent>
        {activeConversationId ? (
          <LushChatPanel
            initialConversationId={activeConversationId.toString()}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Select a conversation to start chatting
          </div>
        )}
      </MainContent>

      {activeCall && (
        <LushCallModal
          activeCall={activeCall}
          onAnswer={answerCall}
          onEnd={endCall}
          currentUserId={1} // mock current user ID
        />
      )}
    </PageContainer>
  );
};

export default LushChatPage;
