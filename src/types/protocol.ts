// FingerMobile Protocol Type Definitions

export interface ProtocolMessage {messageId: string;
  messageType: string;
  source: string;
  destination: string;
  payload: unknown;
  timestamp: number;
  signature?: string;
  encrypted?: boolean;
}

export interface HandshakeRequest {protocolVersion: string;
  clientId: string;
  supportedFeatures: string[];
  publicKey?: string; // For encryption
}

export interface HandshakeResponse {accepted: boolean;
  serverId: string;
  protocolVersion: string;
  sessionId: string;
  publicKey?: string; // For encryption
  errorCode?: string;
}

export interface Acknowledgement {messageId: string;
  status: "success" | "failure";
  errorCode?: string;
}
