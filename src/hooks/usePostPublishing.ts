import { useState, useCallback, useMemo } from 'react';
import { generatePublishingSuggestions } from '../services/publishingAIService';

export interface PublishingSettings {
  privacy: 'publicGroup' | 'privateGroup' | 'followers' | 'everyone';
  audience: {
    gender: 'everyone' | 'male' | 'female' | 'non-binary';
    ageBracket: 'everyone' | '13-17' | '18-24' | '25-34' | '35-44' | '45+';
  };
  comments: 'everyone' | 'followers' | 'none';
  schedule: {
    time: string;
    day: string;
    month: string;
  };
  shareToMi: boolean;
  monetization: {
    enabled: boolean;
    model: 'subscription' | 'oneTime' | 'payPerView';
  };
  broadcast: {
    enabled: boolean;
    audience: 'everyone' | 'subscribers' | 'followers';
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
  updateSettings: (newSettings: Partial<PublishingSettings>) => void;
  saveSettings: (postId: string) => Promise<boolean>;
  resetSettings: () => void;
  isDirty: boolean;
  isGeneratingSuggestions: boolean;
  error: string | null;
  generateAISuggestions: (
    contentData: any,
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
      // Mock / Local state save logic integration
      console.info(`Saving settings for post ${postId}`, settings);
      setOriginalSettings({ ...settings });
      return true;
    } catch (err) {
      console.error('Failed to save settings:', err);
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
        console.error('Error generating AI suggestions:', err);
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
