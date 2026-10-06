import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Match {
  id: number;
  user_a_id: number;
  user_b_id: number;
  matched_at: string;
  status: 'active' | 'unmatched' | 'blocked';
}

interface LushMatchState {
  matches: Match[];
  activeMatchId: number | null;
  isLoading: boolean;
  error: string | null;
}

type LushMatchAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MATCHES'; payload: Match[] }
  | { type: 'ADD_MATCH'; payload: Match }
  | { type: 'REMOVE_MATCH'; payload: number }
  | { type: 'SET_ACTIVE_MATCH'; payload: number | null };

const initialState: LushMatchState = {
  matches: [],
  activeMatchId: null,
  isLoading: false,
  error: null,
};

const LushMatchContext = createContext<
  { state: LushMatchState; dispatch: React.Dispatch<LushMatchAction> } | undefined
>(undefined);

const matchReducer = (state: LushMatchState, action: LushMatchAction): LushMatchState => {
  switch (action.type) {
  case 'SET_LOADING':
    return { ...state, isLoading: action.payload };
  case 'SET_ERROR':
    return { ...state, error: action.payload };
  case 'SET_MATCHES':
    return { ...state, matches: action.payload };
  case 'ADD_MATCH':
    return { ...state, matches: [...state.matches, action.payload] };
  case 'REMOVE_MATCH':
    return { ...state, matches: state.matches.filter(m => m.id !== action.payload) };
  case 'SET_ACTIVE_MATCH':
    return { ...state, activeMatchId: action.payload };
  default:
    return state;
  }
};

export const LushMatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  return (
    <LushMatchContext.Provider value={{ state, dispatch }}>
      {children}
    </LushMatchContext.Provider>
  );
};

export const useLushMatch = () => {
  const context = useContext(LushMatchContext);
  if (!context) {
    throw new Error('useLushMatch must be used within a LushMatchProvider');
  }
  return context;
};
