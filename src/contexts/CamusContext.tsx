import React, {} from 'react';
/*
 * FingerMobile Protocol™ - CAMUS Educational Platform Context
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { useAppContext } from './AppContext';
import { useAuth } from './AuthContext';
import { CAMUS_STATS, CamusStat } from '../constants/camusConstants';
import { api } from '../services/api';

// Type definitions for CAMUS educational platform
export interface CamusCourse {
  id: string;
  title: string;
  description?: string;
  instructorId: string;
  categoryId: string;
  thumbnail: string;
  price: number;
  rating: number;
  students: number;
  modules: CamusModule[];
  status: "draft" | "pending" | "published";
}

export interface CamusModule {
  id: string;
  title: string;
  description?: string;
  lessons: CamusLesson[];
}

export interface CamusLesson {
  id: string;
  title: string;
  type: "video" | "article" | "quiz" | "assignment";
  duration: number; // in minutes
  content: string; // URL or content
}

export interface CamusEnrollment {
  id: string;
  memberId: string;
  courseId: string;
  enrolledAt: Date;
  progress: number; // 0-100
  completedLessons: string[]; // lesson IDs
  status: "active" | "completed" | "dropped";
}

export interface CamusQuizAttempt {
  id: string;
  memberId: string;
  quizId: string;
  courseId: string;
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  answers: CamusQuizAnswer[];
  status: "not_started" | "in_progress" | "completed" | "graded";
}

export interface CamusQuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
}

export interface CamusNotification {
  id: string;
  memberId: string;
  type: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  relatedId?: string; // course, quiz, etc.
}

export interface AIGeneratedContent {
  id: string;
  type: "course" | "lesson" | "quiz" | "assignment" | "title" | "description";
  title: string;
  content: string;
  createdAt: Date;
  used: boolean;
}

export interface CamusState {
  courses: CamusCourse[];
  enrollments: CamusEnrollment[];
  quizAttempts: CamusQuizAttempt[];
  notifications: CamusNotification[];
  aiGeneratedContent: AIGeneratedContent[];
  stats: CamusStat[];
  loading: boolean;
  error: string | null;
}

export type CamusAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_COURSES"; payload: CamusCourse[] }
  | { type: "SET_ENROLLMENTS"; payload: CamusEnrollment[] }
  | { type: "SET_QUIZ_ATTEMPTS"; payload: CamusQuizAttempt[] }
  | { type: "SET_NOTIFICATIONS"; payload: CamusNotification[] }
  | {
      type: "UPDATE_ENROLLMENT_PROGRESS";
      payload: {
        enrollmentId: string;
        progress: number;
        completedLessons: string[];
      };
    }
  | { type: "ADD_QUIZ_ATTEMPT"; payload: CamusQuizAttempt }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: CamusNotification }
  | { type: "ADD_AI_CONTENT"; payload: AIGeneratedContent }
  | { type: "MARK_AI_CONTENT_USED"; payload: string };

interface CamusProviderProps {
  children: React.ReactNode;
}

// Create context
interface CamusContextType extends CamusState {
  enrollInCourse: (courseId: string) => Promise<void>;
  updateProgress: (enrollmentId: string, lessonId: string) => void;
  startQuizAttempt: (
    quizId: string,
    courseId: string,
  ) => Promise<CamusQuizAttempt>;
  completeQuizAttempt: (
    attemptId: string,
    answers: CamusQuizAnswer[],
  ) => Promise<void>;
  markNotificationRead: (notificationId: string) => void;
  generateAIContent: (
    type: string,
    prompt: string,
  ) => Promise<AIGeneratedContent>;
  markAIContentAsUsed: (contentId: string) => void;
  getStats: () => CamusStat[];
}

const CamusContext = React.createContext<CamusContextType | undefined>(undefined);

// Initial state
const initialState: CamusState = {
  courses: [],
  enrollments: [],
  quizAttempts: [],
  notifications: [],
  aiGeneratedContent: [],
  stats: [],
  loading: false,
  error: null
};

// Reducer
const camusReducer = (state: CamusState, action: CamusAction): CamusState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_COURSES":
      return { ...state, courses: action.payload };

    case "SET_ENROLLMENTS":
      return { ...state, enrollments: action.payload };

    case "SET_QUIZ_ATTEMPTS":
      return { ...state, quizAttempts: action.payload };

    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };

    case "UPDATE_ENROLLMENT_PROGRESS":
      return {
        ...state,
        enrollments: state.enrollments.map((enrollment) =>
          enrollment.id === action.payload.enrollmentId
            ? {
                ...enrollment,
                progress: action.payload.progress,
                completedLessons: action.payload.completedLessons,
                status:
                  action.payload.progress === 100
                    ? "completed"
                    : enrollment.status
              }
            : enrollment,
        )
      };

    case "ADD_QUIZ_ATTEMPT":
      return {
        ...state,
        quizAttempts: [...state.quizAttempts, action.payload]
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification,
        )
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };

    case "ADD_AI_CONTENT":
      return {
        ...state,
        aiGeneratedContent: [...state.aiGeneratedContent, action.payload]
      };

    case "MARK_AI_CONTENT_USED":
      return {
        ...state,
        aiGeneratedContent: state.aiGeneratedContent.map((content) =>
          content.id === action.payload ? { ...content, used: true } : content,
        )
      };

    default:
      return state;
  }
};

// Provider component
export const CamusProvider: React.FC<CamusProviderProps> = ({ children }) => {
  const [state, dispatch] = React.useReducer(camusReducer, initialState);
  const { member } = useAuth();
  const { showToast } = useAppContext(); 
  const memberId = member?.id || "";

  const enrollInCourse = React.useCallback(async (courseId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const newEnrollment: CamusEnrollment = {
        id: `enrollment_${Date.now()}`,
        memberId: typeof memberId === 'string' ? memberId : String(memberId),
        courseId: typeof courseId === 'string' ? courseId : String(courseId),
        enrolledAt: new Date(),
        progress: 0,
        completedLessons: [],
        status: "active"
      };

      dispatch({
        type: "SET_ENROLLMENTS",
        payload: [...state.enrollments, newEnrollment]
      });

      const newNotification: CamusNotification = {
        id: `notification_${Date.now()}`,
        memberId: typeof memberId === 'string' ? memberId : String(memberId),
        type: "enrollment",
        title: "Course Enrollment",
        message: `You have been enrolled in a new course`,
        createdAt: new Date(),
        read: false,
        relatedId: typeof courseId === 'string' ? courseId : String(courseId)
      };

      dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });
      showToast("Successfully enrolled in course", "success");
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to enroll in course" });
      showToast("Failed to enroll in course", "error");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [memberId, state.enrollments, showToast]);

  const updateProgress = React.useCallback((enrollmentId: string, lessonId: string) => {
    const enrollment = state.enrollments.find((e) => e.id === enrollmentId);
    if (!enrollment) return;

    const completedLessons = enrollment.completedLessons.includes(lessonId)
      ? enrollment.completedLessons
      : [...enrollment.completedLessons, lessonId];

    const course = state.courses.find((c) => c.id === enrollment.courseId);
    if (!course) return;

    const totalLessons = course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0,
    );
    const progress =
      totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

    dispatch({
      type: "UPDATE_ENROLLMENT_PROGRESS",
      payload: {
        enrollmentId,
        progress,
        completedLessons
      }
    });

    if (progress === 100) {
      const newNotification: CamusNotification = {
        id: `notification_${Date.now()}`,
        memberId: typeof memberId === 'string' ? memberId : String(memberId),
        type: "certificate_ready",
        title: "Certificate Ready",
        message: `Congratulations! You've completed a course and earned a certificate`,
        createdAt: new Date(),
        read: false,
        relatedId: typeof enrollment.courseId === 'string' ? enrollment.courseId : String(enrollment.courseId)
      };

      dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });
      showToast("Congratulations! Course completed!", "success");
    }
  }, [state.enrollments, state.courses, memberId, showToast]);

  const startQuizAttempt = React.useCallback(async (
    quizId: string,
    courseId: string,
  ): Promise<CamusQuizAttempt> => {
    const newAttempt: CamusQuizAttempt = {
      id: `attempt_${Date.now()}`,
      memberId: typeof memberId === 'string' ? memberId : String(memberId),
      quizId: typeof quizId === 'string' ? quizId : String(quizId),
      courseId: typeof courseId === 'string' ? courseId : String(courseId),
      startedAt: new Date(),
      completedAt: undefined,
      score: 0,
      answers: [],
      status: "in_progress" as const
    };

    dispatch({ type: "ADD_QUIZ_ATTEMPT", payload: newAttempt });
    return newAttempt;
  }, [memberId]);

  const completeQuizAttempt = React.useCallback(async (
    attemptId: string,
    answers: CamusQuizAnswer[],
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const updatedAttempts = state.quizAttempts.map((attempt) =>
        attempt.id === attemptId
          ? {
              ...attempt,
              completedAt: new Date() as Date,
              answers,
              status: "completed" as const
            }
          : attempt,
      );

      dispatch({ type: "SET_QUIZ_ATTEMPTS", payload: updatedAttempts });
      showToast("Quiz submitted successfully", "success");
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to complete quiz attempt"
      });
      showToast("Failed to submit quiz", "error");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.quizAttempts, showToast]);

  const markNotificationRead = React.useCallback((notificationId: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: notificationId });
  }, []);

  const generateAIContent = React.useCallback(async (
    type: string,
    prompt: string,
  ): Promise<AIGeneratedContent> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await api.post("/ai/generate-content", {
        type,
        prompt
      });
      const newContent: AIGeneratedContent = response.data;

      dispatch({ type: "ADD_AI_CONTENT", payload: newContent });
      return newContent;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to generate AI content" });
      showToast("Failed to generate AI content", "error");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [showToast]);

  const markAIContentAsUsed = React.useCallback((contentId: string) => {
    dispatch({ type: "MARK_AI_CONTENT_USED", payload: contentId });
  }, []);

  const getStats = React.useCallback((): CamusStat[] => {
    if (!member) return [];
    const role = member.role || "student";
    // Fix the type assertion issue
    const statsMap = CAMUS_STATS as unknown as Record<string, CamusStat[]>;
    return statsMap[role] || [];
  }, [member]);

  const value = React.useMemo(() => ({
    ...state,
    enrollInCourse,
    updateProgress,
    startQuizAttempt,
    completeQuizAttempt,
    markNotificationRead,
    generateAIContent,
    markAIContentAsUsed,
    getStats
  }), [
    state,
    enrollInCourse,
    updateProgress,
    startQuizAttempt,
    completeQuizAttempt,
    markNotificationRead,
    generateAIContent,
    markAIContentAsUsed,
    getStats
  ]);

  return (
    <CamusContext.Provider value={value}>{children}</CamusContext.Provider>
  );
};

// Custom hook to use the context
export const useCamus = (): CamusContextType => {
  const context = React.useContext(CamusContext);
  if (context === undefined) {
    throw new Error("useCamus must be used within a CamusProvider");
  }
  return context;
};

export default CamusContext;
