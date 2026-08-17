// adminControl.ts - Type definitions for AdminControlService

export interface AdminActionItem {id: string;
  actionWord: string;
  description?: string;
  module: string;
  requiresConfirmation: boolean;
  confirmationWindow: number; // seconds,
  requiresMultiSig: boolean;
  minSignatures: number;
  geoFenceRequired: boolean;
  allowedCountries: string[];
  requiresBiometric: boolean;
  requiresOTP: boolean;
  executionTime: Date | null;
  status: "pending" | "executing" | "completed" | "cancelled" | "failed";
}

export interface AdminMemberItem {id: string;
  name: string;
  role: "OWNER" | "ADMIN" | "MODERATOR" | "AUDITOR";
  permissions: string[];
  lastLogin: Date;
  isActive: boolean;
  geoLocation?: string;
}

export interface AuditLogItem {id: string;
  memberId: string;
  actionId: string;
  timestamp: Date;
  details: string;
  ipAddress: string;
  memberAgent: string;
  status: "success" | "failed" | "cancelled";
}
  
export {};  
