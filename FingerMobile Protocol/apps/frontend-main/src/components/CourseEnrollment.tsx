import React, { useState } from 'react';

interface CourseEnrollmentProps {
  courseId?: string;
  courseTitle?: string;
  price?: number;
  onEnroll?: (courseId: string) => void;
}

const CourseEnrollment: React.FC<CourseEnrollmentProps> = ({
  courseId = '',
  courseTitle = 'Course',
  price = 0,
  onEnroll
}) => {
  const [isEnrolling, setIsEnrolling] = React.useState(false);
  const [enrolled, setEnrolled] = React.useState(false);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onEnroll?.(courseId);
      setEnrolled(true);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (enrolled) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-medium">✓ Successfully Enrolled</p>
        <p className="text-sm text-green-600 mt-1">You now have access to this course</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{courseTitle}</h3>

      <div className="mb-4">
        <p className="text-3xl font-bold text-blue-600">{price.toLocaleString()} FIC</p>
        <p className="text-sm text-slate-700 mt-1">One-time payment • Lifetime access</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          <span>Full course access</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          <span>Certificate of completion</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          <span>Community support</span>
        </div>
      </div>

      <button
        onClick={handleEnroll}
        disabled={isEnrolling}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
      >
        {isEnrolling ? 'Processing...' : 'Enroll Now'}
      </button>
    </div>
  );
};

export default CourseEnrollment;
