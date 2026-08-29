import { db } from './database.js'
import type {
  AffiliateEvent,
  AuditLog,
  BusinessVerification,
  HallmarkPage,
  MonetizationApplication,
  Payout,
  PayoutAccount,
  PlatformConfig,
  RevenueLedgerEntry,
  User,
  WebhookEvent,
  ContentMetrics,
} from './types.js'

const toBool = (value: number) => Boolean(value)

export const repository = {
  getUser(): User {
    const row = db.prepare('SELECT * FROM users LIMIT 1').get() as Record<
      string,
      unknown
    >

    return {
      id: String(row.id),
      fullName: String(row.full_name),
      email: String(row.email),
      role: row.role as User['role'],
      age: Number(row.age),
      countryCode: String(row.country_code),
      accountAgeDays: Number(row.account_age_days),
      createdAt: String(row.created_at),
    }
  },
  getHallmarkPage(): HallmarkPage {
    const row = db.prepare('SELECT * FROM hallmark_pages LIMIT 1').get() as Record<
      string,
      unknown
    >

    return {
      id: String(row.id),
      ownerUserId: String(row.owner_user_id),
      name: String(row.name),
      description: String(row.description),
      followersCount: Number(row.followers_count),
      visibility: row.visibility as HallmarkPage['visibility'],
      freeUntil: String(row.free_until),
      billingPlan: row.billing_plan as HallmarkPage['billingPlan'],
      verifiedBusiness: toBool(Number(row.verified_business)),
      createdAt: String(row.created_at),
    }
  },
  getMetrics(): ContentMetrics {
    const row = db.prepare('SELECT * FROM content_metrics LIMIT 1').get() as Record<
      string,
      unknown
    >

    return {
      id: String(row.id),
      hallmarkPageId: String(row.hallmark_page_id),
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
    }
  },
  getBusinessVerification(): BusinessVerification | null {
    const row = db
      .prepare('SELECT * FROM business_verifications LIMIT 1')
      .get() as Record<string, unknown> | undefined

    if (!row) {
      return null
    }

    return {
      id: String(row.id),
      userId: String(row.user_id),
      legalName: String(row.legal_name),
      registrationNumber: String(row.registration_number),
      countryCode: String(row.country_code),
      reviewStatus: row.review_status as BusinessVerification['reviewStatus'],
      submittedAt: String(row.submitted_at),
    }
  },
  getPayoutAccount(): PayoutAccount | null {
    const row = db
      .prepare('SELECT * FROM payout_accounts LIMIT 1')
      .get() as Record<string, unknown> | undefined

    if (!row) {
      return null
    }

    return {
      id: String(row.id),
      userId: String(row.user_id),
      bankName: String(row.bank_name),
      accountLast4: String(row.account_last4),
      currency: String(row.currency),
      verified: toBool(Number(row.verified)),
      createdAt: String(row.created_at),
    }
  },
  getPlatformConfig(): PlatformConfig {
    const row = db.prepare('SELECT * FROM platform_config LIMIT 1').get() as Record<
      string,
      unknown
    >

    return {
      id: String(row.id),
      minimumAge: Number(row.minimum_age),
      minimumPayoutThreshold: Number(row.minimum_payout_threshold),
      hallmarkMonthlyFee: Number(row.hallmark_monthly_fee),
      hallmarkYearlyFee: Number(row.hallmark_yearly_fee),
      revenueSharePercentage: Number(row.revenue_share_percentage),
      giftsCashValue: Number(row.gifts_cash_value),
      supportedCountries: JSON.parse(
        String(row.supported_countries_json),
      ) as string[],
      policyVersion: String(row.policy_version),
      affiliateBonusPercentage: Number(row.affiliate_bonus_percentage),
    }
  },
  getApplications(): MonetizationApplication[] {
    const rows = db
      .prepare('SELECT * FROM monetization_applications ORDER BY submitted_at DESC')
      .all() as Record<string, unknown>[]

    return rows.map((row) => ({
      id: String(row.id),
      hallmarkPageId: String(row.hallmark_page_id),
      productKey: row.product_key as MonetizationApplication['productKey'],
      status: row.status as MonetizationApplication['status'],
      submittedAt: String(row.submitted_at),
      decisionNotes: String(row.decision_notes),
    }))
  },
  getRevenueLedger(): RevenueLedgerEntry[] {
    const rows = db
      .prepare('SELECT * FROM revenue_ledger ORDER BY occurred_at DESC')
      .all() as Record<string, unknown>[]

    return rows.map((row) => ({
      id: String(row.id),
      hallmarkPageId: String(row.hallmark_page_id),
      productKey: row.product_key as RevenueLedgerEntry['productKey'],
      grossAmount: Number(row.gross_amount),
      platformFee: Number(row.platform_fee),
      reserveAmount: Number(row.reserve_amount),
      taxAmount: Number(row.tax_amount),
      netAmount: Number(row.net_amount),
      settlementStatus: row.settlement_status as RevenueLedgerEntry['settlementStatus'],
      occurredAt: String(row.occurred_at),
    }))
  },
  getPayouts(): Payout[] {
    const rows = db
      .prepare('SELECT * FROM payouts ORDER BY scheduled_for DESC')
      .all() as Record<string, unknown>[]

    return rows.map((row) => ({
      id: String(row.id),
      hallmarkPageId: String(row.hallmark_page_id),
      payoutAccountId: String(row.payout_account_id),
      amount: Number(row.amount),
      status: row.status as Payout['status'],
      scheduledFor: String(row.scheduled_for),
      paidAt: row.paid_at ? String(row.paid_at) : null,
      holdReason: String(row.hold_reason),
    }))
  },
  getAffiliateEvents(): AffiliateEvent[] {
    const rows = db
      .prepare('SELECT * FROM affiliate_events ORDER BY recorded_at DESC')
      .all() as Record<string, unknown>[]

    return rows.map((row) => ({
      id: String(row.id),
      hallmarkPageId: String(row.hallmark_page_id),
      partnerName: String(row.partner_name),
      clicks: Number(row.clicks),
      conversions: Number(row.conversions),
      commissionAmount: Number(row.commission_amount),
      attributionWindowDays: Number(row.attribution_window_days),
      recordedAt: String(row.recorded_at),
    }))
  },
  getWebhookEvents(): WebhookEvent[] {
    const rows = db
      .prepare('SELECT * FROM webhook_events ORDER BY received_at DESC')
      .all() as Record<string, unknown>[]

    return rows.map((row) => ({
      id: String(row.id),
      eventType: String(row.event_type),
      payloadJson: String(row.payload_json),
      status: row.status as WebhookEvent['status'],
      receivedAt: String(row.received_at),
    }))
  },
  getAuditLogs(): AuditLog[] {
    const rows = db
      .prepare('SELECT * FROM audit_logs ORDER BY created_at DESC')
      .all() as Record<string, unknown>[]

    return rows.map((row) => ({
      id: String(row.id),
      actorId: String(row.actor_id),
      action: String(row.action),
      targetType: String(row.target_type),
      targetId: String(row.target_id),
      metadataJson: String(row.metadata_json),
      createdAt: String(row.created_at),
    }))
  },
  createHallmarkPage(input: {
    id: string
    ownerUserId: string
    name: string
    description: string
    visibility: HallmarkPage['visibility']
    freeUntil: string
    createdAt: string
  }) {
    db.prepare(`
      INSERT INTO hallmark_pages (id, owner_user_id, name, description, followers_count, visibility, free_until, billing_plan, verified_business, created_at)
      VALUES (@id, @ownerUserId, @name, @description, 0, @visibility, @freeUntil, 'free_trial', 0, @createdAt)
    `).run(input)
  },
  updateHallmarkPage(input: {
    id: string
    name: string
    description: string
    visibility: HallmarkPage['visibility']
    billingPlan: HallmarkPage['billingPlan']
  }) {
    db.prepare(`
      UPDATE hallmark_pages
      SET name = @name, description = @description, visibility = @visibility, billing_plan = @billingPlan
      WHERE id = @id
    `).run(input)
  },
  updateBusinessVerification(input: {
    id: string
    userId: string
    legalName: string
    registrationNumber: string
    countryCode: string
    reviewStatus: BusinessVerification['reviewStatus']
    submittedAt: string
  }) {
    db.prepare(`
      INSERT INTO business_verifications (id, user_id, legal_name, registration_number, country_code, review_status, submitted_at)
      VALUES (@id, @userId, @legalName, @registrationNumber, @countryCode, @reviewStatus, @submittedAt)
      ON CONFLICT(id) DO UPDATE SET
        legal_name = excluded.legal_name,
        registration_number = excluded.registration_number,
        country_code = excluded.country_code,
        review_status = excluded.review_status,
        submitted_at = excluded.submitted_at
    `).run(input)
  },
  updatePayoutAccount(input: {
    id: string
    userId: string
    bankName: string
    accountLast4: string
    currency: string
    verified: number
    createdAt: string
  }) {
    db.prepare(`
      INSERT INTO payout_accounts (id, user_id, bank_name, account_last4, currency, verified, created_at)
      VALUES (@id, @userId, @bankName, @accountLast4, @currency, @verified, @createdAt)
      ON CONFLICT(id) DO UPDATE SET
        bank_name = excluded.bank_name,
        account_last4 = excluded.account_last4,
        currency = excluded.currency,
        verified = excluded.verified
    `).run(input)
  },
  updateConfig(input: {
    id: string
    minimumAge: number
    minimumPayoutThreshold: number
    hallmarkMonthlyFee: number
    hallmarkYearlyFee: number
    revenueSharePercentage: number
    giftsCashValue: number
    supportedCountriesJson: string
    policyVersion: string
    affiliateBonusPercentage: number
    updatedAt: string
  }) {
    db.prepare(`
      UPDATE platform_config
      SET minimum_age = @minimumAge,
          minimum_payout_threshold = @minimumPayoutThreshold,
          hallmark_monthly_fee = @hallmarkMonthlyFee,
          hallmark_yearly_fee = @hallmarkYearlyFee,
          revenue_share_percentage = @revenueSharePercentage,
          gifts_cash_value = @giftsCashValue,
          supported_countries_json = @supportedCountriesJson,
          policy_version = @policyVersion,
          affiliate_bonus_percentage = @affiliateBonusPercentage,
          updated_at = @updatedAt
      WHERE id = @id
    `).run(input)
  },
  addApplication(input: MonetizationApplication) {
    db.prepare(`
      INSERT INTO monetization_applications (id, hallmark_page_id, product_key, status, submitted_at, decision_notes)
      VALUES (@id, @hallmarkPageId, @productKey, @status, @submittedAt, @decisionNotes)
    `).run(input)
  },
  addWebhookEvent(input: WebhookEvent) {
    db.prepare(`
      INSERT INTO webhook_events (id, event_type, payload_json, status, received_at)
      VALUES (@id, @eventType, @payloadJson, @status, @receivedAt)
    `).run(input)
  },
  addAuditLog(input: AuditLog) {
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, metadata_json, created_at)
      VALUES (@id, @actorId, @action, @targetType, @targetId, @metadataJson, @createdAt)
    `).run(input)
  },
}
