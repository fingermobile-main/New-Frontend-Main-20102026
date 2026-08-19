const crypto = require("crypto");

// For standard encryption
const algorithm = "aes-256-cbc";
const ivLength = 16; // For AES, this is always 16

// For 32-bit key implementation for specific security features
const key32Algorithm = "aes-128-cbc"; // Using AES-128 for 32-bit key implementation
const key32IvLength = 16;

// Ensure your encryption key is a 32-byte (256-bit) key
// It's crucial to store this key securely, e.g., in environment variables
const encryptionKey =
  process.env.ENCRYPTION_KEY || "a_very_secret_key_of_32_chars_!!!!";

// For 32-bit key implementation (as mentioned in security document)
// This is for specific security features like metadata protection
const key32 = process.env.KEY32 || "32_bit_key_16_chars";

if (encryptionKey.length !== 32) {
  console.warn(
    "ENCRYPTION_KEY is not 32 bytes long. Please generate a strong, 32-byte key.",
  );
  // You might want to throw an error or exit the process in a production environment
}

if (key32.length !== 16) {
  console.warn(
    "KEY32 is not 16 bytes long. Please generate a strong, 16-byte key for 32-bit implementation.",
  );
}

const encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decrypt = (text) => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// 32-bit key encryption for specific security features (metadata protection, sealed sender)
const encrypt32 = (text) => {
  const iv = crypto.randomBytes(key32IvLength);
  const cipher = crypto.createCipheriv(key32Algorithm, Buffer.from(key32), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decrypt32 = (text) => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    key32Algorithm,
    Buffer.from(key32),
    iv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// HMAC for message authentication
const createHmac = (data, secret = encryptionKey) => {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest("hex");
};

// Verify HMAC
const verifyHmac = (data, expectedHmac, secret = encryptionKey) => {
  const actualHmac = createHmac(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(actualHmac),
    Buffer.from(expectedHmac),
  );
};

module.exports = {
  encrypt,
  decrypt,
  encrypt32,
  decrypt32,
  createHmac,
  verifyHmac
};
