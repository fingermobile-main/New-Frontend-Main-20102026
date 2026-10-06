// Utility functions for displaying match scores and compatibility indicators in the Lush Pressies app

export interface MatchScoreDetails {
  overall: number; // 0-100
  categories: {
    interests: number; // 0-100
    values: number; // 0-100
    lifestyle: number; // 0-100
    personality: number; // 0-100
    location: number; // 0-100
  };
  description: string;
}

/**
 * Gets a descriptive label for a match score
 */
export const getMatchScoreLabel = (score: number): string => {
  if (score >= 90) return 'Exceptional Match';
  if (score >= 80) return 'Excellent Match';
  if (score >= 70) return 'Great Match';
  if (score >= 60) return 'Good Match';
  if (score >= 50) return 'Moderate Match';
  if (score >= 40) return 'Possible Match';
  if (score >= 30) return 'Low Compatibility';
  if (score >= 20) return 'Minimal Compatibility';
  return 'Not Compatible';
};

/**
 * Gets a color based on match score
 */
export const getMatchScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-blue-600 bg-blue-100';
  if (score >= 40) return 'text-yellow-600 bg-yellow-100';
  if (score >= 20) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

/**
 * Gets an emoji representation of match score
 */
export const getMatchScoreEmoji = (score: number): string => {
  if (score >= 90) return '💘';
  if (score >= 80) return '💖';
  if (score >= 70) return '💗';
  if (score >= 60) return '💓';
  if (score >= 50) return '💞';
  if (score >= 40) return '💕';
  if (score >= 30) return '💔';
  if (score >= 20) return '💛';
  return '🤍';
};

/**
 * Formats match score as percentage
 */
export const formatMatchScore = (score: number): string => {
  return `${Math.round(score)}% match`;
};

/**
 * Generates detailed match score information
 */
export const generateMatchScoreDetails = (overallScore: number): MatchScoreDetails => {
  // Generate somewhat realistic category scores based on overall score
  const baseScore = overallScore * 0.8; // Categories contribute to 80% of overall score

  return {
    overall: overallScore,
    categories: {
      interests: Math.min(100, Math.max(0, baseScore + (Math.random() * 20 - 10))),
      values: Math.min(100, Math.max(0, baseScore + (Math.random() * 20 - 10))),
      lifestyle: Math.min(100, Math.max(0, baseScore + (Math.random() * 20 - 10))),
      personality: Math.min(100, Math.max(0, baseScore + (Math.random() * 20 - 10))),
      location: Math.min(100, Math.max(0, overallScore > 70 ? 90 : overallScore * 0.5))
    },
    description: getMatchScoreDescription(overallScore)
  };
};

/**
 * Gets a description for a match score
 */
export const getMatchScoreDescription = (score: number): string => {
  if (score >= 90) return 'You two are incredibly compatible! Your personalities, interests, and values align perfectly.';
  if (score >= 80) return 'An excellent match with strong alignment in most areas. Great potential for a meaningful connection.';
  if (score >= 70) return 'A great match with many shared interests and compatible values. Worth exploring further.';
  if (score >= 60) return 'A good match with several common interests and compatible perspectives on life.';
  if (score >= 50) return 'A moderate match with some shared interests and compatible traits worth exploring.';
  if (score >= 40) return 'A possible match with a few common interests, though significant differences exist.';
  if (score >= 30) return 'Low compatibility with minimal shared interests or aligned values.';
  if (score >= 20) return 'Minimal compatibility with very few overlapping interests or values.';
  return 'Little to no compatibility based on your profiles and preferences.';
};

/**
 * Gets match score category labels
 */
export const getCategoryLabel = (category: keyof MatchScoreDetails['categories']): string => {
  switch (category) {
  case 'interests': return 'Interests';
  case 'values': return 'Values';
  case 'lifestyle': return 'Lifestyle';
  case 'personality': return 'Personality';
  case 'location': return 'Location';
  default: return category;
  }
};

/**
 * Gets an icon for a match category
 */
export const getCategoryIcon = (category: keyof MatchScoreDetails['categories']): string => {
  switch (category) {
  case 'interests': return '🎭';
  case 'values': return '💎';
  case 'lifestyle': return '🏠';
  case 'personality': return '🧠';
  case 'location': return '📍';
  default: return '📊';
  }
};

/**
 * Calculates a weighted match score based on user preferences
 */
export const calculateWeightedMatchScore = (
  userPreferences: { [key: string]: number },
  targetProfile: { [key: string]: any }
): number => {
  // This would typically involve more complex algorithms
  // For now, returning a random score based on input similarity
  let totalScore = 0;
  let weightSum = 0;

  for (const [pref, weight] of Object.entries(userPreferences)) {
    if (targetProfile[pref]) {
      // Simplified scoring - in reality this would be more complex
      const prefScore = Math.random() * 100; // Placeholder for actual calculation
      totalScore += prefScore * weight;
      weightSum += weight;
    }
  }

  return weightSum > 0 ? totalScore / weightSum : 50; // Default to 50 if no matches
};

/**
 * Creates a visual representation of match score with bars
 */
export const createMatchScoreBars = (score: number, segments: number = 10): string[] => {
  const filledSegments = Math.floor((score / 100) * segments);
  const bars: string[] = [];

  for (let i = 0; i < segments; i++) {
    bars.push(i < filledSegments ? '█' : '░');
  }

  return bars;
};

/**
 * Gets match score insights for conversation starters
 */
export const getMatchInsights = (details: MatchScoreDetails): string[] => {
  const insights: string[] = [];

  if (details.categories.interests > 80) {
    insights.push('You both share many similar interests!');
  }

  if (details.categories.values > 80) {
    insights.push('You have aligned values and life goals.');
  }

  if (details.categories.personality > 80) {
    insights.push('Your personalities complement each other well.');
  }

  if (details.categories.lifestyle > 80) {
    insights.push('You have compatible lifestyles and habits.');
  }

  if (details.categories.location < 50) {
    insights.push('You\'re from different areas, which could lead to interesting perspectives.');
  }

  return insights;
};

/**
 * Determines if a match score is high enough for special features
 */
export const isHighMatchScore = (score: number, threshold: number = 70): boolean => {
  return score >= threshold;
};

/**
 * Gets a conversation starter based on match score
 */
export const getConversationStarter = (score: number): string => {
  if (score >= 80) {
    return 'Wow, we seem really compatible! What interests of ours do you think align the most?';
  } else if (score >= 60) {
    return 'We have some things in common! What caught your attention about my profile?';
  } else if (score >= 40) {
    return 'We\'re different in some ways, which could be interesting! What are you looking for in a connection?';
  }
  return 'Hi! We might be different, but that could lead to learning something new about each other!';
};

// Export default object with all utilities
export default {
  getMatchScoreLabel,
  getMatchScoreColor,
  getMatchScoreEmoji,
  formatMatchScore,
  generateMatchScoreDetails,
  getMatchScoreDescription,
  getCategoryLabel,
  getCategoryIcon,
  calculateWeightedMatchScore,
  createMatchScoreBars,
  getMatchInsights,
  isHighMatchScore,
  getConversationStarter
};
