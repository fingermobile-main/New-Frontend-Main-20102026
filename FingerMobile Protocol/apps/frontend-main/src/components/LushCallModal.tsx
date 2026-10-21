import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { CallSession } from '../hooks/useLushCall';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const CallContainer = styled.div`
  width: 90%;
  max-width: 400px;
  background: var(--surface-1);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 9/16;
  background: var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  position: relative;
`;

const CallerInfo = styled.div`
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const CallerName = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.5rem;
`;

const CallStatus = styled.p`
  margin: 0;
  font-size: 1rem;
  opacity: 0.8;
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 24px;
`;

const CircleButton = styled.button<{ $variant: 'accept' | 'reject' | 'end' }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  font-size: 24px;
  
  background: ${props =>
    props.$variant === 'accept' ? 'var(--success-color, #28a745)' :
      '#dc3545'
};
  color: white;
  
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

interface LushCallModalProps {
  activeCall: CallSession;
  onAnswer: (_callId: string | number) => void;
  onEnd: (_callId: string | number, _reason: 'ended' | 'rejected', _duration: number) => void;
  currentUserId: number; // to determine if we are caller or callee
}

export const LushCallModal: React.FC<LushCallModalProps> = ({
  activeCall,
  onAnswer,
  onEnd,
  currentUserId
}) => {
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isCaller = activeCall.callerId === currentUserId;

  useEffect(() => {
    if (activeCall.status === 'active') {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeCall.status]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <ModalOverlay>
      <CallContainer>
        <VideoPlaceholder>
          {/* Real implementation would use Agora VideoPlayer here */}
          <CallerInfo>
            <CallerName>{isCaller ? 'Calling...' : 'Incoming Call'}</CallerName>
            <CallStatus>
              {activeCall.status === 'outgoing' || activeCall.status === 'incoming' ? 'Ringing...' :
                activeCall.status === 'active' ? formatDuration(duration) :
                  activeCall.status}
            </CallStatus>
          </CallerInfo>
        </VideoPlaceholder>

        <ControlsContainer>
          {activeCall.status === 'incoming' && !isCaller && (
            <CircleButton $variant="accept" onClick={() => onAnswer(activeCall.id)}>
              📞
            </CircleButton>
          )}

          {(activeCall.status === 'incoming' || activeCall.status === 'outgoing' || activeCall.status === 'active') && (
            <CircleButton
              $variant={activeCall.status === 'active' ? 'end' : 'reject'}
              onClick={() => onEnd(activeCall.id, activeCall.status === 'active' ? 'ended' : 'rejected', duration)}
            >
              ☎️
            </CircleButton>
          )}
        </ControlsContainer>
      </CallContainer>
    </ModalOverlay>
  );
};
