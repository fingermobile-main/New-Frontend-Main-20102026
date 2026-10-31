// Real-time communication service for FingerMobile Protocol
// Implements WebSocket connections for chat voice, and video communication

import { WebSocketService } from './webSocketService';
import { getWsBaseUrl } from './api';
import {
  JoinRoomData,
  ChatMessageSendData,
  TypingData,
  VoiceCallData,
  EndCallData,
  VideoCallData
} from '../types/realTime';

class RealTimeService extends WebSocketService {
  constructor() {
    super({prodEndpoint: 'wss://api.fingermobileprotocol.com/ws', devEndpoint: getWsBaseUrl()});
  }

  // Join a chat room
  joinChatRoom(roomId: string): void {
    const data: JoinRoomData = { roomId };
    this.sendMessage('join_room', data);
  }

  // Leave a chat room
  leaveChatRoom(roomId: string): void {
    const data: JoinRoomData = { roomId };
    this.sendMessage('leave_room', data);
  }

  // Send a chat message
  sendChatMessage(roomId: string, content: string): void {
    const data: ChatMessageSendData = {
      roomId,
      content, timestamp: new Date().toISOString()
    };
    this.sendMessage('chat_message', data);
  }

  // Send a typing indicator
  sendTyping(roomId: string, isTyping: boolean): void {
    const data: TypingData = {
      roomId,
      isTyping, timestamp: new Date().toISOString()
    };
    this.sendMessage('typing', data);
  }

  // Start a voice call
  startVoiceCall(participants: string[]): void {
    const data: VoiceCallData = { participants };
    this.sendMessage('start_voice_call', data);
  }

  // End a voice call
  endVoiceCall(callId: string): void {
    const data: EndCallData = { callId };
    this.sendMessage('end_voice_call', data);
  }

  // Start a video call
  startVideoCall(participants: string[]): void {
    const data: VideoCallData = { participants };
    this.sendMessage('start_video_call', data);
  }

  // End a video call
  endVideoCall(callId: string): void {
    const data: EndCallData = { callId };
    this.sendMessage('end_video_call', data);
  }
}

// Export singleton instance
const realTimeService = new RealTimeService();
export default realTimeService;
