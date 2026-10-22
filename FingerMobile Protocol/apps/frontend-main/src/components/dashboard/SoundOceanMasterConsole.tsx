import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Diamond,
  Disc,
  Layers,
  Coins,
  ShieldCheck,
  Download,
  Users,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sliders,
  ExternalLink,
  Lock,
  FileArchive,
  X,
  CreditCard,
  Hash
} from 'lucide-react';

interface SoundOceanMaster {
  id: string;
  title: string;
  artist: string;
  genre: string;
  format: string;
  bitDepth: number;
  sampleRateKhz: number;
  uncompressedSizeMb: number;
  audioUrl: string;
  coverArt: string;
  stemVaultFile: string;
  stemChannels: string[];
  ficPrice: number;
  royaltyCreatorSplitPct: number;
  royaltyTreasurySplitPct: number;
  smartContractAddress: string;
  totalFICDistributed: number;
  plays: number;
  masterDownloads: number;
  isSovereignProtected: boolean;
  seshatSeal: string;
  created_at: string;
}

interface RoyaltyRecord {
  id: string;
  masterId: string;
  trackTitle: string;
  recipient: string;
  amountFIC: number;
  rateSplitPct: number;
  status: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
}

interface MySubCrew {
  id: string;
  crewName: string;
  managerId: string;
  allocatedSeats: number;
  activeSeatsUsed: number;
  members: string[];
  monthlyPassFIC: number;
  offlineStemQuotaPerMonth: number;
  expiresAt: string;
}

interface SoundOceanTelemetry {
  tier: string;
  audioQuality: string;
  accessModel: string;
  totalMasters: number;
  totalFICDistributed: number;
  totalStemDownloads: number;
  activeMySubCrewPasses: number;
  audiophileBandwidthTbps: number;
  avgCreatorRoyaltySplit: string;
  stemVaultFormats: string[];
  sovereignSecurity: string;
  timestamp: string;
}

export const SoundOceanMasterConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'masters' | 'stemvault' | 'royalties' | 'mysub' | 'exports'>('masters');
  const [telemetry, setTelemetry] = useState<SoundOceanTelemetry | null>(null);
  const [masters, setMasters] = useState<SoundOceanMaster[]>([]);
  const [royalties, setRoyalties] = useState<RoyaltyRecord[]>([]);
  const [crews, setCrews] = useState<MySubCrew[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Upload Studio Master Form state (multipart/form-data)
  const [masterTitle, setMasterTitle] = useState('');
  const [masterArtist, setMasterArtist] = useState('');
  const [masterGenre, setMasterGenre] = useState('Symphonic Fusion');
  const [masterBitDepth, setMasterBitDepth] = useState('24');
  const [masterSampleRate, setMasterSampleRate] = useState('192');
  const [masterFicPrice, setMasterFicPrice] = useState('15.0');
  const [masterRoyaltySplit, setMasterRoyaltySplit] = useState('85.0');
  const [masterStemChannels, setMasterStemChannels] = useState('Lead, Drums, Bassline, Horns, Ambient FX');
  const [selectedMasterFile, setSelectedMasterFile] = useState<File | null>(null);
  const [selectedStemArchive, setSelectedStemArchive] = useState<File | null>(null);
  const [isSubmittingMaster, setIsSubmittingMaster] = useState(false);
  const masterFileInputRef = useRef<HTMLInputElement>(null);
  const stemFileInputRef = useRef<HTMLInputElement>(null);

  // MySub Crew Modal state
  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const [newCrewName, setNewCrewName] = useState('');
  const [newCrewCost, setNewCrewCost] = useState('45.0');

  // Distribution trigger state
  const [isDistributing, setIsDistributing] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [telRes, mastersRes, royRes, crewRes] = await Promise.all([
        fetch('http://localhost:5001/api/beatwave/soundocean/telemetry').then(r => r.json()),
        fetch('http://localhost:5001/api/beatwave/soundocean/masters').then(r => r.json()),
        fetch('http://localhost:5001/api/beatwave/soundocean/fic-royalties').then(r => r.json()),
        fetch('http://localhost:5001/api/beatwave/soundocean/mysub/crews').then(r => r.json())
      ]);

      if (telRes.success) setTelemetry(telRes.data);
      if (mastersRes.success) setMasters(mastersRes.data || []);
      if (royRes.success) setRoyalties(royRes.data || []);
      if (crewRes.success) setCrews(crewRes.data || []);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed to load SoundOcean data: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showNotification = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // 1. Submit Studio Master Upload (multipart/form-data)
  const handleUploadMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterTitle.trim() || !masterArtist.trim()) {
      showNotification('error', 'Master title and artist are required.');
      return;
    }

    setIsSubmittingMaster(true);
    try {
      const formData = new FormData();
      formData.append('title', masterTitle);
      formData.append('artist', masterArtist);
      formData.append('genre', masterGenre);
      formData.append('bitDepth', masterBitDepth);
      formData.append('sampleRateKhz', masterSampleRate);
      formData.append('ficPrice', masterFicPrice);
      formData.append('royaltyCreatorSplitPct', masterRoyaltySplit);
      formData.append('stemChannels', masterStemChannels);

      if (selectedMasterFile) {
        formData.append('masterAudio', selectedMasterFile);
      }
      if (selectedStemArchive) {
        formData.append('stemArchive', selectedStemArchive);
      }

      const res = await fetch('http://localhost:5001/api/beatwave/soundocean/upload-master', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        showNotification('success', 'Studio Master FLAC and Stem Vault archive published to SoundOcean!');
        setMasterTitle('');
        setMasterArtist('');
        setSelectedMasterFile(null);
        setSelectedStemArchive(null);
        if (masterFileInputRef.current) masterFileInputRef.current.value = '';
        if (stemFileInputRef.current) stemFileInputRef.current.value = '';
        fetchData();
      } else {
        showNotification('error', data.message || 'Master upload failed.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsSubmittingMaster(false);
    }
  };

  // 2. Delete / Revoke Master
  const handleDeleteMaster = async (id: string) => {
    if (!window.confirm('Revoke this master from SoundOcean?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/beatwave/soundocean/masters/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Master revoked.');
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // 3. Trigger Royalty Batch Distribution
  const handleDistributeRoyalties = async (masterId?: string) => {
    setIsDistributing(true);
    try {
      const res = await fetch('http://localhost:5001/api/beatwave/soundocean/fic-royalties/distribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterId, amountFIC: 150.0 })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', data.message);
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsDistributing(false);
    }
  };

  // 4. Generate MySub 5-Seat Crew Pass
  const handleCreateCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrewName.trim()) return;

    try {
      const res = await fetch('http://localhost:5001/api/beatwave/soundocean/mysub/crews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crewName: newCrewName, monthlyPassFIC: newCrewCost })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'MySub 5-Seat Sovereign Crew Pass generated!');
        setIsCrewModalOpen(false);
        setNewCrewName('');
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-950 border border-indigo-400">
            <Diamond className="w-7 h-7 text-indigo-900" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              SoundOcean MasterDashboard Console
            </h1>
            <p className="text-sm font-semibold text-slate-700">
              Sovereign Master Tier: 24-bit/192kHz Studio FLAC, Stem Vault (.fmbw/.fma), Web3 FIC Royalties & MySub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 text-slate-700 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => handleDistributeRoyalties()}
            disabled={isDistributing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Coins className="w-4 h-4" />
            Distribute FIC Royalties
          </button>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
              : 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{statusMessage.text}</span>
          </div>
          <button type="button" onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      )}

      {/* Sovereign Master Tier Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Master Fidelity</p>
          <p className="text-lg font-black text-indigo-950 mt-1">24-bit / 192kHz</p>
          <span className="text-[11px] font-bold text-indigo-800">Studio FLAC Lossless</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Creator Royalties</p>
          <p className="text-2xl font-black text-emerald-950 mt-1">85% – 90%</p>
          <span className="text-[11px] font-bold text-emerald-800">Direct Smart Contract</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">FIC Distributed</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{(telemetry?.totalFICDistributed ?? 0).toLocaleString()} FIC</p>
          <span className="text-[11px] font-bold text-emerald-800">Immutable Ledger</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Studio Masters</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{telemetry?.totalMasters ?? masters.length}</p>
          <span className="text-[11px] font-bold text-blue-800">Certified Catalog</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Stem Downloads</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{telemetry?.totalStemDownloads ?? 0}</p>
          <span className="text-[11px] font-bold text-purple-800">.fmbw / .fma Vault</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">MySub 5-Seat</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{telemetry?.activeMySubCrewPasses ?? crews.length}</p>
          <span className="text-[11px] font-bold text-amber-800">Sovereign Crews</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Seshat Seal</p>
          <p className="text-xl font-black text-purple-950 mt-1">VERIFIED</p>
          <span className="text-[11px] font-bold text-purple-800">Immutable Proof</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-300 pb-2">
        {[
          { id: 'masters', label: 'Studio Master Vault', icon: Diamond },
          { id: 'stemvault', label: 'Stem Vault & Master Upload', icon: Layers },
          { id: 'royalties', label: 'Web3 FIC Royalty Governance', icon: Coins },
          { id: 'mysub', label: 'MySub 5-Seat Sovereign Crew', icon: Users },
          { id: 'exports', label: 'Sovereign Export Engine', icon: Download }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
                isActive
                  ? 'bg-indigo-950 text-white border-indigo-950 shadow-md'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-300' : 'text-slate-700'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STUDIO MASTER VAULT */}
      {activeTab === 'masters' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Diamond className="w-5 h-5 text-indigo-700" />
                SoundOcean Certified Studio Master Catalog
              </h2>
              <p className="text-sm font-semibold text-slate-700">
                Audited studio recordings in 24-bit/192kHz uncompressed FLAC with cryptographic Seshat provenance seals.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('stemvault')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700 text-white font-bold hover:bg-indigo-800 transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Studio Master
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Master Title / Artist</th>
                  <th className="py-3 px-4">Fidelity Format</th>
                  <th className="py-3 px-4">Stem Channels</th>
                  <th className="py-3 px-4">FIC Price</th>
                  <th className="py-3 px-4">Royalty Split</th>
                  <th className="py-3 px-4">Seshat Seal</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
                {masters.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900">{m.title}</p>
                        <p className="text-xs text-slate-700 font-semibold">{m.artist}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-950 border border-indigo-400">
                        {m.format}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {m.stemChannels.slice(0, 3).map((chan, i) => (
                          <span key={i} className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300">
                            {chan}
                          </span>
                        ))}
                        {m.stemChannels.length > 3 && (
                          <span className="text-[11px] font-bold text-slate-700">+{m.stemChannels.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{m.ficPrice} FIC</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-900">{m.royaltyCreatorSplitPct}% to Creator</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-purple-900 font-bold">{m.seshatSeal}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteMaster(m.id)}
                        className="p-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 text-rose-700 hover:text-rose-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STEM VAULT & MASTER UPLOAD */}
      {activeTab === 'stemvault' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-700" />
              Upload Studio Master FLAC & Stem Vault Archive (multipart/form-data)
            </h2>
            <p className="text-sm font-semibold text-slate-700">
              Submit 24-bit/192kHz studio FLAC uncompressed audio along with multi-track DAW stem archives (<code>.fmbw</code> or <code>.fma</code>).
            </p>

            <form onSubmit={handleUploadMaster} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Master Track Title *</label>
                  <input
                    type="text"
                    required
                    value={masterTitle}
                    onChange={e => setMasterTitle(e.target.value)}
                    placeholder="e.g. Kingdom of Benin (Symphonic Master)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Master Artist / Ensemble *</label>
                  <input
                    type="text"
                    required
                    value={masterArtist}
                    onChange={e => setMasterArtist(e.target.value)}
                    placeholder="e.g. Edo Philharmonic & DJ SoundOcean"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Bit Depth</label>
                  <select
                    value={masterBitDepth}
                    onChange={e => setMasterBitDepth(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                  >
                    <option value="24">24-bit (Audiophile Lossless)</option>
                    <option value="32">32-bit Float (DAW Master)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Sample Rate</label>
                  <select
                    value={masterSampleRate}
                    onChange={e => setMasterSampleRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                  >
                    <option value="192">192 kHz (Ultra High-Res)</option>
                    <option value="96">96 kHz (Studio Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Sovereign FIC Price</label>
                  <input
                    type="number"
                    step="0.5"
                    value={masterFicPrice}
                    onChange={e => setMasterFicPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Creator Royalty Split %</label>
                  <input
                    type="number"
                    value={masterRoyaltySplit}
                    onChange={e => setMasterRoyaltySplit(e.target.value)}
                    placeholder="85.0"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Stem Channel Mapping (Comma Separated)
                </label>
                <input
                  type="text"
                  value={masterStemChannels}
                  onChange={e => setMasterStemChannels(e.target.value)}
                  placeholder="Drums & Percussion, Bassline, Horns, Lead Vocals, Ambient FX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                />
              </div>

              {/* Two File Inputs: Master FLAC and Stem Archive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Disc className="w-5 h-5 text-indigo-700" />
                    <span className="font-bold text-sm text-slate-900">Master Audio File (FLAC / ALAC / WAV)</span>
                  </div>
                  <input
                    ref={masterFileInputRef}
                    type="file"
                    accept=".flac,.wav,.m4a,audio/*"
                    onChange={e => setSelectedMasterFile(e.target.files ? e.target.files[0] : null)}
                    className="text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-700 file:text-white"
                  />
                </div>

                <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileArchive className="w-5 h-5 text-purple-700" />
                    <span className="font-bold text-sm text-slate-900">Stem Archive (.fmbw, .fma, or .zip)</span>
                  </div>
                  <input
                    ref={stemFileInputRef}
                    type="file"
                    accept=".fmbw,.fma,.zip,.tar.gz"
                    onChange={e => setSelectedStemArchive(e.target.files ? e.target.files[0] : null)}
                    className="text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-purple-700 file:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingMaster}
                className="px-6 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-sm transition-colors shadow-md flex items-center gap-2"
              >
                {isSubmittingMaster ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isSubmittingMaster ? 'Encrypting & Depositing...' : 'Deposit Studio Master & Stems'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: WEB3 FIC ROYALTY GOVERNANCE */}
      {activeTab === 'royalties' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-700" />
                Web3 FIC Smart Contract Royalty Ledger
              </h2>
              <p className="text-sm font-semibold text-slate-700">
                Audited direct fan-tipping and 80%+ creator split disbursements settled in FIC tokens on-chain.
              </p>
            </div>
            <button
              onClick={() => handleDistributeRoyalties()}
              disabled={isDistributing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Coins className="w-4 h-4" />
              Trigger Royalty Payout Batch
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Tx Hash / Block</th>
                  <th className="py-3 px-4">Master Track</th>
                  <th className="py-3 px-4">Beneficiary</th>
                  <th className="py-3 px-4">Amount FIC</th>
                  <th className="py-3 px-4">Split %</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
                {royalties.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-indigo-900 font-bold">
                      <div>{r.txHash.slice(0, 14)}...</div>
                      <span className="text-slate-700">Block #{r.blockNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.trackTitle}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{r.recipient}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-950">+{r.amountFIC} FIC</td>
                    <td className="py-3.5 px-4 font-bold text-blue-900">{r.rateSplitPct}%</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-700">
                      {new Date(r.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MYSUB 5-SEAT CREW PASSES */}
      {activeTab === 'mysub' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-700" />
                MySub 5-Seat Sovereign Crew Passes
              </h2>
              <p className="text-sm font-semibold text-slate-700">
                Audiophile group licenses: share lossless master access and stem downloads with up to 5 collaborators or bandmates.
              </p>
            </div>
            <button
              onClick={() => setIsCrewModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Generate 5-Seat Pass
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crews.map(c => (
              <div key={c.id} className="p-5 rounded-xl border border-slate-300 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-950 border border-amber-400">
                    {c.activeSeatsUsed} / {c.allocatedSeats} Seats Occupied
                  </span>
                  <span className="text-xs font-bold text-slate-900">{c.monthlyPassFIC} FIC / Month</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{c.crewName}</h3>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-800 mb-1">Authorized Crew Members:</p>
                  <div className="flex flex-wrap gap-1">
                    {c.members.map((m, i) => (
                      <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SOVEREIGN EXPORT ENGINE */}
      {activeTab === 'exports' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-700" />
              Sovereign Master Export Engine (.fmbw / .fma)
            </h2>
            <p className="text-sm font-semibold text-slate-700">
              Export high-fidelity studio stems into sovereign container formats for local DAW editing and immutable cold storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
              <span className="font-bold text-sm text-slate-900">.fmbw Sovereign Stems</span>
              <p className="text-xs text-slate-700">Multi-track encrypted container containing isolated drum, vocal, and synth tracks.</p>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-950 border border-indigo-400">
                DAW Direct Import
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
              <span className="font-bold text-sm text-slate-900">.fma Sovereign Audio</span>
              <p className="text-xs text-slate-700">Lossless 24-bit/192kHz standalone audio file with embedded cryptographic watermark.</p>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-950 border border-purple-400">
                Offline Audiophile
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
              <span className="font-bold text-sm text-slate-900">MyDownloads Vault</span>
              <p className="text-xs text-slate-700">All purchased stems are synchronized to the member's sovereign local folder.</p>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                Permanent Access
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MYSUB CREW */}
      {isCrewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Generate 5-Seat Sovereign Crew Pass</h3>
              <button type="button" onClick={() => setIsCrewModalOpen(false)}>
                <X className="w-5 h-5 text-slate-700 hover:text-slate-900" />
              </button>
            </div>

            <form onSubmit={handleCreateCrew} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Crew Name *</label>
                <input
                  type="text"
                  required
                  value={newCrewName}
                  onChange={e => setNewCrewName(e.target.value)}
                  placeholder="e.g. Accra Mastering Studio Crew"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Monthly Cost in FIC</label>
                <input
                  type="number"
                  value={newCrewCost}
                  onChange={e => setNewCrewCost(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCrewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-extrabold hover:bg-amber-700 shadow-sm"
                >
                  Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundOceanMasterConsole;
