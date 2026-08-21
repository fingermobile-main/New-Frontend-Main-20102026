class ApiDocumentationController {
  /**
   * Get the API documentation
   */
  getApiDocumentation(req, res) {
    const documentation = {
      title: "FingerMobile API Documentation",
      version: "1.0.0",
      description: "Complete API documentation for the FingerMobile platform",
      baseUrl: `${req.protocol}://${req.get("host")}/api`,
      authentication: {
        methods: [
          {
            type: "API Key",
            description: "Authenticate using your API key and secret key (configured in environment variables)",
            headers: {
              "x-api-key": "Your API key (configured via environment variable)",
              "x-secret-key": "Your secret key (configured via environment variable)"
            }
          },
          {
            type: "Bearer Token",
            description: "Authenticate using JWT token (for member endpoints)",
            headers: {
              Authorization: "Bearer {token}"
            }
          }
        ],
        signatureVerification: {
          description: "For additional security, requests can be signed using your secret key (configured in environment variables)",
          headers: {
            "x-signature": "HMAC-SHA256 signature of the request",
            "x-timestamp": "Timestamp of the request (within 5 minutes)"
          },
          algorithm: "HMAC-SHA256",
          implementation: "Signature is created by concatenating method, URL, parameters (sorted), and timestamp, then hashing with your secret key (configured in environment variables)"
        }
      },
      endpoints: [
        {
          path: "/api/auth/login",
          method: "POST",
          description: "Authenticate a member",
          requiresAuth: false,
          parameters: {
            body: {
              email: "string (required)",
              password: "string (required)"
            }
          },
          responses: {
            200: "Success - Returns JWT token",
            401: "Unauthorized - Invalid credentials"
          }
        },
        {
          path: "/api/auth/register",
          method: "POST",
          description: "Register a new member",
          requiresAuth: false,
          parameters: {
            body: {
              email: "string (required)",
              password: "string (required)",
              firstName: "string (required)",
              lastName: "string (required)"
            }
          },
          responses: {
            201: "Created - Returns new member data",
            400: "Bad Request - Invalid input"
          }
        },
        {
          path: "/api/api-keys",
          method: "GET",
          description: "List all API keys for the authenticated member",
          requiresAuth: true,
          requiresApiKey: true,
          responses: {
            200: "Success - Returns array of API keys",
            401: "Unauthorized - Invalid authentication"
          }
        },
        {
          path: "/api/api-keys",
          method: "POST",
          description: "Generate a new API key",
          requiresAuth: true,
          requiresApiKey: true,
          parameters: {
            body: {
              keyName: "string (required) - Name for the API key",
              permissions: "array of strings (optional) - Permissions for the API key"
            }
          },
          responses: {
            201: "Created - Returns new API key details",
            400: "Bad Request - Missing required fields",
            401: "Unauthorized - Invalid authentication"
          }
        },
        {
          path: "/api/api-keys/:apiKeyId",
          method: "GET",
          description: "Get details of a specific API key",
          requiresAuth: true,
          requiresApiKey: true,
          responses: {
            200: "Success - Returns API key details",
            401: "Unauthorized - Invalid authentication",
            404: "Not Found - API key not found"
          }
        },
        {
          path: "/api/api-keys/:apiKeyId",
          method: "DELETE",
          description: "Revoke an API key",
          requiresAuth: true,
          requiresApiKey: true,
          responses: {
            200: "Success - API key revoked",
            401: "Unauthorized - Invalid authentication",
            404: "Not Found - API key not found"
          }
        },
        {
          path: "/api/api-keys/:apiKeyId/rotate",
          method: "PUT",
          description: "Rotate an API key (generate new key while invalidating the old one)",
          requiresAuth: true,
          requiresApiKey: true,
          responses: {
            200: "Success - Returns new API key details",
            401: "Unauthorized - Invalid authentication",
            404: "Not Found - API key not found"
          }
        },
        {
          path: "/api/photocredits/create",
          method: "POST",
          description: "Create a new PhotoCredit (image/video)",
          requiresAuth: true,
          requiresApiKey: true,
          parameters: {
            body: {
              title: "string (required)",
              description: "string (optional)",
              imageUrl: "string (required)",
              category: "string (optional)",
              tags: "array of strings (optional)",
              isDownloadable: "boolean (optional)",
              isShareable: "boolean (optional)"
            }
          },
          responses: {
            201: "Created - Returns new PhotoCredit",
            401: "Unauthorized - Invalid authentication",
            403: "Forbidden - Insufficient permissions"
          }
        },
        {
          path: "/api/photocredits/trending",
          method: "GET",
          description: "Get trending PhotoCredits",
          requiresAuth: true,
          requiresApiKey: true,
          parameters: {
            query: {
              limit: "number (optional) - Default: 10",
              timeFrame: "string (optional) - daily, weekly, monthly. Default: weekly"
            }
          },
          responses: {
            200: "Success - Returns trending PhotoCredits",
            401: "Unauthorized - Invalid authentication"
          }
        },
        {
          path: "/api/supersix/session",
          method: "POST",
          description: "Create a new Super Six game session",
          requiresAuth: true,
          requiresApiKey: true,
          parameters: {
            body: {
              gameMode: "string (optional) - Game mode. Default: classic"
            }
          },
          responses: {
            201: "Created - Returns new game session",
            401: "Unauthorized - Invalid authentication"
          }
        },
        {
          path: "/api/supersix/leaderboards",
          method: "GET",
          description: "Get Super Six leaderboards",
          requiresAuth: true,
          requiresApiKey: true,
          parameters: {
            query: {
              gameMode: "string (optional) - Game mode. Default: classic",
              limit: "number (optional) - Default: 50"
            }
          },
          responses: {
            200: "Success - Returns leaderboard entries",
            401: "Unauthorized - Invalid authentication"
          }
        },
        {
          path: "/api/external-services/signalwire/send-otp",
          method: "POST",
          description: "Send OTP via Signalwire SMS",
          requiresAuth: true,
          requiresApiKey: true,
          parameters: {
            body: {
              phoneNumber: "string (required)",
              otp: "string (required)"
            }
          },
          responses: {
            200: "Success - OTP sent",
            401: "Unauthorized - Invalid authentication"
          }
        },
        {
          path: "/api/external-services/moniepoint/process-payout",
          method: "POST",
          description: "Process payout via Moniepoint",
          requiresAuth: true,
          requiresApiKey: true,
          requiresPermissions: ["payout", "finance"],
          parameters: {
            body: {
              amount: "number (required)",
              recipient: "string (required)",
              reference: "string (optional)"
            }
          },
          responses: {
            200: "Success - Payout processed",
            401: "Unauthorized - Invalid authentication",
            403: "Forbidden - Insufficient permissions"
          }
        }
      ],
      rateLimits: {
        description: "All API endpoints are subject to rate limiting based on your API key",
        defaultLimit: "1000 requests per hour per API key",
        premiumLimit: "5000 requests per hour per API key for premium members"
      },
      security: {
        bestPractices: [
          "Keep your API keys and secret keys secure (stored in environment variables)",
          "Rotate your keys regularly",
          "Use different keys for development and production environments",
          "Implement proper signature verification for sensitive endpoints",
          "Monitor your API usage",
          "Revoke keys that are no longer needed"
        ],
        signatureVerification: {
          description: "For additional security, you can sign your requests using your secret key (stored in environment variables)",
          algorithm: "HMAC-SHA256",
          implementation: "Concatenate method, URL, sorted parameters, and timestamp, then hash with your secret key (stored in environment variables)"
        }
      },
      examples: {
        curl: {
          description: "Example cURL request with API key authentication (use environment variables)",
          command: 'curl -X GET "https://api.fingermobile.com/api/api-keys" \\\n  -H "x-api-key: ${process.env.API_KEY}" \\\n  -H "x-secret-key: ${process.env.SECRET_KEY}"'
        },
        nodejs: {
          description: "Example Node.js request with API key authentication (use environment variables)",
          code: `const response = await fetch('https://api.fingermobile.com/api/api-keys', {
  method: 'GET',
  headers: {
    'x-api-key': process.env.API_KEY,
    'x-secret-key': process.env.SECRET_KEY
  }
});`
        }
      }
    };

    res.status(200).json(documentation);
  }

  /**
   * Get security information
   */
  getSecurityInfo(req, res) {
    const securityInfo = {
      title: "FingerMobile Security Information",
      version: "1.0.0",
      description: "Security features and implementation details for the FingerMobile platform",
      securityFeatures: [
        {
          name: "API Key Authentication",
          description: "Secure API access using unique API keys and secret keys",
          implementation: "API keys are generated with SHA-256 and SHA-512 hashes for additional security"
        },
        {
          name: "Request Signing",
          description: "Verify request authenticity using HMAC-SHA256 signatures",
          implementation: "Requests can be signed with your secret key to ensure they have not been tampered with"
        },
        {
          name: "Biometric Authentication",
          description: "Secure login using Face ID or Fingerprint",
          implementation: "Biometric data is encrypted and stored securely"
        },
        {
          name: "Two-Factor Authentication",
          description: "Additional security layer using SMS or TOTP",
          implementation: "Integrates with Signalwire for SMS OTP delivery"
        },
        {
          name: "Registration Lock",
          description: "PIN-based protection for account access",
          implementation: "Additional PIN required for sensitive operations"
        },
        {
          name: "Sealed Sender",
          description: "Metadata protection for messages",
          implementation: "Message metadata is encrypted to protect member privacy"
        },
        {
          name: "Safety Numbers",
          description: "Verify contact identity",
          implementation: "Unique safety numbers for each contact to verify their identity"
        },
        {
          name: "Disappearing Messages",
          description: "Messages that automatically delete after a set time",
          implementation: "Messages are automatically deleted from servers after configured time"
        },
        {
          name: "End-to-End Encryption",
          description: "32-bit key encryption for all sensitive data",
          implementation: "All sensitive data is encrypted using 32-bit AES encryption"
        }
      ],
      encryptionStandards: {
        algorithm: "AES-256 for data encryption (keys stored in environment variables)",
        keyExchange: "RSA-2048 for secure key exchange (keys stored in environment variables)",
        signatures: "HMAC-SHA256 for request verification (keys stored in environment variables)",
        certificates: "X.509 certificates for identity verification"
      },
      compliance: [
        "GDPR - European data protection regulation",
        "Nigeria Data Protection Regulation (NDPR)",
        "SOC 2 Type II - Security and availability controls"
      ]
    };

    res.status(200).json(securityInfo);
  }
}

module.exports = new ApiDocumentationController();
