import { ProgramDefinition } from '../shared/types';

export const getProgramDefinitions = async (): Promise<ProgramDefinition[]> => {
  // In a real implementation, this would fetch actual program definitions
  // For now, returning mock data
  return [
    {
      key: 'basic',
      name: 'Basic Creator Program',
      title: 'Basic Creator',
      summary: 'Start earning with basic features',
      description: 'Start earning with basic features',
      requirements: ['100+ followers', 'Original content', 'Community guidelines compliance']
    },
    {
      key: 'premium',
      name: 'Premium Creator Program',
      title: 'Premium Creator',
      summary: 'Access premium tools and higher revenue shares',
      description: 'Access premium tools and higher revenue shares',
      requirements: ['1000+ followers', '30+ days account age', '4%+ engagement rate']
    },
    {
      key: 'enterprise',
      name: 'Enterprise Creator Program',
      title: 'Enterprise Creator',
      summary: 'Our highest tier with maximum revenue potential',
      description: 'Our highest tier with maximum revenue potential',
      requirements: ['10000+ followers', '60+ days account age', '5%+ engagement rate', 'Original content score 80+']
    }
  ];
};

export default {
  getProgramDefinitions
};