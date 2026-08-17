import { AIGovernanceConfig } from '../types';

export const aiGovernanceConfig: AIGovernanceConfig = {
  version: "1.0.0",
  defaultPolicyId: "default-policy",
  policies: {
    "default-policy": {
      id: "default-policy",
      name: "Default Policy",
      description: "Default AI governance policy",
      allowedActions: ["analyze", "generate", "suggest"],
      bannedActions: ["access_private_data", "modify_system_configs"],
      requireExplicitConsent: true,
      dataHandling: {
        piiRedaction: true,
        allowSensitiveCategories: ["public_records"],
        redactionPatterns: ["/\\b\\d{4}\\b/g"]
      },
      audit: {
        logEvents: true,
        retentionDays: 30,
        destination: "local"
      }
    }
  }
};

export default aiGovernanceConfig;