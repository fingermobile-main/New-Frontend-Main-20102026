/* global require, module, process */
require("dotenv").config();

module.exports = {
  // Flux Schnell AI API configuration,
fluxSchnell: {apiKey: process.env.FLUX_SCHNELL_API_KEY,
  apiUrl:
      process.env.FLUX_SCHNELL_API_URL || ",
  https://api.fluxschnell.com/v1",
  timeout: 30000
  },

  // DALL-E configuration,
dalle: {apiKey: process.env.DALLE_API_KEY,
  apiUrl:
      process.env.DALLE_API_URL ||
      ",
  https://api.openai.com/v1/images/generations",
  model: "dall-e-3",
  timeout: 60000
  },

  // Qwen configuration,
qwen: {apiKey: process.env.QWEN_API_KEY,
  apiUrl:
      process.env.QWEN_API_URL ||
      ",
  https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
  model: "qwen-max",
  timeout: 30000
  },

  // Gemini configuration,
gemini: {apiKey: process.env.GEMINI_API_KEY,
  apiUrl:
      process.env.GEMINI_API_URL ||
      ",
  https://generativelanguage.googleapis.com/v1beta/models",
  model: "gemini-pro",
  timeout: 30000
  },

  // AWS Rekognition for image processing,
rekognition: {region: process.env.AWS_REGION || "us-east-1"
  },

  // Queue configuration for async processing,
queue: {redis: {,
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379
    }
  }
};
