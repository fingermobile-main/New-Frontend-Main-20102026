import React, { useState, useCallback } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { useNotificationContext } from '../contexts/NotificationContext';
import { AudioManager } from '../managers/AudioManager';

// Import the service properly
import SuperViAPI from '../services/SuperViAPIService'; // Changed to default import

type VoiceLineCategory = 'greeting' | 'action' | 'response' | 'farewell';

interface VoiceSettingsMap {
  [key: string]: {voiceId: string;
  pitch: number;
  };
}

interface VoiceActions {playGreeting: () => void;
  playAction: () => void;
  playResponse: () => void;
  playFarewell: () => void;
}

interface UseSuperViGameReturn {voiceActions: VoiceActions;
  voiceState: {isPlaying: boolean;
  currentVoiceLine: string | null;
  };
voiceControls: {stopCurrentVoice: () => void;
  };
}

export const useSuperViGame = (): UseSuperViGameReturn => {
  const { gameState } = useGameState();
  const { addNotification } = useNotificationContext();
  const playSound = (sound: string) => AudioManager.play(sound);
  const stopSound = (sound: string) => AudioManager.stop(sound);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoiceLine, setCurrentVoiceLine] = useState<string | null>(null);


  // Define the voice settings map
  const voiceSettingsMap: VoiceSettingsMap = {greeting: {voiceId: "voice-greeting-1",
  pitch: 1.0 },
action: {voiceId: "voice-action-1",
  pitch: 1.0 },
response: {voiceId: "voice-response-1",
  pitch: 1.0 },
farewell: {voiceId: "voice-farewell-1",
  pitch: 1.0 }
  };

  // Define the voice lines
  const greetings = [
    "Welcome to the game!",
    "Ready to start your journey?",
    "Great to see you again!",
    "Welcome back, champion!"
  ];
  
  const actions = [
    "Action packed moment!",
    "Get ready for action!",
    "Time for some action!",
    "Action sequence initiated!"
  ];
  
  const responses = [
    "Interesting choice!",
    "That's a good move!",
    "Well played!",
    "Excellent decision!"
  ];
  
  const farewells = [
    "Thanks for playing!",
    "See you next time!",
    "Goodbye, friend!",
    "Until next time!"
  ];

  const playVoiceLine = useCallback(async (text: string,
category: VoiceLineCategory) => {
    try {
      setIsPlaying(true);
      setCurrentVoiceLine(text);
      
      // Use SuperViAPI to synthesize speech
      const audioUrl = await SuperViAPI.synthesizeSpeech(
        text, 
        voiceSettingsMap[category as keyof VoiceSettingsMap] || voiceSettingsMap.greeting
      );
      
      await playSound(audioUrl);
      
      setIsPlaying(false);
      setCurrentVoiceLine(null);
    } catch (error) {
      console.error(`Error playing ${category} voice line:`, error);
      addNotification({message: `Failed to play ${category} voice line`,
type: 'error',
title: 'Voice Error'
      });
      setIsPlaying(false);
      setCurrentVoiceLine(null);
    }
  }, [addNotification, playSound, voiceSettingsMap]);

  const voiceActions = {playGreeting: () => playVoiceLine(greetings[Math.floor(Math.random() * greetings.length)], 'greeting'),
  playAction: () => playVoiceLine(actions[Math.floor(Math.random() * actions.length)], 'action'),
  playResponse: () => playVoiceLine(responses[Math.floor(Math.random() * responses.length)], 'response'),
  playFarewell: () => playVoiceLine(farewells[Math.floor(Math.random() * farewells.length)], 'farewell')
  };

  const voiceControls = {stopCurrentVoice: () => {
      stopSound('current');
      setIsPlaying(false);
      setCurrentVoiceLine(null);
    }
  };

  return {
    voiceActions,
voiceState: {
      isPlaying,
      currentVoiceLine
    },
    voiceControls
  };
};