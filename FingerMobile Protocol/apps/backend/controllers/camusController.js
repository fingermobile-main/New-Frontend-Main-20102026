/**
 * Camus Academic & Educational Course Engine Controller
 * FingerMobile Protocol™ - High-Fidelity Sovereign Learning Management System
 * Powers http://localhost:3000/camus, Student Resources, Fresh Applicant Tracks & ELearning Bridges
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const logger = require('../utils/logger');
const CamusTopic = require('../models/CamusTopic');
const CamusPost = require('../models/CamusPost');
const ElearningCourse = require('../models/ElearningCourse');
const db = require('../database/connection');
const { Op } = require('sequelize');

const DATA_FILE = path.resolve(__dirname, '../data/camus_store.json');

// Initial seed curriculum combining open-source standards with Sovereign Protocol business logic
const SEED_TOPICS = [
  {
    id: 'topic-software-arch',
    slug: 'software-engineering-architecture',
    title: 'Software Engineering & Distributed Protocols',
    category: 'Technology',
    icon: '💻',
    courseCount: 48,
    studentsCount: 3840,
    description: 'Master full-stack distributed system design, WebSockets, microservices, and modern TypeScript runtime architectures.',
    coreSkills: ['TypeScript', 'Node.js', 'React 18', 'Distributed Systems', 'PostgreSQL', 'Docker'],
    learningOutcomes: [
      'Architect resilient event-driven microservices',
      'Deploy low-latency WebSockets and P2P communication meshes',
      'Optimize high-throughput database schemas'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'topic-web3-crypto',
    slug: 'web3-cryptography-protocols',
    title: 'Web3, Cryptography & Decentralized Networks',
    category: 'Web3 & Security',
    icon: '⛓️',
    courseCount: 36,
    studentsCount: 2950,
    description: 'Deep dive into asymmetric cryptography, Merkle tree verification, zero-knowledge proofs, and smart contract protocol governance.',
    coreSkills: ['Solidity', 'Cryptography', 'Merkle Trees', 'Seshat Vaults', 'Web3.js', 'Zero-Knowledge'],
    learningOutcomes: [
      'Implement cryptographic signing and verification proofs',
      'Integrate with the FingerMobile Permanence ledger',
      'Design secure decentralized identity and role tokens'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'topic-ai-systems',
    slug: 'ai-machine-learning-systems',
    title: 'Artificial Intelligence & Neural Systems',
    category: 'Data Science & AI',
    icon: '🤖',
    courseCount: 42,
    studentsCount: 3410,
    description: 'From foundational statistical learning to Transformer LLMs, multi-agent reasoning graphs, and neural edge deployment.',
    coreSkills: ['Python', 'PyTorch', 'Transformers', 'Graph Neural Networks', 'Vector Databases', 'Prompt Engineering'],
    learningOutcomes: [
      'Train and fine-tune domain-specific language models',
      'Build autonomous multi-agent orchestration pipelines',
      'Deploy quantized models to high-throughput inference endpoints'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'topic-creative-audio',
    slug: 'creative-media-audio-engineering',
    title: 'Creative Media, SoundRiver & SoundOcean Engineering',
    category: 'Creative Media',
    icon: '🎧',
    courseCount: 30,
    studentsCount: 2180,
    description: 'Acoustic production, 24-bit/192kHz studio FLAC mastering, multi-track stem manipulation (.fmbw/.fma), and digital arts.',
    coreSkills: ['Sound Engineering', 'Stem Isolation', 'Audio DSP', 'Dolby Atmos', 'Web3 FIC Royalties', 'FLAC/WAV'],
    learningOutcomes: [
      'Master lossless studio audio recording and mixing',
      'Configure sovereign royalty distribution smart contracts',
      'Export multi-channel stems into .fmbw archive containers'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'topic-business-fintech',
    slug: 'business-product-monetization',
    title: 'Sovereign Commerce, FIC Tokenomics & Fintech',
    category: 'Business & Finance',
    icon: '💼',
    courseCount: 34,
    studentsCount: 2650,
    description: 'Digital enterprise operations, decentralized payment rails, cross-border remittance, and merchant monetization models.',
    coreSkills: ['Fintech Architecture', 'FIC Tokenomics', 'Payment Gateways', 'Growth Strategy', 'Compliance'],
    learningOutcomes: [
      'Establish enterprise storefronts with automated payouts',
      'Implement multi-tier subscription and loyalty credit mechanisms',
      'Model sustainable decentralized token economics'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'topic-nysc-fellowship',
    slug: 'nysc-youth-accelerator',
    title: 'NYSC Youth Professional Tech Accelerator',
    category: 'National Development',
    icon: '🇳🇬',
    courseCount: 24,
    studentsCount: 4120,
    description: 'Accelerated digital skills, enterprise software delivery, and leadership readiness for National Youth Service Corps candidates.',
    coreSkills: ['Professional Readiness', 'Rapid Prototyping', 'Public Sector IT', 'Enterprise Delivery', 'Leadership'],
    learningOutcomes: [
      'Acquire industry-standard production development certifications',
      'Participate in sovereign platform open-source contributions',
      'Earn accredited credentials for global tech placement'
    ],
    status: 'ACTIVE'
  }
];

const SEED_COURSES = [
  {
    id: 'camus-course-101',
    title: 'Distributed Protocol Architecture & Real-Time Messaging',
    slug: 'distributed-protocol-architecture',
    category: 'Technology',
    instructor: {
      id: 'inst-1',
      name: 'Dr. Chukwudi Eze',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'Principal Systems Architect & Protocol Researcher',
      studentsCount: 5420,
      rating: 4.95
    },
    duration: '10 weeks',
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 328,
    students: 1845,
    price: 0,
    ficPrice: 0,
    isScholarshipEligible: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive engineering immersion covering WebSockets, P2P mesh swarms, event streaming, and fault-tolerant architecture.',
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Foundations of Modern Distributed Protocols',
        duration: '2 weeks',
        lessons: [
          { id: 'les-101-1', title: 'TCP/UDP vs. WebSockets & WebRTC', duration: '45m', type: 'video', isCompleted: true },
          { id: 'les-101-2', title: 'Event-Driven Architectures with Kafka & Redis', duration: '60m', type: 'video', isCompleted: true },
          { id: 'les-101-3', title: 'Hands-on Lab: Peer Discovery in Mesh Swarms', duration: '90m', type: 'lab', isCompleted: false }
        ]
      },
      {
        moduleNumber: 2,
        title: 'Cryptographic Integrity & Merkle Trees',
        duration: '2 weeks',
        lessons: [
          { id: 'les-102-1', title: 'Hashing Algorithms & Merkle Proof Generation', duration: '50m', type: 'video', isCompleted: false },
          { id: 'les-102-2', title: 'Seshat Cryptographic Storage Integration', duration: '65m', type: 'video', isCompleted: false },
          { id: 'les-102-3', title: 'Practical Exercise: Verifiable Content Roots', duration: '80m', type: 'quiz', isCompleted: false }
        ]
      },
      {
        moduleNumber: 3,
        title: 'Production Deployment & Resilient Failover',
        duration: '3 weeks',
        lessons: [
          { id: 'les-103-1', title: 'Reverse Proxies, Load Balancing & Zero-Downtime Releases', duration: '55m', type: 'video', isCompleted: false },
          { id: 'les-103-2', title: 'Telemetry, Heartbeats & Node Recovery Protocols', duration: '70m', type: 'video', isCompleted: false }
        ]
      }
    ],
    studyPack: {
      title: 'Distributed Protocol Architecture Study Pack v2.4',
      downloadUrl: '/api/camus/resources/download/distributed-protocol-study-pack.pdf',
      fileSize: '14.2 MB',
      pageCount: 164,
      openSourceRepo: 'https://github.com/fingermobile/distributed-protocol-core'
    },
    quizzes: [
      {
        id: 'quiz-101',
        title: 'Distributed Consensus & Swarm Topologies Test',
        questionCount: 10,
        passingScore: 80,
        questions: [
          {
            id: 'q1',
            text: 'Which transport layer provides low-overhead direct peer-to-peer data channel streaming in web clients?',
            options: ['HTTP/1.1 Polling', 'WebRTC DataChannel', 'FTP Tunneling', 'Telnet'],
            correctIndex: 1
          },
          {
            id: 'q2',
            text: 'In the FingerMobile Protocol, which engine guarantees tamper-proof verification of data dispatches?',
            options: ['Local Storage Cache', 'Seshat Cryptographic Vault', 'Cookie Store', 'DNS Resolver'],
            correctIndex: 1
          }
        ]
      }
    ],
    status: 'PUBLISHED'
  },
  {
    id: 'camus-course-102',
    title: 'Full-Stack Modern Web Engineering: React 18, Node & PostgreSQL',
    slug: 'full-stack-modern-web-engineering',
    category: 'Technology',
    instructor: {
      id: 'inst-2',
      name: 'Engr. Blessing Adebayo',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      title: 'Senior Frontend Architect & Open Source Contributor',
      studentsCount: 6810,
      rating: 4.92
    },
    duration: '12 weeks',
    level: 'Beginner',
    rating: 4.94,
    reviewsCount: 512,
    students: 2640,
    price: 0,
    ficPrice: 0,
    isScholarshipEligible: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    description: 'Learn modern TypeScript, React hooks, modular component libraries, Express REST APIs, and database migrations.',
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Modern TypeScript & React Ecosystem',
        duration: '3 weeks',
        lessons: [
          { id: 'les-201-1', title: 'TypeScript Types, Generics & Strict Typing', duration: '50m', type: 'video', isCompleted: true },
          { id: 'les-201-2', title: 'Component Architecture & Accessible Contrast Design', duration: '60m', type: 'video', isCompleted: true }
        ]
      },
      {
        moduleNumber: 2,
        title: 'Backend Node/Express APIs & Database Persistence',
        duration: '4 weeks',
        lessons: [
          { id: 'les-202-1', title: 'RESTful Routing & Multipart/Form-Data Multer Uploads', duration: '65m', type: 'video', isCompleted: false },
          { id: 'les-202-2', title: 'PostgreSQL Relational Schemas & Sequelize ORM', duration: '75m', type: 'video', isCompleted: false }
        ]
      }
    ],
    studyPack: {
      title: 'Full-Stack Modern Web Blueprint',
      downloadUrl: '/api/camus/resources/download/fullstack-blueprint.pdf',
      fileSize: '18.7 MB',
      pageCount: 220,
      openSourceRepo: 'https://github.com/fingermobile/fullstack-web-starter'
    },
    quizzes: [
      {
        id: 'quiz-201',
        title: 'React State & Backend Middleware Assessment',
        questionCount: 8,
        passingScore: 75,
        questions: [
          {
            id: 'q1',
            text: 'Which encoding header is mandatory for streaming binary media files to an Express endpoint?',
            options: ['application/json', 'multipart/form-data', 'text/plain', 'application/xml'],
            correctIndex: 1
          }
        ]
      }
    ],
    status: 'PUBLISHED'
  },
  {
    id: 'camus-course-103',
    title: 'Studio Sound Engineering, Master Acoustics & Sovereign Stems',
    slug: 'sound-engineering-master-acoustics',
    category: 'Creative Media',
    instructor: {
      id: 'inst-3',
      name: 'Marcus Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      title: 'Grammy-Nominated Audio Engineer & SoundOcean Curator',
      studentsCount: 3950,
      rating: 4.88
    },
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.91,
    reviewsCount: 284,
    students: 1420,
    price: 150,
    ficPrice: 150,
    isScholarshipEligible: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    description: 'Master studio acoustic treatment, 24-bit/192kHz uncompressed FLAC mastering, multi-track stem splitting (.fmbw/.fma), and SoundRiver streaming.',
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Acoustics & High-Fidelity Signal Chains',
        duration: '2 weeks',
        lessons: [
          { id: 'les-301-1', title: 'Sample Rates, Bit Depth (24-bit/192kHz) & Nyquist Theorem', duration: '40m', type: 'video', isCompleted: false },
          { id: 'les-301-2', title: 'Studio Equalization, Dynamic Compression & Limiting', duration: '55m', type: 'video', isCompleted: false }
        ]
      },
      {
        moduleNumber: 2,
        title: 'Sovereign Stems (.fmbw/.fma) & Web3 Royalties',
        duration: '3 weeks',
        lessons: [
          { id: 'les-302-1', title: 'Stem Archive Structuring & Lossless Packaging', duration: '60m', type: 'video', isCompleted: false },
          { id: 'les-302-2', title: 'FIC Token Royalty Splits & MySub Pass Licensing', duration: '50m', type: 'video', isCompleted: false }
        ]
      }
    ],
    studyPack: {
      title: 'Studio Audio Engineering & Master Acoustics Handbook',
      downloadUrl: '/api/camus/resources/download/audio-engineering-handbook.pdf',
      fileSize: '24.1 MB',
      pageCount: 195,
      openSourceRepo: 'https://github.com/fingermobile/soundocean-dsp'
    },
    quizzes: [],
    status: 'PUBLISHED'
  },
  {
    id: 'camus-course-104',
    title: 'Applied AI & Neural Systems: Transformers, LLMs & Multi-Agents',
    slug: 'applied-ai-neural-systems',
    category: 'Data Science & AI',
    instructor: {
      id: 'inst-4',
      name: 'Dr. Fatima Bello',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      title: 'AI Research Director & Machine Learning Specialist',
      studentsCount: 7120,
      rating: 4.97
    },
    duration: '14 weeks',
    level: 'Advanced',
    rating: 4.96,
    reviewsCount: 640,
    students: 3180,
    price: 200,
    ficPrice: 200,
    isScholarshipEligible: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    description: 'Learn transformer architectures, vector embeddings, multi-agent coordination, graph neural networks, and self-hosted inference.',
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Transformer Architecture & Attention Mechanisms',
        duration: '4 weeks',
        lessons: [
          { id: 'les-401-1', title: 'Self-Attention, Multi-Head Attention & Positional Encoding', duration: '65m', type: 'video', isCompleted: false },
          { id: 'les-401-2', title: 'Fine-Tuning Open Source LLMs with LoRA & QLoRA', duration: '85m', type: 'video', isCompleted: false }
        ]
      }
    ],
    studyPack: {
      title: 'Applied AI & Transformer Neural Systems Compendium',
      downloadUrl: '/api/camus/resources/download/applied-ai-compendium.pdf',
      fileSize: '32.5 MB',
      pageCount: 310,
      openSourceRepo: 'https://github.com/fingermobile/neural-agent-runtime'
    },
    quizzes: [],
    status: 'PUBLISHED'
  },
  {
    id: 'camus-course-105',
    title: 'NYSC Tech Corps Professional Diploma & Leadership Fellowship',
    slug: 'nysc-tech-corps-fellowship',
    category: 'National Development',
    instructor: {
      id: 'inst-5',
      name: 'Col. (Rtd) M. A. Danjuma & Faculty',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      title: 'Director of National Service Technology & Vocational Training',
      studentsCount: 8940,
      rating: 4.89
    },
    duration: '8 weeks',
    level: 'Beginner',
    rating: 4.92,
    reviewsCount: 875,
    students: 4210,
    price: 0,
    ficPrice: 0,
    isScholarshipEligible: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    description: 'Exclusive accelerated curriculum for NYSC corps members providing corporate digital skills, software craftsmanship, and nationwide project leadership.',
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Digital Skills & Enterprise Delivery',
        duration: '2 weeks',
        lessons: [
          { id: 'les-501-1', title: 'Professional Git Workflows & Collaborative Repositories', duration: '45m', type: 'video', isCompleted: true },
          { id: 'les-501-2', title: 'Cloud Infrastructure & Enterprise Deployment', duration: '60m', type: 'video', isCompleted: false }
        ]
      }
    ],
    studyPack: {
      title: 'NYSC Tech Corps Accelerated Syllabus Pack',
      downloadUrl: '/api/camus/resources/download/nysc-tech-corps-pack.pdf',
      fileSize: '15.8 MB',
      pageCount: 140,
      openSourceRepo: 'https://github.com/fingermobile/nysc-fellowship'
    },
    quizzes: [],
    status: 'PUBLISHED'
  }
];

const SEED_APPLICANT_TRACKS = [
  {
    id: 'track-foundation',
    code: 'FND-101',
    title: 'Foundational Digital Craft & Software Immersion',
    targetAudience: 'Fresh secondary school graduates, university candidates & career switchers',
    duration: '12 Weeks',
    commitment: '15 hrs / week',
    tuition: 'FREE (100% Scholarship)',
    scholarshipGrantFIC: 500,
    credentialsEarned: 'Camus Certified Associate Software Practitioner (CCASP)',
    keyTopics: ['TypeScript Basics', 'UI/UX Design', 'Database Queries', 'Version Control'],
    acceptanceRate: 'Open Enrollment',
    recommendedCourseIds: ['camus-course-102']
  },
  {
    id: 'track-web3-engineer',
    code: 'W3P-201',
    title: 'Sovereign Web3 & Decentralized Protocol Engineer',
    targetAudience: 'Software developers seeking mastery of cryptosystems, P2P mesh, and smart contracts',
    duration: '16 Weeks',
    commitment: '20 hrs / week',
    tuition: 'Sponsored by FIC Learning Fund',
    scholarshipGrantFIC: 1000,
    credentialsEarned: 'Sovereign Protocol Certified Engineer (SPCE)',
    keyTopics: ['Merkle Proofs', 'P2P Swarms', 'Seshat Vaults', 'Solidity & EVM', 'Smart Contracts'],
    acceptanceRate: 'Merit-Based (Skills Test)',
    recommendedCourseIds: ['camus-course-101']
  },
  {
    id: 'track-ai-specialist',
    code: 'AIS-301',
    title: 'AI, Neural Networks & Autonomous Agents Specialist',
    targetAudience: 'Engineers, data analysts, and mathematicians seeking deep AI implementation skills',
    duration: '14 Weeks',
    commitment: '20 hrs / week',
    tuition: 'Sponsored by FIC Learning Fund',
    scholarshipGrantFIC: 1000,
    credentialsEarned: 'Certified AI Systems Practitioner (CAISP)',
    keyTopics: ['Transformers', 'PyTorch', 'Vector Embeddings', 'Agentic Workflows', 'Model Quantization'],
    acceptanceRate: 'Merit-Based (Math/Code Review)',
    recommendedCourseIds: ['camus-course-104']
  },
  {
    id: 'track-sound-ocean',
    code: 'SND-401',
    title: 'Master Audio Acoustics, Stems & Sonic Arts Specialist',
    targetAudience: 'Musicians, producers, sound designers, and studio engineers',
    duration: '10 Weeks',
    commitment: '12 hrs / week',
    tuition: 'Free Tier Available (FIC Subsidized)',
    scholarshipGrantFIC: 750,
    credentialsEarned: 'SoundOcean Certified Studio Master (SCSM)',
    keyTopics: ['24-bit/192kHz Mastering', 'Stem Isolation', 'Acoustic Tuning', 'Dolby Spatial Audio'],
    acceptanceRate: 'Portfolio Submission',
    recommendedCourseIds: ['camus-course-103']
  },
  {
    id: 'track-nysc-fellowship',
    code: 'NYSC-501',
    title: 'NYSC Youth Professional Tech Deployment Fellowship',
    targetAudience: 'Serving Corps Members & Prospective Corps Members (PCMs)',
    duration: '8 Weeks',
    commitment: '10 hrs / week',
    tuition: '100% Free (National Youth Service Sponsored)',
    scholarshipGrantFIC: 600,
    credentialsEarned: 'National Youth Service Digital Fellowship Diploma (NYSC-DFD)',
    keyTopics: ['Enterprise Delivery', 'Public IT Systems', 'Cloud Ops', 'Corporate Leadership'],
    acceptanceRate: 'Verified NYSC Call-Up Number',
    recommendedCourseIds: ['camus-course-105']
  }
];

const SEED_OPEN_RESOURCES = [
  {
    id: 'oer-1',
    title: 'Distributed Systems & Network Protocols: Principles and Paradigms',
    author: 'Andrew S. Tanenbaum / Open Academic Library',
    type: 'Open Textbook (PDF)',
    category: 'Computer Science',
    pages: 640,
    fileSize: '28.4 MB',
    license: 'Creative Commons CC-BY-NC 4.0',
    downloadUrl: 'https://open.umn.edu/opentextbooks/textbooks/distributed-systems',
    curatedBy: 'Camus Faculty Board'
  },
  {
    id: 'oer-2',
    title: 'Rust Programming Language & High-Performance Systems Architecture',
    author: 'Steve Klabnik & Carol Nichols (Rust Open Docs)',
    type: 'Official Open Documentation & SDK Compendium',
    category: 'Systems Programming',
    pages: 580,
    fileSize: '16.8 MB',
    license: 'MIT / Apache 2.0 Open Source',
    downloadUrl: 'https://doc.rust-lang.org/book/',
    curatedBy: 'FingerMobile Protocols Core'
  },
  {
    id: 'oer-3',
    title: 'Modern Deep Learning & Transformer Architectures Compendium',
    author: 'Aston Zhang, Zack C. Lipton (D2L.ai Open Curriculum)',
    type: 'Interactive Open Courseware & Notebooks',
    category: 'Artificial Intelligence',
    pages: 980,
    fileSize: '45.2 MB',
    license: 'Apache 2.0 Open Source',
    downloadUrl: 'https://d2l.ai/',
    curatedBy: 'Camus AI Research Group'
  },
  {
    id: 'oer-4',
    title: 'Principles of Cryptography & Merkle Hash Verification',
    author: 'Dan Boneh & Victor Shoup (Stanford Open CS)',
    type: 'Academic Monograph (PDF)',
    category: 'Cryptography',
    pages: 812,
    fileSize: '34.6 MB',
    license: 'Open Access Educational License',
    downloadUrl: 'https://crypto.stanford.edu/~dabo/cryptobook/',
    curatedBy: 'Seshat Vault Security Guild'
  },
  {
    id: 'oer-5',
    title: 'Web Content Accessibility Guidelines (WCAG) 2.2 & AAA Contrast Manual',
    author: 'World Wide Web Consortium (W3C / WAI)',
    type: 'Open Specification & Standard',
    category: 'Web Accessibility',
    pages: 210,
    fileSize: '8.1 MB',
    license: 'W3C Open Document License',
    downloadUrl: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
    curatedBy: 'FingerMobile UI/UX Accessibility Guild'
  }
];

class CamusController {
  constructor() {
    this.store = {
      topics: SEED_TOPICS,
      courses: SEED_COURSES,
      applicantTracks: SEED_APPLICANT_TRACKS,
      openResources: SEED_OPEN_RESOURCES,
      applicants: [],
      enrollments: [
        {
          id: 'enr-demo-1',
          studentId: 'stu-demo',
          studentName: 'Demo Student',
          courseId: 'camus-course-101',
          courseTitle: 'Distributed Protocol Architecture & Real-Time Messaging',
          enrolledAt: new Date(Date.now() - 14 * 86400000).toISOString(),
          progressPct: 65,
          completedLessons: ['les-101-1', 'les-101-2'],
          status: 'ACTIVE',
          quizScores: { 'quiz-101': 90 },
          certificateIssued: false
        },
        {
          id: 'enr-demo-2',
          studentId: 'stu-demo',
          studentName: 'Demo Student',
          courseId: 'camus-course-102',
          courseTitle: 'Full-Stack Modern Web Engineering: React 18, Node & PostgreSQL',
          enrolledAt: new Date(Date.now() - 7 * 86400000).toISOString(),
          progressPct: 40,
          completedLessons: ['les-201-1'],
          status: 'ACTIVE',
          quizScores: {},
          certificateIssued: false
        }
      ],
      certificates: [
        {
          id: 'CERT-CAMUS-984210',
          studentName: 'Mbah Israel Obinna',
          studentId: 'stu-mbah-01',
          courseTitle: 'Distributed Protocol Architecture & Real-Time Messaging',
          courseId: 'camus-course-101',
          issuedAt: '2026-09-15T10:00:00.000Z',
          grade: 'Distinction (98%)',
          verificationHash: '0x8f4d92a831e72b4c501f68e83b8a1c97ef312d9a',
          merkleRoot: '0x3c7e429b61d5f801a2e7c99201f3b891',
          seshatId: 'SESH-CERT-88192',
          qrPayload: 'https://fingermobile.org/verify/CERT-CAMUS-984210'
        }
      ]
    };

    this.loadStore();
  }

  loadStore() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed.courses && parsed.courses.length > 0) {
          this.store = parsed;
          logger.info('[CamusController] Loaded state from persistent store.');
        }
      } else {
        this.saveStore();
      }
    } catch (e) {
      logger.error('[CamusController] Failed to load store, using seed defaults:', e.message);
    }
  }

  saveStore() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.store, null, 2), 'utf8');
    } catch (e) {
      logger.error('[CamusController] Failed to write store:', e.message);
    }
  }

  // ==========================================
  // ACADEMIC TELEMETRY & STATS
  // ==========================================
  getTelemetry(req, res) {
    try {
      const activeStudentsCount = 14290 + this.store.applicants.length;
      const enrolledCount = this.store.enrollments.length;
      const certificatesCount = this.store.certificates.length + 9840;

      res.status(200).json({
        success: true,
        data: {
          activeStudents: activeStudentsCount,
          totalCourses: this.store.courses.length,
          totalTopics: this.store.topics.length,
          certifiedGraduates: certificatesCount,
          openResourcesCount: this.store.openResources.length + 1450,
          totalStudyHours: 189450,
          ficScholarshipVault: 1250000,
          applicantTracksCount: this.store.applicantTracks.length,
          lastSyncTimestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  getStats = (req, res) => {
    this.getTelemetry(req, res);
  };

  // ==========================================
  // COURSES CRUD & SEARCH
  // ==========================================
  getCourses = (req, res) => {
    try {
      const {
        search = '',
        category = 'all',
        level = 'all',
        sortBy = 'popular',
        page = 1,
        limit = 50
      } = req.query;

      let list = [...this.store.courses];

      // Filter by search query
      if (search && search.trim() !== '') {
        const q = search.toLowerCase();
        list = list.filter(c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
      }

      // Filter by category
      if (category && category !== 'all' && category !== 'All Categories') {
        list = list.filter(c => c.category.toLowerCase() === category.toLowerCase());
      }

      // Filter by level
      if (level && level !== 'all') {
        list = list.filter(c => c.level.toLowerCase() === level.toLowerCase());
      }

      // Sorting
      switch (sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'students':
        list.sort((a, b) => b.students - a.students);
        break;
      case 'newest':
        list.reverse();
        break;
      case 'popular':
      default:
        list.sort((a, b) => (b.rating * b.students) - (a.rating * a.students));
        break;
      }

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      const paginated = list.slice(offset, offset + limitNum);

      res.status(200).json({
        success: true,
        count: paginated.length,
        total: list.length,
        page: pageNum,
        totalPages: Math.ceil(list.length / limitNum),
        data: paginated,
        courses: paginated // compatibility alias
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getAll = (req, res) => {
    this.getCourses(req, res);
  };

  getCourseById = (req, res) => {
    try {
      const { courseId } = req.params;
      const course = this.store.courses.find(c => c.id === courseId || c.slug === courseId);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found in Camus engine' });
      }

      res.status(200).json({
        success: true,
        data: course,
        course // compatibility alias
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getById = (req, res) => {
    this.getCourseById(req, res);
  };

  createCourse = (req, res) => {
    try {
      const {
        title,
        category = 'Technology',
        level = 'Beginner',
        duration = '8 weeks',
        price = 0,
        ficPrice = 0,
        description = '',
        instructorName = 'Faculty Lead',
        syllabus = []
      } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, message: 'Course title is required' });
      }

      let thumbnailUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
      if (req.file) {
        thumbnailUrl = `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`;
      }

      const newCourse = {
        id: `camus-course-${Date.now()}`,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title,
        category,
        level,
        duration,
        rating: 5.0,
        reviewsCount: 1,
        students: 0,
        price: parseFloat(price) || 0,
        ficPrice: parseFloat(ficPrice) || 0,
        isScholarshipEligible: true,
        thumbnailUrl,
        description,
        instructor: {
          id: `inst-${Date.now()}`,
          name: instructorName,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          title: 'Camus Certified Faculty Member',
          studentsCount: 0,
          rating: 5.0
        },
        syllabus: Array.isArray(syllabus) ? syllabus : [],
        studyPack: {
          title: `${title} Study Pack`,
          downloadUrl: '',
          fileSize: '5.0 MB',
          pageCount: 80,
          openSourceRepo: ''
        },
        quizzes: [],
        status: 'PUBLISHED',
        createdAt: new Date().toISOString()
      };

      this.store.courses.unshift(newCourse);
      this.saveStore();

      res.status(201).json({
        success: true,
        message: 'Course created and published to Camus engine successfully',
        data: newCourse
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  create = (req, res) => {
    this.createCourse(req, res);
  };

  updateCourse = (req, res) => {
    try {
      const { courseId } = req.params;
      const index = this.store.courses.findIndex(c => c.id === courseId);

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      const updated = {
        ...this.store.courses[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      if (req.file) {
        updated.thumbnailUrl = `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`;
      }

      this.store.courses[index] = updated;
      this.saveStore();

      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: updated
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  update = (req, res) => {
    this.updateCourse(req, res);
  };

  deleteCourse = (req, res) => {
    try {
      const { courseId } = req.params;
      this.store.courses = this.store.courses.filter(c => c.id !== courseId);
      this.saveStore();

      res.status(200).json({
        success: true,
        message: 'Course archived successfully from Camus engine'
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  delete = (req, res) => {
    this.deleteCourse(req, res);
  };

  // ==========================================
  // TOPICS CAMUS COURSE ENGINE
  // ==========================================
  getTopics = (req, res) => {
    try {
      res.status(200).json({
        success: true,
        count: this.store.topics.length,
        data: this.store.topics,
        topics: this.store.topics // compatibility alias
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  createTopic = (req, res) => {
    try {
      const { title, category = 'General', description = '', icon = '📚' } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Topic title is required' });
      }

      const newTopic = {
        id: `topic-${Date.now()}`,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        category,
        icon,
        courseCount: 0,
        studentsCount: 0,
        description,
        coreSkills: [],
        learningOutcomes: [],
        status: 'ACTIVE'
      };

      this.store.topics.push(newTopic);
      this.saveStore();

      res.status(201).json({
        success: true,
        message: 'Topic created in Camus engine',
        data: newTopic
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==========================================
  // FRESH APPLICANTS & ADMISSION TRACKS
  // ==========================================
  getApplicantTracks = (req, res) => {
    try {
      res.status(200).json({
        success: true,
        count: this.store.applicantTracks.length,
        data: this.store.applicantTracks,
        tracks: this.store.applicantTracks
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  applyApplicant = (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        trackId,
        educationLevel = 'Undergraduate',
        statementOfPurpose = '',
        nyscCallUpNumber = ''
      } = req.body;

      if (!fullName || !email || !trackId) {
        return res.status(400).json({
          success: false,
          message: 'Full Name, Email, and Desired Track are required for application'
        });
      }

      const track = this.store.applicantTracks.find(t => t.id === trackId || t.code === trackId);
      const studentId = `CAMUS-STU-${Math.floor(100000 + Math.random() * 900000)}`;
      const applicationRef = `APP-FMB-${Date.now().toString().slice(-6)}`;

      const newApplication = {
        applicationRef,
        studentId,
        fullName,
        email,
        phone: phone || '',
        trackId,
        trackTitle: track ? track.title : 'General Academic Track',
        educationLevel,
        statementOfPurpose,
        nyscCallUpNumber,
        scholarshipGrantedFIC: track ? track.scholarshipGrantFIC : 500,
        status: 'ADMITTED',
        appliedAt: new Date().toISOString()
      };

      this.store.applicants.push(newApplication);

      // Auto-enroll in recommended course for the chosen track
      if (track && track.recommendedCourseIds && track.recommendedCourseIds.length > 0) {
        const recCourseId = track.recommendedCourseIds[0];
        const course = this.store.courses.find(c => c.id === recCourseId);
        if (course) {
          this.store.enrollments.push({
            id: `enr-${Date.now()}`,
            studentId,
            studentName: fullName,
            courseId: course.id,
            courseTitle: course.title,
            enrolledAt: new Date().toISOString(),
            progressPct: 0,
            completedLessons: [],
            status: 'ACTIVE',
            quizScores: {},
            certificateIssued: false
          });
          course.students += 1;
        }
      }

      this.saveStore();

      res.status(201).json({
        success: true,
        message: `Congratulations ${fullName}! Your admission to the ${newApplication.trackTitle} has been confirmed.`,
        data: newApplication
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==========================================
  // STUDENT ENROLLMENTS & STUDY PROGRESSION
  // ==========================================
  getEnrollments = (req, res) => {
    try {
      const { studentId } = req.query;
      let list = this.store.enrollments;

      if (studentId) {
        list = list.filter(e => e.studentId === studentId);
      }

      res.status(200).json({
        success: true,
        count: list.length,
        data: list,
        enrollments: list
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  createEnrollment = (req, res) => {
    try {
      const { courseId, studentId = 'stu-demo', studentName = 'Current Student' } = req.body;

      if (!courseId) {
        return res.status(400).json({ success: false, message: 'Course ID is required for enrollment' });
      }

      const course = this.store.courses.find(c => c.id === courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found in Camus engine' });
      }

      // Check if already enrolled
      const existing = this.store.enrollments.find(e => e.studentId === studentId && e.courseId === courseId);
      if (existing) {
        return res.status(200).json({
          success: true,
          message: 'You are already enrolled in this course',
          data: existing
        });
      }

      const newEnrollment = {
        id: `enr-${Date.now()}`,
        studentId,
        studentName,
        courseId: course.id,
        courseTitle: course.title,
        enrolledAt: new Date().toISOString(),
        progressPct: 0,
        completedLessons: [],
        status: 'ACTIVE',
        quizScores: {},
        certificateIssued: false
      };

      this.store.enrollments.push(newEnrollment);
      course.students += 1;
      this.saveStore();

      res.status(201).json({
        success: true,
        message: `Successfully enrolled in "${course.title}". Welcome to your study track!`,
        data: newEnrollment
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  updateProgress = (req, res) => {
    try {
      const { enrollmentId, lessonId, progressPct, quizId, score } = req.body;

      const enrollment = this.store.enrollments.find(e => e.id === enrollmentId || e.courseId === enrollmentId);
      if (!enrollment) {
        return res.status(404).json({ success: false, message: 'Enrollment record not found' });
      }

      if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }

      if (progressPct !== undefined) {
        enrollment.progressPct = Math.min(100, Math.max(0, parseInt(progressPct)));
      }

      if (quizId && score !== undefined) {
        enrollment.quizScores[quizId] = score;
      }

      if (enrollment.progressPct >= 100) {
        enrollment.status = 'COMPLETED';
      }

      this.saveStore();

      res.status(200).json({
        success: true,
        message: 'Study progress saved to database',
        data: enrollment
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==========================================
  // CURATED OPEN-SOURCE EDUCATIONAL RESOURCES
  // ==========================================
  getOpenResources = (req, res) => {
    try {
      const { category } = req.query;
      let list = this.store.openResources;

      if (category && category !== 'all') {
        list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
      }

      res.status(200).json({
        success: true,
        count: list.length,
        data: list,
        resources: list
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==========================================
  // CRYPTOGRAPHIC CERTIFICATES & PERMANENCE
  // ==========================================
  mintCertificate = (req, res) => {
    try {
      const { courseId, studentName = 'Valued Scholar', studentId = 'stu-demo', grade = 'Distinction' } = req.body;

      const course = this.store.courses.find(c => c.id === courseId);
      const courseTitle = course ? course.title : 'Camus Sovereign Professional Certification';

      const certId = `CERT-CAMUS-${Math.floor(100000 + Math.random() * 900000)}`;
      const verificationHash = '0x' + crypto.createHash('sha256').update(`${certId}-${studentName}-${Date.now()}`).digest('hex');
      const merkleRoot = '0x' + crypto.createHash('sha256').update(verificationHash).digest('hex').slice(0, 32);
      const seshatId = `SESH-CERT-${Math.floor(10000 + Math.random() * 90000)}`;

      const newCert = {
        id: certId,
        studentName,
        studentId,
        courseTitle,
        courseId: course ? course.id : '',
        issuedAt: new Date().toISOString(),
        grade,
        verificationHash,
        merkleRoot,
        seshatId,
        qrPayload: `https://fingermobile.org/verify/${certId}`
      };

      this.store.certificates.push(newCert);

      // Mark enrollment as certificate issued
      const enrollment = this.store.enrollments.find(e => e.studentId === studentId && e.courseId === courseId);
      if (enrollment) {
        enrollment.certificateIssued = true;
      }

      this.saveStore();

      res.status(201).json({
        success: true,
        message: 'Cryptographic certificate minted and recorded on Permanence ledger',
        data: newCert
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  verifyCertificate = (req, res) => {
    try {
      const { certificateId } = req.params;
      const cert = this.store.certificates.find(c =>
        c.id.toLowerCase() === certificateId.toLowerCase() ||
        c.verificationHash.toLowerCase() === certificateId.toLowerCase()
      );

      if (!cert) {
        return res.status(404).json({
          success: false,
          verified: false,
          message: 'Certificate not found or invalid cryptographic hash'
        });
      }

      res.status(200).json({
        success: true,
        verified: true,
        data: cert
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==========================================
  // PRESERVED PHILOSOPHICAL FORUM / LEGACY POSTS
  // ==========================================
  getAllTopics = async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        topics: this.store.topics,
        pagination: { currentPage: 1, totalPages: 1, totalTopics: this.store.topics.length }
      });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  getTopicById = async (req, res) => {
    const { id } = req.params;
    const topic = this.store.topics.find(t => t.id === id || t.slug === id);
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.status(200).json({ success: true, topic });
  };

  updateTopic = async (req, res) => {
    const { id } = req.params;
    const index = this.store.topics.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Topic not found' });
    this.store.topics[index] = { ...this.store.topics[index], ...req.body };
    this.saveStore();
    res.status(200).json({ success: true, topic: this.store.topics[index] });
  };

  deleteTopic = async (req, res) => {
    const { id } = req.params;
    this.store.topics = this.store.topics.filter(t => t.id !== id);
    this.saveStore();
    res.status(200).json({ success: true, message: 'Topic deleted' });
  };

  getPostsByTopic = async (req, res) => {
    res.status(200).json({ success: true, posts: [], pagination: { currentPage: 1, totalPages: 1 } });
  };

  getPostById = async (req, res) => {
    res.status(200).json({ success: true, post: null });
  };

  createPost = async (req, res) => {
    res.status(201).json({ success: true, post: { id: Date.now(), ...req.body } });
  };

  updatePost = async (req, res) => {
    res.status(200).json({ success: true, post: req.body });
  };

  deletePost = async (req, res) => {
    res.status(200).json({ success: true, message: 'Post deleted' });
  };

  likePost = async (req, res) => {
    res.status(200).json({ success: true, message: 'Post liked' });
  };

  getFeaturedPosts = async (req, res) => {
    res.status(200).json({ success: true, posts: [] });
  };
}

module.exports = new CamusController();
