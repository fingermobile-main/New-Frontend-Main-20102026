import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  GraduationCap,
  Users,
  BookOpen,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  Lock,
  Globe,
  Settings,
  TrendingUp,
  FileText,
  UserCheck,
  Tag,
  RefreshCw,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { CAMUS_COURSE_BUNDLES, CAMUS_SUBSCRIPTION_PLANS, CAMUS_COURSES } from '../../constants/camusConstants';

interface Department {
  id: string;
  name: string;
  school: 'School of Arts & Social Sciences' | 'School of Technology & Business Administration';
  headOfDepartment: string;
  enrolledStudents: number;
  programsOffered: string[];
  activeGrants: string;
}

const DEPARTMENTS_DATA: Department[] = [
  {
    id: 'dept-lit',
    name: 'Literature, Languages & Cultural Narratives',
    school: 'School of Arts & Social Sciences',
    headOfDepartment: 'Dr. Clara Achebe',
    enrolledStudents: 1420,
    programsOffered: ['BA in World Literatures', 'MA in Cultural Narrative Theory', 'Ph.D. in African Postcolonial Discourse'],
    activeGrants: '14,500 FIC (Pan-African Archive Fellowship)'
  },
  {
    id: 'dept-pol',
    name: 'Political Science, Governance & Sovereign Law',
    school: 'School of Arts & Social Sciences',
    headOfDepartment: 'Dr. Evelyn Sterling',
    enrolledStudents: 1890,
    programsOffered: ['BA in Political Philosophy', 'MSc in Digital Constitutionalism', 'Doctoral Colloquium in Sovereign Jurisprudence'],
    activeGrants: '22,000 FIC (Digital Rights Research Fund)'
  },
  {
    id: 'dept-econ',
    name: 'Macroeconomics, Development & Trade',
    school: 'School of Arts & Social Sciences',
    headOfDepartment: 'Prof. Adeyemi Olatunji',
    enrolledStudents: 2150,
    programsOffered: ['BA in Economics', 'MSc in Development Finance', 'Ph.D. in Macroeconomic Modeling'],
    activeGrants: '30,000 FIC (Continental Free Trade Policy Lab)'
  },
  {
    id: 'dept-soc',
    name: 'Sociology, Anthropology & Human Geography',
    school: 'School of Arts & Social Sciences',
    headOfDepartment: 'Dr. Marcus Vance',
    enrolledStudents: 1680,
    programsOffered: ['BA in Applied Sociology', 'MSc in Urban Environmental Geography', 'Ph.D. in Social Anthropology'],
    activeGrants: '18,500 FIC (Decentralized Community Mapping)'
  },
  {
    id: 'dept-arts',
    name: 'Visual Arts, Musicology & Theatre Performance',
    school: 'School of Arts & Social Sciences',
    headOfDepartment: 'Maitland Ross & Prof. Amina Bello',
    enrolledStudents: 1100,
    programsOffered: ['BA in Performing Arts', 'MA in Digital Musicology', 'Indigenous Orality Archive'],
    activeGrants: '12,000 FIC (Acoustic Signal & Soundscapes Lab)'
  },
  {
    id: 'dept-tech',
    name: 'Computer Science, Cryptography & Systems Engineering',
    school: 'School of Technology & Business Administration',
    headOfDepartment: 'Dr. Sarah Williams',
    enrolledStudents: 3450,
    programsOffered: ['BSc in Distributed Systems', 'MSc in Cryptographic Engineering', 'Postgraduate Diploma in Cloud Architecture'],
    activeGrants: '45,000 FIC (Sovereign Decentralized Cloud Infrastructure)'
  }
];

interface PendingInstructor {
  id: string;
  name: string;
  email: string;
  faculty: string;
  credentials: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const PENDING_INSTRUCTORS_DATA: PendingInstructor[] = [
  {
    id: 'inst-app-1',
    name: 'Dr. Fatima Diallo',
    email: 'f.diallo@alumni.camus.edu',
    faculty: 'School of Arts & Social Sciences (Anthropology)',
    credentials: 'Ph.D. Anthropology (Sorbonne), 14 peer-reviewed publications',
    appliedDate: '2026-10-18',
    status: 'pending'
  },
  {
    id: 'inst-app-2',
    name: 'Prof. Obinna Nwosu',
    email: 'o.nwosu@research.org',
    faculty: 'School of Arts & Social Sciences (Development Economics)',
    credentials: 'MSc Oxford, 12 years World Bank technical consultant',
    appliedDate: '2026-10-16',
    status: 'pending'
  },
  {
    id: 'inst-app-3',
    name: 'Eng. Kwame Mensah',
    email: 'kwame@soliditylabs.io',
    faculty: 'School of Technology & Business Administration',
    credentials: 'Lead Architect @ Core Protocol, P2P Consensus Specialist',
    appliedDate: '2026-10-14',
    status: 'pending'
  }
];

const CamusAdminDashboard: React.FC = () => {
  const { showToast } = useAppContext();
  const [adminTab, setAdminTab] = useState<
    'deanery' | 'bundles_subscriptions' | 'instructors_marketplace' | 'ecommerce_monetization' | 'security_compliance' | 'reports_analytics'
  >('deanery');

  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS_DATA);
  const [instructors, setInstructors] = useState<PendingInstructor[]>(PENDING_INSTRUCTORS_DATA);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<'all' | 'arts' | 'tech'>('all');

  // eCommerce settings state
  const [defaultCommissionRate, setDefaultCommissionRate] = useState('80');
  const [copyProtectionEnabled, setCopyProtectionEnabled] = useState(true);
  const [hotlinkShieldEnabled, setHotlinkShieldEnabled] = useState(true);
  const [sessionLimit, setSessionLimit] = useState('2');

  // Coupon state
  const [coupons, setCoupons] = useState([
    { code: 'ARTS2026', discountPercent: 25, faculty: 'School of Arts & Social Sciences', active: true, uses: 142 },
    { code: 'SCHOLARSHIP50', discountPercent: 50, faculty: 'All Programs', active: true, uses: 89 },
    { code: 'NYSC_EMPOWER', discountPercent: 100, faculty: 'All Programs', active: true, uses: 412 }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('20');

  const handleApproveInstructor = (id: string, name: string) => {
    setInstructors(
      instructors.map((inst) => (inst.id === id ? { ...inst, status: 'approved' } : inst))
    );
    showToast(`Approved ${name} as Validated Faculty Instructor!`, 'success');
  };

  const handleRejectInstructor = (id: string, name: string) => {
    setInstructors(
      instructors.map((inst) => (inst.id === id ? { ...inst, status: 'rejected' } : inst))
    );
    showToast(`Application for ${name} declined.`, 'info');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    setCoupons([
      ...coupons,
      {
        code: newCouponCode.toUpperCase(),
        discountPercent: parseInt(newCouponDiscount) || 20,
        faculty: 'All Programs',
        active: true,
        uses: 0
      }
    ]);
    setNewCouponCode('');
    showToast(`Coupon code ${newCouponCode.toUpperCase()} activated!`, 'success');
  };

  const filteredDepartments = departments.filter((dept) => {
    if (selectedSchoolFilter === 'arts') return dept.school === 'School of Arts & Social Sciences';
    if (selectedSchoolFilter === 'tech') return dept.school === 'School of Technology & Business Administration';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Admin Console Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                University Governance Console
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
                ODL Accreditation Tier 1
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              CAMUS University Administrator Console
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Oversight for the School of Arts & Social Sciences, School of Technology & Business Administration, course bundles, marketplace commission allocation, content security, and institutional subscriptions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Platform Reserve</div>
              <div className="text-xl font-black font-mono text-emerald-400">184,200 FIC</div>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800 pt-4">
          {[
            { id: 'deanery', label: 'School of Arts & Social Sciences', icon: <Building className="w-4 h-4" /> },
            { id: 'bundles_subscriptions', label: 'Course Bundles & Subscriptions', icon: <Package className="w-4 h-4" /> },
            { id: 'instructors_marketplace', label: 'Instructor Marketplace & Validation', icon: <UserCheck className="w-4 h-4" /> },
            { id: 'ecommerce_monetization', label: 'Native eCommerce & Coupons', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'security_compliance', label: 'Content Security & Protection', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'reports_analytics', label: 'University Reports & Telemetry', icon: <BarChart3 className="w-4 h-4" /> }
          ].map((tab) => {
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: ACADEMIC DEANERY & SCHOOL OF ARTS & SOCIAL SCIENCES */}
      {adminTab === 'deanery' && (
        <div className="space-y-6">
          {/* Institutional Overview Cards */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/40 p-6 rounded-3xl border border-blue-200 dark:border-blue-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase bg-blue-200 text-blue-950 px-2 py-0.5 rounded font-black">
                Deanery Charter
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                School of Arts & Social Sciences Academic Council
              </h3>
              <p className="text-xs text-slate-700 max-w-3xl leading-relaxed">
                Encompassing disciplines focused on the study of human society, culture, and behavior: Literature, Languages, History, Music, Theatre, Visual Arts, Sociology, Psychology, Economics, Political Science, Anthropology, and Geography. Offering BA, Master's, and Doctoral degrees, interdisciplinary studies, research grants, and experiential learning.
              </p>
            </div>

            {/* School Filter Toggle */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-slate-300 dark:border-gray-700 shrink-0">
              <button
                onClick={() => setSelectedSchoolFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedSchoolFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                All Schools
              </button>
              <button
                onClick={() => setSelectedSchoolFilter('arts')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedSchoolFilter === 'arts' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Arts & Social Sciences
              </button>
              <button
                onClick={() => setSelectedSchoolFilter('tech')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedSchoolFilter === 'tech' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Technology & Business
              </button>
            </div>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 p-6 shadow-xs flex flex-col justify-between hover:border-blue-400 transition"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {dept.school}
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                        {dept.name}
                      </h4>
                    </div>
                    <GraduationCap className="w-5 h-5 text-blue-600 shrink-0" />
                  </div>

                  <div className="text-xs text-slate-800 space-y-1 bg-slate-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-slate-200 dark:border-gray-700">
                    <div><strong className="text-slate-900">Head of Department:</strong> {dept.headOfDepartment}</div>
                    <div><strong className="text-slate-900">Scholars Enrolled:</strong> {dept.enrolledStudents.toLocaleString()}</div>
                    <div><strong className="text-slate-900">Active Grants:</strong> <span className="text-emerald-800 font-bold">{dept.activeGrants}</span></div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Accredited Degree Programs:
                    </div>
                    <ul className="text-xs text-slate-800 space-y-1 list-disc list-inside">
                      {dept.programsOffered.map((prog, pIdx) => (
                        <li key={pIdx} className="truncate">{prog}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between">
                  <button
                    onClick={() => showToast(`Opening curriculum auditor for ${dept.name}`, 'info')}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800"
                  >
                    Manage Curriculum →
                  </button>
                  <button
                    onClick={() => showToast(`Allocated 5,000 FIC research grant to ${dept.name}`, 'success')}
                    className="px-3 py-1 bg-emerald-100 text-emerald-950 border border-emerald-400 text-[11px] font-bold rounded-lg hover:bg-emerald-200 transition"
                  >
                    + Grant Funds
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COURSE BUNDLES & SUBSCRIPTIONS */}
      {adminTab === 'bundles_subscriptions' && (
        <div className="space-y-6">
          {/* Subscriptions Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Built-In Subscriptions Architecture
                </h3>
                <p className="text-xs text-slate-700 mt-1">
                  Manage recurring automated revenue plans across individual scholars and partner universities.
                </p>
              </div>
              <button
                onClick={() => showToast('Subscription Plan Configurator modal opened', 'info')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                + Create Subscription Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CAMUS_SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="border border-slate-300 dark:border-gray-700 rounded-3xl p-6 bg-slate-50/50 dark:bg-gray-800/30 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {plan.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-bold text-[10px] uppercase">
                        {plan.badge}
                      </span>
                    )}
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {plan.name}
                    </h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {plan.priceFic} FIC
                      </span>
                      <span className="text-xs text-slate-700">/{plan.billingPeriod}</span>
                    </div>

                    <ul className="text-xs text-slate-800 space-y-2 pt-2">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">Active In Production</span>
                    <button
                      onClick={() => showToast(`Updated configuration for ${plan.name}`, 'info')}
                      className="px-3 py-1 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-lg hover:bg-slate-100"
                    >
                      Edit Pricing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Bundles Catalog */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Packaged Course Bundles (Integrated Degree Tracks)
                </h3>
                <p className="text-xs text-slate-700 mt-1">
                  Bundle related courses into coherent academic degree paths with discounted multi-course pricing.
                </p>
              </div>
              <button
                onClick={() => showToast('Course Bundle Creator opened', 'info')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                + New Course Bundle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CAMUS_COURSE_BUNDLES.map((bundle) => (
                <div
                  key={bundle.id}
                  className="border border-slate-300 dark:border-gray-700 rounded-3xl p-6 bg-white dark:bg-gray-800 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      {bundle.faculty}
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {bundle.title}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {bundle.description}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xl font-black font-mono text-emerald-800 dark:text-emerald-400">
                        {bundle.bundlePrice} FIC
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        {bundle.regularPrice} FIC
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 text-[10px] font-bold">
                        Save {bundle.savingsPercentage}%
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 pt-2 space-y-1">
                      <div><strong className="text-slate-900">Curriculum:</strong> {bundle.courseCount} Courses ({bundle.totalHours} hours)</div>
                      <div><strong className="text-slate-900">Award:</strong> {bundle.level}</div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between">
                    <button
                      onClick={() => showToast(`Bundle ${bundle.title} status synced`, 'info')}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-800"
                    >
                      Audit Bundled Courses →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INSTRUCTOR MARKETPLACE & VALIDATION */}
      {adminTab === 'instructors_marketplace' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Pending Lecturer Applications & Faculty Accreditation
                </h3>
                <p className="text-xs text-slate-700 mt-0.5">
                  Review applicant credentials before granting publishing authority and marketplace commission access.
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-950 border border-blue-400 text-xs font-bold rounded-full">
                3 Pending Review
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-gray-800">
              {instructors.map((inst) => (
                <div key={inst.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-gray-800/40 transition">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {inst.name}
                      </h4>
                      <span className="text-xs text-slate-600 font-mono">({inst.email})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inst.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                          : inst.status === 'rejected'
                          ? 'bg-rose-100 text-rose-950 border border-rose-400'
                          : 'bg-amber-100 text-amber-950 border border-amber-400'
                      }`}>
                        {inst.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                      {inst.faculty}
                    </div>
                    <div className="text-xs text-slate-800">
                      <strong>Verified Credentials:</strong> {inst.credentials}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Applied: {inst.appliedDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {inst.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveInstructor(inst.id, inst.name)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve Faculty
                        </button>
                        <button
                          onClick={() => handleRejectInstructor(inst.id, inst.name)}
                          className="px-4 py-2 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-100 transition flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-slate-700">Decision Recorded</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NATIVE ECOMMERCE & MONETIZATION */}
      {adminTab === 'ecommerce_monetization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue & Commission Configuration */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Monetization & Commission Allocation Rules
              </h3>
              <p className="text-xs text-slate-700">
                Configure global revenue-split between instructors and the university ODL infrastructure reserve.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Standard Faculty Commission Share (%)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={defaultCommissionRate}
                      onChange={(e) => setDefaultCommissionRate(e.target.value)}
                      className="w-32 text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-4 py-2 text-xs"
                    />
                    <span className="text-xs text-slate-700">
                      Instructor receives {defaultCommissionRate}%, Platform retains {100 - parseInt(defaultCommissionRate || '80')}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Supported Payment & Settlement Gateways
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-800">
                    <div className="p-3 bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 flex items-center gap-2 font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      FingerMobile FIC (0% gas)
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 flex items-center gap-2 font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Direct Bank Clearing
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 flex items-center gap-2 font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      PayPal & Card Gateways
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 flex items-center gap-2 font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      eCheck & Bank Wire
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Monetization settings saved successfully!', 'success')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Save Global Monetization Rules
                </button>
              </div>
            </div>

            {/* Coupons & Promo Engine */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Discount Coupon & Voucher Engine
              </h3>
              <p className="text-xs text-slate-700">
                Issue targeted promo vouchers for NYSC scholars, secondary school transition grants, and institutional subsidies.
              </p>

              <form onSubmit={handleCreateCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="COUPON CODE"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-4 py-2 text-xs uppercase"
                />
                <input
                  type="number"
                  placeholder="%"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="w-20 text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shrink-0"
                >
                  + Add
                </button>
              </form>

              <div className="space-y-2 pt-2">
                {coupons.map((c, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{c.code}</span>
                      <span className="ml-2 text-slate-700 font-medium">({c.discountPercent}% Off • {c.faculty})</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-800 font-bold">
                      {c.uses} redemptions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTENT SECURITY & COMPLIANCE */}
      {adminTab === 'security_compliance' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Tutor LMS Content Security & Intellectual Property Safeguards
          </h3>
          <p className="text-xs text-slate-700">
            Enforce anti-piracy protections, DRM video streaming, active session restrictions, and blockchain certificate validation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 dark:border-gray-700 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Copy Protection Shield</h4>
                  <p className="text-[11px] text-slate-700">Disable right-click copy and inspect-element scraping on curriculum text.</p>
                </div>
                <input
                  type="checkbox"
                  checked={copyProtectionEnabled}
                  onChange={(e) => setCopyProtectionEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border border-slate-200 dark:border-gray-700 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Hotlink Video Prevention</h4>
                  <p className="text-[11px] text-slate-700">Prevent external domains from embedding or hotlinking Bunny Stream CDN media.</p>
                </div>
                <input
                  type="checkbox"
                  checked={hotlinkShieldEnabled}
                  onChange={(e) => setHotlinkShieldEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border border-slate-200 dark:border-gray-700 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Concurrent Login Session Limit</h4>
                  <p className="text-[11px] text-slate-700">Maximum devices allowed per scholar account to prevent credential sharing.</p>
                </div>
                <select
                  value={sessionLimit}
                  onChange={(e) => setSessionLimit(e.target.value)}
                  className="text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3 py-1 text-xs"
                >
                  <option value="1">1 Device (Strict)</option>
                  <option value="2">2 Devices (Standard)</option>
                  <option value="3">3 Devices (Relaxed)</option>
                </select>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-gray-700 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Cryptographic Certificate Verification</h4>
                  <p className="text-[11px] text-slate-700">Anchor student graduation credentials directly to the FingerMobile Permanence Merkle tree.</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold text-[10px]">
                  Enforced
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => showToast('Security policies applied to all nodes!', 'success')}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-black transition"
            >
              Update Security Policies
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: REPORTS & ANALYTICS */}
      {adminTab === 'reports_analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-slate-300 dark:border-gray-800 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Enrolled Scholars</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">11,690</div>
              <span className="text-[11px] text-emerald-800 font-bold">↑ 18% YoY growth</span>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-slate-300 dark:border-gray-800 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Course Completion Rate</span>
              <div className="text-2xl font-black font-mono text-blue-700 dark:text-blue-400 mt-1">87.4%</div>
              <span className="text-[11px] text-slate-700">Across 6 academic faculties</span>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-slate-300 dark:border-gray-800 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Certificates Issued</span>
              <div className="text-2xl font-black font-mono text-purple-700 dark:text-purple-400 mt-1">6,840</div>
              <span className="text-[11px] text-slate-700">100% Merkle verified</span>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-slate-300 dark:border-gray-800 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Faculty Payouts Settled</span>
              <div className="text-2xl font-black font-mono text-emerald-800 dark:text-emerald-400 mt-1">147,360 FIC</div>
              <span className="text-[11px] text-slate-700">0 dispute rate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CamusAdminDashboard;
