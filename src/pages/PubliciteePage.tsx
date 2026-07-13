import React from 'react';
import { logError } from '../utils/errorLogger';
import { useAppContext } from "../contexts/AppContext";
import MainLayout from '../components/layout/MainLayout';
import {
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  SparklesIcon,
  EyeSlashIcon,
  TrashIcon,
  PencilIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon
} from '../icons';

interface PubliciteeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  isLiked: boolean;
  timestamp: string;
  isPrivate: boolean;
  isSpoiler: boolean;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
}

const PubliciteePage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [activeTab, setActiveTab] = React.useState("for-you");
  const [isCreating, setIsCreating] = React.useState(false);
  const [videoTitle, setVideoTitle] = React.useState("");
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [isSpoiler, setIsSpoiler] = React.useState(false);
  const [videoFile, setVideoFile] = React.useState<File | null>(null);

  // Mock data for Publicitee videos
  const mockVideos: PubliciteeVideo[] = [
    {
      id: "1",
      title: "Amazing sunset timelapse",
      thumbnail: "https://placehold.co/300x400/FF6B6B/FFFFFF?text=Video+1",
      duration: "0:45",
      views: 12500,
      likes: 420,
      isLiked: false,
      timestamp: "2 hours ago",
      isPrivate: false,
      isSpoiler: false,
      author: {
        name: "TravelVlogger",
        avatar: "https://placehold.co/40x40/4ECDC4/FFFFFF?text=TV",
        isVerified: true
      }
    },
    {
      id: "2",
      title: "Cooking tutorial: Pasta",
      thumbnail: "https://placehold.co/300x400/45B7D1/FFFFFF?text=Video+2",
      duration: "2:30",
      views: 8900,
      likes: 312,
      isLiked: true,
      timestamp: "5 hours ago",
      isPrivate: false,
      isSpoiler: false,
      author: {
        name: "ChefMaster",
        avatar: "https://placehold.co/40x40/F9CA24/FFFFFF?text=CM",
        isVerified: true
      }
    },
    {
      id: "3",
      title: "Behind the scenes: Movie making",
      thumbnail: "https://placehold.co/300x400/6C5CE7/FFFFFF?text=Video+3",
      duration: "1:15",
      views: 15600,
      likes: 580,
      isLiked: false,
      timestamp: "1 day ago",
      isPrivate: true,
      isSpoiler: true,
      author: {
        name: "FilmMakerPro",
        avatar: "https://placehold.co/40x40/A55EEA/FFFFFF?text=FM",
        isVerified: false
      }
    },
    {
      id: "4",
      title: "Fitness tips for beginners",
      thumbnail: "https://placehold.co/300x400/F39C12/FFFFFF?text=Video+4",
      duration: "3:10",
      views: 7800,
      likes: 250,
      isLiked: true,
      timestamp: "2 days ago",
      isPrivate: false,
      isSpoiler: false,
      author: {
        name: "FitLifeCoach",
        avatar: "https://placehold.co/40x40/9B59B6/FFFFFF?text=FL",
        isVerified: true
      }
    },
    {
      id: "5",
      title: "DIY crafts for home decoration",
      thumbnail: "https://placehold.co/300x400/E74C3C/FFFFFF?text=Video+5",
      duration: "4:20",
      views: 9200,
      likes: 410,
      isLiked: false,
      timestamp: "3 days ago",
      isPrivate: false,
      isSpoiler: false,
      author: {
        name: "CraftyHands",
        avatar: "https://placehold.co/40x40/1ABC9C/FFFFFF?text=CH",
        isVerified: false
      }
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 1.5GB for Publicitee)
      if (file.size > 1.5 * 1024 * 1024 * 1024) {
        showToast("File size exceeds 1.5GB limit for Publicitee");
        return;
      }

      setVideoFile(file);
    }
  };

  const handleCreatePublicitee = () => {
    if (!videoFile) {
      showToast("Please select a video file");
      return;
    }

    // In a real app, this would upload the video
    console.info("Creating Publicitee with:", {
      videoTitle,
      isPrivate,
      isSpoiler,
      videoFile: videoFile?.name
    });
    showToast("Publicitee created successfully!");
    setIsCreating(false);
    setVideoTitle("");
    setIsPrivate(false);
    setIsSpoiler(false);
    setVideoFile(null);
  };

  const handleLike = (id: string) => {
    showToast("Video liked successfully!");
    // Implementation would update the like status
  };

  const handleDelete = (id: string) => {
    showToast("Video deleted successfully!");
    // Implementation would delete the video
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header with tabs */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Publicitee</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center"
          >
            <VideoCameraIcon className="h-5 w-5 mr-1" />
            Create
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === "for-you" ? "border-b-2 border-brand-blue text-brand-blue" : "text-gray-500"}`}
            onClick={() => setActiveTab("for-you")}
          >
            For You
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === "following" ? "border-b-2 border-brand-blue text-brand-blue" : "text-gray-500"}`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === "trending" ? "border-b-2 border-brand-blue text-brand-blue" : "text-gray-500"}`}
            onClick={() => setActiveTab("trending")}
          >
            Trending
          </button>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mockVideos.map((video) => (
            <div key={video.id} className="relative group">
              {/* Video thumbnail */}
              <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                 />

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>

                {/* Spoiler indicator */}
                {video.isSpoiler && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                    <EyeSlashIcon className="h-3 w-3 mr-1" />
                    Spoiler
                  </div>
                )}

                {/* Private indicator */}
                {video.isPrivate && (
                  <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">
                    Private
                  </div>
                )}
              </div>

              {/* Video info */}
              <div className="mt-2">
                <h3 className="font-medium text-gray-900 truncate text-sm">
                  {video.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span>{video.views.toLocaleString()} views</span>
                  <span className="mx-1">•</span>
                  <span>{video.timestamp}</span>
                </div>
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleLike(video.id)}
                  className={`p-2 rounded-full ${video.isLiked ? "bg-red-500" : "bg-white"}`}
                >
                  <HeartIcon
                    className={`h-5 w-5 ${video.isLiked ? "text-white" : "text-gray-700"}`}
                  />
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="p-2 bg-white rounded-full"
                >
                  <TrashIcon className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Publicitee Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Create Publicitee</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="Add a title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Video (Max 1.5GB)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <VideoCameraIcon className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        MP4, MOV up to 1.5GB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {videoFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {videoFile.name}
                  </p>
                )}
              </div>

              <div className="flex items-center mb-4">
                <input
                  id="private"
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                />
                <label
                  htmlFor="private"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Private video
                </label>
              </div>

              <div className="flex items-center mb-6">
                <input
                  id="spoiler"
                  type="checkbox"
                  checked={isSpoiler}
                  onChange={(e) => setIsSpoiler(e.target.checked)}
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                />
                <label
                  htmlFor="spoiler"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Mark as spoiler
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setVideoTitle("");
                    setIsPrivate(false);
                    setIsSpoiler(false);
                    setVideoFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePublicitee}
                  className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PubliciteePage;
