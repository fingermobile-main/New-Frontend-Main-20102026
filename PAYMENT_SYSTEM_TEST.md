# FingerMobile Protocol - Payment System Test Cases

## Overview
This document outlines comprehensive test cases for the FingerMobile Protocol payment system, covering both Stripe (fiat) and Web3 (crypto) payment gateways.

## Test Environment Setup

### Required Environment Variables
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Web3 Configuration
WEB3_RPC_URL=https://rinkeby.infura.io/v3/YOUR_PROJECT_ID
FIC_CONTRACT_ADDRESS=0x...
PLATFORM_WALLET_PRIVATE_KEY=0x...

# Database Configuration
DATABASE_URL=postgresql://...
```

## Test Cases

### 1. Stripe Payment Integration Tests

#### 1.1 Create Payment Intent
**Test**: Create a payment intent for a user
**Endpoint**: `POST /api/payments/stripe/create-payment-intent`
**Payload**:
```json
{
  "userId": "user-123",
  "amount": 29.99,
  "currency": "usd",
  "description": "Premium subscription",
  "metadata": {
    "tier": "premium",
    "credits": "300"
  }
}
```
**Expected Response**:
```json
{
  "success": true,
  "paymentIntentId": "pi_...",
  "clientSecret": "..."
}
```

#### 1.2 Create Checkout Session
**Test**: Create a checkout session for subscription
**Endpoint**: `POST /api/payments/stripe/create-checkout-session`
**Payload**:
```json
{
  "userId": "user-123",
  "priceId": "price_premium_monthly",
  "successUrl": "https://fingermobile.com/success",
  "cancelUrl": "https://fingermobile.com/cancel",
  "metadata": {
    "tier": "premium"
  }
}
```
**Expected Response**:
```json
{
  "success": true,
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/c/pay/cs_..."
}
```

#### 1.3 Process Stripe Webhook
**Test**: Process successful payment webhook
**Endpoint**: `POST /api/payment-webhooks/stripe`
**Payload**:
```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_...",
      "amount": 2999,
      "currency": "usd",
      "metadata": {
        "userId": "user-123",
        "tier": "premium",
        "credits": "300"
      }
    }
  }
}
```
**Expected Response**:
```json
{
  "received": true
}
```

### 2. Web3/FIC Payment Integration Tests

#### 2.1 Connect Wallet
**Test**: Connect user's Web3 wallet
**Endpoint**: `POST /api/payments/crypto/connect-wallet`
**Payload**:
```json
{
  "userId": "user-123",
  "walletAddress": "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e5b6B4"
}
```
**Expected Response**:
```json
{
  "success": true,
  "message": "Wallet connected successfully"
}
```

#### 2.2 Get FIC Balance
**Test**: Get FIC token balance for an address
**Endpoint**: `GET /api/payments/crypto/balance/0x742d35Cc6634C0532925a3b8D4C0C8b3C2e5b6B4`
**Expected Response**:
```json
{
  "success": true,
  "address": "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e5b6B4",
  "balance": 150.5,
  "token": "FIC"
}
```

#### 2.3 Transfer FIC Tokens
**Test**: Transfer FIC tokens between addresses
**Endpoint**: `POST /api/payments/crypto/transfer-fic`
**Payload**:
```json
{
  "fromPrivateKey": "0x...",
  "toAddress": "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e5b6B4",
  "amount": 50,
  "userId": "user-123"
}
```
**Expected Response**:
```json
{
  "success": true,
  "transactionHash": "0x...",
  "message": "FIC transfer completed successfully"
}
```

#### 2.4 Generate New Wallet
**Test**: Generate a new Web3 wallet
**Endpoint**: `POST /api/payments/crypto/generate-wallet`
**Expected Response**:
```json
{
  "success": true,
  "address": "0x...",
  "message": "New wallet generated successfully (private key returned only once)"
}
```

### 3. Combined Payment Tests

#### 3.1 Process Tip
**Test**: Process a tip from one user to another
**Endpoint**: `POST /api/payment-webhooks/tip`
**Payload**:
```json
{
  "senderId": "user-123",
  "receiverId": "user-456",
  "amount": 10,
  "currency": "usd",
  "paymentMethod": "stripe",
  "message": "Great content!"
}
```
**Expected Response**:
```json
{
  "success": true,
  "message": "Tip processed successfully",
  "transactionId": "pi_..."
}
```

#### 3.2 Process Ad Revenue Distribution
**Test**: Distribute ad revenue to a creator
**Endpoint**: `POST /api/payment-webhooks/ad-revenue-distribution`
**Payload**:
```json
{
  "creatorId": "user-456",
  "campaignId": "camp-789",
  "contentId": "post-abc",
  "impressions": 10000,
  "cpmRate": 5.0,
  "paymentMethod": "crypto"
}
```
**Expected Response**:
```json
{
  "success": true,
  "message": "Ad revenue distributed successfully",
  "transactionId": "0x...",
  "amount": 50
}
```

#### 3.3 Process Subscription Purchase
**Test**: Process subscription purchase with different payment methods
**Endpoint**: `POST /api/payment-webhooks/subscription-purchase`
**Payload**:
```json
{
  "userId": "user-123",
  "tier": "premium",
  "amount": 29.99,
  "currency": "usd",
  "paymentMethod": "stripe",
  "durationMonths": 1
}
```
**Expected Response**:
```json
{
  "success": true,
  "message": "Subscription purchase initiated successfully",
  "transactionId": "pi_..."
}
```

### 4. Error Handling Tests

#### 4.1 Invalid Payment Method
**Test**: Attempt to use unsupported payment method
**Payload**:
```json
{
  "userId": "user-123",
  "amount": 10,
  "paymentMethod": "bitcoin_cash"  // Unsupported
}
```
**Expected Response**:
```json
{
  "error": "Invalid payment method. Use \"stripe\" or \"crypto\"."
}
```

#### 4.2 Insufficient Balance
**Test**: Attempt to transfer more tokens than available
**Expected Result**: Transaction failure with appropriate error message

#### 4.3 Invalid Wallet Address
**Test**: Attempt to connect invalid wallet address
**Expected Result**: Validation error

## Integration Tests

### 5. End-to-End Payment Flow Tests

#### 5.1 User Purchases Credits with Stripe
1. User initiates payment intent creation
2. User completes payment via Stripe
3. Webhook processes successful payment
4. Credits are added to user's account
5. Transaction is recorded in database

#### 5.2 Creator Receives Ad Revenue in Crypto
1. Ad campaign generates impressions
2. Revenue calculation based on CPM
3. Crypto payment processed to creator's wallet
4. Transaction recorded in database
5. Creator notified of payment

#### 5.3 User Sends Tip to Creator
1. User selects tip amount and payment method
2. Payment processed through selected gateway
3. Funds transferred to creator
4. Both parties notified
5. Transaction recorded

## Security Tests

### 6. Payment Security Tests

#### 6.1 Webhook Signature Verification
- Verify that all webhook endpoints validate signatures
- Test with invalid signatures to ensure rejection

#### 6.2 Private Key Security
- Ensure private keys are never exposed in logs or responses
- Verify secure storage and handling of private keys

#### 6.3 Transaction Validation
- Verify all transactions are validated before processing
- Check for double-spending prevention

## Performance Tests

### 7. Load Testing
- Test concurrent payment processing
- Measure response times under load
- Verify database connection handling
- Test webhook processing during high volume

### 8. Stress Testing
- Test maximum transaction amounts
- Verify system stability under extreme conditions
- Test fallback mechanisms

## Compliance Tests

### 9. PCI DSS Compliance
- Verify credit card data is never stored
- Confirm tokenization of payment information
- Validate encryption of sensitive data

### 10. Financial Regulations
- Ensure proper record keeping
- Verify audit trail maintenance
- Confirm compliance with local financial regulations

## Test Execution Commands

### Running Tests
```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run security tests
npm run test:security

# Run all tests
npm run test
```

### Mocking External Services
During testing, external services like Stripe and Web3 providers should be mocked to avoid actual transactions and maintain test isolation.

## Expected Outcomes

Upon successful completion of these tests:
- Stripe payments are processed correctly
- Web3/FIC transactions execute properly
- User balances are updated accurately
- Transaction records are maintained properly
- Security measures are enforced
- Error handling works as expected
- System performs well under load
- All compliance requirements are met