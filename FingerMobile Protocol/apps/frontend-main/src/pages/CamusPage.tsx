import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import {
  camusService,
  CamusTelemetry,
  CamusCourse,
  CamusTopic,
  CamusApplicantTrack,
  CamusOpenResource,
  CamusEnrollment,
  CamusCertificate
} from '../services/camusService';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Users,
  Award,
  Clock,
  Search,
  CheckCircle2,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText,
  Play,
  Pause,
  RotateCcw,
  BadgeCheck,
  Send,
  HelpCircle,
  Code,
  Layers,
  Cpu,
  Flame,
  ArrowRight,
  Filter,
  Check,
  X,
  Bot,
  Zap,
  Target,
  BookMarked,
  BarChart3,
  Star,
  Compass,
  RefreshCw,
  Building2,
  Briefcase,
  LayoutGrid,
  CheckCircle,
  Volume2,
  Maximize2,
  Share2,
  Printer,
  ChevronDown
} from 'lucide-react';

const DEFAULT_OPEN_RESOURCES: CamusOpenResource[] = [
  {
    id: 'oer-1',
    title: 'Distributed Systems & Network Protocols: Principles and Paradigms',
    author: 'Andrew S. Tanenbaum / Open Academic Library',
    type: 'Open Textbook (PDF)',
    category: 'Computer Science',
    pages: 640,
    fileSize: '28.4 MB',
    license: 'Creative Commons CC-BY-NC 4.0',
    downloadUrl: 'https://open.umn.edu/opentextbooks/textbooks/distributed-systems',
    curatedBy: 'Camus Faculty Board'
  },
  {
    id: 'oer-2',
    title: 'Rust Programming Language & High-Performance Systems Architecture',
    author: 'Steve Klabnik & Carol Nichols (Rust Open Docs)',
    type: 'Official Open Documentation & SDK Compendium',
    category: 'Systems Programming',
    pages: 580,
    fileSize: '16.8 MB',
    license: 'MIT / Apache 2.0 Open Source',
    downloadUrl: 'https://doc.rust-lang.org/book/',
    curatedBy: 'FingerMobile Protocols Core'
  },
  {
    id: 'oer-3',
    title: 'Modern Deep Learning & Transformer Architectures Compendium',
    author: 'Aston Zhang, Zack C. Lipton (D2L.ai Open Curriculum)',
    type: 'Interactive Open Courseware & Notebooks',
    category: 'Artificial Intelligence',
    pages: 980,
    fileSize: '45.2 MB',
    license: 'Apache 2.0 Open Source',
    downloadUrl: 'https://d2l.ai/',
    curatedBy: 'Camus AI Research Group'
  },
  {
    id: 'oer-4',
    title: 'Principles of Cryptography & Merkle Hash Verification',
    author: 'Dan Boneh & Victor Shoup (Stanford Open CS)',
    type: 'Academic Monograph (PDF)',
    category: 'Cryptography',
    pages: 812,
    fileSize: '34.6 MB',
    license: 'Open Access Educational License',
    downloadUrl: 'https://crypto.stanford.edu/~dabo/cryptobook/',
    curatedBy: 'Seshat Vault Security Guild'
  },
  {
    id: 'oer-5',
    title: 'Web Content Accessibility Guidelines (WCAG) 2.2 & AAA Contrast Manual',
    author: 'World Wide Web Consortium (W3C / WAI)',
    type: 'Open Specification & Standard',
    category: 'Web Accessibility',
    pages: 210,
    fileSize: '8.1 MB',
    license: 'W3C Open Document License',
    downloadUrl: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
    curatedBy: 'FingerMobile UI/UX Accessibility Guild'
  },
  {
    id: 'oer-6',
    title: 'Digital Signal Processing & Studio Acoustic Engineering Manual',
    author: 'Audio Engineering Society & Open Audio Project',
    type: 'Professional Technical Specification',
    category: 'Sound Engineering',
    pages: 430,
    fileSize: '21.5 MB',
    license: 'Open Audio Standards Initiative',
    downloadUrl: 'https://www.aes.org/standards/',
    curatedBy: 'SoundOcean Master Studio Guild'
  },
  {
    id: 'oer-7',
    title: 'Sovereign Tokenomics, Algorithmic Ledgers & Smart Commerce',
    author: 'International Journal of Decentralized Finance (Open Access)',
    type: 'Peer-Reviewed Monograph',
    category: 'Fintech & Business',
    pages: 350,
    fileSize: '15.2 MB',
    license: 'Creative Commons CC-BY 4.0',
    downloadUrl: 'https://arxiv.org/abs/2101.07000',
    curatedBy: 'FIC Tokenomics Foundation'
  },
  {
    id: 'oer-8',
    title: 'NYSC Youth Enterprise Leadership & Digital Corporate Immersion Handbook',
    author: 'National Youth Service Vocational Training Directorate',
    type: 'Official Fellowship Curriculum',
    category: 'National Development',
    pages: 180,
    fileSize: '9.4 MB',
    license: 'Public Sector Open Knowledge License',
    downloadUrl: 'https://nysc.gov.ng/',
    curatedBy: 'NYSC Tech Corps Advisory'
  }
];

// Interactive Microlesson & Training Pathways
interface TrainingPathway {
  id: string;
  title: string;
  targetAudience: 'corporate' | 'partner' | 'student' | 'nysc';
  icon: string;
  badge: string;
  microlessonCount: number;
  estTime: string;
  description: string;
  primaryCategory: string;
}

const TRAINING_PATHWAYS: TrainingPathway[] = [
  {
    id: 'corporate-onboarding',
    title: 'Enterprise Partner & Merchant Onboarding',
    targetAudience: 'partner',
    icon: '🏢',
    badge: 'Corporate Fast-Track',
    microlessonCount: 8,
    estTime: '35 mins total',
    description: 'Rapid onboarding on merchant POS, settlement protocols, KYC workflows and compliance.',
    primaryCategory: 'Business & Finance'
  },
  {
    id: 'nysc-tech',
    title: 'NYSC Tech Enterprise Acceleration',
    targetAudience: 'nysc',
    icon: '🇳🇬',
    badge: '₦1.5M Grant Eligible',
    microlessonCount: 14,
    estTime: 'Bite-sized modules',
    description: 'Post-graduate skills accelerator with recurring monthly stipends & enterprise capital.',
    primaryCategory: 'National Development'
  },
  {
    id: 'dist-sys',
    title: 'High-Throughput Systems & Rust Engineering',
    targetAudience: 'student',
    icon: '⚡',
    badge: 'Core Protocol Mastery',
    microlessonCount: 16,
    estTime: '8 min microlessons',
    description: 'Microservice concurrency, memory safety, P2P network nodes & high-load caching.',
    primaryCategory: 'Technology'
  },
  {
    id: 'ai-eng',
    title: 'Applied AI & Autonomous Agent Workflows',
    targetAudience: 'student',
    icon: '🧠',
    badge: 'Production AI Lab',
    microlessonCount: 12,
    estTime: '6 min microlessons',
    description: 'Autonomous reasoning agents, fine-tuning, retrieval pipelines & multimodal evaluation.',
    primaryCategory: 'Data Science & AI'
  },
  {
    id: 'crypto-auditor',
    title: 'Cryptographic Ledger & Security Assurance',
    targetAudience: 'corporate',
    icon: '🔐',
    badge: 'Security Compliance',
    microlessonCount: 10,
    estTime: '10 min microlessons',
    description: 'Merkle tree verification, smart contract security audits, and cryptographic provenance.',
    primaryCategory: 'Technology'
  },
  {
    id: 'arts-soc-law',
    title: 'Constitutional Law, Civil Liberties & Digital Governance (BA)',
    targetAudience: 'student',
    icon: '🏛️',
    badge: 'School of Arts & Social Sciences',
    microlessonCount: 14,
    estTime: '7 min microlessons',
    description: 'Separation of powers, fundamental human rights charters, and digital sovereign governance.',
    primaryCategory: 'Social Sciences'
  },
  {
    id: 'arts-literature',
    title: 'Comparative Literature & Cultural Narrative Analysis (BA)',
    targetAudience: 'student',
    icon: '📚',
    badge: 'Humanities Degree Track',
    microlessonCount: 12,
    estTime: '8 min microlessons',
    description: 'Postcolonial discourse, literary archives, and indigenous storytelling across civil societies.',
    primaryCategory: 'Arts & Humanities'
  },
  {
    id: 'soc-macroeconomics',
    title: 'Sovereign Macroeconomics & Development Finance (MSc)',
    targetAudience: 'corporate',
    icon: '📊',
    badge: 'Postgraduate Faculty Lab',
    microlessonCount: 15,
    estTime: '10 min microlessons',
    description: 'Trade policy, fiscal decentralization, and currency dynamics for emerging continental markets.',
    primaryCategory: 'Social Sciences'
  },
  {
    id: 'arts-musicology',
    title: 'Musicology, Acoustics & Digital Soundscapes',
    targetAudience: 'student',
    icon: '🎵',
    badge: 'Creative Arts & Performance',
    microlessonCount: 10,
    estTime: '6 min microlessons',
    description: 'Harmonic analysis, acoustic signal processing, and indigenous musical oral traditions.',
    primaryCategory: 'Arts & Humanities'
  }
];

export const CamusPage: React.FC = () => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast, ficBalance } = useAppContext();

  // Active section tab
  const [activeSection, setActiveSection] = useState<'courses' | 'topics' | 'applicants' | 'resources' | 'verify'>('courses');

  // Audience View Toggle: Learner vs Corporate / Partner
  const [audienceMode, setAudienceMode] = useState<'all' | 'learner' | 'corporate' | 'nysc'>('all');

  // Backend state
  const [telemetry, setTelemetry] = useState<CamusTelemetry | null>(null);
  const [courses, setCourses] = useState<CamusCourse[]>([]);
  const [topics, setTopics] = useState<CamusTopic[]>([]);
  const [applicantTracks, setApplicantTracks] = useState<CamusApplicantTrack[]>([]);
  const [openResources, setOpenResources] = useState<CamusOpenResource[]>(DEFAULT_OPEN_RESOURCES);
  const [oerCategory, setOerCategory] = useState<string>('all');
  const [oerSearchQuery, setOerSearchQuery] = useState<string>('');
  const [enrollments, setEnrollments] = useState<CamusEnrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [selectedPathway, setSelectedPathway] = useState<string>('all');

  // Camus Intelligence Tutor State
  const [aiCopilotQuery, setAiCopilotQuery] = useState<string>('');
  const [aiCopilotAnswer, setAiCopilotAnswer] = useState<string | null>(null);
  const [aiCopilotLoading, setAiCopilotLoading] = useState<boolean>(false);

  // Modals state
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<CamusCourse | null>(null);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState<boolean>(false);

  // Open Educational Resource (OER) Reader Modal
  const [readingResource, setReadingResource] = useState<CamusOpenResource | null>(null);

  // Study Desk Modal
  const [activeStudyCourse, setActiveStudyCourse] = useState<CamusCourse | null>(null);
  const [activeEnrollment, setActiveEnrollment] = useState<CamusEnrollment | null>(null);
  const [isStudyDeskOpen, setIsStudyDeskOpen] = useState<boolean>(false);
  const [activeLessonIndex, setActiveLessonIndex] = useState<{ module: number; lesson: number }>({ module: 0, lesson: 0 });
  const [lessonPlaybackSpeed, setLessonPlaybackSpeed] = useState<string>('1.0x');
  const [lessonCopilotPrompt, setLessonCopilotPrompt] = useState<string>('');
  const [lessonCopilotResponse, setLessonCopilotResponse] = useState<string | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

  // Fresh Applicant / Corporate Fast-Track State
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState<boolean>(false);
  const [selectedTrackForApply, setSelectedTrackForApply] = useState<CamusApplicantTrack | null>(null);
  const [applicantType, setApplicantType] = useState<'individual' | 'corporate_partner' | 'nysc'>('individual');
  const [applicantForm, setApplicantForm] = useState({
    fullName: (member as any)?.displayName || (member as any)?.name || member?.username || '',
    email: member?.email || '',
    phone: '',
    organizationName: '',
    educationLevel: 'Undergraduate',
    statementOfPurpose: '',
    nyscCallUpNumber: ''
  });
  const [applying, setApplying] = useState<boolean>(false);

  // Certificate Verification
  const [certificateSearchQuery, setCertificateSearchQuery] = useState<string>('CERT-CAMUS-984210');
  const [verifiedCertificate, setVerifiedCertificate] = useState<CamusCertificate | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Quiz Simulator State in Study Desk
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Load all Camus Academic Data from Backend API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [telemRes, coursesRes, topicsRes, tracksRes, resourcesRes, enrRes] = await Promise.all([
        camusService.getTelemetry().catch(() => null),
        camusService.getCourses({
          search: searchQuery,
          category: selectedCategory,
          level: selectedLevel,
          sortBy
        }).catch(() => ({ data: [], total: 0, count: 0 })),
        camusService.getTopics().catch(() => []),
        camusService.getApplicantTracks().catch(() => []),
        camusService.getOpenResources().catch(() => []),
        camusService.getEnrollments(member?.id ? String(member.id) : undefined).catch(() => [])
      ]);

      if (telemRes) setTelemetry(telemRes);
      if (coursesRes && coursesRes.data) setCourses(coursesRes.data);
      if (topicsRes) setTopics(topicsRes);
      if (tracksRes) setApplicantTracks(tracksRes);
      if (resourcesRes && Array.isArray(resourcesRes) && resourcesRes.length > 0) {
        setOpenResources(resourcesRes);
      }
      if (enrRes) setEnrollments(enrRes);
    } catch (err: any) {
      showToast('Error syncing academic curriculum from Camus engine', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedLevel, sortBy, member?.id, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle URL tab param if provided
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'applicants' || tabParam === 'apply') {
      setActiveSection('applicants');
    } else if (tabParam === 'topics') {
      setActiveSection('topics');
    } else if (tabParam === 'resources') {
      setActiveSection('resources');
    } else if (tabParam === 'verify') {
      setActiveSection('verify');
    }
  }, [searchParams]);

  // 1-Click Course Enrollment
  const handleEnrollCourse = async (course: CamusCourse) => {
    try {
      const studentId = member?.id ? String(member.id) : 'stu-demo';
      const studentName = (member as any)?.displayName || (member as any)?.name || member?.username || 'Valued Scholar';
      const res = await camusService.createEnrollment(course.id, studentId, studentName);
      showToast(`Enrolled in "${course.title}". Microlessons added to your Study Desk!`, 'success');
      // Refresh enrollments & telemetry
      const updatedEnr = await camusService.getEnrollments(studentId);
      setEnrollments(updatedEnr);
      // Auto-open study desk
      setActiveStudyCourse(course);
      setActiveEnrollment(res);
      setIsStudyDeskOpen(true);
    } catch (err: any) {
      showToast(err.message || 'Enrollment failed', 'error');
    }
  };

  // Launch Study Desk for an Enrolled Course
  const handleOpenStudyDesk = (course: CamusCourse) => {
    const enr = enrollments.find(e => e.courseId === course.id);
    setActiveStudyCourse(course);
    setActiveEnrollment(enr || null);
    setIsStudyDeskOpen(true);
    setActiveLessonIndex({ module: 0, lesson: 0 });
    setQuizAnswers({});
    setQuizScore(null);
    setQuizSubmitted(false);
    setLessonCopilotResponse(null);
  };

  // Mark Lesson Completed & Update Progress
  const handleCompleteLesson = async (lessonId: string) => {
    if (!activeEnrollment || !activeStudyCourse) return;
    try {
      const allLessons: string[] = [];
      activeStudyCourse.syllabus.forEach(m => m.lessons.forEach(l => allLessons.push(l.id)));
      const completedSet = new Set([...activeEnrollment.completedLessons, lessonId]);
      const progressPct = Math.round((completedSet.size / allLessons.length) * 100);

      const res = await camusService.updateProgress({
        enrollmentId: activeEnrollment.id,
        lessonId,
        progressPct
      });

      setActiveEnrollment(res);
      setEnrollments(prev => prev.map(e => (e.id === res.id ? res : e)));
      showToast('Microlesson completed! Progress recorded in your Permanent Study Record.', 'success');

      if (progressPct >= 100 && !res.certificateIssued) {
        showToast('Distinction Achieved! Minting your cryptographic Permanence certificate...', 'success');
        const cert = await camusService.mintCertificate({
          courseId: activeStudyCourse.id,
          studentName: activeEnrollment.studentName,
          studentId: activeEnrollment.studentId,
          grade: 'Distinction (100%)'
        });
        setVerifiedCertificate(cert);
        setVerifyStatus('success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update lesson progress', 'error');
    }
  };

  // Camus Intelligence Question Simulator
  const handleAskCamusAI = (queryText: string) => {
    setAiCopilotQuery(queryText);
    setAiCopilotLoading(true);
    setTimeout(() => {
      let response = '';
      const q = queryText.toLowerCase();
      if (q.includes('study plan') || q.includes('plan')) {
        response = '🎯 7-Day Camus Mastery Track: Day 1-2: Architecture & Memory Semantics (Modules 1-2). Day 3-4: Hands-on Lab & Network Protocol Implementation. Day 5: Peer review & Quiz Validation. Day 6-7: Capstone Deployment & Permanence Credential Minting.';
      } else if (q.includes('merkle') || q.includes('consensus') || q.includes('byzantine')) {
        response = '🛡️ Protocol Architecture Note: Byzantine Fault Tolerance allows decentralized networks to achieve agreement even if up to 1/3 of validator nodes crash or act maliciously, verified cryptographically via Merkle DAG roots.';
      } else if (q.includes('nysc') || q.includes('stipend') || q.includes('grant')) {
        response = '🇳🇬 NYSC Tech Grant Verification: Enrolled NYSC Corps Members qualify for ₦80,000 monthly stipends + ₦1,500,000 equipment capstone grants upon completing 9 months in the National Development track.';
      } else if (q.includes('partner') || q.includes('corporate') || q.includes('onboarding')) {
        response = '🏢 Corporate Partner Onboarding: Rapid 8-module microlesson track covering FingerMobile merchant settlements, compliance APIs, security keys, and customer dispute resolution.';
      } else {
        response = `✨ Camus Intelligence: Found 4 syllabus modules directly matching "${queryText}". We recommend completing the "Distributed Systems & Network Protocols" foundation before moving into advanced consensus tracks.`;
      }
      setAiCopilotAnswer(response);
      setAiCopilotLoading(false);
    }, 400);
  };

  // Submit Application for Fresh Applicants / Corporate Training
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrackForApply) {
      showToast('Please select a training track', 'error');
      return;
    }
    setApplying(true);
    try {
      const res = await camusService.applyApplicant({
        fullName: applicantForm.fullName,
        email: applicantForm.email,
        phone: applicantForm.phone,
        trackId: selectedTrackForApply.id,
        educationLevel: applicantType === 'corporate_partner' ? 'Corporate Professional' : applicantForm.educationLevel,
        statementOfPurpose: applicantForm.organizationName ? `Organization: ${applicantForm.organizationName}. ${applicantForm.statementOfPurpose}` : applicantForm.statementOfPurpose,
        nyscCallUpNumber: applicantForm.nyscCallUpNumber
      });

      showToast(res.message || 'Admission approved! Credentials and study access generated.', 'success');
      setIsApplicantModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setApplying(false);
    }
  };

  // Verify Certificate on Permanence Ledger
  const handleVerifyCertificate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!certificateSearchQuery.trim()) return;
    setVerifyStatus('loading');
    try {
      const res = await camusService.verifyCertificate(certificateSearchQuery.trim());
      if (res && res.verified && res.data) {
        setVerifiedCertificate(res.data);
        setVerifyStatus('success');
      } else {
        setVerifiedCertificate(null);
        setVerifyStatus('error');
      }
    } catch (err) {
      setVerifiedCertificate(null);
      setVerifyStatus('error');
    }
  };

  // Filtered courses based on search & pathway
  const displayCourses = courses.filter((c) => {
    if (selectedPathway !== 'all') {
      const pathway = TRAINING_PATHWAYS.find(p => p.id === selectedPathway);
      if (pathway && c.category !== pathway.primaryCategory) {
        return false;
      }
    }
    if (audienceMode === 'nysc' && c.category !== 'National Development') {
      return false;
    }
    if (audienceMode === 'corporate' && c.category !== 'Business & Finance' && c.category !== 'Technology') {
      return false;
    }
    return true;
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
        
        {/* ========================================================================= */}
        {/* SLEEK, CLEAN MODERN HERO: CORPORATE TRAINING & STUDENT MASTERY ENGINE    */}
        {/* ========================================================================= */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            
            {/* Top Toolbar: Brand Identification, Mode Switcher & Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-700 flex items-center justify-center text-white shadow-sm shadow-blue-700/20">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      CAMUS Sovereign Academic Engine
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-950 border border-blue-300">
                      Microlesson Architecture
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                    Structured Learning Platform for Corporate Training, Partner Onboarding & Student Academic Tracks
                  </p>
                </div>
              </div>

              {/* Fast Audience Selector & Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => navigate('/camusdashboard')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <LayoutGrid className="w-4 h-4 text-slate-700" /> Student Dashboard
                </button>
                <button
                  onClick={() => navigate('/nysc')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-emerald-700" /> NYSC Grants
                </button>
                <button
                  onClick={() => {
                    setApplicantType('corporate_partner');
                    setSelectedTrackForApply(applicantTracks[0] || null);
                    setIsApplicantModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 border border-blue-800 shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4 text-amber-300" /> Fast-Track Onboarding
                </button>
              </div>
            </div>

            {/* Split Hero Workspace: Overview & Active Scholar Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
              
              {/* Left Column: Platform Mission & Quick Assistance */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    Interactive 5-to-15 Minute Microlessons
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    Zero Friction • 1-Click Fast Setup
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  Modern, Intuitive Learning Engineered for High Retention & Measurable Outcomes
                </h2>

                <p className="text-sm text-slate-700 leading-relaxed font-medium max-w-xl">
                  Whether onboarding corporate merchant partners, accelerating NYSC post-graduates, or mastering computer science and fintech curricula, Camus breaks down complex requirements into structured, bite-sized microlessons verified on the cryptographic Permanence ledger.
                </p>

                {/* Audience Filter Pills */}
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Filter by Training Target:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All Curricula' },
                      { id: 'learner', label: '🎓 University Scholars' },
                      { id: 'corporate', label: '🏢 Corporate & Partners' },
                      { id: 'nysc', label: '🇳🇬 NYSC Fellows' }
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setAudienceMode(filter.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          audienceMode === filter.id
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Camus Intelligence Tutor Prompts */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-2">
                    <Bot className="w-3.5 h-3.5 text-blue-600" /> Instant Camus Intelligence Prompts:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Corporate Partner Onboarding Track',
                      '7-Day Mastery Study Plan',
                      'NYSC ₦1.5M Grant Breakdown',
                      'Explain Merkle DAG verification'
                    ].map((promptText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAskCamusAI(promptText)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center gap-1.5"
                      >
                        <Zap className="w-3 h-3 text-blue-600" /> {promptText}
                      </button>
                    ))}
                  </div>

                  {aiCopilotLoading && (
                    <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-700" />
                      <span>Camus Intelligence generating curriculum insights...</span>
                    </div>
                  )}

                  {aiCopilotAnswer && !aiCopilotLoading && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 shadow-xs relative">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-blue-900 flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-blue-700" /> Camus Intelligence Insight:
                        </span>
                        <button
                          onClick={() => setAiCopilotAnswer(null)}
                          className="text-slate-500 hover:text-slate-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="leading-relaxed font-medium text-slate-800">{aiCopilotAnswer}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Clean Structured Learner / Partner Command Card */}
              <div className="lg:col-span-5">
                <div className="bg-slate-50 rounded-2xl border border-slate-300 p-6 shadow-xs space-y-4">
                  
                  {/* Student / Administrator Profile Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-900 font-bold">
                        <Flame className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">
                            {(member as any)?.displayName || member?.username || 'Protocol Scholar'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300">
                            14-Day Streak
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700">Verified Study ID: CAMUS-{member?.id || '8492'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-blue-900">{ficBalance.toLocaleString()} FIC</span>
                      <p className="text-[10px] text-slate-600 font-bold">Scholarship Grant</p>
                    </div>
                  </div>

                  {/* Daily Learning Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Daily Microlesson Target</span>
                      <span className="font-mono text-blue-900">3 of 4 Completed (75%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-700 h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  {/* 1-Click Resume Current Course Action */}
                  <div className="pt-2">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-300 flex items-center justify-between gap-3 shadow-xs">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">Active Microlesson</span>
                        <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                          {courses[0]?.title || 'Distributed Systems & Network Protocols'}
                        </p>
                        <p className="text-[11px] text-slate-700">Module 2 · 8 min read</p>
                      </div>

                      <button
                        onClick={() => courses[0] && handleOpenStudyDesk(courses[0])}
                        className="px-3.5 py-2 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5" /> Continue
                      </button>
                    </div>
                  </div>

                  {/* Dual Telemetry Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-300">
                      <p className="font-black text-slate-900">9,842+</p>
                      <p className="text-[10px] text-slate-600 font-bold uppercase mt-0.5">Certificates Issued</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-300">
                      <p className="font-black text-emerald-900">100% Free</p>
                      <p className="text-[10px] text-slate-600 font-bold uppercase mt-0.5">FIC Grant Subsidized</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Live Telemetry Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-slate-200">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-300">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Active Scholars</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  {telemetry?.activeStudents?.toLocaleString() || '14,290'}
                </p>
                <span className="text-[10px] text-emerald-900 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Verified Scholars
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-300">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Accredited Courses</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  {telemetry?.totalCourses || courses.length || '320'}
                </p>
                <span className="text-[10px] text-blue-900 font-bold flex items-center gap-1 mt-0.5">
                  6 Topic Clusters
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-300">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Certified Alumni</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  {telemetry?.certifiedGraduates?.toLocaleString() || '9,842'}
                </p>
                <span className="text-[10px] text-purple-900 font-bold flex items-center gap-1 mt-0.5">
                  Permanence Ledger
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-300">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Open OER Texts</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  {telemetry?.openResourcesCount?.toLocaleString() || '1,455'}
                </p>
                <span className="text-[10px] text-slate-700 font-bold flex items-center gap-1 mt-0.5">
                  Free Open SDKs
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-300">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Study Hours</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  {telemetry?.totalStudyHours?.toLocaleString() || '189,450'}
                </p>
                <span className="text-[10px] text-amber-900 font-bold flex items-center gap-1 mt-0.5">
                  Logged Milestones
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-300">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Scholarship Vault</p>
                <p className="text-xl font-black text-blue-900 mt-0.5">
                  {telemetry?.ficScholarshipVault?.toLocaleString() || '1,250,000'} <span className="text-xs font-bold text-slate-700">FIC</span>
                </p>
                <span className="text-[10px] text-emerald-900 font-bold flex items-center gap-1 mt-0.5">
                  Full Grant Funding
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* CLEAN STICKY SECTION NAVIGATION BAR                                       */}
        {/* ========================================================================= */}
        <section className="sticky top-0 z-30 bg-white border-b border-slate-300 shadow-xs">
          <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-2 py-2.5 no-scrollbar">
              
              <button
                onClick={() => setActiveSection('courses')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeSection === 'courses'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-800 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Course Catalog & Microlessons ({courses.length})
              </button>

              <button
                onClick={() => setActiveSection('topics')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeSection === 'topics'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-800 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Cpu className="w-4 h-4" /> Topics Course Engine ({topics.length})
              </button>

              <button
                onClick={() => setActiveSection('applicants')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeSection === 'applicants'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-800 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" /> Fresh Admissions & Partner Tracks ({applicantTracks.length})
              </button>

              <button
                onClick={() => setActiveSection('resources')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeSection === 'resources'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-800 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Download className="w-4 h-4" /> Open Resources & SDKs ({openResources.length})
              </button>

              <button
                onClick={() => setActiveSection('verify')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeSection === 'verify'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-800 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Certificate & Permanence Verifier
              </button>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MAIN BODY CONTENTS                                                        */}
        {/* ========================================================================= */}
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

          {/* TAB 1: ACADEMIC & CORPORATE COURSE CATALOG */}
          {activeSection === 'courses' && (
            <div className="space-y-8">
              
              {/* Structured Interactive Microlesson Pathways Selector */}
              <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-blue-100 text-blue-900">
                      <Target className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Interactive Training Pathways & Microlessons
                      </h3>
                      <p className="text-xs text-slate-700">
                        Structured modular courses organized into bite-sized microlessons for rapid onboarding and high retention.
                      </p>
                    </div>
                  </div>

                  {selectedPathway !== 'all' && (
                    <button
                      onClick={() => setSelectedPathway('all')}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 self-start md:self-auto"
                    >
                      Show All Pathways
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {TRAINING_PATHWAYS.map((pathway) => {
                    const isSelected = selectedPathway === pathway.id;
                    return (
                      <button
                        key={pathway.id}
                        onClick={() => setSelectedPathway(isSelected ? 'all' : pathway.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-600'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl">{pathway.icon}</span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-950 border border-blue-300">
                              {pathway.microlessonCount} Microlessons
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-slate-900 leading-snug line-clamp-1">
                            {pathway.title}
                          </h4>
                          <p className="text-[11px] text-slate-700 mt-1 line-clamp-2">
                            {pathway.description}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-bold text-slate-800 flex items-center justify-between">
                          <span>{pathway.badge}</span>
                          <span className="font-mono text-slate-600">{pathway.estTime}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">
                <div className="flex flex-col lg:flex-row items-center gap-3">
                  
                  {/* Search input */}
                  <div className="relative flex-1 w-full">
                    <Search className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search courses by title, keywords, skills, or faculty instructor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="w-full lg:w-48">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2.5 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="all">All Disciplines</option>
                      <option value="Technology">Technology & Engineering</option>
                      <option value="Creative Media">Creative Media & Sound</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                      <option value="National Development">NYSC & National Track</option>
                      <option value="Business & Finance">Business & Fintech</option>
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div className="w-full lg:w-40">
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full px-3 py-2.5 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="all">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="w-full lg:w-44">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2.5 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                      <option value="students">Highest Enrollment</option>
                      <option value="price_asc">Price: Free First</option>
                      <option value="newest">Recently Published</option>
                    </select>
                  </div>

                  {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedPathway !== 'all' || audienceMode !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedLevel('all');
                        setSelectedPathway('all');
                        setAudienceMode('all');
                        setSortBy('popular');
                      }}
                      className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCourses.map((course) => {
                  const isEnrolled = enrollments.some(e => e.courseId === course.id);
                  const enrollment = enrollments.find(e => e.courseId === course.id);

                  // Calculate total microlessons across all syllabus modules
                  const totalMicrolessons = course.syllabus?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 12;

                  return (
                    <div
                      key={course.id}
                      className="group bg-white rounded-2xl border border-slate-300 shadow-xs hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Course Thumbnail */}
                        <div className="relative h-48 bg-slate-900 overflow-hidden">
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                          {/* Category and Level Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-100 text-blue-950 border border-blue-300 shadow-xs">
                              {course.category}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-900/90 text-white backdrop-blur-md border border-slate-700">
                              {course.level}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-slate-100 text-slate-900 border border-slate-300 shadow-xs flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-500" /> {totalMicrolessons} Microlessons
                            </span>
                          </div>

                          {isEnrolled && (
                            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-400 flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Enrolled
                            </div>
                          )}
                        </div>

                        {/* Content Header */}
                        <div className="p-5">
                          <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
                            {course.title}
                          </h3>
                          <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>

                          {/* Instructor Information */}
                          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200">
                            <img
                              src={course.instructor.avatarUrl}
                              alt={course.instructor.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-300 shadow-xs"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                                {course.instructor.name}
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                              </p>
                              <p className="text-[11px] text-slate-700 truncate">
                                {course.instructor.title}
                              </p>
                            </div>
                          </div>

                          {/* Meta Specs Ribbon */}
                          <div className="flex items-center justify-between mt-4 text-xs font-bold text-slate-800 pt-3 border-t border-slate-100">
                            <span className="flex items-center gap-1 text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-500" /> {course.duration}
                            </span>
                            <span className="flex items-center gap-1 text-slate-700">
                              <Users className="w-3.5 h-3.5 text-slate-500" /> {course.students.toLocaleString()} scholars
                            </span>
                            <span className="flex items-center gap-1 text-amber-900 font-black">
                              ★ {course.rating.toFixed(1)} ({course.reviewsCount})
                            </span>
                          </div>

                          {/* Progress bar if enrolled */}
                          {isEnrolled && enrollment && (
                            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                              <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-1.5">
                                <span>Curriculum Progress</span>
                                <span className="font-mono">{enrollment.progressPct}%</span>
                              </div>
                              <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${enrollment.progressPct}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="p-5 pt-0">
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          <div>
                            {course.price === 0 ? (
                              <span className="text-sm font-black text-emerald-900 flex items-center gap-1">
                                <Award className="w-4 h-4 text-emerald-700" /> 100% Scholarship
                              </span>
                            ) : (
                              <div className="text-sm font-black text-slate-900">
                                ${course.price} <span className="text-xs text-blue-700">({course.ficPrice} FIC)</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedCourseForSyllabus(course);
                                setIsSyllabusModalOpen(true);
                              }}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors"
                            >
                              Syllabus
                            </button>

                            {isEnrolled ? (
                              <button
                                onClick={() => handleOpenStudyDesk(course)}
                                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 border border-emerald-800 shadow-xs transition-all flex items-center gap-1.5"
                              >
                                <Play className="w-3.5 h-3.5" /> Study Desk
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEnrollCourse(course)}
                                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 border border-blue-800 shadow-xs transition-all flex items-center gap-1.5"
                              >
                                Enroll Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TOPICS CAMUS COURSE ENGINE & TAXONOMY */}
          {activeSection === 'topics' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Topics Camus Course Engine & Taxonomy
                    </h2>
                    <p className="text-xs text-slate-700 mt-1">
                      Multi-tier knowledge graph categorizing course syllabuses, learning outcomes, and technical credentials.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setActiveSection('courses');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors"
                  >
                    View All Filtered Courses
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl p-3 rounded-2xl bg-slate-100 border border-slate-300 shadow-inner">
                          {topic.icon}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-100 text-blue-950 border border-blue-400">
                          {topic.category}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                        {topic.description}
                      </p>

                      {/* Core Skills Tags */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Core Competencies:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {topic.coreSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Learning Outcomes */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Target Outcomes:</p>
                        <ul className="space-y-1.5">
                          {topic.learningOutcomes.map((outcome, idx) => (
                            <li key={idx} className="text-xs text-slate-800 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-700">
                        <span>{topic.courseCount} Courses</span> • <span>{topic.studentsCount.toLocaleString()} Scholars</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCategory(topic.category);
                          setActiveSection('courses');
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-900 bg-blue-100 border border-blue-300 hover:bg-blue-200 transition-colors flex items-center gap-1"
                      >
                        Explore Track <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FRESH APPLICANT ADMISSION & CORPORATE PARTNER TRACKS */}
          {activeSection === 'applicants' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">
                        Fresh Scholars & Corporate Partner Admissions
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                        Fast-Track Open
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">
                      Choose an academic, NYSC graduate accelerator, or corporate enterprise partner track for immediate onboarding.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTrackForApply(applicantTracks[0] || null);
                      setIsApplicantModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 border border-blue-800 shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" /> Start 1-Click Fast Setup
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {applicantTracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded text-xs font-black bg-slate-900 text-white font-mono">
                          {track.code}
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                          {track.tuition}
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-950 border border-blue-300">
                          Grant: +{track.scholarshipGrantFIC} FIC
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900">
                        {track.title}
                      </h3>
                      <p className="text-xs text-slate-700 mt-1 font-medium">
                        Target Candidates: {track.targetAudience}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                        <div>
                          <p className="text-slate-500 font-bold uppercase text-[10px]">Duration</p>
                          <p className="text-slate-900 font-black mt-0.5">{track.duration}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-bold uppercase text-[10px]">Commitment</p>
                          <p className="text-slate-900 font-black mt-0.5">{track.commitment}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-bold uppercase text-[10px]">Acceptance</p>
                          <p className="text-slate-900 font-black mt-0.5">{track.acceptanceRate}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-bold uppercase text-[10px]">Awarded Credential</p>
                          <p className="text-blue-900 font-black mt-0.5 truncate">{track.credentialsEarned}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {track.keyTopics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col gap-2 min-w-[170px]">
                      <button
                        onClick={() => {
                          setSelectedTrackForApply(track);
                          setIsApplicantModalOpen(true);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 border border-blue-800 shadow-xs transition-colors text-center"
                      >
                        Apply for Admission
                      </button>

                      {track.recommendedCourseIds && track.recommendedCourseIds.length > 0 && (
                        <button
                          onClick={() => {
                            const course = courses.find(c => c.id === track.recommendedCourseIds[0]);
                            if (course) {
                              setSelectedCourseForSyllabus(course);
                              setIsSyllabusModalOpen(true);
                            }
                          }}
                          className="w-full px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors text-center"
                        >
                          View Track Syllabus
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CURATED OPEN EDUCATIONAL RESOURCES (OER) */}
          {activeSection === 'resources' && (() => {
            const categories = ['all', ...Array.from(new Set(openResources.map(r => r.category)))];
            const filteredResources = openResources.filter(res => {
              const matchesSearch = !oerSearchQuery.trim() ||
                res.title.toLowerCase().includes(oerSearchQuery.toLowerCase()) ||
                res.author.toLowerCase().includes(oerSearchQuery.toLowerCase()) ||
                res.category.toLowerCase().includes(oerSearchQuery.toLowerCase());
              const matchesCategory = oerCategory === 'all' || res.category.toLowerCase() === oerCategory.toLowerCase();
              return matchesSearch && matchesCategory;
            });

            return (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-slate-900">
                          Open Educational Resources (OER) & SDK Repository
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-950 border border-blue-300">
                          {filteredResources.length} Compendiums Available
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">
                        100% free, open-source textbooks, official technical specifications, and SDK manuals curated by Camus faculty.
                      </p>
                    </div>

                    <a
                      href="https://open.umn.edu/opentextbooks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5 self-start md:self-auto"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Textbook Network
                    </a>
                  </div>

                  {/* Search and Category Filter Controls */}
                  <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search open textbooks, SDKs, or author..."
                        value={oerSearchQuery}
                        onChange={(e) => setOerSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div className="w-full sm:w-56">
                      <select
                        value={oerCategory}
                        onChange={(e) => setOerCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="all">All Academic Disciplines</option>
                        {categories.filter(c => c !== 'all').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {(oerSearchQuery || oerCategory !== 'all') && (
                      <button
                        onClick={() => {
                          setOerSearchQuery('');
                          setOerCategory('all');
                        }}
                        className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 shrink-0"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredResources.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded text-xs font-black bg-blue-100 text-blue-950 border border-blue-300">
                            {res.category}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {res.fileSize} • {res.pages} pages
                          </span>
                        </div>

                        <h3 className="text-base font-black text-slate-900 leading-snug">
                          {res.title}
                        </h3>
                        <p className="text-xs text-slate-700 mt-1">
                          Author / Source: <span className="font-bold text-slate-800">{res.author}</span>
                        </p>

                        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                          <div className="flex items-center justify-between">
                            <span>License: <strong className="text-slate-900">{res.license}</strong></span>
                            <span>Curated: <strong className="text-slate-900">{res.curatedBy}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Free Open Educational Access
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReadingResource(res)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors"
                          >
                            Read Online
                          </button>
                          <a
                            href={res.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-950 bg-blue-100 border border-blue-300 hover:bg-blue-200 transition-colors flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" /> PDF Pack
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* TAB 5: CERTIFICATE & PERMANENCE BLOCKCHAIN VERIFIER */}
          {activeSection === 'verify' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-900 shadow-inner">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Permanence Cryptographic Certificate Authority
                    </h2>
                    <p className="text-xs text-slate-700 mt-1">
                      Verify any Camus Course Completion Certificate or Degree against the immutable Seshat cryptographic Merkle ledger.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerifyCertificate} className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Enter Certificate Serial (e.g., CERT-CAMUS-984210)..."
                      value={certificateSearchQuery}
                      onChange={(e) => setCertificateSearchQuery(e.target.value)}
                      className="w-full px-4 py-2.5 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={verifyStatus === 'loading'}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    {verifyStatus === 'loading' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Hash...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" /> Verify on Ledger
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Verified Result Card */}
              {verifyStatus === 'success' && verifiedCertificate && (
                <div className="bg-white rounded-2xl border-2 border-emerald-400 p-6 shadow-xl relative overflow-hidden animate-fadeIn">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-400">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      </span>
                      <div>
                        <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                          Cryptographically Authenticated Diploma
                        </span>
                        <p className="text-sm font-black text-slate-900">
                          FingerMobile Camus Sovereign Academic Registry
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-400">
                      Verified On-Chain
                    </span>
                  </div>

                  <div className="py-6 space-y-4">
                    <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">This certifies that</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {verifiedCertificate.studentName}
                      </h3>
                      <p className="text-xs text-slate-700 mt-1">
                        has successfully completed all curricular milestones and examinations for
                      </p>
                      <p className="text-base font-black text-blue-900 mt-2">
                        {verifiedCertificate.courseTitle}
                      </p>
                      <p className="text-xs font-bold text-emerald-800 mt-1">
                        Grade Awarded: {verifiedCertificate.grade}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-slate-500 font-bold uppercase text-[10px]">Certificate Serial</p>
                        <p className="text-slate-900 font-mono font-black mt-0.5">{verifiedCertificate.id || verifiedCertificate.seshatId}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-slate-500 font-bold uppercase text-[10px]">Date of Conferral</p>
                        <p className="text-slate-900 font-bold mt-0.5">{verifiedCertificate.issuedAt}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <p className="text-slate-500 font-bold uppercase text-[10px]">Seshat Merkle Root Hash</p>
                      <p className="text-slate-900 font-mono font-bold text-[11px] break-all mt-0.5">
                        {verifiedCertificate.verificationHash || verifiedCertificate.merkleRoot}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">
                      Issuer: <strong>Camus Academic Board</strong>
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" /> Print / Export Diploma
                    </button>
                  </div>

                </div>
              )}

              {verifyStatus === 'error' && (
                <div className="bg-red-50 rounded-2xl border border-red-300 p-6 text-center text-red-950">
                  <p className="text-sm font-black">Certificate Hash Not Found</p>
                  <p className="text-xs mt-1 text-red-800">
                    The requested certificate serial was not found on the active ledger. Please verify the exact ID or contact the Camus Registrar.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: SYLLABUS & MICROLESSON CURRICULUM PREVIEW                        */}
        {/* ========================================================================= */}
        {isSyllabusModalOpen && selectedCourseForSyllabus && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-300 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
              
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-900 border border-blue-300">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 line-clamp-1">
                      {selectedCourseForSyllabus.title}
                    </h3>
                    <p className="text-xs text-slate-700">Course Syllabus & Microlesson Breakdown</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSyllabusModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Curriculum Modules & Microlessons</h4>
                  <div className="space-y-3">
                    {selectedCourseForSyllabus.syllabus.map((mod, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-black text-slate-900">
                            Module {mod.moduleNumber}: {mod.title}
                          </p>
                          <span className="text-[11px] font-bold text-slate-600">{mod.lessons.length} Microlessons</span>
                        </div>
                        <div className="space-y-1 mt-2">
                          {mod.lessons.map(les => (
                            <div key={les.id} className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-white border border-slate-200">
                              <span className="flex items-center gap-2 text-slate-800 font-medium">
                                <Play className="w-3.5 h-3.5 text-blue-600" />
                                {les.title}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">{les.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCourseForSyllabus.studyPack && (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-blue-950">
                        {selectedCourseForSyllabus.studyPack.title}
                      </p>
                      <p className="text-[11px] text-blue-800 mt-0.5">
                        {selectedCourseForSyllabus.studyPack.pageCount} Pages • {selectedCourseForSyllabus.studyPack.fileSize} • Open PDF
                      </p>
                    </div>
                    <button
                      onClick={() => showToast('Downloading course study pack handbook...', 'info')}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Pack
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => setIsSyllabusModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsSyllabusModalOpen(false);
                    handleEnrollCourse(selectedCourseForSyllabus);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-xs"
                >
                  Enroll in this Course
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: FRESH APPLICANT & CORPORATE PARTNER ADMISSION FORM               */}
        {/* ========================================================================= */}
        {isApplicantModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-300 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
              
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-950 border border-blue-300">
                    <Sparkles className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {applicantType === 'corporate_partner' ? 'Corporate Partner Onboarding Portal' : 'Scholar Admission & Grant Portal'}
                    </h3>
                    <p className="text-xs text-slate-700">Immediate matriculation, seat provisioning & grant accreditation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsApplicantModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Applicant Type Pill Switcher */}
              <div className="px-6 pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setApplicantType('individual')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    applicantType === 'individual'
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  Scholar / Student
                </button>
                <button
                  type="button"
                  onClick={() => setApplicantType('corporate_partner')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    applicantType === 'corporate_partner'
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  Corporate / Partner
                </button>
                <button
                  type="button"
                  onClick={() => setApplicantType('nysc')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    applicantType === 'nysc'
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  NYSC Fellow
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="p-6 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Selected Training Track
                  </label>
                  <select
                    value={selectedTrackForApply?.id || ''}
                    onChange={(e) => {
                      const t = applicantTracks.find(tr => tr.id === e.target.value);
                      if (t) setSelectedTrackForApply(t);
                    }}
                    className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm"
                  >
                    {applicantTracks.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.code}: {t.title} ({t.tuition})
                      </option>
                    ))}
                  </select>
                </div>

                {applicantType === 'corporate_partner' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Organization / Enterprise Name *</label>
                    <input
                      type="text"
                      required
                      value={applicantForm.organizationName}
                      onChange={(e) => setApplicantForm({ ...applicantForm, organizationName: e.target.value })}
                      placeholder="e.g. FingerMobile Merchant Guild / Acquired Enterprise"
                      className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {applicantType === 'corporate_partner' ? 'Authorized Representative Name *' : 'Full Legal Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantForm.fullName}
                    onChange={(e) => setApplicantForm({ ...applicantForm, fullName: e.target.value })}
                    placeholder="e.g. Mbah Israel Obinna"
                    className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Corporate or Personal Email *</label>
                    <input
                      type="email"
                      required
                      value={applicantForm.email}
                      onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                      placeholder="scholar@example.com"
                      className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={applicantForm.phone}
                      onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {(applicantType === 'individual' || applicantType === 'nysc') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Education Level</label>
                      <select
                        value={applicantForm.educationLevel}
                        onChange={(e) => setApplicantForm({ ...applicantForm, educationLevel: e.target.value })}
                        className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm"
                      >
                        <option value="Secondary School">Secondary / High School</option>
                        <option value="Undergraduate">Undergraduate Student</option>
                        <option value="Graduate">University Graduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Professional">Working Professional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">NYSC Call-Up No. (If applicable)</label>
                      <input
                        type="text"
                        value={applicantForm.nyscCallUpNumber}
                        onChange={(e) => setApplicantForm({ ...applicantForm, nyscCallUpNumber: e.target.value })}
                        placeholder="NYSC/2026/XXXXXX"
                        className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm font-mono"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {applicantType === 'corporate_partner' ? 'Onboarding Requirements / Team Size' : 'Statement of Purpose / Goals'}
                  </label>
                  <textarea
                    rows={3}
                    value={applicantForm.statementOfPurpose}
                    onChange={(e) => setApplicantForm({ ...applicantForm, statementOfPurpose: e.target.value })}
                    placeholder="Briefly state your learning objectives, partner requirements, or team scale..."
                    className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl text-sm"
                  ></textarea>
                </div>

                <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950">
                  <p className="font-bold flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-700" /> Automatic Provisioning & Scholarship Grant:
                  </p>
                  <p className="text-[11px] text-blue-900 mt-1">
                    Registration creates immediate database credentials and accredits +{selectedTrackForApply?.scholarshipGrantFIC || 500} FIC tokens to cover study materials and team onboarding passes.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApplicantModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {applying ? 'Confirming Onboarding...' : 'Confirm Registration & Activate'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: IMMERSIVE MICROLESSON STUDY DESK & QUIZ LAB                      */}
        {/* ========================================================================= */}
        {isStudyDeskOpen && activeStudyCourse && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white rounded-3xl max-w-6xl w-full border border-slate-300 shadow-2xl max-h-[94vh] flex flex-col overflow-hidden animate-fadeIn">
              
              {/* Study Desk Clean Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-white text-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-xs">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">
                        {activeStudyCourse.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-950 border border-blue-300">
                        Microlesson Studio
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Module {activeLessonIndex.module + 1} of {activeStudyCourse.syllabus.length} · Lesson {activeLessonIndex.lesson + 1}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsStudyDeskOpen(false)}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Study Desk Split Body */}
              <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left: Video Player, Notes & Camus Intelligence Assistant (8 cols) */}
                <div className="lg:col-span-8 p-5 sm:p-6 overflow-y-auto border-r border-slate-200 space-y-5">
                  
                  {/* Masterclass Video & Microlesson Player */}
                  <div className="w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center text-white border border-slate-800 shadow-xl group">
                    
                    <button
                      type="button"
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      aria-label={isPlayingVideo ? "Pause microlesson video" : "Play microlesson video"}
                      className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-blue-600/30"
                    >
                      {isPlayingVideo ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                    </button>

                    <p className="text-xs font-bold text-slate-300 mt-4 tracking-wide">
                      Camus High-Definition Stream (1080p 60fps)
                    </p>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {activeStudyCourse.syllabus[activeLessonIndex.module]?.lessons[activeLessonIndex.lesson]?.title || 'Interactive Microlesson'}
                    </span>

                    {/* Video Player Controls Ribbon */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-3 flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-mono text-[11px]">04:12 / 18:30</span>
                        <div className="w-24 sm:w-48 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-1/4"></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={lessonPlaybackSpeed}
                          onChange={(e) => setLessonPlaybackSpeed(e.target.value)}
                          className="bg-slate-800 text-white text-[11px] font-bold rounded px-1.5 py-0.5 border border-slate-700"
                        >
                          <option value="1.0x">1.0x</option>
                          <option value="1.25x">1.25x</option>
                          <option value="1.5x">1.5x</option>
                        </select>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] border border-blue-500/40">HD</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Lesson Header & Complete Action */}
                  {(() => {
                    const currentMod = activeStudyCourse.syllabus[activeLessonIndex.module] || activeStudyCourse.syllabus[0];
                    const currentLes = currentMod?.lessons[activeLessonIndex.lesson] || currentMod?.lessons[0];
                    const isLessonDone = activeEnrollment?.completedLessons.includes(currentLes?.id || '');

                    return (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                          <div>
                            <h4 className="text-lg font-black text-slate-900">
                              {currentLes?.title || 'Interactive Lesson'}
                            </h4>
                            <p className="text-xs text-slate-700 font-mono mt-0.5">
                              Duration: {currentLes?.duration} • Format: {currentLes?.type.toUpperCase()} • Module {currentMod?.moduleNumber}
                            </p>
                          </div>

                          <button
                            onClick={() => currentLes && handleCompleteLesson(currentLes.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xs ${
                              isLessonDone
                                ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                                : 'bg-blue-700 text-white hover:bg-blue-800'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {isLessonDone ? 'Milestone Completed' : 'Mark Lesson Completed'}
                          </button>
                        </div>

                        {/* Interactive Lecture Notes & Code Snippet */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Lesson Highlights & Architecture Notes
                          </h5>
                          <p className="text-xs text-slate-800 leading-relaxed font-medium">
                            This microlesson covers core protocol primitives, deterministic state machines, and cryptographic verification pipelines. Complete the module quiz on the right to lock in your mastery score and advance toward your graduation diploma.
                          </p>
                        </div>

                        {/* Camus Intelligence In-Lesson Assistant */}
                        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-blue-700" />
                            <span className="text-xs font-black text-blue-950">
                              Ask Camus Intelligence About This Microlesson
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={lessonCopilotPrompt}
                              onChange={(e) => setLessonCopilotPrompt(e.target.value)}
                              placeholder="e.g., Explain the difference between BFT and PoS in 1 sentence..."
                              className="flex-1 px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <button
                              onClick={() => {
                                if (!lessonCopilotPrompt.trim()) return;
                                setLessonCopilotResponse(
                                  `✨ Camus Intelligence: Regarding "${lessonCopilotPrompt}" — In this lesson, Byzantine fault tolerance guarantees deterministic finality across asynchronous networks with minimal latency, whereas naive PoS relies on probabilistic fork-choice rules.`
                                );
                              }}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors"
                            >
                              Ask AI
                            </button>
                          </div>

                          {lessonCopilotResponse && (
                            <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-blue-950 leading-relaxed animate-fadeIn">
                              {lessonCopilotResponse}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Right: Modules Syllabus & Quiz Lab (4 cols) */}
                <div className="lg:col-span-4 p-5 overflow-y-auto bg-slate-50 space-y-5">
                  
                  {/* Progress Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Course Curriculum
                    </span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      {activeEnrollment?.progressPct || 0}% Completed
                    </span>
                  </div>

                  {/* Modules Accordion */}
                  <div className="space-y-3">
                    {activeStudyCourse.syllabus.map((mod, mIdx) => (
                      <div key={mIdx} className="bg-white rounded-xl border border-slate-300 p-3 shadow-xs">
                        <p className="text-xs font-black text-slate-900 mb-2">
                          M{mod.moduleNumber}: {mod.title}
                        </p>
                        <div className="space-y-1">
                          {mod.lessons.map((les, lIdx) => {
                            const isDone = activeEnrollment?.completedLessons.includes(les.id);
                            const isCurrent = activeLessonIndex.module === mIdx && activeLessonIndex.lesson === lIdx;

                            return (
                              <button
                                key={les.id}
                                onClick={() => setActiveLessonIndex({ module: mIdx, lesson: lIdx })}
                                className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                  isCurrent
                                    ? 'bg-blue-100 text-blue-950 font-black border border-blue-400'
                                    : 'hover:bg-slate-100 text-slate-800'
                                }`}
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  {isDone ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  )}
                                  <span className="truncate">{les.title}</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                                  {les.duration}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quiz Simulator Section */}
                  {activeStudyCourse.quizzes && activeStudyCourse.quizzes.length > 0 && (
                    <div className="bg-white rounded-2xl border border-purple-300 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-purple-700" /> Module Knowledge Check
                        </span>
                        {quizScore !== null && (
                          <span className="text-xs font-black text-emerald-950 bg-emerald-100 border border-emerald-400 px-2.5 py-0.5 rounded-full">
                            Score: {quizScore}%
                          </span>
                        )}
                      </div>

                      <div className="space-y-4">
                        {activeStudyCourse.quizzes[0].questions.map((q) => (
                          <div key={q.id} className="text-xs space-y-1.5">
                            <p className="font-bold text-slate-900">{q.text}</p>
                            <div className="space-y-1">
                              {q.options.map((opt, optIdx) => (
                                <button
                                  key={optIdx}
                                  onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                                  className={`w-full text-left p-2 rounded-lg text-[11px] border transition-colors ${
                                    quizAnswers[q.id] === optIdx
                                      ? 'bg-purple-100 border-purple-400 font-bold text-purple-950'
                                      : 'border-slate-200 text-slate-800 hover:bg-slate-50'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => {
                            const quiz = activeStudyCourse.quizzes![0];
                            let correct = 0;
                            quiz.questions.forEach(q => {
                              if (quizAnswers[q.id] === q.correctIndex) correct++;
                            });
                            const score = Math.round((correct / quiz.questions.length) * 100);
                            setQuizScore(score);
                            setQuizSubmitted(true);
                            showToast(`Quiz submitted! Your score is ${score}%`, score >= 75 ? 'success' : 'info');
                          }}
                          className="w-full mt-2 py-2 rounded-xl text-xs font-black text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-xs"
                        >
                          Submit Quiz Answers
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Study Desk Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">
                  Enrollment ID: <strong className="font-mono text-slate-900">{activeEnrollment?.id || 'enr-local'}</strong>
                </span>
                <button
                  onClick={() => setIsStudyDeskOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-200 hover:bg-slate-300 transition-colors"
                >
                  Save Progress & Exit Desk
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: OPEN EDUCATIONAL RESOURCE (OER) IN-BROWSER READER                */}
        {/* ========================================================================= */}
        {readingResource && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-300 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
              
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-950 border border-blue-400">
                    <BookMarked className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 line-clamp-1">
                      {readingResource.title}
                    </h3>
                    <p className="text-xs text-slate-700">Author: {readingResource.author} · {readingResource.pages} Pages</p>
                  </div>
                </div>
                <button
                  onClick={() => setReadingResource(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span>License: <strong>{readingResource.license}</strong></span>
                  <span>Category: <strong>{readingResource.category}</strong></span>
                  <span>Size: <strong>{readingResource.fileSize}</strong></span>
                </div>

                <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3">
                  <h4 className="text-base font-black text-slate-900">Executive Summary & Table of Contents</h4>
                  <p>
                    This open educational monograph has been vetted and curated by the Camus Academic Guild for use across undergraduate, graduate, and vocational training initiatives.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 font-medium text-slate-800">
                    <li>Chapter 1: Foundational Theoretical Frameworks & State Machines</li>
                    <li>Chapter 2: Cryptographic Hash Verification & Merkle DAG Traversal</li>
                    <li>Chapter 3: Asynchronous Network Protocols & Failure Modes</li>
                    <li>Chapter 4: Scalable Consensus Mechanisms & Real-World Case Studies</li>
                  </ul>
                  <p>
                    Scholars can access the complete original edition from the official open repository link below.
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => setReadingResource(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900"
                >
                  Close Reader
                </button>
                <a
                  href={readingResource.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" /> Open Full Book at Source
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default CamusPage;
