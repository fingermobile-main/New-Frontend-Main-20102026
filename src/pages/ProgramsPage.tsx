import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  AcademicCapIcon,
  PlayIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckCircleIcon,
  BookOpenIcon,
  TrophyIcon,
  ShieldIcon,
  CreditCardIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon,
  DownloadIcon,
  SparklesIcon,
  InformationCircleIcon
} from '../icons';

import {
  ACADEMIC_COURSES,
  AcademicCourse,
  NIGERIAN_STATE_COHORTS,
  TOTAL_CITIZENS_ENROLLED,
  NATIONAL_TARGET_CITIZENS,
  SAMPLE_ASSESSMENTS,
  AssessmentItem,
  SAMPLE_STUDENT_GRADES,
  GradeEntry,
  LETTER_GRADE_SCALE,
  getLetterGradeFromScore,
  SAMPLE_TRANSCRIPT,
  StudentTranscript,
  SAMPLE_INVOICES,
  FinancialInvoice,
  ACADEMIC_CALENDAR_EVENTS,
  AcademicCalendarEvent
} from '../data/academicProgramsData';

type ActiveTab = 'courses' | 'assessments' | 'gradebook' | 'financial' | 'calendar';

const ProgramsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('courses');

  // Courses state
  const [courses] = useState<AcademicCourse[]>(ACADEMIC_COURSES);
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('all');
  const [courseSearch, setCourseSearch] = useState<string>('');
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<AcademicCourse | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['course-ai-01', 'course-cloud-02']);
  const [selectedCourseForSubscription, setSelectedCourseForSubscription] = useState<AcademicCourse | null>(null);

  // 37-State Modal
  const [showStateCohortModal, setShowStateCohortModal] = useState<boolean>(false);
  const [selectedGeoZone, setSelectedGeoZone] = useState<string>('all');

  // Assessments state
  const [assessments, setAssessments] = useState<AssessmentItem[]>(SAMPLE_ASSESSMENTS);
  const [assessmentTypeFilter, setAssessmentTypeFilter] = useState<string>('ALL');
  const [activeTakingAssessment, setActiveTakingAssessment] = useState<AssessmentItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, any>>({});
  const [examTimerSeconds, setExamTimerSeconds] = useState<number>(1800); // 30 mins default
  const [examScoreResult, setExamScoreResult] = useState<{ score: number; letterGrade: string; points: number } | null>(null);

  // Gradebook state
  const [gradesList, setGradesList] = useState<GradeEntry[]>(SAMPLE_STUDENT_GRADES);
  const [showTranscriptModal, setShowTranscriptModal] = useState<boolean>(false);
  const [transcriptData] = useState<StudentTranscript>(SAMPLE_TRANSCRIPT);

  // Financial state
  const [invoices, setInvoices] = useState<FinancialInvoice[]>(SAMPLE_INVOICES);
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<FinancialInvoice | null>(null);

  // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<AcademicCalendarEvent[]>(ACADEMIC_CALENDAR_EVENTS);
  const [calendarTermFilter, setCalendarTermFilter] = useState<string>('ALL');
  const [calendarTypeFilter, setCalendarTypeFilter] = useState<string>('ALL');

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const matchesCategory = courseCategoryFilter === 'all' || c.category === courseCategoryFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.targetSkill.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.summary.toLowerCase().includes(courseSearch.toLowerCase()) ||
      (c.partnerOrganization && c.partnerOrganization.toLowerCase().includes(courseSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter assessments
  const filteredAssessments = assessments.filter((a) => {
    if (assessmentTypeFilter === 'ALL') return true;
    return a.type === assessmentTypeFilter;
  });

  // Filter calendar events
  const filteredCalendarEvents = calendarEvents.filter((ev) => {
    const matchesTerm = calendarTermFilter === 'ALL' || ev.term === calendarTermFilter;
    const matchesType = calendarTypeFilter === 'ALL' || ev.type === calendarTypeFilter;
    return matchesTerm && matchesType;
  });

  // Filter states
  const filteredStateCohorts = NIGERIAN_STATE_COHORTS.filter((s) => {
    if (selectedGeoZone === 'all') return true;
    return s.zone === selectedGeoZone;
  });

  // Handle Subscription Purchase
  const handleConfirmSubscription = (course: AcademicCourse, method: 'FIC' | 'NAIRA' | 'SCHOLARSHIP') => {
    if (method === 'FIC') {
      if (ficBalance < course.quarterlySubscriptionFic) {
        showToast(
          `Insufficient FIC balance. Quarterly subscription requires ${course.quarterlySubscriptionFic} FIC, but you have ${ficBalance} FIC.`,
          'error'
        );
        return;
      }
    }

    if (!enrolledCourseIds.includes(course.id)) {
      setEnrolledCourseIds([...enrolledCourseIds, course.id]);
    }

    // Generate new quarterly subscription invoice
    const newInvoice: FinancialInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-FM-QTR-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: 'FM-STU-2026-0842',
      studentName: 'Ibrahim Danjuma (You)',
      studentState: 'Kano',
      courseTitle: course.title,
      feeType: 'QUARTERLY_SUBSCRIPTION',
      billingQuarter: 'Q4 2026 (Oct - Dec)',
      amountFic: course.quarterlySubscriptionFic,
      amountNgn: course.quarterlySubscriptionNgn,
      scholarshipSubsidized: method === 'SCHOLARSHIP',
      subsidyPercentage: method === 'SCHOLARSHIP' ? 100 : 0,
      netPayableFic: method === 'SCHOLARSHIP' ? 0 : course.quarterlySubscriptionFic,
      status: 'PAID',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paymentMethod:
        method === 'FIC'
          ? 'FIC_SMART_CONTRACT'
          : method === 'NAIRA'
            ? 'NAIRA_GATEWAY'
            : 'STATE_GRANT_FUND'
    };

    setInvoices([newInvoice, ...invoices]);
    setSelectedCourseForSubscription(null);

    const message =
      method === 'SCHOLARSHIP'
        ? `100% Sovereign Fellowship Grant approved! Quarterly subscription activated for "${course.title}".`
        : `Quarterly Subscription activated for "${course.title}"! Next renewal in 90 days.`;
    showToast(message, 'success');
  };

  // Start Assessment
  const handleStartAssessment = (assessment: AssessmentItem) => {
    setActiveTakingAssessment(assessment);
    setCurrentQuestionIndex(0);
    setExamAnswers({});
    setExamTimerSeconds(assessment.durationMinutes * 60);
    setExamScoreResult(null);
  };

  // Submit Assessment
  const handleSubmitAssessment = () => {
    if (!activeTakingAssessment) return;

    // Calculate score based on answers
    let calculatedMarks = 0;
    activeTakingAssessment.questions.forEach((q) => {
      const ans = examAnswers[q.id];
      if (q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE' || q.type === 'SHORT_ANSWER') {
        if (ans && String(ans).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
          calculatedMarks += q.marks;
        } else if (ans) {
          calculatedMarks += Math.floor(q.marks * 0.7); // partial credit for attempt
        }
      } else {
        // Essay, matching, ordering, file, audio get evaluated
        calculatedMarks += Math.floor(q.marks * 0.9);
      }
    });

    const percent = Math.min(100, Math.round((calculatedMarks / activeTakingAssessment.totalMarks) * 100));
    const gradeObj = getLetterGradeFromScore(percent);

    setExamScoreResult({
      score: percent,
      letterGrade: gradeObj.letter,
      points: gradeObj.gpa
    });

    // Update assessment status
    setAssessments((prev) =>
      prev.map((item) =>
        item.id === activeTakingAssessment.id
          ? {
            ...item,
            status: 'GRADED',
            attemptsUsed: item.attemptsUsed + 1,
            score: percent,
            letterGrade: gradeObj.letter
          }
          : item
      )
    );

    // Insert new grade record into Gradebook
    const newGrade: GradeEntry = {
      id: `grd-new-${Date.now()}`,
      studentId: 'FM-STU-2026-0842',
      studentName: 'Ibrahim Danjuma (You)',
      studentState: 'Kano',
      courseId: activeTakingAssessment.courseId,
      courseTitle: activeTakingAssessment.courseTitle,
      assessmentId: activeTakingAssessment.id,
      assessmentTitle: activeTakingAssessment.title,
      assessmentType: activeTakingAssessment.type,
      marksObtained: percent,
      maxMarks: 100,
      percentage: percent,
      letterGrade: gradeObj.letter,
      gradePoints: gradeObj.gpa,
      weightagePercent: 35,
      evaluatedAt: new Date().toISOString().split('T')[0],
      evaluatorFeedback: `Official automated assessment evaluation completed. Verified with grade ${gradeObj.letter} (${gradeObj.description}).`
    };

    setGradesList([newGrade, ...gradesList]);
    showToast(`Assessment submitted! Recorded into Gradebook with grade ${gradeObj.letter} (${percent}%).`, 'success');
  };

  // Pay invoice handler
  const handlePayInvoice = (invoice: FinancialInvoice) => {
    if (invoice.netPayableFic > ficBalance) {
      showToast(`Insufficient FIC balance. You need ${invoice.netPayableFic} FIC, current balance is ${ficBalance} FIC.`, 'error');
      return;
    }

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id
          ? { ...inv, status: 'PAID', paymentMethod: 'FIC_SMART_CONTRACT' }
          : inv
      )
    );
    setSelectedInvoiceToPay(null);
    showToast(`Invoice ${invoice.invoiceNumber} successfully settled on-chain via FIC Smart Contract!`, 'success');
  };

  // RSVP Calendar event handler
  const handleToggleCalendarRsvp = (eventId: string) => {
    setCalendarEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const isReg = !ev.isRegistered;
          showToast(
            isReg ? `Registered for "${ev.title}". Added to personal academic schedule.` : `Unregistered from "${ev.title}".`,
            'info'
          );
          return {
            ...ev,
            isRegistered: isReg,
            registeredCount: isReg ? ev.registeredCount + 1 : Math.max(0, ev.registeredCount - 1)
          };
        }
        return ev;
      })
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* ==================== 1. MISSION HERO BANNER ==================== */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-slate-800 p-8 sm:p-10">
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <SparklesIcon className="w-4 h-4 text-indigo-300" />
                  Quarterly Subscription Academy • 5,000 Citizens • 37 States
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  FingerMobile <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300">Academic Programs</span> & Digital Training Academy
                </h1>

                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                  A high-impact, <strong className="text-white font-bold">Quarterly Subscription-based E-Learning Academy</strong> designed to train and accredit <strong className="text-white font-bold">5,000 citizens across all 37 Nigerian states</strong> in high-demand digital skills: AI & Machine Learning, Cloud DevOps, CyberSecurity, Online Marketing, 4K Content Creation, and Agile Product Management. Modules feature flexible quarterly subscription tiers, with qualifying citizens eligible for 100% State Fellowship Grants.
                </p>

                {/* Multilateral Partner Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-700 font-semibold mr-1">Multilateral Alliances:</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 font-medium">FAO eLearning Academy (UN)</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 font-medium">eLearning Africa</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 font-medium">atingi Agribusiness</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 font-medium">UNESCO / UNITAR</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 font-medium">Great Learning</span>
                </div>
              </div>

              {/* National Enrollment KPI Box */}
              <div className="w-full lg:w-80 flex-shrink-0 bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <span>National Citizen Quota</span>
                  <span className="text-emerald-400 font-bold">{Math.round((TOTAL_CITIZENS_ENROLLED / NATIONAL_TARGET_CITIZENS) * 100)}% Reached</span>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-3xl font-black text-white">{TOTAL_CITIZENS_ENROLLED.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-medium">/ {NATIONAL_TARGET_CITIZENS.toLocaleString()} Citizens</span>
                  </div>
                  <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${(TOTAL_CITIZENS_ENROLLED / NATIONAL_TARGET_CITIZENS) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-700/80">
                  <div>
                    <span className="block text-slate-400 font-medium">State Cohorts</span>
                    <strong className="text-white text-sm font-bold">37 of 37 States</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-medium">Tuition Subsidy</span>
                    <strong className="text-emerald-400 text-sm font-bold">Fellowships Active</strong>
                  </div>
                </div>

                <button
                  onClick={() => setShowStateCohortModal(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
                >
                  <UsersIcon className="w-4 h-4" />
                  Explore 37-State Breakdown
                </button>
              </div>
            </div>
          </div>

          {/* ==================== 2. FIVE ARCHITECTURE TABS ==================== */}
          <div className="border-b border-slate-200 bg-white rounded-2xl shadow-sm p-2 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'courses'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AcademicCapIcon className="w-5 h-5" />
              <span>1. Academic Courses & Programs</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'courses' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-white'}font-extrabold`}>
                {courses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assessments')}
              className={`flex items-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'assessments'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckCircleIcon className="w-5 h-5" />
              <span>2. Assessment Management</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'assessments' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-white'}font-extrabold`}>
                {assessments.length} Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab('gradebook')}
              className={`flex items-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'gradebook'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrophyIcon className="w-5 h-5" />
              <span>3. Gradebook & GPA System</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'gradebook' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-white'}font-extrabold`}>
                GPA 3.92
              </span>
            </button>

            <button
              onClick={() => setActiveTab('financial')}
              className={`flex items-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'financial'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CreditCardIcon className="w-5 h-5" />
              <span>4. Financial & Quarterly Subscriptions</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'financial' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-white'}font-extrabold`}>
                ₦750M Fund
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'calendar'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span>5. Academic Calendar</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'calendar' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-white'}font-extrabold`}>
                {calendarEvents.length} Events
              </span>
            </button>
          </div>

          {/* ==================== TAB 1: ACADEMIC COURSES & PROGRAMS ==================== */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Filter and Search Bar */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search by skill, topic, or multilateral partner..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  {courseSearch && (
                    <button
                      onClick={() => setCourseSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: 'All Curriculums' },
                    { id: 'ai', label: 'AI & Machine Learning' },
                    { id: 'cloud', label: 'Cloud & DevOps' },
                    { id: 'security', label: 'CyberSecurity' },
                    { id: 'marketing', label: 'Marketing' },
                    { id: 'content', label: 'Content (4K Media)' },
                    { id: 'product', label: 'Product' },
                    { id: 'multilateral', label: 'Multilateral / UN' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCourseCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        courseCategoryFilter === cat.id
                          ? 'bg-slate-900 text-white shadow'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const isEnrolled = enrolledCourseIds.includes(course.id);
                  const enrollmentPercent = Math.min(100, Math.round((course.enrolledCitizens / course.targetCitizens) * 100));

                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      {/* Image Thumbnail Banner */}
                      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={course.bannerUrl}
                          alt={course.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        {/* Top Floating Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-xs font-bold">
                            {course.categoryLabel}
                          </span>
                          {course.isMultilateral && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1">
                              <SparklesIcon className="w-3.5 h-3.5" />
                              {course.partnerBadge || 'Multilateral'}
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider">
                            {course.subscriptionTier} Tier
                          </span>
                        </div>

                        {/* Bottom Banner Details */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                          <span className="flex items-center gap-1 font-semibold text-white">
                            <ClockIcon className="w-4 h-4 text-emerald-400" />
                            {course.duration}
                          </span>
                          <span className="font-bold text-amber-300">
                            ★ {course.rating.toFixed(2)} Rating
                          </span>
                        </div>
                      </div>

                      {/* Course Body Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-indigo-700 tracking-wide uppercase">
                            Skill Track: {course.targetSkill}
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 leading-snug">
                            {course.title}
                          </h3>

                          <p className="text-slate-700 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                            {course.summary}
                          </p>
                        </div>

                        {/* Quarterly Subscription Pricing Card */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 block">
                              Quarterly Subscription Rate
                            </span>
                            <span className="text-base font-black text-slate-900">
                              ₦{course.quarterlySubscriptionNgn.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ Quarter</span>
                            </span>
                          </div>
                          <span className="text-xs font-bold text-indigo-950 bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-300">
                            {course.quarterlySubscriptionFic} FIC / Qtr
                          </span>
                        </div>

                        {/* Accredited Entity */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">Accreditation:</span>
                          <span className="font-bold text-slate-800 text-right">{course.accreditedBy}</span>
                        </div>

                        {/* State Citizens Enrollment Progress */}
                        <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-700 font-bold">National Quota Allocated</span>
                            <span className="text-slate-900 font-black">{course.enrolledCitizens} / {course.targetCitizens} ({enrollmentPercent}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border text-slate-950 border-slate-400 font-black">
                            <div
                              className="bg-emerald-600 h-full rounded-full transition-all"
                              style={{ width: `${enrollmentPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Instructor Info */}
                        <div className="flex items-center gap-3 pt-1">
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-300 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{course.instructor.name}</h4>
                            <p className="text-xs text-slate-600 truncate">{course.instructor.role}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCourseForSyllabus(course)}
                            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-900 text-xs font-bold transition flex items-center justify-center gap-1.5"
                          >
                            <BookOpenIcon className="w-4 h-4 text-slate-700" />
                            View Syllabus
                          </button>

                          {isEnrolled ? (
                            <div className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-400 text-xs font-black flex items-center justify-center gap-1.5">
                              <CheckCircleIcon className="w-4 h-4 text-emerald-800" />
                              <span>Active Qtr Sub</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedCourseForSubscription(course)}
                              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                            >
                              <CreditCardIcon className="w-4 h-4" />
                              Subscribe Quarterly
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== TAB 2: ASSESSMENT MANAGEMENT ==================== */}
          {activeTab === 'assessments' && (
            <div className="space-y-6">
              {/* Assessment Architecture Header */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1 max-w-3xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                    <CheckCircleIcon className="w-4 h-4" />
                    Rigorous Verification Protocol
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Sovereign Assessment Engine & Examination Portal
                  </h2>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Evaluates students across <strong>5 distinct assessment methodologies</strong>: <strong>QUIZ</strong> (short assessments with rapid feedback), <strong>EXAM</strong> (formal timed evaluations), <strong>ASSIGNMENT</strong> (take-home audits), <strong>PROJECT</strong> (capstone portfolios), and <strong>PRACTICAL</strong> (hands-on bare-metal lab testing) across <strong>8 standardized question types</strong>.
                  </p>
                </div>

                {/* Question Format Chips */}
                <div className="flex flex-wrap gap-1.5 max-w-sm">
                  {['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY', 'MATCHING', 'ORDERING', 'FILE_UPLOAD', 'AUDIO_RESPONSE'].map((qt) => (
                    <span key={qt} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200">
                      {qt.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assessment Filter Pills with Active Counts */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-600 mr-2">Filter by Type:</span>
                {['ALL', 'QUIZ', 'EXAM', 'ASSIGNMENT', 'PROJECT', 'PRACTICAL'].map((type) => {
                  const count = type === 'ALL' ? assessments.length : assessments.filter((a) => a.type === type).length;
                  return (
                    <button
                      key={type}
                      onClick={() => setAssessmentTypeFilter(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        assessmentTypeFilter === type
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>{type}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${assessmentTypeFilter === type ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-800'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Assessments Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssessments.map((asm) => (
                  <div
                    key={asm.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-indigo-300 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase ${
                          asm.type === 'QUIZ'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                            : asm.type === 'EXAM'
                              ? 'bg-indigo-100 text-indigo-950 border border-indigo-400'
                              : asm.type === 'PROJECT'
                                ? 'bg-amber-100 text-amber-950 border border-amber-400'
                                : asm.type === 'PRACTICAL'
                                  ? 'bg-purple-100 text-purple-950 border border-purple-400'
                                  : 'bg-blue-100 text-blue-950 border border-blue-400'
                        }`}>
                          {asm.type}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                            asm.status === 'GRADED'
                              ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                              : asm.status === 'ACTIVE'
                                ? 'bg-blue-100 text-emerald-950 border border-emerald-400'
                                : 'bg-slate-100 text-emerald-950 border border-emerald-400'
                          }font-black`}
                        >
                          {asm.status}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-600">{asm.courseTitle}</div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {asm.title}
                      </h3>

                      <p className="text-slate-700 text-xs leading-relaxed line-clamp-3">
                        {asm.instructions}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-slate-700">
                        <div>
                          <span className="block text-slate-500 font-medium">Duration:</span>
                          <strong className="text-slate-900 font-bold">{asm.durationMinutes} Minutes</strong>
                        </div>
                        <div>
                          <span className="block text-slate-500 font-medium">Passing Marks:</span>
                          <strong className="text-slate-900 font-bold">{asm.passingMarks} / {asm.totalMarks}</strong>
                        </div>
                        <div>
                          <span className="block text-slate-500 font-medium">Questions:</span>
                          <strong className="text-slate-900 font-bold">{asm.questions.length} Items</strong>
                        </div>
                        <div>
                          <span className="block text-slate-500 font-medium">Due Date:</span>
                          <strong className="text-slate-900 font-bold">{asm.dueDate}</strong>
                        </div>
                      </div>

                      {asm.status === 'GRADED' && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                          <span className="text-emerald-900 font-bold">Your Grade:</span>
                          <span className="text-base font-black text-emerald-800">
                            {asm.score}% ({asm.letterGrade})
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => handleStartAssessment(asm)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                          asm.status === 'GRADED'
                            ? 'bg-slate-800 hover:bg-slate-700 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        <PlayIcon className="w-4 h-4" />
                        {asm.status === 'GRADED' ? 'Retake Assessment Simulator' : `Begin ${asm.type} Session`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: GRADEBOOK & GPA SYSTEM ==================== */}
          {activeTab === 'gradebook' && (
            <div className="space-y-8">
              {/* GPA Top Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-300 text-indigo-900 flex items-center justify-center font-black text-xl">
                    4.0
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase">Cumulative GPA</span>
                    <h3 className="text-2xl font-black text-slate-900">3.92 <span className="text-xs text-slate-500 font-normal">/ 4.0</span></h3>
                    <span className="text-[11px] font-bold text-emerald-700">First Class Honors (A+)</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center font-black text-xl">
                    16
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase">Credits Earned</span>
                    <h3 className="text-2xl font-black text-slate-900">16 Credits</h3>
                    <span className="text-[11px] font-bold text-slate-600">4 Core Tracks Passed</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-black text-xl">
                    2%
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase">Class Ranking</span>
                    <h3 className="text-2xl font-black text-slate-900">Top 2%</h3>
                    <span className="text-[11px] font-bold text-slate-600">Out of 4,680 Citizens</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 text-blue-900 flex items-center justify-center font-black text-xl">
                    <ShieldIcon className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase">Identity Verification</span>
                    <h3 className="text-sm font-black text-slate-900 truncate">FM/2026/NW/0842</h3>
                    <span className="text-[11px] font-bold text-blue-800">Decentralized DID Verified</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Official Sovereign Gradebook Ledger</h3>
                  <p className="text-xs text-slate-700">Automated percentage calculations, weighted averages, and verifiable grade points.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      showToast('Simulated bulk grade upload processed: 120 grade rows verified and parsed.', 'success');
                    }}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-900 text-xs font-bold transition flex items-center gap-2"
                  >
                    <DocumentTextIcon className="w-4 h-4 text-slate-700" />
                    Simulate Bulk CSV Upload
                  </button>

                  <button
                    onClick={() => setShowTranscriptModal(true)}
                    className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-indigo-600/20"
                  >
                    <TrophyIcon className="w-4 h-4" />
                    Generate Sovereign Transcript
                  </button>
                </div>
              </div>

              {/* Student Gradebook Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-4">Student ID / Name</th>
                        <th className="py-3.5 px-4">State</th>
                        <th className="py-3.5 px-4">Course & Assessment</th>
                        <th className="py-3.5 px-4 text-center">Type</th>
                        <th className="py-3.5 px-4 text-center">Marks / %</th>
                        <th className="py-3.5 px-4 text-center">Letter Grade</th>
                        <th className="py-3.5 px-4 text-center">Grade Points</th>
                        <th className="py-3.5 px-4">Evaluator Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                      {gradesList.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition">
                          <td className="py-4 px-4 font-bold text-slate-900">
                            <div>{row.studentName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{row.studentId}</div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-800">{row.studentState}</td>
                          <td className="py-4 px-4 max-w-xs">
                            <div className="font-bold text-slate-900 truncate">{row.courseTitle}</div>
                            <div className="text-[11px] text-slate-600 truncate">{row.assessmentTitle}</div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-900 font-bold text-[10px]">
                              {row.assessmentType}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-slate-900">
                            {row.marksObtained} / {row.maxMarks} ({row.percentage}%)
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-md font-black text-xs ${
                                row.letterGrade.startsWith('A')
                                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                                  : row.letterGrade.startsWith('B')
                                    ? 'bg-blue-100 text-blue-950 border border-blue-400'
                                    : 'bg-amber-100 text-amber-950 border border-amber-400'
                              }`}
                            >
                              {row.letterGrade}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-black text-slate-900">{row.gradePoints.toFixed(1)}</td>
                          <td className="py-4 px-4 text-slate-700 max-w-xs leading-relaxed">
                            {row.evaluatorFeedback}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Letter Grade Conversion Scale Reference */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <InformationCircleIcon className="w-5 h-5 text-indigo-700" />
                  <h4 className="text-base font-bold text-slate-900">
                    Official Standardized Letter Grade Conversion Scale
                  </h4>
                </div>
                <p className="text-xs text-slate-700">
                  Predefined grade boundaries mandated across all FingerMobile certified academic modules:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {LETTER_GRADE_SCALE.map((g) => (
                    <div key={g.letter} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                      <div className="text-lg font-black text-slate-900">{g.letter}</div>
                      <div className="text-xs font-bold text-indigo-800">{g.min}% - {g.max}%</div>
                      <div className="text-[11px] text-slate-600 font-semibold">{g.gpa.toFixed(1)} Points</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{g.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 4: FINANCIAL & QUARTERLY SUBSCRIPTIONS ==================== */}
          {activeTab === 'financial' && (
            <div className="space-y-8">
              {/* Scholarship Endowment Banner */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-teal-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
                    Sovereign Education Endowment Fund
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    ₦750,000,000 National Digital Fellowship Grant
                  </h3>
                  <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                    Underwritten by the FingerMobile Sovereign Treasury and Federal Ministry Partners to subsidize quarterly subscription tuitions for qualifying Nigerian citizens across all 37 states. Fellowships cover up to 100% of quarterly subscriptions via automated on-chain voucher assignment.
                  </p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-teal-700/60 text-center min-w-[240px] space-y-2">
                  <div className="text-xs text-teal-300 font-bold uppercase">Quarterly Grants Disbursed</div>
                  <div className="text-3xl font-black text-white">₦702,000,000</div>
                  <div className="text-xs text-emerald-400 font-bold">4,680 Citizens Subsidized</div>
                  <div className="text-[11px] text-slate-400">1,250,000 FIC Backing Pool</div>
                </div>
              </div>

              {/* Student Invoices Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Quarterly Subscription Invoices & Billing Ledger</h4>
                    <p className="text-xs text-slate-700">Track quarterly payments, active course module subscriptions, and fellowship grant waivers.</p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300">
                    FIC Wallet Balance: <strong className="text-indigo-700">{ficBalance} FIC</strong>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Invoice #</th>
                        <th className="py-3 px-4">Course / Program</th>
                        <th className="py-3 px-4">Billing Quarter</th>
                        <th className="py-3 px-4">Quarterly Fee</th>
                        <th className="py-3 px-4 text-center">Fellowship Subsidy</th>
                        <th className="py-3 px-4">Net Payable</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">{inv.courseTitle}</td>
                          <td className="py-3.5 px-4 font-semibold text-indigo-800">{inv.billingQuarter}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            ₦{inv.amountNgn.toLocaleString()} <span className="text-slate-500 font-normal">({inv.amountFic} FIC)</span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-black text-xs">
                              {inv.subsidyPercentage}% Covered
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900">
                            {inv.netPayableFic === 0 ? (
                              <span className="text-emerald-700 font-extrabold">₦0.00 (Grant Covered)</span>
                            ) : (
                              <span>{inv.netPayableFic} FIC</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-black ${
                                inv.status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                                  : inv.status === 'PENDING'
                                    ? 'bg-amber-100 text-amber-950 border border-amber-400'
                                    : 'bg-rose-100 text-rose-950 border border-rose-400'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {inv.status !== 'PAID' ? (
                              <button
                                onClick={() => setSelectedInvoiceToPay(inv)}
                                className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm"
                              >
                                Settle Now
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-emerald-700">Settled (Active Sub)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Standard Program Fee Schedules */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h4 className="text-base font-bold text-slate-900">Quarterly Subscription Tier Structure</h4>
                <p className="text-xs text-slate-700">Modular subscription pricing per 3-month term. Qualifying citizens can apply for state grant vouchers to offset 100% of quarterly costs.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase">Executive Tier Tracks</span>
                    <h5 className="text-lg font-black text-slate-900">AI & Deep Learning Systems</h5>
                    <div className="text-2xl font-black text-slate-900">₦120,000 <span className="text-xs font-normal text-slate-500">/ Quarter (200 FIC)</span></div>
                    <p className="text-xs text-slate-600">Includes dedicated cloud GPU sandbox, private vector database instances, and automated agent orchestration pipelines.</p>
                    <div className="pt-2 text-xs font-extrabold text-emerald-800">100% Fellowship Grants Available</div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase">Professional Tier Tracks</span>
                    <h5 className="text-lg font-black text-slate-900">Cloud DevOps & CyberSecurity</h5>
                    <div className="text-2xl font-black text-slate-900">₦95,000 - ₦100,000 <span className="text-xs font-normal text-slate-500">/ Quarter</span></div>
                    <p className="text-xs text-slate-600">Includes bare-metal cluster instances, WireGuard VPN tunnels, and smart contract audit sandboxes.</p>
                    <div className="pt-2 text-xs font-extrabold text-emerald-800">100% Fellowship Grants Available</div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase">Creator & Venture Tiers</span>
                    <h5 className="text-lg font-black text-slate-900">4K Media, Growth & Product</h5>
                    <div className="text-2xl font-black text-slate-900">₦60,000 - ₦80,000 <span className="text-xs font-normal text-slate-500">/ Quarter</span></div>
                    <p className="text-xs text-slate-600">Includes DaVinci Resolve grading presets, BeatwaveNG royalty splits, and PRD venture incubator access.</p>
                    <div className="pt-2 text-xs font-extrabold text-indigo-800">100% Fellowship Grants Available</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: ACADEMIC CALENDAR SYSTEM ==================== */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              {/* Calendar Controls */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Academic Calendar & Term Schedules</h3>
                  <p className="text-xs text-slate-700">Track exams, live lectures, holiday recesses, advisory sessions, and graduation ceremonies.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Term Select */}
                  <select
                    value={calendarTermFilter}
                    onChange={(e) => setCalendarTermFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Academic Terms</option>
                    <option value="TERM_1_2026">Term 1 (Fall 2026)</option>
                    <option value="TERM_2_2026">Term 2 (Spring 2027)</option>
                    <option value="ANNUAL_CAPSTONE">Annual Capstone Showcase</option>
                  </select>

                  {/* Type Filter */}
                  <select
                    value={calendarTypeFilter}
                    onChange={(e) => setCalendarTypeFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Event Types</option>
                    <option value="CLASS_SESSION">Class Sessions</option>
                    <option value="EXAM_PERIOD">Exam Periods</option>
                    <option value="HOLIDAY">Holidays & Breaks</option>
                    <option value="ADVISORY_MEETING">Advisory Meetings</option>
                    <option value="ACADEMIC_CEREMONY">Academic Ceremonies</option>
                  </select>

                  <button
                    onClick={() => {
                      showToast('Academic Calendar .ics exported! Syncing with Google Calendar & Outlook.', 'success');
                    }}
                    className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Export (.ICS)
                  </button>
                </div>
              </div>

              {/* Calendar Events List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCalendarEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-indigo-300 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-950 border border-indigo-400 text-xs font-black uppercase">
                          {ev.type.replace('_', ' ')}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                            ev.status === 'COMPLETED'
                              ? 'bg-slate-100 text-slate-950'
                              : ev.status === 'IN_PROGRESS'
                                ? 'bg-emerald-100 text-slate-950 border border-slate-400 animate-pulse'
                                : 'bg-blue-100 text-slate-950 border border-slate-400'
                          }font-black`}
                        >
                          {ev.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {ev.title}
                      </h4>

                      <p className="text-slate-700 text-xs leading-relaxed">
                        {ev.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <CalendarIcon className="w-4 h-4 text-indigo-600" />
                          {ev.startDate} {ev.endDate !== ev.startDate && `to ${ev.endDate}`}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <ClockIcon className="w-4 h-4 text-slate-500" />
                          {ev.timeSlot}
                        </div>
                        <div className="text-slate-600">
                          <strong>Location:</strong> {ev.location}
                        </div>
                        <div className="text-slate-600">
                          <strong>Host:</strong> {ev.organizer}
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-100">
                        <span className="font-semibold text-slate-600">Registered:</span>
                        <span className="font-bold text-slate-900">{ev.registeredCount} / {ev.capacity} Attendees</span>
                      </div>

                      <button
                        onClick={() => handleToggleCalendarRsvp(ev.id)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                          ev.isRegistered
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        {ev.isRegistered ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4 text-emerald-800" />
                            Registered (RSVP Confirmed)
                          </>
                        ) : (
                          <>
                            <UsersIcon className="w-4 h-4" />
                            Register & Reserve Seat
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 37-STATE COHORT BREAKDOWN MODAL ==================== */}
          {showStateCohortModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      National 37-State Enrollment & Fellowship Ledger
                    </h3>
                    <p className="text-xs text-slate-700">
                      Tracking 5,000 citizens across all 6 geopolitical zones of the Federal Republic of Nigeria.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowStateCohortModal(false)}
                    className="p-2 rounded-xl text-slate-700 hover:text-slate-700 hover:bg-slate-200 transition"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Zone Filter */}
                <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap gap-2 text-xs">
                  <span className="font-bold text-slate-600 self-center mr-1">Geopolitical Zone:</span>
                  {['all', 'North-Central', 'North-East', 'North-West', 'South-East', 'South-South', 'South-West'].map((zone) => (
                    <button
                      key={zone}
                      onClick={() => setSelectedGeoZone(zone)}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        selectedGeoZone === zone
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {zone === 'all' ? 'All Zones (37 States)' : zone}
                    </button>
                  ))}
                </div>

                {/* Modal Body Table */}
                <div className="p-6 overflow-y-auto flex-1">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-bold uppercase">
                        <th className="py-2.5 px-3">State / City</th>
                        <th className="py-2.5 px-3">Zone</th>
                        <th className="py-2.5 px-3 text-center">Enrolled / Target</th>
                        <th className="py-2.5 px-3 text-center">Fellowships</th>
                        <th className="py-2.5 px-3">Highest Demand Skill Track</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {filteredStateCohorts.map((item) => (
                        <tr key={item.state} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-900">{item.state}</td>
                          <td className="py-3 px-3 font-semibold text-slate-700">{item.zone}</td>
                          <td className="py-3 px-3 text-center font-bold text-slate-900">
                            {item.enrolledCount} / {item.targetCount}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-black">
                              Fellowship Supported
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-indigo-700">{item.topSkillTrack}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Showing {filteredStateCohorts.length} State Cohorts • Cumulative: {filteredStateCohorts.reduce((s, c) => s + c.enrolledCount, 0).toLocaleString()} Citizens
                  </span>
                  <button
                    onClick={() => setShowStateCohortModal(false)}
                    className="py-2 px-5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                  >
                    Close Ledger
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== QUARTERLY SUBSCRIPTION CHECKOUT MODAL ==================== */}
          {selectedCourseForSubscription && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-300 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">
                      {selectedCourseForSubscription.subscriptionTier} Tier • Quarterly Billing
                    </span>
                    <h3 className="text-xl font-black text-slate-900 leading-snug">
                      Subscribe to {selectedCourseForSubscription.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCourseForSubscription(null)}
                    className="p-1.5 rounded-lg text-slate-700 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Pricing Overview */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-600 font-medium">Quarterly Subscription Tuition:</span>
                    <strong className="text-xl font-black text-slate-900">
                      ₦{selectedCourseForSubscription.quarterlySubscriptionNgn.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ Qtr</span>
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">FIC Token Rate:</span>
                    <strong className="text-indigo-700 font-bold">{selectedCourseForSubscription.quarterlySubscriptionFic} FIC per 3-month term</strong>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                      <span>Full syllabus access & branching interactive scenarios</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                      <span>Proctored Quizzes, Exams, Labs & Verified GPA Gradebook</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                      <span>Verifiable cryptographic transcript upon track completion</span>
                    </div>
                  </div>
                </div>

                {/* Payment Selection Options */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Quarterly Payment Method:</div>

                  {/* Option 1: Pay with FIC Tokens */}
                  <button
                    onClick={() => handleConfirmSubscription(selectedCourseForSubscription, 'FIC')}
                    className="w-full p-4 rounded-xl border border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100/60 text-left transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                        FIC
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Pay with FIC Token Smart Contract</div>
                        <div className="text-xs text-slate-600">Balance: {ficBalance} FIC • Instant On-Chain Activation</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                      {selectedCourseForSubscription.quarterlySubscriptionFic} FIC
                    </span>
                  </button>

                  {/* Option 2: Pay with Naira Gateway */}
                  <button
                    onClick={() => handleConfirmSubscription(selectedCourseForSubscription, 'NAIRA')}
                    className="w-full p-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-left transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                        ₦
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Pay with Nigerian Naira Gateway</div>
                        <div className="text-xs text-slate-600">Card, Bank Transfer, or USSD Gateway</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      ₦{selectedCourseForSubscription.quarterlySubscriptionNgn.toLocaleString()}
                    </span>
                  </button>

                  {/* Option 3: Apply for State Fellowship Grant */}
                  <button
                    onClick={() => handleConfirmSubscription(selectedCourseForSubscription, 'SCHOLARSHIP')}
                    className="w-full p-4 rounded-xl border border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-left transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black">
                        <SparklesIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-emerald-950">Claim 100% State Fellowship Grant</div>
                        <div className="text-xs text-emerald-800">Funded by ₦750M Sovereign Education Endowment</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-950 bg-emerald-200/80 px-2.5 py-1 rounded-lg border border-emerald-400">
                      100% Free Voucher
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SYLLABUS & LESSON DRAWER / MODAL ==================== */}
          {selectedCourseForSyllabus && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div>
                    <span className="text-xs font-bold text-indigo-700 uppercase">{selectedCourseForSyllabus.categoryLabel} • {selectedCourseForSyllabus.subscriptionTier} Tier</span>
                    <h3 className="text-xl font-black text-slate-900 leading-snug">
                      {selectedCourseForSyllabus.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCourseForSyllabus(null)}
                    className="p-2 rounded-xl text-slate-700 hover:text-slate-700 hover:bg-slate-200 transition"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
                  {/* Summary */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Curriculum Summary</h4>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{selectedCourseForSyllabus.summary}</p>
                  </div>

                  {/* Learning Outcomes */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Accredited Learning Outcomes</h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                      {selectedCourseForSyllabus.learningOutcomes.map((out, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Modules & Lessons */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Module Structure & Branching Scenarios</h4>
                    {selectedCourseForSyllabus.modules.map((mod) => (
                      <div key={mod.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                        <div className="flex justify-between items-baseline">
                          <h5 className="font-bold text-slate-900 text-sm">{mod.title}</h5>
                          <span className="text-xs font-bold text-indigo-700">{mod.duration}</span>
                        </div>
                        <p className="text-xs text-slate-600">{mod.description}</p>

                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          {mod.lessons.map((les) => (
                            <div key={les.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <PlayIcon className="w-4 h-4 text-indigo-600" />
                                <div>
                                  <span className="font-bold text-slate-900">{les.title}</span>
                                  <div className="text-[11px] text-slate-500">{les.description}</div>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                {les.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-700">
                    Quarterly Rate: <strong className="text-slate-900">₦{selectedCourseForSyllabus.quarterlySubscriptionNgn.toLocaleString()} ({selectedCourseForSyllabus.quarterlySubscriptionFic} FIC)</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCourseForSubscription(selectedCourseForSyllabus);
                      setSelectedCourseForSyllabus(null);
                    }}
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 text-xs shadow-md"
                  >
                    Subscribe Quarterly
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== LIVE ASSESSMENT EXAM SIMULATOR MODAL ==================== */}
          {activeTakingAssessment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
                {/* Exam Top Header */}
                <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Proctored Assessment Session • {activeTakingAssessment.type}
                    </span>
                    <h3 className="text-lg font-bold text-white truncate max-w-md">
                      {activeTakingAssessment.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Time Remaining</div>
                      <div className="text-base font-black text-amber-400 font-mono">
                        {Math.floor(examTimerSeconds / 60)}:
                        {String(examTimerSeconds % 60).padStart(2, '0')}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTakingAssessment(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Exam Questions Navigator */}
                <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Question {currentQuestionIndex + 1} of {activeTakingAssessment.questions.length}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-950 border border-indigo-300 font-bold">
                      {activeTakingAssessment.questions[currentQuestionIndex].type.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="font-black text-slate-800">
                    {activeTakingAssessment.questions[currentQuestionIndex].marks} Marks
                  </span>
                </div>

                {/* Exam Body Question Component */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  {examScoreResult ? (
                    <div className="text-center py-10 space-y-4">
                      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold flex items-center justify-center mx-auto text-3xl font-black border-4 ">
                        {examScoreResult.letterGrade}
                      </div>
                      <h4 className="text-2xl font-black text-slate-900">
                        Assessment Submitted & Graded!
                      </h4>
                      <p className="text-slate-700 text-sm max-w-md mx-auto">
                        You scored <strong>{examScoreResult.score}%</strong> yielding an official grade of <strong>{examScoreResult.letterGrade} ({examScoreResult.points.toFixed(1)} GPA points)</strong>. This official record has been committed directly to your decentralized sovereign gradebook ledger.
                      </p>
                      <button
                        onClick={() => {
                          setActiveTakingAssessment(null);
                          setActiveTab('gradebook');
                        }}
                        className="py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shadow-md"
                      >
                        View in Gradebook Ledger
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Current Question Display */}
                      {(() => {
                        const currentQ = activeTakingAssessment.questions[currentQuestionIndex];
                        return (
                          <div className="space-y-4">
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                              {currentQ.prompt}
                            </h4>

                            {/* Multiple Choice & True/False */}
                            {(currentQ.type === 'MULTIPLE_CHOICE' || currentQ.type === 'TRUE_FALSE') && currentQ.options && (
                              <div className="space-y-2 pt-2">
                                {currentQ.options.map((opt, idx) => (
                                  <label
                                    key={idx}
                                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                                      examAnswers[currentQ.id] === opt
                                        ? 'bg-indigo-50 border-indigo-500 text-slate-900 font-bold'
                                        : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={currentQ.id}
                                      value={opt}
                                      checked={examAnswers[currentQ.id] === opt}
                                      onChange={() => setExamAnswers({ ...examAnswers, [currentQ.id]: opt })}
                                      className="w-4 h-4 text-slate-900 focus:ring-indigo-500 font-bold border border-slate-300 rounded bg-white focus:ring-2 placeholder:text-slate-400"
                                    />
                                    <span className="text-sm font-semibold">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {/* Short Answer */}
                            {currentQ.type === 'SHORT_ANSWER' && (
                              <div className="pt-2">
                                <input
                                  type="text"
                                  value={examAnswers[currentQ.id] || ''}
                                  onChange={(e) => setExamAnswers({ ...examAnswers, [currentQ.id]: e.target.value })}
                                  placeholder="Type your precise technical answer..."
                                  className="w-full p-3.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 text-sm"
                                />
                              </div>
                            )}

                            {/* Essay */}
                            {currentQ.type === 'ESSAY' && (
                              <div className="pt-2 space-y-2">
                                <textarea
                                  rows={6}
                                  value={examAnswers[currentQ.id] || ''}
                                  onChange={(e) => setExamAnswers({ ...examAnswers, [currentQ.id]: e.target.value })}
                                  placeholder="Write your comprehensive technical essay response here..."
                                  className="w-full p-3.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
                                />
                                {currentQ.sampleRubric && (
                                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <strong>Evaluation Rubric Guide:</strong> {currentQ.sampleRubric}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Matching */}
                            {currentQ.type === 'MATCHING' && currentQ.pairs && (
                              <div className="pt-2 space-y-3">
                                <div className="text-xs font-bold text-slate-600">Matched Pairs Matrix:</div>
                                {currentQ.pairs.map((pair, pIdx) => (
                                  <div key={pIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                                    <div className="font-bold text-slate-900 self-center">{pair.left}</div>
                                    <div className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                                      {pair.right}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Ordering */}
                            {currentQ.type === 'ORDERING' && currentQ.sequenceItems && (
                              <div className="pt-2 space-y-2">
                                <div className="text-xs font-bold text-slate-600">Correct Step Sequence:</div>
                                {currentQ.sequenceItems.map((seq, sIdx) => (
                                  <div key={sIdx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs flex-shrink-0">
                                      {sIdx + 1}
                                    </span>
                                    <span>{seq}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* File Upload */}
                            {currentQ.type === 'FILE_UPLOAD' && (
                              <div className="pt-2 space-y-3">
                                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2 bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                                  <DocumentTextIcon className="w-8 h-8 text-indigo-600 mx-auto" />
                                  <div className="text-sm font-bold text-slate-900">Drag & drop lab notebook or click to browse</div>
                                  <div className="text-xs text-slate-500">Supports .ipynb, .py, .pdf, .zip up to 50MB</div>
                                </div>
                                <div className="text-xs text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                                  <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                                  Simulated file attached: <code>quantized_model_benchmark.ipynb (2.4 MB)</code>
                                </div>
                              </div>
                            )}

                            {/* Audio Response */}
                            {currentQ.type === 'AUDIO_RESPONSE' && (
                              <div className="pt-2 space-y-3">
                                <div className="border border-slate-300 rounded-2xl p-6 bg-slate-50 text-center space-y-3">
                                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-950 flex items-center justify-center mx-auto animate-pulse border border-rose-400 font-black">
                                    🎙️
                                  </div>
                                  <div className="text-sm font-bold text-slate-900">Oral Technical Defense Recording</div>
                                  <div className="text-xs text-slate-500">Recorded: 00:54 / 01:00 Seconds</div>
                                  <div className="h-2 w-48 bg-slate-200 rounded-full mx-auto overflow-hidden border text-slate-950 border-slate-400 font-black">
                                    <div className="h-full bg-rose-500 w-3/4 rounded-full" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>

                {/* Exam Footer Navigation */}
                {!examScoreResult && (
                  <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      className="py-2 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 disabled:opacity-50 hover:bg-slate-100"
                    >
                      Previous Question
                    </button>

                    <div className="flex items-center gap-2">
                      {currentQuestionIndex < activeTakingAssessment.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                          className="py-2 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitAssessment}
                          className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Submit Exam & Calculate Grade
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== SOVEREIGN TRANSCRIPT MODAL ==================== */}
          {showTranscriptModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
                  <div className="flex items-center gap-3">
                    <AcademicCapIcon className="w-7 h-7 text-emerald-400" />
                    <div>
                      <h3 className="text-lg font-black text-white">Official Sovereign Digital Academic Transcript</h3>
                      <p className="text-xs text-slate-400">Federal Republic of Nigeria • Decentralized E-Learning Directorate</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTranscriptModal(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-6 flex-1 text-slate-900 bg-white">
                  {/* Official Institutional Watermark Banner */}
                  <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">FINGERMOBILE DIGITAL TRAINING ACADEMY</h2>
                      <div className="text-xs text-slate-700 font-bold uppercase">OFF-CAMPUS ACCREDITED HIGHER TECH COUNCIL</div>
                      <div className="text-xs text-slate-600">Charter No: FM-EDU-NG-2026-SOV</div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-950 border border-emerald-400 text-xs font-black">
                        OFFICIAL VERIFIED
                      </span>
                    </div>
                  </div>

                  {/* Student Credentials */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="block text-slate-500">Student Name:</span>
                      <strong className="text-slate-900 text-sm font-bold">{transcriptData.fullName}</strong>
                    </div>
                    <div>
                      <span className="block text-slate-500">Matriculation Number:</span>
                      <strong className="text-slate-900 text-sm font-bold font-mono">{transcriptData.matricNumber}</strong>
                    </div>
                    <div>
                      <span className="block text-slate-500">State of Origin:</span>
                      <strong className="text-slate-900 font-bold">{transcriptData.stateOfOrigin}</strong>
                    </div>
                    <div>
                      <span className="block text-slate-500">Cohort / Academic Session:</span>
                      <strong className="text-slate-900 font-bold">{transcriptData.cohort}</strong>
                    </div>
                  </div>

                  {/* Course Records Table */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Academic Course Grades</h4>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-slate-900 font-bold">
                          <th className="py-2 px-3">Course Code</th>
                          <th className="py-2 px-3">Curriculum Title</th>
                          <th className="py-2 px-3 text-center">Credits</th>
                          <th className="py-2 px-3 text-center">Score</th>
                          <th className="py-2 px-3 text-center">Grade</th>
                          <th className="py-2 px-3 text-center">Grade Point</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        {transcriptData.courseRecords.map((rec) => (
                          <tr key={rec.courseCode}>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{rec.courseCode}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">{rec.title}</td>
                            <td className="py-2.5 px-3 text-center font-semibold">{rec.credits}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-900">{rec.score}%</td>
                            <td className="py-2.5 px-3 text-center font-black text-indigo-900">{rec.letterGrade}</td>
                            <td className="py-2.5 px-3 text-center font-bold">{rec.gradePoint.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-900 bg-slate-50 font-bold text-slate-900">
                          <td colSpan={2} className="py-2.5 px-3 text-right">Cumulative GPA:</td>
                          <td className="py-2.5 px-3 text-center">{transcriptData.totalCreditsEarned} Credits</td>
                          <td colSpan={2} />
                          <td className="py-2.5 px-3 text-center text-emerald-800 text-sm font-black">{transcriptData.cumulativeGpa.toFixed(2)} / 4.0</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Verification Cryptographic Hash */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block">Sha-256 On-Chain Cryptographic Verification Hash:</span>
                    <span className="font-mono text-[11px] text-slate-800 break-all select-all font-semibold">
                      {transcriptData.verificationHash}
                    </span>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">Digital Verification Seal Enabled</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="py-2 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-900 hover:bg-slate-100 flex items-center gap-1.5"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      Print / Download PDF
                    </button>
                    <button
                      onClick={() => setShowTranscriptModal(false)}
                      className="py-2 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                    >
                      Close Transcript
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SETTLE INVOICE PAYMENT MODAL ==================== */}
          {selectedInvoiceToPay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-indigo-700 uppercase">Settlement Portal</span>
                    <h3 className="text-lg font-black text-slate-900">
                      Settle Invoice {selectedInvoiceToPay.invoiceNumber}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedInvoiceToPay(null)}
                    className="p-1.5 rounded-lg text-slate-700 hover:text-slate-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Course / Module:</span>
                    <strong className="text-slate-900 truncate max-w-[200px]">{selectedInvoiceToPay.courseTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Quarterly Fee:</span>
                    <strong className="text-slate-900">₦{selectedInvoiceToPay.amountNgn.toLocaleString()} ({selectedInvoiceToPay.amountFic} FIC)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">State Fellowship Subsidy:</span>
                    <strong className="text-emerald-700 font-bold">{selectedInvoiceToPay.subsidyPercentage}% Applied</strong>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm">
                    <span className="text-slate-900">Net Payable:</span>
                    <span className="text-indigo-700 font-black">{selectedInvoiceToPay.netPayableFic} FIC</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handlePayInvoice(selectedInvoiceToPay)}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    <CreditCardIcon className="w-4 h-4" />
                    Authorize Smart Contract Payment ({selectedInvoiceToPay.netPayableFic} FIC)
                  </button>

                  <button
                    onClick={() => {
                      setInvoices((prev) =>
                        prev.map((i) =>
                          i.id === selectedInvoiceToPay.id
                            ? { ...i, status: 'PAID', subsidyPercentage: 100, netPayableFic: 0, paymentMethod: 'STATE_GRANT_FUND' }
                            : i
                        )
                      );
                      setSelectedInvoiceToPay(null);
                      showToast('100% Sovereign Scholarship Voucher applied! Net payable reduced to ₦0.00.', 'success');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-950 font-bold text-xs hover:bg-emerald-100 transition"
                  >
                    Claim 100% State Scholarship Grant Voucher
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default ProgramsPage;
