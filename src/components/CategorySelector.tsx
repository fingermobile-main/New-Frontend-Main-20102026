import React, { useState, useRef, useEffect } from 'react';
import { FORUM_CATEGORIES, Category } from '../data/categories';

interface CategorySelectorProps {
  selectedCategoryId: string;
  onChange: (categoryId: string) => void;
}

// Mock User Permissions - in a real app these come from Auth context
const USER_PERMISSIONS = {
  isModerator: false,
  hasSubscription: false,
  hasBadge: true, // We give them a badge to test that state
};

export default function CategorySelector({ selectedCategoryId, onChange }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategory = FORUM_CATEGORIES.find(c => c.id === selectedCategoryId) || FORUM_CATEGORIES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRestrictionIcon = (type: Category['restrictionType']) => {
    switch (type) {
    case 'SUBSCRIPTION':
      return (
        <svg className="w-4 h-4 text-yellow-500 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      );
    case 'BADGE':
      return (
        <svg className="w-4 h-4 text-blue-500 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'MODERATOR':
      return (
        <svg className="w-4 h-4 text-red-500 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
    }
  };

  const isCategoryDisabled = (type: Category['restrictionType']) => {
    if (type === 'NONE') return false;
    if (type === 'MODERATOR' && !USER_PERMISSIONS.isModerator) return true;
    if (type === 'SUBSCRIPTION' && !USER_PERMISSIONS.hasSubscription) return true;
    if (type === 'BADGE' && !USER_PERMISSIONS.hasBadge) return true;
    return false;
  };

  return (
    <div className="relative inline-block text-left mb-3" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-between w-auto min-w-[200px] rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {getRestrictionIcon(selectedCategory.restrictionType)}
          {selectedCategory.name}
        </span>
        <svg className="-mr-1 ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 max-h-80 overflow-y-auto">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              Select Category
            </div>
            {FORUM_CATEGORIES.map((category) => {
              const disabled = isCategoryDisabled(category.restrictionType);
              return (
                <button
                  key={category.id}
                  disabled={disabled}
                  onClick={() => {
                    onChange(category.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm flex items-start flex-col transition-colors border-b last:border-b-0 border-gray-50 ${
                    disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'
                  } ${selectedCategoryId === category.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`}
                >
                  <div className="font-medium flex items-center justify-between w-full">
                    <span className="flex items-center">
                      {getRestrictionIcon(category.restrictionType)}
                      {category.name}
                    </span>
                    {disabled && (
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                  {category.description && (
                    <div className="text-xs mt-1 line-clamp-2 w-full pr-4 text-gray-500">
                      {category.description}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
