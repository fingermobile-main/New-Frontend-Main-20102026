/**
 * Camus Academic & Educational Course Engine Service
 * FingerMobile Protocol™ - High-Fidelity Sovereign LMS Client
 */

import { api } from './api';

export interface CamusTelemetry {
  activeStudents: number;
  totalCourses: number;
  totalTopics: number;
  certifiedGraduates: number;
  openResourcesCount: number;
  totalStudyHours: number;
  ficScholarshipVault: number;
  applicantTracksCount: number;
  lastSyncTimestamp: string;
}

export interface CamusLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'lab' | 'quiz' | 'article';
  isCompleted?: boolean;
}

export interface CamusModule {
  moduleNumber: number;
  title: string;
  duration: string;
  lessons: CamusLesson[];
}

export interface CamusStudyPack {
  title: string;
  downloadUrl: string;
  fileSize: string;
  pageCount: number;
  openSourceRepo?: string;
}

export interface CamusQuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface CamusQuiz {
  id: string;
  title: string;
  questionCount: number;
  passingScore: number;
  questions: CamusQuizQuestion[];
}

export interface CamusInstructor {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
  studentsCount: number;
  rating: number;
}

export interface CamusCourse {
  id: string;
  title: string;
  slug: string;
  category: string;
  instructor: CamusInstructor;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  rating: number;
  reviewsCount: number;
  students: number;
  price: number;
  ficPrice: number;
  isScholarshipEligible: boolean;
  thumbnailUrl: string;
  description: string;
  syllabus: CamusModule[];
  studyPack: CamusStudyPack;
  quizzes?: CamusQuiz[];
  status: string;
}

export interface CamusTopic {
  id: string;
  slug: string;
  title: string;
  category: string;
  icon: string;
  courseCount: number;
  studentsCount: number;
  description: string;
  coreSkills: string[];
  learningOutcomes: string[];
  status: string;
}

export interface CamusApplicantTrack {
  id: string;
  code: string;
  title: string;
  targetAudience: string;
  duration: string;
  commitment: string;
  tuition: string;
  scholarshipGrantFIC: number;
  credentialsEarned: string;
  keyTopics: string[];
  acceptanceRate: string;
  recommendedCourseIds: string[];
}

export interface CamusApplicationPayload {
  fullName: string;
  email: string;
  phone?: string;
  trackId: string;
  educationLevel?: string;
  statementOfPurpose?: string;
  nyscCallUpNumber?: string;
}

export interface CamusEnrollment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  progressPct: number;
  completedLessons: string[];
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  quizScores: Record<string, number>;
  certificateIssued: boolean;
}

export interface CamusOpenResource {
  id: string;
  title: string;
  author: string;
  type: string;
  category: string;
  pages: number;
  fileSize: string;
  license: string;
  downloadUrl: string;
  curatedBy: string;
}

export interface CamusCertificate {
  id: string;
  studentName: string;
  studentId: string;
  courseTitle: string;
  courseId: string;
  issuedAt: string;
  grade: string;
  verificationHash: string;
  merkleRoot: string;
  seshatId: string;
  qrPayload: string;
}

class CamusService {
  private baseUrl = '/camus';

  async getTelemetry(): Promise<CamusTelemetry> {
    const res = await api.get(`${this.baseUrl}/telemetry`);
    return res.data?.data || res.data;
  }

  async getCourses(params?: {
    search?: string;
    category?: string;
    level?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: CamusCourse[]; total: number; count: number }> {
    const res = await api.get(`${this.baseUrl}/courses`, { params });
    return res.data;
  }

  async getCourseById(courseId: string): Promise<CamusCourse> {
    const res = await api.get(`${this.baseUrl}/courses/${courseId}`);
    return res.data?.data || res.data;
  }

  async createCourse(formData: FormData): Promise<CamusCourse> {
    const res = await api.post(`${this.baseUrl}/courses`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data?.data || res.data;
  }

  async updateCourse(courseId: string, formData: FormData | Partial<CamusCourse>): Promise<CamusCourse> {
    const isFormData = typeof FormData !== 'undefined' && formData instanceof FormData;
    const res = await api.put(`${this.baseUrl}/courses/${courseId}`, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
    return res.data?.data || res.data;
  }

  async deleteCourse(courseId: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`${this.baseUrl}/courses/${courseId}`);
    return res.data;
  }

  async getTopics(): Promise<CamusTopic[]> {
    const res = await api.get(`${this.baseUrl}/topics`);
    return res.data?.data || res.data?.topics || [];
  }

  async createTopic(topic: Partial<CamusTopic>): Promise<CamusTopic> {
    const res = await api.post(`${this.baseUrl}/topics`, topic);
    return res.data?.data || res.data;
  }

  async getApplicantTracks(): Promise<CamusApplicantTrack[]> {
    const res = await api.get(`${this.baseUrl}/applicants/tracks`);
    return res.data?.data || res.data?.tracks || [];
  }

  async applyApplicant(payload: CamusApplicationPayload): Promise<any> {
    const res = await api.post(`${this.baseUrl}/applicants/apply`, payload);
    return res.data;
  }

  async getEnrollments(studentId?: string): Promise<CamusEnrollment[]> {
    const res = await api.get(`${this.baseUrl}/enrollments`, { params: { studentId } });
    return res.data?.data || res.data?.enrollments || [];
  }

  async createEnrollment(courseId: string, studentId?: string, studentName?: string): Promise<CamusEnrollment> {
    const res = await api.post(`${this.baseUrl}/enrollments`, { courseId, studentId, studentName });
    return res.data?.data || res.data;
  }

  async updateProgress(payload: {
    enrollmentId: string;
    lessonId?: string;
    progressPct?: number;
    quizId?: string;
    score?: number;
  }): Promise<CamusEnrollment> {
    const res = await api.post(`${this.baseUrl}/enrollments/progress`, payload);
    return res.data?.data || res.data;
  }

  async getOpenResources(category?: string): Promise<CamusOpenResource[]> {
    const res = await api.get(`${this.baseUrl}/resources/open-library`, { params: { category } });
    return res.data?.data || res.data?.resources || [];
  }

  async mintCertificate(payload: {
    courseId: string;
    studentName: string;
    studentId?: string;
    grade?: string;
  }): Promise<CamusCertificate> {
    const res = await api.post(`${this.baseUrl}/certificates/mint`, payload);
    return res.data?.data || res.data;
  }

  async verifyCertificate(certificateId: string): Promise<{ success: boolean; verified: boolean; data: CamusCertificate }> {
    const res = await api.get(`${this.baseUrl}/certificates/${certificateId}`);
    return res.data;
  }
}

export const camusService = new CamusService();
