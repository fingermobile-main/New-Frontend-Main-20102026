import React, { useState } from 'react';
import styled from 'styled-components';

interface ReverseRollButtonProps {
  onReverse: () => void;
  cooldownSeconds?: number;
}

const RollButton = styled.button<{ $isOnCooldown: boolean }>`
  background: var(--surface-1);
  color: ${props => props.$isOnCooldown ? 'var(--text-secondary)' : 'var(--gold, #FFD700)'};
  border: 2px solid ${props => props.$isOnCooldown ? 'var(--border-color)' : 'var(--gold, #FFD700)'};
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: ${props => props.$isOnCooldown ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.$isOnCooldown ? 'none' : '0 4px 12px rgba(255, 215, 0, 0.2)'};

  &:hover {
    transform: ${props => props.$isOnCooldown ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.$isOnCooldown ? 'none' : '0 6px 16px rgba(255, 215, 0, 0.4)'};
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
    transition: transform 0.5s ease;
  }

  &:hover svg {
    transform: ${props => props.$isOnCooldown ? 'none' : 'rotate(-180deg)'};
  }
`;

export const ReverseRollButton: React.FC<ReverseRollButtonProps> = ({ onReverse, cooldownSeconds = 0 }) => {
  const [cooldown, setCooldown] = useState(0);

  const handleClick = () => {
    if (cooldown > 0) return;

    onReverse();

    if (cooldownSeconds > 0) {
      setCooldown(cooldownSeconds);
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <RollButton $isOnCooldown={cooldown > 0} onClick={handleClick} disabled={cooldown > 0}>
      <svg viewBox="0 0 24 24">
        <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
      </svg>
      {cooldown > 0 ? `Wait ${cooldown}s` : 'Reverse Roll'}
    </RollButton>
  );
};
