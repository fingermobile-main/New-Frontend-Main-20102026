import { useState, useEffect, useCallback } from 'react';

export interface CallData {
  id: string;
  callerId: number;
  calleeId: number;
  callerName: string;
  calleeName: string;
  status: 'incoming' | 'outgoing' | 'active' | 'ended';
  startTime?: string;
  endTime?: string;
}

export type CallSession = CallData;

export function useLushCall() {
  const [activeCall, setActiveCall] = useState<CallData | null>(null);
  const [callHistory, setCallHistory] = useState<CallData[]>([]);

  // Simulate incoming call
  const simulateIncomingCall = useCallback((callerId: number, callerName: string) => {
    const newCall: CallData = {
      id: `call_${Date.now()}`,
      callerId,
      calleeId: 1, // Current user ID
      callerName,
      calleeName: 'Current User',
      status: 'incoming',
      startTime: new Date().toISOString()
    };

    setActiveCall(newCall);
  }, []);

  // Answer incoming call
  const answerCall = useCallback(() => {
    if (activeCall && activeCall.status === 'incoming') {
      const updatedCall: CallData = {
        ...activeCall,
        status: 'active',
        startTime: new Date().toISOString()
      };

      setActiveCall(updatedCall);
    }
  }, [activeCall]);

  // End current call
  const endCall = useCallback(() => {
    if (activeCall) {
      const endedCall: CallData = {
        ...activeCall,
        status: 'ended',
        endTime: new Date().toISOString()
      };

      // Add to history
      setCallHistory(prev => [endedCall, ...prev.slice(0, 9)]); // Keep last 10 calls

      // Clear active call
      setActiveCall(null);
    }
  }, [activeCall]);

  // Make outgoing call
  const makeCall = useCallback((calleeId: number, calleeName: string) => {
    const newCall: CallData = {
      id: `call_${Date.now()}`,
      callerId: 1, // Current user ID
      calleeId,
      callerName: 'Current User',
      calleeName,
      status: 'outgoing',
      startTime: new Date().toISOString()
    };

    setActiveCall(newCall);
  }, []);

  // Simulate WebSocket events for calls
  useEffect(() => {
    // In a real app, this would listen to WebSocket events
    const handleCallEvent = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'lush:call:incoming') {
          simulateIncomingCall(data.callerId, data.callerName);
        }
      } catch (e) {
        console.error('Error handling call event:', e);
      }
    };

    // Set up WebSocket connection
    const ws: WebSocket | null = null;
    if (typeof window !== 'undefined') {
      // Don't actually connect in this example
      // ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:5000/ws');
      // ws.onmessage = handleCallEvent;
    }

    return () => {
      if (ws) {
        (ws as WebSocket).close();
      }
    };
  }, [simulateIncomingCall]);

  return {
    activeCall,
    callHistory,
    answerCall,
    endCall,
    makeCall
  };
}
