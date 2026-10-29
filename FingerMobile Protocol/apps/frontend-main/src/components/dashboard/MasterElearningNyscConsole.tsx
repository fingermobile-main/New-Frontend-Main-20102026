import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Upload,
  Plus,
  RefreshCw,
  CheckCircle,
  Trash2,
  Edit,
  X,
  Sliders,
  Filter,
  CheckSquare,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import {
  ElearningNyscDomain,
  ElearningNyscItem,
  ElearningNyscOverview,
  ElearningNyscSpawnedConsole,
  CreateElearningNyscItemPayload
} from '../../types/elearningNyscConsole';
import { elearningNyscConsoleService } from '../../services/elearningNyscConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterElearningNyscConsole: React.FC = () => {
  // State
  const [activeDomain, setActiveDomain] = useState<ElearningNyscDomain | 'all'>('all');
  const [items, setItems] = useState<ElearningNyscItem[]>([]);
  const [overview, setOverview] = useState<ElearningNyscOverview | null>(null);
  const [spawnedConsoles, setSpawnedConsoles] = useState<ElearningNyscSpawnedConsole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordering, setReordering] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ElearningNyscItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateElearningNyscItemPayload>({
    domain: 'nysc_saed_skills',
    name: '',
    code: '',
    category: 'Skill Acquisition & Entrepreneurship',
    instructor_name: 'Accredited Faculty',
    accreditation_body: 'NYSC EduTech Directorate',
    price_fiat: 15000,
    price_fic: 150,
    enrolled_students: 0,
    completion_rate: 96.0,
    curriculum_modules: 8,
    status: 'active',
    certification_level: 'National Professional Diploma',
    tags: ['NYSC', 'EduTech', 'Skills'],
    voice_tag: 'blessings',
    document_url: ''
  });

  // Spawn Form State
  const [spawnData, setSpawnData] = useState({
    title: '',
    domain: 'nysc_saed_skills',
    badge: 'NYSC-PORTAL',
    description: ''
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success', voice?: AfricanVoiceLine) => {
    setNotification({ message, type });
    if (voice) {
      audioEngine.playVoiceLine(voice);
    }
    setTimeout(() => setNotification(null), 4500);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ov, itms, spawns] = await Promise.all([
        elearningNyscConsoleService.getOverview(),
        elearningNyscConsoleService.getItems(activeDomain, searchTerm, statusFilter),
        elearningNyscConsoleService.getSpawnedConsoles()
      ]);
      setOverview(ov);
      setItems(itms);
      setSpawnedConsoles(spawns);
    } catch (err: any) {
      showNotification(err.message || 'Error loading EduTech console data', 'error', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [activeDomain, searchTerm, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchDomain = activeDomain === 'all' || item.domain === activeDomain;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchSearch = searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDomain && matchStatus && matchSearch;
    });
  }, [items, activeDomain, statusFilter, searchTerm]);

  const handleToggleFreeze = async (item: ElearningNyscItem) => {
    try {
      const updated = await elearningNyscConsoleService.toggleFreeze(item.id);
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      const isFrozen = updated.status === 'frozen';
      showNotification(
        `Course ${item.name} is now ${isFrozen ? 'FROZEN (Defcon hold active)' : 'ACTIVE (Live enrollment)'}`,
        'success',
        isFrozen ? 'wahala' : 'sweet'
      );
      elearningNyscConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Error toggling freeze state', 'error', 'wahala');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredItems.length) return;

    try {
      setReordering(true);
      const reordered = [...filteredItems];
      const temp = reordered[index];
      reordered[index] = reordered[targetIndex];
      reordered[targetIndex] = temp;

      const orderPayload = reordered.map((item, idx) => ({
        id: item.id,
        display_order: idx + 1
      }));

      await elearningNyscConsoleService.reorderItems(orderPayload);
      setItems(reordered.map((item, idx) => ({ ...item, display_order: idx + 1 })));
      showNotification('Curriculum order synchronized live to PostgreSQL!', 'success', 'sweet');
    } catch (err: any) {
      showNotification(err.message || 'Failed to save curriculum order', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  const handleDeleteItem = async (item: ElearningNyscItem) => {
    if (!window.confirm(`Permanently remove course "${item.name}" from PostgreSQL database?`)) return;
    try {
      await elearningNyscConsoleService.deleteItem(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      showNotification(`Course ${item.code} deleted successfully`, 'success', 'wahala');
      elearningNyscConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete course', 'error', 'wahala');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await elearningNyscConsoleService.createItem(formData);
      setItems(prev => [...prev, created]);
      setIsAddModalOpen(false);
      showNotification(`Course "${created.name}" published live to PostgreSQL!`, 'success', 'gbaski');
      elearningNyscConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to create course', 'error', 'wahala');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      const updated = await elearningNyscConsoleService.updateItem(selectedItem.id, formData);
      setItems(prev => prev.map(i => i.id === selectedItem.id ? updated : i));
      setIsEditModalOpen(false);
      setSelectedItem(null);
      showNotification(`Course "${updated.name}" updated successfully!`, 'success', 'sweet');
      elearningNyscConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to update course', 'error', 'wahala');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await elearningNyscConsoleService.uploadMedia(file);
      setFormData(prev => ({ ...prev, document_url: res.url }));
      showNotification(`Syllabus "${file.name}" uploaded direct to Express storage!`, 'success', 'owo_ni_koko');
    } catch (err: any) {
      showNotification(err.message || 'Upload failed', 'error', 'wahala');
    }
  };

  const handleSpawnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const spawned = await elearningNyscConsoleService.spawnConsole(spawnData);
      setSpawnedConsoles(prev => [spawned, ...prev]);
      setIsSpawnModalOpen(false);
      showNotification(`Generated new sovereign EduTech console "${spawned.title}"!`, 'success', 'blessings');
    } catch (err: any) {
      showNotification(err.message || 'Failed to spawn console', 'error', 'wahala');
    }
  };

  const domainsList: { key: ElearningNyscDomain | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All EduTech Domains', count: items.length },
    { key: 'nysc_saed_skills', label: 'NYSC SAED Skills', count: items.filter(i => i.domain === 'nysc_saed_skills').length },
    { key: 'coding_web3_bootcamp', label: 'Web3 & AI Bootcamps', count: items.filter(i => i.domain === 'coding_web3_bootcamp').length },
    { key: 'vocational_fashion', label: 'Afro-Haute Couture', count: items.filter(i => i.domain === 'vocational_fashion').length },
    { key: 'financial_literacy_crypto', label: 'DeFi & Wealth Mastery', count: items.filter(i => i.domain === 'financial_literacy_crypto').length },
    { key: 'stem_robotics_iot', label: 'STEM Robotics & IoT', count: items.filter(i => i.domain === 'stem_robotics_iot').length },
    { key: 'agribusiness_hydroponics', label: 'Smart Hydroponics', count: items.filter(i => i.domain === 'agribusiness_hydroponics').length }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg transition-all ${
          notification.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
            : 'bg-red-50 border-red-300 text-red-950 font-semibold'
        }`}>
          <span>{notification.message}</span>
          <button type="button" aria-label="Close" onClick={() => setNotification(null)} className="text-slate-600 hover:text-slate-900 ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-300">
              Phase 9 Sovereign Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-950 border border-blue-300">
              PostgreSQL Port 5433 Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-emerald-600" />
            E-Learning, NYSC SAED & EduTech Console
          </h1>
          <p className="text-slate-700 text-sm mt-1 max-w-3xl">
            Autonomous runtime governance of NYSC SAED skill centers, Web3/AI engineering curricula, vocational haute couture, student enrolments, course pricing (fiat ₦ / FIC tokens), and Defcon accreditation holds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold hover:bg-slate-50 transition-all text-sm"
          >
            <RefreshCw className={`w-4 h-4 text-slate-700 ${loading ? 'animate-spin' : ''}`} />
            Sync DB
          </button>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-950 font-bold hover:bg-indigo-100 transition-all text-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-700" />
            Spawn Console
          </button>
          <button
            onClick={() => {
              setFormData({
                domain: 'nysc_saed_skills',
                name: '',
                code: '',
                category: 'Skill Acquisition & Entrepreneurship',
                instructor_name: 'Accredited Faculty',
                accreditation_body: 'NYSC EduTech Directorate',
                price_fiat: 15000,
                price_fic: 150,
                enrolled_students: 0,
                completion_rate: 96.0,
                curriculum_modules: 8,
                status: 'active',
                certification_level: 'National Professional Diploma',
                tags: ['NYSC', 'EduTech', 'Skills'],
                voice_tag: 'blessings',
                document_url: ''
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-emerald-600 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Course
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled Corps & Students</span>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {Number(overview.summary.total_students).toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 font-medium mt-1">
              Across {overview.summary.total_items} accredited curricula
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Average Completion Rate</span>
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {Number(overview.summary.average_completion_rate).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-600 font-medium mt-1">
              {overview.summary.total_curriculum_modules} verified modules
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Estimated Tuition Volume (₦)</span>
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              ₦{Number(overview.summary.estimated_gross_fiat).toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 font-medium mt-1">
              FIC Volume: {Number(overview.summary.estimated_gross_fic).toLocaleString()} FIC
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Governance DefCon Status</span>
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                {overview.summary.active_count} Active
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">
                {overview.summary.frozen_count} Frozen
              </span>
            </div>
            <div className="text-xs text-slate-600 font-medium mt-1">
              {overview.totalSpawns} spawned sub-consoles
            </div>
          </div>
        </div>
      )}

      {/* Domain Navigation Tabs */}
      <div className="bg-white border border-slate-300 rounded-2xl p-2 shadow-sm flex items-center gap-2 overflow-x-auto">
        {domainsList.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveDomain(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeDomain === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeDomain === tab.key
                ? 'bg-slate-800 text-white'
                : 'bg-slate-200 text-slate-800'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by course name, code, instructor or category..."
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="frozen">Frozen Only</option>
          </select>

          <span className="text-xs text-slate-600 font-semibold whitespace-nowrap">
            Showing {filteredItems.length} courses
          </span>
        </div>
      </div>

      {/* Primary Data Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Course & Accreditation</th>
                <th className="py-3.5 px-4">Faculty / Instructor</th>
                <th className="py-3.5 px-4">Enrolment & Modules</th>
                <th className="py-3.5 px-4">Tuition (₦ / FIC)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Sequence Order */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold text-slate-900 w-6">#{item.display_order}</span>
                      <div className="flex flex-col">
                        <button
                          disabled={reordering || index === 0}
                          onClick={() => handleMoveOrder(index, 'up')}
                          className="p-0.5 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={reordering || index === filteredItems.length - 1}
                          onClick={() => handleMoveOrder(index, 'down')}
                          className="p-0.5 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Course Name & Details */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                      <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-bold">
                        {item.code}
                      </span>
                      <span>•</span>
                      <span>{item.accreditation_body}</span>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{item.instructor_name}</div>
                    <div className="text-xs text-slate-600">{item.certification_level}</div>
                  </td>

                  {/* Enrolment */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">
                      {Number(item.enrolled_students).toLocaleString()} students
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {item.curriculum_modules} Modules • {Number(item.completion_rate).toFixed(1)}% Pass
                    </div>
                  </td>

                  {/* Tuition */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">₦{Number(item.price_fiat).toLocaleString()}</div>
                    <div className="text-xs text-emerald-800 font-bold">{Number(item.price_fic).toLocaleString()} FIC</div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'active'
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                        : 'bg-amber-100 text-amber-950 border-amber-300'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Action Controls */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleFreeze(item)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          item.status === 'frozen'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                        }`}
                        title={item.status === 'frozen' ? 'Unfreeze Course' : 'Defcon Freeze Course'}
                      >
                        {item.status === 'frozen' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setFormData({
                            domain: item.domain,
                            name: item.name,
                            code: item.code,
                            category: item.category,
                            instructor_name: item.instructor_name,
                            accreditation_body: item.accreditation_body,
                            price_fiat: Number(item.price_fiat),
                            price_fic: Number(item.price_fic),
                            enrolled_students: item.enrolled_students,
                            completion_rate: Number(item.completion_rate),
                            curriculum_modules: item.curriculum_modules,
                            status: item.status,
                            certification_level: item.certification_level,
                            tags: item.tags || [],
                            voice_tag: item.voice_tag || 'blessings',
                            document_url: item.document_url || ''
                          });
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 transition-all"
                        title="Edit Course"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1.5 rounded-lg border border-red-300 bg-white text-red-700 hover:bg-red-50 transition-all"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-600 font-medium">
                    No courses found matching the active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spawned Sub-Consoles Showcase */}
      {spawnedConsoles.length > 0 && (
        <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Spawned Specialized EduTech Consoles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {spawnedConsoles.map(sc => (
              <div key={sc.id} className="p-4 rounded-xl border border-slate-300 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">{sc.title}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-950 border border-indigo-300">
                      {sc.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{sc.description || 'Specialized EduTech sub-console'}</p>
                </div>
                <div className="text-xs text-slate-600 font-mono mt-3">Domain: {sc.domain}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {isAddModalOpen ? 'Create & Publish New EduTech Course' : `Edit Course: ${selectedItem?.code}`}
              </h3>
              <button type="button" aria-label="Close"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedItem(null);
                }}
                className="text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleCreateSubmit : handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Domain</label>
                  <select
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value as ElearningNyscDomain })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="nysc_saed_skills">NYSC SAED Skills</option>
                    <option value="coding_web3_bootcamp">Web3 & AI Bootcamps</option>
                    <option value="vocational_fashion">Afro-Haute Couture</option>
                    <option value="financial_literacy_crypto">DeFi & Wealth Mastery</option>
                    <option value="stem_robotics_iot">STEM Robotics & IoT</option>
                    <option value="agribusiness_hydroponics">Smart Hydroponics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. SAED-SOLAR-03"
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Commercial Solar Installation & Battery Storage Architecture"
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Instructor / Faculty</label>
                  <input
                    type="text"
                    value={formData.instructor_name}
                    onChange={e => setFormData({ ...formData, instructor_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Accreditation Body</label>
                  <input
                    type="text"
                    value={formData.accreditation_body}
                    onChange={e => setFormData({ ...formData, accreditation_body: e.target.value })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Price Fiat (₦)</label>
                  <input
                    type="number"
                    value={formData.price_fiat}
                    onChange={e => setFormData({ ...formData, price_fiat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Price FIC</label>
                  <input
                    type="number"
                    value={formData.price_fic}
                    onChange={e => setFormData({ ...formData, price_fic: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Modules</label>
                  <input
                    type="number"
                    value={formData.curriculum_modules}
                    onChange={e => setFormData({ ...formData, curriculum_modules: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Multipart Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Syllabus PDF / Accreditation Proof (Direct Express Upload)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border file:border-slate-300 file:bg-slate-100 file:font-bold file:text-slate-800 hover:file:bg-slate-200"
                  />
                  {formData.document_url && (
                    <span className="text-xs font-mono text-emerald-800 font-bold truncate max-w-xs">
                      {formData.document_url}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-sm"
                >
                  {isAddModalOpen ? 'Commit to PostgreSQL' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* One-Click Console Spawner Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Spawn New Specialized EduTech Console
              </h3>
              <button type="button" aria-label="Close" onClick={() => setIsSpawnModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSpawnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Console Title</label>
                <input
                  type="text"
                  required
                  value={spawnData.title}
                  onChange={e => setSpawnData({ ...spawnData, title: e.target.value })}
                  placeholder="e.g. Northern Corpers Agro-Hub Console"
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Badge ID</label>
                <input
                  type="text"
                  required
                  value={spawnData.badge}
                  onChange={e => setSpawnData({ ...spawnData, badge: e.target.value.toUpperCase() })}
                  placeholder="e.g. AGRO-HUB"
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description</label>
                <textarea
                  value={spawnData.description}
                  onChange={e => setSpawnData({ ...spawnData, description: e.target.value })}
                  placeholder="Describe the operational mandate of this spawned console..."
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm"
                >
                  Generate & Register Console
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterElearningNyscConsole;
