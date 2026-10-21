import React, {} from 'react';
export interface WebSocketMessage<T = unknown> {event: string;
  data: T;
  timestamp: number;
}

export interface JoinRoomData {roomId: string;
}

export interface ChatMessageSendData {roomId: string;
  content: string;
  timestamp: string;
}

export interface TypingData {roomId: string;
  isTyping: boolean;
  timestamp: string;
}

export interface VoiceCallData {participants: string[];
}

export interface EndCallData {callId: string;
}

export interface VideoCallData {participants: string[];
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
