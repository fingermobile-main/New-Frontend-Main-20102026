jest.mock('../../services/creatorInfluenceSubscriptionService', () => ({
  recommendTier: jest.fn(async () => ({
    recommendedTier: 'growth_creator',
    tiers: ['free', 'rising_creator', 'growth_creator']
  })),
  createSubscription: jest.fn(async (data) => ({
    id: 'sub_12345',
    member_id: data.member_id,
    subscription_level: data.subscription_level,
    status: 'active',
    created_at: new Date().toISOString()
  })),
  getMemberSubscription: jest.fn(async (memberId) => ({
    id: 'sub_12345',
    member_id: memberId,
    subscription_level: 'rising_creator',
    status: 'active'
  })),
  getSubscriptionBenefits: jest.fn(async (level) => ({
    level,
    features: ['Advanced analytics', 'Monetization access']
  })),
  getAllSubscriptionTiers: jest.fn(() => ({
    FREE: { level: 'free', price: 0 },
    RISING_CREATOR: { level: 'rising_creator', price: 100 }
  })),
  checkFeatureAccess: jest.fn(async (memberId, feature) => ({
    hasAccess: true,
    feature
  }))
}));

const CreatorInfluenceSubscriptionController = require('../../controllers/creatorInfluenceSubscriptionController');

describe('Creator Influence Subscription Controller Suite', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {},
      body: {},
      query: {},
      member: { id: '00000000-0000-0000-0000-000000000001' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getSubscriptionRecommendations', () => {
    it('should return 400 if member_id is missing', async () => {
      await CreatorInfluenceSubscriptionController.getSubscriptionRecommendations(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return subscription recommendations for valid member_id', async () => {
      req.params = { member_id: 'member-123' };
      await CreatorInfluenceSubscriptionController.getSubscriptionRecommendations(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ recommendedTier: 'growth_creator' })
        })
      );
    });
  });

  describe('createSubscription', () => {
    it('should enforce member_id and subscription_level parameters', async () => {
      req.body = { member_id: 'member-123' };
      await CreatorInfluenceSubscriptionController.createSubscription(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should create subscription successfully', async () => {
      req.body = {
        member_id: 'member-123',
        subscription_level: 'rising_creator',
        subscription_type: 'monthly'
      };
      await CreatorInfluenceSubscriptionController.createSubscription(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ subscription_level: 'rising_creator' })
        })
      );
    });
  });

  describe('getMemberSubscription', () => {
    it('should return subscription details for active subscriber', async () => {
      req.params = { member_id: 'member-123' };
      await CreatorInfluenceSubscriptionController.getMemberSubscription(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ status: 'active' })
        })
      );
    });
  });
});
