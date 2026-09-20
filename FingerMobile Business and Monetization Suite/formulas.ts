interface EstimateRequest {
  productKey: string;
  region: string;
  projectedVolume: number;
}

interface EstimateResult {
  productKey: string;
  region: string;
  projectedVolume: number;
  estimatedRevenue: number;
  confidence: number;
}

export function calculateEstimates(request: EstimateRequest): EstimateResult {
  // Simple estimation algorithm - in reality this would be more sophisticated
  const baseRate = 0.1; // $0.10 per unit
  const regionalMultiplier = getRegionalMultiplier(request.region);
  const volumeMultiplier = getVolumeMultiplier(request.projectedVolume);
  
  const estimatedRevenue = request.projectedVolume * baseRate * regionalMultiplier * volumeMultiplier;
  
  return {
    ...request,
    estimatedRevenue: parseFloat(estimatedRevenue.toFixed(2)),
    confidence: 0.85 // 85% confidence for all estimates in this example
  };
}

function getRegionalMultiplier(region: string): number {
  const multipliers: Record<string, number> = {
    'US': 1.0,
    'EU': 0.9,
    'ASIA': 0.8,
    'LATAM': 0.7,
    'AFRICA': 0.6
  };
  
  return multipliers[region.toUpperCase()] || 1.0;
}

function getVolumeMultiplier(volume: number): number {
  if (volume > 100000) return 1.2;
  if (volume > 50000) return 1.1;
  if (volume > 10000) return 1.05;
  return 1.0;
}