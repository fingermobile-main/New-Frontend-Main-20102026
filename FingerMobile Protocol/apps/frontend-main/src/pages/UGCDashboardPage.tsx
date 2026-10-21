import React, { useState, useRef } from 'react';
import axios from 'axios';
import UGCContentStudio from '../components/ugc/UGCContentStudio';
import UGCPublishingTools from '../components/ugc/UGCPublishingTools';
import UGCAnalyticsDashboard from '../components/ugc/UGCAnalyticsDashboard';
import UGCMonetizationPanel from '../components/ugc/UGCMonetizationPanel';
import UGCScheduler from '../components/ugc/UGCScheduler';
import {
  PencilIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  SparklesIcon,
  PhotoIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  ArrowUpTrayIcon
} from '../icons';
import UGCPrivacyControlModal from '../components/privacy/UGCPrivacyControlModal';
import { Shield, X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

const UGCDashboardPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    'studio' | 'analytics' | 'monetization' | 'scheduler'
  >('studio');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'image' | 'video' | 'audio'>('image');
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenUploader = (category: 'image' | 'video' | 'audio' = 'image') => {
    setUploadCategory(category);
    setSelectedFile(null);
    setUploadTitle('');
    setIsUploadModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!uploadTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setUploadTitle(cleanName);
      }
    }
  };

  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Please select a media file to upload', 'error');
      return;
    }

    try {
      setIsSubmittingUpload(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadTitle || selectedFile.name);
      formData.append('category', uploadCategory);

      const token = typeof window !== 'undefined'
        ? localStorage.getItem('token') || localStorage.getItem('accessToken') || ''
        : '';

      const res = await axios.post('/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (res.data?.success) {
        showToast('✓ Media successfully persisted to PostgreSQL and storage ledger!', 'success');
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setUploadTitle('');
        // Dispatch global event so content studio and components refresh immediately
        window.dispatchEvent(new CustomEvent('FM_P2P_UGC_UPDATED', { detail: { action: 'upload', data: res.data.data } }));
      } else {
        throw new Error(res.data?.message || 'Upload failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      showToast(`Upload failed: ${msg}`, 'error');
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  return (
    <div className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-xl shadow-lg p-6 text-white border border-blue-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-xs">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                UGC Sovereign Studio & Media Pipeline
              </h1>
              <p className="mt-1 text-sm font-bold text-blue-100">
                Direct PostgreSQL persistence, verifiable licensing, and high-performance media transcoding.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenUploader('image')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-blue-50 text-blue-900 font-black text-xs rounded-lg transition-all shadow-md hover:scale-105"
          >
            <ArrowUpTrayIcon className="h-4 w-4 text-blue-700" />
            <span>Upload to Database</span>
          </button>
        </div>
      </div>

      <PlatformOwnershipCard />

      {/* Main Tabbed Console */}
      <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <div className="border-b border-slate-300 bg-slate-50/50">
          <nav className="flex flex-wrap -mb-px">
            <button
              className={`flex-1 min-w-[140px] py-4 px-3 text-center border-b-2 font-bold text-xs sm:text-sm flex items-center justify-center transition-colors ${
                activeTab === 'studio'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-2xs font-black'
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:border-slate-300'
              }`}
              onClick={() => setActiveTab('studio')}
            >
              <PencilIcon className="h-4 w-4 mr-2 text-blue-600" />
              Content Studio
            </button>
            <button
              className={`flex-1 min-w-[140px] py-4 px-3 text-center border-b-2 font-bold text-xs sm:text-sm flex items-center justify-center transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-2xs font-black'
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:border-slate-300'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <ChartBarIcon className="h-4 w-4 mr-2 text-indigo-600" />
              Analytics
            </button>
            <button
              className={`flex-1 min-w-[140px] py-4 px-3 text-center border-b-2 font-bold text-xs sm:text-sm flex items-center justify-center transition-colors ${
                activeTab === 'monetization'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-2xs font-black'
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:border-slate-300'
              }`}
              onClick={() => setActiveTab('monetization')}
            >
              <CurrencyDollarIcon className="h-4 w-4 mr-2 text-emerald-600" />
              Monetization
            </button>
            <button
              className={`flex-1 min-w-[140px] py-4 px-3 text-center border-b-2 font-bold text-xs sm:text-sm flex items-center justify-center transition-colors ${
                activeTab === 'scheduler'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-2xs font-black'
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:border-slate-300'
              }`}
              onClick={() => setActiveTab('scheduler')}
            >
              <CalendarIcon className="h-4 w-4 mr-2 text-purple-600" />
              Scheduler
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'studio' && (
            <div className="space-y-6">
              {/* Interactive Creation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <button
                  type="button"
                  onClick={() => handleOpenUploader('image')}
                  className="text-left bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl p-5 border border-blue-200 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-600 text-white p-3 rounded-lg group-hover:scale-105 transition-transform">
                      <PhotoIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-black text-slate-900 text-base">Image Creation</h3>
                      <p className="text-xs text-slate-700 font-bold mt-0.5">Upload, watermark & catalog</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenUploader('video')}
                  className="text-left bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 rounded-xl p-5 border border-purple-200 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="bg-purple-600 text-white p-3 rounded-lg group-hover:scale-105 transition-transform">
                      <VideoCameraIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-black text-slate-900 text-base">Video Creation</h3>
                      <p className="text-xs text-slate-700 font-bold mt-0.5">Transcode reels & shorts</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenUploader('audio')}
                  className="text-left bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-xl p-5 border border-emerald-200 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="bg-emerald-600 text-white p-3 rounded-lg group-hover:scale-105 transition-transform">
                      <MicrophoneIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-black text-slate-900 text-base">Audio Creation</h3>
                      <p className="text-xs text-slate-700 font-bold mt-0.5">Record stems & podcasts</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Studio Component */}
              <div className="space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">UGC Pipeline Controls</h2>
                    <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-950 border border-emerald-400">
                      PostgreSQL Connected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPrivacyModalOpen(true)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-300 rounded-lg flex items-center text-xs font-bold transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-1.5 text-indigo-700" />
                      Member Privacy Controls
                    </button>
                    <button
                      onClick={() => handleOpenUploader('image')}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center text-xs font-bold shadow-2xs transition-colors"
                    >
                      <ArrowUpTrayIcon className="h-4 w-4 mr-1.5" />
                      Upload Content
                    </button>
                  </div>
                </div>

                <UGCContentStudio onOpenUploadModal={() => handleOpenUploader('image')} />
              </div>

              {/* Publishing Tools */}
              <div className="pt-4 border-t border-slate-300">
                <h2 className="text-lg font-black text-slate-900 mb-3">Publishing Tools & Monetization Gateway</h2>
                <UGCPublishingTools />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900">Analytics Dashboard</h2>
              <UGCAnalyticsDashboard />
            </div>
          )}

          {activeTab === 'monetization' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900">Monetization Panel & Settlement</h2>
              <UGCMonetizationPanel />
            </div>
          )}

          {activeTab === 'scheduler' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900">Content Scheduler & Dispatcher</h2>
              <UGCScheduler />
            </div>
          )}
        </div>
      </div>

      {/* Direct PostgreSQL Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">
                  Upload Media to PostgreSQL Ledger
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Content Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['image', 'video', 'audio'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setUploadCategory(cat)}
                      className={`py-2 px-3 text-xs font-black rounded-lg border capitalize transition-all ${
                        uploadCategory === cat
                          ? 'border-blue-600 bg-blue-50 text-blue-950 shadow-2xs ring-1 ring-blue-600'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Title / Caption
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Summer Festival Highlight Reel"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* File input dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Select Media File
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={uploadCategory === 'image' ? 'image/*' : uploadCategory === 'video' ? 'video/*' : 'audio/*'}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30"
                >
                  {selectedFile ? (
                    <div className="space-y-1">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <p className="text-xs font-black text-slate-900">{selectedFile.name}</p>
                      <p className="text-[11px] font-bold text-slate-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-800">
                        Click to browse or drag and drop
                      </p>
                      <p className="text-[11px] font-medium text-slate-600">
                        {uploadCategory === 'image' ? 'PNG, JPG, WEBP up to 50MB' : uploadCategory === 'video' ? 'MP4, MOV up to 100MB' : 'MP3, WAV, OGG up to 50MB'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isSubmittingUpload}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-black shadow-2xs transition-colors"
                >
                  {isSubmittingUpload ? 'Persisting to PostgreSQL...' : 'Upload & Persist Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      <UGCPrivacyControlModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        contentType="post"
        contentId="default_ugc_post"
      />
    </div>
  );
};

export default UGCDashboardPage;
