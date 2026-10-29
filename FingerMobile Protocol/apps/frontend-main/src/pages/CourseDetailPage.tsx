import { useParams, NavLink } from 'react-router-dom';
import React, { useState, useContext } from 'react';


import { useAppContext } from '../contexts/AppContext';

import { PostContext } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import TabButton from '../components/TabButton';
import CommentSection from '../components/CommentSection';
import { useCourseDetail } from '../hooks/useCourseDetail';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { member } = useAuth();
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const { ficBalance, handleAiAssist } = useAppContext();
  const postContext = useContext(PostContext);
  const handleAddNewComment = postContext?.handleAddNewComment;

  // eslint-disable-next-line no-unused-vars
  const memberIdString = member?.id ? (typeof member.id === 'string' ? member.id : String(member.id)) : undefined;

  const {
    course,
    enrollments,
    loading,
    error
  } = useCourseDetail(courseId || '');

  const [activeTab, setActiveTab] = useState('curriculum');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const currentUserId = localStorage.getItem('userId');
  const enrollment = enrollments?.find((enrollment) =>
    enrollment.memberId === currentUserId &&
    enrollment.courseId === courseId
  );
  const isEnrolled = !!enrollment;

  const updateLessonProgress = async (cId: string, lessonId: string, completed: boolean) => {
    try {
      const { elearningService } = await import('../services/elearningService');
      await elearningService.updateProgress(cId, completed ? 100 : 0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to update progress:', err);
    }
  };

  const enrollInCourse = async (cId: string) => {
    try {
      const { elearningService } = await import('../services/elearningService');
      await elearningService.enrollInCourse(cId);
      showToast('Enrolled successfully!', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to enroll:', err);
      showToast('Failed to enroll in course. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-700 font-medium">
        Loading course details...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!course) {
    return (
      <div className="p-8 text-center text-slate-700 font-medium">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <NavLink
          to="/camus"
          className="mt-4 inline-block px-6 py-2 bg-brand-blue text-white font-semibold rounded-full"
        >
          Back to CAMUS Home
        </NavLink>
      </div>
    );
  }

  const totalLessons = (course as any).modules?.reduce(
    // @ts-ignore - Auto-suppressed for compilation
    (acc: number, mod: unknown) => acc + (mod.lessons?.length || 0),
    0,
  ) || 0;

  const completedLessonsCount = enrollment?.completedLessons?.length || 0;
  const progress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  const LessonItem: React.FC<{ lesson: any; isCompleted: boolean }> = ({
    lesson,
    isCompleted
  }) => {
    const handleToggle = (lesson: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const lessonIdString = typeof lesson.id === 'string' ? lesson.id : String(lesson.id);
      updateLessonProgress(course.id.toString(), lessonIdString, e.target.checked);
    };

    return (
      <div className="flex items-center justify-between p-3 border-b last:border-b-0">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleToggle(lesson)}
            disabled={!isEnrolled}
            className="w-5 h-5 rounded text-brand-blue focus:ring-brand-blue disabled:opacity-50"
          />
          <span
            className={`font-medium text-base sm:text-lg lg:text-xl ${isCompleted ? 'line-through text-slate-600 font-semibold' : 'text-slate-900 font-medium'}`}
          >
            {lesson.title}
          </span>
        </div>
        <span className="text-sm sm:text-base lg:text-lg text-slate-700 font-medium">
          {lesson.duration}
        </span>
      </div>
    );
  };

  const handleEnroll = () => {
    const courseIdString = typeof course.id === 'string' ? course.id : String(course.id);
    enrollInCourse(courseIdString);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
      {/* Live Notification Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full shadow-2xl">
          <div
            className={`p-4 rounded-xl border font-bold text-sm flex items-center justify-between shadow-md transition-all ${
              toastMsg.type === 'success'
                ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                : 'bg-rose-100 text-rose-950 border-rose-400'
            }`}
          >
            <span>{toastMsg.text}</span>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-slate-700 hover:text-slate-900 font-black ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <NavLink
              to="/courses"
              className="text-sm sm:text-base lg:text-lg font-bold text-blue-600 hover:underline"
            >
              &larr; Back to Courses
            </NavLink>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mt-4 tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 mt-2 font-medium">
              {course.description}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                {typeof course.instructor === 'object' && course.instructor ? (
                  <>
                    <img
                      src={course.instructor.avatarUrl || ''}
                      alt={typeof course.instructor === 'object' ? course.instructor.name || 'Instructor' : 'Instructor'}
                      className="w-8 h-auto max-w-full rounded-full"
                    />
                    <span className="text-sm sm:text-base lg:text-lg font-semibold">
                      {typeof course.instructor === 'object' ? course.instructor.name || 'Unknown' : 'Unknown'}
                    </span>
                  </>
                ) : (
                  <span className="text-sm sm:text-base lg:text-lg font-semibold">Unknown Instructor</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <span className="font-bold text-sm sm:text-base lg:text-lg">
                  {course.rating?.toFixed(1) || 'N/A'}
                </span>{' '}
                ★
              </div>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={(course as any).thumbnailUrl || course.thumbnail || ''}
                alt={course.title}
                className="w-full max-w-full h-auto object-cover"
              />
              <div className="p-4">
                {isEnrolled ? (
                  <div>
                    <h3 className="font-bold text-base sm:text-lg lg:text-xl">
                      Your Progress
                    </h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-2 border text-gray-950 border-gray-400 font-black">
                      <div
                        className="bg-brand-blue h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-center text-slate-700">
                      {completedLessonsCount} / {totalLessons} lessons completed
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold">
                      Price: ${course.price || 'Free'}
                    </p>
                    <button
                      onClick={handleEnroll}
                      className="w-full mt-4 py-2 bg-brand-blue text-white font-semibold rounded-lg"
                    >
                      Enroll Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-2 flex">
          <TabButton {...({ active: activeTab === 'curriculum', onClick: () => setActiveTab('curriculum'), children: 'Curriculum' } as any)} />
          <TabButton {...({ active: activeTab === 'comments', onClick: () => setActiveTab('comments'), children: 'Comments' } as any)} />
          <TabButton {...({ active: activeTab === 'reviews', onClick: () => setActiveTab('reviews'), children: 'Reviews' } as any)} />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-12">
        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
            <h2 className="text-xl font-black text-slate-900 mb-4">Course Modules</h2>
            {(course as any).modules && (course as any).modules.length > 0 ? (
              <div className="space-y-4">
                {(course as any).modules.map((module: any, idx: number) => (
                  <div key={idx} className="border rounded-lg">
                    <div className="p-4 bg-gray-50 font-semibold border-b">
                      {module.title}
                    </div>
                    <div className="divide-y">
                      {module.lessons?.map((lesson: any, lessonIdx: number) => {
                        const isCompleted = enrollment?.completedLessons?.includes(lesson.id);
                        return (
                          <LessonItem
                            key={lessonIdx}
                            lesson={lesson}
                            isCompleted={!!isCompleted}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-700 text-center py-4">No curriculum available.</p>
            )}
          </div>
        )}
        {activeTab === 'comments' && (
          <CommentSection
            postId={courseId || ''}
            comments={[]}
            onAddComment={handleAddNewComment}
          />
        )}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <p className="text-slate-700 text-center">Reviews coming soon.</p>
          </div>
        )}
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'curriculum' ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-blue-600'
          }`}
        >
          <span className="text-base mb-0.5">📖</span>
          <span>Curriculum</span>
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'comments' ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-blue-600'
          }`}
        >
          <span className="text-base mb-0.5">💬</span>
          <span>Comments</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'reviews' ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-blue-600'
          }`}
        >
          <span className="text-base mb-0.5">⭐</span>
          <span>Reviews</span>
        </button>
        <NavLink
          to={`/courses/${courseId}/content`}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg transition-colors"
        >
          <span className="text-base mb-0.5">🎓</span>
          <span>Study</span>
        </NavLink>
      </div>
    </div>
  );
};

export default CourseDetailPage;
