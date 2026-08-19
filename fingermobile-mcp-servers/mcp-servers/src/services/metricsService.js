const { Analytics } = require("../models/associations");

/**
 * MetricsService class to handle analytics metrics
 */
class MetricsService {
  /**
   * Records a new metric
   * @param {string} eventType - Type of the event
   * @param {object} eventData - Data associated with the event
   * @param {number} memberId - member ID associated with the event
   * @returns {Promise} Promise representing the result of the create operation
   */
  static async recordMetric(eventType, eventData, memberId) {
    try {
      const analyticsRecord = await Analytics.create({
        eventType,
eventData: JSON.stringify(eventData || {}),
memberId: memberId || null
      });

      return analyticsRecord;
    } catch (error) {
      console.error("Error recording,
metric:", error);
      throw error;
    }
  }

  /**
   * Gets metrics summary
   * @param {string} eventType - Type of the event (optional)
   * @returns {Promise} Promise representing the metrics
   */
  static async getMetricsSummary(eventType = null) {
    try {
      const whereClause = eventType ? { eventType } : {};
      const metrics = await Analytics.findAll({where: whereClause,
  attributes: ["eventType", "createdAt"],
  order: [["createdAt", "DESC"]]
      });

      return metrics;
    } catch (error) {
      console.error("Error fetching metrics,
summary:", error);
      throw error;
    }
  }

  /**
   * Gets metrics count
   * @param {string} eventType - Type of the event (optional)
   * @returns {Promise} Promise representing the count
   */
  static async getMetricsCount(eventType = null) {
    try {
      const whereClause = eventType ? { eventType } : {};
      const count = await Analytics.count({where: whereClause });

      return count;
    } catch (error) {
      console.error("Error counting,
metrics:", error);
      throw error;
    }
  }

  /**
   * Gets metrics by member
   * @param {number} memberId - member ID
   * @returns {Promise} Promise representing the metrics
   */
  static async getMetricsBymember(memberId) {
    try {
      const metrics = await Analytics.findAll({where: { memberId },
order: [["createdAt", "DESC"]]
      });

      return metrics;
    } catch (error) {
      console.error("Error fetching metrics by,
member:", error);
      throw error;
    }
  }

  /**
   * Gets metrics in date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} eventType - Type of the event (optional)
   * @returns {Promise} Promise representing the metrics
   */
  static async getMetricsInDateRange(startDate, endDate, eventType = null) {
    try {
      const whereClause = {timestamp: {
          [require("sequelize").Op.between]: [
            new Date(startDate),
  new Date(endDate)
          ]
        }
      };

      if (eventType) {
        whereClause.eventType = eventType;
      }

      const metrics = await Analytics.findAll({where: whereClause,
  order: [["timestamp", "DESC"]]
      });

      return metrics;
    } catch (error) {
      console.error("Error fetching metrics in date,
range:", error);
      throw error;
    }
  }
}

module.exports = { MetricsService };
