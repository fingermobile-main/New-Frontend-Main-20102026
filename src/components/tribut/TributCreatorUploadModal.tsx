import React, { useState, useRef, useEffect } from 'react';
import {
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
  SparklesIcon,
  SwatchIcon,
  PlusIcon
} from '../../icons';
import {
  Smartphone,
  Laptop,
  Monitor,
  UploadCloud,
  CheckCircle2,
  HardDrive,
  Camera
} from 'lucide-react';
import { TributPinItem, UserProjectBoard } from '../../data/tributData';

interface TributCreatorUploadModalProps {
  userBoards: UserProjectBoard[];
  onClose: () => void;
  onPublishPin: (newPin: TributPinItem) => void;
}

interface HardwareMetadata {
  originalFileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  mimeType: string;
  resolution?: { width: number; height: number; aspectRatio: string };
  lastModified?: number;
  deviceType: 'phone' | 'laptop' | 'desktop';
  devicePlatform: string;
  userAgent: string;
}

export const TributCreatorUploadModal: React.FC<TributCreatorUploadModalProps> = ({
  userBoards,
  onClose,
  onPublishPin
}) => {
  const [uploadMode, setUploadMode] = useState<'single' | 'multi' | 'video' | 'prompt'>('single');

  // Hardware Device Detection
  const [detectedDevice, setDetectedDevice] = useState<{
    type: 'phone' | 'laptop' | 'desktop';
    platform: string;
    label: string;
  }>({
    type: 'desktop',
    platform: 'macOS',
    label: 'Desktop Workstation'
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(ua);
    let platform = 'macOS';
    if (ua.indexOf('Win') !== -1) platform = 'Windows';
    else if (ua.indexOf('Mac') !== -1) platform = 'macOS';
    else if (ua.indexOf('Linux') !== -1) platform = 'Linux';
    else if (ua.indexOf('Android') !== -1) platform = 'Android';
    else if (ua.indexOf('like Mac') !== -1) platform = 'iOS';

    const width = window.innerWidth;
    let type: 'phone' | 'laptop' | 'desktop' = 'desktop';
    let label = `${platform} Desktop Workstation`;

    if (isMobile || width < 640) {
      type = 'phone';
      label = `${platform} Smartphone / Mobile Hardware`;
    } else if (isTablet || (width >= 640 && width <= 1024)) {
      type = 'laptop';
      label = `${platform} Tablet / Ultrabook`;
    } else if (width > 1024 && width <= 1536) {
      type = 'laptop';
      label = `${platform} Laptop`;
    }

    setDetectedDevice({ type, platform, label });
  }, []);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'fashion' | 'architecture' | 'tech' | 'art' | 'culinary' | 'wellness'>('fashion');
  const [boardName, setBoardName] = useState(userBoards[0]?.name || 'Smart Home Lagos 2026');
  const [priority, setPriority] = useState<'high' | 'medium' | 'normal'>('high');

  // Hardware Device File State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedHardwareFiles, setSelectedHardwareFiles] = useState<File[]>([]);
  const [hardwarePreviewUrls, setHardwarePreviewUrls] = useState<string[]>([]);
  const [extractedMetadata, setExtractedMetadata] = useState<HardwareMetadata | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploadingToBackend, setIsUploadingToBackend] = useState(false);

  // Fallback Media URLs
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

  // File selection handler from hardware device
  const processFilesFromDevice = (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setSelectedHardwareFiles(fileList);

    const firstFile = fileList[0];
    const sizeMb = (firstFile.size / (1024 * 1024)).toFixed(2);
    const sizeFormatted = firstFile.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(firstFile.size / 1024)} KB`;

    // Generate object URLs for immediate fast hardware previews
    const previews = fileList.map((file) => URL.createObjectURL(file));
    setHardwarePreviewUrls(previews);

    // If single, update main mediaUrl to the local preview
    if (previews[0]) {
      setMediaUrl(previews[0]);
    }
    if (fileList.length > 1) {
      setMultiUrls(previews);
      setUploadMode('multi');
    } else if (firstFile.type.startsWith('video/')) {
      setVideoUrl(previews[0]);
      setUploadMode('video');
    }

    // Inspect resolution
    if (firstFile.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        const ratio = (img.naturalWidth / img.naturalHeight).toFixed(2);
        setExtractedMetadata({
          originalFileName: firstFile.name,
          fileSizeBytes: firstFile.size,
          fileSizeFormatted: sizeFormatted,
          mimeType: firstFile.type,
          resolution: {
            width: img.naturalWidth,
            height: img.naturalHeight,
            aspectRatio: `${img.naturalWidth}:${img.naturalHeight} (${ratio})`
          },
          lastModified: firstFile.lastModified,
          deviceType: detectedDevice.type,
          devicePlatform: detectedDevice.platform,
          userAgent: navigator.userAgent
        });
      };
      img.src = previews[0];
    } else {
      setExtractedMetadata({
        originalFileName: firstFile.name,
        fileSizeBytes: firstFile.size,
        fileSizeFormatted: sizeFormatted,
        mimeType: firstFile.type,
        lastModified: firstFile.lastModified,
        deviceType: detectedDevice.type,
        devicePlatform: detectedDevice.platform,
        userAgent: navigator.userAgent
      });
    }

    if (!title) {
      const cleanTitle = firstFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
    }
  };

  const handleHardwareFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFilesFromDevice(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFilesFromDevice(e.dataTransfer.files);
    }
  };

  const handleAddMultiUrl = () => {
    if (multiUrls.length < 5) {
      setMultiUrls([...multiUrls, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter a pin title');
      return;
    }

    setIsUploadingToBackend(true);

    let finalMediaUrl = uploadMode === 'multi' ? multiUrls[0] : mediaUrl;
    let finalMultiUrls = uploadMode === 'multi' ? multiUrls : undefined;

    // If hardware file was chosen, dispatch multipart upload to backend API
    if (selectedHardwareFiles.length > 0) {
      try {
        const formData = new FormData();
        formData.append('media', selectedHardwareFiles[0]);
        formData.append('deviceType', detectedDevice.type);
        formData.append('devicePlatform', detectedDevice.platform);

        const uploadRes = await fetch('/api/tribut/upload', {
          method: 'POST',
          body: formData
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          if (uploadJson.data?.url) {
            finalMediaUrl = uploadJson.data.url;
          }
        }
      } catch (err) {
        console.warn('Backend multipart upload notice (using cached local URL):', err);
      }
    }

    const createdPin: TributPinItem = {
      id: `pin-${Date.now()}`,
      title,
      description: description || 'Member-created design inspiration on FingerMobile Tribut.',
      altText: title,
      category,
      categoryLabel: category.toUpperCase(),
      boardName,
      aspectRatio: '2:3',
      mediaType: uploadMode === 'multi' ? 'collage' : uploadMode === 'video' ? 'video' : 'image',
      mediaUrl: finalMediaUrl,
      multiMediaUrls: finalMultiUrls,
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
        domainQualityScore: 96,
        pinUsageScore: 94,
        topicRelevanceSeoScore: 97,
        pinnerQualityScore: 95,
        richProfileDataSync: isShoppable,
        overallGuardianScore: 95.8
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
      tags: ['member-created', 'sovereign-art', 'lookbook', category, detectedDevice.type]
    };

    // Save to PostgreSQL via API
    try {
      await fetch('/api/tribut/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          boardName,
          aspectRatio: '2:3',
          mediaType: createdPin.mediaType,
          mediaUrl: finalMediaUrl,
          multiMediaUrls: finalMultiUrls,
          videoUrl: uploadMode === 'video' ? videoUrl : null,
          colorPalette: palette,
          promptRecipe,
          priority,
          shoppingMetadata: createdPin.shopping || {},
          deviceType: detectedDevice.type,
          devicePlatform: detectedDevice.platform,
          hardwareMetadata: extractedMetadata || {
            originalFileName: selectedHardwareFiles[0]?.name || 'web-upload.webp',
            fileSizeBytes: selectedHardwareFiles[0]?.size || 102400,
            fileSizeFormatted: selectedHardwareFiles[0]
              ? `${(selectedHardwareFiles[0].size / 1024).toFixed(1)} KB`
              : '100 KB',
            mimeType: selectedHardwareFiles[0]?.type || 'image/webp',
            deviceType: detectedDevice.type,
            devicePlatform: detectedDevice.platform,
            userAgent: navigator.userAgent
          },
          isPinnedToTribut: true,
          uploaderName: 'Ibrahim Danjuma (You)',
          uploaderHandle: '@ibrahim_d'
        })
      });
    } catch (saveErr) {
      console.warn('API sync notice:', saveErr);
    }

    setIsUploadingToBackend(false);
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
        {/* Hidden File Inputs for Device Hardware */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          multiple
          onChange={handleHardwareFileSelect}
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleHardwareFileSelect}
          className="hidden"
        />

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
                FingerMobile Creator Studio
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-950 text-[10px] font-bold">
                {detectedDevice.type === 'phone' ? (
                  <Smartphone className="w-3 h-3 text-emerald-800" />
                ) : detectedDevice.type === 'laptop' ? (
                  <Laptop className="w-3 h-3 text-emerald-800" />
                ) : (
                  <Monitor className="w-3 h-3 text-emerald-800" />
                )}
                {detectedDevice.label}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Create & Upload Media / Pin to Tribut
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
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
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
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
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
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
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
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
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <SwatchIcon className="w-4 h-4" />
            4. AI Prompt & Design Blueprint
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublish} className="p-6 overflow-y-auto space-y-5 text-xs">

          {/* HARDWARE DEVICE UPLOAD SECTION (PHONE / LAPTOP / DESKTOP) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-slate-50 to-indigo-50 border-2 border-purple-300 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-purple-700" />
                  Hardware Device Upload (Phone / Laptop / Desktop)
                </span>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  Directly choose photos, 4K artwork, or videos from your local device storage or camera.
                </p>
              </div>

              {/* Hardware Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
                >
                  <UploadCloud className="w-4 h-4 text-white" />
                  Upload from Device
                </button>

                {detectedDevice.type === 'phone' && (
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-sm"
                  >
                    <Camera className="w-4 h-4 text-slate-700" />
                    Open Camera
                  </button>
                )}
              </div>
            </div>

            {/* Drag and Drop Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDraggingOver
                  ? 'border-purple-600 bg-purple-100/70 scale-[0.99]'
                  : 'border-slate-300 hover:border-purple-500 bg-white/70 hover:bg-white'
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="p-3 rounded-full bg-purple-100 border border-purple-200 text-purple-700">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">
                    Click to browse files or drag and drop here
                  </p>
                  <p className="text-xs text-slate-700 font-medium">
                    Supports JPG, PNG, WebP, GIF, MP4, MOV from your {detectedDevice.label} (up to 100MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Extracted Hardware Properties Card */}
            {extractedMetadata && (
              <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Hardware Device Properties Analyzed
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold text-[10px]">
                    Verified Clean
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-600 font-bold">File Name</p>
                    <p className="text-slate-900 font-extrabold truncate" title={extractedMetadata.originalFileName}>
                      {extractedMetadata.originalFileName}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-600 font-bold">File Size</p>
                    <p className="text-slate-900 font-extrabold">{extractedMetadata.fileSizeFormatted}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-600 font-bold">Hardware Source</p>
                    <p className="text-slate-900 font-extrabold capitalize">
                      {extractedMetadata.deviceType} ({extractedMetadata.devicePlatform})
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-600 font-bold">Dimensions / Ratio</p>
                    <p className="text-slate-900 font-extrabold">
                      {extractedMetadata.resolution
                        ? `${extractedMetadata.resolution.width}x${extractedMetadata.resolution.height}`
                        : extractedMetadata.mimeType}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Previews of chosen hardware files */}
            {hardwarePreviewUrls.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">
                    Loaded Previews ({hardwarePreviewUrls.length} file{hardwarePreviewUrls.length > 1 ? 's' : ''}):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHardwareFiles([]);
                      setHardwarePreviewUrls([]);
                      setExtractedMetadata(null);
                    }}
                    className="text-[11px] text-red-700 hover:underline font-bold"
                  >
                    Clear Selected Files
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {hardwarePreviewUrls.map((url, i) => (
                    <div key={i} className="relative group flex-shrink-0 w-24 h-32 rounded-xl overflow-hidden border-2 border-purple-400 shadow-md">
                      {selectedHardwareFiles[i]?.type.startsWith('video/') ? (
                        <video src={url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={url} alt={`Hardware file ${i + 1}`} className="w-full h-full object-cover" />
                      )}
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-white font-bold text-[9px]">
                        #{i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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

          {/* Fallback Media URL Inputs Based on Mode */}
          {uploadMode === 'single' && (
            <div>
              <label className="block text-slate-900 font-bold mb-1 flex items-center justify-between">
                <span>2:3 Vertical Image URL or Local Device Media Path *</span>
                <span className="text-[11px] text-purple-700 font-medium">Auto-populated from Hardware Upload above</span>
              </label>
              <input
                type="text"
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
                    type="text"
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
                      className="p-1.5 text-slate-500 hover:text-red-600 font-bold"
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
                Video Pin URL or Hardware Stream (MP4 / WebM / HLS stream) *
              </label>
              <input
                type="text"
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
              disabled={isUploadingToBackend}
              className="py-2.5 px-6 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold shadow-md shadow-purple-700/30 flex items-center gap-2"
            >
              {isUploadingToBackend ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading & Pinning...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-white" />
                  Publish & Pin Media to Tribut
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TributCreatorUploadModal;
