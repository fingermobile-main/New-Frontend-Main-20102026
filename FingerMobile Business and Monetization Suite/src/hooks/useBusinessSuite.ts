// Removed unused import: import { useState, useEffect } from 'react';
import { 
  OverviewResponse, 
  EstimateResponse,
  CreateApplicationRequest,
  EstimateRequest,
  ProgramDefinition
} from '../../shared/types';
import { useBusinessSuiteStore } from '../stores/business-suite-store';

// Define the return type interface with proper types
interface UseBusinessSuiteReturn {
  programs: ProgramDefinition[] | null;  // Changed to match store return type
  overview: OverviewResponse | null;
  estimate: EstimateResponse | null;
  loading: boolean;
  error: string | null;
  submitApplication: (application: CreateApplicationRequest) => Promise<void>;
  estimateRevenue: (payload: EstimateRequest) => Promise<EstimateResponse>;  // Changed to EstimateRequest
}

export const useBusinessSuite = (): UseBusinessSuiteReturn => {
  // Destructure the values from the store
  const { 
    programs, 
    overview, 
    estimate,  // Correct property name
    submitApplication,
    estimateRevenue,
    loading,
    error
  } = useBusinessSuiteStore();

  return {
    programs,
    overview,
    estimate,
    loading,
    error,
    submitApplication,
    estimateRevenue
  };
};