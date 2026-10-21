import React, {} from 'react';
// CAMUS Dashboard Constants

// Types
export interface CamusNavItem {
  name: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface CamusRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface CamusStat {
  label: string;
  value: string;
  icon: string;
}

export interface CourseCategory {
  name: string;
  icon: string;
  courseCount: number;
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  students: number;
  avatarUrl?: string;
}

export interface Testimonial {
  id: string;
  content: string;
  rating: number;
  member: {
  name: string;
  title: string;
  avatarUrl: string;
  };
}

export interface CourseCardProps {
  id: string;
  title: string;
  instructor: {
  name: string;
  avatarUrl: string;
  };
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  price: number;
  imageUrl: string;
  description?: string;
  category: string;
  modules?: Array<{lessons: any[] }>;
}

// Navigation Items
export const CAMUS_NAV_ITEMS: CamusNavItem[] = [
  {name: 'Dashboard',
    href: '/camus/dashboard',
    icon: 'dashboard' },
  {name: 'Courses',
    href: '/camus/courses',
    icon: 'courses',
    badge: 5 },
  {name: 'Instructors',
    href: '/camus/instructors',
    icon: 'instructors' },
  {name: 'Students',
    href: '/camus/students',
    icon: 'students',
    badge: 12 },
  {name: 'Resources',
    href: '/camus/resources',
    icon: 'resources' },
  {name: 'Certificates',
    href: '/camus/certificates',
    icon: 'certificates' },
  {name: 'Analytics',
    href: '/camus/analytics',
    icon: 'analytics' },
  {name: 'Settings',
    href: '/camus/settings',
    icon: 'settings' }
];

// Roles
export const CAMUS_ROLES: CamusRole[] = [
  {id: 'admin',
    name: 'Administrator',
    permissions: [
      'manage_members',
      'manage_courses',
      'access_reports',
      'manage_settings',
      'moderate_content'
    ]
  },
  {id: 'instructor',
    name: 'Instructor',
    permissions: [
      'create_courses',
      'manage_courses',
      'track_students',
      'issue_certificates',
      'view_analytics'
    ]
  },
  {id: 'student',
    name: 'Student',
    permissions: [
      'enroll_courses',
      'access_content',
      'submit_assignments',
      'view_progress',
      'download_resources'
    ]
  },
  {id: 'moderator',
    name: 'Moderator',
    permissions: [
      'moderate_content',
      'manage_discussions',
      'report_issues',
      'support_members'
    ]
  }
];

// Stats
export const CAMUS_STATS: CamusStat[] = [
  {label: 'Active Learners',
    value: '12,543',
    icon: 'members' },
  {label: 'Available Courses',
    value: '248',
    icon: 'courses' },
  {label: 'Certified Graduates',
    value: '8,921',
    icon: 'graduates' }
];

// Categories
export const CAMUS_COURSE_CATEGORIES = [
  { name: 'Arts & Humanities', icon: '🎨', courseCount: 48 },
  { name: 'Social Sciences', icon: '🏛️', courseCount: 52 },
  { name: 'Technology & Computing', icon: '💻', courseCount: 64 },
  { name: 'Business Administration', icon: '💼', courseCount: 45 },
  { name: 'Interdisciplinary Studies', icon: '🌐', courseCount: 30 },
  { name: 'Graduate Research & Grants', icon: '🔬', courseCount: 22 }
];

// Notification Types
export const CAMUS_NOTIFICATION_TYPES = [
  'course_enrollment',
  'assignment_due',
  'grade_update',
  'system_alert',
  'community_update',
  'lesson_plan_approval',
  'bundle_purchase'
];

// Quiz Status
export const CAMUS_QUIZ_STATUS = [
  'not_started',
  'in_progress',
  'submitted',
  'graded'
];

// Enrollment Status
export const CAMUS_ENROLLMENT_STATUS = [
  'enrolled',
  'in_progress',
  'completed',
  'dropped',
  'pending'
];

// Sample Courses Data - School of Arts & Social Sciences and Technology & Business
export const CAMUS_COURSES: CourseCardProps[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    instructor: {
      name: 'John Smith',
      avatarUrl: '/avatars/john.jpg'
    },
    duration: '12 weeks',
    level: 'Beginner',
    rating: 4.8,
    students: 1245,
    price: 199,
    imageUrl: '/images/web-dev-course.jpg',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more to become a full-stack developer.',
    category: 'Technology & Computing',
    modules: [{ lessons: [] }]
  },
  {
    id: '2',
    title: 'Comparative Literature & Cultural Narrative Analysis (BA)',
    instructor: {
      name: 'Dr. Clara Achebe',
      avatarUrl: '/avatars/clara.jpg'
    },
    duration: '14 weeks',
    level: 'Intermediate',
    rating: 4.9,
    students: 840,
    price: 180,
    imageUrl: '/images/literature-course.jpg',
    description: 'Explore world literatures, postcolonial discourse, and critical storytelling across modern civil societies.',
    category: 'Arts & Humanities',
    modules: [{ lessons: [] }]
  },
  {
    id: '3',
    title: 'Sovereign Macroeconomics & Development Finance (MSc)',
    instructor: {
      name: 'Prof. Adeyemi Olatunji',
      avatarUrl: '/avatars/adeyemi.jpg'
    },
    duration: '16 weeks',
    level: 'Advanced',
    rating: 4.9,
    students: 620,
    price: 250,
    imageUrl: '/images/economics-course.jpg',
    description: 'Fiscal decentralization, trade policy, and monetary economics for emerging continental markets.',
    category: 'Social Sciences',
    modules: [{ lessons: [] }]
  },
  {
    id: '4',
    title: 'Constitutional Law, Civil Liberties & Digital Governance (BA)',
    instructor: {
      name: 'Dr. Evelyn Sterling',
      avatarUrl: '/avatars/evelyn.jpg'
    },
    duration: '12 weeks',
    level: 'Intermediate',
    rating: 4.8,
    students: 915,
    price: 195,
    imageUrl: '/images/law-course.jpg',
    description: 'Separation of powers, human rights charters, and digital governance in decentralized societies.',
    category: 'Social Sciences',
    modules: [{ lessons: [] }]
  },
  {
    id: '5',
    title: 'Sociology of Digital Networks & Behavioral Psychology',
    instructor: {
      name: 'Dr. Marcus Vance',
      avatarUrl: '/avatars/marcus.jpg'
    },
    duration: '10 weeks',
    level: 'Beginner',
    rating: 4.7,
    students: 1120,
    price: 160,
    imageUrl: '/images/sociology-course.jpg',
    description: 'Examine social cohesion, algorithmic behavior, and collective social dynamics in networked institutions.',
    category: 'Social Sciences',
    modules: [{ lessons: [] }]
  },
  {
    id: '6',
    title: 'World History, Archaeology & Indigenous Heritage',
    instructor: {
      name: 'Prof. Amina Bello',
      avatarUrl: '/avatars/amina.jpg'
    },
    duration: '12 weeks',
    level: 'Beginner',
    rating: 4.8,
    students: 730,
    price: 150,
    imageUrl: '/images/history-course.jpg',
    description: 'Historical archives, cultural heritage preservation, and archeological documentation methods.',
    category: 'Arts & Humanities',
    modules: [{ lessons: [] }]
  },
  {
    id: '7',
    title: 'Musicology, Acoustics & Digital Soundscapes',
    instructor: {
      name: 'Maitland Ross',
      avatarUrl: '/avatars/maitland.jpg'
    },
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.9,
    students: 540,
    price: 175,
    imageUrl: '/images/music-course.jpg',
    description: 'Harmony, acoustic signal processing, and indigenous musical traditions in modern sonic media.',
    category: 'Arts & Humanities',
    modules: [{ lessons: [] }]
  },
  {
    id: '8',
    title: 'Human Geography & Environmental Urban Systems (Ph.D. Prep)',
    instructor: {
      name: 'Dr. Tariq Al-Mansoor',
      avatarUrl: '/avatars/tariq.jpg'
    },
    duration: '16 weeks',
    level: 'Advanced',
    rating: 4.8,
    students: 480,
    price: 290,
    imageUrl: '/images/geography-course.jpg',
    description: 'Spatial geospatial modeling, urbanization trajectories, and ecological resource stewardship.',
    category: 'Social Sciences',
    modules: [{ lessons: [] }]
  },
  {
    id: '9',
    title: 'Executive Leadership & Strategic Administration',
    instructor: {
      name: 'Robert Davis',
      avatarUrl: '/avatars/robert.jpg'
    },
    duration: '8 weeks',
    level: 'Advanced',
    rating: 4.7,
    students: 890,
    price: 220,
    imageUrl: '/images/leadership-course.jpg',
    description: 'Strategic planning, organizational agility, and cross-border team administrative governance.',
    category: 'Business Administration',
    modules: [{ lessons: [] }]
  }
];

// Course Bundles (Tutor LMS feature: Bundle multiple courses as single packaged degree path)
export interface CamusCourseBundle {
  id: string;
  title: string;
  faculty: string;
  courseCount: number;
  totalHours: number;
  regularPrice: number;
  bundlePrice: number;
  savingsPercentage: number;
  description: string;
  coursesIncluded: string[];
  level: string;
}

export const CAMUS_COURSE_BUNDLES: CamusCourseBundle[] = [
  {
    id: 'bundle-arts-soc-01',
    title: 'School of Arts & Social Sciences: Core Humanities Foundation',
    faculty: 'School of Arts & Social Sciences',
    courseCount: 3,
    totalHours: 140,
    regularPrice: 525,
    bundlePrice: 380,
    savingsPercentage: 28,
    description: 'Comprehensive interdisciplinary package combining Comparative Literature, Constitutional Law, and Sociology.',
    coursesIncluded: ['2', '4', '5'],
    level: 'Bachelor of Arts (BA) Foundation'
  },
  {
    id: 'bundle-soc-econ-02',
    title: 'Sovereign Governance, Development Economics & Geopolitics Suite',
    faculty: 'School of Arts & Social Sciences',
    courseCount: 3,
    totalHours: 160,
    regularPrice: 735,
    bundlePrice: 520,
    savingsPercentage: 29,
    description: 'Mastery pathway across Sovereign Macroeconomics, Digital Constitutionalism, and Human Geography.',
    coursesIncluded: ['3', '4', '8'],
    level: 'Master of Science (MSc) & Executive Track'
  },
  {
    id: 'bundle-tech-biz-03',
    title: 'Decentralized Technology & Enterprise Administration Diploma',
    faculty: 'School of Technology & Business Administration',
    courseCount: 2,
    totalHours: 120,
    regularPrice: 419,
    bundlePrice: 310,
    savingsPercentage: 26,
    description: 'Full stack digital engineering combined with high-performance organizational leadership.',
    coursesIncluded: ['1', '9'],
    level: 'Professional Postgraduate Diploma'
  }
];

// Subscription Plans (Tutor LMS feature: Built-in Subscriptions)
export interface CamusSubscriptionPlan {
  id: string;
  name: string;
  tier: 'scholar_monthly' | 'scholar_annual' | 'institutional_lifetime';
  priceFic: number;
  billingPeriod: string;
  features: string[];
  badge?: string;
}

export const CAMUS_SUBSCRIPTION_PLANS: CamusSubscriptionPlan[] = [
  {
    id: 'sub-plan-monthly',
    name: 'Scholar Pass (Monthly)',
    tier: 'scholar_monthly',
    priceFic: 45,
    billingPeriod: 'per month',
    features: [
      'Unlimited access to School of Arts & Social Sciences microlessons',
      'Interactive AI Studio Lesson Assistant',
      'WebRTC Live Stream Lecture access',
      'Peer-reviewed assignment submissions',
      'Digital verifiable course completion badges'
    ]
  },
  {
    id: 'sub-plan-annual',
    name: 'Academic Scholar Fellowship (Annual)',
    tier: 'scholar_annual',
    priceFic: 390,
    billingPeriod: 'per year',
    badge: 'Most Popular',
    features: [
      'All Monthly Scholar Pass benefits',
      'Blockchain verified cryptographic graduation diplomas',
      'Priority access to Faculty Research Grants & Symposia',
      '1-on-1 Office Hours with Validated University Lecturers',
      'Full access to all Course Bundles & OER Repositories',
      '20% FIC rebate on all specialized certifications'
    ]
  },
  {
    id: 'sub-plan-institutional',
    name: 'Institutional College & Faculty License',
    tier: 'institutional_lifetime',
    priceFic: 1850,
    billingPeriod: 'annual corporate',
    badge: 'Enterprise & ODL',
    features: [
      'Multi-instructor collaboration & Co-authoring console',
      'Advanced Lesson Plan Builder with Bloom’s Taxonomy export',
      'Dedicated campus LMS sub-domain & custom grading scales',
      'Tutor LMS REST API & SCORM / xAPI export pipelines',
      'Full marketplace commission share & payout automation'
    ]
  }
];

// Instructors
export const CAMUS_INSTRUCTORS: Instructor[] = [
  {id: '1',
    name: 'John Smith',
    specialty: 'Full Stack Development',
    rating: 4.8,
    students: 12456,
    avatarUrl: '/avatars/john.jpg'
  },
  {id: '2',
    name: 'Emily Johnson',
    specialty: 'Digital Marketing',
    rating: 4.7,
    students: 9872,
    avatarUrl: '/avatars/emily.jpg'
  },
  {id: '3',
    name: 'Michael Chen',
    specialty: 'UI/UX Design',
    rating: 4.9,
    students: 8561,
    avatarUrl: '/avatars/michael.jpg'
  },
  {id: '4',
    name: 'Sarah Williams',
    specialty: 'Data Science',
    rating: 4.6,
    students: 7234,
    avatarUrl: '/avatars/sarah.jpg'
  }
];

// Testimonials
export const CAMUS_TESTIMONIALS: Testimonial[] = [
  {id: '1',
    content:
      'The course content was extremely valuable and helped me land a job as a junior developer. The instructors were knowledgeable and supportive throughout the learning journey.',
    rating: 5,
    member: {
      name: 'David Wilson',
      title: 'Software Developer',
      avatarUrl: '/avatars/david.jpg'
    }
  },
  {id: '2',
    content:
      'I gained practical skills that I could immediately apply to my current role. The hands-on projects were particularly beneficial in reinforcing the concepts.',
    rating: 4,
    member: {
      name: 'Lisa Thompson',
      title: 'Marketing Manager',
      avatarUrl: '/avatars/lisa.jpg'
    }
  },
  {id: '3',
    content:
      'The learning platform is intuitive and the support team is responsive. I highly recommend this program to anyone looking to advance their career.',
    rating: 5,
    member: {
      name: 'James Rodriguez',
      title: 'UX Designer',
      avatarUrl: '/avatars/james.jpg'
    }
  }
];

export const CAMUS_CATEGORIES: CourseCategory[] = CAMUS_COURSE_CATEGORIES;
