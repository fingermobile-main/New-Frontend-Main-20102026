import React, { useState } from 'react';
import { useAppContext } from './AppContext';

export interface AIContextType {
  generatePlaylist: (prompt: string) => Promise<string[]>;
  generatePostContent: (prompt: string) => Promise<string>;
  editContent: (content: string, instruction: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export const AIContext = React.createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: React.ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const { showToast } = useAppContext();

  const generatePlaylist = async (prompt: string): Promise<string[]> => {
    setIsLoading(true);

    try {
      // Simulate AI playlist generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Return mock playlist based on prompt
      if (prompt.toLowerCase().includes('workout')) {
        return [
          'Eye of the Tiger - Survivor',
          'Lose Yourself - Eminem',
          'Stronger - Kanye West',
          'Can\'t Hold Us - Macklemore & Ryan Lewis',
          'Thunder - Imagine Dragons'
        ];
      } else if (prompt.toLowerCase().includes('study')) {
        return [
          'Clair de Lune - Debussy',
          'Moonlight Sonata - Beethoven',
          'Gymnopédie No.1 - Satie',
          'Comptine d\'un autre été - Yann Tiersen',
          'River Flows in You - Yiruma'
        ];
      } else {
        return [
          'Bohemian Rhapsody - Queen',
          'Hotel California - Eagles',
          'Stairway to Heaven - Led Zeppelin',
          'Imagine - John Lennon',
          'Smells Like Teen Spirit - Nirvana'
        ];
      }
    } catch (error) {
      console.error('Error generating playlist:', error);
      showToast('Failed to generate playlist', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const generatePostContent = async (prompt: string): Promise<string> => {
    setIsLoading(true);

    try {
      // Simulate AI post content generation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return mock content based on prompt
      if (prompt.toLowerCase().includes('travel')) {
        return 'Just arrived at this stunning location! The views are absolutely breathtaking. Can\'t wait to share more of this amazing journey with you all. #TravelDiaries #Wanderlust';
      } else if (prompt.toLowerCase().includes('food')) {
        return 'Made this incredible dish today! The flavors are just perfect. Recipe will be in my next post. Cooking is truly therapeutic. #HomeCooking #Foodie';
      } else {
        return 'Life is what happens when you\'re busy making other plans. Enjoy every moment and cherish the little things that make life beautiful. #LifeThoughts #Mindfulness';
      }
    } catch (error) {
      console.error('Error generating post content:', error);
      showToast('Failed to generate post content', 'error');
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  const editContent = async (
    content: string,
    instruction: string,
  ): Promise<string> => {
    setIsLoading(true);

    try {
      // Simulate AI content editing
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Return mock edited content
      return `${content} [Enhanced based on your request: ${instruction}]`;
    } catch (error) {
      console.error('Error editing content:', error);
      showToast('Failed to edit content', 'error');
      return content;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        generatePlaylist,
        generatePostContent,
        editContent,
        isLoading,
        error
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = React.useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

// Export AIProvider as default
export default AIProvider;
