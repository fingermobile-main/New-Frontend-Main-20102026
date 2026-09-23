// Import the actual functions
import { checkEligibility, getRecommendations } from '../../services/eligibility-service';

describe('Eligibility Service', () => {
  it('should check eligibility', async () => {
    // Mock data
    const userId = 'test-user';
    const metrics: any = {};
    const config: any = {};

    const result = await checkEligibility(userId, metrics, config);
    expect(result).toBeDefined();
  });

  it('should get recommendations', async () => {
    // Mock data
    const userId = 'test-user';
    const metrics: any = {};
    const config: any = {};

    const result = await getRecommendations(userId, metrics, config);
    expect(result).toBeDefined();
  });
});