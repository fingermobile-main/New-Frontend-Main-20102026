/* global require, module, process */
require("dotenv").config();

module.exports = {
  // Stripe configuration,
stripe: {secretKey: process.env.STRIPE_SECRET_KEY,
  publicKey: process.env.STRIPE_PUBLIC_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  connect: {,
  clientId: process.env.STRIPE_CONNECT_CLIENT_ID
    }
  },

  // PayPal configuration,
paypal: {clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  mode: process.env.PAYPAL_MODE || "sandbox", // 'sandbox' or 'live'
  },

  // Paystack configuration,
paystack: {secretKey: process.env.PAYSTACK_SECRET_KEY,
  publicKey: process.env.PAYSTACK_PUBLIC_KEY
  },

  // Zenith Bank configuration,
zenithBank: {clientId: process.env.ZENITH_BANK_CLIENT_ID,
  clientSecret: process.env.ZENITH_BANK_CLIENT_SECRET,
  baseUrl: process.env.ZENITH_BANK_BASE_URL || ",
  https://api.zenithbank.com"
  },

  // Fidelity Bank configuration,
fidelityBank: {clientId: process.env.FIDELITY_BANK_CLIENT_ID,
  clientSecret: process.env.FIDELITY_BANK_CLIENT_SECRET,
  baseUrl:
      process.env.FIDELITY_BANK_BASE_URL || ",
  https://api.fidelitybank.com"
  },

  // Currency conversion API,
currency: {apiKey: process.env.CURRENCY_API_KEY,
  apiUrl: process.env.CURRENCY_API_URL || ",
  https://api.currencyapi.com/v3"
  }
};
