import React, { useState } from 'react';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  BookmarkIcon,
  SwatchIcon,
  SparklesIcon,
  ShieldIcon
} from '../../icons';
import { TributPinItem, UserProjectBoard } from '../../data/tributData';

interface TributDownloadModalProps {
  pin: TributPinItem | null;
  board?: UserProjectBoard | null;
  allPins: TributPinItem[];
  onClose: () => void;
}

export const TributDownloadModal: React.FC<TributDownloadModalProps> = ({
  pin,
  board,
  allPins,
  onClose
}) => {
  const [downloadFormat, setDownloadFormat] = useState<'image' | 'blueprint' | 'palette' | 'full-bundle'>('full-bundle');
  const [isExporting, setIsExporting] = useState(false);

  const activeTargetName = pin ? pin.title : board ? board.name : 'Curated Design Project';

  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      if (downloadFormat === 'image' && pin) {
        // Trigger image download
        const a = document.createElement('a');
        a.href = pin.mediaUrl;
        a.download = `${pin.title.replace(/\s+/g, '_')}_4K.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (downloadFormat === 'blueprint' && pin) {
        // Generate JSON design blueprint
        const blueprint = {
          protocol: 'FingerMobile Sovereign Tribut',
          pinId: pin.id,
          title: pin.title,
          category: pin.categoryLabel,
          author: pin.author,
          colorPalette: pin.colorPalette || ['#1A2B4C', '#28467A'],
          promptRecipe: pin.promptRecipe || 'N/A',
          guardianScore: pin.pillars.overallGuardianScore,
          shelfLifeDays: pin.metrics.shelfLifeDays,
          shopping: pin.shopping || null,
          tags: pin.tags,
          exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pin.title.replace(/\s+/g, '_')}_Design_Blueprint.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (downloadFormat === 'palette' && pin) {
        // Generate CSS palette variables
        const palette = pin.colorPalette || ['#1A2B4C', '#28467A'];
        const cssContent = `:root {\n${palette.map((c, i) => `  --pin-color-${i + 1}: ${c};`).join('\n')}\n}\n/* Exported from FingerMobile Tribut for "${pin.title}" */`;
        const blob = new Blob([cssContent], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pin.title.replace(/\s+/g, '_')}_palette.css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Full project board bundle
        const bundleManifest = {
          boardName: board ? board.name : pin?.boardName || 'Sovereign Tribut Lookbook',
          purpose: board ? board.purpose : 'Design Ideation',
          prioritizedItems: (pin ? [pin] : allPins.slice(0, 5)).map((p, idx) => ({
            priorityRank: idx + 1,
            id: p.id,
            title: p.title,
            mediaUrl: p.mediaUrl,
            promptRecipe: p.promptRecipe,
            colorPalette: p.colorPalette,
            creator: p.author.name
          })),
          exportedBy: 'Ibrahim Danjuma (FingerMobile Member)',
          timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(bundleManifest, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(board ? board.name : pin?.boardName || 'Project_Board').replace(/\s+/g, '_')}_Full_Package.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setIsExporting(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-300 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
              Design Asset Downloader
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Download Prioritized Asset / Board
            </h3>
            <p className="text-xs text-slate-700 mt-1 truncate max-w-sm">
              Target: <strong>{activeTargetName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3 text-xs">
          <label
            onClick={() => setDownloadFormat('full-bundle')}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              downloadFormat === 'full-bundle'
                ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500'
                : 'bg-white border-slate-300 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              checked={downloadFormat === 'full-bundle'}
              onChange={() => setDownloadFormat('full-bundle')}
              className="mt-0.5 text-purple-600 focus:ring-purple-500"
            />
            <div className="space-y-1">
              <strong className="text-slate-900 block font-black">
                Full Design Project Lookbook Bundle (.JSON Manifest)
              </strong>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                Includes all prioritized high-res pins, prompt recipes, color hex tokens, creator attribution, and affiliate Buy & Share referral paths.
              </p>
            </div>
          </label>

          <label
            onClick={() => setDownloadFormat('image')}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              downloadFormat === 'image'
                ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500'
                : 'bg-white border-slate-300 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              checked={downloadFormat === 'image'}
              onChange={() => setDownloadFormat('image')}
              className="mt-0.5 text-purple-600 focus:ring-purple-500"
            />
            <div className="space-y-1">
              <strong className="text-slate-900 block font-black">
                Original High-Resolution 4K Media File
              </strong>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                Direct lossless artwork download for printing, moodboards, or CAD references.
              </p>
            </div>
          </label>

          <label
            onClick={() => setDownloadFormat('blueprint')}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              downloadFormat === 'blueprint'
                ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500'
                : 'bg-white border-slate-300 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              checked={downloadFormat === 'blueprint'}
              onChange={() => setDownloadFormat('blueprint')}
              className="mt-0.5 text-purple-600 focus:ring-purple-500"
            />
            <div className="space-y-1">
              <strong className="text-slate-900 block font-black">
                AI Prompt Recipe & Algorithmic Scorecard (.JSON)
              </strong>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                Complete generative lighting prompt, Guardian AI 5-pillar scores, and metadata.
              </p>
            </div>
          </label>

          <label
            onClick={() => setDownloadFormat('palette')}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              downloadFormat === 'palette'
                ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500'
                : 'bg-white border-slate-300 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              checked={downloadFormat === 'palette'}
              onChange={() => setDownloadFormat('palette')}
              className="mt-0.5 text-purple-600 focus:ring-purple-500"
            />
            <div className="space-y-1">
              <strong className="text-slate-900 block font-black">
                Color Palette CSS Variables (.CSS)
              </strong>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                Ready-to-use CSS tokens extracted from the design's skin tone / aesthetic swatches.
              </p>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownload}
            className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            {isExporting ? 'Packaging Assets...' : 'Download Assets'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TributDownloadModal;
