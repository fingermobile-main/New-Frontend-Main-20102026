import React, { useState } from 'react';
import styled from 'styled-components';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--surface-1);
  border-top: 1px solid var(--border-color);
`;

const StyledInput = styled.input`
  flex: 1;
  background: var(--surface-2);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 24px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: var(--primary-color);
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

const SendButton = styled.button<{ $hasText: boolean }>`
  background: ${props => props.$hasText ? 'linear-gradient(135deg, #7c4dff 0%, #ff4081 100%)' : 'var(--surface-3)'};
  color: ${props => props.$hasText ? 'white' : 'var(--text-secondary)'};
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$hasText ? 'pointer' : 'not-allowed'};
  transition: transform 0.2s;

  &:hover {
    transform: ${props => props.$hasText ? 'scale(1.05)' : 'none'};
  }
  
  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
    margin-left: 2px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    color: var(--primary-color);
    background: var(--surface-2);
  }
  
  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`;

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <InputContainer>
      <ActionButton title="Attach media">
        <svg viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      </ActionButton>

      <StyledInput
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />

      <SendButton $hasText={text.trim().length > 0} onClick={handleSend} disabled={!text.trim() || disabled}>
        <svg viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </SendButton>
    </InputContainer>
  );
};
