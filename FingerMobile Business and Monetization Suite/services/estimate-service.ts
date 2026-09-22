import { EstimateRequest, EstimateResult } from '../shared/types';

export const calculateEstimate = (request: EstimateRequest): EstimateResult => {
  // Extract values from the request, with defaults
  const { 
    projectedMonthlyUsers = 1000, 
    engagementRate = 0.05, 
    conversionRate = 0.02,
    averageOrderValue = 50,
    contentCategories = [],
    geographicFocus = []
  } = request;

  // Perform calculations based on inputs
  const potentialVisitors = projectedMonthlyUsers;
  const engagedUsers = potentialVisitors * engagementRate;
  const conversions = engagedUsers * conversionRate;
  const projectedRevenue = conversions * averageOrderValue;

  // Determine confidence level based on inputs
  const confidence = contentCategories.length > 3 && geographicFocus.length > 1 ? 'high' : 'medium';

  // Create the base estimate result
  const estimateData = {
    potentialRevenueRange: {
      min: Math.floor(projectedRevenue * 0.7),
      max: Math.ceil(projectedRevenue * 1.3),
      currency: 'USD'
    },
    keyDrivers: [
      'User engagement metrics',
      'Conversion optimization',
      'Content quality factors'
    ],
    riskFactors: [
      'Market volatility',
      'Competition intensity',
      'Seasonal fluctuations'
    ],
    recommendations: [
      'Optimize conversion funnel',
      'Improve content strategy',
      'Diversify revenue streams'
    ],
    confidenceLevel: confidence as 'low' | 'medium' | 'high'  // Ensure type matches expected enum
  };

  return estimateData;
};

export default {
  calculateEstimate
};