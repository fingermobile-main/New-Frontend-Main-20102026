import React from 'react';
import styled from 'styled-components';
import { LushMatch } from '../hooks/useLushMatching';

interface CommitProgressTrackerProps {
  match: LushMatch;
  onRequestCommit: (_matchId: string | number) => void;
  onBreakCommit: (_commitId: string | number) => void;
}

const TrackerContainer = styled.div`
  background: var(--surface-1);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  margin: 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  background: ${props =>
    props.$status === 'active' ? 'var(--gold, #FFD700)' :
      props.$status === 'pending' ? 'var(--surface-3)' : 'transparent'};
  color: ${props => props.$status === 'active' ? '#000' : 'var(--text-secondary)'};
  border: ${props => props.$status === 'none' ? '1px solid var(--border-color)' : 'none'};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: var(--surface-3);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => Math.min(100, Math.max(0, props.$progress))}%;
  background: linear-gradient(90deg, #ff4081, #7c4dff);
  border-radius: 6px;
  transition: width 0.5s ease-out;
`;

const ProgressText = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-align: right;
  margin-bottom: 20px;
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'danger' | 'secondary' }>`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: ${props =>
    props.$variant === 'primary' ? 'linear-gradient(135deg, #7c4dff 0%, #ff4081 100%)' :
      props.$variant === 'danger' ? '#dc3545' : 'var(--surface-3)'};
  color: ${props => props.$variant === 'secondary' ? 'var(--text-primary)' : 'white'};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CommitProgressTracker: React.FC<CommitProgressTrackerProps> = ({
  match,
  onRequestCommit,
  onBreakCommit
}) => {
  const commitProgressDays = match.commit_progress_days ?? 0;
  const commitStatus = match.commit_status ?? 'none';
  const isEligible = !!match.pin_exchanged && (
    (match.pin_exchange_date && (Date.now() - new Date(match.pin_exchange_date).getTime() > 14 * 24 * 60 * 60 * 1000)) ||
    commitProgressDays >= 14
  );

  const renderAction = () => {
    if (commitStatus === 'active') {
      return (
        <ActionButton $variant="danger" onClick={() => onBreakCommit(match.id)}>
          Break Commitment (Warning: Permanent)
        </ActionButton>
      );
    }

    if (commitStatus === 'pending') {
      return (
        <ActionButton $variant="secondary" disabled>
          Commitment Pending...
        </ActionButton>
      );
    }

    if (isEligible) {
      return (
        <ActionButton $variant="primary" onClick={() => onRequestCommit(match.id)}>
          💍 Request Commitment
        </ActionButton>
      );
    }

    return (
      <ActionButton $variant="secondary" disabled>
        Not Yet Eligible
      </ActionButton>
    );
  };

  return (
    <TrackerContainer>
      <Header>
        <Title>💍 Commitment Status</Title>
        <StatusBadge $status={commitStatus}>
          {commitStatus.toUpperCase()}
        </StatusBadge>
      </Header>

      {commitStatus !== 'active' && (
        <>
          <ProgressBarContainer>
            <ProgressBar $progress={(commitProgressDays / 14) * 100} />
          </ProgressBarContainer>
          <ProgressText>
            {commitProgressDays} / 14 Days required (Post-PIN)
          </ProgressText>
        </>
      )}

      {renderAction()}
    </TrackerContainer>
  );
};
