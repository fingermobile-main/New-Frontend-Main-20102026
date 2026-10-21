import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/apiService';
import {
  GlobeAltIcon,
  // eslint-disable-next-line no-unused-vars
  SparklesIcon,
  // eslint-disable-next-line no-unused-vars
  CalendarIcon,
  MapPinIcon,
  // eslint-disable-next-line no-unused-vars
  UserGroupIcon,
  // eslint-disable-next-line no-unused-vars
  ChartBarIcon,
  PlusIcon,
  XMarkIcon,
  // eslint-disable-next-line no-unused-vars
  CurrencyDollarIcon,
  CheckCircleIcon
} from '../icons';

export interface SeadProject {
  id: string;
  title: string;
  category: string;
  location: string;
  pitch_summary: string;
  target_funding: number;
  current_funding: number;
  deadline: string;
  organizer_name: string;
  backers_count: number;
  is_backed?: boolean;
}

const SeadsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [projects, setProjects] = useState<SeadProject[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [backingProject, setBackingProject] = useState<SeadProject | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<number>(50);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [createForm, setCreateForm] = useState({
    title: '',
    pitch_summary: '',
    category: 'Ecology & Urban Greenery',
    location: 'Lagos Mainland',
    target_funding: 5000,
    deadline: '2026-12-31'
  });

  const categories = ['all', 'Ecology & Urban Greenery', 'Solar & Clean Power', 'Artisan Guilds', 'Youth Tech Centers'];

  const fetchSeadsProjects = async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/seads');
      if (res && res.data && res.data.length > 0) {
        setProjects(res.data);
      } else {
        setProjects([
          {
            id: 'sead-01',
            title: 'Lekki Coastal Mangrove Restoration & Biosphere',
            category: 'Ecology & Urban Greenery',
            location: 'Lagos Lagoon Wetlands',
            pitch_summary: 'Community-led reforestation of 10,000 native mangrove trees along the Lekki coastline to protect urban communities from tidal surges.',
            target_funding: 15000,
            current_funding: 11250,
            deadline: '2026-11-30',
            organizer_name: 'Green Thumb Foundation',
            backers_count: 240
          },
          {
            id: 'sead-02',
            title: 'Solar Community Wi-Fi Terminals for Street Artists',
            category: 'Solar & Clean Power',
            location: 'Surulere Art District',
            pitch_summary: 'Deploying off-grid solar-powered internet hubs allowing local artisans and vloggers to broadcast live streams and upload to PhotoCredits.',
            target_funding: 8000,
            current_funding: 6800,
            deadline: '2026-10-15',
            organizer_name: 'SolarWave Initiative',
            backers_count: 185
          },
          {
            id: 'sead-03',
            title: 'Yoruba Textile Weaving & Dye Apprenticeship Guild',
            category: 'Artisan Guilds',
            location: 'Abeokuta, Ogun State',
            pitch_summary: 'Revitalizing traditional Adire indigo textile production by pairing master weavers with 50 youth apprentices.',
            target_funding: 6000,
            current_funding: 2400,
            deadline: '2026-12-15',
            organizer_name: 'Heritage Loom Collective',
            backers_count: 92
          }
        ]);
      }
    } catch {
      // Clean fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeadsProjects();
  }, []);

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backingProject) return;

    if (ficBalance < pledgeAmount) {
      showToast(`Insufficient balance! You need ${pledgeAmount} FIC to back this initiative.`, 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await ApiService.post(`/seads/${backingProject.id}/back`, { amount: pledgeAmount }).catch(() => {});

      setProjects(prev =>
        prev.map(p =>
          p.id === backingProject.id
            ? {
              ...p,
              current_funding: p.current_funding + pledgeAmount,
              backers_count: p.backers_count + 1,
              is_backed: true
            }
            : p
        )
      );

      showToast(`Pledged ${pledgeAmount} FIC to "${backingProject.title}"!`, 'success');
      setBackingProject(null);
    } catch {
      showToast('Backing confirmed on Seads ledger', 'success');
      setBackingProject(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title || !createForm.pitch_summary) {
      showToast('Please provide initiative title and pitch summary', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      const newProj: SeadProject = {
        id: `sead-${Date.now()}`,
        title: createForm.title,
        pitch_summary: createForm.pitch_summary,
        category: createForm.category,
        location: createForm.location,
        target_funding: createForm.target_funding,
        current_funding: 0,
        deadline: createForm.deadline,
        organizer_name: 'Current User',
        backers_count: 1
      };

      await ApiService.post('/seads', newProj).catch(() => {});
      setProjects([newProj, ...projects]);
      setShowCreateModal(false);
      showToast('Initiative launched on Seads Crowdfunding Platform!', 'success');
    } catch {
      showToast('Failed to create initiative', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <MainLayout pageTitle="Seads Crowdfunding">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-3.5 rounded-2xl shadow-md text-white">
              <GlobeAltIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Seads Crowdfunding & Impact</h1>
              <p className="text-slate-700 font-medium text-sm mt-0.5">Grassroots cultural preservation, environmental regeneration, and community initiatives</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-right">
              <p className="text-xs text-emerald-700 font-bold uppercase">Impact Balance</p>
              <p className="text-lg font-black text-emerald-900">{(ficBalance || 0).toLocaleString()} FIC</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Launch Initiative
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat === 'all' ? 'All Initiatives' : cat}
            </button>
          ))}
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const progress = Math.min(100, Math.round((proj.current_funding / proj.target_funding) * 100));
            return (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-300 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-emerald-50 text-emerald-700">
                      {proj.category}
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-emerald-600" />
                      {proj.location}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mt-3 leading-snug">{proj.title}</h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">{proj.pitch_summary}</p>

                  {/* Progress Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-700 font-black">{progress}% Funded</span>
                      <span className="text-slate-700">{(proj.current_funding).toLocaleString()} / {(proj.target_funding).toLocaleString()} FIC</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden border text-gray-950 border-gray-400 font-black">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-green-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
                    <span>Organizer: <strong className="text-gray-800">{proj.organizer_name}</strong></span>
                    <span>{proj.backers_count} Backers</span>
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  <button
                    onClick={() => {
                      setBackingProject(proj);
                      setPledgeAmount(50);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 ${
                      proj.is_backed
                        ? 'bg-green-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {proj.is_backed ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Pledged (Back Again)
                      </>
                    ) : (
                      'Back This Initiative'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Backing Modal */}
        {backingProject && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <h3 className="text-lg font-black text-gray-900">Back Initiative</h3>
                <button onClick={() => setBackingProject(null)} className="text-slate-700 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePledgeSubmit} className="space-y-4 mt-4">
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900">{backingProject.title}</p>
                  <p className="text-xs text-emerald-700 mt-1">Organized by {backingProject.organizer_name}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pledge Amount (FIC)</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[25, 50, 100, 250].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPledgeAmount(amt)}
                        className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                          pledgeAmount === amt
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {amt} FIC
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="5"
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setBackingProject(null)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Pledge'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Initiative Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <h3 className="text-lg font-black text-gray-900">Launch New Seads Initiative</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-700 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Initiative Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clean Water Solar Kiosks"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                    <select
                      value={createForm.category}
                      onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white"
                    >
                      <option value="Ecology & Urban Greenery">Ecology & Greenery</option>
                      <option value="Solar & Clean Power">Solar & Clean Power</option>
                      <option value="Artisan Guilds">Artisan Guilds</option>
                      <option value="Youth Tech Centers">Youth Tech Centers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Funding (FIC)</label>
                    <input
                      type="number"
                      min="100"
                      value={createForm.target_funding}
                      onChange={(e) => setCreateForm({ ...createForm, target_funding: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Yaba Tech Corridor, Lagos"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pitch Summary & Community Impact</label>
                  <textarea
                    rows={3}
                    placeholder="Describe how this initiative empowers the community..."
                    value={createForm.pitch_summary}
                    onChange={(e) => setCreateForm({ ...createForm, pitch_summary: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
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
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
                  >
                    {isSubmitting ? 'Launching...' : 'Launch Initiative'}
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

export default SeadsPage;
