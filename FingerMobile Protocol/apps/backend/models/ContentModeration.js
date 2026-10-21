const mongoose = require('mongoose');

// Content Risk Assessment Model
const contentRiskAssessmentSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'contentType',
      required: true
    },
    contentType: {
      type: String,
      required: true,
      enum: ['Post', 'Comment', 'Forum', 'Blog', 'Review', 'Other']
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalContent: {
      type: String,
      required: true
    },
    riskFactors: {
      factuality: {
        type: Number, // 0-100 score
        default: 0,
        min: 0,
        max: 100
      },
      harmPotential: {
        type: Number, // 0-100 score
        default: 0,
        min: 0,
        max: 100
      },
      maliceIndex: {
        type: Number, // 0-100 score
        default: 0,
        min: 0,
        max: 100
      },
      contextualModifiers: {
        type: Number, // 0-100 score
        default: 0,
        min: 0,
        max: 100
      }
    },
    // Calculated using the formula:
    // S_risk = (w1 * Factuality) + (w2 * Harm Potential) + (w3 * Malice Index) - (w4 * Contextual Modifiers)
    overallRiskScore: {
      type: Number,
      default: 0
    },
    riskCategory: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    detectedTargets: [
      {
        entityType: {
          type: String,
          enum: ['public_figure', 'private_individual', 'corporate_entity', 'other']
        },
        entityName: String,
        confidence: {
          type: Number,
          min: 0,
          max: 100
        }
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'flagged', 'quarantined', 'removed', 'appealed'],
      default: 'pending'
    },
    flaggedReasons: [String], // Reasons for flagging content
    aiAnalysisDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    manualReviewNotes: {
      type: String
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    appealDetails: {
      submitted: {
        type: Boolean,
        default: false
      },
      reason: String,
      submittedAt: Date,
      resolved: {
        type: Boolean,
        default: false
      },
      resolutionNotes: String
    }
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

// Child Protection Model
const childConsentLogSchema = new mongoose.Schema(
  {
    consentId: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    minorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    guardianContactHash: {
      type: String, // Encrypted PII
      required: true
    },
    consentMethod: {
      type: String,
      enum: ['Email_OTP', 'Phone_OTP', 'ID_Verify', 'Video_Call', 'Other'],
      required: true
    },
    consentTimestamp: {
      type: Date,
      required: true,
      default: Date.now
    },
    ndpaComplianceFlag: {
      type: Boolean,
      default: true
    },
    expirationDate: {
      type: Date // When to re-verify (when child turns 18)
    },
    revoked: {
      type: Boolean,
      default: false
    },
    revokedAt: Date,
    revocationReason: String
  },
  {
    timestamps: true
  }
);

// Data Portability Request Model
const dataPortabilityRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['requested', 'processing', 'ready', 'downloaded', 'expired', 'cancelled'],
      default: 'requested'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: Date,
    expiresAt: Date, // 24 hours after ready
    downloadUrl: String, // Temporary download URL
    dataSize: Number, // Size of the exported data in bytes
    lastDownloadedAt: Date,
    downloadCount: {
      type: Number,
      default: 0
    },
    completedAt: Date,
    failureReason: String
  },
  {
    timestamps: true
  }
);

// Indexes
contentRiskAssessmentSchema.index({ authorId: 1, createdAt: -1 });
contentRiskAssessmentSchema.index({ status: 1, createdAt: -1 });
contentRiskAssessmentSchema.index({ overallRiskScore: -1 });

childConsentLogSchema.index({ minorUserId: 1, consentTimestamp: -1 });

dataPortabilityRequestSchema.index({ userId: 1, requestedAt: -1 });
dataPortabilityRequestSchema.index({ status: 1, expiresAt: 1 });

module.exports = {
  ContentRiskAssessment: mongoose.model('ContentRiskAssessment', contentRiskAssessmentSchema),
  ChildConsentLog: mongoose.model('ChildConsentLog', childConsentLogSchema),
  DataPortabilityRequest: mongoose.model('DataPortabilityRequest', dataPortabilityRequestSchema)
};
