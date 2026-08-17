import React, {} from 'react';
import type { PhotoCredit } from '../types';

interface PhotoCreditCardProps {
  item: PhotoCredit;
  onLike: (itemId: string) => void;
  onAddComment: (itemId: string) => void;
  onOpenGiftModal: (itemId: string) => void;
  onOpenPaylinkModal: (itemId: string) => void;
  onVote: (itemId: string) => void;
}

const PhotoCreditCard: React.FC<PhotoCreditCardProps> = ({
  item,
  onLike,
  onAddComment,
  onOpenGiftModal,
  onOpenPaylinkModal,
  onVote
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={item.imageUrl || 'https://placehold.co/400x300'}
          alt={item.title}
          className="w-full h-48 object-cover"
         />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">{item.cost || 0} FIC</span>
          <div className="flex space-x-2">
            <button
              onClick={() => onLike(item.id)}
              className="p-2 text-gray-500 hover:text-red-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              onClick={() => onAddComment(item.id)}
              className="p-2 text-gray-500 hover:text-blue-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button
              onClick={() => onOpenGiftModal(item.id)}
              className="p-2 text-gray-500 hover:text-green-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCreditCard;
