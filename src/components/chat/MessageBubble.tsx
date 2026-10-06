import React from 'react';
import styled from 'styled-components';

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

const BubbleWrapper = styled.div<{ $isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
  margin-bottom: 12px;
`;

const BubbleContainer = styled.div<{ $isOwn: boolean }>`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 20px;
  background: ${props => props.$isOwn ? 'linear-gradient(135deg, #7c4dff 0%, #ff4081 100%)' : 'var(--surface-2)'};
  color: ${props => props.$isOwn ? 'white' : 'var(--text-primary)'};
  border-bottom-right-radius: ${props => props.$isOwn ? '4px' : '20px'};
  border-bottom-left-radius: ${props => props.$isOwn ? '20px' : '4px'};
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  word-wrap: break-word;
`;

const MetaData = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 0.7rem;
  color: var(--text-secondary);
`;

const StatusIcon = styled.span<{ $status?: string }>`
  font-size: 0.8rem;
  color: ${props => props.$status === 'read' ? '#4dabf7' : 'inherit'};
`;

export const MessageBubble: React.FC<MessageBubbleProps> = ({ content, isOwn, timestamp, status }) => {
  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <BubbleWrapper $isOwn={isOwn}>
      <BubbleContainer $isOwn={isOwn}>
        {content}
      </BubbleContainer>
      <MetaData>
        {formatTime(timestamp)}
        {isOwn && (
          <StatusIcon $status={status}>
            {status === 'sent' && '✓'}
            {status === 'delivered' && '✓✓'}
            {status === 'read' && '✓✓'}
          </StatusIcon>
        )}
      </MetaData>
    </BubbleWrapper>
  );
};
