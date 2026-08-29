import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Database from 'better-sqlite3'
import {
  DEFAULT_PAGE_ID,
  DEFAULT_PLATFORM_CONFIG,
  DEFAULT_POLICY_KEY,
  DEFAULT_USER_ID,
} from '../../shared/constants.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbFilePath = path.resolve(__dirname, '../../data/fingermobile.db')
const dbFolder = path.dirname(dbFilePath)

if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true })
}

export const db = new Database(dbFilePath)

const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')

export function initDatabase() {
  db.pragma('journal_mode = WAL')
  db.exec(schemaSql)

  const configExists = db
    .prepare('SELECT COUNT(*) as count FROM platform_config')
    .get() as { count: number }

  if (configExists.count > 0) {
    return
  }

  const now = new Date().toISOString()
  const freeUntil = new Date()
  freeUntil.setFullYear(freeUntil.getFullYear() + 2)

  const insertUser = db.prepare(`
    INSERT INTO users (id, full_name, email, role, age, country_code, account_age_days, created_at)
    VALUES (@id, @fullName, @email, @role, @age, @countryCode, @accountAgeDays, @createdAt)
  `)

  const insertHallmarkPage = db.prepare(`
    INSERT INTO hallmark_pages (id, owner_user_id, name, description, followers_count, visibility, free_until, billing_plan, verified_business, created_at)
    VALUES (@id, @ownerUserId, @name, @description, @followersCount, @visibility, @freeUntil, @billingPlan, @verifiedBusiness, @createdAt)
  `)

  const insertMetrics = db.prepare(`
    INSERT INTO content_metrics (id, hallmark_page_id, watch_minutes_60d, watch_minutes_30d, post_engagement_30d, returning_viewers_30d, unique_views_30d, active_videos, consecutive_follower_days, original_content_score, policy_violations, gift_purchase_eligible, updated_at)
    VALUES (@id, @hallmarkPageId, @watchMinutes60d, @watchMinutes30d, @postEngagement30d, @returningViewers30d, @uniqueViews30d, @activeVideos, @consecutiveFollowerDays, @originalContentScore, @policyViolations, @giftPurchaseEligible, @updatedAt)
  `)

  const transaction = db.transaction(() => {
    insertUser.run({
      id: DEFAULT_USER_ID,
      fullName: 'Ada Hall',
      email: 'ada@fingermobile.local',
      role: 'creator',
      age: 29,
      countryCode: 'US',
      accountAgeDays: 420,
      createdAt: now,
    })

    insertHallmarkPage.run({
      id: DEFAULT_PAGE_ID,
      ownerUserId: DEFAULT_USER_ID,
      name: 'Ada Creators Network',
      description:
        'A showcase HallMarks Page for monetization, affiliate commerce, and creator operations.',
      followersCount: 58240,
      visibility: 'public',
      freeUntil: freeUntil.toISOString(),
      billingPlan: 'free_trial',
      verifiedBusiness: 1,
      createdAt: now,
    })

    insertMetrics.run({
      id: 'metrics_default',
      hallmarkPageId: DEFAULT_PAGE_ID,
      watchMinutes60d: 268400,
      watchMinutes30d: 196500,
      postEngagement30d: 144500,
      returningViewers30d: 845,
      uniqueViews30d: 482000,
      activeVideos: 47,
      consecutiveFollowerDays: 160,
      originalContentScore: 92,
      policyViolations: 0,
      giftPurchaseEligible: 1,
      updatedAt: now,
    })

    db.prepare(`
      INSERT INTO business_verifications (id, user_id, legal_name, registration_number, country_code, review_status, submitted_at)
      VALUES ('verification_default', ?, 'Ada Hall Media LLC', 'US-448923', 'US', 'approved', ?)
    `).run(DEFAULT_USER_ID, now)

    db.prepare(`
      INSERT INTO payout_accounts (id, user_id, bank_name, account_last4, currency, verified, created_at)
      VALUES ('payout_default', ?, 'First Horizon Business', '2409', 'USD', 1, ?)
    `).run(DEFAULT_USER_ID, now)

    db.prepare(`
      INSERT INTO platform_config (id, minimum_age, minimum_payout_threshold, hallmark_monthly_fee, hallmark_yearly_fee, revenue_share_percentage, gifts_cash_value, supported_countries_json, policy_version, affiliate_bonus_percentage, updated_at)
      VALUES (@id, @minimumAge, @minimumPayoutThreshold, @hallmarkMonthlyFee, @hallmarkYearlyFee, @revenueSharePercentage, @giftsCashValue, @supportedCountriesJson, @policyVersion, @affiliateBonusPercentage, @updatedAt)
    `).run({
      ...DEFAULT_PLATFORM_CONFIG,
      supportedCountriesJson: JSON.stringify(
        DEFAULT_PLATFORM_CONFIG.supportedCountries,
      ),
      updatedAt: now,
    })

    db.prepare(`
      INSERT INTO monetization_applications (id, hallmark_page_id, product_key, status, submitted_at, decision_notes)
      VALUES
        ('application_ads', ?, 'in_stream_ads', 'approved', ?, 'Approved for business-safe long form inventory.'),
        ('application_gifts', ?, 'gifts', 'approved', ?, 'Gifts enabled after marketplace purchase verification.'),
        ('application_subscriptions', ?, 'subscriptions', 'submitted', ?, 'Awaiting final finance check.'),
        ('application_reels', ?, 'reels_ads', 'approved', ?, 'Reels inventory active.'),
        ('application_affiliate', ?, 'affiliate', 'approved', ?, 'Affiliate program linked to payout identity.')
    `).run(
      DEFAULT_PAGE_ID,
      now,
      DEFAULT_PAGE_ID,
      now,
      DEFAULT_PAGE_ID,
      now,
      DEFAULT_PAGE_ID,
      now,
      DEFAULT_PAGE_ID,
      now,
    )

    db.prepare(`
      INSERT INTO revenue_ledger (id, hallmark_page_id, product_key, gross_amount, platform_fee, reserve_amount, tax_amount, net_amount, settlement_status, occurred_at)
      VALUES
        ('ledger_1', ?, 'in_stream_ads', 1820.50, 546.15, 91.03, 77.20, 1106.12, 'scheduled', ?),
        ('ledger_2', ?, 'gifts', 420.00, 0.00, 10.00, 6.30, 403.70, 'paid', ?),
        ('ledger_3', ?, 'affiliate', 284.60, 14.23, 5.69, 3.12, 261.56, 'paid', ?),
        ('ledger_4', ?, 'reels_ads', 530.20, 159.06, 26.51, 18.44, 326.19, 'scheduled', ?)
    `).run(DEFAULT_PAGE_ID, now, DEFAULT_PAGE_ID, now, DEFAULT_PAGE_ID, now, DEFAULT_PAGE_ID, now)

    db.prepare(`
      INSERT INTO payouts (id, hallmark_page_id, payout_account_id, amount, status, scheduled_for, paid_at, hold_reason)
      VALUES
        ('payout_1', ?, 'payout_default', 665.26, 'scheduled', ?, NULL, ''),
        ('payout_2', ?, 'payout_default', 403.70, 'paid', ?, ?, '')
    `).run(
      DEFAULT_PAGE_ID,
      now,
      DEFAULT_PAGE_ID,
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    )

    db.prepare(`
      INSERT INTO affiliate_events (id, hallmark_page_id, partner_name, clicks, conversions, commission_amount, attribution_window_days, recorded_at)
      VALUES
        ('affiliate_1', ?, 'Amazon', 842, 64, 132.45, 7, ?),
        ('affiliate_2', ?, 'eBay', 438, 19, 48.10, 7, ?),
        ('affiliate_3', ?, 'Temu', 605, 29, 104.05, 7, ?)
    `).run(DEFAULT_PAGE_ID, now, DEFAULT_PAGE_ID, now, DEFAULT_PAGE_ID, now)

    db.prepare(`
      INSERT INTO webhook_events (id, event_type, payload_json, status, received_at)
      VALUES
        ('webhook_1', 'payout.updated', '{"payoutId":"payout_1","status":"scheduled"}', 'processed', ?),
        ('webhook_2', 'application.reviewed', '{"applicationId":"application_subscriptions"}', 'processed', ?)
    `).run(now, now)

    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, metadata_json, created_at)
      VALUES
        ('audit_1', ?, 'policy.accepted', 'policy', ?, '{"version":"2026.07"}', ?),
        ('audit_2', ?, 'payout.account.verified', 'payout_account', 'payout_default', '{"currency":"USD"}', ?),
        ('audit_3', ?, 'hallmark.created', 'hallmark_page', ?, '{"plan":"free_trial"}', ?)
    `).run(DEFAULT_USER_ID, DEFAULT_POLICY_KEY, now, DEFAULT_USER_ID, now, DEFAULT_USER_ID, now)

    db.prepare(`
      INSERT INTO policy_acknowledgements (id, user_id, policy_key, policy_version, accepted_at)
      VALUES ('policy_ack_default', ?, ?, ?, ?)
    `).run(DEFAULT_USER_ID, DEFAULT_POLICY_KEY, DEFAULT_PLATFORM_CONFIG.policyVersion, now)
  })

  transaction()
}
