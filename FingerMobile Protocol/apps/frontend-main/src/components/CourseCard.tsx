import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, Clock, Users, BookOpen, CheckCircle, Award } from 'lucide-react';

export interface CourseCardProps {
  id?: string;
  title?: string;
  description?: string;
  instructor?: string | { name: string; avatarUrl?: string };
  duration?: string;
  level?: string;
  price?: number;
  enrolled?: number;
  students?: number;
  rating?: number;
  category?: string;
  imageUrl?: string;
  course?: any;
  onEnroll?: (course: any) => void;
  onViewDetails?: (course: any) => void;
  isEnrolled?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  instructor,
  duration,
  level,
  price,
  enrolled,
  students,
  rating,
  category,
  imageUrl,
  course,
  onEnroll,
  onViewDetails,
  isEnrolled: initialIsEnrolled
}) => {
  // Resolve props from direct arguments or nested `course` object
  const c = course || {};
  const courseId = id || c.id || '1';
  const courseTitle = title || c.title || 'Course Title';
  const courseDesc = description || c.description || 'Comprehensive curriculum designed for mastery.';
  const courseDuration = duration || c.duration || '6 weeks';
  const courseLevel = level || c.level || 'Beginner';
  const coursePrice = typeof price === 'number' ? price : (typeof c.price === 'number' ? c.price : 0);
  const courseStudents = typeof enrolled === 'number' ? enrolled : (typeof students === 'number' ? students : (typeof c.students === 'number' ? c.students : 124));
  const courseRating = typeof rating === 'number' ? rating : (typeof c.rating === 'number' ? c.rating : 4.8);
  const courseCategory = category || c.category || 'Technology';
  const courseImage = imageUrl || c.imageUrl || '/images/web-dev-course.jpg';

  let instructorName = 'Lead Instructor';
  let instructorAvatar = '';
  const rawInstructor = instructor || c.instructor;
  if (typeof rawInstructor === 'string') {
    instructorName = rawInstructor;
  } else if (rawInstructor && typeof rawInstructor === 'object') {
    instructorName = rawInstructor.name || 'Lead Instructor';
    instructorAvatar = rawInstructor.avatarUrl || '';
  }

  // Check enrollment state from props or localStorage
  const [enrolledState, setEnrolledState] = React.useState<boolean>(() => {
    if (initialIsEnrolled) return true;
    try {
      const stored = localStorage.getItem('camus_enrolled_courses');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        return ids.includes(courseId);
      }
    } catch {}
    return false;
  });

  const [studentCount, setStudentCount] = React.useState<number>(courseStudents);

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (enrolledState) {
      if (onViewDetails) {
        onViewDetails(c);
      }
      return;
    }

    setEnrolledState(true);
    setStudentCount(prev => prev + 1);

    try {
      const stored = localStorage.getItem('camus_enrolled_courses');
      const ids: string[] = stored ? JSON.parse(stored) : [];
      if (!ids.includes(courseId)) {
        ids.push(courseId);
        localStorage.setItem('camus_enrolled_courses', JSON.stringify(ids));
      }
    } catch {}

    if (onEnroll) {
      onEnroll({
        id: courseId,
        title: courseTitle,
        description: courseDesc,
        instructor: instructorName,
        duration: courseDuration,
        level: courseLevel,
        price: coursePrice,
        category: courseCategory,
        rating: courseRating
      });
    }
  };

  return (
    <Card className="w-full flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-300 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 group">
      <div>
        {/* Course Banner / Visual */}
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-700 p-4 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md border border-white/20 text-white">
              {courseCategory}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-slate-700 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {courseRating}
            </span>
          </div>

          <div className="z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-100">
              <Clock className="w-3.5 h-3.5" />
              <span>{courseDuration}</span>
              <span>•</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20">{courseLevel}</span>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        </div>

        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {courseTitle}
          </CardTitle>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2 mt-1">
            {courseDesc}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          {/* Instructor & Meta */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-gray-800 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-950 dark:text-blue-300 font-bold flex items-center justify-center text-[10px] uppercase border  border-blue-400 font-black">
                {instructorName.charAt(0)}
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[130px]">
                {instructorName}
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
              <Users className="w-3.5 h-3.5" />
              <span>{studentCount.toLocaleString()} learners</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex items-center justify-between gap-3 pt-3 pb-4 border-t border-slate-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
        <div>
          <span className="text-[10px] font-semibold text-slate-700 uppercase block">Tuition</span>
          <span className="text-lg font-black text-gray-900 dark:text-white">
            {coursePrice === 0 ? 'Free' : `$${coursePrice.toFixed(2)}`}
          </span>
        </div>

        <Button
          onClick={handleEnrollClick}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
            enrolledState
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {enrolledState ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Enrolled ✓ Continue</span>
            </>
          ) : (
            <>
              <BookOpen className="w-3.5 h-3.5" />
              <span>Enroll Now</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;