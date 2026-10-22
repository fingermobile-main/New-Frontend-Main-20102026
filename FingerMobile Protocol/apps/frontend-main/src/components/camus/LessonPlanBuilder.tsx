import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Download,
  Share2,
  Save,
  Layers,
  GraduationCap,
  Bot,
  RefreshCw,
  FileText,
  Video,
  HelpCircle,
  Award,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';

export interface LessonPhase {
  id: string;
  name: string;
  durationMinutes: number;
  description: string;
  activities: string[];
  materials: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  school: 'School of Arts & Social Sciences' | 'School of Technology & Business Administration';
  department: string;
  courseCode: string;
  targetLevel: string;
  totalDuration: number;
  bloomsTaxonomyLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  learningObjectives: string[];
  prerequisites: string;
  phases: LessonPhase[];
  assessmentStrategy: string;
  multimediaUrl?: string;
  homeworkOrNextSteps: string;
  createdAt: string;
}

const DEFAULT_LESSON_PLAN: LessonPlan = {
  id: 'lp-demo-01',
  title: 'Constitutional Law, Civil Liberties & Digital Governance',
  school: 'School of Arts & Social Sciences',
  department: 'Political Science & Legal Studies',
  courseCode: 'POL-302',
  targetLevel: 'Undergraduate (BA 3rd Year)',
  totalDuration: 60,
  bloomsTaxonomyLevel: 'Analyze',
  learningObjectives: [
    'Analyze the fundamental principles of constitutional separation of powers in digital-first democracies.',
    'Evaluate judicial precedents protecting freedom of expression against algorithmic censorship.',
    'Formulate a policy brief addressing citizen privacy rights within sovereign decentralized identity protocols.'
  ],
  prerequisites: 'Introduction to Political Theory (POL-101) & Principles of Legal Philosophy',
  phases: [
    {
      id: 'phase-1',
      name: '1. Anticipatory Hook & Prior Knowledge Check',
      durationMinutes: 10,
      description: 'Engage students with a real-world case study on cross-border digital identity regulation.',
      activities: [
        'Poll question: Are digital rights fundamental human rights?',
        'Quick 3-minute video hook examining constitutional precedents.'
      ],
      materials: 'Interactive poll widget, 3-minute video briefing'
    },
    {
      id: 'phase-2',
      name: '2. Direct Instruction & Conceptual Architecture',
      durationMinutes: 20,
      description: 'Lecture and legal framework breakdown by faculty lead.',
      activities: [
        'Examination of constitutional court rulings and statutory frameworks.',
        'Contrast between traditional judicial review and automated compliance audits.'
      ],
      materials: 'Interactive slide deck, statutory excerpt PDF'
    },
    {
      id: 'phase-3',
      name: '3. Guided Discussion & Collaborative Case Analysis',
      durationMinutes: 15,
      description: 'Small group breakout examining simulated appellate court arguments.',
      activities: [
        'Breakout discussion in groups of 3-4 scholars.',
        'Drafting a 3-point legal defense for citizen data sovereignty.'
      ],
      materials: 'Case study brief #4, shared collaborative pad'
    },
    {
      id: 'phase-4',
      name: '4. Independent Synthesis & Knowledge Check',
      durationMinutes: 10,
      description: 'Individual assessment and reflection quiz.',
      activities: [
        '3-question timed knowledge check quiz on lesson objectives.',
        'Submission of 100-word critical legal reflection.'
      ],
      materials: 'In-app quiz simulator'
    },
    {
      id: 'phase-5',
      name: '5. Synthesis, Exit Ticket & Capstone Link',
      durationMinutes: 5,
      description: 'Wrap-up, Q&A clarification, and preview of upcoming comparative governance seminar.',
      activities: [
        'Summary takeaways recap by instructor.',
        'Release of next module study pack.'
      ],
      materials: 'Downloadable syllabus pack'
    }
  ],
  assessmentStrategy: 'Formative quiz validation (75% passing threshold) + peer-reviewed legal brief submission',
  multimediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  homeworkOrNextSteps: 'Review Chapter 4 of the OER Constitutional Law Monograph and prepare a 500-word brief for Seminar 6.',
  createdAt: new Date().toISOString()
};

export const LessonPlanBuilder: React.FC = () => {
  const [plan, setPlan] = useState<LessonPlan>(DEFAULT_LESSON_PLAN);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Add objective
  const handleAddObjective = () => {
    setPlan({
      ...plan,
      learningObjectives: [...plan.learningObjectives, '']
    });
  };

  // Update objective
  const handleUpdateObjective = (index: number, val: string) => {
    const updated = [...plan.learningObjectives];
    updated[index] = val;
    setPlan({ ...plan, learningObjectives: updated });
  };

  // Remove objective
  const handleRemoveObjective = (index: number) => {
    setPlan({
      ...plan,
      learningObjectives: plan.learningObjectives.filter((_, idx) => idx !== index)
    });
  };

  // Update Phase
  const handleUpdatePhase = (index: number, field: keyof LessonPhase, val: any) => {
    const updated = [...plan.phases];
    updated[index] = { ...updated[index], [field]: val };
    const totalMins = updated.reduce((acc, p) => acc + (Number(p.durationMinutes) || 0), 0);
    setPlan({ ...plan, phases: updated, totalDuration: totalMins });
  };

  // Add Phase
  const handleAddPhase = () => {
    const newPhase: LessonPhase = {
      id: `phase-${Date.now()}`,
      name: `Phase ${plan.phases.length + 1}: Interactive Step`,
      durationMinutes: 10,
      description: 'Describe instructional strategy and scholar engagement.',
      activities: ['Active learning exercise'],
      materials: 'Lecture notes / Slides'
    };
    const updated = [...plan.phases, newPhase];
    const totalMins = updated.reduce((acc, p) => acc + (Number(p.durationMinutes) || 0), 0);
    setPlan({ ...plan, phases: updated, totalDuration: totalMins });
  };

  // Remove Phase
  const handleRemovePhase = (index: number) => {
    const updated = plan.phases.filter((_, idx) => idx !== index);
    const totalMins = updated.reduce((acc, p) => acc + (Number(p.durationMinutes) || 0), 0);
    setPlan({ ...plan, phases: updated, totalDuration: totalMins });
  };

  // Generative AI Lesson Plan Generator
  const handleGenerateWithAI = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const isArts = aiPrompt.toLowerCase().includes('art') ||
        aiPrompt.toLowerCase().includes('literature') ||
        aiPrompt.toLowerCase().includes('sociology') ||
        aiPrompt.toLowerCase().includes('history') ||
        aiPrompt.toLowerCase().includes('music') ||
        aiPrompt.toLowerCase().includes('philosophy') ||
        aiPrompt.toLowerCase().includes('political') ||
        aiPrompt.toLowerCase().includes('economics');

      const generatedPlan: LessonPlan = {
        id: `lp-ai-${Date.now()}`,
        title: aiPrompt.trim(),
        school: isArts ? 'School of Arts & Social Sciences' : 'School of Technology & Business Administration',
        department: isArts ? 'Arts, Humanities & Social Studies' : 'Applied Science & Technology Management',
        courseCode: isArts ? 'ART-204' : 'TECH-305',
        targetLevel: 'Undergraduate & Professional',
        totalDuration: 45,
        bloomsTaxonomyLevel: 'Apply',
        learningObjectives: [
          `Define and contextualize the fundamental frameworks of "${aiPrompt.trim()}".`,
          'Synthesize core theoretical arguments through practical workshop activities.',
          'Demonstrate competency via interactive quiz simulation and peer feedback.'
        ],
        prerequisites: 'Fundamental foundational introductory course completion',
        phases: [
          {
            id: 'phase-ai-1',
            name: '1. Warm-up & Conceptual Provocation',
            durationMinutes: 5,
            description: 'Open discussion and live pulse check to activate prior knowledge.',
            activities: ['Quick 2-minute diagnostic question', 'Case-study teaser'],
            materials: 'Digital whiteboard / Live forum'
          },
          {
            id: 'phase-ai-2',
            name: '2. Core Instructional Microlesson',
            durationMinutes: 20,
            description: 'Deep dive into syllabus principles, empirical evidence, and methodology.',
            activities: ['Instructor lecture & slide presentation', 'Live code/text walk-through'],
            materials: 'Curriculum slides, digital textbook excerpt'
          },
          {
            id: 'phase-ai-3',
            name: '3. Hands-on Guided Lab',
            durationMinutes: 15,
            description: 'Scholars complete a guided exercise reinforcing the core concepts.',
            activities: ['Interactive terminal / essay prompt', 'Peer review discussion'],
            materials: 'Camus interactive workbook'
          },
          {
            id: 'phase-ai-4',
            name: '4. Summary & Verification Check',
            durationMinutes: 5,
            description: 'Exit ticket and mastery confirmation.',
            activities: ['3-question knowledge check', 'Module completion badge awarded'],
            materials: 'In-app quiz evaluator'
          }
        ],
        assessmentStrategy: 'Automated knowledge check quiz + active class engagement logging',
        homeworkOrNextSteps: 'Review assigned reading and prepare discussion points for the upcoming live seminar.',
        createdAt: new Date().toISOString()
      };

      setPlan(generatedPlan);
      setIsGenerating(false);
      setSaveStatus('AI Lesson Plan Generated Successfully!');
      setTimeout(() => setSaveStatus(null), 3500);
    }, 600);
  };

  // Save Plan
  const handleSavePlan = () => {
    try {
      localStorage.setItem(`camus_lesson_plan_${plan.id}`, JSON.stringify(plan));
      setSaveStatus('Lesson Plan Saved to Camus Institutional Repository!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('Saved locally in active session.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-300 shadow-sm overflow-hidden">
      
      {/* Top Banner Header */}
      <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600 text-white">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">
                CAMUS Pedagogical Lesson Plan Builder
              </h2>
              <p className="text-xs text-slate-300">
                Instructional design suite for School of Arts &amp; Social Sciences, Technology &amp; Business Management
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle & Save Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Plan Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Syllabus Preview
            </button>
          </div>

          <button
            onClick={handleSavePlan}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Plan
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="px-6 py-2.5 bg-emerald-100 text-emerald-950 border-b border-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            {saveStatus}
          </span>
          <button type="button" onClick={() => setSaveStatus(null)} className="text-emerald-800 font-bold">×</button>
        </div>
      )}

      {/* AI Generation Quick Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 shrink-0">
            <Bot className="w-4 h-4 text-blue-700" />
            <span>Generate with Camus AI:</span>
          </div>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g., Comparative African Literature & Post-Colonial Identity (45 min lesson)..."
            className="flex-1 w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleGenerateWithAI}
            disabled={isGenerating}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Drafting Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Draft Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN VIEW: EDITOR OR PREVIEW */}
      {activeTab === 'editor' ? (
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* SECTION 1: CORE COURSE & DEPARTMENT METADATA */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-700" /> 1. Institutional Alignment & Course Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Lesson Plan Title *</label>
                <input
                  type="text"
                  value={plan.title}
                  onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Course Code / Catalog ID *</label>
                <input
                  type="text"
                  value={plan.courseCode}
                  onChange={(e) => setPlan({ ...plan, courseCode: e.target.value })}
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Faculty / School</label>
                <select
                  value={plan.school}
                  onChange={(e) => setPlan({ ...plan, school: e.target.value as any })}
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                >
                  <option value="School of Arts & Social Sciences">School of Arts &amp; Social Sciences</option>
                  <option value="School of Technology & Business Administration">School of Technology &amp; Business Administration</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Department / Discipline</label>
                <input
                  type="text"
                  value={plan.department}
                  onChange={(e) => setPlan({ ...plan, department: e.target.value })}
                  placeholder="e.g., Literature, Economics, Sociology, Computer Science"
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Target Academic Level</label>
                <input
                  type="text"
                  value={plan.targetLevel}
                  onChange={(e) => setPlan({ ...plan, targetLevel: e.target.value })}
                  placeholder="e.g., Bachelor of Arts (BA), Master's, Doctoral, NYSC"
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Bloom's Taxonomy Target</label>
                <select
                  value={plan.bloomsTaxonomyLevel}
                  onChange={(e) => setPlan({ ...plan, bloomsTaxonomyLevel: e.target.value as any })}
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                >
                  <option value="Remember">Level 1: Remember (Recall facts)</option>
                  <option value="Understand">Level 2: Understand (Explain ideas)</option>
                  <option value="Apply">Level 3: Apply (Use in new situations)</option>
                  <option value="Analyze">Level 4: Analyze (Draw connections)</option>
                  <option value="Evaluate">Level 5: Evaluate (Justify decisions)</option>
                  <option value="Create">Level 6: Create (Produce new work)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Total Allocated Time</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={plan.totalDuration}
                    onChange={(e) => setPlan({ ...plan, totalDuration: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl font-mono"
                  />
                  <span className="text-slate-700 font-bold">Minutes</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Video Stream / Lecture URL (Optional)</label>
                <input
                  type="text"
                  value={plan.multimediaUrl || ''}
                  onChange={(e) => setPlan({ ...plan, multimediaUrl: e.target.value })}
                  placeholder="https://vimeo.com/... or YouTube"
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: LEARNING OBJECTIVES & PREREQUISITES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700" /> 2. Measurable Learning Outcomes (Objectives)
              </h3>
              <button
                onClick={handleAddObjective}
                className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Objective
              </button>
            </div>

            <div className="space-y-2">
              {plan.learningObjectives.map((obj, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-black text-slate-500">{idx + 1}.</span>
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => handleUpdateObjective(idx, e.target.value)}
                    placeholder="By the end of this lesson, scholars will be able to..."
                    className="flex-1 px-3 py-2 text-xs text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                  />
                  {plan.learningObjectives.length > 1 && (
                    <button type="button" aria-label="Delete"
                      onClick={() => handleRemoveObjective(idx)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs">
              <label className="block font-bold text-slate-800 mb-1">Prerequisites & Prior Knowledge</label>
              <input
                type="text"
                value={plan.prerequisites}
                onChange={(e) => setPlan({ ...plan, prerequisites: e.target.value })}
                placeholder="Required prerequisite courses or foundational readings..."
                className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* SECTION 3: PEDAGOGICAL PHASES & TIMELINE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-700" /> 3. Instructional Phases & Timeline Breakdown
                </h3>
                <p className="text-xs text-slate-700">Total duration automatically updates as you adjust phase minutes</p>
              </div>
              <button
                onClick={handleAddPhase}
                className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Phase
              </button>
            </div>

            <div className="space-y-4">
              {plan.phases.map((phase, pIdx) => (
                <div key={phase.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <input
                      type="text"
                      value={phase.name}
                      onChange={(e) => handleUpdatePhase(pIdx, 'name', e.target.value)}
                      className="text-xs font-black text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg flex-1"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="font-bold text-slate-700">Duration:</span>
                        <input
                          type="number"
                          value={phase.durationMinutes}
                          onChange={(e) => handleUpdatePhase(pIdx, 'durationMinutes', Number(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg text-center font-mono"
                        />
                        <span className="text-slate-700 font-bold">min</span>
                      </div>
                      {plan.phases.length > 1 && (
                        <button type="button" aria-label="Delete"
                          onClick={() => handleRemovePhase(pIdx)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Instructional Strategy & Description</label>
                      <textarea
                        rows={2}
                        value={phase.description}
                        onChange={(e) => handleUpdatePhase(pIdx, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Materials, Slides & Media Used</label>
                      <textarea
                        rows={2}
                        value={phase.materials}
                        onChange={(e) => handleUpdatePhase(pIdx, 'materials', e.target.value)}
                        className="w-full px-3 py-1.5 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: ASSESSMENT & CLOSURE */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-700" /> 4. Assessment Strategy & Capstone Continuity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Formative / Summative Assessment Strategy</label>
                <textarea
                  rows={3}
                  value={plan.assessmentStrategy}
                  onChange={(e) => setPlan({ ...plan, assessmentStrategy: e.target.value })}
                  placeholder="e.g. Exit ticket quiz (80% threshold), peer-reviewed discussion post..."
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Homework, Reading Pack & Next Steps</label>
                <textarea
                  rows={3}
                  value={plan.homeworkOrNextSteps}
                  onChange={(e) => setPlan({ ...plan, homeworkOrNextSteps: e.target.value })}
                  placeholder="e.g. Complete chapter readings, download OER study pack for seminar 2..."
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white border border-slate-300 rounded-xl"
                ></textarea>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* SYLLABUS / LESSON PLAN PREVIEW MODE */
        <div className="p-6 sm:p-10 space-y-6 bg-slate-50">
          <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-white">
                    {plan.courseCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-950 border border-blue-300">
                    {plan.school}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                    {plan.targetLevel}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  {plan.title}
                </h2>
                <p className="text-xs text-slate-700 mt-1 font-semibold">
                  Department: <strong className="text-slate-900">{plan.department}</strong> • Bloom's Level: <strong className="text-blue-900">{plan.bloomsTaxonomyLevel}</strong> • Duration: <strong className="text-slate-900">{plan.totalDuration} Minutes</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Export / Print Plan
                </button>
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                Measurable Learning Outcomes
              </h3>
              <ul className="space-y-1.5">
                {plan.learningObjectives.map((obj, i) => (
                  <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline Breakdown */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3">
                Lesson Timeline &amp; Instructional Phases ({plan.totalDuration} Mins)
              </h3>
              <div className="space-y-3">
                {plan.phases.map((phase, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-300 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-blue-900">{phase.name}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-950 font-bold border border-blue-300">
                          {phase.durationMinutes} min
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1.5 font-medium leading-relaxed">
                        {phase.description}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1">
                        <strong>Required Materials:</strong> {phase.materials}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment & Homework */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Assessment Strategy:</p>
                <p className="text-slate-700 leading-relaxed">{plan.assessmentStrategy}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Homework &amp; Next Steps:</p>
                <p className="text-slate-700 leading-relaxed">{plan.homeworkOrNextSteps}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LessonPlanBuilder;
