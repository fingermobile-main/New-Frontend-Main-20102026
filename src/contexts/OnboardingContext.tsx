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

const defaultSteps: OnboardingStep[] = [
  { id: 'welcome', title: 'Welcome to FingerMobile', description: 'Get set up with your account', required: true },
  { id: 'terms-permissions', title: 'Terms & Permissions', description: 'Review agreements', required: true },
  { id: 'registration', title: 'Registration', description: 'Account credentials', required: true },
  { id: 'two-factor-setup', title: 'Two-Factor Authentication Setup', description: 'Secure your account with 2FA', required: true },
  { id: 'verification-captcha', title: 'Verification & Captcha', description: 'Verify phone and captcha', required: true },
  { id: 'demographics-interests', title: 'Demographics & Interests', description: 'Personalize your feed', required: true },
  { id: 'profile-customization', title: 'Profile Customization', description: 'Set up your profile', required: true },
  { id: 'p2p-algorithm-calibration', title: 'P2P Algorithm Calibration', description: 'Configure preferences', required: true },
  { id: 'account-type-selection', title: 'Account Type Selection', description: 'Select personal, creator or business', required: true },
  { id: 'content-creator-verification', title: 'Content Creator Verification', description: 'Verify identity as creator', required: true },
  { id: 'business-verification', title: 'Business Verification', description: 'Verify business credentials', required: true },
  { id: 'ces-formula-education', title: 'CES Formula Education', description: 'Platform scoring system', required: true },
  { id: 'completion', title: 'Complete', description: 'Ready to explore', required: false }
];

const initialState: OnboardingState = {
  progress: {
    userId: 'guest',
    currentStep: 'welcome',
    completedSteps: [],
    profileData: {},
    interests: [],
    verificationStatus: {},
    accountType: null,
    demographicInfo: {},
    p2pAlgorithmData: {},
    termsAccepted: {},
    permissionsGranted: {},
    cesFormula: { likesWeight: 1, savesWeight: 1, commentsWeight: 4, sharesWeight: 4, followsWeight: 8 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  steps: defaultSteps,
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
  nextStep: () => Promise<void>;
  previousStep: () => Promise<void>;
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
  case 'SET_STEPS': {
    const steps = action.payload.length > 0 ? action.payload : defaultSteps;
    const currentStepIndex = state.progress 
      ? steps.findIndex(step => step.id === state.progress!.currentStep)
      : state.currentStepIndex;
    return { 
      ...state, 
      steps,
      currentStepIndex: currentStepIndex >= 0 ? currentStepIndex : state.currentStepIndex
    };
  }
  case 'NEXT_STEP': {
    if (!state.progress) {
      const nextIndex = Math.min(state.currentStepIndex + 1, Math.max(state.steps.length - 1, 0));
      const nextStepId = state.steps[nextIndex]?.id || 'terms-permissions';
      return {
        ...state,
        currentStepIndex: nextIndex,
        progress: { ...initialState.progress!, currentStep: nextStepId }
      };
    }
    
    // Determine the next step based on account type
    let nextStepId: string;
    switch (state.progress.currentStep) {
      case 'account-type-selection':
        // If user selected 'creator', go to creator verification
        if (state.progress.accountType === 'creator') {
          nextStepId = 'content-creator-verification';
        } 
        // If user selected 'business', go to business verification
        else if (state.progress.accountType === 'business') {
          nextStepId = 'business-verification';
        }
        // If user selected 'personal' or no account type, skip to CES formula education
        else {
          nextStepId = 'ces-formula-education';
        }
        break;
      case 'content-creator-verification':
        // After creator verification, go to CES formula education
        nextStepId = 'ces-formula-education';
        break;
      case 'business-verification':
        // After business verification, go to CES formula education
        nextStepId = 'ces-formula-education';
        break;
      default:
        // For all other steps, go to the next sequential step
        const currentIndex = state.steps.findIndex(step => step.id === state.progress!.currentStep);
        const nextIndex = Math.min(currentIndex + 1, Math.max(state.steps.length - 1, 0));
        nextStepId = state.steps[nextIndex]?.id || 'completion';
        break;
    }
    
    const nextStepIndex = state.steps.findIndex(step => step.id === nextStepId);
    const updatedProgress = { ...state.progress, currentStep: nextStepId };
    
    return {
      ...state,
      currentStepIndex: nextStepIndex >= 0 ? nextStepIndex : state.currentStepIndex,
      progress: updatedProgress
    };
  }
  case 'PREVIOUS_STEP': {
    const prevIndex = Math.max(state.currentStepIndex - 1, 0);
    const prevStepId = state.steps[prevIndex]?.id || 'welcome';
    return {
      ...state,
      currentStepIndex: prevIndex,
      progress: state.progress ? { ...state.progress, currentStep: prevStepId } : null
    };
  }
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
        // Mark as completed in local storage
        localStorage.setItem(`onboardingComplete_${state.progress.userId}`, 'true');
        
        // Update user object if it exists
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            user.onboardingComplete = true;
            localStorage.setItem('user', JSON.stringify(user));
          } catch (e) {}
        }
        
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

  const nextStep = async () => {
    if (state.progress && state.steps.length > 0) {
      const currentIndex = state.steps.findIndex(step => step.id === state.progress?.currentStep);
      
      // Ensure the current step is marked as completed
      const currentStepId = state.progress.currentStep;
      let completedSteps = [...(state.progress.completedSteps || [])];
      if (!completedSteps.includes(currentStepId)) {
        completedSteps.push(currentStepId);
      }

      if (currentIndex >= 0 && currentIndex < state.steps.length - 1) {
        const nextStepId = state.steps[currentIndex + 1].id;
        await OnboardingService.updateProgress(state.progress.userId, { 
          currentStep: nextStepId,
          completedSteps: completedSteps
        });
        
        // Also update the local state immediately
        dispatch({ 
          type: 'SET_PROGRESS', 
          payload: { 
            ...state.progress, 
            currentStep: nextStepId,
            completedSteps: completedSteps 
          } as OnboardingProgress 
        });
      } else {
        await OnboardingService.updateProgress(state.progress.userId, { completedSteps });
        dispatch({ 
          type: 'SET_PROGRESS', 
          payload: { ...state.progress, completedSteps } as OnboardingProgress 
        });
      }
    }
    dispatch({ type: 'NEXT_STEP' });
  };

  const previousStep = async () => {
    if (state.progress && state.steps.length > 0) {
      const currentIndex = state.steps.findIndex(step => step.id === state.progress?.currentStep);
      if (currentIndex > 0) {
        const prevStepId = state.steps[currentIndex - 1].id;
        await OnboardingService.updateProgress(state.progress.userId, { currentStep: prevStepId });
      }
    }
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
