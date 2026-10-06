import React from 'react';
import styled from 'styled-components';

interface VerificationBadgeProps {
  level: number; // 0 to 5
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const BadgeContainer = styled.div<{ $size: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-2);
  border-radius: 20px;
  padding: ${props => props.$size === 'small' ? '2px 6px' : props.$size === 'large' ? '6px 12px' : '4px 8px'};
  gap: 4px;
  border: 1px solid var(--border-color);
`;

const StarIcon = styled.svg<{ $active: boolean; $size: string }>`
  width: ${props => props.$size === 'small' ? '12px' : props.$size === 'large' ? '20px' : '16px'};
  height: ${props => props.$size === 'small' ? '12px' : props.$size === 'large' ? '20px' : '16px'};
  fill: ${props => props.$active ? 'var(--gold, #FFD700)' : 'var(--surface-3, #555)'};
`;

const LevelText = styled.span<{ $size: string }>`
  font-size: ${props => props.$size === 'small' ? '0.7rem' : props.$size === 'large' ? '1rem' : '0.85rem'};
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: 4px;
`;

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ level, size = 'medium', showText = false }) => {
  // Level is out of 5 stars
  const safeLevel = Math.max(0, Math.min(5, level));

  return (
    <BadgeContainer $size={size} title={`Verification Level ${safeLevel}/5`}>
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} $active={i < safeLevel} $size={size} viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </StarIcon>
      ))}
      {showText && <LevelText $size={size}>Lv {safeLevel}</LevelText>}
    </BadgeContainer>
  );
};
