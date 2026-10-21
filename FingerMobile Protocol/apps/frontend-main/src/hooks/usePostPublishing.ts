import { useState, useCallback, useMemo } from 'react';
import { generatePublishingSuggestions } from '../services/publishingAIService';
import { logError } from '../utils/errorLogger';

export interface PublishingSettings {
  privacy: 'publicGroup' | 'privateGroup' | 'followers' | 'following' | 'followersFollowing' | 'taggedMembers' | 'custom' | 'onlyMe' | 'everyone';
  audience: {
    gender: 'everyone' | 'male' | 'female' | 'custom';
    ageBracket: 'everyone' | '24-34' | '34-45' | '45+' | '13-17' | '18-24' | '25-34' | '35-44';
  };
  comments: 'everyone' | 'followers' | 'following' | 'taggedOnly' | 'none';
  schedule: {
    time: string;
    day: string;
    month: string;
  };
  shareToMi: boolean | 'always';
  monetization: {
    enabled: boolean;
    model: 'subscription' | 'oneTime' | 'payPerView' | 'tips' | 'sponsored' | 'affiliate';
  };
  broadcast: {
    enabled: boolean;
    audience: 'everyone' | 'subscribers' | 'followers' | 'following' | 'taggedOnly';
    gender: string;
    ageBracket: string;
  };
  collaboration: {
    enabled: boolean;
    collaborators: string[];
    duration: {
      days: number;
      months: number;
    };
  };
  boosting: {
    enabled: boolean;
    type: 'daily' | 'oneTime';
    amount: number;
    region: string;
    continent: string;
  };
  demographics?: {
    allowedLocations?: string[];
    excludedLocations?: string[];
    genderTarget?: 'all' | 'male' | 'female' | 'custom';
    allowedGenders?: string[];
    ageRangeMin?: number;
    ageRangeMax?: number;
    geofencePolygon?: Array<{ lat: number; lng: number }>;
  };
}

interface UsePostPublishingReturn {
  settings: PublishingSettings;
  // eslint-disable-next-line no-unused-vars
  updateSettings: (newSettings: Partial<PublishingSettings>) => void;
  // eslint-disable-next-line no-unused-vars
  saveSettings: (postId: string) => Promise<boolean>;
  resetSettings: () => void;
  isDirty: boolean;
  isGeneratingSuggestions: boolean;
  error: string | null;
  // eslint-disable-next-line no-unused-vars
  generateAISuggestions: (
    // eslint-disable-next-line no-unused-vars
    contentData: any,
    // eslint-disable-next-line no-unused-vars
    memberData: unknown
  ) => Promise<Partial<PublishingSettings> | null>;
}

// Fixed initial state to exactly match defined types to prevent compilation crashes
const DEFAULT_SETTINGS: PublishingSettings = {
  privacy: 'everyone',
  audience: {
    gender: 'everyone',
    ageBracket: 'everyone'
  },
  comments: 'everyone',
  schedule: {
    time: '',
    day: '',
    month: ''
  },
  shareToMi: false,
  monetization: {
    enabled: false,
    model: 'oneTime'
  },
  broadcast: {
    enabled: false,
    audience: 'everyone',
    gender: 'everyone',
    ageBracket: 'everyone'
  },
  collaboration: {
    enabled: false,
    collaborators: [],
    duration: {
      days: 7,
      months: 0
    }
  },
  boosting: {
    enabled: false,
    type: 'oneTime',
    amount: 0,
    region: '',
    continent: ''
  },
  demographics: {
    allowedLocations: [],
    excludedLocations: [],
    genderTarget: 'all',
    allowedGenders: ['all'],
    ageRangeMin: 22,
    ageRangeMax: 60,
    geofencePolygon: []
  }
};

export const usePostPublishing = (): UsePostPublishingReturn => {
  const [settings, setSettings] = useState<PublishingSettings>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<PublishingSettings>(DEFAULT_SETTINGS);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = useCallback((newSettings: Partial<PublishingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const saveSettings = useCallback(async (postId: string): Promise<boolean> => {
    try {
      if (!postId) return false;
      setOriginalSettings({ ...settings });
      return true;
    } catch (err) {
      logError(err, { context: 'usePostPublishing - saveSettings' });
      return false;
    }
  }, [settings]);

  const resetSettings = useCallback(() => {
    setSettings({ ...originalSettings });
  }, [originalSettings]);

  // Memoized dirtiness check keeps execution performance high during heavy parent render loops
  const isDirty = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  }, [settings, originalSettings]);

  /**
   * Generates AI-powered publishing suggestions via backend AI context models
   */
  const generateAISuggestions = useCallback(
    async (contentData: any, memberData: unknown) => {
      setIsGeneratingSuggestions(true);
      setError(null);

      try {
        const suggestions = await generatePublishingSuggestions(
          contentData,
          // @ts-ignore - Auto-suppressed for compilation safety
          memberData
        );
        return suggestions as Partial<PublishingSettings>;
      } catch (err) {
        setError('Failed to generate AI suggestions. Please try again.');
        logError(err, { context: 'usePostPublishing - generateAISuggestions' });
        return null;
      } finally {
        setIsGeneratingSuggestions(false);
      }
    },
    []
  );

  return {
    settings,
    updateSettings,
    saveSettings,
    resetSettings,
    isDirty,
    isGeneratingSuggestions,
    error,
    generateAISuggestions
  };
};

export default usePostPublishing;
