# 📑 DATA PROTECTION IMPACT ASSESSMENT (DPIA)
**Project/Processing:** FingerMobile Content & Lead-Gen Engine
**Controller:** FingerMobile Ltd.
**DPO:** compliance@fingermobile.com
**Date:** October 21, 2026
**Regulatory Scope:** GDPR, NDPR, EU AI Act, DSA, FTC Guidelines

## 1. Processing Description
| Aspect | Detail |
|--------|--------|
| **Purpose** | Deliver personalized content feeds, AI-assisted creation, SME lead-gen tracking, creator monetization, authenticity scoring |
| **Data Subjects** | End-users, creators, business/page admins, employees |
| **Data Categories** | Identifiers (email, username, hashed phone), behavioral (dwell, clicks, views), financial (payouts, tax docs), AI consent flags, C2PA provenance metadata |
| **Processing Operations** | Collection, storage, profiling, AI training, automated decision-making (feed ranking, authenticity scoring), cross-border transfer, retention, deletion |

## 2. Lawful Basis Mapping
| Processing Activity | Legal Basis | Justification |
|---------------------|-------------|---------------|
| Account creation & authentication | Contract (Art. 6(1)(b) GDPR) | Necessary to provide platform access |
| Feed personalization & dwell tracking | Legitimate Interest (Art. 6(1)(f)) + Consent (where AI training) | Balanced via transparency, opt-out, data minimization |
| AI model training & avatar generation | Explicit Consent (Art. 6(1)(a), Art. 9 if biometric) | Granular toggle, opt-out at ingestion, C2PA disclosure |
| Monetization & payouts | Contract + Legal Obligation (tax) | Required for creator economy operations |
| Fraud/pod detection | Legitimate Interest + Regulatory Compliance | Necessary for platform integrity & DSA obligations |

## 3. Risk Assessment & Mitigation
| Risk | Likelihood | Impact | Risk Level | Mitigation Controls |
|------|------------|--------|------------|---------------------|
| Profiling without valid consent | Low | High | Medium | Granular CMP, middleware enforcement, audit logs, quarterly consent audits |
| AI model bias / unfair reach penalty | Medium | High | High | Human-in-the-loop review, fairness testing, appeal workflow, algorithm choice toggle |
| Cross-border data transfer violations | Low | High | Low | AWS regional endpoints, SCCs, data residency routing, NDPR/GDPR alignment |
| PII leakage via E2EE key compromise | Very Low | Critical | Low | Device-bound keys, hardware keystore, zero-server-plaintext, bug bounty program |
| Automated decision-making opacity | Medium | Medium | Medium | Transparency report, ranking factor dashboard, user override (`chronological` mode) |

## 4. Necessity & Proportionality
- **Data Minimization:** Only `dwell_ms`, `qualified_view`, `auth_score`, and `consent_flags` used for ranking. No exact location, IP, or contact details in ML pipelines.
- **Purpose Limitation:** AI training strictly opt-in. Marketing data isolated from analytics. Financial records segregated in append-only ledger.
- **Retention:** Raw events 90d, aggregated 3y, financial 7y, audit logs WORM 7y. Automated purge pipeline tested quarterly.
- **User Control:** One-click consent export, granular revocation, feed algorithm toggle, data deletion within 72h SLA.

## 5. Data Subject Rights Implementation
| Right | Mechanism | SLA |
|-------|-----------|-----|
| Access & Portability | `/v1/users/consent/export`, `/v1/data/export` (JSON/CSV) | 48h |
| Rectification | In-app profile edit, admin override for errors | 24h |
| Erasure ("Right to be Forgotten") | Consent revoke → cascade delete → audit log | 72h |
| Object to Profiling | Feed algorithm toggle, `auth_first` → `chronological` | Immediate |
| Restrict Processing | `consent_flags` set to `false` → blocks non-essential pipelines | Immediate |

## 6. AI Act Compliance (High-Risk Processing)
- **Risk Classification:** Limited/Transparency risk (recommendation + content generation)
- **Controls:** C2PA provenance, AI disclosure tags, human oversight queue, bias testing logs, model cards published quarterly
- **Automated Decision-Making:** Users notified when AI significantly impacts reach/monetization; appeal process via Support Dashboard

## 7. Sign-Off
| Role | Name | Signature | Date |
|------|------|-----------|------|
| Data Protection Officer | ____________________ | ________________ | __________ |
| Chief Technology Officer | ____________________ | ________________ | __________ |
| Head of Product/Growth | ____________________ | ________________ | __________ |
| External Legal Counsel | ____________________ | ________________ | __________ |

*Next Review Date: April 21, 2027 or upon material feature change*