# 📑 DATA PROTECTION IMPACT ASSESSMENT (DPIA)
**Project/Processing:** FingerMobile Content & Lead-Gen Engine  
**Controller:** FingerMobile Ltd.  
**DPO Contact:** compliance@fingermobile.com  
**Date:** October 21, 2026  
**Regulatory Scope:** Nigeria Data Protection Act (NDPA 2023), EU GDPR (Regulation (EU) 2016/679), EU AI Act (Regulation (EU) 2024/1689), EU Digital Services Act (DSA), US FTC Guidelines  

---

## 1. Processing Description
| Aspect | Detail |
|---|---|
| **Purpose** | Deliver personalized content feeds, AI-assisted creation, SME lead-gen tracking, creator monetization, authenticity scoring, and fintech transaction ledger processing. |
| **Data Subjects** | End-users, verified creators, SME business/page admins, platform operators, and consumers across Nigeria and West Africa. |
| **Data Categories** | Identifiers (email, username, hashed phone, NIN/BVN tokenized references for high-tier accounts), behavioral telemetry (dwell time, clicks, qualified views, share actions), financial records (settlements, ledger writes, tax invoices), granular AI consent flags (`essential`, `functional`, `analytics`, `marketing`, `ai_training`), and C2PA content provenance metadata. |
| **Processing Operations** | Collection, tokenization, edge caching (AWS Lagos Local Zone / CloudFront), storage (Aurora Multi-AZ, DynamoDB, S3 WORM), profiling, AI model training, automated feed ranking, cross-border replication, automated retention expiration, and cascaded deletion. |

---

## 2. Lawful Basis Mapping
| Processing Activity | Legal Basis | Justification |
|---|---|---|
| **Account creation & authentication** | Contractual Necessity (Art. 6(1)(b) GDPR / NDPA Section 25) | Required to provide account access, identity verification, and platform security. |
| **Feed personalization & dwell tracking** | Legitimate Interest (Art. 6(1)(f)) + Consent (where AI training is involved) | Balanced via user transparency reports, feed mode overrides (`chronological` vs `auth_first`), and telemetry minimization. |
| **AI model training & avatar generation** | Explicit Consent (Art. 6(1)(a), Art. 9 if biometric features used) | Enforced by granular CMP (`ConsentManager.tsx`), `consentGuard` middleware, and C2PA manifest tagging. Opt-out supported at any time. |
| **Fintech transactions, monetization & payouts** | Contractual Necessity + Legal Obligation (CBN/NDPA regulations & tax codes) | Immutable, append-only ledger processing with Multi-AZ PostgreSQL and AWS RDS Proxy connection pooling. |
| **Fraud, spam & engagement pod detection** | Legitimate Interest + Regulatory Mandate (DSA obligations) | Real-time heuristic anomaly detection to safeguard platform integrity, anti-money laundering (AML), and user safety. |

---

## 3. Risk Assessment & Mitigation Matrix
| Risk Identification | Likelihood | Impact | Severity | Technical & Organizational Mitigations |
|---|---|---|---|---|
| **Profiling without valid or refreshed consent** | Low | High | Medium | Granular CMP with first-launch modal, `consentGuard` middleware blocking unconsented requests with HTTP 403, and WORM S3 audit trails. |
| **AI model bias or discriminatory reach penalties** | Medium | High | High | Human-in-the-loop audit queue, algorithmic fairness evaluations, model cards, transparency scorecards, and user appeal mechanisms. |
| **Cross-border data residency violations** | Low | High | Low | AWS Lagos Local Zone deployment keeping Nigerian citizen financial and primary PII within national borders; SCCs and encryption in transit (TLS 1.2+). |
| **PII leakage via key compromise** | Very Low | Critical | Low | Customer-managed KMS keys with automatic annual rotation, hardware keystores, zero plaintext storage on disk, and S3 Object Lock COMPLIANCE mode. |
| **Automated decision-making opacity** | Medium | Medium | Medium | In-app "Why am I seeing this?" ranking factor breakdown, one-click toggle to chronological feed, and quarterly public algorithmic transparency audits. |

---

## 4. Necessity & Proportionality
- **Data Minimization:** Only `dwell_ms`, `qualified_view`, `auth_score`, and verified `consent_flags` are passed to feed ranking algorithms. Raw GPS coordinates, unmasked IP addresses, and contact books are completely excluded from ML training pipelines.
- **Purpose Limitation:** AI model training is strictly opt-in (`ai_training: true`). Analytics events are anonymized. Financial ledgers are segregated in dedicated append-only tables with restricted VPC access.
- **Retention Standards:** 
  - Raw telemetry events: 90 days.
  - Aggregated analytics: 3 years.
  - Financial transaction ledgers: 7 years (2555 days) in S3 Object Lock WORM compliance tier.
  - Automated deletion pipeline runs continuously with daily integrity audits.
- **User Self-Service Controls:** Instant export of consent history (`/v1/users/consent/export`), granular toggling via `ConsentManager`, and guaranteed erasure within a 72-hour SLA.

---

## 5. Data Subject Rights Implementation
| Right Under NDPA / GDPR | Technical Mechanism | Guaranteed SLA |
|---|---|---|
| **Right of Access & Portability** | In-app self-service download and authenticated API endpoint `/v1/data/export` (JSON / CSV). | ≤ 48 hours |
| **Right to Rectification** | Profile editing console and admin support escalation queue. | ≤ 24 hours |
| **Right to Erasure ("Right to be Forgotten")** | Automated revocation trigger cascading through PostgreSQL, Redis caches, and DynamoDB, logging to immutable WORM S3 audit trail. | ≤ 72 hours |
| **Right to Object to Profiling** | Algorithmic switch from `auth_first` feed to chronological feed, plus toggle to disable interest-based lead targeting. | Immediate (< 1 second) |
| **Right to Restrict Processing** | Toggling any category (`analytics`, `marketing`, `ai_training`) to `false` in `ConsentManager` instantly blocks downstream pipelines. | Immediate (< 1 second) |

---

## 6. EU AI Act Governance (High-Risk & Transparency Classification)
- **Classification:** Limited risk (content recommendation engine) with transparency obligations (synthetic content generation, avatars, AI-assisted lead copy).
- **Core Controls:**
  - **C2PA Provenance:** All AI-generated media tagged with cryptographic metadata.
  - **Visible Disclosures:** Standardized UI badges indicating AI-generated or AI-enhanced content.
  - **Human Oversight:** High-reach posts flagged by automated moderation route to human review queues before enforcement actions take place.
  - **Model Cards & Bias Auditing:** Published quarterly to the public Transparency Center.

---

## 7. Formal Sign-Off & Approvals
| Role | Name | Signature Status | Review Date |
|---|---|---|---|
| **Data Protection Officer (DPO)** | Chief Privacy & Compliance Officer | *Approved & Signed* | October 21, 2026 |
| **Chief Technology Officer (CTO)** | Lead Systems Architect | *Approved & Signed* | October 21, 2026 |
| **Head of Product & Growth** | Lead Product Strategist | *Approved & Signed* | October 21, 2026 |
| **External Legal Counsel** | Regulatory Technology Advisory | *Approved & Signed* | October 21, 2026 |

*Next Scheduled Review: April 21, 2027 (or immediately upon introduction of any material AI model architecture change).*
