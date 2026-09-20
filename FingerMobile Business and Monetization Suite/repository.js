"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repository = void 0;
const database_js_1 = require("./database.js");
const toBool = (value) => Boolean(value);
exports.repository = {
    getUser() {
        const row = database_js_1.db.prepare('SELECT * FROM users LIMIT 1').get();
        return {
            id: String(row.id),
            fullName: String(row.full_name),
            email: String(row.email),
            role: row.role,
            age: Number(row.age),
            countryCode: String(row.country_code),
            accountAgeDays: Number(row.account_age_days),
            createdAt: String(row.created_at),
        };
    },
    getSeshatPage() {
        const row = database_js_1.db.prepare('SELECT * FROM seshat_pages LIMIT 1').get();
        return {
            id: String(row.id),
            ownerUserId: String(row.owner_user_id),
            name: String(row.name),
            description: row.description ? String(row.description) : undefined,
            followersCount: Number(row.followers_count),
            visibility: row.visibility,
            freeUntil: String(row.free_until),
            billingPlan: row.billing_plan,
            verifiedBusiness: toBool(Number(row.verified_business)),
            createdAt: String(row.created_at),
        };
    },
    getContentMetrics() {
        const row = database_js_1.db.prepare('SELECT * FROM content_metrics LIMIT 1').get();
        return {
            id: String(row.id),
            seshatPageId: String(row.seshat_page_id),
            watchMinutes60d: Number(row.watch_minutes_60d),
            watchMinutes30d: Number(row.watch_minutes_30d),
            postEngagement30d: Number(row.post_engagement_30d),
            returningViewers30d: Number(row.returning_viewers_30d),
            uniqueViews30d: Number(row.unique_views_30d),
            activeVideos: Number(row.active_videos),
            consecutiveFollowerDays: Number(row.consecutive_follower_days),
            originalContentScore: Number(row.original_content_score),
            policyViolations: Number(row.policy_violations),
            giftPurchaseEligible: toBool(Number(row.gift_purchase_eligible)),
            updatedAt: String(row.updated_at),
        };
    },
    createContentMetrics(input) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        database_js_1.db.prepare(`
      INSERT INTO content_metrics (
        id, seshat_page_id, watch_minutes_60d, watch_minutes_30d, post_engagement_30d,
        returning_viewers_30d, unique_views_30d, active_videos, consecutive_follower_days,
        original_content_score, policy_violations, gift_purchase_eligible, updated_at
      )
      VALUES (
        @id, @seshatPageId, @watchMinutes60d, @watchMinutes30d, @postEngagement30d,
        @returningViewers30d, @uniqueViews30d, @activeVideos, @consecutiveFollowerDays,
        @originalContentScore, @policyViolations, @giftPurchaseEligible, @updatedAt
      )
    `).run({
            ...input,
            id,
            updatedAt: new Date().toISOString()
        });
        return id;
    },
    updateContentMetrics(input) {
        database_js_1.db.prepare(`
      UPDATE content_metrics
      SET
        watch_minutes_60d = COALESCE(@watchMinutes60d, watch_minutes_60d),
        watch_minutes_30d = COALESCE(@watchMinutes30d, watch_minutes_30d),
        post_engagement_30d = COALESCE(@postEngagement30d, post_engagement_30d),
        returning_viewers_30d = COALESCE(@returningViewers30d, returning_viewers_30d),
        unique_views_30d = COALESCE(@uniqueViews30d, unique_views_30d),
        active_videos = COALESCE(@activeVideos, active_videos),
        consecutive_follower_days = COALESCE(@consecutiveFollowerDays, consecutive_follower_days),
        original_content_score = COALESCE(@originalContentScore, original_content_score),
        policy_violations = COALESCE(@policyViolations, policy_violations),
        gift_purchase_eligible = COALESCE(@giftPurchaseEligible, gift_purchase_eligible),
        updated_at = @updatedAt
      WHERE id = @id
    `).run({
            ...input,
            updatedAt: new Date().toISOString()
        });
    },
    createBusinessVerification(input) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        database_js_1.db.prepare(`
      INSERT INTO business_verifications (
        id, user_id, legal_name, registration_number, country_code, review_status, submitted_at
      )
      VALUES (@id, @userId, @legalName, @registrationNumber, @countryCode, @reviewStatus, @submittedAt)
    `).run({
            ...input,
            id
        });
        return id;
    },
    getMonetizationApplication(id) {
        const row = database_js_1.db.prepare('SELECT * FROM monetization_applications WHERE id = ? LIMIT 1').get(id);
        if (!row) {
            return null;
        }
        return {
            id: String(row.id),
            seshatPageId: String(row.seshat_page_id),
            productKey: row.product_key,
            status: row.status,
            submittedAt: String(row.submitted_at),
            decisionNotes: row.decision_notes ? String(row.decision_notes) : undefined,
        };
    },
    createMonetizationApplication(input) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        database_js_1.db.prepare(`
      INSERT INTO monetization_applications (
        id, seshat_page_id, product_key, status, submitted_at, decision_notes
      )
      VALUES (@id, @seshatPageId, @productKey, @status, @submittedAt, @decisionNotes)
    `).run({
            ...input,
            id,
            submittedAt: new Date().toISOString(),
            decisionNotes: input.decisionNotes || null
        });
        return id;
    },
    updateMonetizationApplication(input) {
        database_js_1.db.prepare(`
      UPDATE monetization_applications
      SET
        product_key = COALESCE(@productKey, product_key),
        status = COALESCE(@status, status),
        decision_notes = COALESCE(@decisionNotes, decision_notes)
      WHERE id = @id
    `).run(input);
    },
    getRevenueLedgerEntry(id) {
        const row = database_js_1.db.prepare('SELECT * FROM revenue_ledger WHERE id = ? LIMIT 1').get(id);
        if (!row) {
            return null;
        }
        return {
            id: String(row.id),
            seshatPageId: String(row.seshat_page_id),
            productKey: row.product_key,
            grossAmount: Number(row.gross_amount),
            platformFee: Number(row.platform_fee),
            reserveAmount: Number(row.reserve_amount),
            taxAmount: Number(row.tax_amount),
            netAmount: Number(row.net_amount),
            settlementStatus: row.settlement_status,
            occurredAt: String(row.occurred_at),
        };
    },
    createRevenueLedgerEntry(input) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        database_js_1.db.prepare(`
      INSERT INTO revenue_ledger (
        id, seshat_page_id, product_key, gross_amount, platform_fee, reserve_amount, tax_amount, net_amount, settlement_status, occurred_at
      )
      VALUES (@id, @seshatPageId, @productKey, @grossAmount, @platformFee, @reserveAmount, @taxAmount, @netAmount, @settlementStatus, @occurredAt)
    `).run({
            ...input,
            id,
            occurredAt: new Date().toISOString()
        });
        return id;
    },
    updateRevenueLedgerEntry(input) {
        database_js_1.db.prepare(`
      UPDATE revenue_ledger
      SET
        product_key = COALESCE(@productKey, product_key),
        gross_amount = COALESCE(@grossAmount, gross_amount),
        platform_fee = COALESCE(@platformFee, platform_fee),
        reserve_amount = COALESCE(@reserveAmount, reserve_amount),
        tax_amount = COALESCE(@taxAmount, tax_amount),
        net_amount = COALESCE(@netAmount, net_amount),
        settlement_status = COALESCE(@settlementStatus, settlement_status)
      WHERE id = @id
    `).run(input);
    },
    createPayout(input) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        database_js_1.db.prepare(`
      INSERT INTO payouts (
        id, seshat_page_id, payout_account_id, amount, status, scheduled_for, paid_at, hold_reason
      )
      VALUES (@id, @seshatPageId, @payoutAccountId, @amount, @status, @scheduledFor, @paidAt, @holdReason)
    `).run({
            ...input,
            id,
            paidAt: input.paidAt || null,
            holdReason: input.holdReason || null
        });
        return id;
    },
    createPayoutAccount(input) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        database_js_1.db.prepare(`
      INSERT INTO payout_accounts (
        id, user_id, bank_name, account_last4, currency, verified, created_at
      )
      VALUES (@id, @userId, @bankName, @accountLast4, @currency, @verified, @createdAt)
    `).run({
            ...input,
            id,
            verified: 0,
            createdAt: new Date().toISOString()
        });
        return id;
    },
    createPlatformConfig(input) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        database_js_1.db.prepare(`
      INSERT INTO platform_config (
        id, minimum_age, minimum_payout_threshold, seshat_monthly_fee, seshat_yearly_fee, revenue_share_percentage,
        gifts_cash_value, supported_countries, policy_version, affiliate_bonus_percentage
      )
      VALUES (@id, @minimumAge, @minimumPayoutThreshold, @seshatMonthlyFee, @seshatYearlyFee, @revenueSharePercentage,
              @giftsCashValue, @supportedCountriesJson, @policyVersion, @affiliateBonusPercentage)
    `).run({
            ...input,
            id,
            supportedCountriesJson: JSON.stringify(input.supportedCountries)
        });
        return id;
    },
    updatePlatformConfig(input) {
        database_js_1.db.prepare(`
      UPDATE platform_config
      SET
        minimum_age = COALESCE(@minimumAge, minimum_age),
        minimum_payout_threshold = COALESCE(@minimumPayoutThreshold, minimum_payout_threshold),
        seshat_monthly_fee = COALESCE(@seshatMonthlyFee, seshat_monthly_fee),
        seshat_yearly_fee = COALESCE(@seshatYearlyFee, seshat_yearly_fee),
        revenue_share_percentage = COALESCE(@revenueSharePercentage, revenue_share_percentage),
        gifts_cash_value = COALESCE(@giftsCashValue, gifts_cash_value),
        supported_countries = COALESCE(@supportedCountriesJson, supported_countries),
        policy_version = COALESCE(@policyVersion, policy_version),
        affiliate_bonus_percentage = COALESCE(@affiliateBonusPercentage, affiliate_bonus_percentage)
      WHERE id = @id
    `).run({
            ...input,
            id: '1', // Assuming a single config record
            supportedCountriesJson: input.supportedCountries ? JSON.stringify(input.supportedCountries) : undefined
        });
    },
    createAffiliateEvent(input) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        database_js_1.db.prepare(`
      INSERT INTO affiliate_events (
        id, seshat_page_id, partner_name, clicks, conversions, commission_amount, attribution_window_days, recorded_at
      )
      VALUES (@id, @seshatPageId, @partnerName, @clicks, @conversions, @commissionAmount, @attributionWindowDays, @recordedAt)
    `).run({
            ...input,
            id,
            recordedAt: new Date().toISOString()
        });
        return id;
    },
    updateAffiliateEvent(input) {
        database_js_1.db.prepare(`
      UPDATE affiliate_events
      SET
        partner_name = COALESCE(@partnerName, partner_name),
        clicks = COALESCE(@clicks, clicks),
        conversions = COALESCE(@conversions, conversions),
        commission_amount = COALESCE(@commissionAmount, commission_amount),
        attribution_window_days = COALESCE(@attributionWindowDays, attribution_window_days)
      WHERE id = @id
    `).run(input);
    },
    updateWebhookEvent(input) {
        database_js_1.db.prepare(`
      UPDATE webhook_events
      SET
        event_type = COALESCE(@eventType, event_type),
        payload_json = COALESCE(@payloadJson, payload_json),
        status = COALESCE(@status, status)
      WHERE id = @id
    `).run(input);
    },
    updateAuditLog(input) {
        database_js_1.db.prepare(`
      UPDATE audit_logs
      SET
        actor_id = COALESCE(@actorId, actor_id),
        action = COALESCE(@action, action),
        target_type = COALESCE(@targetType, target_type),
        target_id = COALESCE(@targetId, target_id),
        metadata_json = COALESCE(@metadataJson, metadata_json)
      WHERE id = @id
    `).run(input);
    },
    getBusinessVerification() {
        const row = database_js_1.db
            .prepare('SELECT * FROM business_verifications LIMIT 1')
            .get();
        if (!row) {
            return null;
        }
        return {
            id: String(row.id),
            userId: String(row.user_id),
            legalName: String(row.legal_name),
            registrationNumber: String(row.registration_number),
            countryCode: String(row.country_code),
            reviewStatus: row.review_status,
            submittedAt: String(row.submitted_at),
        };
    },
    getPayoutAccount() {
        const row = database_js_1.db
            .prepare('SELECT * FROM payout_accounts LIMIT 1')
            .get();
        if (!row) {
            return null;
        }
        return {
            id: String(row.id),
            userId: String(row.user_id),
            bankName: String(row.bank_name),
            accountLast4: String(row.account_last4),
            currency: String(row.currency),
            verified: toBool(Number(row.verified)),
            createdAt: String(row.created_at),
        };
    },
    getPlatformConfig() {
        const row = database_js_1.db.prepare('SELECT * FROM platform_config LIMIT 1').get();
        // Parse supported_countries - could be JSON array or comma-separated string
        const supportedCountriesRaw = String(row.supported_countries);
        let supportedCountries;
        try {
            // Try parsing as JSON first
            supportedCountries = JSON.parse(supportedCountriesRaw);
        }
        catch {
            // Fall back to comma-separated string
            supportedCountries = supportedCountriesRaw.split(',').map(s => s.trim());
        }
        return {
            id: String(row.id),
            minimumAge: Number(row.minimum_age),
            minimumPayoutThreshold: Number(row.minimum_payout_threshold),
            seshatMonthlyFee: Number(row.seshat_monthly_fee),
            seshatYearlyFee: Number(row.seshat_yearly_fee),
            revenueSharePercentage: Number(row.revenue_share_percentage),
            giftsCashValue: Number(row.gifts_cash_value),
            supportedCountries,
            policyVersion: String(row.policy_version),
            affiliateBonusPercentage: Number(row.affiliate_bonus_percentage),
        };
    },
    getApplications() {
        const rows = database_js_1.db
            .prepare('SELECT * FROM monetization_applications ORDER BY submitted_at DESC')
            .all();
        return rows.map((row) => ({
            id: String(row.id),
            seshatPageId: String(row.seshat_page_id),
            productKey: row.product_key,
            status: row.status,
            submittedAt: String(row.submitted_at),
            decisionNotes: String(row.decision_notes),
        }));
    },
    getRevenueLedger() {
        const rows = database_js_1.db
            .prepare('SELECT * FROM revenue_ledger ORDER BY occurred_at DESC')
            .all();
        return rows.map((row) => ({
            id: String(row.id),
            seshatPageId: String(row.seshat_page_id),
            productKey: row.product_key,
            grossAmount: Number(row.gross_amount),
            platformFee: Number(row.platform_fee),
            reserveAmount: Number(row.reserve_amount),
            taxAmount: Number(row.tax_amount),
            netAmount: Number(row.net_amount),
            settlementStatus: row.settlement_status,
            occurredAt: String(row.occurred_at),
        }));
    },
    getPayouts() {
        const rows = database_js_1.db
            .prepare('SELECT * FROM payouts ORDER BY scheduled_for DESC')
            .all();
        return rows.map((row) => ({
            id: String(row.id),
            seshatPageId: String(row.seshat_page_id),
            payoutAccountId: String(row.payout_account_id),
            amount: Number(row.amount),
            status: row.status,
            scheduledFor: String(row.scheduled_for),
            paidAt: row.paid_at ? String(row.paid_at) : null,
            holdReason: String(row.hold_reason),
        }));
    },
    getAffiliateEvents() {
        const rows = database_js_1.db
            .prepare('SELECT * FROM affiliate_events ORDER BY recorded_at DESC')
            .all();
        return rows.map((row) => ({
            id: String(row.id),
            seshatPageId: String(row.seshat_page_id),
            partnerName: String(row.partner_name),
            clicks: Number(row.clicks),
            conversions: Number(row.conversions),
            commissionAmount: Number(row.commission_amount),
            attributionWindowDays: Number(row.attribution_window_days),
            recordedAt: String(row.recorded_at),
        }));
    },
    getWebhookEvents() {
        const rows = database_js_1.db
            .prepare('SELECT * FROM webhook_events ORDER BY received_at DESC')
            .all();
        return rows.map((row) => ({
            id: String(row.id),
            eventType: String(row.event_type),
            payloadJson: String(row.payload_json),
            status: row.status,
            receivedAt: String(row.received_at),
        }));
    },
    getAuditLogs() {
        const rows = database_js_1.db
            .prepare('SELECT * FROM audit_logs ORDER BY created_at DESC')
            .all();
        return rows.map((row) => ({
            id: String(row.id),
            actorId: String(row.actor_id),
            action: String(row.action),
            targetType: String(row.target_type),
            targetId: String(row.target_id),
            metadataJson: String(row.metadata_json),
            createdAt: String(row.created_at),
        }));
    },
    createSeshatPage(input) {
        database_js_1.db.prepare(`
      INSERT INTO seshat_pages (id, owner_user_id, name, description, followers_count, visibility, free_until, billing_plan, verified_business, created_at)
      VALUES (@id, @ownerUserId, @name, @description, 0, @visibility, @freeUntil, 'free_trial', 0, @createdAt)
    `).run(input);
    },
    updateSeshatPage(input) {
        database_js_1.db.prepare(`
      UPDATE seshat_pages
      SET name = @name, description = @description, visibility = @visibility, billing_plan = @billingPlan
      WHERE id = @id
    `).run(input);
    },
    updateBusinessVerification(input) {
        database_js_1.db.prepare(`
      INSERT INTO business_verifications (id, user_id, legal_name, registration_number, country_code, review_status, submitted_at)
      VALUES (@id, @userId, @legalName, @registrationNumber, @countryCode, @reviewStatus, @submittedAt)
      ON CONFLICT(id) DO UPDATE SET
        legal_name = excluded.legal_name,
        registration_number = excluded.registration_number,
        country_code = excluded.country_code,
        review_status = excluded.review_status,
        submitted_at = excluded.submitted_at
    `).run(input);
    },
    updatePayoutAccount(input) {
        database_js_1.db.prepare(`
      INSERT INTO payout_accounts (id, user_id, bank_name, account_last4, currency, verified, created_at)
      VALUES (@id, @userId, @bankName, @accountLast4, @currency, @verified, @createdAt)
      ON CONFLICT(id) DO UPDATE SET
        bank_name = excluded.bank_name,
        account_last4 = excluded.account_last4,
        currency = excluded.currency,
        verified = excluded.verified
    `).run(input);
    },
    updateConfig(input) {
        database_js_1.db.prepare(`
      UPDATE platform_config
      SET minimum_age = @minimumAge,
          minimum_payout_threshold = @minimumPayoutThreshold,
          seshat_monthly_fee = @seshatMonthlyFee,
          seshat_yearly_fee = @seshatYearlyFee,
          revenue_share_percentage = @revenueSharePercentage,
          gifts_cash_value = @giftsCashValue,
          supported_countries = @supportedCountriesJson,
          policy_version = @policyVersion,
          affiliate_bonus_percentage = @affiliateBonusPercentage,
          updated_at = @updatedAt
      WHERE id = @id
    `).run(input);
    },
    addApplication(input) {
        database_js_1.db.prepare(`
      INSERT INTO monetization_applications (id, seshat_page_id, product_key, status, submitted_at, decision_notes)
      VALUES (@id, @seshatPageId, @productKey, @status, @submittedAt, @decisionNotes)
    `).run(input);
    },
    addWebhookEvent(input) {
        database_js_1.db.prepare(`
      INSERT INTO webhook_events (id, event_type, payload_json, status, received_at)
      VALUES (@id, @eventType, @payloadJson, @status, @receivedAt)
    `).run(input);
    },
    addAuditLog(input) {
        database_js_1.db.prepare(`
      INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, metadata_json, created_at)
      VALUES (@id, @actorId, @action, @targetType, @targetId, @metadataJson, @createdAt)
    `).run(input);
    },
};
