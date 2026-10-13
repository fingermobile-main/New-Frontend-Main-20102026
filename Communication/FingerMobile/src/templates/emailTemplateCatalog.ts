/**
 * ==============================================================================
 * FingerMobile Protocol - Curated Open Source Email Template Catalog
 * ==============================================================================
 * 16 Distinct, Production-Grade Categories with Markdown and HTML representations
 * ==============================================================================
 */

export interface EmailTemplateItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  subject: string;
  variables: string[];
  body_markdown: string;
  body_html: string;
}

export const CURATED_EMAIL_TEMPLATES: EmailTemplateItem[] = [
  {
    id: 'tpl_onboarding_welcome',
    slug: 'welcome_onboarding',
    name: 'New Member Welcome & Ecosystem Orientation',
    category: 'Onboarding & Welcome',
    description: 'Welcomes newly registered members, provides genesis FIC token instructions, and links key hubs.',
    subject: 'Welcome to FingerMobile Protocol — Your Decentralized Identity is Ready',
    variables: ['firstName', 'username', 'genesisTokens', 'loginUrl', 'exploreUrl', 'supportUrl'],
    body_markdown: `# Welcome to FingerMobile, {{firstName}}!\n\nYour decentralized account (**@{{username}}**) is provisioned.\n\nClaim {{genesisTokens}} FIC at {{loginUrl}}.`,
    body_html: `<div style="font-family: sans-serif; max-width: 600px; padding: 24px;"><h2>Welcome, {{firstName}}!</h2><p>Your handle is @{{username}}.</p><a href="{{loginUrl}}">Get Started</a></div>`
  },
  {
    id: 'tpl_auth_2fa_code',
    slug: 'auth_security',
    name: 'Two-Factor Verification & Security Passcode',
    category: 'Authentication & Security',
    description: 'High-urgency 2FA authentication code with clear expiry and security notices.',
    subject: 'Your FingerMobile Verification Code: [{{code}}]',
    variables: ['firstName', 'code', 'expiryMinutes', 'ipAddress', 'deviceType'],
    body_markdown: `# Security Passcode\n\nYour verification code is: **{{code}}** (expires in {{expiryMinutes}} mins).`,
    body_html: `<div style="font-family: monospace; font-size: 28px; text-align: center; padding: 20px; background: #f1f5f9;">{{code}}</div>`
  },
  {
    id: 'tpl_account_killswitch',
    slug: 'account_alerts',
    name: 'Suspicious Activity & Session Killswitch Alert',
    category: 'Account Alerts & Governance',
    description: 'Alerts member to abnormal IP/geo login with 1-click account session killswitch action.',
    subject: '⚠️ Critical Security Alert: Suspicious Login Detected (Session Killswitch Available)',
    variables: ['firstName', 'location', 'ipAddress', 'timestamp', 'deviceDetails', 'killswitchUrl', 'confirmUrl'],
    body_markdown: `# ⚠️ Suspicious Login Detected\n\nLocation: {{location}}\nIP: {{ipAddress}}\n\n[Killswitch]({{killswitchUrl}})`,
    body_html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #ef4444;"><h3>Suspicious Login</h3><p>IP: {{ipAddress}}</p><a href="{{killswitchUrl}}" style="background: #dc2626; color: white; padding: 10px 20px;">Trigger Killswitch</a></div>`
  },
  {
    id: 'tpl_financial_deposit_receipt',
    slug: 'financial_receipts',
    name: 'Payment, Deposit & Vault Receipt',
    category: 'Financial & Transactions',
    description: 'Cryptographically signed receipt for deposits, in-app purchases, and marketplace settlement.',
    subject: 'Receipt: {{currency}} {{amount}} Confirmed [Tx #{{transactionId}}]',
    variables: ['firstName', 'amount', 'currency', 'transactionId', 'paymentMethod', 'date', 'receiptUrl', 'feeAmount'],
    body_markdown: `# Payment Receipt: {{currency}} {{amount}}\n\nTransaction ID: {{transactionId}}\nDate: {{date}}`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>{{currency}} {{amount}}</h2><p>Tx: {{transactionId}}</p><a href="{{receiptUrl}}">Download PDF</a></div>`
  },
  {
    id: 'tpl_creator_royalties',
    slug: 'creator_royalties',
    name: 'Creator Revenue Share & Royalties Statement',
    category: 'Creator & Monetization',
    description: 'Monthly/Weekly earnings report for creators including tips, UGC downloads, and subscriptions.',
    subject: '💰 Creator Payout Statement: {{payoutAmount}} FIC Available for Withdrawal',
    variables: ['creatorName', 'payoutAmount', 'currency', 'period', 'tipsCount', 'subscriberCount', 'analyticsUrl', 'payoutUrl'],
    body_markdown: `# Creator Earnings: {{payoutAmount}} {{currency}}\n\nTips: {{tipsCount}} | Period: {{period}}`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Payout Ready: {{payoutAmount}} {{currency}}</h2><a href="{{payoutUrl}}">Withdraw Now</a></div>`
  },
  {
    id: 'tpl_social_viral_milestone',
    slug: 'social_engagement',
    name: 'Viral UGC Milestone & Social Activity Alert',
    category: 'Community & Social',
    description: 'Notifies creators when their content gains trending traction or reaches follower milestones.',
    subject: '🔥 Your Post is Trending! Reached {{viewsCount}} Views on FingerMobile',
    variables: ['firstName', 'postTitle', 'viewsCount', 'likesCount', 'postUrl', 'forumUrl'],
    body_markdown: `# Trending Milestone: {{viewsCount}} Views!\n\nPost: "{{postTitle}}"\nLikes: {{likesCount}}`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>🔥 Trending!</h2><p>{{postTitle}} surpassed {{viewsCount}} views.</p><a href="{{postUrl}}">View Comments</a></div>`
  },
  {
    id: 'tpl_ecommerce_order_dispatch',
    slug: 'ecommerce_orders',
    name: 'Marketplace Order Dispatch & Tracking',
    category: 'E-Commerce & Orders',
    description: 'Dispatches parcel shipping tracking info, courier details, and delivery date.',
    subject: '📦 Your FingerMobile Marketplace Order #{{orderId}} Has Shipped!',
    variables: ['customerName', 'orderId', 'carrier', 'trackingNumber', 'estimatedDelivery', 'trackingUrl', 'itemsSummary'],
    body_markdown: `# Order Dispatched: #{{orderId}}\n\nCarrier: {{carrier}} | Tracking: {{trackingNumber}}`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Shipped! Order #{{orderId}}</h2><p>Tracking: {{trackingNumber}}</p><a href="{{trackingUrl}}">Track Package</a></div>`
  },
  {
    id: 'tpl_governance_dao_vote',
    slug: 'governance_voting',
    name: 'Protocol Governance Referendum & Voting Call',
    category: 'Governance & DAO',
    description: 'Urges token holders and sovereign members to cast their vote on active protocol proposals.',
    subject: '🗳️ Protocol Vote Open: Proposal #{{proposalId}} ({{proposalTitle}})',
    variables: ['voterHandle', 'proposalId', 'proposalTitle', 'deadline', 'votingPower', 'voteUrl', 'quorumPercent'],
    body_markdown: `# Referendum #{{proposalId}} Active\n\nTitle: {{proposalTitle}}\nVoting Weight: {{votingPower}}`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Vote Now on Proposal #{{proposalId}}</h2><a href="{{voteUrl}}">Cast Vote</a></div>`
  },
  {
    id: 'tpl_compliance_dpo_notice',
    slug: 'compliance_dpo',
    name: 'Statutory DPO Notice & Data Subject Access Receipt',
    category: 'Legal, Compliance & DPO',
    description: 'Official statutory response to Data Subject Access Requests (DSAR/GDPR/NDPR).',
    subject: 'Statutory Data Protection Receipt — Ref #{{referenceId}}',
    variables: ['fullName', 'referenceId', 'requestType', 'statutoryDeadline', 'dpoEmail', 'portalUrl'],
    body_markdown: `# Statutory Notice Ref: {{referenceId}}\n\nDear {{fullName}}, your request is logged. SLA: {{statutoryDeadline}}.`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>DPO Notice: {{referenceId}}</h2><p>Processing under GDPR/NDPR.</p><a href="{{portalUrl}}">Case File</a></div>`
  },
  {
    id: 'tpl_reengagement_inactivity',
    slug: 'reengagement_inactivity',
    name: 'Account Dormancy Warning & Re-engagement Gift',
    category: 'Re-engagement & Lifecycle',
    description: 'Pre-dormancy warning notice with incentive gift tokens to retain inactive members.',
    subject: 'We miss you on FingerMobile! Here is {{bonusFic}} FIC to jump back in',
    variables: ['firstName', 'daysInactive', 'bonusFic', 'claimUrl', 'trendingCreator'],
    body_markdown: `# We Miss You {{firstName}}!\n\nClaim {{bonusFic}} FIC: {{claimUrl}}`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>+{{bonusFic}} FIC Granted!</h2><a href="{{claimUrl}}">Claim Tokens</a></div>`
  },
  {
    id: 'tpl_events_livestream',
    slug: 'events_broadcasts',
    name: 'Live Studio Broadcast & Community Event Pass',
    category: 'Events & Livestreams',
    description: 'Broadcast pass for scheduled community AMAs, product launches, or music stages.',
    subject: '🎙️ Live in 30 Minutes: "{{eventTitle}}" with {{hostName}}',
    variables: ['attendeeName', 'eventTitle', 'hostName', 'startTime', 'streamUrl', 'calendarUrl'],
    body_markdown: `# Live Stream: {{eventTitle}}\n\nHosted by {{hostName}} at {{startTime}}.\n\n[Join Stream]({{streamUrl}})`,
    body_html: `<div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: white;"><h2>🎙️ {{eventTitle}}</h2><a href="{{streamUrl}}">Join Live</a></div>`
  },
  {
    id: 'tpl_support_ticket_resolved',
    slug: 'support_helpdesk',
    name: 'Helpdesk Incident Resolution & Quality Survey',
    category: 'Customer Support',
    description: 'Resolution statement for member support cases with 1-click satisfaction ratings.',
    subject: 'Resolved: Support Request #{{ticketId}} ({{subject}})',
    variables: ['customerName', 'ticketId', 'subject', 'agentName', 'resolutionSummary', 'surveyUrl', 'reopenUrl'],
    body_markdown: `# Ticket #{{ticketId}} Resolved\n\nSummary: {{resolutionSummary}}\n\n[Rate Service]({{surveyUrl}})`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Ticket #{{ticketId}} Resolved</h2><a href="{{surveyUrl}}">Rate Quality</a></div>`
  },
  {
    id: 'tpl_subscription_renewed',
    slug: 'subscription_billing',
    name: 'Pro Tier Subscription Renewal & Benefits Notice',
    category: 'Subscriptions & Billing',
    description: 'Annual or monthly tier renewal confirmation detailing storage quotas and privileges.',
    subject: 'Subscription Renewed: {{tierName}} Active Until {{nextBillingDate}}',
    variables: ['firstName', 'tierName', 'amountBilled', 'nextBillingDate', 'storageQuota', 'manageUrl'],
    body_markdown: `# {{tierName}} Renewed!\n\nStorage: {{storageQuota}} | Next Date: {{nextBillingDate}}`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>{{tierName}} Active</h2><p>Billed: {{amountBilled}}</p><a href="{{manageUrl}}">Manage</a></div>`
  },
  {
    id: 'tpl_bug_bounty_payout',
    slug: 'security_bounty',
    name: 'Security Vulnerability Disclosure & Bounty Award',
    category: 'Security & Bug Bounty',
    description: 'Formal acknowledgment of white-hat security report with reward payout notification.',
    subject: '🛡️ Vulnerability Report Acknowledged: Bounty Payout of {{bountyAmount}} FIC Approved',
    variables: ['researcherHandle', 'reportId', 'severity', 'bountyAmount', 'cveId', 'portalUrl'],
    body_markdown: `# Bug Bounty Approved: {{bountyAmount}} FIC\n\nSeverity: {{severity}} | Report: #{{reportId}}`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Bounty Paid: {{bountyAmount}} FIC</h2><p>Severity: {{severity}}</p><a href="{{portalUrl}}">Ledger</a></div>`
  },
  {
    id: 'tpl_protocol_release_changelog',
    slug: 'product_announcements',
    name: 'Major Protocol Upgrade & Ecosystem Changelog',
    category: 'Product & Releases',
    description: 'Broadcast announcing major protocol releases, new dashboard consoles, and client updates.',
    subject: '🚀 Introducing FingerMobile Protocol v2.5: What Is New',
    variables: ['memberName', 'version', 'highlights', 'releaseUrl', 'downloadUrl'],
    body_markdown: `# FingerMobile {{version}} Live!\n\nHighlights:\n{{highlights}}\n\n[Changelog]({{releaseUrl}})`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Protocol {{version}} is Live</h2><a href="{{releaseUrl}}">Read Notes</a></div>`
  },
  {
    id: 'tpl_b2b_enterprise_partner',
    slug: 'partner_enterprise',
    name: 'Enterprise Node Partner Invitation & Agreement',
    category: 'Enterprise & B2B',
    description: 'Formal corporate outreach for institutional partners, node validators, and business hubs.',
    subject: 'Institutional Partnership Invitation: FingerMobile Enterprise Network',
    variables: ['contactName', 'organizationName', 'nodeAllocation', 'contractUrl', 'repEmail'],
    body_markdown: `# Enterprise Invitation for {{organizationName}}\n\nNode Allocation: {{nodeAllocation}}\n\n[Sign Agreement]({{contractUrl}})`,
    body_html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Enterprise Network Invitation</h2><a href="{{contractUrl}}">Review Agreement</a></div>`
  }
];
