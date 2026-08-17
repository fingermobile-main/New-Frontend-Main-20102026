import React, { useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import MainLayout from '../components/layout/MainLayout';

// Mock photo credits data
const MOCK_PHOTO_CREDITS = [
  {
    id: '1',
    title: 'Sunset at the Beach',
    imageUrl: 'https://picsum.photos/seed/photo1/400/300',
    photographer: 'Jane Cooper',
    likes: 245,
    comments: 32,
    downloads: 128
  },
  {
    id: '2',
    title: 'Mountain Landscape',
    imageUrl: 'https://picsum.photos/seed/photo2/400/300',
    photographer: 'John Smith',
    likes: 189,
    comments: 24,
    downloads: 96
  },
  {
    id: '3',
    title: 'Urban Architecture',
    imageUrl: 'https://picsum.photos/seed/photo3/400/300',
    photographer: 'Emily Brown',
    likes: 156,
    comments: 18,
    downloads: 75
  }
];

const PhotoCreditsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);

  const onLike = (photoId: string) => {
    // console.info('Liking photo credit:', photoId);
    showToast('Photo credit liked successfully', 'success');
  };

  const onAddComment = (photoId: string, content: string) => {
    // console.info('Adding comment to photo credit:', photoId, content);
    showToast('Comment added successfully', 'success');
  };

  const onOpenGiftModal = (photoId: string) => {
    // console.info('Opening gift modal for photo credit:', photoId);
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = (photoId: string) => {
    // console.info('Opening paylink modal for photo credit:', photoId);
    setShowPaylinkModal(true);
  };

  const onVote = (photoId: string, vote: 'up' | 'down') => {
    // console.info(`Voted ${vote} for photo credit:`, photoId);
    showToast(`Photo credit ${vote}voted successfully`, 'success');
  };

  const handleDeletePhotoCredit = (photoId: string) => {
    // console.info('Deleting photo credit:', photoId);
    showToast('Photo credit deleted successfully', 'success');
  };

  const handleTokenizePhotoCredit = (photoId: string) => {
    // console.info('Tokenizing photo credit:', photoId);
    showToast('Photo credit tokenized successfully', 'success');
  };

  const handleAiAssist = (photoId: string) => {
    // console.info('AI assisting with photo credit:', photoId);
    showToast('AI assistance requested', 'info');
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PhotoCredits</h1>
            <p className="text-gray-600">Share and discover stunning photography</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Balance</p>
            <p className="text-xl font-bold text-brand-primary">{ficBalance} FIC</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PHOTO_CREDITS.map(photo => (
            <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img 
                src={photo.imageUrl} 
                alt={photo.title} 
                className="w-full h-48 object-cover"
               />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{photo.title}</h3>
                <p className="text-sm text-gray-600">by {photo.photographer}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => onLike(photo.id)}
                      className="text-gray-600 hover:text-brand-primary"
                    >
                      ❤️ {photo.likes}
                    </button>
                    <button 
                      onClick={() => onAddComment(photo.id, '')}
                      className="text-gray-600 hover:text-brand-primary"
                    >
                      💬 {photo.comments}
                    </button>
                    <button 
                      onClick={() => onVote(photo.id, 'up')}
                      className="text-gray-600 hover:text-brand-primary"
                    >
                      ⬆️
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onOpenGiftModal(photo.id)}
                      className="text-sm px-2 py-1 bg-brand-primary text-white rounded hover:bg-brand-primary-dark"
                    >
                      Gift
                    </button>
                    <button 
                      onClick={() => onOpenPaylinkModal(photo.id)}
                      className="text-sm px-2 py-1 bg-brand-secondary text-white rounded hover:bg-brand-secondary-dark"
                    >
                      Paylink
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <button 
                    onClick={() => handleTokenizePhotoCredit(photo.id)}
                    className="text-sm text-gray-600 hover:text-brand-primary"
                  >
                    Tokenize
                  </button>
                  <button 
                    onClick={() => handleAiAssist(photo.id)}
                    className="text-sm text-gray-600 hover:text-brand-primary"
                  >
                    AI Assist
                  </button>
                  <button 
                    onClick={() => handleDeletePhotoCredit(photo.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Send Gift</h2>
            <p>Your FIC Balance: {ficBalance}</p>
            {/* Add gift form here */}
            <button onClick={() => setShowGiftModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Paylink</h2>
            <p>Your FIC Balance: {ficBalance}</p>
            {/* Add paylink form here */}
            <button onClick={() => setShowPaylinkModal(false)}>Close</button>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PhotoCreditsPage;