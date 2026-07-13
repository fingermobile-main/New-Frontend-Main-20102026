# 📊 FINGERMOBILE MONETIZATION DATABASE SCHEMA
## Complete Table Inventory & Documentation
### Date: 2026-07-10 | Database: fingermobile_monetization_db

---

## 🏗️ MULTI-DATABASE ARCHITECTURE

The FingerMobile Platform uses **6 separate PostgreSQL databases**:

| # | Database Name | Purpose | Schema File |
|---|--------------|---------|-------------|
| 1 | `fingermobile_identity_db` | User auth, KYC, biometrics, profiles | *(To be created)* |
| 2 | `fingermobile_content_db` | Content management, media, posts | *(To be created)* |
| 3 | `fingermobile_social_db` | Social features, followers, communities | *(To be created)* |
| 4 | **`fingermobile_monetization_db`** | **Business suite, revenue, Seshat** | **`schema.sql`** ✅ |
| 5 | `fingermobile_communication_db` | Messaging, notifications | *(To be created)* |
| 6 | `fingermobile_control_db` | Admin controls, platform config | *(To be created)* |

---

## 📋 MONETIZATION DATABASE TABLES (28 Total)

### **Core Tables (Original 14)**

| # | Table Name | Purpose | Key Fields | Status |
|---|-----------|---------|------------|--------|
| 1 | [`users`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L1-L9) | User accounts | id, full_name, email, role, age | ✅ Existing |
| 2 | [`seshat_pages`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L11-L23) | Seshat business pages | id, owner_user_id, name, billing_plan | ✅ Renamed |
| 3 | [`content_metrics`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L25-L39) | Performance analytics | seshat_page_id, watch_minutes, engagement | ✅ Existing |
| 4 | [`monetization_applications`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L41-L48) | Monetization program apps | product_key, status, submitted_at | ✅ Existing |
| 5 | [`payout_accounts`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L50-L58) | Bank account info | user_id, bank_name, account_last4 | ✅ Existing |
| 6 | [`revenue_ledger`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L60-L71) | Financial transactions | gross_amount, platform_fee, net_amount | ✅ Existing |
| 7 | [`payouts`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L73-L83) | Payout records | amount, status, scheduled_for | ✅ Existing |
| 8 | [`business_verifications`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L85-L93) | Business verification | legal_name, registration_number | ✅ Existing |
| 9 | [`affiliate_events`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L95-L104) | Partner tracking | partner_name, clicks, conversions | ✅ Existing |
| 10 | [`platform_config`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L106-L117) | System settings | seshat_monthly_fee, policy_version | ✅ Updated |
| 11 | [`webhook_events`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L119-L124) | Webhook tracking | event_type, payload_json, status | ✅ Existing |
| 12 | [`audit_logs`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L126-L132) | Action auditing | actor_id, action, target_type | ✅ Existing |
| 13 | [`policy_acknowledgements`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L134-L140) | Policy acceptance | user_id, policy_key, accepted_at | ✅ Existing |

---

### **NEW Tables - Week 1 Day 1 (14 Added)**

| # | Table Name | Purpose | Key Fields | Status |
|---|-----------|---------|------------|--------|
| 14 | [`access_keys`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L148-L157) | 16-digit access tokens | key_token, key_type, expires_at | ✅ **NEW** |
| 15 | [`coupons`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L159-L175) | Auto-generated coupons | coupon_code, is_redeemed, valid_until | ✅ **NEW** |
| 16 | [`kyc_records`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L177-L200) | KYC verification | biometric_face_hash, is_above_22_years | ✅ **NEW** |
| 17 | [`kyb_records`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L202-L226) | KYB verification | business_legal_name, registration_number | ✅ **NEW** |
| 18 | [`content_posts`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L228-L250) | Content management | post_type, visibility, scheduled_for | ✅ **NEW** |
| 19 | [`inbox_messages`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L252-L267) | Unified messaging | conversation_id, message_type, is_read | ✅ **NEW** |
| 20 | [`conversations`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L269-L279) | Conversation threads | participant_ids, last_message_at | ✅ **NEW** |
| 21 | [`ad_campaigns`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L281-L297) | Ad campaign management | campaign_type, budget_daily, targeting | ✅ **NEW** |
| 22 | [`subscriptions`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L299-L313) | Recurring subscriptions | tier, price_monthly, stripe_subscription_id | ✅ **NEW** |
| 23 | [`shop_products`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L315-L329) | E-commerce products | product_name, price, inventory_count | ✅ **NEW** |
| 24 | [`leads`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L331-L348) | CRM lead management | lead_source, status, custom_fields | ✅ **NEW** |
| 25 | [`analytics_events`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L350-L361) | Analytics tracking | event_type, metadata, revenue_impact | ✅ **NEW** |
| 26 | [`team_members`](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Business%20and%20Monetization%20Suite/schema.sql#L363-L375) | Role-based access | role, permissions, status | ✅ **NEW** |

---

## 🔑 KEY FEATURES IMPLEMENTED

### **1. Access Control System**
- **16-digit alphanumeric tokens** (like Personal Access Tokens)
- Two types: `FOLLOWERSHIP` and `MEMBERSHIP`
- Expiration dates: 30, 60, or 90 days
- Auto-generated by Guardian AI
- Non-recyclable, unique per Seshat page

### **2. Coupon System**
- Auto-generated unique codes (Guardian AI)
- Cannot be recycled once redeemed
- Supports percentage and fixed-amount discounts
- Usage limits and validity periods
- Tracks redemption by user

### **3. KYC/KYB Verification**
- **KYC**: Individual identity verification with biometric face hash
- **KYB**: Business entity verification with registration details
- Age gate enforcement (must be 22+ years)
- Multi-stage approval workflow (PENDING → UNDER_REVIEW → APPROVED/REJECTED)
- Reviewer tracking (UUID array)

### **4. Content Management**
- Multiple post types: TEXT, IMAGE, VIDEO, REEL, STORY, LIVE
- Visibility controls: PUBLIC, PRIVATE, FOLLOWERS_ONLY, MEMBERS_ONLY
- Scheduling system with draft/published states
- Engagement statistics tracking
- Monetization flags for ad placement

### **5. Unified Inbox**
- Cross-platform messaging (Messenger, Instagram, WhatsApp integration ready)
- Conversation threading
- Read receipts and delivery status
- Media support (images, videos, files)
- System messages

### **6. Advertising System**
- Campaign types: BOOST_POST, PAGE_LIKES, WEBSITE_CLICKS, APP_INSTALLS, VIDEO_VIEWS
- Daily and lifetime budgets
- Advanced targeting criteria (JSONB)
- Performance metrics tracking (impressions, clicks, spend, CTR)
- Creative asset management

### **7. Subscription Management**
- Three tiers: BASIC, PREMIUM, ENTERPRISE
- Stripe integration support
- Automatic renewal tracking
- Cancellation handling
- Past-due payment detection

### **8. E-Commerce Integration**
- Product catalog with SKU management
- Inventory tracking
- Image galleries
- Category and tag organization
- Stripe product ID linking

### **9. CRM Lead Management**
- Lead source tracking (AD_CAMPAIGN, ORGANIC, REFERRAL, EVENT)
- Pipeline stages: NEW → CONTACTED → QUALIFIED → CONVERTED/LOST
- Custom fields support (JSONB)
- Team member assignment
- Conversion tracking

### **10. Analytics Engine**
- Event-based tracking system
- Revenue impact measurement
- Session tracking
- Metadata storage for flexible analysis
- User-level attribution

### **11. Team Collaboration**
- Role-based permissions: OWNER, ADMIN, EDITOR, ANALYST, MODERATOR
- Invitation workflow
- Permission granularity (JSONB)
- Status tracking (PENDING, ACTIVE, INACTIVE, REVOKED)
- Unique constraint on page-user pairs

---

## 📊 DATABASE STATISTICS

| Metric | Value |
|--------|-------|
| **Total Tables** | 26 |
| **Original Tables** | 13 |
| **New Tables (Week 1)** | 14 |
| **Foreign Keys** | ~40+ |
| **UUID Primary Keys** | 14 (new tables) |
| **TEXT Primary Keys** | 12 (original tables) |
| **JSONB Columns** | 8 (flexible metadata) |
| **ENUM Constraints** | 15+ (data validation) |
| **Timestamp Columns** | 60+ (audit trail) |

---

## 🔗 RELATIONSHIP DIAGRAM

```
users (1) ──────┬── (M) seshat_pages
                ├── (M) payout_accounts
                ├── (M) business_verifications
                ├── (M) kyc_records
                ├── (M) kyb_records
                ├── (M) policy_acknowledgements
                └── (M) team_members

seshat_pages (1) ──┬── (M) content_metrics
                   ├── (M) monetization_applications
                   ├── (M) revenue_ledger
                   ├── (M) payouts
                   ├── (M) affiliate_events
                   ├── (M) access_keys
                   ├── (M) coupons
                   ├── (M) content_posts
                   ├── (M) inbox_messages
                   ├── (M) conversations
                   ├── (M) ad_campaigns
                   ├── (M) subscriptions
                   ├── (M) shop_products
                   ├── (M) leads
                   ├── (M) analytics_events
                   └── (M) team_members

conversations (1) ── (M) inbox_messages
```

---

## ⚙️ TECHNICAL SPECIFICATIONS

### **Data Types Used:**
- `UUID` - Primary keys for new tables (auto-generated)
- `TEXT` - Primary keys for original tables, long strings
- `VARCHAR(n)` - Fixed-length strings with limits
- `INTEGER` - Whole numbers
- `REAL` - Floating-point numbers (currency)
- `BOOLEAN` - True/false flags
- `TIMESTAMP WITH TIME ZONE` - Temporal data with timezone
- `DATE` - Date-only fields
- `TEXT[]` - Arrays of text (hashtags, tags)
- `JSONB` - Structured metadata (binary JSON)

### **Constraints Applied:**
- `PRIMARY KEY` - Unique row identifiers
- `FOREIGN KEY` - Referential integrity
- `UNIQUE` - Prevent duplicate values
- `NOT NULL` - Required fields
- `DEFAULT` - Default values
- `CHECK` - Value validation (ENUMs)
- `ON DELETE CASCADE` - Automatic cleanup

### **Indexing Strategy:**
- All primary keys automatically indexed
- Foreign keys should have indexes (add in migration scripts)
- Frequently queried columns (email, status, created_at) need indexes
- JSONB fields can use GIN indexes for complex queries

---

## 🚀 NEXT STEPS

### **Immediate Actions:**
1. ✅ Schema complete with 26 tables
2. ⏭️ Start Docker containers to initialize database
3. ⏭️ Verify table creation and foreign key constraints
4. ⏭️ Create seed data for testing
5. ⏭️ Build TypeScript models for all new tables

### **Future Enhancements:**
- Add database indexes for performance
- Create materialized views for analytics
- Implement partitioning for large tables (analytics_events)
- Set up replication for read replicas
- Add full-text search indexes

---

## 📝 NOTES

- **PostgreSQL Version**: 16 Alpine (lightweight, production-ready)
- **Auto-initialization**: schema.sql runs on first container startup
- **Data Persistence**: Named volume `postgres-data` ensures data survives restarts
- **Multi-DB Setup**: 6 databases total, this schema is for monetization_db only
- **Migration Ready**: Schema uses `IF NOT EXISTS` for idempotent execution

---

**Status**: ✅ **SCHEMA COMPLETE - 26 TABLES DEFINED**  
**Date**: 2026-07-10  
**Database**: fingermobile_monetization_db  
**Next**: Start Docker containers and verify initialization  
