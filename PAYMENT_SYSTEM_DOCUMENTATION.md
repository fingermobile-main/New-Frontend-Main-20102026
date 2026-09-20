# FingerMobile Protocol - Payment System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Stripe Integration](#stripe-integration)
4. [Web3/FIC Integration](#web3fic-integration)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Security](#security)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Overview

The FingerMobile Protocol payment system provides dual payment gateways supporting both traditional fiat currencies (via Stripe) and cryptocurrency (via Web3/FIC). This system enables creators to monetize their content through multiple revenue streams including ad-revenue sharing, subscriptions, tips, and direct cryptocurrency transactions.

### Key Features
- **Dual Payment Gateways**: Support for both Stripe (fiat) and Web3 (crypto)
- **Flexible Pricing**: One-time payments, subscriptions, and micro-transactions
- **Creator Monetization**: Multiple revenue streams for content creators
- **Secure Processing**: PCI DSS compliance for fiat payments and blockchain security for crypto
- **Real-time Processing**: Instant payment confirmations and notifications

## Architecture

The payment system follows a microservice architecture with the following components:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │────│  Payment API     │────│  External APIs  │
│   (React)       │    │  (Express/Node)  │    │  (Stripe, Web3) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                       ┌──────────────────┐
                       │   Database       │
                       │   (PostgreSQL)   │
                       └──────────────────┘
```

### Core Components
- **StripePaymentService**: Handles Stripe payment processing
- **Web3PaymentService**: Manages cryptocurrency transactions
- **PaymentController**: Orchestrates payment flows
- **Database Models**: Track transactions, balances, and subscriptions

## Stripe Integration

### Configuration
The Stripe integration requires the following environment variables:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Supported Features
- One-time payments
- Recurring subscriptions
- Customer portals
- Payment methods management
- Webhook processing

### Security Measures
- PCI DSS compliance
- Tokenization of payment information
- Secure API key handling
- Webhook signature verification

## Web3/FIC Integration

### Configuration
The Web3 integration requires:

```env
WEB3_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
FIC_CONTRACT_ADDRESS=0x...
PLATFORM_WALLET_PRIVATE_KEY=0x...
```

### Supported Features
- FIC token transfers
- Wallet connectivity
- Balance queries
- Smart contract interactions
- Transaction approvals

### Security Measures
- Secure private key management
- Transaction validation
- Gas price optimization
- Smart contract audit compliance

## API Reference

### Stripe Payment Endpoints

#### Create Payment Intent
Create a payment intent for one-time payments.

**POST** `/api/payments/stripe/create-payment-intent`

**Request Body:**
```json
{
  "userId": "string",
  "amount": "number",
  "currency": "string (default: usd)",
  "description": "string (optional)",
  "metadata": "object (optional)"
}
```

**Response:**
```json
{
  "success": "boolean",
  "paymentIntentId": "string",
  "clientSecret": "string",
  "error": "string (if success is false)"
}
```

#### Create Checkout Session
Create a checkout session for subscriptions.

**POST** `/api/payments/stripe/create-checkout-session`

**Request Body:**
```json
{
  "userId": "string",
  "priceId": "string",
  "successUrl": "string",
  "cancelUrl": "string",
  "metadata": "object (optional)"
}
```

**Response:**
```json
{
  "success": "boolean",
  "sessionId": "string",
  "url": "string",
  "error": "string (if success is false)"
}
```

### Web3 Payment Endpoints

#### Connect Wallet
Connect a user's Web3 wallet to their account.

**POST** `/api/payments/crypto/connect-wallet`

**Request Body:**
```json
{
  "userId": "string",
  "walletAddress": "string"
}
```

**Response:**
```json
{
  "success": "boolean",
  "message": "string",
  "error": "string (if success is false)"
}
```

#### Get FIC Balance
Get the FIC token balance for a wallet address.

**GET** `/api/payments/crypto/balance/:address`

**Response:**
```json
{
  "success": "boolean",
  "address": "string",
  "balance": "number",
  "token": "string",
  "error": "string (if success is false)"
}
```

#### Transfer FIC
Transfer FIC tokens to another address.

**POST** `/api/payments/crypto/transfer-fic`

**Request Body:**
```json
{
  "fromPrivateKey": "string",
  "toAddress": "string",
  "amount": "number",
  "userId": "string"
}
```

**Response:**
```json
{
  "success": "boolean",
  "transactionHash": "string",
  "message": "string",
  "error": "string (if success is false)"
}
```

### Combined Payment Endpoints

#### Process Tip
Process a tip from one user to another.

**POST** `/api/payment-webhooks/tip`

**Request Body:**
```json
{
  "senderId": "string",
  "receiverId": "string",
  "amount": "number",
  "currency": "string (default: usd)",
  "paymentMethod": "string (stripe|crypto)",
  "message": "string (optional)"
}
```

**Response:**
```json
{
  "success": "boolean",
  "message": "string",
  "transactionId": "string",
  "error": "string (if success is false)"
}
```

## Database Schema

### User Wallets Table
```sql
CREATE TABLE user_wallets (
    wallet_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    crypto_address VARCHAR(255), -- For Web3 addresses
    status VARCHAR(50) DEFAULT 'ACTIVE',
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    wallet_id INTEGER NOT NULL REFERENCES user_wallets(wallet_id),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- DEPOSIT, WITHDRAWAL, SUBSCRIPTION, TIP, AD_REVENUE, CRYPTO_TRANSFER
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    reference_id VARCHAR(255),
    payment_gateway VARCHAR(50), -- stripe, web3, crypto
    status VARCHAR(50) DEFAULT 'COMPLETED',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL, -- Basic, Premium, Partner
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, CANCELLED
    billing_cycle VARCHAR(50) DEFAULT 'MONTHLY',
    amount DECIMAL(10, 2) NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Creator Revenue Shares Table
```sql
CREATE TABLE creator_revenue_shares (
    share_id SERIAL PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES users(id),
    campaign_id INTEGER NOT NULL REFERENCES ad_campaigns(campaign_id),
    content_id VARCHAR(255) NOT NULL, -- ID of the video/post that drove the engagement
    impressions INTEGER DEFAULT 0,
    earned_amount DECIMAL(12, 2) DEFAULT 0.00,
    paid_out BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Security

### Payment Security
- All payment data is encrypted in transit using TLS
- Payment information is tokenized and never stored directly
- Regular security audits of payment processing code
- Compliance with PCI DSS standards for credit card processing

### Web3 Security
- Private keys are stored securely using environment variables
- Transaction signing occurs server-side with proper validation
- Smart contracts are audited for security vulnerabilities
- Gas price estimation prevents excessive fees

### Authentication
- All payment endpoints require authentication except webhooks
- JWT tokens are used for session management
- Rate limiting prevents abuse of payment endpoints

## Deployment

### Environment Setup
```bash
# Clone the repository
git clone https://github.com/fingermobile/protocol.git
cd fingermobile-protocol

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Configuration Steps
1. Obtain Stripe API keys from Stripe Dashboard
2. Set up Web3 provider (Infura, Alchemy, etc.)
3. Deploy FIC token contract and configure address
4. Set up webhook endpoints in Stripe Dashboard
5. Configure database connection

### Deployment Commands
```bash
# Build the application
npm run build

# Start the application
npm start

# Run in development mode
npm run dev
```

## Troubleshooting

### Common Issues

#### Stripe Webhook Failures
- **Symptom**: Webhooks returning 400 or 500 errors
- **Solution**: Verify webhook signature and endpoint URL in Stripe Dashboard

#### Web3 Connection Issues
- **Symptom**: Unable to connect to blockchain
- **Solution**: Check RPC URL and network configuration

#### Payment Processing Errors
- **Symptom**: Payments failing unexpectedly
- **Solution**: Check API keys and permissions

### Debugging Tips
- Enable detailed logging for payment services
- Check database connections and constraints
- Verify environment variables are set correctly
- Monitor webhook delivery status in external services

### Monitoring
- Set up alerts for failed payments
- Monitor transaction volumes and success rates
- Track user wallet balances and activities
- Log all payment-related events for auditing

## Best Practices

### For Developers
- Always validate input parameters before processing payments
- Implement proper error handling for all payment flows
- Use environment-specific configurations for testing
- Maintain detailed logs for troubleshooting

### For Operations
- Regularly rotate API keys and secrets
- Monitor payment processing metrics
- Keep dependencies updated for security patches
- Perform regular backups of payment data

## Support

For technical support or questions about the payment system:
- Check the [FAQ](#faq) section
- Review the [troubleshooting](#troubleshooting) guide
- Contact the development team at [support@fingermobile.com](mailto:support@fingermobile.com)
- Submit issues on our [GitHub repository](https://github.com/fingermobile/protocol/issues)

---

This documentation covers the core aspects of the FingerMobile Protocol payment system. For additional information, refer to the code comments and inline documentation in the source files.