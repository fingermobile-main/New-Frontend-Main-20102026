// Import the actual functions
import { checkEligibility, getRecommendations } from '../../services/eligibility-service';
import { MonetizationMetrics, PlatformConfig } from '../../shared/types';

describe('Eligibility Service', () => {
  it('should check eligibility', async () => {
    // Mock data with proper types
    const userId = 'test-user';
    const metrics: Partial<MonetizationMetrics> = {};  // Using proper type instead of 'any'
    const config: Partial<PlatformConfig> = {};       // Using proper type instead of 'any'

    const result = await checkEligibility(userId, metrics, config);
    expect(result).toBeDefined();
  });

  it('should get recommendations', async () => {
    // Mock data with proper types
    const userId = 'test-user';
    const metrics: Partial<MonetizationMetrics> = {};  // Using proper type instead of 'any'
    const config: Partial<PlatformConfig> = {};       // Using proper type instead of 'any'

    const result = await getRecommendations(userId, metrics, config);
    expect(result).toBeDefined();
  });
});