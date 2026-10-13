# FingerMobile Protocol — Self-Hosted Plunk & Email Deliverability Architecture

This guide details the complete enterprise architecture, DNS configuration, and reputation safeguards for running FingerMobile's self-hosted, headless email service powered by **Plunk** and **Stalwart MTA**.

---

## 1. System Architecture Overview

```
                                      ┌────────────────────────────────────────────────┐
                                      │             FingerMobile SuperAdmin            │
                                      │        & Back-Office Email Console             │
                                      └───────────────────────┬────────────────────────┘
                                                              │ REST API
                                                              ▼
                                      ┌────────────────────────────────────────────────┐
                                      │       FingerMobile Backend / Communication     │
                                      │          Microservice (Port 3002)              │
                                      └───────────────────────┬────────────────────────┘
                                                              │ Plunk REST API (/v1/send, /v1/track)
                                                              ▼
                                      ┌────────────────────────────────────────────────┐
                                      │          Plunk Headless Engine (Port 9000)     │
                                      │      Markdown/HTML Templates, Queue, Events    │
                                      └───────┬──────────────────────────────┬─────────┘
                                              │                              │
                                     Redis Queue                    PostgreSQL Contacts
                                              │                              │
                                              ▼                              ▼
                                      ┌────────────────────────────────────────────────┐
                                      │        Stalwart Mail Server (Port 25 MTA)      │
                                      │  Automated DKIM 2048-bit Signing, SPF Alignment│
                                      └───────────────────────┬────────────────────────┘
                                                              │ Direct Outbound Port 25
                                                              ▼
                                      ┌────────────────────────────────────────────────┐
                                      │  Major Mailbox Providers (Google, MSFT, Apple) │
                                      │  Checked against: PTR -> SPF -> DKIM -> DMARC  │
                                      └────────────────────────────────────────────────┘
```

---

## 2. Phase 1: Infrastructure & Provider Selection

### A. The Port 25 Constraint
- **Hyperscalers (AWS EC2, Google Cloud Compute, DigitalOcean, Vultr)** block outbound TCP Port 25 by default to combat spam.
- **Recommended Unblocked Hosting Providers**:
  - **Contabo**: VPS & Bare-Metal instances have unblocked Port 25 by default with dedicated static IPv4.
  - **Hetzner**: Allows port 25 unblocking after submitting a legitimate business verification request.
  - **OVHcloud / So you Start**: Enterprise bare-metal instances with dedicated IP failover blocks.

### B. Static IPv4 & Spamhaus Verification
Before binding your email server to a newly provisioned VPS IP:
1. Obtain the assigned Static IPv4 address (e.g., `198.51.100.25`).
2. Run an immediate lookup on **Spamhaus Zen Blocklist** (`pbl.spamhaus.org`, `sbl.spamhaus.org`, `xbl.spamhaus.org`):
   ```bash
   dig +short 25.100.51.198.zen.spamhaus.org
   ```
3. If any return code is `127.0.0.x`, request an immediate IP reallocation from your hosting provider before sending any emails.

---

## 3. Phase 2: Technical DNS & Authentication Stack

All outgoing mail from `fingermobile.com` must pass cryptographic and alignment validation:

```
                ┌──────────────────────────────────────────────┐
                │             Your Domain DNS                  │
                └──────┬──────────────┬──────────────┬─────────┘
                       │              │              │
        ┌──────────────┴──────┐ ┌─────┴────────┐ ┌───┴──────────┐
        │      A Record       │ │  PTR / rDNS  │ │ MX Record    │
        │ (Points domain to   │ │ (Points IP   │ │ (Tells web   │
        │     Server IP)      │ │ to Domain)   │ │ where to     │
        └─────────────────────┘ └──────────────┘ │ deliver mail)│
                                                 └──────────────┘
                       ┌────────────────────────┘
        ┌──────────────┴──────┐ ┌──────────────┐ ┌──────────────┐
        │     SPF Record      │ │ DKIM Record  │ │ DMARC Record │
        │ (Lists allowed IPs) │ │(Cryptographic│ │ (Defines your│
        └─────────────────────┘ │  Signatures) │ │ enforcement  │
                                └──────────────┘ │   policy)    │
                                                 └──────────────┘
```

### Exact DNS Records Required

| Record Type | Host / Name | Type | Value | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A Record** | `mail.fingermobile.com` | `A` | `<VPS_STATIC_IPV4>` | Points mail host to server IP |
| **PTR / rDNS** | Set in VPS Provider Panel | `PTR` | `mail.fingermobile.com` | Reverses IP to domain hostname |
| **MX Record** | `fingermobile.com` | `MX` | `10 mail.fingermobile.com` | Directs inbound routing |
| **SPF Record** | `fingermobile.com` | `TXT` | `v=spf1 ip4:<VPS_STATIC_IPV4> -all` | Authorizes outgoing IPs |
| **DKIM Record** | `s1._domainkey.fingermobile.com` | `TXT` | `v=DKIM1; k=rsa; p=<2048_BIT_PUBLIC_KEY>` | Cryptographic header signature |
| **DMARC Record** | `_dmarc.fingermobile.com` | `TXT` | `v=DMARC1; p=reject; sp=reject; pct=100; aspf=r; adkim=r; rua=mailto:dmarc-reports@fingermobile.com; ruf=mailto:dmarc-forensics@fingermobile.com` | Enforcement & forensic reporting |

---

## 4. Phase 3: IP & Domain Reputation Management

### A. Programmatic 6-Week IP Warm-up Schedule

Sending high email volume on a freshly assigned IP triggers automated blacklisting. The built-in warm-up engine strictly caps daily volume:

| Stage | Daily Sending Cap | Recommended Target Audience | Throttle Delay |
| :--- | :---: | :--- | :---: |
| **Week 1** | **20 emails / day** | Internal SuperAdmin & Seed Accounts | 5.0s between sends |
| **Week 2** | **50 emails / day** | Core Active Community Members & Moderators | 2.5s between sends |
| **Week 3** | **150 emails / day** | Verified Active Members (High Engagement) | 1.0s between sends |
| **Week 4** | **500 emails / day** | Transactional & Critical Notifications | 500ms between sends |
| **Week 5** | **1,500 emails / day** | General Transactional & Onboarding | 200ms between sends |
| **Week 6+** | **Full Scale (25,000+)** | Full Platform Broadcasts & Community Digests | Burst enabled |

### B. Automated Bounce & Suppression Engine
- **Hard Bounces (5xx SMTP codes)**: Instantly recorded in `email_suppressions` with `bounce_type = 'hard'`. Future dispatch to this address is rejected immediately at the application layer.
- **Spam Complaints (FBL)**: Instant blacklisting with `bounce_type = 'complaint'`.
- **Unsubscribes**: One-click RFC 8058 compliant `List-Unsubscribe` headers.

### C. Feedback Loops (FBL)
Register the server hostname with:
1. **Google Postmaster Tools**: Domain reputation, spam rate, authentication success rates.
2. **Microsoft Junk Email Reporting Program (JMRP)** & **Smart Network Data Services (SNDS)**.
