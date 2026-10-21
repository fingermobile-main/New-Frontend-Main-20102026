/**
 * ==============================================================================
 * FingerMobile Protocol - Curated Open Source Email Template Catalog
 * ==============================================================================
 * 16 Diverse, Fully Editable, Responsive Categories for Platform Communications
 * Tailored for SuperAdmin, Admin, and Back-Office Staff Operations
 * ==============================================================================
 */

const CURATED_EMAIL_TEMPLATES = [
  // ----------------------------------------------------------------------------
  // 1. Onboarding & Welcome
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_onboarding_welcome',
    slug: 'welcome_onboarding',
    name: 'New Member Welcome & Ecosystem Orientation',
    category: 'Onboarding & Welcome',
    description: 'Welcomes newly registered members, provides genesis FIC token instructions, and links key hubs.',
    subject: 'Welcome to FingerMobile Protocol — Your Decentralized Identity is Ready',
    variables: ['firstName', 'username', 'genesisTokens', 'loginUrl', 'exploreUrl', 'supportUrl'],
    body_markdown: `# Welcome to FingerMobile, {{firstName}}! 🎉

Your decentralized account (**@{{username}}**) is officially provisioned across our global node network.

### What to do next:
1. **Claim Your Genesis FIC:** You have been credited with **{{genesisTokens}} FIC** for initial gas and community tipping.
2. **Setup Biometrics:** Connect your passkey or device biometric enclave for single-tap zero-knowledge authentication.
3. **Explore Timelines:** Discover decentralized creator timelines, Banuba video lenses, and STERCS channels.

[Open FingerMobile App]({{loginUrl}}) • [Explore Creators]({{exploreUrl}})

Questions? Reach out anytime at [{{supportUrl}}]({{supportUrl}}).`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="text-align: center; margin-bottom: 28px;">
    <div style="display: inline-block; background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; padding: 6px 16px; border-radius: 9999px; border: 1px solid #bfdbfe;">Identity Initialized</div>
    <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 16px 0 8px;">Welcome to FingerMobile, {{firstName}}!</h1>
    <p style="font-size: 15px; color: #64748b; margin: 0;">Your sovereign protocol handle <strong style="color: #2563eb;">@{{username}}</strong> is ready for action.</p>
  </div>
  <div style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px;">
    <div style="font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 12px;">Quickstart Checklist:</div>
    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
      <li><strong>Claim Genesis Tokens:</strong> <code>{{genesisTokens}} FIC</code> is waiting in your multi-chain vault.</li>
      <li><strong>Biometric Setup:</strong> Link device passkeys for frictionless single-tap authorization.</li>
      <li><strong>Follow Creators:</strong> Join community blogs, gems, and STERCS real-time broadcasts.</li>
    </ul>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="{{loginUrl}}" style="background: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">Open Protocol Console &rarr;</a>
  </div>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 20px;" />
  <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">FingerMobile Protocol Sovereign Communications &bull; <a href="{{loginUrl}}/settings/notifications" style="color: #64748b;">Manage Preferences</a></p>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 2. Authentication & Identity Security
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_auth_2fa_code',
    slug: 'auth_security',
    name: 'Two-Factor Verification & Security Passcode',
    category: 'Authentication & Security',
    description: 'High-urgency 2FA authentication code with clear expiry and security notices.',
    subject: 'Your FingerMobile Verification Code: [{{code}}]',
    variables: ['firstName', 'code', 'expiryMinutes', 'ipAddress', 'deviceType'],
    body_markdown: `# Two-Factor Authentication Code

Hello {{firstName}},

Use the 6-digit passcode below to verify your login or transaction request:

# **{{code}}**

*(This passcode will expire in {{expiryMinutes}} minutes)*

### Request Details:
- **Device:** {{deviceType}}
- **IP Address:** {{ipAddress}}
- **Timestamp:** Just now

If you did not initiate this request, somebody may have access to your credentials. Reset your password immediately.`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="font-size: 32px; margin-bottom: 8px;">🔐</div>
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 6px;">Single-Use Security Passcode</h2>
    <p style="font-size: 14px; color: #64748b; margin: 0;">Enter this code into your FingerMobile client to proceed.</p>
  </div>
  <div style="background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
    <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #1e293b;">{{code}}</span>
    <div style="font-size: 12px; color: #64748b; margin-top: 10px; font-weight: 600;">Valid for {{expiryMinutes}} minutes &bull; Single use only</div>
  </div>
  <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 14px; font-size: 13px; color: #92400e; margin-bottom: 24px;">
    <strong>Security Context:</strong> Originating from <strong>{{deviceType}}</strong> (<code>{{ipAddress}}</code>). If this was not you, change your password immediately.
  </div>
  <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">Automated Identity Gateway &bull; FingerMobile Protocol</p>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 3. Account Alerts & Emergency Killswitch
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_account_killswitch',
    slug: 'account_alerts',
    name: 'Suspicious Activity & Session Killswitch Alert',
    category: 'Account Alerts & Governance',
    description: 'Alerts member to abnormal IP/geo login with 1-click account session killswitch action.',
    subject: '⚠️ Critical Security Alert: Suspicious Login Detected (Session Killswitch Available)',
    variables: ['firstName', 'location', 'ipAddress', 'timestamp', 'deviceDetails', 'killswitchUrl', 'confirmUrl'],
    body_markdown: `# ⚠️ Critical Security Notice for {{firstName}}

We detected a suspicious session authorization on your account:

- **Location:** {{location}}
- **IP Address:** {{ipAddress}}
- **Device:** {{deviceDetails}}
- **Time:** {{timestamp}}

### Immediate Actions:
If this was **NOT** you, trigger the emergency killswitch immediately to terminate all active WebSocket sessions, invalidate refresh tokens, and freeze outbound transactions:

[TRIGGER EMERGENCY KILLSWITCH]({{killswitchUrl}})

If this was you, you can safely confirm your device:
[Confirm This Device]({{confirmUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #fecaca; color: #1e293b;">
  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
    <div style="background: #fee2e2; color: #dc2626; font-size: 24px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 10px;">⚠️</div>
    <div>
      <h2 style="font-size: 20px; font-weight: 800; color: #991b1b; margin: 0;">Suspicious Login Detected</h2>
      <p style="font-size: 13px; color: #7f1d1d; margin: 2px 0 0;">An unauthorized IP address attempted to access your account.</p>
    </div>
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; background: #fef2f2; border-radius: 8px; overflow: hidden;">
    <tr><td style="padding: 10px 14px; color: #7f1d1d; font-weight: 600; width: 35%;">Geographic Region:</td><td style="padding: 10px 14px; color: #1e293b;">{{location}}</td></tr>
    <tr><td style="padding: 10px 14px; color: #7f1d1d; font-weight: 600;">Remote IP:</td><td style="padding: 10px 14px; color: #1e293b; font-family: monospace;">{{ipAddress}}</td></tr>
    <tr><td style="padding: 10px 14px; color: #7f1d1d; font-weight: 600;">Client Footprint:</td><td style="padding: 10px 14px; color: #1e293b;">{{deviceDetails}}</td></tr>
    <tr><td style="padding: 10px 14px; color: #7f1d1d; font-weight: 600;">Recorded Time:</td><td style="padding: 10px 14px; color: #1e293b;">{{timestamp}}</td></tr>
  </table>
  <div style="text-align: center; margin: 28px 0;">
    <a href="{{killswitchUrl}}" style="background: #dc2626; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block;">Lock Account / Trigger Killswitch &rarr;</a>
    <div style="margin-top: 14px;">
      <a href="{{confirmUrl}}" style="font-size: 13px; color: #64748b; text-decoration: underline;">Yes, this was me &mdash; verify device</a>
    </div>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 4. Financial Transactions & Receipts
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_financial_deposit_receipt',
    slug: 'financial_receipts',
    name: 'Payment, Deposit & Vault Receipt',
    category: 'Financial & Transactions',
    description: 'Cryptographically signed receipt for deposits, in-app purchases, and marketplace settlement.',
    subject: 'Receipt: {{currency}} {{amount}} Confirmed [Tx #{{transactionId}}]',
    variables: ['firstName', 'amount', 'currency', 'transactionId', 'paymentMethod', 'date', 'receiptUrl', 'feeAmount'],
    body_markdown: `# Transaction Confirmed: {{currency}} {{amount}}

Dear {{firstName}},

We have processed and finalized your transaction on the FingerMobile ledger.

### Summary:
- **Amount Credited:** {{currency}} {{amount}}
- **Transaction Hash:** \`{{transactionId}}\`
- **Method / Gateway:** {{paymentMethod}}
- **Platform Fee:** {{feeAmount}}
- **Timestamp:** {{date}}

[Download Official Tax Invoice & PDF Receipt]({{receiptUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <div style="font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase;">Official Ledger Receipt</div>
      <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 4px 0 0;">Transaction Successful</h2>
    </div>
    <div style="text-align: right; font-size: 12px; color: #64748b;">Date: <strong>{{date}}</strong></div>
  </div>
  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
    <div style="font-size: 36px; font-weight: 900; color: #047857;">{{currency}} {{amount}}</div>
    <div style="font-size: 13px; color: #065f46; margin-top: 6px;">Settled via {{paymentMethod}}</div>
  </div>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
    <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b;">Transaction Identifier</td><td style="padding: 10px 0; text-align: right; font-family: monospace; font-size: 12px; color: #1e293b;">{{transactionId}}</td></tr>
    <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b;">Platform Protocol Fee</td><td style="padding: 10px 0; text-align: right; color: #1e293b;">{{feeAmount}}</td></tr>
    <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b;">Recipient Vault</td><td style="padding: 10px 0; text-align: right; color: #1e293b;">{{firstName}}'s Main Account</td></tr>
  </table>
  <div style="text-align: center;">
    <a href="{{receiptUrl}}" style="background: #059669; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">Download Immutable PDF Receipt &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 5. Creator & Monetization Royalties
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_creator_royalties',
    slug: 'creator_royalties',
    name: 'Creator Revenue Share & Royalties Statement',
    category: 'Creator & Monetization',
    description: 'Monthly/Weekly earnings report for creators including tips, UGC downloads, and subscriptions.',
    subject: '💰 Creator Payout Statement: {{payoutAmount}} FIC Available for Withdrawal',
    variables: ['creatorName', 'payoutAmount', 'currency', 'period', 'tipsCount', 'subscriberCount', 'analyticsUrl', 'payoutUrl'],
    body_markdown: `# Monthly Creator Statement for {{creatorName}}

Your creative contributions on FingerMobile generated **{{payoutAmount}} {{currency}}** for the billing period of **{{period}}**.

### Performance Breakdown:
- **Community Tips & Gems:** {{tipsCount}} contributions
- **Active Channel Subscribers:** {{subscriberCount}} members
- **Net Available Balance:** **{{payoutAmount}} {{currency}}**

[Withdraw Earnings]({{payoutUrl}}) • [View Channel Analytics]({{analyticsUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background: #fef3c7; color: #b45309; padding: 4px 14px; border-radius: 9999px; font-size: 12px; font-weight: 800; text-transform: uppercase;">Creator Monetization Hub</span>
    <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 12px 0 6px;">Royalty Payout Ready!</h1>
    <p style="font-size: 14px; color: #64748b; margin: 0;">Earnings report for <strong>{{creatorName}}</strong> ({{period}})</p>
  </div>
  <div style="background: linear-gradient(135deg, #4338ca, #3b82f6); border-radius: 14px; padding: 28px; text-align: center; color: #ffffff; margin-bottom: 24px;">
    <div style="font-size: 13px; opacity: 0.9; text-transform: uppercase; font-weight: 600;">Net Settled Royalties</div>
    <div style="font-size: 40px; font-weight: 900; margin: 8px 0;">{{payoutAmount}} {{currency}}</div>
    <div style="font-size: 13px; opacity: 0.9;">Ready for instant bank or on-chain withdrawal</div>
  </div>
  <div style="display: flex; gap: 12px; text-align: center; margin-bottom: 28px;">
    <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;">
      <div style="font-size: 20px; font-weight: 800; color: #0f172a;">{{tipsCount}}</div>
      <div style="font-size: 12px; color: #64748b;">Direct Tips</div>
    </div>
    <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;">
      <div style="font-size: 20px; font-weight: 800; color: #0f172a;">{{subscriberCount}}</div>
      <div style="font-size: 12px; color: #64748b;">Subscribers</div>
    </div>
  </div>
  <div style="text-align: center;">
    <a href="{{payoutUrl}}" style="background: #4338ca; color: #ffffff; padding: 14px 30px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 15px; display: inline-block;">Initiate Payout Transfer &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 6. Community & Social Engagement
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_social_viral_milestone',
    slug: 'social_engagement',
    name: 'Viral UGC Milestone & Social Activity Alert',
    category: 'Community & Social',
    description: 'Notifies creators when their content gains trending traction or reaches follower milestones.',
    subject: '🔥 Your Post is Trending! Reached {{viewsCount}} Views on FingerMobile',
    variables: ['firstName', 'postTitle', 'viewsCount', 'likesCount', 'postUrl', 'forumUrl'],
    body_markdown: `# Your Post is Gaining Massive Momentum! 🚀

Hey {{firstName}},

Your post **"{{postTitle}}"** has just surpassed **{{viewsCount}} views** and **{{likesCount}} likes**! Community members are discussing it right now.

[Jump Into The Discussion]({{postUrl}}) • [Explore Trending Topics]({{forumUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="text-align: center; margin-bottom: 20px;">
    <span style="font-size: 36px;">🔥</span>
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 10px 0 6px;">Viral Milestone Reached!</h2>
    <p style="font-size: 14px; color: #64748b; margin: 0;">Your content is featured across the FingerMobile timeline.</p>
  </div>
  <div style="background: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
    <div style="font-size: 16px; font-weight: 700; color: #9a3412; margin-bottom: 6px;">&ldquo;{{postTitle}}&rdquo;</div>
    <div style="font-size: 13px; color: #c2410c;">Surpassed <strong>{{viewsCount}} impressions</strong> and <strong>{{likesCount}} community upvotes</strong>.</div>
  </div>
  <div style="text-align: center;">
    <a href="{{postUrl}}" style="background: #ea580c; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">Reply to Comments &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 7. E-Commerce & Order Tracking
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_ecommerce_order_dispatch',
    slug: 'ecommerce_orders',
    name: 'Marketplace Order Dispatch & Tracking',
    category: 'E-Commerce & Orders',
    description: 'Dispatches parcel shipping tracking info, courier details, and delivery date.',
    subject: '📦 Your FingerMobile Marketplace Order #{{orderId}} Has Shipped!',
    variables: ['customerName', 'orderId', 'carrier', 'trackingNumber', 'estimatedDelivery', 'trackingUrl', 'itemsSummary'],
    body_markdown: `# Your Order Has Dispatched! 🚚

Hello {{customerName}},

Good news! Order **#{{orderId}}** has been packaged and handed over to **{{carrier}}**.

- **Tracking Number:** \`{{trackingNumber}}\`
- **Carrier:** {{carrier}}
- **Estimated Arrival:** {{estimatedDelivery}}
- **Items:** {{itemsSummary}}

[Track Your Package Live]({{trackingUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 24px;">
    <span style="color: #2563eb; font-weight: 700; font-size: 12px; text-transform: uppercase;">Shipment Notification</span>
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 4px 0 0;">Order #{{orderId}} Is On The Way</h2>
  </div>
  <p style="font-size: 15px; color: #475569;">Hello {{customerName}}, your package was handed off to <strong>{{carrier}}</strong> and is moving toward your destination.</p>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 20px 0;">
    <div style="font-size: 13px; color: #64748b;">Carrier Tracking Code:</div>
    <div style="font-size: 18px; font-weight: 800; font-family: monospace; color: #0f172a; margin: 4px 0 10px;">{{trackingNumber}}</div>
    <div style="font-size: 13px; color: #475569;">Estimated Delivery Date: <strong>{{estimatedDelivery}}</strong></div>
  </div>
  <div style="text-align: center; margin: 28px 0;">
    <a href="{{trackingUrl}}" style="background: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">Track Shipment Real-Time &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 8. Governance & Voting Proposals
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_governance_dao_vote',
    slug: 'governance_voting',
    name: 'Protocol Governance Referendum & Voting Call',
    category: 'Governance & DAO',
    description: 'Urges token holders and sovereign members to cast their vote on active protocol proposals.',
    subject: '🗳️ Protocol Vote Open: Proposal #{{proposalId}} ({{proposalTitle}})',
    variables: ['voterHandle', 'proposalId', 'proposalTitle', 'deadline', 'votingPower', 'voteUrl', 'quorumPercent'],
    body_markdown: `# Governance Vote Active: Proposal #{{proposalId}}

Dear @{{voterHandle}},

A new protocol referendum has been submitted to the community:

### **"{{proposalTitle}}"**

- **Proposal ID:** #{{proposalId}}
- **Your Voting Weight:** {{votingPower}} FIC / Governance Shares
- **Quorum Target:** {{quorumPercent}}%
- **Voting Deadline:** {{deadline}}

[Cast Your Vote On-Chain]({{voteUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background: #e0e7ff; color: #4338ca; padding: 4px 14px; border-radius: 9999px; font-size: 12px; font-weight: 800; text-transform: uppercase;">DAO Governance Engine</span>
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 12px 0 6px;">Referendum #{{proposalId}} is Live</h2>
    <p style="font-size: 14px; color: #64748b; margin: 0;">Sovereign voting is now open for @{{voterHandle}}</p>
  </div>
  <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 18px; border-radius: 4px; margin-bottom: 24px;">
    <div style="font-size: 17px; font-weight: 800; color: #1e293b; margin-bottom: 6px;">{{proposalTitle}}</div>
    <div style="font-size: 13px; color: #64748b;">Your verified voting allocation: <strong>{{votingPower}}</strong> shares.</div>
  </div>
  <div style="text-align: center;">
    <a href="{{voteUrl}}" style="background: #4f46e5; color: #ffffff; padding: 14px 30px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 15px; display: inline-block;">Review & Cast Ballot &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 9. Compliance, DPO & Statutory Notices
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_compliance_dpo_notice',
    slug: 'compliance_dpo',
    name: 'Statutory DPO Notice & Data Subject Access Receipt',
    category: 'Legal, Compliance & DPO',
    description: 'Official statutory response to Data Subject Access Requests (DSAR/GDPR/NDPR).',
    subject: 'Statutory Data Protection Receipt — Ref #{{referenceId}}',
    variables: ['fullName', 'referenceId', 'requestType', 'statutoryDeadline', 'dpoEmail', 'portalUrl'],
    body_markdown: `# Statutory Data Subject Notice

Dear {{fullName}},

Your formal statutory request (**Ref: {{referenceId}}**) under applicable Data Protection regulations (GDPR/NDPR) has been logged in our immutable compliance registry.

- **Request Classification:** {{requestType}}
- **Statutory Completion Deadline:** {{statutoryDeadline}}
- **DPO Contact:** {{dpoEmail}}

[Access Secure DPO Portal]({{portalUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; color: #1e293b;">
  <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
    <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;">FingerMobile Office of the Data Protection Officer</h3>
    <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Formal Statutory Compliance Acknowledgment</div>
  </div>
  <p style="font-size: 14px; line-height: 1.6; color: #334155;">Dear {{fullName}},</p>
  <p style="font-size: 14px; line-height: 1.6; color: #334155;">Your statutory request regarding personal data processing has been received and verified under token <code>{{referenceId}}</code>.</p>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 18px 0; font-size: 13px;">
    <div><strong>Request Type:</strong> {{requestType}}</div>
    <div style="margin-top: 6px;"><strong>Statutory SLA:</strong> Within {{statutoryDeadline}}</div>
    <div style="margin-top: 6px;"><strong>Dedicated Counsel:</strong> <a href="mailto:{{dpoEmail}}" style="color: #2563eb;">{{dpoEmail}}</a></div>
  </div>
  <p style="font-size: 13px; color: #64748b;">You may inspect status updates and download cryptographically signed export archives via our secure portal.</p>
  <div style="text-align: center; margin-top: 24px;">
    <a href="{{portalUrl}}" style="background: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">Open Statutory Case File &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 10. Re-engagement & Inactivity Warnings
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_reengagement_inactivity',
    slug: 'reengagement_inactivity',
    name: 'Account Dormancy Warning & Re-engagement Gift',
    category: 'Re-engagement & Lifecycle',
    description: 'Pre-dormancy warning notice with incentive gift tokens to retain inactive members.',
    subject: 'We miss you on FingerMobile! Here is {{bonusFic}} FIC to jump back in',
    variables: ['firstName', 'daysInactive', 'bonusFic', 'claimUrl', 'trendingCreator'],
    body_markdown: `# We Miss You, {{firstName}}! 👋

It has been **{{daysInactive}} days** since your last login. We have dropped **{{bonusFic}} FIC** into your account to check out what has changed!

Top trending creators like **@{{trendingCreator}}** are hosting live audio stages and dropping exclusive gems right now.

[Claim {{bonusFic}} FIC & Jump Back In]({{claimUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="font-size: 32px;">✨</span>
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 8px 0 4px;">Jump Back Into The Community!</h2>
    <p style="font-size: 14px; color: #64748b; margin: 0;">It has been {{daysInactive}} days since we last saw you, {{firstName}}.</p>
  </div>
  <div style="background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 12px; padding: 22px; text-align: center; margin-bottom: 24px;">
    <div style="font-size: 13px; font-weight: 700; color: #7e22ce; text-transform: uppercase;">Re-Engagement Token Grant</div>
    <div style="font-size: 32px; font-weight: 900; color: #6b21a8; margin: 6px 0;">+{{bonusFic}} FIC</div>
    <div style="font-size: 13px; color: #7e22ce;">Credited automatically upon logging into your session.</div>
  </div>
  <div style="text-align: center;">
    <a href="{{claimUrl}}" style="background: #9333ea; color: #ffffff; padding: 13px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">Claim Tokens & Reconnect &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 11. Event & Livestream Broadcasts
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_events_livestream',
    slug: 'events_broadcasts',
    name: 'Live Studio Broadcast & Community Event Pass',
    category: 'Events & Livestreams',
    description: 'Broadcast pass for scheduled community AMAs, product launches, or music stages.',
    subject: '🎙️ Live in 30 Minutes: "{{eventTitle}}" with {{hostName}}',
    variables: ['attendeeName', 'eventTitle', 'hostName', 'startTime', 'streamUrl', 'calendarUrl'],
    body_markdown: `# Live Stage Starting Soon!

Hello {{attendeeName}},

The live session **"{{eventTitle}}"** hosted by **{{hostName}}** kicks off at **{{startTime}}**.

Join the stage, participate in live polls, and interact directly in the chat room.

[Join Live Studio Stream]({{streamUrl}}) • [Add to Calendar]({{calendarUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #0f172a; border-radius: 16px; color: #ffffff;">
  <div style="display: inline-block; background: #ef4444; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; letter-spacing: 1px; margin-bottom: 16px;">LIVE BROADCAST</div>
  <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 10px; color: #ffffff;">{{eventTitle}}</h1>
  <p style="font-size: 15px; color: #94a3b8; margin: 0 0 20px;">Hosted by <strong style="color: #ffffff;">{{hostName}}</strong> &bull; Starts at {{startTime}}</p>
  <div style="text-align: center; margin: 28px 0;">
    <a href="{{streamUrl}}" style="background: #3b82f6; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block;">Enter Live Broadcast Room &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 12. Customer Support & Ticket Resolution
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_support_ticket_resolved',
    slug: 'support_helpdesk',
    name: 'Helpdesk Incident Resolution & Quality Survey',
    category: 'Customer Support',
    description: 'Resolution statement for member support cases with 1-click satisfaction ratings.',
    subject: 'Resolved: Support Request #{{ticketId}} ({{subject}})',
    variables: ['customerName', 'ticketId', 'subject', 'agentName', 'resolutionSummary', 'surveyUrl', 'reopenUrl'],
    body_markdown: `# Support Ticket #{{ticketId}} Resolved

Hello {{customerName}},

Our senior support specialist, **{{agentName}}**, has updated and resolved your request:

### Resolution Summary:
{{resolutionSummary}}

Was this issue resolved to your satisfaction?
[Rate Support Experience]({{surveyUrl}}) • [Re-open Ticket]({{reopenUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
    <span style="color: #059669; font-weight: 700; font-size: 12px; text-transform: uppercase;">Ticket #{{ticketId}} Status: Resolved</span>
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 6px 0 0;">{{subject}}</h2>
  </div>
  <p style="font-size: 14px; color: #475569;">Hello {{customerName}}, specialist <strong>{{agentName}}</strong> has addressed your inquiry:</p>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; color: #334155; margin: 18px 0; line-height: 1.6;">
    {{resolutionSummary}}
  </div>
  <div style="text-align: center; margin: 24px 0;">
    <a href="{{surveyUrl}}" style="background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block;">Rate Support Quality &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 13. Subscription & Billing Cycles
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_subscription_renewed',
    slug: 'subscription_billing',
    name: 'Pro Tier Subscription Renewal & Benefits Notice',
    category: 'Subscriptions & Billing',
    description: 'Annual or monthly tier renewal confirmation detailing storage quotas and privileges.',
    subject: 'Subscription Renewed: {{tierName}} Active Until {{nextBillingDate}}',
    variables: ['firstName', 'tierName', 'amountBilled', 'nextBillingDate', 'storageQuota', 'manageUrl'],
    body_markdown: `# Your {{tierName}} Subscription Has Been Renewed

Dear {{firstName}},

Thank you for your continued support! Your **{{tierName}}** membership has been renewed for **{{amountBilled}}**.

### Active Privileges:
- **Cloud Storage:** {{storageQuota}}
- **Badge Status:** Verified Pro Member
- **Next Billing:** {{nextBillingDate}}

[Manage Subscription]({{manageUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="text-align: center; margin-bottom: 20px;">
    <span style="background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; padding: 4px 14px; border-radius: 9999px;">PREMIUM SUBSCRIPTION</span>
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 10px 0 4px;">{{tierName}} Active</h2>
  </div>
  <p style="font-size: 14px; color: #475569; text-align: center; margin: 0 0 20px;">Your subscription has been renewed for <strong>{{amountBilled}}</strong>.</p>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; color: #334155; margin-bottom: 24px;">
    <div><strong>Storage Allotment:</strong> {{storageQuota}}</div>
    <div style="margin-top: 6px;"><strong>Next Renewal Cycle:</strong> {{nextBillingDate}}</div>
  </div>
  <div style="text-align: center;">
    <a href="{{manageUrl}}" style="background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 700; text-decoration: none; display: inline-block;">Manage Billing & Settings &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 14. Security Vulnerability & Bug Bounty
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_bug_bounty_payout',
    slug: 'security_bounty',
    name: 'Security Vulnerability Disclosure & Bounty Award',
    category: 'Security & Bug Bounty',
    description: 'Formal acknowledgment of white-hat security report with reward payout notification.',
    subject: '🛡️ Vulnerability Report Acknowledged: Bounty Payout of {{bountyAmount}} FIC Approved',
    variables: ['researcherHandle', 'reportId', 'severity', 'bountyAmount', 'cveId', 'portalUrl'],
    body_markdown: `# Bug Bounty Acknowledged: Report #{{reportId}}

Dear @{{researcherHandle}},

Our protocol security triage team has verified your responsible disclosure (**#{{reportId}}**).

- **Severity Classification:** **{{severity}}**
- **Awarded Bounty:** **{{bountyAmount}} FIC**
- **Tracking ID:** {{cveId}}

The bounty has been credited to your security researcher vault. Thank you for safeguarding FingerMobile Protocol!

[View Security Advisory]({{portalUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
    <div style="background: #ecfdf5; color: #059669; font-size: 24px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 10px;">🛡️</div>
    <div>
      <h2 style="font-size: 20px; font-weight: 800; color: #065f46; margin: 0;">Bounty Payout Approved</h2>
      <p style="font-size: 13px; color: #047857; margin: 2px 0 0;">Report #{{reportId}} confirmed by Security Triage</p>
    </div>
  </div>
  <p style="font-size: 14px; color: #475569;">Thank you @{{researcherHandle}} for keeping our infrastructure safe. Your vulnerability report was verified and patched.</p>
  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 18px; text-align: center; margin: 20px 0;">
    <div style="font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase;">Awarded Bounty</div>
    <div style="font-size: 32px; font-weight: 900; color: #047857; margin: 4px 0;">{{bountyAmount}} FIC</div>
    <div style="font-size: 12px; color: #065f46;">Severity Rating: <strong>{{severity}}</strong> ({{cveId}})</div>
  </div>
  <div style="text-align: center;">
    <a href="{{portalUrl}}" style="background: #059669; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 700; text-decoration: none; display: inline-block;">Open Researcher Ledger &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 15. Product Releases & Feature Announcements
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_protocol_release_changelog',
    slug: 'product_announcements',
    name: 'Major Protocol Upgrade & Ecosystem Changelog',
    category: 'Product & Releases',
    description: 'Broadcast announcing major protocol releases, new dashboard consoles, and client updates.',
    subject: '🚀 Introducing FingerMobile Protocol v2.5: What Is New',
    variables: ['memberName', 'version', 'highlights', 'releaseUrl', 'downloadUrl'],
    body_markdown: `# FingerMobile Protocol {{version}} Is Officially Live! 🚀

Hello {{memberName}},

We are thrilled to roll out our latest major platform upgrade (**{{version}}**).

### What is new in this update:
{{highlights}}

[Read Full Release Notes]({{releaseUrl}}) • [Update Mobile App]({{downloadUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background: #ede9fe; color: #6d28d9; padding: 4px 14px; border-radius: 9999px; font-size: 12px; font-weight: 800; text-transform: uppercase;">Platform Milestone</span>
    <h1 style="font-size: 26px; font-weight: 900; color: #0f172a; margin: 12px 0 6px;">Protocol {{version}} is Live</h1>
    <p style="font-size: 14px; color: #64748b; margin: 0;">Decentralized scalability, multi-track timelines, and instant messaging.</p>
  </div>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; font-size: 14px; line-height: 1.8; color: #334155;">
    {{highlights}}
  </div>
  <div style="text-align: center;">
    <a href="{{releaseUrl}}" style="background: #7c3aed; color: #ffffff; padding: 14px 30px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 15px; display: inline-block;">Read Complete Changelog &rarr;</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------------------------
  // 16. Partner, B2B & Enterprise Outreach
  // ----------------------------------------------------------------------------
  {
    id: 'tpl_b2b_enterprise_partner',
    slug: 'partner_enterprise',
    name: 'Enterprise Node Partner Invitation & Agreement',
    category: 'Enterprise & B2B',
    description: 'Formal corporate outreach for institutional partners, node validators, and business hubs.',
    subject: 'Institutional Partnership Invitation: FingerMobile Enterprise Network',
    variables: ['contactName', 'organizationName', 'nodeAllocation', 'contractUrl', 'repEmail'],
    body_markdown: `# Enterprise Partnership Invitation

Dear {{contactName}},

On behalf of the FingerMobile Protocol steering committee, we are pleased to invite **{{organizationName}}** to participate in our verified Institutional Validator Node program.

- **Allocated Node Weight:** {{nodeAllocation}}
- **Lead Partner Representative:** {{repEmail}}

[Review Executive Enterprise Memorandum]({{contractUrl}})`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; color: #1e293b;">
  <div style="border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px;">
    <div style="font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase;">FingerMobile Institutional Program</div>
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 4px 0 0;">Enterprise Network Invitation</h2>
  </div>
  <p style="font-size: 14px; color: #334155;">Dear {{contactName}},</p>
  <p style="font-size: 14px; color: #334155; line-height: 1.6;">We formally invite <strong>{{organizationName}}</strong> to operate an institutional validator node within the FingerMobile Protocol distributed network.</p>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px;">
    <div><strong>Assigned Validator Allocation:</strong> {{nodeAllocation}}</div>
    <div style="margin-top: 6px;"><strong>Institutional Officer:</strong> <a href="mailto:{{repEmail}}" style="color: #2563eb;">{{repEmail}}</a></div>
  </div>
  <div style="text-align: center; margin-top: 24px;">
    <a href="{{contractUrl}}" style="background: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 700; text-decoration: none; display: inline-block;">Review Enterprise Agreement &rarr;</a>
  </div>
</div>`
  }
];

module.exports = {
  CURATED_EMAIL_TEMPLATES
};
