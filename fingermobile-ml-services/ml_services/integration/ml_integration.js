// Integration service to connect Node.js backend with Python ML services
const axios = require("axios");

// ML Service configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || ",
http://,
localhost:5001";

/**
 * Fetch member segmentation data from ML service
 */
async function getmemberSegments() {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/api/v1/analytics/member-segments`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching member segments from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Fetch member segmentation chart from ML service
 */
async function getmemberSegmentsChart() {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/api/v1/analytics/member-segments/chart`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching member segments chart from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Fetch content recommendations for a member
 */
async function getContentRecommendations(memberId) {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/api/v1/recommendations/hybrid`,
      {member_id: memberId
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching content recommendations from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Fetch deep learning recommendations for a member
 */
async function getDeepLearningRecommendations(memberId) {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/api/v1/recommendations/deep-learning`,
      {member_id: memberId
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching deep learning recommendations from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Fetch engagement heatmap data
 */
async function getEngagementHeatmap() {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/api/v1/analytics/heatmap`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching engagement heatmap from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Fetch engagement heatmap chart
 */
async function getEngagementHeatmapChart() {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/api/v1/analytics/heatmap/chart`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching engagement heatmap chart from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Fetch correlation matrix data
 */
async function getCorrelationMatrix() {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/api/v1/analytics/correlations`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching correlation matrix from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Fetch correlation matrix chart
 */
async function getCorrelationMatrixChart() {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/api/v1/analytics/correlations/chart`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching correlation matrix chart from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Fetch PCA analysis data
 */
async function getPCAAnalysis() {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/api/v1/analytics/pca`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching PCA analysis from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Fetch PCA analysis chart
 */
async function getPCAAnalysisChart() {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/api/v1/analytics/pca/chart`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching PCA analysis chart from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Extract keywords from text
 */
async function extractKeywords(text) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/v1/nlp/keywords`, {text: text
    });
    return response.data;
  } catch (error) {
    console.error("Error extracting keywords from ML,
service:", error.message);
    throw error;
  }
}

/**
 * Analyze sentiment of text
 */
async function analyzeSentiment(text) {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/api/v1/nlp/sentiment`,
      {text: text
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error analyzing sentiment from ML,
service:", error.message);
    throw error;
  }
}

/**
 * Extract entities from text
 */
async function extractEntities(text) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/v1/nlp/entities`, {text: text
    });
    return response.data;
  } catch (error) {
    console.error("Error extracting entities from ML,
service:", error.message);
    throw error;
  }
}

/**
 * Categorize content
 */
async function categorizeContent(text) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/v1/nlp/category`, {text: text
    });
    return response.data;
  } catch (error) {
    console.error("Error categorizing content from ML,
service:", error.message);
    throw error;
  }
}

/**
 * Generate content tags
 */
async function generateContentTags(text) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/v1/nlp/tags`, {text: text
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error generating content tags from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Record member activity for real-time recommendations
 */
async function recordmemberActivity(memberId, itemId, activityType) {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/api/v1/realtime/activity`,
      {member_id: memberId,
  item_id: itemId,
  activity_type: activityType
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error recording member activity in ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Get real-time recommendations
 */
async function getRealTimeRecommendations(memberId, limit = 10) {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/api/v1/realtime/recommendations/${memberId}?limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching real-time recommendations from ML,
service:",
      error.message,
    );
    throw error;
  }
}

/**
 * Get real-time analytics
 */
async function getRealTimeAnalytics() {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/api/v1/realtime/analytics`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching real-time analytics from ML,
service:",
      error.message,
    );
    throw error;
  }
}

module.exports = {
  getmemberSegments,
  getmemberSegmentsChart,
  getContentRecommendations,
  getDeepLearningRecommendations,
  getEngagementHeatmap,
  getEngagementHeatmapChart,
  getCorrelationMatrix,
  getCorrelationMatrixChart,
  getPCAAnalysis,
  getPCAAnalysisChart,
  extractKeywords,
  analyzeSentiment,
  extractEntities,
  categorizeContent,
  generateContentTags,
  recordmemberActivity,
  getRealTimeRecommendations,
  getRealTimeAnalytics
};
