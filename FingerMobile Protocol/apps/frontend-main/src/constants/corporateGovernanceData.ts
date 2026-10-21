/**
 * FingerMobile Protocol - Corporate Governance & 18 Executive Portfolios
 * Blueprint Specification: FingerMobile corporate governance and structure 14102026.md
 * 
 * 18 Executive Leadership Roles, Sub-Offices, Functional Units,
 * Allocated Resources (Human, Technological, Capital),
 * Delegated Authority (DoA) Matrix, RACI Matrix, and SoD Safeguards.
 */

export interface SubOfficeUnit {
  id: string;
  name: string;
  unitType: 'Sub-Office' | 'Functional Unit' | 'Desk' | 'Lab' | 'Secretariat' | 'Office';
  rolesAndResponsibilities: string;
  resources: {
    humanTalent: string;
    techTools: string;
    capitalBudget: string;
  };
}

export interface ReportingStructure {
  administrativeSupervisor: string; // Solid line (—)
  governanceBoardOversight: string; // Dotted line (---)
  statutoryFocus: string;
}

export interface ExecutiveRole {
  id: string;
  roleNumber: number;
  raciCode: string; // R1, R2, R3, etc.
  title: string;
  department: string;
  designatedOfficer: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  assignedMemberEmail?: string;
  clearanceLevel: 'Tier 1 (Board)' | 'Tier 2 (ExCo)' | 'Tier 3 (ED / Group Head)' | 'Tier 4 (Unit Lead)';
  primaryMandate: string;
  coreResponsibilities: string[];
  subOffices: SubOfficeUnit[];
  reportingLines: ReportingStructure;
  isRootProtected?: boolean; // Reserved for Co-Founder CFO Mrs. Mbah Eunice Emonena
  activePersonnelCount: number;
  status: 'OPERATIONAL' | 'ACTIVE_ASSIGNED' | 'UNDER_REVIEW';
}

export interface TechnicalDoAItem {
  id: string;
  domain: string;
  operationalAction: string;
  tier4UnitLead: string;
  tier3EDGroupHead: string;
  tier2ExCoGmdCfo: string;
  tier1BoardOfDirectors: string;
  tier4MaxUsd: number;
  tier3MaxUsd: number;
  tier2MaxUsd: number;
  requiresBoardResolution?: boolean;
}

export interface RaciMatrixRow {
  activityId: string;
  activityName: string;
  domainCode: string;
  domainLabel: string;
  assignments: Record<string, 'R' | 'A' | 'C' | 'I' | 'A/R'>;
}

export interface SodSafeguardRule {
  id: string;
  ruleNumber: number;
  title: string;
  ruleStatement: string;
  enforcementProtocol: string;
  involvedRoles: string[];
  status: 'ACTIVE_ENFORCED';
}

export const INITIAL_18_EXECUTIVE_ROLES: ExecutiveRole[] = [
  {
    id: 'ROLE-01',
    roleNumber: 1,
    raciCode: 'R1',
    title: 'Group Company Secretary',
    department: 'Board Secretariat & Statutory Affairs',
    designatedOfficer: 'Dr. A. E. Okoye',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Acts as the chief advisor on corporate governance, board administration, and statutory corporate secretarial affairs across group entities.',
    coreResponsibilities: [
      'Facilitates Board and Committee meetings, agendas, resolutions, and record-keeping.',
      'Ensures regulatory filings with statutory registries (e.g., Corporate Affairs Commission / Companies House).',
      'Manages shareholder relations, AGM/EGM planning, proxy processes, and director inductions/evaluations.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Chairman of the Board (Solid Line)',
      governanceBoardOversight: 'Board of Directors — Full Board (Dotted Line)',
      statutoryFocus: 'Corporate governance, board records, regulatory compliance'
    },
    subOffices: [
      {
        id: 'U-01-A',
        name: 'Board Secretariat & Governance Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Manages board packs, committee charters, meeting minutes, and board evaluations.',
        resources: {
          humanTalent: 'Corporate governance lawyers, executive secretariat officers, governance researchers',
          techTools: 'Board portal software (Diligent / Nasdaq Boardvantage), encrypted voting vault',
          capitalBudget: 'Secure board meeting infrastructure, off-site retreat and committee audit budget'
        }
      },
      {
        id: 'U-01-B',
        name: 'Statutory Filings & Entity Governance Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Maintains statutory registers, director records, and cross-border corporate filings.',
        resources: {
          humanTalent: 'Statutory compliance paralegals, international entity documentation specialists',
          techTools: 'Corporate registry integration tools, e-filing direct gateways, digital seal repo',
          capitalBudget: 'Annual statutory registry filing fees and multi-jurisdiction franchise license reserves'
        }
      },
      {
        id: 'U-01-C',
        name: 'Shareholder Relations & Registry Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Coordinates dividend distributions, proxy statements, AGM logistics, and registrar liaison.',
        resources: {
          humanTalent: 'Investor relations liaisons, registrar coordinators, proxy tabulation officers',
          techTools: 'Registrar management platforms, secure investor relations portal, proxy ballot engines',
          capitalBudget: 'Annual General Meeting (AGM) production, hybrid virtual broadcast, investor dispatch budget'
        }
      }
    ],
    activePersonnelCount: 12,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-02',
    roleNumber: 2,
    raciCode: 'R2',
    title: 'Group Head, Risk, Credit and Legal',
    department: 'Risk Management, Credit & Legal Affairs',
    designatedOfficer: 'Barr. M. C. Danjuma',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Oversees enterprise risk management (ERM), portfolio credit underwriting/monitoring, and group legal advisory and dispute resolution.',
    coreResponsibilities: [
      'Establishes group-wide credit appraisal frameworks, delegated lending authorities, and non-performing loan (NPL) work-out policies.',
      'Directs contract structuring, cross-border dispute management, and litigation oversight.',
      'Formulates enterprise risk appetite statements and stress-testing protocols.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Risk & Credit Committee (Dotted Line)',
      statutoryFocus: 'Credit policy thresholds, capital risks, major commercial litigation'
    },
    subOffices: [
      {
        id: 'U-02-A',
        name: 'Enterprise Risk Management (ERM) Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Identifies operational, geopolitical, and market risk; runs scenario tests and risk appetite models.',
        resources: {
          humanTalent: 'Certified ERM risk analysts, geopolitical risk modelers, operational resilience specialists',
          techTools: 'GRC platforms (MetricStream / ServiceNow GRC), automated stress-testing engines',
          capitalBudget: 'Third-party macro stress-testing models, risk data subscriptions, threat intelligence feeds'
        }
      },
      {
        id: 'U-02-B',
        name: 'Credit Appraisal & Recovery Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Evaluates credit lines, conducts counterpart due diligence, and manages asset recoveries.',
        resources: {
          humanTalent: 'Commercial credit underwriters, debt workout specialists, asset recovery attorneys',
          techTools: "Credit scoring engines (Moody's / FICO), credit bureau real-time API feeds",
          capitalBudget: 'Credit intelligence feeds, collateral valuation retainers, recovery agency allocations'
        }
      },
      {
        id: 'U-02-C',
        name: 'Corporate Legal Advisory & Litigation Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Drafts cross-border contracts, manages litigation dockets, and instructs external counsel.',
        resources: {
          humanTalent: 'Commercial contract litigators, cross-border regulatory counsel, legal ops managers',
          techTools: 'Contract Lifecycle Management (CLM) software, court docket tracking systems',
          capitalBudget: 'External legal retainer reserves, arbitration deposits, international counsel pool'
        }
      }
    ],
    activePersonnelCount: 18,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-03',
    roleNumber: 3,
    raciCode: 'R3',
    title: 'Group Chief Finance Officer and Fiscal Policy',
    department: 'Finance, Fiscal Policy & Treasury',
    designatedOfficer: 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)',
    clearanceLevel: 'Tier 2 (ExCo)',
    isRootProtected: true, // Irrevocably hardcoded platform root authority
    primaryMandate: 'Directs corporate financial planning, capital structure optimization, tax strategy, and macroeconomic fiscal alignment. Irrevocably bound to Root Master Control.',
    coreResponsibilities: [
      'Oversees financial accounting, management reporting, consolidation, and external audit facilitation.',
      'Develops fiscal tax strategies, transfer pricing frameworks, and sovereign incentive alignments.',
      'Determines debt/equity financing structures and long-range corporate capital allocations.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Audit & Finance Committee (Dotted Line)',
      statutoryFocus: 'Statutory accounts, fiscal tax exposure, capital structure & sovereign treasury'
    },
    subOffices: [
      {
        id: 'U-03-A',
        name: 'Financial Control & Group Accounting',
        unitType: 'Sub-Office',
        rolesAndResponsibilities: 'Oversees statutory reporting (IFRS/GAAP), multi-entity consolidation, and ledger controls.',
        resources: {
          humanTalent: 'Certified chartered accountants (ACA / CPA / ACCA), group reporting controllers',
          techTools: 'ERP systems (SAP S/4HANA / Oracle Cloud ERP), automated ledger reconciliation bots',
          capitalBudget: 'Annual statutory audit reserves, consolidation engine licensing, ledger hardware seals'
        }
      },
      {
        id: 'U-03-B',
        name: 'Fiscal Policy, Tax & Transfer Pricing Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Designs group tax minimization frameworks and defends transfer pricing documentation.',
        resources: {
          humanTalent: 'International corporate tax attorneys, transfer pricing economists, sovereign tax liaisons',
          techTools: 'Tax calculation engines (Thomson Reuters ONESOURCE), transfer pricing databases',
          capitalBudget: 'Big 4 international tax advisory retainers, advance pricing agreement (APA) funds'
        }
      },
      {
        id: 'U-03-C',
        name: 'Corporate Finance & Capital Structuring Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Handles syndicated debt, bond issuances, equity raises, and capital allocation models.',
        resources: {
          humanTalent: 'Investment banking directors, capital markets modelers, corporate treasurers',
          techTools: 'Bloomberg / Refinitiv terminals, institutional financial modeling suites',
          capitalBudget: 'Credit rating agency fees (Moody’s/S&P/Fitch), underwriting and placement fees'
        }
      }
    ],
    activePersonnelCount: 24,
    status: 'ACTIVE_ASSIGNED'
  },
  {
    id: 'ROLE-04',
    roleNumber: 4,
    raciCode: 'R4',
    title: 'Group Head, Consumer Products',
    department: 'Consumer Products & Storefront Retail',
    designatedOfficer: 'K. O. Mensah',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Leads product lifecycle development, consumer portfolio growth, pricing, and merchandising strategy across retail lines.',
    coreResponsibilities: [
      'Drives consumer research, product innovation, and go-to-market (GTM) execution.',
      'Manages product line P&Ls, stock turn rates, and SKU performance evaluations.',
      'Coordinates packaging design, manufacturing schedules, and consumer feedback integration.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Strategy & Commercial Committee (Dotted Line)',
      statutoryFocus: 'P&L targets, category growth, margin retention'
    },
    subOffices: [
      {
        id: 'U-04-A',
        name: 'Product Innovation & Formulation Lab',
        unitType: 'Lab',
        rolesAndResponsibilities: 'Develops prototypes, tests product efficacy, and refines formulations for consumer goods.',
        resources: {
          humanTalent: 'Consumer product R&D scientists, packaging engineers, sensory testing specialists',
          techTools: '3D CAD packaging suites, rapid prototyping equipment, batch trial tracking software',
          capitalBudget: 'Raw material sample procurement, lab consumables, rapid consumer testing pools'
        }
      },
      {
        id: 'U-04-B',
        name: 'SKU Management & Pricing Strategy Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Analyzes product margin, elasticities, lifecycle phase-outs, and retail discounting.',
        resources: {
          humanTalent: 'Commercial pricing strategists, inventory elasticity modelers, SKU rationalization leads',
          techTools: 'Retail analytics platforms (NielsenIQ / Circana), dynamic pricing algorithms',
          capitalBudget: 'Consumer retail market datasets, promotional pricing allowance reserves'
        }
      },
      {
        id: 'U-04-C',
        name: 'Consumer Insights & Market Research Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Conducts focus groups, consumer sentiment surveys, and competitive intelligence.',
        resources: {
          humanTalent: 'Consumer ethnographers, focus group moderators, qualitative data scientists',
          techTools: 'Enterprise survey platforms (Qualtrics), social listening and sentiment monitors',
          capitalBudget: 'Pan-African consumer panel recruitments, mystery shopper stipends, research publications'
        }
      }
    ],
    activePersonnelCount: 14,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-05',
    roleNumber: 5,
    raciCode: 'R5',
    title: 'Group Chief, Audit and Internal Affairs',
    department: 'Internal Audit & Forensic Enquiries',
    designatedOfficer: 'S. N. Al-Mansoor',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Provides independent assurance on internal controls, investigates corporate misconduct, and enforces ethical standards. Zero operational spending limits per SoD rules.',
    coreResponsibilities: [
      'Develops risk-based annual internal audit plans reporting directly to the Board Audit Committee.',
      'Conducts forensic investigations into fraud, waste, corruption, and insider breaches.',
      'Evaluates system and procedural control gaps, recommending remedial actions.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Board Audit Committee (Solid Line — Independent Assurance)',
      governanceBoardOversight: 'Group CEO (Administrative Facilities Only — Dotted Line)',
      statutoryFocus: 'Financial integrity, anti-fraud, internal controls, whistleblower protection'
    },
    subOffices: [
      {
        id: 'U-05-A',
        name: 'Internal Audit Assurance Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Conducts financial, operational, and system control audits across group entities.',
        resources: {
          humanTalent: 'Certified Internal Auditors (CIA), Certified Information Systems Auditors (CISA)',
          techTools: 'Audit management platforms (TeamMate+ / AuditBoard), automated sampling tools',
          capitalBudget: 'Independent board-approved audit operating allocation, external specialist budget'
        }
      },
      {
        id: 'U-05-B',
        name: 'Forensic Investigations & Special Enquiries Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Investigates whistleblower tips, executive misconduct, embezzlement, and asset theft.',
        resources: {
          humanTalent: 'Certified Fraud Examiners (CFE), digital forensics investigators, forensic accountants',
          techTools: 'Digital forensics software (EnCase / Cellebrite), forensic data mining engines',
          capitalBudget: 'Secure digital evidence vaults, chain of custody lockers, undercover enquiry reserves'
        }
      },
      {
        id: 'U-05-C',
        name: 'Whistleblower & Ethics Secretariat',
        unitType: 'Secretariat',
        rolesAndResponsibilities: 'Operates anonymous whistleblowing channels and tracks corporate ethics triage.',
        resources: {
          humanTalent: 'Ethics compliance officers, independent intake intake triage specialists',
          techTools: 'Independent encrypted hotline platform (EthicsPoint / Navex), anonymous dropboxes',
          capitalBudget: 'Third-party hotline intake operations, whistleblower legal protection fund'
        }
      }
    ],
    activePersonnelCount: 9,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-06',
    roleNumber: 6,
    raciCode: 'R6',
    title: 'Group Chief, Policy Compliance Officer',
    department: 'Policy Governance & Regulatory Compliance',
    designatedOfficer: 'Elena Rostova',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Establishes regulatory compliance programs, anti-money laundering (AML/CFT) frameworks, and internal corporate policy governance.',
    coreResponsibilities: [
      'Monitors cross-jurisdictional statutory regulations, sanctions compliance, and statutory licenses.',
      'Enforces Anti-Bribery & Corruption (ABC), AML/CFT/KYC standards, and Politically Exposed Persons (PEP) screenings.',
      'Maintains the group policy repository and drives organization-wide compliance certifications.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Audit & Compliance Committee (Dotted Line)',
      statutoryFocus: 'Sanctions, AML/CFT, statutory certifications, licensing integrity'
    },
    subOffices: [
      {
        id: 'U-06-A',
        name: 'Regulatory Affairs & Licensing Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Tracks industry regulatory changes, submits supervisory returns, and maintains operating permits.',
        resources: {
          humanTalent: 'Regulatory affairs directors, government liaison managers, compliance officers',
          techTools: 'Regulatory tracking dashboards, automated return generation pipelines',
          capitalBudget: 'Statutory supervisory filing fees, license renewal bonds, regulatory inspection funds'
        }
      },
      {
        id: 'U-06-B',
        name: 'AML / CFT & Sanctions Screening Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Manages real-time watchlists, customer due diligence (CDD/EDD), and SAR/STR reporting.',
        resources: {
          humanTalent: 'Certified Anti-Money Laundering Specialists (CAMS), transaction monitoring analysts',
          techTools: 'Sanctions/PEP screening software (LexisNexis Bridger / World-Check), SAR dispatch engine',
          capitalBudget: 'Global sanctions watchlist data subscriptions, automated PEP screening API credits'
        }
      },
      {
        id: 'U-06-C',
        name: 'Policy Governance & Compliance Training Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Authors group policies, monitors mandatory policy sign-offs, and conducts staff training.',
        resources: {
          humanTalent: 'Policy drafting specialists, corporate compliance trainers, instructional designers',
          techTools: 'Compliance LMS platforms, policy versioning repositories, digital attestation trackers',
          capitalBudget: 'Enterprise compliance certification materials, annual training curriculum development'
        }
      }
    ],
    activePersonnelCount: 22,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-07',
    roleNumber: 7,
    raciCode: 'R7',
    title: 'Group Head, Strategic Business Group',
    department: 'Strategic Planning, M&A & Expansion',
    designatedOfficer: 'Marcus Thorne',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Drives group corporate strategy, mergers and acquisitions (M&A), strategic joint ventures, and new market expansion.',
    coreResponsibilities: [
      'Formulates 3–5 year strategic corporate blueprints and monitors strategic KPI execution.',
      'Executes acquisition screening, financial valuation, due diligence, and post-merger integration (PMI).',
      'Incubates transformative business units and exits non-core operations.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Strategy & Commercial Committee (Dotted Line)',
      statutoryFocus: 'M&A transactions, corporate restructurings, strategic joint ventures'
    },
    subOffices: [
      {
        id: 'U-07-A',
        name: 'Corporate Strategy & Market Expansion Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Analyzes market opportunities, competitive shifts, and organic scaling routes.',
        resources: {
          humanTalent: 'Management strategy consultants, corporate economists, market sizing analysts',
          techTools: 'Market intelligence feeds (Gartner / PitchBook / Statista), strategic KPI dashboards',
          capitalBudget: 'Market expansion feasibility studies, local regulatory scoping retainers'
        }
      },
      {
        id: 'U-07-B',
        name: 'M&A and Joint Ventures Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Structures transactions, prepares virtual data rooms (VDR), and negotiates purchase agreements.',
        resources: {
          humanTalent: 'M&A corporate lawyers, investment valuation analysts, corporate dealmakers',
          techTools: 'Virtual Data Room platforms (Datasite / Intralinks), financial valuation models',
          capitalBudget: 'Transaction legal due diligence reserves, financial fairness opinion fees'
        }
      },
      {
        id: 'U-07-C',
        name: 'Post-Merger Integration (PMI) Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Harmonizes operational, cultural, and technological functions of acquired entities.',
        resources: {
          humanTalent: 'PMI program managers, organizational change managers, systems integration leads',
          techTools: 'Synergy tracking consoles, milestone dependency mapping software',
          capitalBudget: 'Integration change management workshops, systems unification bridging funds'
        }
      }
    ],
    activePersonnelCount: 15,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-08',
    roleNumber: 8,
    raciCode: 'R8',
    title: 'Group Head, Franchise Business Services',
    department: 'Franchise Systems & Partner Operations',
    designatedOfficer: 'Tariq Al-Fassi',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Governs group franchise systems, brand franchising models, royalty structures, and partner operational consistency.',
    coreResponsibilities: [
      'Authors franchise disclosure documents (FDD), operating manuals, and quality audit standards.',
      'Screens and onboards franchisee partners; monitors adherence to brand operating standards.',
      'Manages franchise royalty billing, revenue reconciliation, and territory conflict mediation.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Strategy & Commercial Committee (Dotted Line)',
      statutoryFocus: 'Franchisee contracts, territorial licenses, dispute escalation'
    },
    subOffices: [
      {
        id: 'U-08-A',
        name: 'Franchise Acquisition & Onboarding Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Vets prospective franchisees, reviews creditworthiness, and executes agreements.',
        resources: {
          humanTalent: 'Franchise development managers, partner background vetting officers, contract specialists',
          techTools: 'Partner CRM (Salesforce / HubSpot), secure digital agreement signing pipelines',
          capitalBudget: 'Franchise prospect roadshows, marketing collateral, territory mapping systems'
        }
      },
      {
        id: 'U-08-B',
        name: 'Operational Standards & Quality Audit Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Conducts regular audits of franchisee facilities, service delivery, and brand standards.',
        resources: {
          humanTalent: 'Field inspection auditors, mystery shoppers, quality assurance supervisors',
          techTools: 'Mobile field inspection apps, GPS-verified quality scoring systems',
          capitalBudget: 'Mystery shopping logistics budget, partner audit travel, quality certification seals'
        }
      },
      {
        id: 'U-08-C',
        name: 'Royalty Billing & Franchise Support Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Reconciles gross sales, collects royalties, and provides technical/operational support.',
        resources: {
          humanTalent: 'Franchise billing analysts, technical support liaisons, dispute mediators',
          techTools: 'Automated royalty calculation engines, partner ticketing portal',
          capitalBudget: 'Royalty escrow holding reserves, partner support hotline operations'
        }
      }
    ],
    activePersonnelCount: 11,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-09',
    roleNumber: 9,
    raciCode: 'R9',
    title: 'Group Head, Corporate Communications and Marketing',
    department: 'Brand Equity, PR & Marketing',
    designatedOfficer: 'Amara Nwosu',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Protects group brand equity, leads public relations, investor communications, and institutional marketing campaigns.',
    coreResponsibilities: [
      'Manages crisis communications, press relations, and executive thought-leadership visibility.',
      'Oversees omni-channel institutional brand advertising, digital media budgets, and event sponsorships.',
      'Drives internal corporate communications to ensure unified employee messaging.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Governance Committee (Dotted Line)',
      statutoryFocus: 'Crisis communications, brand equity, reputational risk'
    },
    subOffices: [
      {
        id: 'U-09-A',
        name: 'Public Relations & Crisis Communications Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Manages press relations, media monitoring, and executive statements.',
        resources: {
          humanTalent: 'Corporate PR strategists, crisis communications counselors, press spokespersons',
          techTools: 'PR wire distribution networks (PR Newswire), media monitoring engines (Meltwater)',
          capitalBudget: 'Crisis PR agency retainers, media briefing infrastructure, press event reserves'
        }
      },
      {
        id: 'U-09-B',
        name: 'Brand Strategy & Marketing Campaigns Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Deploys marketing budgets, creative assets, and cross-channel campaigns.',
        resources: {
          humanTalent: 'Creative brand directors, copywriters, digital marketing leads, media buyers',
          techTools: 'Adobe Creative Cloud Enterprise, programmatic ad buying platforms',
          capitalBudget: 'Institutional advertising media buying budget, creative agency retainers'
        }
      },
      {
        id: 'U-09-C',
        name: 'Internal Communications & Engagement Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Coordinates town halls, corporate newsletters, and executive internal broadcasts.',
        resources: {
          humanTalent: 'Internal comms leads, employee engagement coordinators, video broadcast technicians',
          techTools: 'Intranet comms platforms (Staffbase / SharePoint), live townhall stream gear',
          capitalBudget: 'Global employee town hall logistics, corporate magazine publication funds'
        }
      }
    ],
    activePersonnelCount: 30,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-10',
    roleNumber: 10,
    raciCode: 'R10',
    title: 'Group Head, Media and Sales Channels',
    department: 'Commercial Sales, Dancia-4Tv & BeatwaveNG',
    designatedOfficer: 'Devon Vance',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Monetizes media properties (Dancia-4Tv / BeatwaveNG) and manages distribution channel networks, commercial sales forces, and direct-to-consumer (D2C) channels.',
    coreResponsibilities: [
      'Drives multi-tier sales strategies: B2B wholesale, modern trade, digital marketplaces, and direct retail.',
      'Monetizes owned media platforms, sponsorships, advertising space, and broadcast properties.',
      'Implements sales incentive programs, quota management, and distributor relationship management.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Strategy & Commercial Committee (Dotted Line)',
      statutoryFocus: 'Revenue performance, ad rate-cards, distributor credit defaults'
    },
    subOffices: [
      {
        id: 'U-10-A',
        name: 'B2B & Enterprise Sales Channels Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Manages major corporate accounts, institutional buyers, and distributor contracts.',
        resources: {
          humanTalent: 'Territory sales directors, enterprise account executives, distributor managers',
          techTools: 'Enterprise CRM systems, sales quota pipelines, distributor sales consoles',
          capitalBudget: 'Commercial incentive bonus pools, distributor roadshows, client trade allowances'
        }
      },
      {
        id: 'U-10-B',
        name: 'Digital Commerce & Marketplace Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Manages direct-to-consumer websites, mobile storefronts, and third-party marketplace hubs.',
        resources: {
          humanTalent: 'Digital merchandisers, conversion rate optimizers, e-commerce ops leads',
          techTools: 'E-commerce engines (Shopify Plus / Magento / Custom FingerMobile Storefronts)',
          capitalBudget: 'Digital marketplace listing fees, payment gateway integration reserves'
        }
      },
      {
        id: 'U-10-C',
        name: 'Media Monetization & Ad Sales Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Sells advertising space, media partnerships, and corporate brand sponsorships across Dancia-4Tv and BeatwaveNG.',
        resources: {
          humanTalent: 'Media ad sales planners, broadcast sponsorship negotiators, rate card strategists',
          techTools: 'Ad server engines (Google Ad Manager), digital audio/video insertion tools',
          capitalBudget: 'Broadcast sponsorship packaging assets, ad agency commission reserves'
        }
      }
    ],
    activePersonnelCount: 28,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-11',
    roleNumber: 11,
    raciCode: 'R11',
    title: 'Group Head, Information Technology',
    department: 'Enterprise IT, Cloud & Cybersecurity',
    designatedOfficer: 'Kenji Takahashi',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Manages enterprise IT infrastructure, cybersecurity defense, software development, and technical business support.',
    coreResponsibilities: [
      'Directs cloud architecture, multi-data-center operations, and disaster recovery readiness.',
      'Establishes cybersecurity defense centers (SOC), perimeter security, and endpoint protection.',
      'Builds and maintains custom enterprise applications and integration APIs.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Technology & Cybersecurity Committee (Dotted Line)',
      statutoryFocus: 'Cyber posture, disaster recovery, enterprise systems uptime, SOC response'
    },
    subOffices: [
      {
        id: 'U-11-A',
        name: 'Cybersecurity Operations Center (SOC)',
        unitType: 'Office',
        rolesAndResponsibilities: 'Monitors live network threats, runs vulnerability assessments, and handles security incidents 24/7.',
        resources: {
          humanTalent: 'SOC incident commanders, ethical penetration testers, threat hunting analysts',
          techTools: 'SIEM / SOAR platforms (Splunk / Microsoft Sentinel), automated EDR agents',
          capitalBudget: 'Bug bounty programs, zero-day threat intelligence subscriptions, cyber insurance'
        }
      },
      {
        id: 'U-11-B',
        name: 'Cloud Infrastructure & Data Center Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Manages hybrid clouds (AWS/Azure/GCP), physical servers, and network backups.',
        resources: {
          humanTalent: 'DevOps architects, Site Reliability Engineers (SRE), database administrators',
          techTools: 'Cloud orchestration suites (Kubernetes / Terraform), multi-region backup vaults',
          capitalBudget: 'Multi-cloud hosting compute/storage spend, dark fiber connection contracts'
        }
      },
      {
        id: 'U-11-C',
        name: 'Enterprise Applications & Helpdesk Support',
        unitType: 'Sub-Office',
        rolesAndResponsibilities: 'Maintains core business software (ERP/CRM/HRIS) and provides Tier 1–3 technical support.',
        resources: {
          humanTalent: 'IT service delivery managers, ERP developers, Tier 1–3 desktop technicians',
          techTools: 'ITSM ticketing tools (Jira Service Management / ServiceNow), MDM software',
          capitalBudget: 'Enterprise software licensing renewals, hardware refresh pools, peripherals'
        }
      }
    ],
    activePersonnelCount: 45,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-12',
    roleNumber: 12,
    raciCode: 'R12',
    title: 'Group Head, Operations, Budget, Products, Project and Planning',
    department: 'Enterprise PMO, Operations & OPEX Budget',
    designatedOfficer: 'Claire Dupont',
    clearanceLevel: 'Tier 3 (ED / Group Head)',
    primaryMandate: 'Coordinates core business operations, project delivery (PMO), operational budgeting, and cross-functional planning.',
    coreResponsibilities: [
      'Aligns operational budgets with strategic group priorities and enforces spending discipline.',
      'Directs the enterprise Project Management Office (PMO) for capital and operational initiatives.',
      'Eliminates operational bottlenecks through process optimization and standard operating procedures (SOPs).'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO / COO (Solid Line)',
      governanceBoardOversight: 'Board Finance Committee (Dotted Line)',
      statutoryFocus: 'OPEX variance, cross-subsidiary project delivery, operational KPIs'
    },
    subOffices: [
      {
        id: 'U-12-A',
        name: 'Enterprise PMO & Project Delivery Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Manages project schedules, project managers, and capital project execution across the group.',
        resources: {
          humanTalent: 'Certified PMP / Agile program managers, project controls engineers, scrum masters',
          techTools: 'Project portfolio management tools (Smartsheet / Asana / MS Project)',
          capitalBudget: 'Strategic project contingent reserve, PMO external consulting pool'
        }
      },
      {
        id: 'U-12-B',
        name: 'Operational Budgeting & Variance Control Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Consolidates operational expenditures (OPEX) and performs variance analyses against targets.',
        resources: {
          humanTalent: 'Operational budget analysts, variance controllers, cost containment specialists',
          techTools: 'Financial planning software (Anaplan / Adaptive Insights), real-time variance trackers',
          capitalBudget: 'Budget audit reviews, operational benchmarking database subscriptions'
        }
      },
      {
        id: 'U-12-C',
        name: 'Process Engineering & Operational Planning Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Redesigns operating models, drafts SOPs, and manages operational capacity planning.',
        resources: {
          humanTalent: 'Lean Six Sigma Black Belts, business process architects, workflow designers',
          techTools: 'Process mapping tools (Lucidchart / Signavio), workflow automation tools',
          capitalBudget: 'Kaizen process workshop funding, external operational re-engineering retainers'
        }
      }
    ],
    activePersonnelCount: 19,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-13',
    roleNumber: 13,
    raciCode: 'R13',
    title: 'Executive Director, International Treasury',
    department: 'International Treasury, FX & Global Banking',
    designatedOfficer: 'Hon. O. B. Mbah',
    clearanceLevel: 'Tier 2 (ExCo)',
    primaryMandate: 'Manages offshore liquidity, foreign exchange (FX) hedging, sovereign debt portfolios, and international banking relationships.',
    coreResponsibilities: [
      'Establishes cash pooling, multi-currency sweeping, and working capital optimization across subsidiaries.',
      'Executes currency derivatives, forward contracts, interest rate swaps, and cross-border trades.',
      'Manages global correspondent banking relationships, lines of credit, and offshore covenants.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group CFO (Solid Line)',
      governanceBoardOversight: 'Board Risk & Finance Committee (Dotted Line)',
      statutoryFocus: 'Offshore liquidity, FX swaps, counterparty exposures, cash pooling'
    },
    subOffices: [
      {
        id: 'U-13-A',
        name: 'FX Hedging & Structured Derivatives Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Hedging currency exposure, evaluating forward markets, and interest rate swaps.',
        resources: {
          humanTalent: 'FX quantitative traders, derivative structuring specialists, currency risk officers',
          techTools: 'Treasury Management Systems (Kyriba / FIS Quantum), Bloomberg FX trading terminals',
          capitalBudget: 'Derivative margin deposit accounts, ISDA collateral lines with tier-1 brokers'
        }
      },
      {
        id: 'U-13-B',
        name: 'Global Liquidity & Cash Management Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Oversees cash-pooling mechanisms, bank account administration, and fund transfers.',
        resources: {
          humanTalent: 'Global liquidity managers, cash pool controllers, SWIFT bank administrators',
          techTools: 'SWIFT Alliance gateway, multi-bank host-to-host API integration portals',
          capitalBudget: 'International transactional fee buffers, automated zero-balance sweeping pools'
        }
      },
      {
        id: 'U-13-C',
        name: 'Correspondent Banking & Sovereign Debt Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Negotiates bilateral credit lines and monitors international sovereign risk.',
        resources: {
          humanTalent: 'Correspondent banking relationship managers, sovereign debt analysts, loan covenant officers',
          techTools: 'Credit rating agency feeds, sovereign debt tracking models',
          capitalBudget: 'Legal documentation structuring retainers, letter of credit issuance fees'
        }
      }
    ],
    activePersonnelCount: 16,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-14',
    roleNumber: 14,
    raciCode: 'R14',
    title: 'Executive Director, Finance & Risk Management',
    department: 'Financial Resilience, ALM & Enterprise Solvency',
    designatedOfficer: 'A. I. Bello',
    clearanceLevel: 'Tier 2 (ExCo)',
    primaryMandate: 'Synthesizes financial resilience with operational risk, capital adequacy, and board-level risk reporting.',
    coreResponsibilities: [
      'Evaluates the financial impact of enterprise risk, asset-liability matching (ALM), and liquidity buffers.',
      'Manages corporate insurance programs, reinsurance placements, and financial loss indemnities.',
      'Directs capital adequacy reporting, risk-adjusted return on capital (RAROC), and solvency ratios.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group CFO (Solid Line)',
      governanceBoardOversight: 'Board Risk & Finance Committee (Dotted Line)',
      statutoryFocus: 'Capital adequacy, enterprise insurance, ALM gaps, RAROC modeling'
    },
    subOffices: [
      {
        id: 'U-14-A',
        name: 'Asset-Liability Management (ALM) Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Evaluates balance sheet duration, interest rate risk, and institutional liquidity reserves.',
        resources: {
          humanTalent: 'Quantitative financial engineers, ALM directors, balance sheet modelers',
          techTools: 'ALM modeling platforms (QRM / Ambit), duration matching simulators',
          capitalBudget: 'Institutional liquidity buffer reserve, interest rate sensitivity software licensing'
        }
      },
      {
        id: 'U-14-B',
        name: 'Corporate Insurance & Risk Transfer Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Procures D&O insurance, property/casualty policies, and negotiates loss claims.',
        resources: {
          humanTalent: 'Corporate insurance brokers, loss claims adjusters, risk transfer specialists',
          techTools: 'Insurance policy tracking portal, claims loss modeling suites',
          capitalBudget: 'Annual D&O, cyber liability, and comprehensive property insurance premium pools'
        }
      },
      {
        id: 'U-14-C',
        name: 'Capital Adequacy & Solvency Assurance Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Tracks regulatory capital buffers, stress scenarios, and financial solvency indicators.',
        resources: {
          humanTalent: 'Regulatory capital modelers, actuarial analysts, financial stress testers',
          techTools: 'Statistical analysis tools (R / Python / MATLAB), regulatory capital calculators',
          capitalBudget: 'Third-party solvency audit verifications, capital adequacy modeling retainers'
        }
      }
    ],
    activePersonnelCount: 21,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-15',
    roleNumber: 15,
    raciCode: 'R15',
    title: 'Executive Director, Protocol, Logistics & IP Resources',
    department: 'Diplomatic Protocol, Global Logistics & IP Protection',
    designatedOfficer: 'IP Office Overseer',
    clearanceLevel: 'Tier 2 (ExCo)',
    primaryMandate: 'Directs diplomatic protocol, global executive logistics, supply chain transport, and Intellectual Property (IP) asset protection.',
    coreResponsibilities: [
      'Coordinates diplomatic courtesies, executive aviation, VIP clearances, and government relations.',
      'Oversees freight forwarding, fleet operations, bonded warehousing, and customs clearance.',
      'Protects and commercializes the group\'s patent, trademark, and copyright portfolios.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Head, Operations (Solid Line)',
      governanceBoardOversight: 'Board Governance Committee (Dotted Line)',
      statutoryFocus: 'Executive security, asset protection, IP enforcement, diplomatic clearances'
    },
    subOffices: [
      {
        id: 'U-15-A',
        name: 'Executive Protocol & Diplomatic Affairs Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Manages VIP travel, immigration visas, airport lounge access, and state protocol.',
        resources: {
          humanTalent: 'Diplomatic liaison officers, executive protection specialists, VIP travel coordinators',
          techTools: 'Secure diplomatic flight tracking software, biometric VIP clearance portals',
          capitalBudget: 'Executive aircraft charter reserves, VIP lounge memberships, government liaison budget'
        }
      },
      {
        id: 'U-15-B',
        name: 'Global Supply Chain Logistics & Fleet Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Directs long-haul shipping, customs clearing, regional warehousing, and vehicle tracking.',
        resources: {
          humanTalent: 'Logistics directors, customs brokerage liaisons, fleet telematics managers',
          techTools: 'Transportation Management Systems (TMS), real-time satellite GPS telematics',
          capitalBudget: 'Bonded warehouse leasing, fleet acquisition/maintenance capital, freight insurance'
        }
      },
      {
        id: 'U-15-C',
        name: 'Intellectual Property (IP) Management Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Registers trademarks, enforces patent claims, and monetizes brand IP licenses globally.',
        resources: {
          humanTalent: 'Patent attorneys, trademark portfolio managers, anti-counterfeit specialists',
          techTools: 'IP management databases (Anaqua / Clarivate), global trademark search crawlers',
          capitalBudget: 'International WIPO / USPTO patent and trademark registration fees, litigation enforcement reserves'
        }
      }
    ],
    activePersonnelCount: 35,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-16',
    roleNumber: 16,
    raciCode: 'R16',
    title: 'Executive Director, Human Resources and Compliance',
    department: 'Human Capital, Executive Remuneration & Labor',
    designatedOfficer: 'Fatima Zahra',
    clearanceLevel: 'Tier 2 (ExCo)',
    primaryMandate: 'Leads human capital strategy, executive compensation, organizational design, labor law compliance, and statutory employment standards.',
    coreResponsibilities: [
      'Directs global talent acquisition, leadership succession planning, and corporate culture.',
      'Manages executive remuneration, benefit schemes, and employee equity programs.',
      'Ensures compliance with labor standards, OSHA workplace safety regulations, and union agreements.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Remuneration & HR Committee (Dotted Line)',
      statutoryFocus: 'Executive compensation, labor disputes, OSHA compliance, employee welfare'
    },
    subOffices: [
      {
        id: 'U-16-A',
        name: 'Talent Acquisition & Succession Planning Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Recruits critical talent, builds executive succession pipelines, and manages onboarding.',
        resources: {
          humanTalent: 'Executive headhunters, talent acquisition specialists, employer brand leads',
          techTools: 'Human Capital Management suite (Workday / SAP SuccessFactors), AI candidate matching',
          capitalBudget: 'Executive search firm retainers, recruitment marketing budgets, onboarding toolkits'
        }
      },
      {
        id: 'U-16-B',
        name: 'Total Rewards & Executive Compensation Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Structures base pay scales, long-term incentive plans (LTIP), and healthcare benefits.',
        resources: {
          humanTalent: 'Executive compensation consultants, benefits administrators, payroll specialists',
          techTools: 'Compensation benchmark tools (Mercer / Korn Ferry), LTIP equity tracking software',
          capitalBudget: 'Global employee healthcare insurance schemes, executive pension/gratuity reserves'
        }
      },
      {
        id: 'U-16-C',
        name: 'Labor Relations & Workplace Compliance Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Handles disciplinary tribunals, union relations, labor regulations, and workplace safety (OSHA).',
        resources: {
          humanTalent: 'Labor attorneys, union negotiation officers, certified OSHA safety inspectors',
          techTools: 'Workplace safety incident tracking software, grievance logging case manager',
          capitalBudget: 'Dispute arbitration reserves, safety equipment inventory, workplace health facilities'
        }
      }
    ],
    activePersonnelCount: 14,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-17',
    roleNumber: 17,
    raciCode: 'R17',
    title: 'Executive Director, Procurement',
    department: 'Supply Chain, Strategic Sourcing & Tenders',
    designatedOfficer: 'Kwame Asante',
    clearanceLevel: 'Tier 2 (ExCo)',
    primaryMandate: 'Governs group-wide strategic sourcing, vendor management, supply negotiations, and procurement cost optimization.',
    coreResponsibilities: [
      'Formulates group-wide procurement governance policies and approval thresholds.',
      'Negotiates high-value vendor master services agreements (MSAs) and contracts for direct and indirect spend.',
      'Manages supplier risk assessments, supply chain diversity, and ethical vendor certifications.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group CFO / COO (Solid Line)',
      governanceBoardOversight: 'Board Audit & Finance Committee (Dotted Line)',
      statutoryFocus: 'Strategic vendor approvals, high-value tenders, ethical sourcing & MSA terms'
    },
    subOffices: [
      {
        id: 'U-17-A',
        name: 'Strategic Sourcing & Category Management Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Leads procurement for raw materials, IT systems, operational supplies, and services.',
        resources: {
          humanTalent: 'Category sourcing directors, direct materials buyers, spend analytics leads',
          techTools: 'E-procurement platforms (Coupa / SAP Ariba), global supplier spend dashboards',
          capitalBudget: 'Bulk purchase credit facilities, category contract benchmarking retainers'
        }
      },
      {
        id: 'U-17-B',
        name: 'Vendor Due Diligence & Contract Negotiation Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Negotiates price breaks, payment terms, vendor SLAs, and audits vendor financials.',
        resources: {
          humanTalent: 'Contract negotiation specialists, vendor risk assessors, commercial legal liaisons',
          techTools: 'Vendor onboarding portals, supplier financial health monitors (Dun & Bradstreet)',
          capitalBudget: 'Vendor ESG certification audit budgets, contract negotiation legal support funds'
        }
      },
      {
        id: 'U-17-C',
        name: 'Inventory Control & Purchase Operations Unit',
        unitType: 'Functional Unit',
        rolesAndResponsibilities: 'Issues purchase orders (POs), monitors deliveries, and resolves invoice-PO discrepancies.',
        resources: {
          humanTalent: 'Inventory controllers, PO dispatch coordinators, three-way match analysts',
          techTools: 'ERP procurement modules, automated 3-way matching bots, barcode inventory tools',
          capitalBudget: 'Buffer stock working capital, purchase order expediting emergency reserve'
        }
      }
    ],
    activePersonnelCount: 13,
    status: 'OPERATIONAL'
  },
  {
    id: 'ROLE-18',
    roleNumber: 18,
    raciCode: 'R18',
    title: 'Executive Director, Blockchain and Infinity Coin',
    department: 'Decentralized Protocols, Web3 & Infinity Coin Core',
    designatedOfficer: 'Dr. Satoshi Sterling',
    clearanceLevel: 'Tier 2 (ExCo)',
    primaryMandate: 'Manages the group\'s decentralized ecosystem, proprietary token architecture ("Infinity Coin"), smart contract security, and Web3 asset management.',
    coreResponsibilities: [
      'Oversees the economic design, tokenomics, staking models, and liquidity pools for Infinity Coin.',
      'Directs the deployment, auditing, and maintenance of smart contracts and decentralized ledgers.',
      'Ensures compliance with Virtual Asset Service Provider (VASP) laws, MiCA, and cryptographic reserve management.'
    ],
    reportingLines: {
      administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
      governanceBoardOversight: 'Board Technology & Innovation Committee (Dotted Line)',
      statutoryFocus: 'Smart contract audits, tokenomics reserve ratios, VASP & MiCA compliance'
    },
    subOffices: [
      {
        id: 'U-18-A',
        name: 'Tokenomics & Digital Asset Treasury Desk',
        unitType: 'Desk',
        rolesAndResponsibilities: 'Manages market-making agreements, liquidity provisions, and treasury token reserves.',
        resources: {
          humanTalent: 'Quantitative crypto traders, token economists, liquidity pool managers',
          techTools: 'Multi-sig custodial infrastructure (Fireblocks / Safe), crypto market data feeds',
          capitalBudget: 'Automated market maker (AMM) liquidity seeding funds, staking incentive pool'
        }
      },
      {
        id: 'U-18-B',
        name: 'Smart Contract Engineering & Security Lab',
        unitType: 'Lab',
        rolesAndResponsibilities: 'Develops protocol layers, audits smart contracts, and leads protocol upgrades.',
        resources: {
          humanTalent: 'Senior Solidity / Rust protocol engineers, cryptographic security auditors',
          techTools: 'Static analysis suites (Slither / Mythril / Echidna), formal verification engines',
          capitalBudget: 'Third-party smart contract audit retainers (CertiK / OpenZeppelin), testnet validator nodes'
        }
      },
      {
        id: 'U-18-C',
        name: 'Web3 Ecosystem & VASP Compliance Office',
        unitType: 'Office',
        rolesAndResponsibilities: 'Manages digital asset regulatory licensing (VASP/MiCA), wallet AML tracing, and developer grants.',
        resources: {
          humanTalent: 'Web3 regulatory attorneys, blockchain forensics analysts, developer community leads',
          techTools: 'Blockchain analytics suites (Chainalysis / Elliptic), smart contract telemetry monitors',
          capitalBudget: 'Web3 developer ecosystem grant funds, VASP supervisory licensing registration fees'
        }
      }
    ],
    activePersonnelCount: 52,
    status: 'OPERATIONAL'
  }
];

export const TECHNICAL_DOA_MATRIX: TechnicalDoAItem[] = [
  {
    id: 'DOA-01',
    domain: 'Capex & Procurement',
    operationalAction: 'Budgeted Capital Expenditure',
    tier4UnitLead: 'Up to $25,000 (₦32.5M)',
    tier3EDGroupHead: 'Up to $250,000 (₦325M)',
    tier2ExCoGmdCfo: 'Up to $1,000,000 (₦1.3B)',
    tier1BoardOfDirectors: '> $1,000,000 (₦1.3B)',
    tier4MaxUsd: 25000,
    tier3MaxUsd: 250000,
    tier2MaxUsd: 1000000
  },
  {
    id: 'DOA-02',
    domain: 'Capex & Procurement',
    operationalAction: 'Unbudgeted Capital Expenditure',
    tier4UnitLead: 'Nil (Strictly Blocked)',
    tier3EDGroupHead: 'Up to $50,000 (₦65M)',
    tier2ExCoGmdCfo: 'Up to $250,000 (₦325M)',
    tier1BoardOfDirectors: '> $250,000 (₦325M)',
    tier4MaxUsd: 0,
    tier3MaxUsd: 50000,
    tier2MaxUsd: 250000
  },
  {
    id: 'DOA-03',
    domain: 'Capex & Procurement',
    operationalAction: 'Vendor Contract Signing (Master Services Agreement - MSA)',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Up to $100,000',
    tier2ExCoGmdCfo: 'Up to $1,000,000',
    tier1BoardOfDirectors: '> $1,000,000 (Full Board Ratification)',
    tier4MaxUsd: 0,
    tier3MaxUsd: 100000,
    tier2MaxUsd: 1000000
  },
  {
    id: 'DOA-04',
    domain: 'Capex & Procurement',
    operationalAction: 'Emergency Asset Replacement',
    tier4UnitLead: 'Up to $10,000',
    tier3EDGroupHead: 'Up to $100,000',
    tier2ExCoGmdCfo: 'Up to $500,000',
    tier1BoardOfDirectors: 'Post-ratification required for > $500,000',
    tier4MaxUsd: 10000,
    tier3MaxUsd: 100000,
    tier2MaxUsd: 500000
  },
  {
    id: 'DOA-05',
    domain: 'Opex & Operating Invoices',
    operationalAction: 'Budgeted Operational Invoices',
    tier4UnitLead: 'Up to $50,000',
    tier3EDGroupHead: 'Up to $500,000',
    tier2ExCoGmdCfo: 'Up to $2,500,000',
    tier1BoardOfDirectors: '> $2,500,000 (Board Finance Committee)',
    tier4MaxUsd: 50000,
    tier3MaxUsd: 500000,
    tier2MaxUsd: 2500000
  },
  {
    id: 'DOA-06',
    domain: 'Opex & Operating Invoices',
    operationalAction: 'Single-Source Tender Waiver',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Nil',
    tier2ExCoGmdCfo: 'Up to $100,000 (Role 6 Audit + Role 3 Approval)',
    tier1BoardOfDirectors: '> $100,000 (Board Audit Committee)',
    tier4MaxUsd: 0,
    tier3MaxUsd: 0,
    tier2MaxUsd: 100000
  },
  {
    id: 'DOA-07',
    domain: 'Treasury & Banking',
    operationalAction: 'FX Spot Transactions',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Up to $1,000,000',
    tier2ExCoGmdCfo: 'Up to $10,000,000',
    tier1BoardOfDirectors: '> $10,000,000',
    tier4MaxUsd: 0,
    tier3MaxUsd: 1000000,
    tier2MaxUsd: 10000000
  },
  {
    id: 'DOA-08',
    domain: 'Treasury & Banking',
    operationalAction: 'FX Forwards / Structured Swaps',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Up to $500,000',
    tier2ExCoGmdCfo: 'Up to $5,000,000',
    tier1BoardOfDirectors: '> $5,000,000 (Board Risk Committee)',
    tier4MaxUsd: 0,
    tier3MaxUsd: 500000,
    tier2MaxUsd: 5000000
  },
  {
    id: 'DOA-09',
    domain: 'Treasury & Banking',
    operationalAction: 'Inter-Company Cash Sweeps',
    tier4UnitLead: 'Up to $250,000',
    tier3EDGroupHead: 'Up to $2,000,000',
    tier2ExCoGmdCfo: 'Up to $20,000,000',
    tier1BoardOfDirectors: '> $20,000,000',
    tier4MaxUsd: 250000,
    tier3MaxUsd: 2000000,
    tier2MaxUsd: 20000000
  },
  {
    id: 'DOA-10',
    domain: 'Treasury & Banking',
    operationalAction: 'Bank Account Opening / Closure',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Nil',
    tier2ExCoGmdCfo: 'Joint GMD/CEO + CFO Approval',
    tier1BoardOfDirectors: 'Formal Board Resolution Mandatory',
    tier4MaxUsd: 0,
    tier3MaxUsd: 0,
    tier2MaxUsd: 0,
    requiresBoardResolution: true
  },
  {
    id: 'DOA-11',
    domain: 'Credit & Risk Limits',
    operationalAction: 'Counterparty Commercial Credit Line',
    tier4UnitLead: 'Up to $50,000',
    tier3EDGroupHead: 'Up to $250,000',
    tier2ExCoGmdCfo: 'Up to $2,000,000',
    tier1BoardOfDirectors: '> $2,000,000 (Board Risk & Credit Committee)',
    tier4MaxUsd: 50000,
    tier3MaxUsd: 250000,
    tier2MaxUsd: 2000000
  },
  {
    id: 'DOA-12',
    domain: 'Credit & Risk Limits',
    operationalAction: 'Bad Debt Write-Off / Settlement',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Up to $25,000',
    tier2ExCoGmdCfo: 'Up to $250,000',
    tier1BoardOfDirectors: '> $250,000 (Board Audit Committee)',
    tier4MaxUsd: 0,
    tier3MaxUsd: 25000,
    tier2MaxUsd: 250000
  },
  {
    id: 'DOA-13',
    domain: 'Credit & Risk Limits',
    operationalAction: 'Legal Settlement / Claims Compromise',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Up to $20,000',
    tier2ExCoGmdCfo: 'Up to $150,000',
    tier1BoardOfDirectors: '> $150,000 (Board Approval Required)',
    tier4MaxUsd: 0,
    tier3MaxUsd: 20000,
    tier2MaxUsd: 150000
  },
  {
    id: 'DOA-14',
    domain: 'Digital Assets & Web3',
    operationalAction: 'Infinity Coin Treasury Mint / Burn',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Nil',
    tier2ExCoGmdCfo: 'Joint Founder SuperAdmin + ED Blockchain',
    tier1BoardOfDirectors: 'Board Resolution & Root Master Seal',
    tier4MaxUsd: 0,
    tier3MaxUsd: 0,
    tier2MaxUsd: 0,
    requiresBoardResolution: true
  },
  {
    id: 'DOA-15',
    domain: 'Digital Assets & Web3',
    operationalAction: 'Liquidity Pool Capital Allocations',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Up to $100,000',
    tier2ExCoGmdCfo: 'Up to $1,000,000',
    tier1BoardOfDirectors: '> $1,000,000 (Board Tech & Innovation Committee)',
    tier4MaxUsd: 0,
    tier3MaxUsd: 100000,
    tier2MaxUsd: 1000000
  },
  {
    id: 'DOA-16',
    domain: 'Digital Assets & Web3',
    operationalAction: 'Smart Contract Mainnet Deployments',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Technical Approval (Role 18)',
    tier2ExCoGmdCfo: 'Operational Sign-off (Role 3 & Role 11)',
    tier1BoardOfDirectors: 'Board Audit Committee Security Clearance',
    tier4MaxUsd: 0,
    tier3MaxUsd: 0,
    tier2MaxUsd: 0
  },
  {
    id: 'DOA-17',
    domain: 'Human Capital & Payroll',
    operationalAction: 'Headcount Approval (Within Budget)',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Approves Staff Levels L1–L6',
    tier2ExCoGmdCfo: 'Approves Management Levels L7–L9',
    tier1BoardOfDirectors: 'ExCo / Board Approval for Executive L10+',
    tier4MaxUsd: 0,
    tier3MaxUsd: 0,
    tier2MaxUsd: 0
  },
  {
    id: 'DOA-18',
    domain: 'Human Capital & Payroll',
    operationalAction: 'Out-of-Budget Hiring Request',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Nil',
    tier2ExCoGmdCfo: 'GMD/CEO + ED HR Joint Approval',
    tier1BoardOfDirectors: 'Board Remuneration Committee Sign-off',
    tier4MaxUsd: 0,
    tier3MaxUsd: 0,
    tier2MaxUsd: 0
  },
  {
    id: 'DOA-19',
    domain: 'Human Capital & Payroll',
    operationalAction: 'Disciplinary Termination (Non-Exec)',
    tier4UnitLead: 'Nil',
    tier3EDGroupHead: 'Approves Staff Levels L1–L6',
    tier2ExCoGmdCfo: 'Approves Management Levels L7–L9',
    tier1BoardOfDirectors: 'Board Remuneration & Legal for L10+',
    tier4MaxUsd: 0,
    tier3MaxUsd: 0,
    tier2MaxUsd: 0
  }
];

export const RACI_ROLES_LEGEND = [
  { code: 'R1', label: 'Group Company Secretary' },
  { code: 'R2', label: 'Group Head, Risk, Credit & Legal' },
  { code: 'R3', label: 'Group CFO & Fiscal Policy' },
  { code: 'R5', label: 'Group Chief, Audit & IA' },
  { code: 'R6', label: 'Group Chief, Policy Compliance' },
  { code: 'R7', label: 'Group Head, Strategic Business' },
  { code: 'R11', label: 'Group Head, IT' },
  { code: 'R12', label: 'Group Head, Operations & PMO' },
  { code: 'R13', label: 'ED, International Treasury' },
  { code: 'R14', label: 'ED, Finance & Risk Management' },
  { code: 'R16', label: 'ED, HR & Compliance' },
  { code: 'R17', label: 'ED, Procurement' },
  { code: 'R18', label: 'ED, Blockchain & Infinity Coin' }
];

export const CROSS_FUNCTIONAL_RACI_MATRIX: RaciMatrixRow[] = [
  {
    activityId: 'ACT-01',
    activityName: 'Annual Operating & Capital Budget Creation',
    domainCode: 'CAPEX_BUDGET',
    domainLabel: 'Capital Allocation & Budgeting',
    assignments: {
      R1: 'I', R2: 'C', R3: 'A', R5: 'I', R6: 'C', R7: 'C',
      R11: 'C', R12: 'R', R13: 'C', R14: 'C', R16: 'C', R17: 'C', R18: 'C'
    }
  },
  {
    activityId: 'ACT-02',
    activityName: 'Strategic Sourcing (> $250k Procurement)',
    domainCode: 'SOURCING',
    domainLabel: 'Major Strategic Sourcing & Procurement',
    assignments: {
      R1: 'I', R2: 'C', R3: 'C', R5: 'I', R6: 'C', R7: 'I',
      R11: 'C', R12: 'C', R13: 'I', R14: 'I', R16: 'I', R17: 'A/R', R18: 'I'
    }
  },
  {
    activityId: 'ACT-03',
    activityName: 'Corporate Hedging & FX Derivative Execution',
    domainCode: 'TREASURY_FX',
    domainLabel: 'Treasury & FX Risk Management',
    assignments: {
      R1: 'I', R2: 'C', R3: 'A', R5: 'I', R6: 'C', R7: 'I',
      R11: 'I', R12: 'I', R13: 'R', R14: 'C', R16: 'I', R17: 'I', R18: 'I'
    }
  },
  {
    activityId: 'ACT-04',
    activityName: 'Enterprise Cyber Breach Remediation',
    domainCode: 'CYBER_SECURITY',
    domainLabel: 'Enterprise IT & Cyber Incident Response',
    assignments: {
      R1: 'C', R2: 'C', R3: 'I', R5: 'C', R6: 'C', R7: 'I',
      R11: 'A/R', R12: 'C', R13: 'I', R14: 'C', R16: 'C', R17: 'I', R18: 'C'
    }
  },
  {
    activityId: 'ACT-05',
    activityName: 'Whistleblower Fraud Case Investigation',
    domainCode: 'FORENSICS',
    domainLabel: 'Regulatory Enforcement & Internal Affairs',
    assignments: {
      R1: 'C', R2: 'C', R3: 'I', R5: 'A/R', R6: 'C', R7: 'I',
      R11: 'I', R12: 'I', R13: 'I', R14: 'I', R16: 'C', R17: 'I', R18: 'I'
    }
  },
  {
    activityId: 'ACT-06',
    activityName: 'Regulatory Policy Sanction & AML Screening',
    domainCode: 'COMPLIANCE',
    domainLabel: 'Statutory AML/CFT & Sanctions Compliance',
    assignments: {
      R1: 'C', R2: 'C', R3: 'I', R5: 'C', R6: 'A/R', R7: 'I',
      R11: 'I', R12: 'I', R13: 'C', R14: 'C', R16: 'C', R17: 'C', R18: 'C'
    }
  },
  {
    activityId: 'ACT-07',
    activityName: 'Smart Contract Mainnet Deployment',
    domainCode: 'WEB3_PROTOCOL',
    domainLabel: 'Digital Asset Minting & Web3 Infrastructure',
    assignments: {
      R1: 'I', R2: 'C', R3: 'I', R5: 'C', R6: 'C', R7: 'I',
      R11: 'C', R12: 'I', R13: 'I', R14: 'C', R16: 'I', R17: 'I', R18: 'A/R'
    }
  },
  {
    activityId: 'ACT-08',
    activityName: 'Infinity Coin Liquidity Rebalancing',
    domainCode: 'WEB3_TREASURY',
    domainLabel: 'Digital Asset Treasury & Liquidity Pools',
    assignments: {
      R1: 'I', R2: 'C', R3: 'C', R5: 'I', R6: 'C', R7: 'I',
      R11: 'I', R12: 'I', R13: 'C', R14: 'C', R16: 'I', R17: 'I', R18: 'A/R'
    }
  },
  {
    activityId: 'ACT-09',
    activityName: 'Cross-Border M&A Due Diligence',
    domainCode: 'STRATEGY_MA',
    domainLabel: 'Mergers, Acquisitions & Divestments',
    assignments: {
      R1: 'C', R2: 'C', R3: 'C', R5: 'I', R6: 'C', R7: 'A/R',
      R11: 'C', R12: 'C', R13: 'C', R14: 'C', R16: 'C', R17: 'I', R18: 'I'
    }
  },
  {
    activityId: 'ACT-10',
    activityName: 'Executive Compensation Structuring',
    domainCode: 'HUMAN_CAPITAL',
    domainLabel: 'Executive Remuneration & Board Charters',
    assignments: {
      R1: 'C', R2: 'C', R3: 'C', R5: 'I', R6: 'C', R7: 'I',
      R11: 'I', R12: 'I', R13: 'I', R14: 'I', R16: 'A/R', R17: 'I', R18: 'I'
    }
  },
  {
    activityId: 'ACT-11',
    activityName: 'Asset-Liability & Capital Adequacy Stress Tests',
    domainCode: 'RISK_CAPITAL',
    domainLabel: 'Enterprise Solvency & Capital Buffers',
    assignments: {
      R1: 'I', R2: 'C', R3: 'C', R5: 'I', R6: 'I', R7: 'I',
      R11: 'I', R12: 'I', R13: 'C', R14: 'A/R', R16: 'I', R17: 'I', R18: 'I'
    }
  },
  {
    activityId: 'ACT-12',
    activityName: 'Annual Board Statutory Disclosures',
    domainCode: 'GOVERNANCE_SEC',
    domainLabel: 'Statutory Governance & Board Reporting',
    assignments: {
      R1: 'A/R', R2: 'C', R3: 'C', R5: 'C', R6: 'C', R7: 'I',
      R11: 'I', R12: 'I', R13: 'I', R14: 'I', R16: 'C', R17: 'I', R18: 'I'
    }
  }
];

export const SOD_SAFEGUARDS: SodSafeguardRule[] = [
  {
    id: 'SOD-01',
    ruleNumber: 1,
    title: 'Internal Audit Independence Rule',
    ruleStatement: 'Role 5 (Group Chief, Audit & Internal Affairs) holds zero operational approval limits within the DoA. Role 5 can never act as "Responsible" or "Accountable" for spending, operations, or policy design to maintain audit objectivity.',
    enforcementProtocol: 'System locks all financial transaction approvals, PO sign-offs, and ledger mutations for Role 5 account IDs. Independent direct channel to Board Audit Committee.',
    involvedRoles: ['Role 5 (Audit & Internal Affairs)', 'Board Audit Committee'],
    status: 'ACTIVE_ENFORCED'
  },
  {
    id: 'SOD-02',
    ruleNumber: 2,
    title: 'Dual-Key Digital Asset Authorization (Asymmetric Multi-Sig)',
    ruleStatement: 'Any transfer of assets from the Infinity Coin reserve treasury exceeding $100,000 (or equivalent in tokens) requires asymmetric multi-signature execution: Key A held by Role 18 (ED, Blockchain), Key B held by Role 13 (ED, International Treasury), and Key C held by Role 3 (Group CFO), requiring at least 2 of 3 authorizations.',
    enforcementProtocol: 'On-chain multi-sig smart contract (2-of-3 threshold) tied to hardware enclave YubiKey credentials. Transfers without M-of-N consensus automatically revert.',
    involvedRoles: ['Role 18 (Blockchain Core)', 'Role 13 (International Treasury)', 'Role 3 (Group CFO)'],
    status: 'ACTIVE_ENFORCED'
  },
  {
    id: 'SOD-03',
    ruleNumber: 3,
    title: 'Single-Source Procurement Escalation Protocol',
    ruleStatement: 'Any purchase order originating from Role 17 (ED, Procurement) that circumvents competitive bidding must be audited for compliance by Role 6 (Policy Compliance) and approved by Role 3 (Group CFO) before contractual commitments can be made.',
    enforcementProtocol: 'Three-stage electronic gating: Procurement generates waiver justification -> Compliance performs PEP/conflict check -> CFO unlocks purchase order disbursement.',
    involvedRoles: ['Role 17 (Procurement)', 'Role 6 (Policy Compliance)', 'Role 3 (Group CFO)'],
    status: 'ACTIVE_ENFORCED'
  },
  {
    id: 'SOD-04',
    ruleNumber: 4,
    title: 'Legal & Compliance Deadlock Protocol',
    ruleStatement: 'If Role 2 (Legal) and Role 6 (Compliance) provide conflicting determinations on cross-border operations or regulatory exposure, the matter is referred directly to the Board Audit & Compliance Committee alongside an independent external legal opinion commissioned by Role 1 (Group Company Secretary).',
    enforcementProtocol: 'Automated administrative freeze on conflicting transaction or operational launch until Board Committee minute resolution is uploaded and notarized by Company Secretary.',
    involvedRoles: ['Role 2 (Legal)', 'Role 6 (Compliance)', 'Role 1 (Company Secretary)', 'Board Audit Committee'],
    status: 'ACTIVE_ENFORCED'
  }
];

export const CORPORATE_GOVERNANCE_LOCAL_STORAGE_KEY = 'fingermobile_corporate_governance_v1';

export function getStoredCorporateRoles(): ExecutiveRole[] {
  try {
    const raw = localStorage.getItem(CORPORATE_GOVERNANCE_LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read corporate roles from localStorage, using initial defaults:', err);
  }
  return INITIAL_18_EXECUTIVE_ROLES;
}

export function saveStoredCorporateRoles(roles: ExecutiveRole[]): void {
  try {
    localStorage.setItem(CORPORATE_GOVERNANCE_LOCAL_STORAGE_KEY, JSON.stringify(roles));
  } catch (err) {
    console.error('Failed to persist corporate roles to localStorage:', err);
  }
}
