import React, { useState } from 'react';
import { X, Award, Upload, Check, AlertCircle, Palette, Lock } from 'lucide-react';
import { MemberPage } from '../../../types/roles-permissions';

interface CreateBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBadge: (data: {
    name: string;
    description: string;
    iconSvg?: string;
    bgColor: string;
    textColor: string;
    badgeAccessEnabled: boolean;
    accessiblePageIds: string[];
  }) => Promise<void>;
  memberPages: MemberPage[];
}

const PRESET_ICONS = [
  {
    name: 'Star',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  },
  {
    name: 'Shield / Coach',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  },
  {
    name: 'Award / Medal',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
  },
  {
    name: 'Crown / VIP',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path></svg>',
  },
  {
    name: 'Flame / Trendsetter',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
  },
];

const PRESET_COLORS = [
  '#2563EB', // Blue
  '#059669', // Emerald
  '#D97706', // Amber
  '#7C3AED', // Purple
  '#E11D48', // Rose
  '#0284C7', // Sky
  '#0F172A', // Slate
  '#16A34A', // Green
];

export const CreateBadgeModal: React.FC<CreateBadgeModalProps> = ({
  isOpen,
  onClose,
  onCreateBadge,
  memberPages,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'access'>('details');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bgColor, setBgColor] = useState('#2563EB');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [selectedIconSvg, setSelectedIconSvg] = useState(PRESET_ICONS[0].svg);
  const [badgeAccessEnabled, setBadgeAccessEnabled] = useState(false);
  const [accessiblePageIds, setAccessiblePageIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 250 * 1024) {
        setError('SVG file exceeds maximum allowed size of 250KB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const svgContent = event.target?.result as string;
        setSelectedIconSvg(svgContent);
      };
      reader.readAsText(file);
    }
  };

  const handleTogglePage = (pageId: string) => {
    if (accessiblePageIds.includes(pageId)) {
      setAccessiblePageIds(accessiblePageIds.filter((id) => id !== pageId));
    } else {
      setAccessiblePageIds([...accessiblePageIds, pageId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Badge name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onCreateBadge({
        name: name.trim(),
        description: description.trim(),
        iconSvg: selectedIconSvg,
        bgColor,
        textColor,
        badgeAccessEnabled,
        accessiblePageIds: badgeAccessEnabled ? accessiblePageIds : [],
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create badge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Create Member Badge</span>
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
              Reward member milestones and grant exclusive privileges.
            </p>
          </div>
          <button type="button" aria-label="Close"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-300 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-800/30">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 text-xs font-bold border-b-2 mr-6 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Badge Info & Design
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('access')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'access'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Page Access Privileges</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-300 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'details' && (
            <>
              {/* Badge Live Preview */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Live Preview
                </div>
                <div
                  className="px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-bold shadow-md transition-all"
                  style={{ backgroundColor: bgColor, color: textColor }}
                >
                  <span
                    className="w-3.5 h-3.5 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: selectedIconSvg }}
                  />
                  <span>{name || 'Badge Title'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                  Badge Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified Superstar, Coach, Organizer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what milestone this badge acknowledges..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Icon Selector / SVG Upload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Badge Icon
                  </label>
                  <label className="text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload SVG (Max 250KB)</span>
                    <input
                      type="file"
                      accept=".svg"
                      onChange={handleFileUpload}
                      className="sr-only text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {PRESET_ICONS.map((icon, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedIconSvg(icon.svg)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                        selectedIconSvg === icon.svg
                          ? 'border-blue-600 bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-bold shadow-sm'
                          : 'border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                      }`}
                    >
                      <span
                        className="w-4 h-4"
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                      />
                      <span className="text-[9px] truncate w-full text-center font-bold">
                        {icon.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Customization */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'access' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    Enable Badge Page Access
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">
                    Holders of this badge will automatically unlock the checked members-only pages.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={badgeAccessEnabled}
                  onChange={(e) => setBadgeAccessEnabled(e.target.checked)}
                  className="w-5 h-5 text-slate-900 rounded cursor-pointer border-slate-300 font-bold border bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                />
              </div>

              {badgeAccessEnabled && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Select Unlockable Pages:
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                    {memberPages.map((page) => {
                      const isChecked = accessiblePageIds.includes(page.id);
                      return (
                        <div
                          key={page.id}
                          onClick={() => handleTogglePage(page.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isChecked
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40'
                              : 'border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {page.title}
                            </div>
                            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-mono font-semibold">
                              {page.path}
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                              isChecked
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-slate-400 dark:border-slate-600'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-300 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Saving...' : 'Save Badge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
