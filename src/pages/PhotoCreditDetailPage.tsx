import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import CommentSection from '../components/CommentSection';
import { PhotoCredit, Member } from '../types';
import type { Comment } from '../components/CommentSection';

const PhotoCreditDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { photoCreditItems, fetchPhotoCredits, ficBalance, handleAiAssist: contextHandleAiAssist } = useAppContext();
  const [photoCredit, setPhotoCredit] = useState<PhotoCredit | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotoCredit = async () => {
      // In a real app, fetch single photo credit by ID
      await fetchPhotoCredits?.();
      const item = photoCreditItems.find(item => item.id === id);
      if (item) {
        setPhotoCredit(item as PhotoCredit);
      }
      setLoading(false);
    };

    loadPhotoCredit();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !photoCredit) return;

    // In a real app, this would be an API call
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'Current User',
        membername: 'currentuser',
        avatarUrl: '',
        animatedAvatarUrl: '',
        isVerified: false
      } as Member,
      content: newComment,
      timestamp: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
      replies: [],
      giftCount: 0,
      isVerified: false
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  // Wrapper to adapt AppContext handleAiAssist signature to CommentSection's expected signature
  const handleAiAssist = async (action: string, data: Record<string, unknown>): Promise<{ success: boolean }> => {
    const prompt = data.prompt as string || action;
    await contextHandleAiAssist?.(prompt);
    return { success: true };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!photoCredit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Photo credit not found
      </div>
    );
  }

  // Use uploader property (not photographer)
  const uploader = photoCredit.uploader || {
    id: '',
    name: 'Unknown',
    membername: 'unknown',
    avatarUrl: '',
    animatedAvatarUrl: '',
    isVerified: false
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Image Section */}
        <div className="relative pt-[100%]">
          {photoCredit.imageUrl ? (
            <img
              src={photoCredit.imageUrl}
              alt={photoCredit.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            {/* Uploader Avatar and Info */}
            <img
              src={uploader.avatarUrl}
              alt={uploader.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="font-semibold">{uploader.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">by {uploader.name}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{photoCredit.title}</h2>

          <p className="text-gray-700 dark:text-gray-300 mb-4">{photoCredit.description}</p>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Camera</p>
              <p className="font-medium">{photoCredit.cameraModel || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Aperture</p>
              <p className="font-medium">{photoCredit.aperture || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">ISO</p>
              <p className="font-medium">{photoCredit.iso || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">License</p>
              <p className="font-medium">{photoCredit.license || 'N/A'}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {photoCredit.tags?.map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="mb-8">
            <button
              className="w-full py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => console.info('Download initiated')}
            >
              Download for {photoCredit.cost} FIC
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              {ficBalance} FIC in wallet
            </p>
          </div>

          {/* Comment Section */}
          <CommentSection
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            onSubmitComment={handleAddComment}
            ficBalance={ficBalance}
            onTriggerSpecialEffect={() => {}}
            handleAiAssist={handleAiAssist}
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoCreditDetailPage;