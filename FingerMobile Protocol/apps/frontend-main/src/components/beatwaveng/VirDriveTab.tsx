import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Clock,
  Download,
  Key,
  Trash2,
  FileAudio,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Sparkles
} from 'lucide-react';
import { useBeatwaveNG, VirDriveFolder } from '../../contexts/BeatwaveNGContext';

export const VirDriveTab: React.FC = () => {
  const { virDrives, createVirDrive, deleteVirDrive } = useBeatwaveNG();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [driveName, setDriveName] = useState('');
  const [durationDays, setDurationDays] = useState<3 | 7>(3);
  const [pinProtected, setPinProtected] = useState(true);
  const [pinCode, setPinCode] = useState('394812');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveName.trim()) return;
    await createVirDrive(
      driveName.trim(),
      durationDays,
      pinProtected,
      pinProtected ? pinCode : undefined
    );
    setDriveName('');
    setShowCreateModal(false);
  };

  const handleDownloadFile = (fileName: string, sovereignExt: string) => {
    const payload = `FINGERMOBILE_SOVEREIGN_VIRDRIVE_PAYLOAD\nFILE: ${fileName}\nEXT: ${sovereignExt}\nEXPORTED_FROM: VirDrive Temporal Cache\nTIMESTAMP: ${new Date().toISOString()}`;
    const blob = new Blob([payload], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\s+/g, '_').toLowerCase()}${sovereignExt}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-950/70 via-slate-900 to-indigo-950/70 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-black uppercase tracking-wider border border-sky-500/40 flex items-center gap-1.5">
              <FolderGit2 size={14} />
              VirDrive Temporal Virtual Storage
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              3 or 7-Day Auto TTL
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Encrypted Temporal Stems & Media Drives
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Share unreleased master stems, audio samples, and sessions with collaborators. VirDrives automatically vaporize after 3 or 7 days unless exported to your sovereign offline device cache.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-sky-600/30 shrink-0"
        >
          <Plus size={16} />
          Create New VirDrive
        </button>
      </div>

      {/* VirDrives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {virDrives.map((drive) => {
          const daysPercent = Math.round((drive.daysRemaining / drive.durationDays) * 100);
          return (
            <div
              key={drive.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 space-y-4 transition-all shadow-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400">
                    <FolderGit2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{drive.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mt-0.5">
                      <span>Owner: #{drive.ownerPin}</span>
                      <span>•</span>
                      <span>{drive.totalSizeMb} MB</span>
                      <span>•</span>
                      <span>{drive.downloadCount} Downloads</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {drive.pinProtected && (
                    <span className="px-2 py-1 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Key size={10} />
                      PIN: {drive.pin}
                    </span>
                  )}
                  <button
                    onClick={() => deleteVirDrive(drive.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-300 transition-colors"
                    title="Delete VirDrive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* TTL Countdown Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-sky-300">
                    <Clock size={13} />
                    {drive.daysRemaining} of {drive.durationDays} Days Remaining
                  </span>
                  <span className="text-[11px] font-mono text-slate-300 font-medium">
                    {drive.durationDays}-Day Temporal TTL
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      drive.daysRemaining <= 1 ? 'bg-red-500' : 'bg-gradient-to-r from-sky-400 to-indigo-500'
                    }`}
                    style={{ width: `${daysPercent}%` }}
                  />
                </div>
              </div>

              {/* Files in Folder */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">
                  Contents ({drive.files.length} Master Files)
                </span>

                {drive.files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileAudio size={16} className="text-sky-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">{file.title}</div>
                        <div className="text-[11px] text-slate-300 font-medium truncate">
                          {file.artist} • {file.duration} • {file.sizeMb} MB
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadFile(file.title, file.sovereignExt)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-600 hover:text-white text-sky-300 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
                    >
                      <Download size={13} />
                      {file.sovereignExt}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create VirDrive Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Create Temporal VirDrive Folder</h3>
            <p className="text-xs text-slate-300 font-medium">
              Select temporal lifespan (3 or 7 days). Files automatically expire once TTL elapses.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Folder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lagos Sessions Stems Part 2"
                  value={driveName}
                  onChange={(e) => setDriveName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">TTL Lifespan</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setDurationDays(3)}
                    className={`p-3 rounded-2xl border cursor-pointer text-center transition-all ${
                      durationDays === 3
                        ? 'bg-sky-950/60 border-sky-400 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 font-medium'
                    }`}
                  >
                    <div className="text-sm font-black text-sky-400">3 Days</div>
                    <div className="text-[10px] text-slate-300 font-medium mt-0.5">Quick Collaboration</div>
                  </div>

                  <div
                    onClick={() => setDurationDays(7)}
                    className={`p-3 rounded-2xl border cursor-pointer text-center transition-all ${
                      durationDays === 7
                        ? 'bg-sky-950/60 border-sky-400 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 font-medium'
                    }`}
                  >
                    <div className="text-sm font-black text-indigo-400">7 Days</div>
                    <div className="text-[10px] text-slate-300 font-medium mt-0.5">Extended Studio Pass</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">PIN Protection</label>
                  <input
                    type="checkbox"
                    checked={pinProtected}
                    onChange={(e) => setPinProtected(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-sky-500"
                  />
                </div>
                {pinProtected && (
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-amber-300 font-bold"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30"
                >
                  Create VirDrive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirDriveTab;
