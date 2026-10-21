import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
  bio: string;
  interests: string[];
  location: string;
  distance: number; // in kilometers
  age: number;
  isOnline: boolean;
  lastActive: string;
  isVerified: boolean;
  matchScore: number; // 0-100
}

export interface Match {
  id: string;
  userId: string;
  matchedWithId: string;
  matchedAt: string;
  status: 'active' | 'inactive' | 'unmatched';
  conversationId?: string;
  pin_exchanged?: boolean;
  pin_exchange_date?: string;
  commit_progress_days?: number;
  commit_status?: 'pending' | 'active' | 'broken' | 'completed' | 'none';
}

export type LushMatch = Match;

interface MatchingPreferences {
  genderPreference: string[];
  ageRange: { min: number; max: number };
  distance: number; // in kilometers
  interests: string[];
  keywords: string[];
  incognitoMode: boolean;
  showMe: 'everyone' | 'verified_only' | 'connections_only';
}

export function useLushMatching(userId: string) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [preferences, setPreferences] = useState<MatchingPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Partial<MatchingPreferences>>({});

  // Load profiles for discovery
  const loadDiscoveryProfiles = async (filters?: Partial<MatchingPreferences>, limit: number = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/discovery/${userId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ filters, limit })
      // });
      // const data = await response.json();

      // Mock data for demonstration
      const mockProfiles: UserProfile[] = Array.from({ length: limit }, (_, i) => ({
        id: `profile_${Date.now()}_${i}`,
        firstName: ['Emma', 'Sophia', 'Olivia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia'][i % 8],
        lastName: ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'][i % 8],
        username: `user${Date.now()}${i}`,
        bio: `Hello! I'm interested in ${['travel', 'music', 'food', 'fitness', 'reading', 'adventure'][i % 6]} and ${['nature', 'art', 'tech', 'culture', 'sports', 'yoga'][i % 6]}.`,
        interests: ['Travel', 'Music', 'Food', 'Fitness', 'Reading', 'Adventure'].slice(0, 3 + i % 2),
        location: `${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][i % 5]}, USA`,
        distance: Math.floor(Math.random() * 20) + 5, // 5-25 km away
        age: 22 + (i % 10),
        isOnline: i % 3 !== 0, // 2/3 are online
        lastActive: new Date(Date.now() - (i * 1000 * 60 * 60)).toISOString(),
        isVerified: i % 2 === 0, // Half are verified
        matchScore: Math.floor(Math.random() * 40) + 60 // 60-100%
      }));

      setProfiles(mockProfiles);
    } catch (err) {
      setError('Failed to load discovery profiles');
      // eslint-disable-next-line no-console
      console.error('Error loading discovery profiles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load matches
  const loadMatches = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/matches/${userId}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockMatches: Match[] = Array.from({ length: 5 }, (_, i) => ({
        id: `match_${Date.now()}_${i}`,
        userId,
        matchedWithId: `user_${Date.now()}_${i}`,
        matchedAt: new Date(Date.now() - (i * 1000 * 60 * 60 * 24)).toISOString(), // Different days ago
        status: 'active',
        conversationId: `conv_${Date.now()}_${i}`
      }));

      setMatches(mockMatches);
    } catch (err) {
      setError('Failed to load matches');
      // eslint-disable-next-line no-console
      console.error('Error loading matches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load preferences
  const loadPreferences = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/preferences/${userId}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockPreferences: MatchingPreferences = {
        genderPreference: ['women', 'non-binary'],
        ageRange: { min: 22, max: 35 },
        distance: 50,
        interests: ['Travel', 'Music', 'Food'],
        keywords: ['adventurous', 'kind', 'fun-loving'],
        incognitoMode: false,
        showMe: 'everyone'
      };

      setPreferences(mockPreferences);
    } catch (err) {
      setError('Failed to load preferences');
      // eslint-disable-next-line no-console
      console.error('Error loading preferences:', err);
    }
  };

  // Update preferences
  const updatePreferences = async (newPreferences: Partial<MatchingPreferences>) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/preferences/${userId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newPreferences)
      // });

      // Update local state
      if (preferences) {
        setPreferences({ ...preferences, ...newPreferences });
      }
    } catch (err) {
      setError('Failed to update preferences');
      // eslint-disable-next-line no-console
      console.error('Error updating preferences:', err);
    }
  };

  // Record a swipe
  const recordSwipe = async (targetUserId: string, isLike: boolean) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/swipe`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, targetUserId, isLike })
      // });

      // If it was a like, potentially create a match
      if (isLike) {
        // In a real app, we'd check if target user also liked current user
        // For demo, we'll randomly create a match
        if (Math.random() > 0.7) { // 30% chance of match
          const newMatch: Match = {
            id: `match_${Date.now()}`,
            userId,
            matchedWithId: targetUserId,
            matchedAt: new Date().toISOString(),
            status: 'active'
          };

          setMatches(prev => [...prev, newMatch]);
        }
      }
    } catch (err) {
      setError('Failed to record swipe');
      // eslint-disable-next-line no-console
      console.error('Error recording swipe:', err);
    }
  };

  // Report a user
  const reportUser = async (targetUserId: string, _reason: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/report`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reporterId: userId, reportedId: targetUserId, reason })
      // });

      // Remove the reported user from profiles
      setProfiles(prev => prev.filter(profile => profile.id !== targetUserId));
    } catch (err) {
      setError('Failed to report user');
      // eslint-disable-next-line no-console
      console.error('Error reporting user:', err);
    }
  };

  // Block a user
  const blockUser = async (targetUserId: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/block`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ blockerId: userId, blockedId: targetUserId })
      // });

      // Remove the blocked user from profiles
      setProfiles(prev => prev.filter(profile => profile.id !== targetUserId));
    } catch (err) {
      setError('Failed to block user');
      // eslint-disable-next-line no-console
      console.error('Error blocking user:', err);
    }
  };

  // Filter profiles based on active filters
  const filterProfiles = (filters: Partial<MatchingPreferences>) => {
    setActiveFilters(filters);
    // Apply filters to current profiles
    // This would typically trigger a new API call in a real app
  };

  // Get mutual connections
  const getMutualConnections = async (_targetUserId: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/mutual-connections/${userId}/${targetUserId}`);
      // return await response.json();

      // Mock data
      return {
        count: Math.floor(Math.random() * 5),
        connections: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
          id: `conn_${i}`,
          name: `Mutual Connection ${i + 1}`,
          avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${20 + i}.jpg`
        }))
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error getting mutual connections:', err);
      return { count: 0, connections: [] };
    }
  };

  // Initialize data
  useEffect(() => {
    if (userId) {
      loadDiscoveryProfiles();
      loadMatches();
      loadPreferences();
    }
  }, [userId]);

  return {
    profiles,
    matches,
    preferences,
    activeFilters,
    isLoading,
    error,
    loadDiscoveryProfiles,
    loadMatches,
    loadPreferences,
    updatePreferences,
    recordSwipe,
    reportUser,
    blockUser,
    filterProfiles,
    getMutualConnections
  };
}
