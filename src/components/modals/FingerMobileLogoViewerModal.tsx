import React, { useState } from 'react';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  Sparkles,
  FileCode,
  Image as ImageIcon,
  Sun,
  Moon,
  Grid,
} from 'lucide-react';

interface LogoVariant {
  id: string;
  name: string;
  format: string;
  resolution: string;
  description: string;
  src: string;
  downloadFilename: string;
  theme: 'white' | 'orange' | 'emblem';
}

const LOGO_VARIANTS: LogoVariant[] = [
  {
    id: 'white-front',
    name: 'FingerMobile White Master Logo (UHD)',
    format: 'WebP / Transparent PNG',
    resolution: '3840 × 2160 (4K)',
    description: 'High-contrast white emblem designed for dark and saturated backgrounds, keynotes, and video title cards.',
    src: '/assets/branding/fingermobile/FingerMobile White Logo FRONT.webp',
    downloadFilename: 'FingerMobile_White_Logo_4K_UHD.webp',
    theme: 'white',
  },
  {
    id: 'orange-primary',
    name: 'FingerMobile Orange Sovereign Brand Mark',
    format: 'High-Res WebP / PNG',
    resolution: '3840 × 2160 (4K)',
    description: 'Official sovereign electric-orange brand emblem (#ff6b00) for platform banners, marketing, and merchandise.',
    src: '/assets/branding/fingermobile/FingerMobile orange logo.webp',
    downloadFilename: 'FingerMobile_Orange_Sovereign_4K.webp',
    theme: 'orange',
  },
  {
    id: 'emblem-full',
    name: 'FingerMobile Protocol Shield Emblem',
    format: 'Lossless PNG',
    resolution: '2048 × 2048 (2K Retina)',
    description: 'Cryptographic protocol seal, official verification badge, and institutional app launcher icon.',
    src: '/assets/branding/fingermobile/fingermobile_emblem.png',
    downloadFilename: 'FingerMobile_Protocol_Shield_Emblem.png',
    theme: 'emblem',
  },
];

interface FingerMobileLogoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FingerMobileLogoViewerModal: React.FC<FingerMobileLogoViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<LogoVariant>(LOGO_VARIANTS[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [canvasBackground, setCanvasBackground] = useState<'dark' | 'light' | 'grid'>('dark');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (format: 'original' | 'png' | 'svg') => {
    const link = document.createElement('a');
    link.href = selectedVariant.src;
    link.download = `${selectedVariant.downloadFilename.replace(/\.[^/.]+$/, '')}.${format === 'original' ? 'webp' : format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Downloaded in ${format.toUpperCase()} format!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (direction === 'in') setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
    else if (direction === 'out') setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    else setZoomLevel(1);
  };

  return (
    <div
      id="fingermobile-logo-viewer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-400 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                FingerMobile™ Official HD Brand Assets
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                  4K / UHD Verified
                </span>
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Inspect, preview on multiple backdrops, and download high-resolution brand vectors & marks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Columns (Preview Canvas + Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Canvas: Interactive Image Preview */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
            {/* Canvas Toolbar (Canvas bg toggle + Zoom) */}
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setCanvasBackground('dark')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    canvasBackground === 'dark'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Moon className="w-3 h-3" /> Dark
                </button>
                <button
                  type="button"
                  onClick={() => setCanvasBackground('light')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    canvasBackground === 'light'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Sun className="w-3 h-3" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setCanvasBackground('grid')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    canvasBackground === 'grid'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Grid className="w-3 h-3" /> Grid
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleZoom('out')}
                  className="p-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 px-1.5">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => handleZoom('in')}
                  className="p-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom('reset')}
                  className="p-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="Reset Zoom"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Canvas Stage */}
            <div
              className={`relative rounded-2xl flex items-center justify-center min-h-[320px] sm:min-h-[380px] overflow-hidden border-2 transition-colors ${
                canvasBackground === 'dark'
                  ? 'bg-slate-950 border-slate-800'
                  : canvasBackground === 'light'
                    ? 'bg-slate-50 border-slate-300'
                    : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-white border-slate-300'
              }`}
            >
              <img
                src={selectedVariant.src}
                alt={selectedVariant.name}
                style={{ transform: `scale(${zoomLevel})` }}
                className="max-h-[260px] max-w-[260px] sm:max-h-[320px] sm:max-w-[320px] object-contain transition-transform duration-200 drop-shadow-2xl"
              />

              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-[10px] font-mono border border-slate-700">
                {selectedVariant.resolution}
              </div>
            </div>

            {/* Download Success Pill */}
            {downloadSuccess && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{downloadSuccess}</span>
              </div>
            )}
          </div>

          {/* Right Controls: Variant Selection, Resolution & Download Actions */}
          <div className="lg:col-span-5 p-6 space-y-5 bg-white dark:bg-slate-900">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                Select Brand Mark Variant
              </h4>

              <div className="space-y-2">
                {LOGO_VARIANTS.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVariant(v);
                        setZoomLevel(1);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-orange-50/80 dark:bg-slate-800 border-orange-500 shadow-sm'
                          : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-900 p-1 flex items-center justify-center shrink-0 border border-slate-700">
                        <img src={v.src} alt={v.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {v.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-orange-600 shrink-0" />}
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block mt-0.5">
                          {v.resolution} • {v.format}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Asset Metadata Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Asset Specifications
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedVariant.description}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[9px] uppercase">Format</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedVariant.format}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[9px] uppercase">Color Space</span>
                  <span className="font-bold text-slate-900 dark:text-white">sRGB 4K Ultra HD</span>
                </div>
              </div>
            </div>

            {/* Download Buttons Stack */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleDownload('original')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Ultra HD 4K ({selectedVariant.format.split('/')[0].trim()})</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload('png')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>Lossless PNG</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload('svg')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>Vector SVG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FingerMobileLogoViewerModal;
