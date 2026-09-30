import React, {} from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface PhotoCreditMosaicItemProps {
  title?: string;
  credits?: number;
  image?: string;
}

const PhotoCreditMosaicItem: React.FC<PhotoCreditMosaicItemProps> = ({
  title = 'Photo',
  credits = 0,
  image
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover"  />
        ) : (
          <PhotoIcon className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <div className="p-3">
        <h4 className="font-medium text-gray-900 truncate">{title}</h4>
        <p className="text-sm text-blue-600 mt-1">{credits} credits</p>
      </div>
    </div>
  );
};

export default PhotoCreditMosaicItem;
