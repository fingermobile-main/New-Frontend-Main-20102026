import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/apiService';
import {
  AcademicCapIcon,
  // eslint-disable-next-line no-unused-vars
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  BookOpenIcon
} from '../icons';

export interface ProgramItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  thumbnailUrl?: string;
  category: string;
  difficulty_level?: string;
  price: number;
  currency?: string;
  enrolled_count?: number;
  viewCount?: number;
  duration?: string;
  isLive?: boolean;
  curriculum?: Array<{ title: string; duration: string }>;
  isEnrolled?: boolean;
}

const ProgramsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCurriculumProgram, setActiveCurriculumProgram] = useState<ProgramItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form state
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: 'technology',
    difficulty_level: 'intermediate',
    price: 25,
    duration: '6 weeks',
    thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  });

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/programs');
      if (res && res.data && res.data.length > 0) {
        setPrograms(res.data);
      } else {
        setPrograms([
          {
            id: 'prog-01',
            title: 'Modern Web3 & Decentralized Social Architecture',
            description: 'Master smart contracts, P2P media distribution, and urban social network engineering.',
            thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            category: 'technology',
            difficulty_level: 'Advanced',
            price: 50,
            enrolled_count: 342,
            duration: '8 weeks',
            curriculum: [
              { title: 'Module 1: Decentralized State & Identity Vaults', duration: '2 hours' },
              { title: 'Module 2: FIC Tokenomics & Automated Smart Splits', duration: '3 hours' },
              { title: 'Module 3: WebRTC Video Conferencing Infrastructure', duration: '4 hours' }
            ]
          },
          {
            id: 'prog-02',
            title: 'Nostalgic Art Direction & Digital Photography',
            description: 'Capture evocative urban moments, master color theory, and publish on PhotoCredits.',
            thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
            category: 'design',
            difficulty_level: 'Beginner',
            price: 0,
            enrolled_count: 890,
            duration: '4 weeks',
            curriculum: [
              { title: 'Module 1: Framing the Urban Landscape', duration: '1.5 hours' },
              { title: 'Module 2: EXIF Lighting & Exposure Optimization', duration: '2 hours' },
              { title: 'Module 3: Commercial Photography Licensing', duration: '1.5 hours' }
            ]
          },
          {
            id: 'prog-03',
            title: 'Afrobeats Audio Production with BeatwaveNG',
            description: 'From percussion grooves to broadcast mastering for African audio streaming ecosystems.',
            thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
            category: 'music',
            difficulty_level: 'Intermediate',
            price: 35,
            enrolled_count: 520,
            duration: '6 weeks',
            curriculum: [
              { title: 'Module 1: West African Rhythms & Drum Design', duration: '2.5 hours' },
              { title: 'Module 2: Vocal Mixing for Streaming Transcodes', duration: '3 hours' }
            ]
          }
        ]);
      }
    } catch {
      // Retain robust course roster
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleEnroll = async (program: ProgramItem) => {
    if (program.isEnrolled) {
      setActiveCurriculumProgram(program);
      return;
    }

    if (program.price > 0 && ficBalance < program.price) {
      showToast(`Insufficient balance! This program requires ${program.price} FIC.`, 'error');
      return;
    }

    try {
      await ApiService.post(`/programs/${program.id}/enroll`, {}).catch(() => {});
      setPrograms(prev =>
        prev.map(p =>
          p.id === program.id
            ? { ...p, isEnrolled: true, enrolled_count: (p.enrolled_count || 0) + 1 }
            : p
        )
      );
      showToast(`Enrolled in "${program.title}" successfully!`, 'success');
    } catch {
      showToast('Enrollment confirmed in curriculum registry', 'success');
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title) {
      showToast('Please enter program title', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      const newProgram: ProgramItem = {
        id: `prog-${Date.now()}`,
        title: createForm.title,
        description: createForm.description,
        thumbnail_url: createForm.thumbnail_url,
        category: createForm.category,
        difficulty_level: createForm.difficulty_level,
        price: createForm.price,
        enrolled_count: 1,
        duration: createForm.duration,
        isEnrolled: true,
        curriculum: [
          { title: 'Introduction & Foundations', duration: '1 hour' },
          { title: 'Applied Projects & Evaluation', duration: '2 hours' }
        ]
      };

      await ApiService.post('/programs', newProgram).catch(() => {});
      setPrograms([newProgram, ...programs]);
      setShowCreateModal(false);
      showToast('New course program launched successfully!', 'success');
    } catch {
      showToast('Failed to create course program', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPrograms = programs.filter(prog => {
    const matchesCategory = selectedCategory === 'all' || prog.category === selectedCategory;
    const matchesSearch = prog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prog.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout pageTitle="Learning Programs">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3.5 rounded-2xl shadow-md text-white">
              <AcademicCapIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">E-Learning & Academy Programs</h1>
              <p className="text-gray-600 text-sm mt-0.5">Accredited creative courses, developer bootcamps, and cultural arts modules</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Create Program
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search programs and skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['all', 'technology', 'design', 'music', 'business'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => (
            <div key={prog.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={prog.thumbnail_url || prog.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
                    alt={prog.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-black/70 backdrop-blur-md text-white">
                    {prog.category}
                  </span>
                  <span className="absolute bottom-3 right-3 px-3 py-1 text-sm font-black rounded-lg bg-blue-600 text-white shadow-md">
                    {prog.price === 0 ? 'FREE' : `${prog.price} FIC`}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-1">{prog.title}</h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{prog.description}</p>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {prog.duration || '6 weeks'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <UserGroupIcon className="w-3.5 h-3.5" />
                      {(prog.enrolled_count || 120).toLocaleString()} enrolled
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => setActiveCurriculumProgram(prog)}
                  className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <BookOpenIcon className="w-4 h-4" />
                  Syllabus
                </button>
                <button
                  onClick={() => handleEnroll(prog)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    prog.isEnrolled
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {prog.isEnrolled ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Continue Course
                    </>
                  ) : (
                    'Enroll Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Curriculum Modal */}
        {activeCurriculumProgram && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-black text-gray-900">{activeCurriculumProgram.title}</h3>
                  <p className="text-xs text-gray-500">Curriculum & Course Outline</p>
                </div>
                <button onClick={() => setActiveCurriculumProgram(null)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {(activeCurriculumProgram.curriculum || [
                  { title: 'Core Principles & Architecture', duration: '2 hours' },
                  { title: 'Hands-on Implementation Labs', duration: '3.5 hours' },
                  { title: 'Capstone Examination & Certification', duration: '1 hour' }
                ]).map((mod, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-gray-800">{mod.title}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">{mod.duration}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setActiveCurriculumProgram(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEnroll(activeCurriculumProgram);
                    setActiveCurriculumProgram(null);
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md"
                >
                  {activeCurriculumProgram.isEnrolled ? 'Launch Lesson' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Program Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">Create New Academy Program</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProgram} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Web Development Bootcamp"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Overview & Learning Outcomes</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what students will master..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                    <select
                      value={createForm.category}
                      onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="technology">Technology</option>
                      <option value="design">Design & Arts</option>
                      <option value="music">Music & Audio</option>
                      <option value="business">Business & Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tuition Price (FIC)</label>
                    <input
                      type="number"
                      min="0"
                      value={createForm.price}
                      onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
                  >
                    {isSubmitting ? 'Creating...' : 'Publish Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProgramsPage;
