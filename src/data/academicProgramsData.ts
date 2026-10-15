/**
 * FingerMobile Academic Programs & Sovereign Digital Training Academy Data
 * E-Learning initiative to train 5,000 citizens across 37 Nigerian states
 * Business Logic: QUARTERLY SUBSCRIPTION BASED model with different course module tiers,
 * paired with the National Sovereign Scholarship Fellowship Fund.
 *
 * Covers the 5 core architecture components:
 * 1. Off-Campus End-to-End Academic Courses & Programs (Quarterly Subscription Based)
 * 2. Assessment Management (All 5 Types: QUIZ, EXAM, ASSIGNMENT, PROJECT, PRACTICAL & 8 Q-Types)
 * 3. Gradebook Functionality & Letter Grade Scales (A+ to F conversion)
 * 4. Financial Modules & Quarterly Subscription Billing
 * 5. Academic Calendar System
 */

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'lab' | 'reading' | 'quiz';
  description: string;
  isCompleted?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  description: string;
  lessons: LessonItem[];
}

export interface AcademicCourse {
  id: string;
  title: string;
  category: 'ai' | 'cloud' | 'security' | 'marketing' | 'content' | 'product' | 'multilateral';
  categoryLabel: string;
  targetSkill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Executive';
  duration: string;
  credits: number;
  accreditedBy: string;
  isMultilateral: boolean;
  partnerOrganization?: string;
  partnerBadge?: string;
  partnerUrl?: string;
  // Quarterly Subscription Pricing
  quarterlySubscriptionNgn: number;
  quarterlySubscriptionFic: number;
  subscriptionTier: 'Standard' | 'Professional' | 'Executive' | 'Creator' | 'Venture' | 'Multilateral';
  scholarshipEligible: boolean;
  enrolledCitizens: number;
  targetCitizens: number;
  rating: number;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    affiliation: string;
  };
  summary: string;
  learningOutcomes: string[];
  modules: CourseModule[];
  bannerUrl: string;
}

export type AssessmentType = 'QUIZ' | 'EXAM' | 'ASSIGNMENT' | 'PROJECT' | 'PRACTICAL';

export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'ESSAY'
  | 'MATCHING'
  | 'ORDERING'
  | 'FILE_UPLOAD'
  | 'AUDIO_RESPONSE';

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  marks: number;
  options?: string[];
  correctAnswer?: string | string[] | number | boolean;
  pairs?: Array<{ left: string; right: string }>;
  sequenceItems?: string[];
  sampleRubric?: string;
}

export interface AssessmentItem {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  type: AssessmentType;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  dueDate: string;
  status: 'UPCOMING' | 'ACTIVE' | 'SUBMITTED' | 'GRADED';
  attemptsAllowed: number;
  attemptsUsed: number;
  score?: number;
  letterGrade?: string;
  questions: AssessmentQuestion[];
  instructions: string;
}

export interface GradeEntry {
  id: string;
  studentId: string;
  studentName: string;
  studentState: string;
  courseId: string;
  courseTitle: string;
  assessmentId: string;
  assessmentTitle: string;
  assessmentType: AssessmentType;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  letterGrade: string;
  gradePoints: number;
  weightagePercent: number;
  evaluatedAt: string;
  evaluatorFeedback: string;
}

export interface StudentTranscript {
  studentId: string;
  fullName: string;
  stateOfOrigin: string;
  matricNumber: string;
  cohort: string;
  academicYear: string;
  cumulativeGpa: number;
  totalCreditsEarned: number;
  scholarshipGrant: string;
  verificationHash: string;
  courseRecords: Array<{
    courseCode: string;
    title: string;
    credits: number;
    score: number;
    letterGrade: string;
    gradePoint: number;
    status: 'COMPLETED' | 'IN_PROGRESS';
  }>;
}

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface FinancialInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  studentState: string;
  courseTitle: string;
  feeType: 'QUARTERLY_SUBSCRIPTION' | 'LAB_ACCREDITATION' | 'CERTIFICATION_EXAM' | 'INFRASTRUCTURE';
  billingQuarter: string;
  amountFic: number;
  amountNgn: number;
  scholarshipSubsidized: boolean;
  subsidyPercentage: number;
  netPayableFic: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paymentMethod?: 'FIC_SMART_CONTRACT' | 'NAIRA_GATEWAY' | 'STATE_GRANT_FUND';
}

export interface FeeStructure {
  id: string;
  programCategory: string;
  quarterlyNgn: number;
  quarterlyFic: number;
  tier: string;
  examFeeNgn: number;
  labAccessFeeNgn: number;
  scholarshipCoveragePercent: number;
  description: string;
}

export type CalendarEventType =
  | 'CLASS_SESSION'
  | 'EXAM_PERIOD'
  | 'HOLIDAY'
  | 'BREAK'
  | 'ENROLLMENT_PERIOD'
  | 'ADVISORY_MEETING'
  | 'ACADEMIC_CEREMONY';

export type CalendarEventStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'POSTPONED';

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  status: CalendarEventStatus;
  startDate: string;
  endDate: string;
  timeSlot: string;
  term: 'TERM_1_2026' | 'TERM_2_2026' | 'ANNUAL_CAPSTONE';
  location: string;
  organizer: string;
  registeredCount: number;
  capacity: number;
  description: string;
  isRegistered?: boolean;
}

export interface StateEnrollmentCohort {
  state: string;
  zone: 'North-Central' | 'North-East' | 'North-West' | 'South-East' | 'South-South' | 'South-West';
  enrolledCount: number;
  targetCount: number;
  scholarshipSlotsAssigned: number;
  topSkillTrack: string;
}

// ==================== 1. CURATED ACADEMIC COURSES (QUARTERLY SUBSCRIPTION PRICING) ====================
export const ACADEMIC_COURSES: AcademicCourse[] = [
  {
    id: 'course-ai-01',
    title: 'Autonomous AI & Deep Learning Systems Engineering',
    category: 'ai',
    categoryLabel: 'AI & Machine Learning',
    targetSkill: 'Agentic Workflows, Neural Architecture & LLM Ops',
    difficulty: 'Advanced',
    duration: '12 Weeks (120 Hours)',
    credits: 6,
    accreditedBy: 'FingerMobile Sovereign Tech Council',
    isMultilateral: false,
    quarterlySubscriptionNgn: 120000,
    quarterlySubscriptionFic: 200,
    subscriptionTier: 'Executive',
    scholarshipEligible: true,
    enrolledCitizens: 1140,
    targetCitizens: 1250,
    rating: 4.95,
    instructor: {
      name: 'Dr. Chinedu Okafor',
      role: 'Principal AI Research Scientist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      affiliation: 'Center for Distributed Machine Intelligence'
    },
    summary: 'Comprehensive hands-on mastery of neural network architectures, retrieval augmented generation (RAG), autonomous subagents, fine-tuning, and edge inference optimization across African mobile nodes.',
    learningOutcomes: [
      'Architect resilient autonomous agent swarms with custom memory banks',
      'Train & quantize open LLMs for low-latency smartphone edge deployment',
      'Deploy enterprise multimodal RAG pipelines with vector databases',
      'Master cryptographic model validation & privacy-preserving inference'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'mod-ai-1',
        title: 'Module 1: Foundations of Agentic Intelligence & Vector Spaces',
        duration: '3 Weeks',
        description: 'Mathematical linear algebra, embeddings, and vector similarity benchmarks.',
        lessons: [
          { id: 'les-ai-101', title: 'High-Dimensional Vector Math & Cosine Projections', duration: '45 mins', type: 'video', description: 'Deep dive into semantic space representation.' },
          { id: 'les-ai-102', title: 'Hands-on Lab: Indexing 100,000 African Legal Records in Milvus', duration: '90 mins', type: 'lab', description: 'Practical vector indexing and querying.' },
          { id: 'les-ai-103', title: 'Quiz: Vector Distance Functions & Tokenizer Metrics', duration: '15 mins', type: 'quiz', description: 'Quick sprint assessment on embeddings.' }
        ]
      },
      {
        id: 'mod-ai-2',
        title: 'Module 2: Autonomous Subagent Swarms & Tool Calling',
        duration: '4 Weeks',
        description: 'Orchestrating multi-agent systems with MCP protocol and dynamic execution.',
        lessons: [
          { id: 'les-ai-201', title: 'MCP Protocol Specs & Client/Host Architecture', duration: '60 mins', type: 'video', description: 'Understanding lazy-loaded tool schemas.' },
          { id: 'les-ai-202', title: 'Hands-on Lab: Multi-Agent Consensus Protocol Implementation', duration: '120 mins', type: 'lab', description: 'Building peer-reviewed agent loops.' }
        ]
      },
      {
        id: 'mod-ai-3',
        title: 'Module 3: Edge Quantization & Mobile Deployment in Nigeria',
        duration: '5 Weeks',
        description: 'Running 4-bit quantized models on low-power devices with zero cloud dependency.',
        lessons: [
          { id: 'les-ai-301', title: 'GGUF & AWQ Quantization for Snapdragon / MediaTek SOCs', duration: '50 mins', type: 'video', description: 'Bit-level quantization mechanics.' },
          { id: 'les-ai-302', title: 'Capstone Project: Local AI Agricultural Disease Classifier', duration: '180 mins', type: 'lab', description: 'Deploying real-time offline AI model.' }
        ]
      }
    ]
  },
  {
    id: 'course-cloud-02',
    title: 'Cloud Computing & Distributed DevOps Infrastructure',
    category: 'cloud',
    categoryLabel: 'Cloud Computing & Distributed DevOps',
    targetSkill: 'Kubernetes, Terraform, Bare-Metal Clouds & Microservices',
    difficulty: 'Intermediate',
    duration: '10 Weeks (100 Hours)',
    credits: 5,
    accreditedBy: 'FingerMobile Distributed Systems Board',
    isMultilateral: false,
    quarterlySubscriptionNgn: 95000,
    quarterlySubscriptionFic: 160,
    subscriptionTier: 'Professional',
    scholarshipEligible: true,
    enrolledCitizens: 980,
    targetCitizens: 1000,
    rating: 4.88,
    instructor: {
      name: 'Engr. Fatima Bello',
      role: 'Staff Infrastructure Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      affiliation: 'African Cloud Infrastructure Guild'
    },
    summary: 'Build sovereign cloud networks, multi-region resilient clusters, GitOps continuous delivery pipelines, and containerized microservices engineered for unpredictable network environments.',
    learningOutcomes: [
      'Deploy production Kubernetes clusters with automated ingress and TLS',
      'Manage Infrastructure as Code across local data centers using Terraform',
      'Set up low-bandwidth monitoring using Prometheus, Grafana, and OpenTelemetry',
      'Implement zero-downtime blue-green deployments for mission-critical apps'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'mod-cloud-1',
        title: 'Module 1: Container Runtime & Linux Kernel Virtualization',
        duration: '3 Weeks',
        description: 'Namespaces, cgroups, layered storage drivers, and rootless Docker.',
        lessons: [
          { id: 'les-c-101', title: 'Linux cgroups v2 & Security Profiles', duration: '40 mins', type: 'video', description: 'Deep container isolation principles.' },
          { id: 'les-c-102', title: 'Lab: Building a Minimalist Alpine Microservice Image', duration: '60 mins', type: 'lab', description: 'Optimizing container size under 15MB.' }
        ]
      },
      {
        id: 'mod-cloud-2',
        title: 'Module 2: High Availability Kubernetes Clusters in Lagos & Abuja',
        duration: '4 Weeks',
        description: 'etcd consensus, raft clusters, ingress routing, and pod autoscaling.',
        lessons: [
          { id: 'les-c-201', title: 'Kubernetes Control Plane Failure Modes', duration: '75 mins', type: 'video', description: 'Recovering broken etcd leader state.' },
          { id: 'les-c-202', title: 'Lab: Multi-Master k3s Cluster on Sovereign Nodes', duration: '120 mins', type: 'lab', description: 'Deploying fault-tolerant control nodes.' }
        ]
      }
    ]
  },
  {
    id: 'course-sec-03',
    title: 'CyberSecurity & Cryptographic Defence Architecture',
    category: 'security',
    categoryLabel: 'CyberSecurity & Cryptographic Defence',
    targetSkill: 'Zero Trust, Threat Hunting, Penetration Testing & Cryptography',
    difficulty: 'Advanced',
    duration: '10 Weeks (100 Hours)',
    credits: 5,
    accreditedBy: 'African Sovereign Defense Consortium',
    isMultilateral: false,
    quarterlySubscriptionNgn: 100000,
    quarterlySubscriptionFic: 170,
    subscriptionTier: 'Professional',
    scholarshipEligible: true,
    enrolledCitizens: 840,
    targetCitizens: 900,
    rating: 4.92,
    instructor: {
      name: 'Adekunle Adeleke',
      role: 'Chief Cryptographic Security Auditor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      affiliation: 'FingerMobile Red Team Lead'
    },
    summary: 'Master defensive threat mitigation, zero-trust cryptographic identities, SOC telemetry monitoring, elliptic-curve cryptography, and secure smart contract auditing.',
    learningOutcomes: [
      'Conduct rigorous OWASP Top 10 penetration audits against web services',
      'Implement Ed25519 and secp256k1 cryptographic signature verification',
      'Configure Suricata IDS and Wazuh SIEM monitoring across 37 state hubs',
      'Defend fintech payment gateways against replay attacks and token interception'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'mod-sec-1',
        title: 'Module 1: Sovereign Cryptography & Asymmetric Vaults',
        duration: '3 Weeks',
        description: 'Public-key cryptography, Diffie-Hellman exchanges, and hardware HSMs.',
        lessons: [
          { id: 'les-s-101', title: 'Elliptic Curve Math: From Weierstrass to Montgomery', duration: '55 mins', type: 'video', description: 'Mathematical foundations of modern crypto.' },
          { id: 'les-s-102', title: 'Lab: Hardening NGINX with TLS 1.3 & Post-Quantum Ciphers', duration: '90 mins', type: 'lab', description: 'Configuring Kyber quantum-safe key exchange.' }
        ]
      }
    ]
  },
  {
    id: 'course-mkt-04',
    title: 'Online Marketing Skills & Sovereign Growth Engineering',
    category: 'marketing',
    categoryLabel: 'Online Marketing & Sovereign Growth',
    targetSkill: 'SEO, Algorithmic Virality, Funnel Conversion & Analytics',
    difficulty: 'Beginner',
    duration: '8 Weeks (80 Hours)',
    credits: 4,
    accreditedBy: 'Digital Commerce Guild of Nigeria',
    isMultilateral: false,
    quarterlySubscriptionNgn: 60000,
    quarterlySubscriptionFic: 100,
    subscriptionTier: 'Standard',
    scholarshipEligible: true,
    enrolledCitizens: 790,
    targetCitizens: 850,
    rating: 4.84,
    instructor: {
      name: 'Amaka Eze',
      role: 'Growth Marketing Director',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=250&q=80',
      affiliation: 'West African Media Labs'
    },
    summary: 'Learn high-converting digital marketing, retention automation, programmatic SEO, paid audience acquisition, and localized community building for African consumer markets.',
    learningOutcomes: [
      'Execute hyper-targeted social ad campaigns across Instagram, TikTok, and YouTube',
      'Optimize technical SEO and Core Web Vitals to rank #1 organically',
      'Build automated email and WhatsApp marketing workflows with high conversion',
      'Analyze customer acquisition cost (CAC) and lifetime value (LTV) cohorts'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'mod-mkt-1',
        title: 'Module 1: High-Conversion Copywriting & Psychological Triggers',
        duration: '2 Weeks',
        description: 'Writing magnetic headlines and persuasive value propositions.',
        lessons: [
          { id: 'les-m-101', title: 'The PAS and AIDA Frameworks for Nigerian E-Commerce', duration: '40 mins', type: 'video', description: 'Direct response marketing masterclass.' }
        ]
      }
    ]
  },
  {
    id: 'course-media-05',
    title: 'Content Creation: 4K Cinema, Audio & Viral Visual Media',
    category: 'content',
    categoryLabel: 'Content Creation (4K Media & Video)',
    targetSkill: 'Color Grading, Davinci Resolve, BeatwaveNG & Visual Storytelling',
    difficulty: 'Beginner',
    duration: '8 Weeks (80 Hours)',
    credits: 4,
    accreditedBy: 'Nollywood & African Digital Creators Institute',
    isMultilateral: false,
    quarterlySubscriptionNgn: 75000,
    quarterlySubscriptionFic: 125,
    subscriptionTier: 'Creator',
    scholarshipEligible: true,
    enrolledCitizens: 710,
    targetCitizens: 750,
    rating: 4.96,
    instructor: {
      name: 'Kunle Bakare',
      role: 'Master Cinematographer & Audio Producer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      affiliation: 'FingerMobile Studio Works'
    },
    summary: 'Master professional 4K videography, cinematic lighting, multi-track Afrobeats music production with BeatwaveNG, and viral short-form editing for global monetization.',
    learningOutcomes: [
      'Shoot and light high-production 4K video using affordable mirrorless gear',
      'Master DaVinci Resolve color grading, node graphs, and HDR delivery',
      'Record, mix, and master crisp vocals and polyrhythmic Afrobeats percussion',
      'Monetize original creative catalogs via FingerMobile PhotoCredits & Dancia4TV'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'mod-med-1',
        title: 'Module 1: Composition, Framing & Lighting Ratios',
        duration: '2 Weeks',
        description: 'Three-point lighting, motivated light sources, and anamorphic aesthetics.',
        lessons: [
          { id: 'les-v-101', title: 'Sculpting Faces with Key, Fill, and Hair Lights', duration: '45 mins', type: 'video', description: 'Cinematic lighting setups on a budget.' }
        ]
      }
    ]
  },
  {
    id: 'course-prod-06',
    title: 'Agile Product Management & Tech Venture Building',
    category: 'product',
    categoryLabel: 'Agile Product Management',
    targetSkill: 'User Research, PRD Authoring, Sprint Orchestration & Unit Economics',
    difficulty: 'Intermediate',
    duration: '8 Weeks (80 Hours)',
    credits: 4,
    accreditedBy: 'Sovereign Product Managers Guild',
    isMultilateral: false,
    quarterlySubscriptionNgn: 80000,
    quarterlySubscriptionFic: 135,
    subscriptionTier: 'Venture',
    scholarshipEligible: true,
    enrolledCitizens: 610,
    targetCitizens: 650,
    rating: 4.89,
    instructor: {
      name: 'Ngozi Okonkwo',
      role: 'VP of Product Innovation',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
      affiliation: 'Lagos Tech Ecosystem Mentors'
    },
    summary: 'From problem validation to scale: learn how to write bulletproof PRDs, prioritize feature backlogs, run dual-track agile sprints, and achieve product-market fit.',
    learningOutcomes: [
      'Write structured Product Requirement Documents (PRDs) with clear user stories',
      'Conduct unbiased user discovery interviews across diverse demographics',
      'Calculate unit economics: ARPU, Burn Rate, Runway, and Contribution Margins',
      'Lead cross-functional engineering and design squads with Jira and Linear'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'mod-prd-1',
        title: 'Module 1: Problem Discovery & Customer Pain Point Validation',
        duration: '2 Weeks',
        description: 'Jobs-To-Be-Done (JTBD) framework and qualitative user interviews.',
        lessons: [
          { id: 'les-p-101', title: 'The Mom Test: How to Talk to Customers Without Biasing Them', duration: '50 mins', type: 'video', description: 'Crucial interview methodologies.' }
        ]
      }
    ]
  },

  // ==================== MULTILATERAL OPEN-SOURCE PARTNER ACADEMIES ====================
  {
    id: 'course-multi-fao-01',
    title: 'FAO eLearning Academy: Climate-Smart Agribusiness & Food Security',
    category: 'multilateral',
    categoryLabel: 'Multilateral Open Source',
    targetSkill: 'Agri-tech, Climate Resilient Supply Chains & Rural Development',
    difficulty: 'Beginner',
    duration: 'Self-Paced (40 Hours)',
    credits: 3,
    accreditedBy: 'Food and Agriculture Organization of the United Nations (FAO)',
    isMultilateral: true,
    partnerOrganization: 'FAO eLearning Academy (UN)',
    partnerBadge: 'UN Global Certified MOOC',
    partnerUrl: 'https://elearning.fao.org',
    quarterlySubscriptionNgn: 30000,
    quarterlySubscriptionFic: 50,
    subscriptionTier: 'Multilateral',
    scholarshipEligible: true,
    enrolledCitizens: 540,
    targetCitizens: 600,
    rating: 4.97,
    instructor: {
      name: 'FAO Global Curriculum Council',
      role: 'International Food Security Experts',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
      affiliation: 'United Nations System'
    },
    summary: 'A certified self-paced multilateral program covering climate-smart agricultural economics, food safety regulations, post-harvest loss reduction, and sustainable farming.',
    learningOutcomes: [
      'Apply UN standards for food hygiene and international export traceability',
      'Implement solar irrigation and precision moisture sensors on smallholder plots',
      'Calculate carbon offset credits and regenerative soil restoration models',
      'Earn an official verifiable UN FAO digital certification badge'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'mod-fao-1',
        title: 'Module 1: Climate Resilient Agronomy in the Sahel & Guinea Savannah',
        duration: '10 Hours',
        description: 'Drought-tolerant crop varieties and rainwater retention techniques.',
        lessons: [
          { id: 'les-f-101', title: 'Principles of Agro-Ecological Transition', duration: '60 mins', type: 'reading', description: 'Official FAO curriculum reading.' }
        ]
      }
    ]
  },
  {
    id: 'course-multi-atingi-02',
    title: 'Agribusiness e-Academy (atingi): Pan-African Farm Enterprise Planning',
    category: 'multilateral',
    categoryLabel: 'Multilateral Open Source',
    targetSkill: 'Micro-Farm Accounting, Rural Logistics & Mobile Market Access',
    difficulty: 'Beginner',
    duration: 'Self-Paced (30 Hours)',
    credits: 2,
    accreditedBy: 'atingi / Agribusiness Facility for Africa',
    isMultilateral: true,
    partnerOrganization: 'Agribusiness e-Academy (atingi)',
    partnerBadge: 'BMZ / GIZ Certified Platform',
    partnerUrl: 'https://www.atingi.org',
    quarterlySubscriptionNgn: 30000,
    quarterlySubscriptionFic: 50,
    subscriptionTier: 'Multilateral',
    scholarshipEligible: true,
    enrolledCitizens: 420,
    targetCitizens: 500,
    rating: 4.86,
    instructor: {
      name: 'African Agribusiness Mentors',
      role: 'Agricultural Economists',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80',
      affiliation: 'atingi African Hub'
    },
    summary: 'Developed specifically for African youth and women in agriculture, with offline mobile capabilities for low-bandwidth rural connectivity and practical farm enterprise budgeting.',
    learningOutcomes: [
      'Develop a bankable 3-year agricultural business and cashflow forecast',
      'Establish cooperative bulk purchasing hubs for seed and fertilizer inputs',
      'Navigate mobile money micropayments and digital harvest escrow'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'mod-at-1',
        title: 'Module 1: Farm Unit Economics & Yield Projections',
        duration: '8 Hours',
        description: 'Calculating production costs per hectare and hedging commodity fluctuations.',
        lessons: [
          { id: 'les-at-101', title: 'Farm Ledger Bookkeeping & Input Reconciliation', duration: '45 mins', type: 'reading', description: 'Practical workbook exercise.' }
        ]
      }
    ]
  },
  {
    id: 'course-multi-un-03',
    title: 'UN Inter-Agency Platform: Public Policy & Sustainable Development Credentials',
    category: 'multilateral',
    categoryLabel: 'Multilateral Open Source',
    targetSkill: 'SDG Implementation, Multilateral Diplomacy & Global Governance',
    difficulty: 'Intermediate',
    duration: 'Self-Paced (50 Hours)',
    credits: 3,
    accreditedBy: 'UNESCO / UNITAR / World Bank Group',
    isMultilateral: true,
    partnerOrganization: 'UN System e-Learning Platforms (UNESCO, UNITAR, IMF, WBG)',
    partnerBadge: 'UN Inter-Agency Verified',
    partnerUrl: 'https://unitar.org',
    quarterlySubscriptionNgn: 35000,
    quarterlySubscriptionFic: 60,
    subscriptionTier: 'Multilateral',
    scholarshipEligible: true,
    enrolledCitizens: 380,
    targetCitizens: 400,
    rating: 4.94,
    instructor: {
      name: 'UNITAR Senior Diplomats',
      role: 'Policy Fellows',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
      affiliation: 'Geneva United Nations Headquarters'
    },
    summary: 'Global inter-agency credentials covering sustainable industrialization, clean energy transitions, public finance management, and multilateral treaty frameworks.',
    learningOutcomes: [
      'Understand sovereign debt sustainability and IMF developmental frameworks',
      'Structure public-private partnerships (PPP) for national digital infrastructure',
      'Earn recognized diplomatic micro-credentials issued by UNITAR'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'mod-un-1',
        title: 'Module 1: The 2030 Agenda & African Union Agenda 2063 Alignment',
        duration: '12 Hours',
        description: 'Translating SDG targets into national development benchmarks.',
        lessons: [
          { id: 'les-un-101', title: 'Macroeconomic Stabilisation & Climate Financing', duration: '55 mins', type: 'reading', description: 'IMF policy note.' }
        ]
      }
    ]
  },
  {
    id: 'course-multi-great-04',
    title: 'Great Learning Academy: Cloud & Data Science Foundation Certificate',
    category: 'multilateral',
    categoryLabel: 'Multilateral Open Source',
    targetSkill: 'Data Science, Python Analytics, Cloud Architecture & SQL',
    difficulty: 'Beginner',
    duration: 'Self-Paced (35 Hours)',
    credits: 3,
    accreditedBy: 'Great Learning / University Partners',
    isMultilateral: true,
    partnerOrganization: 'Great Learning Academy',
    partnerBadge: 'Industry Certificate Track',
    partnerUrl: 'https://www.mygreatlearning.com',
    quarterlySubscriptionNgn: 35000,
    quarterlySubscriptionFic: 60,
    subscriptionTier: 'Multilateral',
    scholarshipEligible: true,
    enrolledCitizens: 610,
    targetCitizens: 700,
    rating: 4.88,
    instructor: {
      name: 'Prof. Rajesh Sharma',
      role: 'Lead Data Analytics Instructor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
      affiliation: 'Great Learning Faculty'
    },
    summary: 'Accelerated foundation in Python data analysis, pandas, statistical inference, visualization with Seaborn, and cloud data warehousing from global academic partners.',
    learningOutcomes: [
      'Write clean vectorized Python scripts using NumPy and Pandas',
      'Clean noisy raw CSV and SQL database dumps for predictive modeling',
      'Receive a shareable LinkedIn verified diploma upon completion'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'mod-gl-1',
        title: 'Module 1: Python for Data Science Primer',
        duration: '8 Hours',
        description: 'Variables, loops, functions, and list comprehensions.',
        lessons: [
          { id: 'les-gl-101', title: 'Exploratory Data Analysis on Telecom Churn Datasets', duration: '50 mins', type: 'video', description: 'Practical walkthrough.' }
        ]
      }
    ]
  }
];

// ==================== 2. 37-STATE ENROLLMENT METRICS (TARGET: 5,000 CITIZENS) ====================
export const NIGERIAN_STATE_COHORTS: StateEnrollmentCohort[] = [
  { state: 'Lagos', zone: 'South-West', enrolledCount: 380, targetCount: 400, scholarshipSlotsAssigned: 380, topSkillTrack: 'AI & Machine Learning' },
  { state: 'Kano', zone: 'North-West', enrolledCount: 260, targetCount: 280, scholarshipSlotsAssigned: 260, topSkillTrack: 'Cloud & DevOps' },
  { state: 'Rivers (Port Harcourt)', zone: 'South-South', enrolledCount: 240, targetCount: 250, scholarshipSlotsAssigned: 240, topSkillTrack: 'CyberSecurity' },
  { state: 'Abuja (FCT)', zone: 'North-Central', enrolledCount: 230, targetCount: 250, scholarshipSlotsAssigned: 230, topSkillTrack: 'Product Management' },
  { state: 'Oyo (Ibadan)', zone: 'South-West', enrolledCount: 210, targetCount: 220, scholarshipSlotsAssigned: 210, topSkillTrack: 'Content Creation' },
  { state: 'Kaduna', zone: 'North-West', enrolledCount: 195, targetCount: 200, scholarshipSlotsAssigned: 195, topSkillTrack: 'Cloud & DevOps' },
  { state: 'Enugu', zone: 'South-East', enrolledCount: 190, targetCount: 200, scholarshipSlotsAssigned: 190, topSkillTrack: 'Online Marketing' },
  { state: 'Anambra', zone: 'South-East', enrolledCount: 185, targetCount: 190, scholarshipSlotsAssigned: 185, topSkillTrack: 'AI & Machine Learning' },
  { state: 'Edo (Benin)', zone: 'South-South', enrolledCount: 175, targetCount: 180, scholarshipSlotsAssigned: 175, topSkillTrack: 'CyberSecurity' },
  { state: 'Delta', zone: 'South-South', enrolledCount: 170, targetCount: 180, scholarshipSlotsAssigned: 170, topSkillTrack: 'Cloud & DevOps' },
  { state: 'Ogun (Abeokuta)', zone: 'South-West', enrolledCount: 165, targetCount: 170, scholarshipSlotsAssigned: 165, topSkillTrack: 'Online Marketing' },
  { state: 'Plateau (Jos)', zone: 'North-Central', enrolledCount: 155, targetCount: 160, scholarshipSlotsAssigned: 155, topSkillTrack: 'Content Creation' },
  { state: 'Kwara (Ilorin)', zone: 'North-Central', enrolledCount: 140, targetCount: 150, scholarshipSlotsAssigned: 140, topSkillTrack: 'Product Management' },
  { state: 'Akwa Ibom (Uyo)', zone: 'South-South', enrolledCount: 145, targetCount: 150, scholarshipSlotsAssigned: 145, topSkillTrack: 'AI & Machine Learning' },
  { state: 'Osun (Osogbo)', zone: 'South-West', enrolledCount: 130, targetCount: 140, scholarshipSlotsAssigned: 130, topSkillTrack: 'Cloud & DevOps' },
  { state: 'Ondo (Akure)', zone: 'South-West', enrolledCount: 125, targetCount: 130, scholarshipSlotsAssigned: 125, topSkillTrack: 'CyberSecurity' },
  { state: 'Imo (Owerri)', zone: 'South-East', enrolledCount: 135, targetCount: 140, scholarshipSlotsAssigned: 135, topSkillTrack: 'Online Marketing' },
  { state: 'Abia (Umuahia/Aba)', zone: 'South-East', enrolledCount: 120, targetCount: 130, scholarshipSlotsAssigned: 120, topSkillTrack: 'Product Management' },
  { state: 'Cross River (Calabar)', zone: 'South-South', enrolledCount: 115, targetCount: 120, scholarshipSlotsAssigned: 115, topSkillTrack: 'Content Creation' },
  { state: 'Benue (Makurdi)', zone: 'North-Central', enrolledCount: 110, targetCount: 120, scholarshipSlotsAssigned: 110, topSkillTrack: 'Multilateral / FAO Agribusiness' },
  { state: 'Borno (Maiduguri)', zone: 'North-East', enrolledCount: 105, targetCount: 110, scholarshipSlotsAssigned: 105, topSkillTrack: 'CyberSecurity' },
  { state: 'Bauchi', zone: 'North-East', enrolledCount: 100, targetCount: 110, scholarshipSlotsAssigned: 100, topSkillTrack: 'Cloud & DevOps' },
  { state: 'Katsina', zone: 'North-West', enrolledCount: 100, targetCount: 105, scholarshipSlotsAssigned: 100, topSkillTrack: 'AI & Machine Learning' },
  { state: 'Sokoto', zone: 'North-West', enrolledCount: 95, targetCount: 100, scholarshipSlotsAssigned: 95, topSkillTrack: 'Multilateral / atingi' },
  { state: 'Niger (Minna)', zone: 'North-Central', enrolledCount: 90, targetCount: 100, scholarshipSlotsAssigned: 90, topSkillTrack: 'Product Management' },
  { state: 'Nasarawa (Lafia)', zone: 'North-Central', enrolledCount: 85, targetCount: 90, scholarshipSlotsAssigned: 85, topSkillTrack: 'Online Marketing' },
  { state: 'Kogi (Lokoja)', zone: 'North-Central', enrolledCount: 80, targetCount: 90, scholarshipSlotsAssigned: 80, topSkillTrack: 'CyberSecurity' },
  { state: 'Adamawa (Yola)', zone: 'North-East', enrolledCount: 80, targetCount: 85, scholarshipSlotsAssigned: 80, topSkillTrack: 'Cloud & DevOps' },
  { state: 'Gombe', zone: 'North-East', enrolledCount: 75, targetCount: 80, scholarshipSlotsAssigned: 75, topSkillTrack: 'AI & Machine Learning' },
  { state: 'Taraba (Jalingo)', zone: 'North-East', enrolledCount: 70, targetCount: 75, scholarshipSlotsAssigned: 70, topSkillTrack: 'Multilateral / FAO' },
  { state: 'Yobe (Damaturu)', zone: 'North-East', enrolledCount: 65, targetCount: 70, scholarshipSlotsAssigned: 65, topSkillTrack: 'Online Marketing' },
  { state: 'Kebbi (Birnin Kebbi)', zone: 'North-West', enrolledCount: 65, targetCount: 70, scholarshipSlotsAssigned: 65, topSkillTrack: 'Multilateral / atingi' },
  { state: 'Zamfara (Gusau)', zone: 'North-West', enrolledCount: 60, targetCount: 65, scholarshipSlotsAssigned: 60, topSkillTrack: 'Cloud & DevOps' },
  { state: 'Jigawa (Dutse)', zone: 'North-West', enrolledCount: 60, targetCount: 65, scholarshipSlotsAssigned: 60, topSkillTrack: 'Product Management' },
  { state: 'Ebonyi (Abakaliki)', zone: 'South-East', enrolledCount: 60, targetCount: 65, scholarshipSlotsAssigned: 60, topSkillTrack: 'Content Creation' },
  { state: 'Ekiti (Ado-Ekiti)', zone: 'South-West', enrolledCount: 65, targetCount: 70, scholarshipSlotsAssigned: 65, topSkillTrack: 'CyberSecurity' },
  { state: 'Bayelsa (Yenagoa)', zone: 'South-South', enrolledCount: 60, targetCount: 65, scholarshipSlotsAssigned: 60, topSkillTrack: 'AI & Machine Learning' }
];

export const TOTAL_CITIZENS_ENROLLED = NIGERIAN_STATE_COHORTS.reduce((sum, c) => sum + c.enrolledCount, 0); // 4,680 citizens
export const NATIONAL_TARGET_CITIZENS = 5000;

// ==================== 3. ASSESSMENT MANAGEMENT DATA (ALL 5 TYPES POPULATED) ====================
export const SAMPLE_ASSESSMENTS: AssessmentItem[] = [
  // ---------- 1. QUIZ ASSESSMENTS (Short, Rapid Feedback) ----------
  {
    id: 'asm-quiz-ai-01',
    courseId: 'course-ai-01',
    courseTitle: 'Autonomous AI & Deep Learning Systems Engineering',
    title: 'Sprint Quiz 1: Neural Vector Embeddings & Distance Metrics',
    type: 'QUIZ',
    durationMinutes: 15,
    totalMarks: 30,
    passingMarks: 20,
    dueDate: '2026-10-28',
    status: 'ACTIVE',
    attemptsAllowed: 3,
    attemptsUsed: 0,
    instructions: 'Rapid-fire knowledge check on vector embeddings, cosine distance, and high-dimensional space indexing.',
    questions: [
      {
        id: 'q-quiz-1',
        type: 'MULTIPLE_CHOICE',
        prompt: 'Which vector distance metric is invariant to the absolute magnitude of the vectors and only measures angular orientation?',
        marks: 10,
        options: ['Cosine Distance', 'Manhattan L1 Distance', 'Euclidean L2 Distance', 'Hamming Distance'],
        correctAnswer: 'Cosine Distance'
      },
      {
        id: 'q-quiz-2',
        type: 'TRUE_FALSE',
        prompt: 'True or False: In dense embedding indexing, HNSW stands for Hierarchical Navigable Small World graphs.',
        marks: 10,
        options: ['True', 'False'],
        correctAnswer: 'True'
      },
      {
        id: 'q-quiz-3',
        type: 'SHORT_ANSWER',
        prompt: 'State the commonly used dimensionality reduction algorithm paired with vector clusters for 2D visual projection.',
        marks: 10,
        correctAnswer: 't-SNE'
      }
    ]
  },
  {
    id: 'asm-quiz-cld-02',
    courseId: 'course-cloud-02',
    courseTitle: 'Cloud Computing & Distributed DevOps Infrastructure',
    title: 'Flash Quiz 2: Linux Kernel Namespaces & Container Runtimes',
    type: 'QUIZ',
    durationMinutes: 15,
    totalMarks: 30,
    passingMarks: 20,
    dueDate: '2026-10-30',
    status: 'ACTIVE',
    attemptsAllowed: 3,
    attemptsUsed: 0,
    instructions: 'Quick evaluation on cgroups v2, PID isolation, and OCI container runtime standards.',
    questions: [
      {
        id: 'q-qc-1',
        type: 'MULTIPLE_CHOICE',
        prompt: 'Which Linux cgroup controller limits CPU bandwidth quota for container processes?',
        marks: 10,
        options: ['cpu.cfs_quota_us', 'memory.limit_in_bytes', 'blkio.weight', 'net_cls.classid'],
        correctAnswer: 'cpu.cfs_quota_us'
      },
      {
        id: 'q-qc-2',
        type: 'TRUE_FALSE',
        prompt: 'True or False: An OCI (Open Container Initiative) compliant image can run interchangeably on containerd, CRI-O, and Docker.',
        marks: 10,
        options: ['True', 'False'],
        correctAnswer: 'True'
      },
      {
        id: 'q-qc-3',
        type: 'ORDERING',
        prompt: 'Arrange the container initialization lifecycle stages in chronological execution order:',
        marks: 10,
        sequenceItems: [
          'Pull base container image layer',
          'Mount cgroups and network namespace',
          'Execute post-start lifecycle hooks',
          'Invoke primary application entrypoint'
        ]
      }
    ]
  },
  {
    id: 'asm-quiz-sec-03',
    courseId: 'course-sec-03',
    courseTitle: 'CyberSecurity & Cryptographic Defence Architecture',
    title: 'Security Knowledge Check: Zero Trust & Asymmetric Cryptography',
    type: 'QUIZ',
    durationMinutes: 20,
    totalMarks: 30,
    passingMarks: 20,
    dueDate: '2026-11-02',
    status: 'UPCOMING',
    attemptsAllowed: 2,
    attemptsUsed: 0,
    instructions: 'Evaluate your grasp of elliptic curve key exchanges, TLS 1.3 handshakes, and identity vaults.',
    questions: [
      {
        id: 'q-qs-1',
        type: 'MULTIPLE_CHOICE',
        prompt: 'In Ed25519 digital signatures, what is the underlying elliptic curve geometry?',
        marks: 10,
        options: ['Twisted Edwards Curve', 'Weierstrass Standard Curve', 'Montgomery Curve', 'BLS12-381 Pairing Curve'],
        correctAnswer: 'Twisted Edwards Curve'
      },
      {
        id: 'q-qs-2',
        type: 'TRUE_FALSE',
        prompt: 'True or False: Symmetric cryptography (e.g., AES-256-GCM) is typically orders of magnitude faster than asymmetric cryptography for bulk data transport.',
        marks: 10,
        options: ['True', 'False'],
        correctAnswer: 'True'
      },
      {
        id: 'q-qs-3',
        type: 'SHORT_ANSWER',
        prompt: 'Name the 3-letter acronym representing the industry standard compact URL-safe token format used in API authentication.',
        marks: 10,
        correctAnswer: 'JWT'
      }
    ]
  },

  // ---------- 2. EXAM ASSESSMENTS (Formal, Strict Timing) ----------
  {
    id: 'asm-ai-quiz-01',
    courseId: 'course-ai-01',
    courseTitle: 'Autonomous AI & Deep Learning Systems Engineering',
    title: 'Mid-Term Comprehensive Exam: Vector RAG & Agent Topology',
    type: 'EXAM',
    durationMinutes: 45,
    totalMarks: 100,
    passingMarks: 65,
    dueDate: '2026-11-05',
    status: 'ACTIVE',
    attemptsAllowed: 2,
    attemptsUsed: 0,
    instructions: 'Timed formal evaluation. You have 45 minutes to solve 8 diverse questions testing all question formats: multiple choice, true/false, short answer, essay, matching, ordering, file upload, and audio oral response.',
    questions: [
      {
        id: 'q-1',
        type: 'MULTIPLE_CHOICE',
        prompt: 'Which vector indexing algorithm guarantees logarithmic nearest-neighbor search with high recall on dense embedding clusters?',
        marks: 10,
        options: [
          'HNSW (Hierarchical Navigable Small World)',
          'Flat Brute-Force L2 Search',
          'Linear Inverted Document Frequency (TF-IDF)',
          'Standard B-Tree Indexing'
        ],
        correctAnswer: 'HNSW (Hierarchical Navigable Small World)'
      },
      {
        id: 'q-2',
        type: 'TRUE_FALSE',
        prompt: 'True or False: Quantizing a 16-bit float (FP16) model to 4-bit integer (INT4) reduces memory footprint by approximately 75% with minimal perplexity degradation when using AWQ.',
        marks: 10,
        options: ['True', 'False'],
        correctAnswer: 'True'
      },
      {
        id: 'q-3',
        type: 'SHORT_ANSWER',
        prompt: 'State the specific protocol name used by Antigravity and modern agentic runtimes to standardize tool and resource schemas between LLM clients and server hosts.',
        marks: 10,
        correctAnswer: 'MCP'
      },
      {
        id: 'q-4',
        type: 'ESSAY',
        prompt: 'Explain how you would architect a resilient, offline-first multi-agent consensus pipeline on a low-end Android device deployed in a rural health clinic in Benue State with intermittent 3G connectivity.',
        marks: 25,
        sampleRubric: 'Requires explanation of SQLite edge cache, local GGUF quantized SLM inference, asynchronous queueing, and conflict-free replicated data types (CRDTs).'
      },
      {
        id: 'q-5',
        type: 'MATCHING',
        prompt: 'Pair each AI architecture component with its primary operational function:',
        marks: 15,
        pairs: [
          { left: 'Embedding Model', right: 'Converts unstructured text to dense vector arrays' },
          { left: 'Vector Database', right: 'Stores high-dimensional embeddings for ANN search' },
          { left: 'Re-Ranker', right: 'Cross-scores top retrieved documents for contextual relevance' },
          { left: 'System Prompt', right: 'Defines persona, behavioral bounds, and tool calling constraints' }
        ]
      },
      {
        id: 'q-6',
        type: 'ORDERING',
        prompt: 'Arrange the following steps of an Agentic Tool-Use loop in the correct execution sequence:',
        marks: 15,
        sequenceItems: [
          'Receive user prompt and evaluate context memory',
          'Generate LLM completion with tool call declaration',
          'Execute tool handler natively and capture output result',
          'Feed tool output back to agent reasoning loop for synthesis'
        ]
      },
      {
        id: 'q-7',
        type: 'FILE_UPLOAD',
        prompt: 'Upload your verified Jupyter Notebook (.ipynb or .py script) demonstrating 4-bit model quantization and inference bench test on your local node.',
        marks: 10,
        sampleRubric: 'Must contain benchmark metrics including tokens-per-second, VRAM peak consumption, and test prompts.'
      },
      {
        id: 'q-8',
        type: 'AUDIO_RESPONSE',
        prompt: 'Record a 60-second oral technical brief summarizing why sovereign cryptographic identity (DID) is crucial for autonomous AI agents handling financial transactions.',
        marks: 5,
        sampleRubric: 'Clear articulation of private-key signed agent intents, replay protection, and verifiable credentials.'
      }
    ]
  },

  // ---------- 3. PRACTICAL ASSESSMENTS (Hands-On Lab & Live Performance) ----------
  {
    id: 'asm-cloud-quiz-02',
    courseId: 'course-cloud-02',
    courseTitle: 'Cloud Computing & Distributed DevOps Infrastructure',
    title: 'Hands-on Lab Practical: Bare-Metal Cluster Zero-Downtime Deployment',
    type: 'PRACTICAL',
    durationMinutes: 120,
    totalMarks: 100,
    passingMarks: 70,
    dueDate: '2026-11-12',
    status: 'ACTIVE',
    attemptsAllowed: 1,
    attemptsUsed: 0,
    instructions: 'Live infrastructure practical. Spin up 3 sovereign nodes, configure WireGuard mesh overlay, deploy ArgoCD, and demonstrate zero-packet-drop canary traffic switching.',
    questions: [
      {
        id: 'qp-1',
        type: 'FILE_UPLOAD',
        prompt: 'Submit your sanitized Terraform manifest (main.tf, variables.tf) and ArgoCD Application YAML configuration.',
        marks: 50,
        sampleRubric: 'Clean modular definitions, remote state lock, and explicit health checks.'
      },
      {
        id: 'qp-2',
        type: 'SHORT_ANSWER',
        prompt: 'What was your measured latency (in milliseconds) across the WireGuard VPN tunnel between the Lagos master and Abuja worker nodes?',
        marks: 20,
        correctAnswer: '18ms'
      },
      {
        id: 'qp-3',
        type: 'ESSAY',
        prompt: 'Describe the exact failure recovery procedure if the etcd quorum loses 1 of 3 nodes during an unexpected power outage in Kaduna.',
        marks: 30,
        sampleRubric: 'Raft consensus maintenance, snapshot restoration, and etcdctl member remove/add procedure.'
      }
    ]
  },

  // ---------- 4. ASSIGNMENT ASSESSMENTS (Take-Home Problem Sets & Audits) ----------
  {
    id: 'asm-sec-quiz-03',
    courseId: 'course-sec-03',
    courseTitle: 'CyberSecurity & Cryptographic Defence Architecture',
    title: 'Smart Contract Audit & OWASP API Vulnerability Assessment',
    type: 'ASSIGNMENT',
    durationMinutes: 180,
    totalMarks: 100,
    passingMarks: 65,
    dueDate: '2026-11-20',
    status: 'UPCOMING',
    attemptsAllowed: 3,
    attemptsUsed: 0,
    instructions: 'Take-home security assignment analyzing a mock fintech smart contract for reentrancy, arithmetic overflow, and unauthenticated state mutation.',
    questions: [
      {
        id: 'qs-1',
        type: 'MULTIPLE_CHOICE',
        prompt: 'Which Solidity compiler feature automatically prevents integer overflows in Solidity >= 0.8.0 without needing SafeMath?',
        marks: 20,
        options: [
          'Built-in checked arithmetic causing immediate revert on overflow',
          'Automatic 256-bit rounding to zero',
          'Dynamic memory expansion gas penalty',
          'Static assert pre-compiler macro'
        ],
        correctAnswer: 'Built-in checked arithmetic causing immediate revert on overflow'
      },
      {
        id: 'qs-2',
        type: 'ESSAY',
        prompt: 'Write out the exploit payload and remediation diff for a vulnerable withdrawal function that violates the Checks-Effects-Interactions pattern.',
        marks: 80,
        sampleRubric: 'Reentrancy guard demonstration, state update prior to external transfer, and mutex lock analysis.'
      }
    ]
  },

  // ---------- 5. PROJECT ASSESSMENTS (Long-Term Capstone & Portfolio Submissions) ----------
  {
    id: 'asm-proj-prd-01',
    courseId: 'course-prod-06',
    courseTitle: 'Agile Product Management & Tech Venture Building',
    title: 'Venture Capstone Project: Comprehensive PRD & Unit Economics Dossier',
    type: 'PROJECT',
    durationMinutes: 240,
    totalMarks: 100,
    passingMarks: 70,
    dueDate: '2026-12-01',
    status: 'ACTIVE',
    attemptsAllowed: 2,
    attemptsUsed: 0,
    instructions: 'Author a complete 10-page Product Requirement Document (PRD) and 3-year financial model for an African sovereign tech startup solving local payment or supply chain friction.',
    questions: [
      {
        id: 'qpr-1',
        type: 'FILE_UPLOAD',
        prompt: 'Upload your finalized Product Requirement Document (PRD PDF) containing user personas, feature backlog, and sprint roadmaps.',
        marks: 50,
        sampleRubric: 'Clarity of user stories, acceptance criteria, wireframes, and technical architecture feasibility.'
      },
      {
        id: 'qpr-2',
        type: 'ESSAY',
        prompt: 'Detail your venture unit economics model: calculate CAC, projected ARPU, 12-month LTV, and payback period across 3 Nigerian pilot cities (Lagos, Kano, Port Harcourt).',
        marks: 50,
        sampleRubric: 'Solid financial mechanics, churn rate projections, and gross contribution margin analysis.'
      }
    ]
  },
  {
    id: 'asm-proj-med-02',
    courseId: 'course-media-05',
    courseTitle: 'Content Creation: 4K Cinema, Audio & Viral Visual Media',
    title: 'Capstone Cinema Project: 4K Color-Graded Reel & BeatwaveNG Mixdown',
    type: 'PROJECT',
    durationMinutes: 300,
    totalMarks: 100,
    passingMarks: 70,
    dueDate: '2026-12-10',
    status: 'UPCOMING',
    attemptsAllowed: 1,
    attemptsUsed: 0,
    instructions: 'Submit an original cinematic short film or commercial utilizing DaVinci Resolve node color grading and a synchronized Afrobeats soundtrack created with BeatwaveNG.',
    questions: [
      {
        id: 'qpm-1',
        type: 'FILE_UPLOAD',
        prompt: 'Submit your exported 4K ProRes 422 HQ master video file and DaVinci Resolve Project Archive (.dra).',
        marks: 60,
        sampleRubric: 'High dynamic range grading, clean black levels, skin tone accuracy, and narrative lighting.'
      },
      {
        id: 'qpm-2',
        type: 'AUDIO_RESPONSE',
        prompt: 'Record a 90-second director commentary explaining your multitrack BeatwaveNG sound mix, panning decisions, and sidechain compression.',
        marks: 40,
        sampleRubric: 'Cohesive articulation of audio engineering concepts, frequency separation, and vocal presence.'
      }
    ]
  }
];

// ==================== 4. GRADEBOOK FUNCTIONALITY & CONVERSION SCALE ====================
export const LETTER_GRADE_SCALE = [
  { letter: 'A+', min: 90, max: 100, gpa: 4.0, description: 'Outstanding Academic Distinction' },
  { letter: 'A', min: 85, max: 89, gpa: 4.0, description: 'Excellent Mastery' },
  { letter: 'A-', min: 80, max: 84, gpa: 3.7, description: 'Superior Achievement' },
  { letter: 'B+', min: 75, max: 79, gpa: 3.3, description: 'Very Good Competency' },
  { letter: 'B', min: 70, max: 74, gpa: 3.0, description: 'Good Competency' },
  { letter: 'B-', min: 65, max: 69, gpa: 2.7, description: 'Above Average Standard' },
  { letter: 'C+', min: 60, max: 64, gpa: 2.3, description: 'Average Competency' },
  { letter: 'C', min: 55, max: 59, gpa: 2.0, description: 'Satisfactory Performance' },
  { letter: 'C-', min: 50, max: 54, gpa: 1.7, description: 'Marginal Pass' },
  { letter: 'D+', min: 45, max: 49, gpa: 1.3, description: 'Conditional Pass' },
  { letter: 'D', min: 40, max: 44, gpa: 1.0, description: 'Bare Minimum Pass' },
  { letter: 'F', min: 0, max: 39, gpa: 0.0, description: 'Failure / Remedial Required' }
];

export const getLetterGradeFromScore = (score: number) => {
  const rounded = Math.round(score);
  for (const grade of LETTER_GRADE_SCALE) {
    if (rounded >= grade.min && rounded <= grade.max) {
      return grade;
    }
  }
  return LETTER_GRADE_SCALE[LETTER_GRADE_SCALE.length - 1];
};

export const SAMPLE_STUDENT_GRADES: GradeEntry[] = [
  {
    id: 'grd-001',
    studentId: 'FM-STU-2026-0842',
    studentName: 'Ibrahim Danjuma',
    studentState: 'Kano',
    courseId: 'course-ai-01',
    courseTitle: 'Autonomous AI & Deep Learning Systems Engineering',
    assessmentId: 'asm-ai-quiz-01',
    assessmentTitle: 'Mid-Term Comprehensive Exam: Vector RAG & Agent Topology',
    assessmentType: 'EXAM',
    marksObtained: 94,
    maxMarks: 100,
    percentage: 94,
    letterGrade: 'A+',
    gradePoints: 4.0,
    weightagePercent: 35,
    evaluatedAt: '2026-10-12',
    evaluatorFeedback: 'Exceptional mastery of HNSW graph construction and quantized inference logic.'
  },
  {
    id: 'grd-002',
    studentId: 'FM-STU-2026-0842',
    studentName: 'Ibrahim Danjuma',
    studentState: 'Kano',
    courseId: 'course-cloud-02',
    courseTitle: 'Cloud Computing & Distributed DevOps Infrastructure',
    assessmentId: 'asm-cloud-quiz-02',
    assessmentTitle: 'Hands-on Lab Practical: Bare-Metal Cluster Zero-Downtime Deployment',
    assessmentType: 'PRACTICAL',
    marksObtained: 88,
    maxMarks: 100,
    percentage: 88,
    letterGrade: 'A',
    gradePoints: 4.0,
    weightagePercent: 40,
    evaluatedAt: '2026-10-08',
    evaluatorFeedback: 'Zero-downtime canary deployment succeeded with zero traffic disruption.'
  },
  {
    id: 'grd-003',
    studentId: 'FM-STU-2026-0842',
    studentName: 'Ibrahim Danjuma',
    studentState: 'Kano',
    courseId: 'course-sec-03',
    courseTitle: 'CyberSecurity & Cryptographic Defence Architecture',
    assessmentId: 'asm-sec-quiz-03',
    assessmentTitle: 'Smart Contract Audit & OWASP API Vulnerability Assessment',
    assessmentType: 'ASSIGNMENT',
    marksObtained: 83,
    maxMarks: 100,
    percentage: 83,
    letterGrade: 'A-',
    gradePoints: 3.7,
    weightagePercent: 25,
    evaluatedAt: '2026-09-28',
    evaluatorFeedback: 'Clean vulnerability proof-of-concept; suggested additional invariant checks.'
  },
  {
    id: 'grd-004',
    studentId: 'FM-STU-2026-1104',
    studentName: 'Chiamaka Nnamdi',
    studentState: 'Enugu',
    courseId: 'course-ai-01',
    courseTitle: 'Autonomous AI & Deep Learning Systems Engineering',
    assessmentId: 'asm-quiz-ai-01',
    assessmentTitle: 'Sprint Quiz 1: Neural Vector Embeddings & Distance Metrics',
    assessmentType: 'QUIZ',
    marksObtained: 29,
    maxMarks: 30,
    percentage: 97,
    letterGrade: 'A+',
    gradePoints: 4.0,
    weightagePercent: 15,
    evaluatedAt: '2026-10-14',
    evaluatorFeedback: 'Perfect score on cosine distance and metric transformations.'
  },
  {
    id: 'grd-005',
    studentId: 'FM-STU-2026-2419',
    studentName: 'Babatunde Fashola',
    studentState: 'Lagos',
    courseId: 'course-mkt-04',
    courseTitle: 'Online Marketing Skills & Sovereign Growth Engineering',
    assessmentId: 'asm-mkt-01',
    assessmentTitle: 'Growth Funnel Optimization & Algorithmic Virality Case',
    assessmentType: 'PROJECT',
    marksObtained: 78,
    maxMarks: 100,
    percentage: 78,
    letterGrade: 'B+',
    gradePoints: 3.3,
    weightagePercent: 50,
    evaluatedAt: '2026-10-02',
    evaluatorFeedback: 'Strong customer acquisition strategy; refine cohort retention analytics.'
  }
];

export const SAMPLE_TRANSCRIPT: StudentTranscript = {
  studentId: 'FM-STU-2026-0842',
  fullName: 'Ibrahim Danjuma',
  stateOfOrigin: 'Kano State (North-West Zone)',
  matricNumber: 'FM/2026/NW/0842',
  cohort: 'National 5,000 Citizen Tech Sovereign Cohort 1',
  academicYear: '2026/2027 Academic Session',
  cumulativeGpa: 3.92,
  totalCreditsEarned: 16,
  scholarshipGrant: '100% Fully Funded Sovereign Digital Fellowship Grant',
  verificationHash: '0x8f4c2198be92a348b64e881023a9d9e4871e9821af093847cbb65147289f0291',
  courseRecords: [
    {
      courseCode: 'FM-AI-601',
      title: 'Autonomous AI & Deep Learning Systems Engineering',
      credits: 6,
      score: 94,
      letterGrade: 'A+',
      gradePoint: 4.0,
      status: 'COMPLETED'
    },
    {
      courseCode: 'FM-CLD-502',
      title: 'Cloud Computing & Distributed DevOps Infrastructure',
      credits: 5,
      score: 88,
      letterGrade: 'A',
      gradePoint: 4.0,
      status: 'COMPLETED'
    },
    {
      courseCode: 'FM-SEC-503',
      title: 'CyberSecurity & Cryptographic Defence Architecture',
      credits: 5,
      score: 83,
      letterGrade: 'A-',
      gradePoint: 3.7,
      status: 'COMPLETED'
    },
    {
      courseCode: 'FM-PRD-404',
      title: 'Agile Product Management & Tech Venture Building',
      credits: 4,
      score: 91,
      letterGrade: 'A+',
      gradePoint: 4.0,
      status: 'IN_PROGRESS'
    }
  ]
};

// ==================== 5. FINANCIAL MODULES (QUARTERLY SUBSCRIPTIONS & GRANTS) ====================
export const SAMPLE_INVOICES: FinancialInvoice[] = [
  {
    id: 'inv-2026-001',
    invoiceNumber: 'INV-FM-2026-00891',
    studentId: 'FM-STU-2026-0842',
    studentName: 'Ibrahim Danjuma',
    studentState: 'Kano',
    courseTitle: 'Autonomous AI & Deep Learning Systems Engineering',
    feeType: 'QUARTERLY_SUBSCRIPTION',
    billingQuarter: 'Q4 2026 (Oct - Dec)',
    amountFic: 200,
    amountNgn: 120000,
    scholarshipSubsidized: true,
    subsidyPercentage: 100,
    netPayableFic: 0,
    status: 'PAID',
    issuedDate: '2026-09-01',
    dueDate: '2026-09-15',
    paymentMethod: 'STATE_GRANT_FUND'
  },
  {
    id: 'inv-2026-002',
    invoiceNumber: 'INV-FM-2026-00892',
    studentId: 'FM-STU-2026-0842',
    studentName: 'Ibrahim Danjuma',
    studentState: 'Kano',
    courseTitle: 'Cloud Computing & Distributed DevOps Infrastructure',
    feeType: 'QUARTERLY_SUBSCRIPTION',
    billingQuarter: 'Q4 2026 (Oct - Dec)',
    amountFic: 160,
    amountNgn: 95000,
    scholarshipSubsidized: true,
    subsidyPercentage: 100,
    netPayableFic: 0,
    status: 'PAID',
    issuedDate: '2026-09-10',
    dueDate: '2026-09-24',
    paymentMethod: 'STATE_GRANT_FUND'
  },
  {
    id: 'inv-2026-003',
    invoiceNumber: 'INV-FM-2026-01205',
    studentId: 'FM-STU-2026-3112',
    studentName: 'Zainab Aliyu',
    studentState: 'Kaduna',
    courseTitle: 'CyberSecurity & Cryptographic Defence Architecture',
    feeType: 'QUARTERLY_SUBSCRIPTION',
    billingQuarter: 'Q1 2027 (Jan - Mar)',
    amountFic: 170,
    amountNgn: 100000,
    scholarshipSubsidized: true,
    subsidyPercentage: 80,
    netPayableFic: 34,
    status: 'PENDING',
    issuedDate: '2026-10-10',
    dueDate: '2026-10-25',
    paymentMethod: 'FIC_SMART_CONTRACT'
  },
  {
    id: 'inv-2026-004',
    invoiceNumber: 'INV-FM-2026-01344',
    studentId: 'FM-STU-2026-4401',
    studentName: 'Emeka Eze',
    studentState: 'Anambra',
    courseTitle: 'Content Creation: 4K Cinema, Audio & Viral Visual Media',
    feeType: 'QUARTERLY_SUBSCRIPTION',
    billingQuarter: 'Q1 2027 (Jan - Mar)',
    amountFic: 125,
    amountNgn: 75000,
    scholarshipSubsidized: false,
    subsidyPercentage: 0,
    netPayableFic: 125,
    status: 'OVERDUE',
    issuedDate: '2026-09-20',
    dueDate: '2026-10-05'
  }
];

export const SCHOLARSHIP_FUND_METRICS = {
  totalEndowmentNgn: 750000000, // 750 Million Naira National Sovereign Scholarship Fund
  totalEndowmentFic: 1250000, // 1.25 Million FIC Tokens
  citizensSponsored: 4680,
  targetCitizens: 5000,
  percentDisbursed: 93.6,
  averageSubsidyPerCitizenNgn: 150000,
  partnerSponsors: [
    'Federal Ministry of Communications, Innovation & Digital Economy',
    'FingerMobile Sovereign Treasury',
    'Pan-African Technology Development Alliance',
    'United Nations FAO / UNESCO Educational Grants'
  ]
};

// ==================== 6. ACADEMIC CALENDAR SYSTEM ====================
export const ACADEMIC_CALENDAR_EVENTS: AcademicCalendarEvent[] = [
  {
    id: 'cal-ev-01',
    title: 'Orientation & Inauguration: 5,000 Citizen Sovereign Cohort',
    type: 'ACADEMIC_CEREMONY',
    status: 'COMPLETED',
    startDate: '2026-09-01',
    endDate: '2026-09-02',
    timeSlot: '10:00 AM - 1:00 PM WAT',
    term: 'TERM_1_2026',
    location: 'FingerMobile Virtual Auditorium & Lagos Tech Hub Live Cast',
    organizer: 'National Academic Directorate',
    registeredCount: 4890,
    capacity: 5000,
    description: 'Official opening ceremony, address by Ministry dignitaries, and distribution of sovereign decentralized student IDs.'
  },
  {
    id: 'cal-ev-02',
    title: 'Live Lab: Vector Database Indexing & HNSW Clustering in Python',
    type: 'CLASS_SESSION',
    status: 'IN_PROGRESS',
    startDate: '2026-10-16',
    endDate: '2026-10-16',
    timeSlot: '2:00 PM - 4:30 PM WAT',
    term: 'TERM_1_2026',
    location: 'Interactive Cloud Sandbox Node 4',
    organizer: 'Dr. Chinedu Okafor (AI Guild)',
    registeredCount: 1120,
    capacity: 1250,
    description: 'Hands-on interactive terminal session streaming live across all 37 state resource clusters.'
  },
  {
    id: 'cal-ev-03',
    title: 'Mid-Semester Examination Period: 6 Core Digital Skills',
    type: 'EXAM_PERIOD',
    status: 'SCHEDULED',
    startDate: '2026-11-02',
    endDate: '2026-11-09',
    timeSlot: '9:00 AM - 6:00 PM WAT Daily',
    term: 'TERM_1_2026',
    location: 'FingerMobile Assessment Engine (Proctored Virtual Portal)',
    organizer: 'Academic Assessment & Gradebook Board',
    registeredCount: 4680,
    capacity: 5000,
    description: 'Centralized timed evaluation window covering all 8 question formats and instant verifiable letter grading.'
  },
  {
    id: 'cal-ev-04',
    title: 'Term 1 Mid-Session Recess & Rural Agricultural Fieldwork',
    type: 'BREAK',
    status: 'SCHEDULED',
    startDate: '2026-11-10',
    endDate: '2026-11-16',
    timeSlot: 'All Day',
    term: 'TERM_1_2026',
    location: '37 States Community Hubs',
    organizer: 'Dean of Student Affairs',
    registeredCount: 0,
    capacity: 5000,
    description: 'One-week academic break for practical local market research and FAO / atingi farm cooperative visits.'
  },
  {
    id: 'cal-ev-05',
    title: 'National Digital Venture Capstone Showcase & Graduation',
    type: 'ACADEMIC_CEREMONY',
    status: 'SCHEDULED',
    startDate: '2026-12-18',
    endDate: '2026-12-19',
    timeSlot: '11:00 AM - 4:00 PM WAT',
    term: 'ANNUAL_CAPSTONE',
    location: 'International Conference Centre Abuja & Global Metaverse Stream',
    organizer: 'Venture Capital & Sovereign Guild Committee',
    registeredCount: 3950,
    capacity: 5000,
    description: 'Graduation of all 5,000 certified citizens with pitch sessions before angel investors, venture funds, and federal technology ministers.'
  },
  {
    id: 'cal-ev-06',
    title: 'Faculty 1-on-1 Academic Advisory & Career Mentorship Hour',
    type: 'ADVISORY_MEETING',
    status: 'SCHEDULED',
    startDate: '2026-10-24',
    endDate: '2026-10-24',
    timeSlot: '3:00 PM - 6:00 PM WAT',
    term: 'TERM_1_2026',
    location: 'Private WebRTC Consultation Rooms',
    organizer: 'Student Success & Career Placement Bureau',
    registeredCount: 680,
    capacity: 800,
    description: 'Book 20-minute private strategy sessions with senior engineers from Google, Microsoft, and African tech unicorns.'
  }
];
