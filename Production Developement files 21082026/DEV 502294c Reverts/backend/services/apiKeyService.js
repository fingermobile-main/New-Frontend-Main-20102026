const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

class ApiKeyService {
  constructor() {
    // In a real implementation, this would connect to your database
    // For now, we'll use a placeholder approach
  }

  /**
   * Generate a new API key for a member
   * @param {string} memberId - The ID of the member requesting the API key
   * @param {string} keyName - A name for the API key
   * @param {Array<string>} permissions - Permissions associated with the key
   * @returns {Object} - The generated API key and related information
   */
  async generateApiKey(memberId, keyName, permissions = []) {
    // Generate a unique API key
    const apiKey = `fm_${uuidv4().replace(/-/g, "")}`;

    // Generate a secret key associated with the API key
    const secretKey = `fmsk_${crypto.randomBytes(32).toString("hex")}`;

    // Generate SHA256 and SHA512 hashes for additional security
    const apiKeySha256 = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");
    const apiKeySha512 = crypto
      .createHash("sha512")
      .update(apiKey)
      .digest("hex");

    // Create the API key record
    const apiKeyRecord = {
      id: uuidv4(),
      memberId,
      apiKey,
      secretKey: this.hashSecretKey(secretKey), // Store hashed version of secret key
      apiKeySha256,
      apiKeySha512,
      name: keyName,
      permissions: permissions.length > 0 ? permissions : ["read"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUsedAt: null,
      rateLimit: 1000, // Default rate limit per hour
    };

    // In a real implementation, this would save to the database
    // await db.apiKeys.insert(apiKeyRecord);

    // Return the API key with sensitive data properly handled
    return {
      id: apiKeyRecord.id,
      memberId: apiKeyRecord.memberId,
      apiKey: apiKeyRecord.apiKey,
      secretKey, // Return the unhashed secret key to the member
      apiKeySha256: apiKeyRecord.apiKeySha256,
      apiKeySha512: apiKeyRecord.apiKeySha512,
      name: apiKeyRecord.name,
      permissions: apiKeyRecord.permissions,
      isActive: apiKeyRecord.isActive,
      createdAt: apiKeyRecord.createdAt,
      rateLimit: apiKeyRecord.rateLimit
    };
  }

  /**
   * Hash the secret key before storing in the database
   * @param {string} secretKey - The secret key to hash
   * @returns {string} - The hashed secret key
   */
  hashSecretKey(secretKey) {
    return crypto.createHash("sha256").update(secretKey).digest("hex");
  }

  /**
   * Verify an API key and secret key combination
   * @param {string} apiKey - The API key to verify
   * @param {string} providedSecretKey - The secret key provided by the client
   * @returns {Object|boolean} - API key record if valid, false otherwise
   */
  async verifyApiKey(apiKey, providedSecretKey) {
    // In a real implementation, this would fetch from the database
    // const apiKeyRecord = await db.apiKeys.findOne({ apiKey, isActive: true });

    // For this example, we'll return a mock record
    // In a real implementation, you would:
    // 1. Fetch the API key record from the database
    // 2. Hash the providedSecretKey and compare with stored hash
    // 3. Update the lastUsedAt field
    // 4. Return the record if valid

    // Mock implementation for demonstration
    if (apiKey && providedSecretKey) {
      const hashedProvidedSecret = this.hashSecretKey(providedSecretKey);

      // In real implementation, compare with stored hash
      // For now, just return a mock valid record
      return {
        id: uuidv4(),
        memberId: "mock-member-id",
        apiKey,
        name: "Mock API Key",
        permissions: ["read", "write"],
        isActive: true,
        createdAt: new Date(),
        lastUsedAt: new Date(),
        rateLimit: 1000
      };
    }

    return false;
  }

  /**
   * Generate a signature for request authentication using HMAC
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} url - The request URL
   * @param {Object} params - Request parameters
   * @param {string} secretKey - The secret key for signing
   * @param {string} timestamp - Request timestamp
   * @returns {string} - The generated signature
   */
  generateSignature(method, url, params, secretKey, timestamp) {
    // Create the signature string by concatenating method, URL, params, and timestamp
    const paramString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const signatureString = `${method.toUpperCase()}${url}${paramString}${timestamp}`;

    // Create HMAC signature using SHA256
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(signatureString)
      .digest("hex");

    return signature;
  }

  /**
   * Verify a request signature
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {Object} params - Request parameters
   * @param {string} providedSignature - Signature provided with the request
   * @param {string} secretKey - The secret key for verification
   * @param {string} timestamp - Request timestamp
   * @returns {boolean} - True if signature is valid, false otherwise
   */
  verifySignature(
    method,
    url,
    params,
    providedSignature,
    secretKey,
    timestamp,
  ) {
    const expectedSignature = this.generateSignature(
      method,
      url,
      params,
      secretKey,
      timestamp,
    );
    return crypto.timingSafeEqual(
      Buffer.from(providedSignature, "hex"),
      Buffer.from(expectedSignature, "hex"),
    );
  }

  /**
   * Revoke an API key
   * @param {string} apiKeyId - The ID of the API key to revoke
   * @param {string} memberId - The ID of the member requesting revocation
   * @returns {Object} - Result of the revocation
   */
  async revokeApiKey(apiKeyId, memberId) {
    // In a real implementation, this would update the database record
    // await db.apiKeys.update({ id: apiKeyId, memberId }, { $set: { isActive: false } });

    return {
      success: true,
      message: "API key revoked successfully",
      apiKeyId
    };
  }

  /**
   * Rotate an API key (generate new key while invalidating the old one)
   * @param {string} apiKeyId - The ID of the API key to rotate
   * @param {string} memberId - The ID of the member requesting rotation
   * @returns {Object} - The new API key information
   */
  async rotateApiKey(apiKeyId, memberId) {
    // In a real implementation, this would fetch the current key details
    // const currentKey = await db.apiKeys.findOne({ id: apiKeyId, memberId });

    // For this example, we'll generate a new key
    const newKey = await this.generateApiKey(
      memberId,
      `Rotated from ${apiKeyId.substring(0, 8)}...`,
      ["read", "write"], // Using default permissions
    );

    // Revoke the old key
    await this.revokeApiKey(apiKeyId, memberId);

    return newKey;
  }

  /**
   * Get API key details for a member
   * @param {string} apiKeyId - The ID of the API key
   * @param {string} memberId - The ID of the member
   * @returns {Object|null} - API key details or null if not found
   */
  async getApiKeyDetails(apiKeyId, memberId) {
    // In a real implementation, this would fetch from the database
    // return await db.apiKeys.findOne({ id: apiKeyId, memberId });

    // Mock implementation
    return {
      id: apiKeyId,
      memberId,
      apiKey: `fm_${apiKeyId.replace(/-/g, "").substring(0, 32)}`,
      name: "Example API Key",
      permissions: ["read", "write"],
      isActive: true,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      lastUsedAt: new Date(Date.now() - 3600000), // 1 hour ago
      rateLimit: 1000
    };
  }

  /**
   * List all API keys for a member
   * @param {string} memberId - The ID of the member
   * @returns {Array} - Array of API key records
   */
  async listApiKeys(memberId) {
    // In a real implementation, this would fetch from the database
    // return await db.apiKeys.find({ memberId, isActive: true }).toArray();

    // Mock implementation
    return [
      {
        id: uuidv4(),
        apiKey: "fm_" + uuidv4().replace(/-/g, "").substring(0, 32),
        name: "Production Key",
        permissions: ["read", "write", "delete"],
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        lastUsedAt: new Date(Date.now() - 3600000), // 1 hour ago
        rateLimit: 5000
      },
      {
        id: uuidv4(),
        apiKey: "fm_" + uuidv4().replace(/-/g, "").substring(0, 32),
        name: "Development Key",
        permissions: ["read"],
        isActive: true,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        lastUsedAt: new Date(Date.now() - 7200000), // 2 hours ago
        rateLimit: 1000
      }
    ];
  }
}

module.exports = new ApiKeyService();