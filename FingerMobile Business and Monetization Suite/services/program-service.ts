import { ProgramDefinition } from '../shared/types';

const mockProgramDefinitions: ProgramDefinition[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Entry level monetization plan',
    features: ['Basic analytics', 'Limited support', 'Standard payouts'],
    pricing: {
      monthly: 9.99,
      yearly: 99.99
    },
    eligibilityRequirements: {}
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    description: 'Advanced monetization features',
    features: ['Advanced analytics', 'Priority support', 'Faster payouts', 'Marketing tools'],
    pricing: {
      monthly: 29.99,
      yearly: 299.99
    },
    eligibilityRequirements: {}
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'Full monetization suite',
    features: ['All premium features', 'Custom integrations', 'Dedicated support', 'Custom pricing'],
    pricing: {
      monthly: 99.99,
      yearly: 999.99
    },
    eligibilityRequirements: {}
  }
];

export const getProgramDefinition = async (id: string): Promise<ProgramDefinition | null> => {
  return mockProgramDefinitions.find(program => program.id === id) || null;
};

export const getAllProgramDefinitions = async (): Promise<ProgramDefinition[]> => {
  return mockProgramDefinitions;
};

export default {
  getProgramDefinition,
  getAllProgramDefinitions
};