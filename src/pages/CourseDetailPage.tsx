import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import { useParams, NavLink } from "react-router-dom";
import { PostContext } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import TabButton from '../components/TabButton';
import CommentSection from '../components/CommentSection';
import { useCourseDetail } from '../hooks/useCourseDetail';
import type { Course } from '../types';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { member } = useAuth();
  const { ficBalance, handleAiAssist } = useAppContext();
  const postContext = React.useContext(PostContext);
  const handleAddNewComment = postContext?.handleAddNewComment;

  const {
    course,
    enrollment,
    loading,
    error,
    enrollInCourse,
    updateLessonProgress
  } = useCourseDetail(courseId || "", member?.id);

  const [activeTab, setActiveTab] = React.useState("curriculum");

  const isEnrolled = !!enrollment;

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading course details...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!course) {
    return (
      <div className="p-8 text-center text-gray-500">
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
  const progress =
    totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  const LessonItem: React.FC<{ lesson: any; isCompleted: boolean }> = ({
    lesson,
    isCompleted
  }) => {
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLessonProgress(course.id, lesson.id, e.target.checked);
    };

    return (
      <div className="flex items-center justify-between p-3 border-b last:border-b-0">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleToggle}
            disabled={!isEnrolled}
            className="w-5 h-5 rounded text-brand-blue focus:ring-brand-blue disabled:opacity-50"
          />
          <span
            className={`font-medium text-base sm:text-lg lg:text-xl ${isCompleted ? "line-through text-gray-400" : "text-gray-700"}`}
          >
            {lesson.title}
          </span>
        </div>
        <span className="text-sm sm:text-base lg:text-lg text-gray-500">
          {lesson.duration}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <NavLink
              to="/camus"
              className="text-sm sm:text-base lg:text-lg font-semibold text-brand-blue hover:underline"
            >
              Back to Courses
            </NavLink>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-4">
              {course.title}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mt-2">
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
                </span>{" "}
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
                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                      <div
                        className="bg-brand-blue h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-center text-gray-500">
                      {completedLessonsCount} / {totalLessons} lessons completed
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold">
                      Price: ${course.price || 'Free'}
                    </p>
                    <button
                      onClick={() => enrollInCourse(course.id)}
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
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-sm p-2 flex">
        <TabButton {...({ active: activeTab === "curriculum", onClick: () => setActiveTab("curriculum"), children: "Curriculum" } as any)} />
        <TabButton {...({ active: activeTab === "comments", onClick: () => setActiveTab("comments"), children: "Comments" } as any)} />
        <TabButton {...({ active: activeTab === "reviews", onClick: () => setActiveTab("reviews"), children: "Reviews" } as any)} />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto mt-6 mb-12">
        {activeTab === "curriculum" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Course Modules</h2>
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
              <p className="text-gray-500 text-center py-4">No curriculum available.</p>
            )}
          </div>
        )}
        {activeTab === "comments" && (
          <CommentSection
            postId={courseId || ""}
            comments={[]}
            onAddComment={handleAddNewComment}
          />
        )}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <p className="text-gray-500 text-center">Reviews coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;