import React, { useState } from 'react';
import {
  TributPinItem,
  TributDisplayStyle
} from '../../data/tributData';
import {
  BookmarkIcon,
  SparklesIcon,
  ShoppingBagIcon,
  ArrowsPointingOutIcon
} from '../../icons';
import { Check } from 'lucide-react';

interface TributDisplayStyleRendererProps {
  style: TributDisplayStyle;
  pins: TributPinItem[];
  savedPinIds: string[];
  isSelectMode?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string, e: React.MouseEvent) => void;
  onPinClick: (pin: TributPinItem) => void;
  onMemberClick: (author: TributPinItem['author'], e: React.MouseEvent) => void;
  onToggleSavePin: (pin: TributPinItem, e: React.MouseEvent) => void;
}

export const TributDisplayStyleRenderer: React.FC<TributDisplayStyleRendererProps> = ({
  style,
  pins,
  savedPinIds,
  isSelectMode = false,
  selectedIds = [],
  onToggleSelect,
  onPinClick,
  onMemberClick,
  onToggleSavePin
}) => {
  // Before & After Interactive Slider state (for style === 'before-and-after')
  const [sliderPos, setSliderPos] = useState<number>(50);

  // Clean Card rendering: Pure visual representation by default. Information displayed when clicked on!
  const renderCleanCard = (
    pin: TributPinItem,
    customAspectClass: string = 'aspect-[2/3]',
    customExtraClasses: string = ''
  ) => {
    const isSaved = savedPinIds.includes(pin.id);
    const isSelected = selectedIds.includes(pin.id);

    return (
      <div
        key={pin.id}
        onClick={() => {
          if (isSelectMode && onToggleSelect) {
            onToggleSelect(pin.id, {} as any);
          } else {
            onPinClick(pin);
          }
        }}
        className={`group relative ${customAspectClass} rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border ${
          isSelected
            ? 'ring-4 ring-purple-600 border-purple-500 shadow-purple-900/30'
            : 'border-slate-200 hover:border-purple-300'
        } ${customExtraClasses}`}
      >
        {/* Visual Media */}
        {pin.videoUrl ? (
          <video
            src={pin.videoUrl}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={pin.mediaUrl}
            alt={pin.altText || pin.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Multi-Select Floating Checkbox (Always visible if isSelectMode or isSelected) */}
        {(isSelectMode || isSelected) && (
          <div className="absolute top-2.5 left-2.5 z-30 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect?.(pin.id, e);
              }}
              className={`w-6 h-6 rounded-lg flex items-center justify-center border transition shadow-md ${
                isSelected
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-black/70 border-white/60 text-transparent hover:text-white/70'
              }`}
              title={isSelected ? 'Deselect item' : 'Select item'}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Minimal subtle hover scrim with quick bookmark and member trigger */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3.5 flex flex-col justify-between pointer-events-none">
          {/* Top minimal icons & Guardian AI Rank badge */}
          <div className="flex justify-between items-start pointer-events-auto">
            <div className="flex flex-col gap-1 items-start">
              {/* If not in select mode, allow hover selection toggle */}
              {!isSelectMode && !isSelected && onToggleSelect && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(pin.id, e);
                  }}
                  className="w-5 h-5 rounded-md bg-black/60 border border-white/40 text-transparent hover:text-white/80 hover:bg-black/90 flex items-center justify-center transition mb-1"
                  title="Select for batch action"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              {pin.guardianAiRank && (
                <span className="px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow flex items-center gap-1 border border-purple-400/50">
                  <SparklesIcon className="w-3 h-3 text-amber-300" />
                  #{pin.guardianAiRank} Guardian AI Rank
                </span>
              )}
              {pin.ugcSource && (
                <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-slate-200 text-[9px] font-bold border border-white/10">
                  {pin.ugcSource.platformOrigin}
                </span>
              )}
            </div>
            <button
              onClick={(e) => onToggleSavePin(pin, e)}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow ${
                isSaved
                  ? 'bg-red-600 text-white'
                  : 'bg-black/60 hover:bg-red-600 text-white border border-white/20'
              }`}
              title={isSaved ? 'Saved to board' : 'Save pin'}
            >
              <BookmarkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom minimal reveal on hover */}
          <div className="space-y-1.5 pointer-events-auto">
            <h4 className="text-xs font-black text-white line-clamp-1 drop-shadow-md">
              {pin.title}
            </h4>

            <div className="flex items-center justify-between text-[11px] text-slate-200">
              <button
                onClick={(e) => onMemberClick(pin.author, e)}
                className="flex items-center gap-1.5 hover:text-purple-300 transition text-left group/author"
                title={`View ${pin.author.name}'s Tribut & Projects`}
              >
                <img
                  src={pin.author.avatar}
                  alt={pin.author.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/40"
                />
                <span className="font-semibold underline decoration-white/40 group-hover/author:decoration-purple-300 truncate max-w-[110px]">
                  {pin.author.name}
                </span>
              </button>

              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-bold">
                  {pin.metrics?.saves || 0} saves
                </span>
                <span className="bg-purple-600/90 text-white backdrop-blur-md px-2 py-0.5 rounded-full font-black">
                  Inspect ↗
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ================= 1. GRID-STYLE LAYOUTS (Uniform rows & columns photo wall) =================
  if (style === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {pins.map((pin) => renderCleanCard(pin, 'aspect-[2/3]'))}
      </div>
    );
  }

  // ================= 2. DIPTYCHS AND TRIPTYCHS (Pairing 2 or 3 images side-by-side) =================
  if (style === 'diptych-triptych') {
    // Group pins into diptychs (pairs) and triptychs (triplets)
    const chunks: TributPinItem[][] = [];
    for (let i = 0; i < pins.length; i += 3) {
      chunks.push(pins.slice(i, i + 3));
    }

    return (
      <div className="space-y-8">
        {chunks.map((chunk, idx) => {
          const isTriptych = chunk.length === 3;
          return (
            <div
              key={idx}
              className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  {isTriptych ? 'Sequential Triptych Story' : 'Diptych Contrast Pair'}
                </span>
                <span className="text-slate-600 font-semibold">
                  {chunk[0]?.boardName || 'Curated Design Series'}
                </span>
              </div>

              <div
                className={`grid gap-4 ${
                  isTriptych ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {chunk.map((pin) => renderCleanCard(pin, 'aspect-[3/4]'))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ================= 3. SELF-ADHESIVE (MAGNETIC) PAGES (Peel-back glassmorphic overlay sheets) =================
  if (style === 'magnetic-pages') {
    return (
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-100 via-purple-50/40 to-slate-200 border-2 border-dashed border-slate-300 shadow-inner overflow-hidden">
        {/* Peel-back glassmorphic sheet badge */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-300 text-slate-800 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Peel-Back Clear Magnetic Glass Sheet • Freely Positioned Cutouts</span>
          </div>
          <span className="text-[11px] text-slate-700 font-bold bg-white/70 px-2.5 py-1 rounded-lg border border-slate-300">
            Magnetic Glue-Free Overlay
          </span>
        </div>

        {/* Freely positioned, subtly tilted magnetic photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {pins.map((pin, i) => {
            const rotations = ['rotate-[-2deg]', 'rotate-[1.5deg]', 'rotate-[-1deg]', 'rotate-[2.5deg]', 'rotate-[-3deg]'];
            const rot = rotations[i % rotations.length];

            return (
              <div
                key={pin.id}
                className={`relative transform ${rot} hover:rotate-0 hover:scale-105 transition-all duration-300`}
              >
                {/* Visual Scotch Tape / Magnetic Pin at top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-12 h-4 bg-white/60 backdrop-blur-md border border-slate-300 rounded shadow-sm opacity-90 transform -rotate-1" />

                {/* Peel corner effect */}
                <div className="absolute -bottom-1 -right-1 z-20 w-4 h-4 bg-slate-200 border-t border-l border-slate-400 rounded-tl shadow-sm" />

                {renderCleanCard(pin, 'aspect-[2/3]', 'shadow-xl border-2 border-white ring-1 ring-slate-300')}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ================= 4. THEMATIC MOOD BOARDS (Curated clusters by color palette & texture) =================
  if (style === 'thematic-moodboards') {
    // Group pins by boardName or category
    const themes = Array.from(new Set(pins.map((p) => p.boardName || p.categoryLabel)));

    return (
      <div className="space-y-10">
        {themes.map((themeName) => {
          const themePins = pins.filter((p) => (p.boardName || p.categoryLabel) === themeName).slice(0, 4);
          if (themePins.length === 0) return null;

          const themePalette = themePins[0]?.colorPalette || ['#264653', '#2A9D8F', '#E76F51', '#F4A261'];

          return (
            <div
              key={themeName}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                    Aesthetic Mood Board
                  </span>
                  <h3 className="text-xl font-black text-slate-900">{themeName}</h3>
                </div>

                {/* Theme Palette Chips */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-700">Palette:</span>
                  <div className="flex gap-1.5">
                    {themePalette.map((col, idx) => (
                      <span
                        key={idx}
                        className="w-6 h-6 rounded-md shadow-sm border border-slate-300 inline-block"
                        style={{ backgroundColor: col }}
                        title={col}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Cluster grid for this moodboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themePins.map((pin) => renderCleanCard(pin, 'aspect-[3/4]'))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ================= 5. 2x2 BALANCED GRID (Four-photo square arrangement) =================
  if (style === 'grid-2x2') {
    return (
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
        {pins.slice(0, 4).map((pin) => renderCleanCard(pin, 'aspect-square'))}
      </div>
    );
  }

  // ================= 6. 3x3 MATRIX GRID (Nine-photo balanced layout) =================
  if (style === 'grid-3x3') {
    return (
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-3 sm:gap-5 p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
        {pins.slice(0, 9).map((pin) => renderCleanCard(pin, 'aspect-square'))}
      </div>
    );
  }

  // ================= 7. EQUAL TRIPTYCH (Three same-sized panels side-by-side) =================
  if (style === 'equal-triptych') {
    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
        {pins.slice(0, 3).map((pin) => renderCleanCard(pin, 'aspect-[2/3]'))}
      </div>
    );
  }

  // ================= 8. MIXED-SIZE GRID (Rows and columns mixing rectangular sizes) =================
  if (style === 'mixed-size-grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pins.map((pin, i) => {
          // Alternate between 2:3 vertical and square/rectangular
          const aspect = i % 3 === 0 ? 'aspect-[2/3] sm:col-span-1' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]';
          return renderCleanCard(pin, aspect);
        })}
      </div>
    );
  }

  // ================= 9. FEATURE HERO LAYOUT (1 Large Hero in center or side surrounded by details) =================
  if (style === 'feature-hero') {
    const heroPin = pins[0];
    const detailPins = pins.slice(1, 5);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          {/* Main Hero Pin (lg:col-span-7) */}
          {heroPin && (
            <div className="lg:col-span-7">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 mb-2 block">
                ⭐ Featured Hero Design Asset
              </span>
              {renderCleanCard(heroPin, 'aspect-[16/10]', 'ring-2 ring-purple-500/20 shadow-xl')}
            </div>
          )}

          {/* Surrounding 4 Detail Shots (lg:col-span-5) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {detailPins.map((pin) => renderCleanCard(pin, 'aspect-square'))}
          </div>
        </div>

        {/* Secondary Row */}
        {pins.length > 5 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {pins.slice(5, 9).map((pin) => renderCleanCard(pin, 'aspect-[2/3]'))}
          </div>
        )}
      </div>
    );
  }

  // ================= 10. CLASSIC STACK WITH FEATURE (Large vertical on one side paired with stack) =================
  if (style === 'classic-stack-feature') {
    const featurePin = pins[0];
    const stackSecondary = pins[1];
    const stackBottom1 = pins[2];
    const stackBottom2 = pins[3];

    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
        {/* Large Vertical Feature on Left (md:col-span-6) */}
        {featurePin && (
          <div className="md:col-span-6">
            {renderCleanCard(featurePin, 'aspect-[2/3] md:h-full', 'shadow-xl')}
          </div>
        )}

        {/* Stack on Right (md:col-span-6) */}
        <div className="md:col-span-6 flex flex-col gap-4 justify-between">
          {stackSecondary && (
            <div className="flex-1">
              {renderCleanCard(stackSecondary, 'aspect-[16/9] w-full')}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {stackBottom1 && renderCleanCard(stackBottom1, 'aspect-square')}
            {stackBottom2 && renderCleanCard(stackBottom2, 'aspect-square')}
          </div>
        </div>
      </div>
    );
  }

  // ================= 11. BEFORE-AND-AFTER ARRANGEMENT (Contrast starting point with final result) =================
  if (style === 'before-and-after') {
    // Find pin with beforeAfter metadata or use first 2 pins as before/after
    const beforeAfterPin = pins.find((p) => p.beforeAfter) || pins[0];
    const beforeImg =
      beforeAfterPin.beforeAfter?.beforeUrl ||
      pins[1]?.mediaUrl ||
      '/images/tribut/adire_male_patchwork_1792082376155.jpg';
    const afterImg =
      beforeAfterPin.beforeAfter?.afterUrl ||
      beforeAfterPin.mediaUrl ||
      '/images/tribut/adire_male_jacket_1792082249653.jpg';

    return (
      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                Interactive Before-and-After Comparison
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {beforeAfterPin.title}
              </h3>
            </div>
            <span className="text-xs text-slate-600 font-semibold">
              Drag slider or click image to inspect design notes
            </span>
          </div>

          {/* Interactive Split Slider */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl select-none border border-slate-300">
            {/* After Image (Background) */}
            <img
              src={afterImg}
              alt="After execution"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute top-4 right-4 px-3 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-xs font-black uppercase">
              {beforeAfterPin.beforeAfter?.labelAfter || 'After: Finished Bespoke'}
            </span>

            {/* Before Image (Clipped Left Layer) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={beforeImg}
                alt="Before starting point"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', minWidth: '100%' }}
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-purple-900/80 backdrop-blur-md text-white text-xs font-black uppercase">
                {beforeAfterPin.beforeAfter?.labelBefore || 'Before: Raw Resist Dye'}
              </span>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-2xl flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center text-xs font-black border border-slate-300">
                ⇄
              </div>
            </div>

            {/* Slider Range Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              aria-label="Before and after split slider"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => onPinClick(beforeAfterPin)}
              className="py-2 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
            >
              Inspect Full Design Details & Comments
            </button>
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pins.slice(2, 6).map((pin) => renderCleanCard(pin, 'aspect-[2/3]'))}
        </div>
      </div>
    );
  }

  // Fallback default
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {pins.map((pin) => renderCleanCard(pin, 'aspect-[2/3]'))}
    </div>
  );
};

export default TributDisplayStyleRenderer;
