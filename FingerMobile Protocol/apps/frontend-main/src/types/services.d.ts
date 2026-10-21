// Type definitions for Guardian Security Engine services

export interface ThreatAssessment {id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  recommendations: string[];
  timestamp: string;
}

export interface Vulnerability {id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  remediation: string;
  detectedAt: string;
}
