# Email & SMS Service Setup Guide

This guide covers setting up email and SMS services for the FingerMobile Protocol dual credential authentication system.

## Overview

The platform supports multiple email and SMS providers for sending verification codes during:
- User registration (email + phone verification)
- Password reset (phone first, then email verification)
- Two-factor authentication setup

**Verification Code Format:** 6 alphanumeric characters without hyphen (e.g., `2F4B9M`)

---

## Email Service Setup

### Option 1: SendGrid (Recommended for Development)

1. **Create Account**: Sign up at [SendGrid](https://sendgrid.com/)
2. **Get API Key**: 
   - Go to Settings → API Keys
   - Create API Key with "Full Access" or "Restricted Access" (Mail Send)
3. **Verify Sender**:
   - Go to Settings → Sender Authentication
   - Verify your domain or single sender email
4. **Configure Environment**:
   ```bash
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.your_api_key_here
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

### Option 2: AWS SES

1. **Create AWS Account**: Sign up at [AWS](https://aws.amazon.com/)
2. **Enable SES**:
   - Go to AWS Console → Simple Email Service
   - Request production access (sandbox mode limits to verified emails only)
3. **Create IAM User**:
   - Create user with `AmazonSESFullAccess` policy
   - Generate access keys
4. **Verify Domain/Email**:
   - Verify your sending domain in SES console
5. **Configure Environment**:
   ```bash
   EMAIL_PROVIDER=ses
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   SES_FROM_EMAIL=noreply@yourdomain.com
   ```

### Option 3: Mailgun

1. **Create Account**: Sign up at [Mailgun](https://www.mailgun.com/)
2. **Add Domain**:
   - Add and verify your domain
   - Configure DNS records (TXT, MX, CNAME)
3. **Get API Key**:
   - Go to Account Settings → API Keys
   - Copy your private API key
4. **Configure Environment**:
   ```bash
   EMAIL_PROVIDER=mailgun
   MAILGUN_API_KEY=your_api_key_here
   MAILGUN_DOMAIN=mg.yourdomain.com
   ```

### Option 4: Postmark

1. **Create Account**: Sign up at [Postmark](https://postmarkapp.com/)
2. **Create Server**:
   - Create a new server for transactional emails
3. **Verify Sender Signature**:
   - Add and verify your from email address
4. **Get Server Token**:
   - Go to Servers → Your Server → API Tokens
   - Copy the Server API Token
5. **Configure Environment**:
   ```bash
   EMAIL_PROVIDER=postmark
   POSTMARK_SERVER_TOKEN=your_server_token_here
   POSTMARK_FROM_EMAIL=noreply@yourdomain.com
   ```

---

## SMS Service Setup

### Option 1: Twilio (Recommended)

1. **Create Account**: Sign up at [Twilio](https://www.twilio.com/)
2. **Get Phone Number**:
   - Buy a phone number with SMS capability
   - Note the number in E.164 format (e.g., +1234567890)
3. **Get Credentials**:
   - Go to Console Dashboard
   - Copy Account SID and Auth Token
4. **Configure Environment**:
   ```bash
   SMS_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### Option 2: AWS SNS

1. **Use Existing AWS Account**: Same account as SES
2. **Request SMS Sandbox Removal** (for production):
   - Go to SNS Console → Text Messaging (SMS)
   - Request move out of sandbox
3. **IAM Permissions**:
   - Ensure IAM user has `AmazonSNSFullAccess` policy
4. **Configure Environment**:
   ```bash
   SMS_PROVIDER=sns
   # Uses same AWS credentials as SES
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   ```

---

## Database Setup

Run the migration to create verification tables:

```bash
cd apps/backend
node db/migrations/add-verification-schema.js
```

This creates:
- `verification_codes` table - Stores email/phone verification codes
- Adds columns to `users` table:
  - `email_verified` (BOOLEAN)
  - `phone_verified` (BOOLEAN)
  - `two_factor_secret` (VARCHAR)
  - `two_factor_enabled` (BOOLEAN)

---

## Testing the Setup

### 1. Start Backend Server

```bash
cd apps/backend
npm install
npm start
```

### 2. Test Registration Flow

```bash
# Register new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "SecurePass123"
  }'
```

### 3. Verify Email

```bash
curl -X POST http://localhost:3001/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "code": "2F4B9M"
  }'
```

### 4. Verify Phone

```bash
curl -X POST http://localhost:3001/api/auth/verify-phone \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "code": "A7K3MP"
  }'
```

### 5. Setup 2FA

```bash
curl -X POST http://localhost:3001/api/auth/setup-2fa \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "secret": "JBSWY3DPEHPK3PXP",
    "totpCode": "123456"
  }'
```

### 6. Login (Requires Both Email AND Phone)

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "SecurePass123"
  }'
```

---

## Security Best Practices

1. **Never commit `.env` file** - Always use `.env.example` as template
2. **Rotate API keys regularly** - Especially in production
3. **Use environment-specific keys** - Separate keys for dev/staging/prod
4. **Enable rate limiting** - Already configured in server.js
5. **Monitor usage** - Set up alerts for unusual email/SMS volumes
6. **Use HTTPS in production** - Required for secure token transmission
7. **Implement code expiration** - Codes expire after 10 minutes (configurable)
8. **One-time use codes** - Each code can only be used once

---

## Troubleshooting

### Email Not Sending

1. Check environment variables are set correctly
2. Verify sender email/domain with provider
3. Check spam folder
4. Review provider dashboard for errors
5. Ensure `EMAIL_PROVIDER` matches your configuration

### SMS Not Sending

1. Verify phone number format (E.164: +1234567890)
2. Check Twilio/AWS SNS dashboard for errors
3. Ensure you have sufficient credits/balance
4. Verify `SMS_PROVIDER` matches your configuration
5. For Twilio trial accounts, only verified numbers can receive SMS

### Database Errors

1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` connection string
3. Run migration script: `node db/migrations/add-verification-schema.js`
4. Verify database user has CREATE TABLE permissions

### Verification Code Issues

1. Codes are case-insensitive (automatically converted to uppercase)
2. Codes expire after 10 minutes
3. Each code can only be used once
4. Check `verification_codes` table for expired/used codes

---

## Production Deployment Checklist

- [ ] Use production-grade email/SMS providers
- [ ] Set up dedicated API keys for production
- [ ] Enable production mode (`NODE_ENV=production`)
- [ ] Configure proper CORS origins
- [ ] Set strong `JWT_SECRET` (minimum 32 characters)
- [ ] Enable HTTPS/TLS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all verification flows end-to-end
- [ ] Set up rate limiting appropriate for production traffic
- [ ] Document incident response procedures

---

## Support

For issues or questions:
- Check provider documentation (SendGrid, Twilio, AWS, etc.)
- Review backend logs for error messages
- Verify environment configuration
- Test with provider's dashboard/test tools

---

**Last Updated**: June 23, 2026