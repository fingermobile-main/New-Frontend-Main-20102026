import React, { useState, createContext, useContext, ReactNode } from 'react';
import postPublishingService from '../services/postPublishingService';
import { PublishingSettings } from '../components/posts/PostPublishingSettings';

interface PostPublishingContextType {
  settings: PublishingSettings;
  updateSettings: (newSettings: Partial<PublishingSettings>) => void;
  applyAIRecommendations: (content: string, memberId: string) => Promise<void>;
  saveSettings: (postId: string) => Promise<boolean>;
  loadSettings: (postId: string) => Promise<void>;
  resetSettings: () => void;
  isDirty: boolean;
}

const PostPublishingContext = React.createContext<
  PostPublishingContextType | undefined
>(undefined);

interface PostPublishingProviderProps {
  children: React.ReactNode;
  initialSettings?: Partial<PublishingSettings>;
}

const defaultSettings: PublishingSettings = {
  privacy: "publicGroup",
  audience: {
    gender: "everyone",
    ageBracket: "everyone"
  },
  comments: "everyone",
  schedule: {
    time: "",
    day: "",
    month: ""
  },
  shareToMi: false,
  monetization: {
    enabled: false,
    model: "subscription"
  },
  broadcast: {
    enabled: false,
    audience: "everyone",
    gender: "everyone",
    ageBracket: "everyone"
  },
  collaboration: {
    enabled: false,
    collaborators: [],
    duration: {
      days: 0,
      months: 0
    }
  },
  boosting: {
    enabled: false,
    type: "daily",
    amount: 0,
    region: "",
    continent: ""
  }
};

export const PostPublishingProvider: React.FC<PostPublishingProviderProps> = ({
  children,
  initialSettings
}) => {
  const [settings, setSettings] = React.useState<PublishingSettings>(
    initialSettings ? { ...defaultSettings, ...initialSettings } : defaultSettings
  );
  const [isDirty, setIsDirty] = React.useState(false);

  const updateSettings = (newSettings: Partial<PublishingSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    setIsDirty(true);
  };

  const applyAIRecommendations = async (content: string, memberId: string) => {
    try {
      const recommendations = await postPublishingService.applyAIRecommendations(content, memberId);
      if (recommendations && recommendations.success) {
        updateSettings(recommendations.suggestedSettings || {});
        return recommendations;
      }
      return null;
    } catch (error) {
      console.error('Failed to apply AI recommendations:', error);
      return null;
    }
  };

  const saveSettings = async (postId: string): Promise<boolean> => {
    try {
      const result = await postPublishingService.saveSettings(postId, settings);
      if (result && result.success) {
        setIsDirty(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  };

  const loadSettings = async (postId: string) => {
    try {
      const savedSettings = await postPublishingService.getSettings(postId);
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...savedSettings });
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setIsDirty(false);
  };

  return (
    <PostPublishingContext.Provider
      value={{
        settings,
        updateSettings,
        applyAIRecommendations,
        saveSettings,
        loadSettings,
        resetSettings,
        isDirty
      }}
    >
      {children}
    </PostPublishingContext.Provider>
  );
};

export const usePostPublishing = () => {
  const context = React.useContext(PostPublishingContext);
  if (context === undefined) {
    throw new Error("usePostPublishing must be used within a PostPublishingProvider");
  }
  return context;
};
