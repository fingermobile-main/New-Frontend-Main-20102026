import React, { createContext, useContext } from 'react';
export type HapticFeedbackType =
  | "selection"
  | "impact"
  | "notification"
  | "medium"
  | "heavy";

export interface HapticFeedbackContextType {
  triggerHaptic: (type?: HapticFeedbackType) => void;
}

export const HapticFeedbackContext = createContext<
  HapticFeedbackContextType | undefined
>(undefined);

export const useHapticFeedback = () => {
  const context = React.useContext(HapticFeedbackContext);
  if (context === undefined) {
    throw new Error(
      "useHapticFeedback must be used within a HapticFeedbackProvider",
    );
  }
  return context;
};

export const useHaptic = useHapticFeedback;

export const HapticFeedbackProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Note: useAppContext() removed to prevent circular dependency
  // Haptic feedback should be independent of AppContext

  const triggerHaptic = (type: HapticFeedbackType = 'selection') => {
    // In a real implementation, this would trigger actual haptic feedback
    console.info(`Haptic feedback triggered: ${type}`);
  };

  return (
    <HapticFeedbackContext.Provider value={{ triggerHaptic }}>
      {children}
    </HapticFeedbackContext.Provider>
  );
};

// Adding default export
export default HapticFeedbackProvider;