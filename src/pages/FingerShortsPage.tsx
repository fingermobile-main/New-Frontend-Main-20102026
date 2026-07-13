import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import MainLayout from '../components/layout/MainLayout';
import {
  VideoCameraIcon,
  PhotoIcon,
  EyeSlashIcon
} from '../icons';
import { useFingerShorts } from '../hooks/useFingerShorts';

// --- Domain Interface Schema Definitions ---
interface FingerShort {
  id: string;
  type: "image" | "video" | "text";
  content: string;
  duration?: string;
  views: number;
  timestamp: string;
  isPrivate: boolean;
  isSpoiler: boolean;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
}

// --- Hardcoded Static Dataset Matrix Fallbacks ---
const MOCK_SHORTS: FingerShort[] = [
  {
    id: "1",
    type: "video",
    content: "https://placehold.co/300x400/4ECDC4/FFFFFF?text=Video",
    duration: "0:15",
    views: 1250,
    timestamp: "1 hour ago",
    isPrivate: false,
    isSpoiler: false,
    author: { name: "CoffeeLover", avatar: "https://placehold.co/40x40/FF6B6B/FFFFFF?text=CL", isVerified: true }
  },
  {
    id: "2",
    type: "image",
    content: "https://placehold.co/300x400/4ECDC4/FFFFFF?text=Image",
    views: 2450,
    timestamp: "3 hours ago",
    isPrivate: false,
    isSpoiler: false,
    author: { name: "NaturePhotographer", avatar: "https://placehold.co/40x40/4ECDC4/FFFFFF?text=NP", isVerified: true }
  },
  {
    id: "3",
    type: "text",
    content: "Just finished reading an amazing book! Highly recommend it to everyone.",
    views: 890,
    timestamp: "5 hours ago",
    isPrivate: true,
    isSpoiler: true,
    author: { name: "BookWorm", avatar: "https://placehold.co/40x40/6C5CE7/FFFFFF?text=BW", isVerified: false }
  },
  {
    id: "4",
    type: "video",
    content: "https://placehold.co/300x400/F9CA24/FFFFFF?text=Video",
    duration: "0:30",
    views: 3200,
    timestamp: "1 day ago",
    isPrivate: false,
    isSpoiler: false,
    author: { name: "FitnessGuru", avatar: "https://placehold.co/40x40/F9CA24/FFFFFF?text=FG", isVerified: true }
  }
];

// --- Subcomponent: Decoupled Short Card Representation ---
const ShortCard: React.FC<{ short: FingerShort }> = React.memo(({ short }) => {
  return (
    <div className="relative group">
      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60 shadow-sm">
        {short.type === "image" && (
          <img
            src={short.content.startsWith("http") ? short.content : "https://placehold.co/300x400/4ECDC4/FFFFFF?text=Image"}
            alt="FingerShort Render"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            loading="lazy"
          />
        )}

        {short.type === "video" && (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <VideoCameraIcon className="h-10 w-10 text-white opacity-90" />
          </div>
        )}

        {short.type === "text" && (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
            <p className="text-white text-center text-xs sm:text-sm font-medium leading-snug line-clamp-6">
              {short.content}
            </p>
          </div>
        )}

        {short.duration && (
          <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            {short.duration}
          </div>
        )}

        {short.isSpoiler && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center shadow-sm">
            <EyeSlashIcon className="h-3 w-3 mr-1" />
            Spoiler
          </div>
        )}

        {short.isPrivate && (
          <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
            Private
          </div>
        )}
      </div>

      <div className="mt-2 px-0.5">
        <div className="flex items-center text-[11px] font-medium text-gray-500">
          <span>{short.views.toLocaleString()} views</span>
          <span className="mx-1.5">•</span>
          <span>{short.timestamp}</span>
        </div>
      </div>
    </div>
  );
});

ShortCard.displayName = 'ShortCard';

// --- Main Container Page Component ---
const FingerShortsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { data, loading, error, refreshData } = useFingerShorts();

  const [activeTab, setActiveTab] = React.useState("for-you");
  const [isCreating, setIsCreating] = React.useState(false);
  const [shortType, setShortType] = React.useState<"image" | "video" | "text">("image");
  const [shortContent, setShortContent] = React.useState("");
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [isSpoiler, setIsSpoiler] = React.useState(false);
  const [mediaFile, setMediaFile] = React.useState<File | null>(null);

  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        showToast("File allocation ceiling exceeded. Structural limit: 20MB", "error");
        return;
      }
      setMediaFile(file);
    }
  }, [showToast]);

  const handleCreateFingerShort = React.useCallback(() => {
    if (shortType !== "text" && !mediaFile) {
      showToast("Validation failed: Target media attachment missing", "error");
      return;
    }

    console.info("Dispatched generation metadata profile:", {
      shortType,
      shortContent,
      isPrivate,
      isSpoiler,
      mediaFile
    });
    
    showToast("FingerShort generated successfully!", "success");
    setIsCreating(false);
    setShortContent("");
    setIsPrivate(false);
    setIsSpoiler(false);
    setMediaFile(null);
  }, [shortType, mediaFile, shortContent, isPrivate, isSpoiler, showToast]);

  const handleCloseModal = React.useCallback(() => {
    setIsCreating(false);
    setShortContent("");
    setIsPrivate(false);
    setIsSpoiler(false);
    setMediaFile(null);
  }, []);

  const handleTypeChange = React.useCallback((type: "image" | "video" | "text") => {
    setShortType(type);
    setMediaFile(null);
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <p className="text-gray-500 font-semibold tracking-wide text-sm animate-pulse">Synchronizing stream telemetry...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4 text-center">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl max-w-sm w-full shadow-sm">
            <p className="text-red-600 font-bold text-base mb-1">Pipeline Interrupted</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="w-full py-2 bg-brand-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition"
            >
              Retry Sync
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const dynamicDataMap = data 
    ? data[activeTab === "for-you" ? "forYou" : activeTab === "following" ? "following" : "trending"]
    : null;
    
  const shortsToDisplay: FingerShort[] = dynamicDataMap ?? MOCK_SHORTS;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">FingerShorts</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-brand-blue hover:bg-blue-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center shadow-sm transition"
          >
            <VideoCameraIcon className="h-4 w-4 mr-1.5" />
            Create Short
          </button>
        </div>

        <div className="flex border-b border-gray-200/80 mb-6 gap-2">
          {["for-you", "following", "trending"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 font-bold text-sm capitalize transition duration-150 border-b-2 -mb-px ${
                activeTab === tab 
                  ? "border-brand-blue text-brand-blue font-extrabold" 
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {shortsToDisplay.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">No streaming structures found inside this index cluster.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {shortsToDisplay.map((short) => (
              <ShortCard key={short.id} short={short} />
            ))}
          </div>
        )}

        {isCreating && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mb-4">Create FingerShort</h2>

              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Composition Layout Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["image", "video", "text"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                        shortType === type
                          ? "bg-brand-blue border-brand-blue text-white shadow-sm"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {type === "image" && <PhotoIcon className="h-4 w-4" />}
                      {type === "video" && <VideoCameraIcon className="h-4 w-4" />}
                      {type === "text" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  {shortType === "text" ? "Text Body" : "Caption Meta Header"}
                </label>
                {shortType === "text" ? (
                  <textarea
                    value={shortContent}
                    onChange={(e) => setShortContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    placeholder="Enter short text story element..."
                    rows={4}
                  />
                ) : (
                  <input
                    type="text"
                    value={shortContent}
                    onChange={(e) => setShortContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    placeholder="Provide contextual tag description..."
                  />
                )}
              </div>

              {shortType !== "text" && (
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Binary Payload Upload Matrix
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition">
                      <div className="flex flex-col items-center justify-center pt-4 pb-4 px-2 text-center">
                        {shortType === "image" ? <PhotoIcon className="h-6 w-6 text-gray-400" /> : <VideoCameraIcon className="h-6 w-6 text-gray-400" />}
                        <p className="text-xs font-bold text-gray-700 mt-2">Click to select asset bundle</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {shortType === "image" ? "JPG, PNG, GIF" : "MP4, MOV (max 1m)"} up to 20MB
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept={shortType === "image" ? "image/*" : "video/*"}
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {mediaFile && (
                    <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md mt-2 truncate">
                      Hooked: {mediaFile.name}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2.5 bg-gray-50 p-3 rounded-xl border border-gray-200/60 mb-6">
                <div className="flex items-center">
                  <input
                    id="private"
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded-md"
                  />
                  <label htmlFor="private" className="ml-2.5 block text-xs font-bold text-gray-700 select-none">
                    Restrict visibility (Private compilation block)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="spoiler"
                    type="checkbox"
                    checked={isSpoiler}
                    onChange={(e) => setIsSpoiler(e.target.checked)}
                    className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded-md"
                  />
                  <label htmlFor="spoiler" className="ml-2.5 block text-xs font-bold text-gray-700 select-none">
                    Apply spoiler shroud masking blur filter
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 transition"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleCreateFingerShort}
                  className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm transition"
                >
                  Commit Stream
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FingerShortsPage;
