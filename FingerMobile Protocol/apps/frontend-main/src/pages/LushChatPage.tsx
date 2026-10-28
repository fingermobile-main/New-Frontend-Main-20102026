import React, { useState } from 'react';
import styled from 'styled-components';
import { ConversationList } from '../components/ConversationList';
import { LushChatPanel } from '../components/LushChatPanel';
import { LushCallModal } from '../components/LushCallModal';
import { useLushChatContext } from '../contexts/LushChatContext';
import { useLushCall } from '../hooks/useLushCall';
import { MessageSquare, Phone, Users, Shield } from 'lucide-react';

const PageWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  padding-bottom: 7rem;
  @media (min-width: 768px) {
    padding-bottom: 3rem;
  }
`;

const PageContainer = styled.div`
  display: flex;
  height: calc(100vh - 64px);
  background: var(--surface-background);
  color: var(--text-primary);
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: 1px solid var(--border-color);
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 120px);
  }
`;

const Sidebar = styled.div<{ $isMobileHidden?: boolean }>`
  width: 320px;
  min-width: 320px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    display: ${({ $isMobileHidden }) => ($isMobileHidden ? 'none' : 'flex')};
  }
`;

const MainContent = styled.div<{ $isMobileHidden?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface-1);
  @media (max-width: 768px) {
    display: ${({ $isMobileHidden }) => ($isMobileHidden ? 'none' : 'flex')};
    min-height: 450px;
  }
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
  const [mobileTab, setMobileTab] = useState<'conversations' | 'chat'>('conversations');

  // Mock conversations for UI demo
  const [conversations] = useState([
    { id: 1, userId: 101, username: 'Alice', unreadCount: 2, isOnline: true, lastMessage: 'Hey! Want to meet up?' },
    { id: 2, userId: 102, username: 'Bob', unreadCount: 0, isOnline: false, lastMessage: 'Sounds good to me.' }
  ]);

  return (
    <PageWrapper>
      <PageContainer>
        <Sidebar $isMobileHidden={mobileTab === 'chat'}>
          <Header>
            <Title>Messages {isConnected ? '🟢' : '🔴'}</Title>
          </Header>
          <ConversationList conversations={conversations} />
        </Sidebar>

        <MainContent $isMobileHidden={mobileTab === 'conversations'}>
          {activeConversationId ? (
            <LushChatPanel
              initialConversationId={activeConversationId.toString()}
            />
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', padding: '24px' }}>
              Select a conversation to start chatting
            </div>
          )}
        </MainContent>

        {activeCall && (
          <LushCallModal
            activeCall={activeCall}
            onAnswer={answerCall}
            onEnd={endCall}
            currentUserId={1}
          />
        )}
      </PageContainer>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Lush Chat Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 flex items-center justify-around gap-1 shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            setMobileTab('conversations');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            mobileTab === 'conversations' ? 'text-pink-600' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Chats</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMobileTab('chat');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            mobileTab === 'chat' ? 'text-pink-600' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Active Chat</span>
        </button>
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <Phone className="w-5 h-5 mb-0.5" />
          <span>Voice</span>
        </button>
      </nav>
    </PageWrapper>
  );
};

export default LushChatPage;
