'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require('swagger-jsdoc'));
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'FingerMobile API Documentation',
    version: '1.0.0',
    description: 'Comprehensive API documentation for the FingerMobile Protocol Communication platform including authentication, wallet management, payments, and staking.',
    contact: {
      name: 'FingerMobile Support',
      email: 'support@fingermobileprotocol.com'
    },
    license: {
      name: 'Proprietary',
      url: 'https://fingermobileprotocol.com/license'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    },
    {
      url: 'https://api.fingermobileprotocol.com',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token'
      }
    },
    schemas: {
      User: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'User ID'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          firstName: {
            type: 'string',
            description: 'First name'
          },
          lastName: {
            type: 'string',
            description: 'Last name'
          },
          username: {
            type: 'string',
            description: 'Unique username'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin', 'moderator'],
            default: 'user'
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'suspended', 'deleted'],
            default: 'active'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Wallet: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          userId: {
            type: 'string',
            format: 'uuid'
          },
          balance: {
            type: 'number',
            format: 'float',
            minimum: 0
          },
          currency: {
            type: 'string',
            default: 'USD'
          },
          status: {
            type: 'string',
            enum: ['active', 'suspended', 'closed']
          }
        }
      },
      Transaction: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          walletId: {
            type: 'string',
            format: 'uuid'
          },
          userId: {
            type: 'string',
            format: 'uuid'
          },
          type: {
            type: 'string',
            enum: ['credit', 'debit', 'stake', 'payout', 'distribution']
          },
          amount: {
            type: 'number',
            format: 'float'
          },
          currency: {
            type: 'string'
          },
          status: {
            type: 'string',
            enum: ['pending', 'completed', 'failed', 'cancelled']
          },
          description: {
            type: 'string'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Stake: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          userId: {
            type: 'string',
            format: 'uuid'
          },
          walletId: {
            type: 'string',
            format: 'uuid'
          },
          amount: {
            type: 'number',
            format: 'float',
            minimum: 0
          },
          currency: {
            type: 'string',
            default: 'USD'
          },
          rewardRate: {
            type: 'number',
            format: 'float',
            description: 'Annual percentage yield'
          },
          status: {
            type: 'string',
            enum: ['active', 'unstaked', 'pending']
          },
          startedAt: {
            type: 'string',
            format: 'date-time'
          },
          endsAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string'
              },
              statusCode: {
                type: 'integer'
              },
              timestamp: {
                type: 'string',
                format: 'date-time'
              }
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints'
    },
    {
      name: 'Wallet',
      description: 'Wallet management and operations'
    },
    {
      name: 'Payments',
      description: 'Payment processing and transactions'
    },
    {
      name: 'Staking',
      description: 'Token staking and rewards'
    },
    {
      name: 'Earnings',
      description: 'Earnings distribution and history'
    },
    {
      name: 'AI Services',
      description: 'OpenAI-powered features including chat, image generation, translation, and content moderation'
    }
  ]
};
const options = {
  definition: swaggerDefinition,
  apis: ['./routes/*.ts', './controllers/*.ts'] // Path to the API docs
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
