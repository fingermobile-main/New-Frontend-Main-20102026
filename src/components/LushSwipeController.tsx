import React, { useState, useEffect } from 'react';
import { HeartIcon, XCircleIcon, StarIcon } from '@heroicons/react/24/outline';

interface MemberProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  bioExtended?: string;
  interests: string[];
  matchingIntents?: string[];
  matchingCategories?: string[];
  zodiacSign?: string;
  loveLanguage?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  badgeLevel?: number;
  matchScore?: number;
  profileCompleteness?: number;
}

interface SwipeControllerProps {
  onSwipe: (userId: string, direction: 'like' | 'pass' | 'super_like') => void;
  onMatch?: (matchData: any) => void;
  userId: string;
}

const LushSwipeController: React.FC<SwipeControllerProps> = ({
  onSwipe,
  onMatch,
  userId
}) => {
  const [deck, setDeck] = useState<MemberProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    loadSwipeDeck();
  }, []);

  const loadSwipeDeck = async () => {
    try {
      setLoading(true);

      // Simulate API call to get swipe deck
      const response = await fetch('/api/lushpressies/discover/queue', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDeck(data.profiles);
      } else {
        // Mock data for demonstration
        setDeck([
          {
            id: '1',
            name: 'Sarah Johnson',
            age: 26,
            location: 'Lagos, Nigeria',
            bioExtended: 'Digital creator passionate about sustainable fashion and tech innovation.',
            interests: ['Fashion', 'Tech', 'Sustainability'],
            matchingIntents: ['Dating', 'Friendship'],
            zodiacSign: 'Libra',
            loveLanguage: 'Words of Affirmation',
            avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
            isVerified: true,
            badgeLevel: 2,
            matchScore: 92,
            profileCompleteness: 85
          },
          {
            id: '2',
            name: 'Michael Chen',
            age: 29,
            location: 'Abuja, Nigeria',
            bioExtended: 'Software engineer and amateur chef. Love exploring new cuisines and cultures.',
            interests: ['Cooking', 'Travel', 'Technology'],
            matchingIntents: ['Dating'],
            zodiacSign: 'Virgo',
            loveLanguage: 'Acts of Service',
            avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
            isVerified: true,
            badgeLevel: 1,
            matchScore: 88,
            profileCompleteness: 92
          },
          {
            id: '3',
            name: 'Emma Rodriguez',
            age: 25,
            location: 'Port Harcourt, Nigeria',
            bioExtended: 'Artist and photographer. Always looking for inspiration in everyday moments.',
            interests: ['Art', 'Photography', 'Nature'],
            matchingIntents: ['Dating', 'Creative Collaboration'],
            zodiacSign: 'Pisces',
            loveLanguage: 'Quality Time',
            avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
            isVerified: true,
            badgeLevel: 3,
            matchScore: 95,
            profileCompleteness: 78
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading swipe deck:', error);
      // Set mock data on error
      setDeck([
        {
          id: '1',
          name: 'Sarah Johnson',
          age: 26,
          location: 'Lagos, Nigeria',
          bioExtended: 'Digital creator passionate about sustainable fashion and tech innovation.',
          interests: ['Fashion', 'Tech', 'Sustainability'],
          matchingIntents: ['Dating', 'Friendship'],
          zodiacSign: 'Libra',
          loveLanguage: 'Words of Affirmation',
          avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
          isVerified: true,
          badgeLevel: 2,
          matchScore: 92,
          profileCompleteness: 85
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'like' | 'pass' | 'super_like') => {
    if (currentIndex >= deck.length) return;

    setIsRevealing(true);

    const currentProfile = deck[currentIndex];

    try {
      // Simulate API call to record swipe
      const response = await fetch('/api/lushpressies/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          targetUserId: currentProfile.id,
          direction
        })
      });

      if (response.ok) {
        const data = await response.json();

        onSwipe(currentProfile.id, direction);

        if (data.isMatch && onMatch) {
          onMatch(data.match);
        }

        // Move to next card after animation
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setIsRevealing(false);
        }, 300);
      } else {
        console.error('Failed to record swipe');
        setIsRevealing(false);
      }
    } catch (error) {
      console.error('Error recording swipe:', error);
      setIsRevealing(false);
    }
  };

  const handleReverseRoll = async () => {
    // Premium feature - allow reversing last pass
    if (currentIndex > 0) {
      // In a real app, this would call the reverse roll API
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentProfile = deck[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!currentProfile || currentIndex >= deck.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No more profiles</h3>
        <p className="mt-1 text-sm text-gray-500">Check back later for new matches!</p>
        <button
          onClick={loadSwipeDeck}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-700"
        >
          Refresh Deck
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 ${isRevealing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="relative h-96">
          {currentProfile.avatarUrl ? (
            <img
              src={currentProfile.avatarUrl}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-500">No image</div>
            </div>
          )}

          {/* Profile overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold">{currentProfile.name}, {currentProfile.age}</h3>
                <p className="text-sm opacity-80">{currentProfile.location}</p>
              </div>
              {currentProfile.matchScore && (
                <div className="flex items-center bg-white/20 rounded-full px-2 py-1">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-xs font-medium">{currentProfile.matchScore}%</span>
                </div>
              )}
            </div>

            {currentProfile.isVerified && (
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-950 border border-green-400 font-bold">
                  Verified
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile info */}
        <div className="p-4">
          {currentProfile.bioExtended && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{currentProfile.bioExtended}</p>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {currentProfile.interests.slice(0, 3).map((interest, index) => (
              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-950 border border-blue-400 font-bold">
                {interest}
              </span>
            ))}
          </div>

          {currentProfile.zodiacSign && (
            <div className="text-xs text-gray-500 mb-1">
              <span className="font-medium">Zodiac:</span> {currentProfile.zodiacSign}
            </div>
          )}

          {currentProfile.loveLanguage && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Love Language:</span> {currentProfile.loveLanguage}
            </div>
          )}
        </div>
      </div>

      {/* Swipe controls */}
      <div className="flex justify-center items-center space-x-6 mt-6">
        <button
          onClick={() => handleSwipe('pass')}
          disabled={isRevealing}
          className="p-4 bg-red-100 rounded-full text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
          aria-label="Pass"
        >
          <XCircleIcon className="h-8 w-8" />
        </button>

        <button
          onClick={() => handleSwipe('super_like')}
          disabled={isRevealing}
          className="p-4 bg-purple-100 rounded-full text-purple-950 hover:bg-purple-200 disabled:opacity-50 transition-colors border text-purple-950 border-purple-400 font-black"
          aria-label="Super Like"
        >
          <StarIcon className="h-8 w-8" />
        </button>

        <button
          onClick={() => handleSwipe('like')}
          disabled={isRevealing}
          className="p-4 bg-green-100 rounded-full text-green-600 hover:bg-green-200 disabled:opacity-50 transition-colors"
          aria-label="Like"
        >
          <HeartIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Reverse Roll (Premium Feature) */}
      <div className="mt-4 text-center">
        <button
          onClick={handleReverseRoll}
          className="text-xs text-amber-600 hover:text-amber-700 font-medium"
        >
          🔄 Reverse Roll (Premium)
        </button>
      </div>
    </div>
  );
};

export default LushSwipeController;
