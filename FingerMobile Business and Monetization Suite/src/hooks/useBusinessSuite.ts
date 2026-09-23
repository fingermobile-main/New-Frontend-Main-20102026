// Removed unused import: import { ProgramsResponse, ... } from '../../shared/types';
import { 
  OverviewResponse, 
  EstimateResponse,
  CreateApplicationRequest
} from '../../shared/types';
import { useBusinessSuiteStore } from '../stores/business-suite-store';

// Define the return type interface
interface UseBusinessSuiteReturn {
  programs: any[] | null;  // Using any[] temporarily to avoid type mismatch
  overview: OverviewResponse | null;
  estimates: EstimateResponse | null;  // Fixing the property name to match implementation
  loading: boolean;
  error: string | null;
  submitApplication: (application: CreateApplicationRequest) => Promise<void>;
  estimateRevenue: (payload: any) => Promise<EstimateResponse>;
}

export const useBusinessSuite = (): UseBusinessSuiteReturn => {
  // Destructure the values from the store
  const { 
    programs, 
    overview, 
    estimates: estimate,  // Map estimates to estimate
    submitApplication,
    estimateRevenue,
    loading,
    error
  } = useBusinessSuiteStore();

  return {
    programs,
    overview,
    estimates,
    loading,
    error,
    submitApplication,
    estimateRevenue
  };
};