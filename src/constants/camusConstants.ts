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
  level: "Beginner" | "Intermediate" | "Advanced";
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
  {name: "Dashboard",
  href: "/camus/dashboard",
  icon: "dashboard" },
  {name: "Courses",
  href: "/camus/courses",
  icon: "courses",
  badge: 5 },
  {name: "Instructors",
  href: "/camus/instructors",
  icon: "instructors" },
  {name: "Students",
  href: "/camus/students",
  icon: "students",
  badge: 12 },
  {name: "Resources",
  href: "/camus/resources",
  icon: "resources" },
  {name: "Certificates",
  href: "/camus/certificates",
  icon: "certificates" },
  {name: "Analytics",
  href: "/camus/analytics",
  icon: "analytics" },
  {name: "Settings",
  href: "/camus/settings",
  icon: "settings" }
];

// Roles
export const CAMUS_ROLES: CamusRole[] = [
  {id: "admin",
  name: "Administrator",
  permissions: [
      "manage_members",
  "manage_courses",
  "access_reports",
  "manage_settings",
  "moderate_content"
    ]
  },
  {id: "instructor",
  name: "Instructor",
  permissions: [
      "create_courses",
  "manage_courses",
  "track_students",
  "issue_certificates",
  "view_analytics"
    ]
  },
  {id: "student",
  name: "Student",
  permissions: [
      "enroll_courses",
  "access_content",
  "submit_assignments",
  "view_progress",
  "download_resources"
    ]
  },
  {id: "moderator",
  name: "Moderator",
  permissions: [
      "moderate_content",
  "manage_discussions",
  "report_issues",
  "support_members"
    ]
  }
];

// Stats
export const CAMUS_STATS: CamusStat[] = [
  {label: "Active Learners",
  value: "12,543",
  icon: "members" },
  {label: "Available Courses",
  value: "248",
  icon: "courses" },
  {label: "Certified Graduates",
  value: "8,921",
  icon: "graduates" }
];

// Categories
export const CAMUS_COURSE_CATEGORIES = [
  {name: "Technology",
  icon: "💻",
  courseCount: 42
  },
  {name: "Business",
  icon: "💼",
  courseCount: 36
  },
  {name: "Design",
  icon: "🎨",
  courseCount: 28
  },
  {name: "Marketing",
  icon: "📈",
  courseCount: 31
  },
  {name: "Personal Development",
  icon: "🌱",
  courseCount: 25
  },
  {name: "Health & Fitness",
  icon: "💪",
  courseCount: 18
  }
];

// Notification Types
export const CAMUS_NOTIFICATION_TYPES = [
  "course_enrollment",
  "assignment_due",
  "grade_update",
  "system_alert",
  "community_update"
];

// Quiz Status
export const CAMUS_QUIZ_STATUS = [
  "not_started",
  "in_progress",
  "submitted",
  "graded"
];

// Enrollment Status
export const CAMUS_ENROLLMENT_STATUS = [
  "enrolled",
  "in_progress",
  "completed",
  "dropped",
  "pending"
];

// Sample Courses Data
export const CAMUS_COURSES: CourseCardProps[] = [
  {id: "1",
  title: "Complete Web Development Bootcamp",
  instructor: {
  name: "John Smith",
  avatarUrl: "/avatars/john.jpg" },
duration: "12 weeks",
level: "Beginner",
rating: 4.8,
students: 1245,
price: 199,
imageUrl: "/images/web-dev-course.jpg",
description:
      "Learn HTML, CSS, JavaScript, React, Node.js, and more to become a full-stack developer.",
category: "Technology",
modules: [{lessons: [] }]
  },
  {id: "2",
  title: "Digital Marketing Masterclass",
  instructor: {
  name: "Emily Johnson",
  avatarUrl: "/avatars/emily.jpg" },
duration: "8 weeks",
level: "Intermediate",
rating: 4.7,
students: 987,
price: 149,
imageUrl: "/images/marketing-course.jpg",
description:
      "Master SEO, social media marketing, email campaigns, and analytics.",
category: "Marketing",
modules: [{lessons: [] }]
  },
  {id: "3",
  title: "UI/UX Design Fundamentals",
  instructor: {
  name: "Michael Chen",
  avatarUrl: "/avatars/michael.jpg" },
duration: "6 weeks",
level: "Beginner",
rating: 4.9,
students: 856,
price: 129,
imageUrl: "/images/design-course.jpg",
description:
      "Learn design principles, prototyping, and member research techniques.",
category: "Design",
modules: [{lessons: [] }]
  },
  {id: "4",
  title: "Data Science Essentials",
  instructor: {
  name: "Sarah Williams",
  avatarUrl: "/avatars/sarah.jpg" },
duration: "10 weeks",
level: "Intermediate",
rating: 4.6,
students: 723,
price: 249,
imageUrl: "/images/data-science-course.jpg",
description:
      "Python, statistics, machine learning, and data visualization fundamentals.",
category: "Technology",
modules: [{lessons: [] }]
  },
  {id: "5",
  title: "Leadership & Management",
  instructor: {
  name: "Robert Davis",
  avatarUrl: "/avatars/robert.jpg" },
duration: "7 weeks",
level: "Advanced",
rating: 4.5,
students: 642,
price: 179,
imageUrl: "/images/leadership-course.jpg",
description:
      "Develop leadership skills, team management, and strategic thinking.",
category: "Business",
modules: [{lessons: [] }]
  },
  {id: "6",
  title: "Financial Planning & Investment",
  instructor: {
  name: "Jennifer Lee",
  avatarUrl: "/avatars/jennifer.jpg" },
duration: "9 weeks",
level: "Intermediate",
rating: 4.7,
students: 531,
price: 159,
imageUrl: "/images/finance-course.jpg",
description:
      "Personal finance, investment strategies, and retirement planning.",
category: "Business",
modules: [{lessons: [] }]
  }
];

// Instructors
export const CAMUS_INSTRUCTORS: Instructor[] = [
  {id: "1",
  name: "John Smith",
  specialty: "Full Stack Development",
  rating: 4.8,
  students: 12456,
  avatarUrl: "/avatars/john.jpg"
  },
  {id: "2",
  name: "Emily Johnson",
  specialty: "Digital Marketing",
  rating: 4.7,
  students: 9872,
  avatarUrl: "/avatars/emily.jpg"
  },
  {id: "3",
  name: "Michael Chen",
  specialty: "UI/UX Design",
  rating: 4.9,
  students: 8561,
  avatarUrl: "/avatars/michael.jpg"
  },
  {id: "4",
  name: "Sarah Williams",
  specialty: "Data Science",
  rating: 4.6,
  students: 7234,
  avatarUrl: "/avatars/sarah.jpg"
  }
];

// Testimonials
export const CAMUS_TESTIMONIALS: Testimonial[] = [
  {id: "1",
  content:
      "The course content was extremely valuable and helped me land a job as a junior developer. The instructors were knowledgeable and supportive throughout the learning journey.",
  rating: 5,
  member: {
  name: "David Wilson",
  title: "Software Developer",
  avatarUrl: "/avatars/david.jpg"
    }
  },
  {id: "2",
  content:
      "I gained practical skills that I could immediately apply to my current role. The hands-on projects were particularly beneficial in reinforcing the concepts.",
  rating: 4,
  member: {
  name: "Lisa Thompson",
  title: "Marketing Manager",
  avatarUrl: "/avatars/lisa.jpg"
    }
  },
  {id: "3",
  content:
      "The learning platform is intuitive and the support team is responsive. I highly recommend this program to anyone looking to advance their career.",
  rating: 5,
  member: {
  name: "James Rodriguez",
  title: "UX Designer",
  avatarUrl: "/avatars/james.jpg"
    }
  }
];

export const CAMUS_CATEGORIES: any[] = [];
