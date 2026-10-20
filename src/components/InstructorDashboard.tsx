import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  Plus,
  Play,
  Video,
  FileText,
  HelpCircle,
  Sparkles,
  Bot,
  Layers,
  Award,
  CheckCircle,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Download,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Wallet,
  Settings
} from 'lucide-react';
import LessonPlanBuilder from './camus/LessonPlanBuilder';
import { useAppContext } from '../contexts/AppContext';

interface Course {
  id: string;
  title: string;
  school: string;
  description?: string;
  students: number;
  revenue: number;
  rating: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  modulesCount: number;
  lessonsCount: number;
}

interface InstructorDashboardProps {
  courses?: Course[];
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ courses: propCourses }) => {
  const { ficBalance, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'lesson_plan_builder' | 'course_builder' | 'ai_studio' | 'grading_queue' | 'earnings_withdrawals'
  >('overview');

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c-101',
      title: 'Comparative Literature & Cultural Narrative Analysis (BA)',
      school: 'School of Arts & Social Sciences',
      description: 'Explore world literatures, postcolonial discourse, and critical storytelling across modern civil societies.',
      students: 840,
      revenue: 15120,
      rating: 4.9,
      status: 'published',
      createdAt: '2026-09-12',
      modulesCount: 6,
      lessonsCount: 24
    },
    {
      id: 'c-102',
      title: 'Constitutional Law, Civil Liberties & Digital Governance (BA)',
      school: 'School of Arts & Social Sciences',
      description: 'Separation of powers, human rights charters, and digital governance in decentralized societies.',
      students: 915,
      revenue: 17842,
      rating: 4.8,
      status: 'published',
      createdAt: '2026-08-20',
      modulesCount: 8,
      lessonsCount: 32
    },
    {
      id: 'c-103',
      title: 'Decentralized Technology & Distributed Systems Engineering',
      school: 'School of Technology & Business Administration',
      description: 'Protocols, cryptography, P2P network architecture and sovereign state compute.',
      students: 1240,
      revenue: 24800,
      rating: 4.9,
      status: 'published',
      createdAt: '2026-07-04',
      modulesCount: 10,
      lessonsCount: 40
    }
  ]);

  // Course Builder state
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSchool, setNewCourseSchool] = useState('School of Arts & Social Sciences');
  const [newCourseLevel, setNewCourseLevel] = useState('Bachelor of Arts (BA)');
  const [newCoursePrice, setNewCoursePrice] = useState('180');
  const [videoSource, setVideoSource] = useState('Bunny Stream CDN');
  const [dripMode, setDripMode] = useState('Sequential by Topic');

  // AI Studio state
  const [aiPrompt, setAiPrompt] = useState('Generate an 8-week syllabus and 5 quiz assessments for African Philosophy and Postcolonial Critical Theory');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<any>(null);

  // Withdrawal modal / states
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [withdrawMethod, setWithdrawMethod] = useState<'fic' | 'bank' | 'paypal' | 'echeck'>('fic');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Commission Calculations
  const totalRevenue = courses.reduce((sum, c) => sum + c.revenue, 0);
  const instructorShare = Math.round(totalRevenue * 0.80); // 80% instructor share
  const platformFee = totalRevenue - instructorShare;
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);

  const handleGenerateAiCurriculum = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setAiOutput({
        title: 'African Philosophy & Postcolonial Critical Theory',
        school: 'School of Arts & Social Sciences',
        department: 'Philosophy & Cultural Studies',
        level: 'Undergraduate Honours (BA 3rd Year)',
        modules: [
          {
            title: 'Module 1: Foundations of Epistemic Decolonization',
            duration: '2 weeks',
            lessons: ['1.1 Eurocentrism vs. Afrocentric Epistemology', '1.2 Wiredu and Hountondji on Conceptual Decolonization', '1.3 Ubuntu as an Ethical Framework for Modern Institutions']
          },
          {
            title: 'Module 2: Narrative Sovereignty and Indigenous Orality',
            duration: '2 weeks',
            lessons: ['2.1 Orality as Rigorous Intellectual Archive', '2.2 Linguistic Hegemony and Indigenous Language Reclamation', '2.3 Postcolonial Literature as Philosophical Discourse']
          },
          {
            title: 'Module 3: Contemporary African Political Philosophy',
            duration: '2 weeks',
            lessons: ['3.1 Achille Mbembe and Necropolitics', '3.2 Sovereign Statehood and Neocolonial Economic Structures', '3.3 Pan-African Technological Futures']
          }
        ],
        bloomsAlignment: 'Analyze & Evaluate',
        assessmentRubric: 'Midterm Research Essay (40%), Bi-weekly Oral Colloquium (30%), Final Policy Paper (30%)'
      });
      setIsAiGenerating(false);
      showToast('AI Studio has compiled the full course curriculum!', 'success');
    }, 1200);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newCourse: Course = {
      id: `c-${Date.now().toString().slice(-4)}`,
      title: newCourseTitle,
      school: newCourseSchool,
      description: `Newly authored curriculum in ${newCourseSchool}. Ready for faculty review and student enrollment.`,
      students: 0,
      revenue: 0,
      rating: 5.0,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      modulesCount: 4,
      lessonsCount: 16
    };

    setCourses([newCourse, ...courses]);
    setNewCourseTitle('');
    showToast(`New course "${newCourseTitle}" created in draft mode!`, 'success');
    setActiveTab('overview');
  };

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      showToast(`Withdrawal request of ${withdrawAmount} FIC via ${withdrawMethod.toUpperCase()} submitted for immediate protocol clearance!`, 'success');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
                CAMUS Faculty Studio
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold">
                Validated University Lecturer
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Instructor & Faculty Curriculum Console
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Design Bloom’s Taxonomy lesson plans, author multimedia microlessons, configure content drip schedules, and monitor student grading queues across the School of Arts & Social Sciences and Technology.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('lesson_plan_builder')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Open Lesson Plan Builder
            </button>
            <button
              onClick={() => setActiveTab('course_builder')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Course
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-4">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'lesson_plan_builder', label: 'Lesson Plan Builder', icon: <Sparkles className="w-4 h-4 text-amber-400" />, badge: 'Core' },
            { id: 'course_builder', label: 'Course Curriculum Studio', icon: <Layers className="w-4 h-4" /> },
            { id: 'ai_studio', label: 'AI Studio Syllabus Generator', icon: <Bot className="w-4 h-4 text-indigo-400" /> },
            { id: 'grading_queue', label: 'Assignments & Grading (4)', icon: <Award className="w-4 h-4" /> },
            { id: 'earnings_withdrawals', label: 'Revenue & Withdrawals', icon: <Wallet className="w-4 h-4" /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] font-mono uppercase bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-slate-300 dark:border-gray-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider">Total Active Scholars</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
                {totalStudents.toLocaleString()}
              </p>
              <span className="text-[11px] font-bold text-emerald-800 mt-1 inline-block">
                ↑ +14.2% enrollment this month
              </span>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-slate-300 dark:border-gray-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Course Revenue</span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
                {totalRevenue.toLocaleString()} FIC
              </p>
              <span className="text-[11px] font-bold text-slate-700 mt-1 inline-block">
                80% Instructor share: <strong className="text-slate-900">{instructorShare.toLocaleString()} FIC</strong>
              </span>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-slate-300 dark:border-gray-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider">Faculty Rating</span>
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
                4.88 / 5.0
              </p>
              <span className="text-[11px] font-bold text-slate-700 mt-1 inline-block">
                Based on 2,140 scholar reviews
              </span>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-slate-300 dark:border-gray-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider">Published Curricula</span>
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
                {courses.length} Programs
              </p>
              <span className="text-[11px] font-bold text-blue-800 mt-1 inline-block">
                Arts, Social Sciences & Tech
              </span>
            </div>
          </div>

          {/* Active Courses Table */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Active Faculty Programs & Degree Tracks
                </h3>
                <p className="text-xs text-slate-700 mt-0.5">
                  Manage curriculum delivery, video attachments, and syllabus settings.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('course_builder')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                + Add Course Module
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-800">
                    <th className="py-3 px-6">Course & Faculty</th>
                    <th className="py-3 px-6">Modules / Lessons</th>
                    <th className="py-3 px-6">Enrolled Scholars</th>
                    <th className="py-3 px-6">Gross Revenue</th>
                    <th className="py-3 px-6">Rating</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800 text-xs">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/50 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {course.title}
                        </div>
                        <div className="text-[11px] text-slate-700 font-medium">
                          {course.school}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-800 font-medium">
                        {course.modulesCount} modules • {course.lessonsCount} lessons
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                        {course.students.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-emerald-800 dark:text-emerald-400">
                        {course.revenue.toLocaleString()} FIC
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800">
                        ⭐ {course.rating}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          course.status === 'published'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                            : 'bg-amber-100 text-amber-950 border border-amber-400'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => {
                            setActiveTab('lesson_plan_builder');
                            showToast(`Loaded lesson plan editor for: ${course.title}`, 'info');
                          }}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-900 font-bold rounded-lg hover:bg-indigo-100 transition text-[11px]"
                        >
                          Plan
                        </button>
                        <button
                          onClick={() => setActiveTab('course_builder')}
                          className="px-3 py-1.5 bg-slate-100 text-slate-800 font-bold rounded-lg hover:bg-slate-200 transition text-[11px]"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LESSON PLAN BUILDER (Integrated Directly!) */}
      {activeTab === 'lesson_plan_builder' && (
        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-800 leading-relaxed">
              <strong className="text-slate-900 font-black">Tutor LMS Benchmark Feature: </strong>
              The CAMUS Lesson Plan Builder structures curriculum using pedagogical best practices (Bloom’s Taxonomy, timed instructional phases, anticipatory hooks, guided practice, and autonomous assessment). Lesson plans can be saved, exported to JSON, printed for faculty accreditation, or auto-generated with AI.
            </div>
          </div>

          <LessonPlanBuilder />
        </div>
      )}

      {/* TAB 3: COURSE CURRICULUM STUDIO */}
      {activeTab === 'course_builder' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              Advanced Course & Curriculum Builder
            </h3>
            <p className="text-xs text-slate-700 mb-6">
              Create structured degree courses with topics, lessons, video sources, content drip controls, and prerequisites.
            </p>

            <form onSubmit={handleCreateCourse} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Course / Degree Program Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    placeholder="e.g. Political Sociology & Social Transformation in Africa"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-4 py-2.5 text-xs shadow-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Faculty / School *
                  </label>
                  <select
                    value={newCourseSchool}
                    onChange={(e) => setNewCourseSchool(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-4 py-2.5 text-xs shadow-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="School of Arts & Social Sciences">School of Arts & Social Sciences</option>
                    <option value="School of Technology & Business Administration">School of Technology & Business Administration</option>
                    <option value="Interdisciplinary Graduate Studies">Interdisciplinary Graduate Studies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Degree Track / Academic Level
                  </label>
                  <select
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-4 py-2.5 text-xs shadow-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bachelor of Arts (BA)">Bachelor of Arts (BA)</option>
                    <option value="Master of Science (MSc) / Master of Arts (MA)">Master of Science (MSc) / Master of Arts (MA)</option>
                    <option value="Doctor of Philosophy (Ph.D.)">Doctor of Philosophy (Ph.D.)</option>
                    <option value="Undergraduate Research Fellowship">Undergraduate Research Fellowship</option>
                    <option value="Executive Professional Diploma">Executive Professional Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tuition Price (FIC)
                  </label>
                  <input
                    type="number"
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-4 py-2.5 text-xs shadow-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Video Streaming Source
                  </label>
                  <select
                    value={videoSource}
                    onChange={(e) => setVideoSource(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-4 py-2.5 text-xs shadow-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bunny Stream CDN">Bunny Stream CDN (DRM Protected)</option>
                    <option value="Self-Hosted Decentralized IPFS">Self-Hosted Decentralized IPFS / Swarm</option>
                    <option value="WebRTC Live Classroom">WebRTC Live Interactive Classroom</option>
                    <option value="YouTube Embedded (Unlisted)">YouTube Embedded (Unlisted)</option>
                    <option value="Vimeo Pro">Vimeo Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Content Drip Scheduling
                  </label>
                  <select
                    value={dripMode}
                    onChange={(e) => setDripMode(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-4 py-2.5 text-xs shadow-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Sequential by Topic">Sequential by Topic (Unlock after completion)</option>
                    <option value="Calendar Date Release">Calendar Date Release (Scheduled weekly)</option>
                    <option value="Days After Enrollment">Days After Enrollment (X days per module)</option>
                    <option value="Prerequisite Quiz Score">Prerequisite Quiz Score (&gt; 80% to unlock)</option>
                  </select>
                </div>
              </div>

              {/* Sample Curriculum Topics Outline */}
              <div className="border border-slate-200 dark:border-gray-800 rounded-2xl p-5 bg-slate-50 dark:bg-gray-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Syllabus Topics & Microlessons Hierarchy
                  </h4>
                  <span className="text-[11px] text-blue-700 font-bold">+ Add Topic Section</span>
                </div>

                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-slate-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Topic 1: Epistemological Foundations & Historical Context</span>
                    </div>
                    <span className="text-[11px] text-slate-700">3 Lessons • 1 Quiz • Drip: Immediate</span>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-slate-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Topic 2: Critical Discourse, Textual Analysis & Field Inquiries</span>
                    </div>
                    <span className="text-[11px] text-slate-700">4 Lessons • 1 Assignment • Drip: Day 7</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition"
                >
                  Save & Publish Course Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: AI STUDIO SYLLABUS GENERATOR */}
      {activeTab === 'ai_studio' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-800/50">
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-6 h-6 text-purple-300" />
              <h3 className="text-xl font-black">
                CAMUS AI Studio: Generative Curriculum Generator
              </h3>
            </div>
            <p className="text-xs text-purple-200 max-w-2xl leading-relaxed mb-6">
              Generate entire university courses, topics, microlessons, Bloom’s Taxonomy objectives, and interactive quizzes in seconds. Tailored for Open and Distance Learning (ODL).
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">
                  Enter Subject, Faculty, or Learning Goal Prompt
                </label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-purple-300 bg-white rounded-2xl p-4 text-xs shadow-inner focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleGenerateAiCurriculum}
                  disabled={isAiGenerating}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isAiGenerating ? 'Synthesizing University Curriculum...' : 'Generate AI Course & Syllabus'}
                </button>
                <span className="text-[11px] text-purple-300">
                  ⚡ Powered by CAMUS Sovereign Generative Educational Engine
                </span>
              </div>
            </div>
          </div>

          {/* AI Output Display */}
          {aiOutput && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-950 font-bold text-[10px] uppercase border border-purple-300">
                    AI Generated Draft
                  </span>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                    {aiOutput.title}
                  </h4>
                  <p className="text-xs text-slate-700 mt-1">
                    {aiOutput.school} • {aiOutput.department} • Level: {aiOutput.level}
                  </p>
                </div>
                <button
                  onClick={() => {
                    showToast('Curriculum transferred directly to Lesson Plan Builder!', 'success');
                    setActiveTab('lesson_plan_builder');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Import into Lesson Plan Builder
                </button>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Synthesized Modules & Microlessons:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiOutput.modules.map((mod: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 dark:border-gray-800 rounded-2xl p-4 bg-slate-50 dark:bg-gray-800/40 space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {mod.title}
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium">Duration: {mod.duration}</div>
                      <ul className="text-xs text-slate-800 space-y-1 list-disc list-inside pt-1">
                        {mod.lessons.map((lesson: string, lIdx: number) => (
                          <li key={lIdx} className="truncate">{lesson}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded-xl text-xs space-y-1">
                  <p className="text-slate-800">
                    <strong className="text-slate-900">Bloom’s Taxonomy Target:</strong> {aiOutput.bloomsAlignment}
                  </p>
                  <p className="text-slate-800">
                    <strong className="text-slate-900">Assessment Rubric:</strong> {aiOutput.assessmentRubric}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: GRADING QUEUE */}
      {activeTab === 'grading_queue' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Student Assignment & Examination Grading Queue
              </h3>
              <p className="text-xs text-slate-700 mt-0.5">
                Review submitted essays, case studies, and automated quiz score overrides.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs rounded-full">
              4 Submissions Pending
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-gray-800">
            {[
              {
                id: 'sub-1',
                student: 'Zainab Danjuma',
                course: 'Constitutional Law, Civil Liberties & Digital Governance (BA)',
                assignment: 'Midterm Policy Brief: Judicial Precedent on Algorithmic Rights',
                submittedAt: '3 hours ago',
                words: '1,840 words'
              },
              {
                id: 'sub-2',
                student: 'Kofi Mensah',
                course: 'Comparative Literature & Cultural Narrative Analysis (BA)',
                assignment: 'Critical Essay: Postcolonial Metaphor in Achebe and Soyinka',
                submittedAt: '5 hours ago',
                words: '2,200 words'
              },
              {
                id: 'sub-3',
                student: 'Chiamaka Eze',
                course: 'Sociology of Digital Networks & Behavioral Psychology',
                assignment: 'Field Case Study: Digital Community Formation in Decentralized ODL',
                submittedAt: 'Yesterday',
                words: '1,450 words'
              },
              {
                id: 'sub-4',
                student: 'David Adeleke',
                course: 'Musicology, Acoustics & Digital Soundscapes',
                assignment: 'Sonic Composition Analysis & Frequency Spectrogram Report',
                submittedAt: 'Yesterday',
                words: 'Audio + 900 words'
              }
            ].map((sub) => (
              <div key={sub.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{sub.student}</span>
                    <span className="text-[11px] text-slate-600 font-mono">• {sub.submittedAt}</span>
                  </div>
                  <div className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                    {sub.course}
                  </div>
                  <div className="text-xs text-slate-800">
                    {sub.assignment} ({sub.words})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => showToast(`Opening submission view for ${sub.student}`, 'info')}
                    className="px-4 py-2 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-100 transition"
                  >
                    View Document
                  </button>
                  <button
                    onClick={() => showToast(`Graded submission for ${sub.student} with A grade!`, 'success')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Grade & Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: EARNINGS & WITHDRAWALS */}
      {activeTab === 'earnings_withdrawals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">Available Withdrawable Balance</span>
              <div className="text-3xl font-black font-mono">
                {instructorShare.toLocaleString()} FIC
              </div>
              <p className="text-xs text-emerald-100">
                Protocol-settled earnings from course purchases, course bundle splits, and student subscriptions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 p-6 rounded-3xl shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Commission Share Split</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                80% Instructor / 20% ODL
              </div>
              <p className="text-xs text-slate-700">
                20% platform share supports decentralized server infrastructure, WebRTC relays, and student scholarship grants.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 p-6 rounded-3xl shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Personal FIC Wallet</span>
              <div className="text-2xl font-black font-mono text-purple-700 dark:text-purple-400">
                {ficBalance.toFixed(2)} FIC
              </div>
              <p className="text-xs text-slate-700">
                Directly bound to your FingerMobile identity key.
              </p>
            </div>
          </div>

          {/* Withdrawal Request Form */}
          <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Withdrawal Disbursement Channel
            </h4>
            <p className="text-xs text-slate-700">
              Transfer your faculty revenue via blockchain wallet settlement, direct bank clearing, PayPal, or eCheck.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Amount to Withdraw (FIC)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-4 py-2.5 text-xs shadow-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Disbursement Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as any)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-4 py-2.5 text-xs shadow-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="fic">FingerMobile Protocol FIC Wallet (Instant 0% Fee)</option>
                  <option value="bank">Direct Bank Wire (ACH / SEPA / NIBSS)</option>
                  <option value="paypal">PayPal Electronic Transfer</option>
                  <option value="echeck">eCheck Disbursement</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              {isWithdrawing ? 'Processing Disbursement...' : 'Submit Withdrawal Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
