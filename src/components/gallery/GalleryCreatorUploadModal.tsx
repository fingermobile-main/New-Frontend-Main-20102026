import React, { useState } from 'react';
import {
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
  SparklesIcon,
  ShoppingBagIcon,
  SwatchIcon,
  PlusIcon
} from '../../icons';
import { GalleryPinItem, UserProjectBoard } from '../../data/galleryData';

interface GalleryCreatorUploadModalProps {
  userBoards: UserProjectBoard[];
  onClose: () => void;
  onPublishPin: (newPin: GalleryPinItem) => void;
}

export const GalleryCreatorUploadModal: React.FC<GalleryCreatorUploadModalProps> = ({
  userBoards,
  onClose,
  onPublishPin
}) => {
  const [uploadMode, setUploadMode] = useState<'single' | 'multi' | 'video' | 'prompt'>('single');

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'fashion' | 'architecture' | 'tech' | 'art' | 'culinary' | 'wellness'>('fashion');
  const [boardName, setBoardName] = useState(userBoards[0]?.name || 'Smart Home Lagos 2026');
  const [priority, setPriority] = useState<'high' | 'medium' | 'normal'>('high');

  // Media URLs
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80');
  const [multiUrls, setMultiUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
  ]);
  const [videoUrl, setVideoUrl] = useState('');

  // AI Prompt & Color Palette
  const [promptRecipe, setPromptRecipe] = useState(
    'Professional high fashion editorial 4k portrait of a handsome Nigerian male model wearing tailored Adire Eleko geometric jacket, cinematic key lighting, crisp sharp focus.'
  );
  const [palette, setPalette] = useState<string[]>(['#1A2B4C', '#28467A', '#52796F', '#84A98C', '#E29578']);

  // Shoppable integration
  const [isShoppable, setIsShoppable] = useState(true);
  const [storeEngine, setStoreEngine] = useState<'MarketPlace' | 'Storefront' | 'OwnIt' | 'Flamingo'>('MarketPlace');
  const [productName, setProductName] = useState('');
  const [priceNgn, setPriceNgn] = useState(65000);
  const [priceFic, setPriceFic] = useState(110);
  const [buyAndShareCommissionPercent, setBuyAndShareCommissionPercent] = useState(10);

  const handleAddMultiUrl = () => {
    if (multiUrls.length < 5) {
      setMultiUrls([...multiUrls, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter a pin title');
      return;
    }

    const createdPin: GalleryPinItem = {
      id: `pin-${Date.now()}`,
      title,
      description: description || 'Member-created design inspiration on FingerMobile Gallery.',
      altText: title,
      category,
      categoryLabel: category.toUpperCase(),
      boardName,
      aspectRatio: '2:3',
      mediaType: uploadMode === 'multi' ? 'collage' : uploadMode === 'video' ? 'video' : 'image',
      mediaUrl: uploadMode === 'multi' ? multiUrls[0] : mediaUrl,
      multiMediaUrls: uploadMode === 'multi' ? multiUrls : undefined,
      videoUrl: uploadMode === 'video' ? videoUrl || undefined : undefined,
      colorPalette: palette,
      promptRecipe: promptRecipe || undefined,
      priority,
      commentsCount: 0,
      comments: [],
      author: {
        id: 'usr-current',
        name: 'Ibrahim Danjuma (You)',
        handle: '@ibrahim_d',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        domainReputation: 'Sovereign Verified',
        consistencyStreak: '1-Day Daily Pin Streak'
      },
      metrics: {
        saves: 1,
        closeups: 1,
        outboundClicks: 0,
        likes: 1,
        shelfLifeDays: 1
      },
      pillars: {
        domainQualityScore: 95,
        pinUsageScore: 92,
        topicRelevanceSeoScore: 96,
        pinnerQualityScore: 94,
        richProfileDataSync: isShoppable,
        overallGuardianScore: 94.2
      },
      shopping: isShoppable
        ? {
            isShoppable: true,
            storeEngine,
            productName: productName || title,
            priceNgn: Number(priceNgn),
            priceFic: Number(priceFic),
            inStock: true,
            merchantName: 'Your Sovereign Storefront',
            merchantDomain: 'fingermobileprotocol.com/@ibrahim_d',
            buyAndShareCommissionPercent: Number(buyAndShareCommissionPercent),
            liveCatalogSync: true
          }
        : undefined,
      tags: ['member-created', 'sovereign-art', 'lookbook', category]
    };

    onPublishPin(createdPin);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
              FingerMobile Creator Studio
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Create & Upload Design / Pin to Gallery
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Mode Selector Pills */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setUploadMode('single')}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              uploadMode === 'single'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <PhotoIcon className="w-4 h-4" />
            1. Single Photo / Artwork
          </button>

          <button
            type="button"
            onClick={() => setUploadMode('multi')}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              uploadMode === 'multi'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            2. Multi-Photo Set / Collage (Diptych/Triptych)
          </button>

          <button
            type="button"
            onClick={() => setUploadMode('video')}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              uploadMode === 'video'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <VideoCameraIcon className="w-4 h-4" />
            3. Video Pin
          </button>

          <button
            type="button"
            onClick={() => setUploadMode('prompt')}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              uploadMode === 'prompt'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <SwatchIcon className="w-4 h-4" />
            4. AI Prompt & Design Blueprint
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublish} className="p-6 overflow-y-auto space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label className="block text-slate-900 font-bold mb-1">
                Design Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Minimalist Lekki Residence"
                className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Target Board */}
            <div>
              <label className="block text-slate-900 font-bold mb-1">
                Assign to Project Board *
              </label>
              <select
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
              >
                {userBoards.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} ({b.purpose})
                  </option>
                ))}
                <option value="New Project Board">+ Create New Project Board</option>
              </select>
            </div>
          </div>

          {/* Media Inputs Based on Mode */}
          {uploadMode === 'single' && (
            <div>
              <label className="block text-slate-900 font-bold mb-1">
                2:3 Vertical Image URL *
              </label>
              <input
                type="url"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
              />
            </div>
          )}

          {uploadMode === 'multi' && (
            <div className="space-y-3 p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <div className="flex justify-between items-center">
                <span className="font-black text-purple-950 uppercase text-[11px]">
                  Multi-Photo Diptych / Triptych Set (2 to 5 Images)
                </span>
                {multiUrls.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddMultiUrl}
                    className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    Add Another Image Panel
                  </button>
                )}
              </div>

              {multiUrls.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="w-6 font-bold text-slate-700">#{i + 1}</span>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      const updated = [...multiUrls];
                      updated[i] = e.target.value;
                      setMultiUrls(updated);
                    }}
                    className="flex-1 p-2 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
                  />
                  {multiUrls.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setMultiUrls(multiUrls.filter((_, idx) => idx !== i))}
                      className="p-1.5 text-slate-500 hover:text-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {uploadMode === 'video' && (
            <div>
              <label className="block text-slate-900 font-bold mb-1">
                Video Pin URL (MP4 / WebM / HLS stream) *
              </label>
              <input
                type="url"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-slate-900 font-bold mb-1">
              Description / Materials & Styling Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the materials, lighting setup, silhouette notes, or architectural process..."
              className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
            />
          </div>

          {/* AI Prompt Recipe & Color Palette */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-900 font-bold mb-1 flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5 text-purple-700" />
                AI Prompt Recipe (Optional for Generative Designs)
              </label>
              <textarea
                rows={2}
                value={promptRecipe}
                onChange={(e) => setPromptRecipe(e.target.value)}
                className="w-full p-2 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-bold mb-1 flex items-center gap-1.5">
                <SwatchIcon className="w-3.5 h-3.5 text-purple-700" />
                Color Palette Swatches
              </label>
              <div className="flex gap-2 items-center mb-2">
                {palette.map((col, i) => (
                  <span
                    key={i}
                    className="w-7 h-7 rounded-lg border border-slate-300 shadow-sm"
                    style={{ backgroundColor: col }}
                    title={col}
                  />
                ))}
              </div>
              <input
                type="text"
                value={palette.join(', ')}
                onChange={(e) => setPalette(e.target.value.split(',').map((s) => s.trim()))}
                placeholder="#1A2B4C, #28467A, #52796F..."
                className="w-full p-2 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-900 font-bold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
              >
                <option value="fashion">Fashion & Wearables</option>
                <option value="architecture">Architecture & Living</option>
                <option value="tech">Tech & Sovereign Gear</option>
                <option value="art">Afrofuturist Art</option>
                <option value="culinary">Culinary & Nutrition</option>
                <option value="wellness">Wellness Apothecary</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-900 font-bold mb-1">Board Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
              >
                <option value="high">⭐ High Priority (Hero Pin / Top Placement)</option>
                <option value="medium">Standard Priority</option>
                <option value="normal">Normal Supporting Pin</option>
              </select>
            </div>
          </div>

          {/* Commercial Shopping Gateway Integration */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
            <label className="flex items-center gap-2 text-xs font-black text-purple-950 cursor-pointer">
              <input
                type="checkbox"
                checked={isShoppable}
                onChange={(e) => setIsShoppable(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span>Make this Pin Shoppable (Rich Profile OOC Sync & Buy & Share)</span>
            </label>

            {isShoppable && (
              <div className="space-y-3 pt-2 border-t border-purple-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-900 font-bold mb-1">Store Gateway</label>
                    <select
                      value={storeEngine}
                      onChange={(e) => setStoreEngine(e.target.value as any)}
                      className="w-full p-2 rounded-lg text-slate-900 font-bold border border-slate-300 bg-white"
                    >
                      <option value="MarketPlace">MarketPlace</option>
                      <option value="Storefront">Storefront</option>
                      <option value="OwnIt">OwnIt</option>
                      <option value="Flamingo">Flamingo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold mb-1">Price (₦)</label>
                    <input
                      type="number"
                      value={priceNgn}
                      onChange={(e) => setPriceNgn(Number(e.target.value))}
                      className="w-full p-2 rounded-lg text-slate-900 font-bold border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold mb-1">Buy & Share Commission (% to Curators)</label>
                    <input
                      type="number"
                      value={buyAndShareCommissionPercent}
                      onChange={(e) => setBuyAndShareCommissionPercent(Number(e.target.value))}
                      className="w-full p-2 rounded-lg text-slate-900 font-bold border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/30"
            >
              Publish Design Pin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryCreatorUploadModal;
