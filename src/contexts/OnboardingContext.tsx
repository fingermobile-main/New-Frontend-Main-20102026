import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User } from '../types/user';
import OnboardingService, { OnboardingProgress, OnboardingStep } from '../services/onboardingService';

interface OnboardingState {
  progress: OnboardingProgress | null;
  steps: OnboardingStep[];
  currentStepIndex: number;
  isLoading: boolean;
  error: string | null;
}

type OnboardingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROGRESS'; payload: OnboardingProgress }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<OnboardingProgress> }
  | { type: 'SET_STEPS'; payload: OnboardingStep[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET_ONBOARDING' };

const initialState: OnboardingState = {
  progress: null,
  steps: [],
  currentStepIndex: 0,
  isLoading: false,
  error: null
};

const OnboardingContext = createContext<{
  state: OnboardingState;
  initializeOnboarding: (userId: string, userData: Partial<User>) => Promise<void>;
  completeCurrentStep: () => Promise<void>;
  updateProgress: (data: Partial<OnboardingProgress>) => Promise<void>;
  setAccountType: (accountType: 'personal' | 'creator' | 'business') => Promise<void>;
  setInterests: (interests: string[]) => Promise<void>;
  setDemographics: (demographics: OnboardingProgress['demographicInfo']) => Promise<void>;
  markVerificationComplete: (verificationType: keyof OnboardingProgress['verificationStatus'], status: boolean) => Promise<void>;
  finalizeOnboarding: () => Promise<boolean>;
  goToStep: (stepId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
    } | undefined>(undefined);

const onboardingReducer = (state: OnboardingState, action: OnboardingAction): OnboardingState => {
  switch (action.type) {
  case 'SET_LOADING':
    return { ...state, isLoading: action.payload };
  case 'SET_ERROR':
    return { ...state, error: action.payload, isLoading: false };
  case 'SET_PROGRESS': {
    const stepIndex = state.steps.findIndex(step => step.id === action.payload.currentStep);
    return {
      ...state,
      progress: action.payload,
      currentStepIndex: stepIndex >= 0 ? stepIndex : 0
    };
  }
  case 'UPDATE_PROGRESS': {
    if (!state.progress) return state;
    const updatedProgress = { ...state.progress, ...action.payload, updatedAt: new Date() };
    const updatedStepIndex = state.steps.findIndex(step => step.id === updatedProgress.currentStep);
    return {
      ...state,
      progress: updatedProgress,
      currentStepIndex: updatedStepIndex >= 0 ? updatedStepIndex : 0
    };
  }
  case 'SET_STEPS':
    return { ...state, steps: action.payload };
  case 'NEXT_STEP':
    return { ...state, currentStepIndex: Math.min(state.currentStepIndex + 1, state.steps.length - 1) };
  case 'PREVIOUS_STEP':
    return { ...state, currentStepIndex: Math.max(state.currentStepIndex - 1, 0) };
  case 'RESET_ONBOARDING':
    return { ...initialState, steps: state.steps };
  default:
    return state;
  }
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const initializeOnboarding = async (userId: string, userData: Partial<User>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const progress = await OnboardingService.initializeOnboarding(userId, userData);
      dispatch({ type: 'SET_PROGRESS', payload: progress });

      // Get steps based on account type
      const steps = await OnboardingService.getOnboardingSteps(progress.accountType);
      dispatch({ type: 'SET_STEPS', payload: steps });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize onboarding';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const completeCurrentStep = async () => {
    if (!state.progress) {
      dispatch({ type: 'SET_ERROR', payload: 'No onboarding progress found' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedProgress = await OnboardingService.completeStep(state.progress.userId, state.progress.currentStep);
      dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete step';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProgress = async (data: Partial<OnboardingProgress>) => {
    if (!state.progress) {
      dispatch({ type: 'SET_ERROR', payload: 'No onboarding progress found' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedProgress = await OnboardingService.updateProgress(state.progress.userId, data);
      dispatch({ type: 'UPDATE_PROGRESS', payload: data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update progress';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setAccountType = async (accountType: 'personal' | 'creator' | 'business') => {
    if (!state.progress) {
      dispatch({ type: 'SET_ERROR', payload: 'No onboarding progress found' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedProgress = await OnboardingService.setAccountType(state.progress.userId, accountType);
      dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });

      // Update steps based on new account type
      const steps = await OnboardingService.getOnboardingSteps(accountType);
      dispatch({ type: 'SET_STEPS', payload: steps });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set account type';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setInterests = async (interests: string[]) => {
    if (!state.progress) {
      dispatch({ type: 'SET_ERROR', payload: 'No onboarding progress found' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedProgress = await OnboardingService.setInterests(state.progress.userId, interests);
      dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set interests';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setDemographics = async (demographics: OnboardingProgress['demographicInfo']) => {
    if (!state.progress) {
      dispatch({ type: 'SET_ERROR', payload: 'No onboarding progress found' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedProgress = await OnboardingService.setDemographics(state.progress.userId, demographics);
      dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set demographics';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const markVerificationComplete = async (
    verificationType: keyof OnboardingProgress['verificationStatus'],
    status: boolean
  ) => {
    if (!state.progress) {
      dispatch({ type: 'SET_ERROR', payload: 'No onboarding progress found' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedProgress = await OnboardingService.markVerificationComplete(
        state.progress.userId,
        verificationType,
        status
      );
      dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark verification complete';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const finalizeOnboarding = async (): Promise<boolean> => {
    if (!state.progress) {
      dispatch({ type: 'SET_ERROR', payload: 'No onboarding progress found' });
      return false;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const success = await OnboardingService.finalizeOnboarding(state.progress.userId);
      if (success) {
        dispatch({ type: 'RESET_ONBOARDING' });
      }
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to finalize onboarding';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const goToStep = (stepId: string) => {
    const stepIndex = state.steps.findIndex(step => step.id === stepId);
    if (stepIndex >= 0) {
      dispatch({ type: 'SET_LOADING', payload: false }); // Cancel any loading state when navigating
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_PROGRESS', payload: { ...state.progress!, currentStep: stepId } as OnboardingProgress });
    }
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const value = {
    state,
    initializeOnboarding,
    completeCurrentStep,
    updateProgress,
    setAccountType,
    setInterests,
    setDemographics,
    markVerificationComplete,
    finalizeOnboarding,
    goToStep,
    nextStep,
    previousStep
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
