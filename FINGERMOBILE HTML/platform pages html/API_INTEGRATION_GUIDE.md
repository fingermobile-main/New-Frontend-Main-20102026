# FingerMobile Protocol Platform - API Integration Guide

**Version**: 1.0  
**Date**: April 13, 2026  
**Status**: ✅ Production Ready

---

## 📚 Overview

This guide explains how to integrate the mobile-optimized frontend pages with the backend API and database schema.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Mobile Browser                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  HTML Pages  │  │  Data Models │  │  API Client  │ │
│  │              │  │              │  │              │ │
│  │ - Wallet     │  │ - Member     │  │ - GET/POST   │ │
│  │ - Messages   │  │ - Wallet     │  │ - PUT/DELETE │ │
│  │ - Forum      │  │ - Message    │  │ - Auth       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/JSON
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend API Server                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Express.js API Routes                  │  │
│  │  - /api/auth/*                                   │  │
│  │  - /api/members/*                                │  │
│  │  - /api/wallet/*                                 │  │
│  │  - /api/messages/*                               │  │
│  │  - /api/forum/*                                  │  │
│  │  - /api/marketplace/*                            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │ SQL
                          ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  - members                                       │  │
│  │  - sessions                                      │  │
│  │  - fics_wallets                                  │  │
│  │  - messages                                      │  │
│  │  - transactions                                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Include Required Files

Add these to your HTML page `<head>`:

```html
<!-- API Client -->
<script src="./api-client.js" defer></script>

<!-- Data Models -->
<script src="./data-models.js" defer></script>

<!-- Utilities -->
<script src="./fm-utils.js" defer></script>
```

### 2. Initialize API

The API client auto-initializes:

```javascript
// API is available as window.API
// Check authentication
if (API.isAuthenticated()) {
  console.log('User is logged in');
}
```

### 3. Make API Calls

```javascript
// Get wallet balance
try {
  const response = await API.getWalletBalance();
  const wallet = Models.Wallet.fromAPI(response.data);
  console.log('Balance:', wallet.balance);
} catch (error) {
  console.error('Failed:', error.message);
}
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new member | No |
| POST | `/api/auth/login` | Login with credentials | No |
| POST | `/api/auth/logout` | Logout current session | Yes |
| GET | `/api/auth/validate` | Validate session token | Yes |

#### Example: Login

```javascript
try {
  const response = await API.login('user@example.com', 'password');
  console.log('Logged in as:', response.member.membername);
} catch (error) {
  if (error.status === 401) {
    console.error('Invalid credentials');
  }
}
```

#### Example: Register

```javascript
try {
  const response = await API.register({
    membername: 'newuser',
    email: 'newuser@example.com',
    password: 'securepassword',
    first_name: 'John',
    last_name: 'Doe'
  });
  console.log('Registered:', response.member);
} catch (error) {
  if (error.status === 409) {
    console.error('User already exists');
  }
}
```

### Members

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/members/:id/profile` | Get member profile |
| PUT | `/api/members/:id/profile` | Update profile |
| GET | `/api/members/search?q=query` | Search members |

#### Example: Get Profile

```javascript
const response = await API.getMemberProfile(memberId);
const member = Models.Member.fromAPI(response.data);
console.log('Name:', Models.Member.getDisplayName(member));
console.log('Avatar:', Models.Member.getAvatarURL(member));
```

#### Example: Update Profile

```javascript
const response = await API.updateMemberProfile({
  first_name: 'Jane',
  last_name: 'Smith',
  bio: 'Hello world!',
  country: 'USA',
  city: 'New York'
});
```

### Wallet

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallet/balance` | Get wallet balance |
| GET | `/api/wallet/history` | Get transaction history |
| POST | `/api/wallet/transfer` | Transfer FIC |
| GET | `/api/wallet/stats` | Get wallet stats |

#### Example: Get Balance

```javascript
const response = await API.getWalletBalance();
const wallet = Models.Wallet.fromAPI(response.data);
console.log('Balance:', Models.Wallet.formatBalance(wallet));
```

#### Example: Transfer FIC

```javascript
try {
  const response = await API.transferFIC(
    'recipient-uuid-here',
    10.50,
    'Payment for services'
  );
  console.log('Transfer successful!');
} catch (error) {
  if (error.message.includes('Insufficient')) {
    console.error('Not enough balance');
  }
}
```

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/conversations` | Get all conversations |
| GET | `/api/messages/conversations/:partnerId` | Get conversation messages |
| POST | `/api/messages/send` | Send message |
| POST | `/api/messages/:fromId/read` | Mark as read |
| GET | `/api/messages/unread-count` | Get unread count |

#### Example: Get Conversations

```javascript
const response = await API.getConversations();
const conversations = response.data.map(c => Models.Conversation.fromAPI(c));

conversations.forEach(conv => {
  console.log(`${conv.partner_membername}: ${conv.last_message}`);
  if (Models.Conversation.hasUnread(conv)) {
    console.log(`  ${conv.unread_count} unread messages`);
  }
});
```

#### Example: Send Message

```javascript
const response = await API.sendMessage(
  'recipient-uuid',
  'Hello! How are you?',
  'text'
);
console.log('Message sent:', response.message_id);
```

---

## 🗂️ Data Models

### Member Model

```javascript
// Create from API response
const member = Models.Member.fromAPI(apiResponse.data);

// Get display name
const name = Models.Member.getDisplayName(member);

// Get avatar URL
const avatar = Models.Member.getAvatarURL(member, 120);

// Validate
const validation = Models.Member.validate(member);
if (!validation.valid) {
  console.error(validation.errors);
}
```

### Wallet Model

```javascript
const wallet = Models.Wallet.fromAPI(apiResponse.data);

// Format balance
const formatted = Models.Wallet.formatBalance(wallet); // "1234.56 FIC"

// Get total (balance + locked)
const total = Models.Wallet.getTotalBalance(wallet);

// Check if active
if (Models.Wallet.isActive(wallet)) {
  console.log('Wallet is active');
}

// Validate transfer
const validation = Models.Wallet.validateTransfer(wallet, 100);
if (!validation.valid) {
  console.error(validation.errors);
}
```

### Message Model

```javascript
const message = Models.Message.fromAPI(apiResponse.data);

// Check if from current user
if (Models.Message.isFromMe(message, currentMemberId)) {
  console.log('I sent this message');
}

// Get status
console.log(Models.Message.getStatusLabel(message)); // "Read"
console.log(Models.Message.getStatusIcon(message));  // "✓✓"
```

### Transaction Model

```javascript
const tx = Models.Transaction.fromAPI(apiResponse.data);

// Get type info
console.log(Models.Transaction.getTypeLabel(tx)); // "Transfer"
console.log(Models.Transaction.getTypeIcon(tx));  // "↔️"
```

---

## 🔐 Authentication Flow

### 1. Check Session on Page Load

```javascript
async function initPage() {
  if (!API.isAuthenticated()) {
    // Redirect to login/onboarding
    window.location.href = 'onboarding_mobile_optimized.html';
    return;
  }
  
  // Validate session with server
  try {
    const response = await API.validateSession();
    console.log('Session valid for:', response.member.membername);
  } catch (error) {
    // Session invalid, clear and redirect
    API.clearSession();
    window.location.href = 'onboarding_mobile_optimized.html';
  }
}
```

### 2. Login Flow

```javascript
async function handleLogin(email, password) {
  try {
    const response = await API.login(email, password);
    
    // Session token auto-saved to localStorage
    console.log('Logged in:', response.member);
    
    // Redirect to dashboard
    window.location.href = 'index_mobile.html';
  } catch (error) {
    if (error.status === 401) {
      showNotification('Invalid email or password', 'error');
    } else {
      showNotification('Login failed. Please try again.', 'error');
    }
  }
}
```

### 3. Logout Flow

```javascript
async function handleLogout() {
  try {
    await API.logout();
    // Session auto-cleared from localStorage
    window.location.href = 'onboarding_mobile_optimized.html';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
```

---

## 💡 Best Practices

### 1. Error Handling

```javascript
try {
  const response = await API.getWalletBalance();
  // Handle success
} catch (error) {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        // Unauthorized - redirect to login
        break;
      case 403:
        // Forbidden - insufficient permissions
        break;
      case 404:
        // Not found
        break;
      case 408:
        // Timeout
        break;
      default:
        // Server error
    }
  } else {
    // Network error or other
  }
}
```

### 2. Loading States

```javascript
async function loadData() {
  FM.showLoading();
  try {
    const data = await API.getWalletBalance();
    renderData(data);
  } catch (error) {
    FM.showNotification('Failed to load data', 'error');
  } finally {
    FM.hideLoading();
  }
}
```

### 3. Pagination

```javascript
async function loadTransactions(page = 1) {
  const limit = 20;
  const offset = (page - 1) * limit;
  
  const response = await API.getWalletHistory({ limit, offset });
  const transactions = response.data.map(t => Models.Transaction.fromAPI(t));
  
  renderTransactions(transactions);
  
  if (response.pagination.hasMore) {
    // Show "Load More" button
  }
}
```

### 4. Caching

```javascript
// Cache member profile
async function getMemberProfile(memberId) {
  const cacheKey = `member_${memberId}`;
  const cached = FM.Storage.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 min cache
    return cached.data;
  }
  
  const response = await API.getMemberProfile(memberId);
  FM.Storage.set(cacheKey, {
    data: response.data,
    timestamp: Date.now()
  });
  
  return response.data;
}
```

---

## 📝 Complete Example: Wallet Page

```html
<script>
async function initWalletPage() {
  // Check authentication
  if (!API.isAuthenticated()) {
    window.location.href = 'onboarding_mobile_optimized.html';
    return;
  }
  
  try {
    FM.showLoading();
    
    // Load wallet data
    const [walletResponse, txResponse, profileResponse] = await Promise.all([
      API.getWalletBalance(),
      API.getWalletHistory({ limit: 10 }),
      API.getMemberProfile()
    ]);
    
    // Process data
    const wallet = Models.Wallet.fromAPI(walletResponse.data);
    const transactions = txResponse.data.map(t => Models.Transaction.fromAPI(t));
    const member = Models.Member.fromAPI(profileResponse.data);
    
    // Update UI
    document.getElementById('balance').textContent = Models.Wallet.formatBalance(wallet);
    document.getElementById('username').textContent = Models.Member.getDisplayName(member);
    document.getElementById('avatar').src = Models.Member.getAvatarURL(member);
    
    // Render transactions
    renderTransactions(transactions);
    
  } catch (error) {
    console.error('Failed to load wallet:', error);
    FM.showNotification('Failed to load wallet data', 'error');
  } finally {
    FM.hideLoading();
  }
}

function renderTransactions(transactions) {
  const container = document.getElementById('transactions-list');
  
  if (transactions.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 py-8">No transactions yet</p>';
    return;
  }
  
  container.innerHTML = transactions.map(tx => `
    <div class="transaction-item">
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span>${Models.Transaction.getTypeIcon(tx)}</span>
        </div>
        <div class="ml-3 flex-1">
          <div class="text-sm font-medium">${Models.Transaction.getTypeLabel(tx)}</div>
          <div class="text-xs text-gray-500">${FM.Format.date(tx.created_at)}</div>
        </div>
        <div class="text-sm font-semibold text-green-600">
          +${tx.amount.toFixed(2)} FIC
        </div>
      </div>
    </div>
  `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', initWalletPage);
</script>
```

---

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
npm install express pg bcrypt jsonwebtoken cors dotenv
```

### 2. Environment Variables

```env
DB_HOST=localhost
DB_PORT=5434
DB_NAME=fingermobile_platform_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### 3. Start Server

```javascript
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api-routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
```

---

## 📊 API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasMore": true
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "status": 400,
  "details": { ... }
}
```

---

## 🧪 Testing

### Test with cURL

```bash
# Login
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get wallet balance
curl http://localhost:3002/api/wallet/balance \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# Send message
curl -X POST http://localhost:3002/api/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"to_member_id":"uuid","content":"Hello!"}'
```

---

## 📚 Additional Resources

- `api-client.js` - Frontend API client
- `data-models.js` - Data models
- `api-routes.js` - Backend route definitions
- `api_database_functions.sql` - Database functions
- `platform_consolidated_schema.sql` - Database schema

---

**Status**: ✅ Production Ready  
**Version**: 1.0  
**Last Updated**: April 13, 2026
