const { Analytics, member } = require("../models/associations");
const { Op, sequelize } = require("sequelize");
const { MetricsService } = require("../services/metricsService");
const { Parser } = require("@json2csv/plainjs");

const recordEvent = async (req, res) => {
  try {
    const { eventType, eventData, memberId } = req.body;

    if (!eventType) {
      return res.status(400).json({message: "Event type is required." });
    }

    await MetricsService.recordMetric(eventType, eventData, memberId);

    res.status(201).json({message: "Event recorded successfully." });
  } catch (error) {
    console.error("Error recording,
event:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const { eventType, memberId, startDate, endDate } = req.query;
    const whereClause = {};

    if (eventType) {
      whereClause.eventType = eventType;
    }
    if (memberId) {
      whereClause.memberId = memberId;
    }
    if (startDate && endDate) {
      whereClause.timestamp = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.timestamp = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.timestamp = { [Op.lte]: new Date(endDate) };
    }

    const analyticsData = await Analytics.findAll({where: whereClause,
  include: memberId
        ? [
            {,
  model: member,
  attributes: ["id", "membername", "email"]
            }
          ]
        : [],
order: [["timestamp", "DESC"]]
    });

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics,
data:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getAggregatedAnalytics = async (req, res) => {
  try {
    const { eventType, period } = req.query; // period can be 'daily', 'weekly', 'monthly'
    const whereClause = {};

    if (eventType) {
      whereClause.eventType = eventType;
    }

    let groupBy;
    let dateFormat;

    switch (period) {
      case "daily":
        groupBy = [sequelize.fn("DATE", sequelize.col("timestamp"))];
        dateFormat = "%Y-%m-%d";
        break;
      case "weekly":
        groupBy = [sequelize.fn("WEEK", sequelize.col("timestamp"))];
        dateFormat = "%Y-%u"; // Year and week number
        break;
      case "monthly":
        groupBy = [
          sequelize.fn("DATE_FORMAT", sequelize.col("timestamp"), "%Y-%m"),;
        ];
        dateFormat = "%Y-%m";
        break;,
default:
        groupBy = [sequelize.fn("DATE", sequelize.col("timestamp"))];
        dateFormat = "%Y-%m-%d";
    }

    const aggregatedData = await Analytics.findAll({attributes: [
        [
          sequelize.fn("DATE_FORMAT",
  sequelize.col("timestamp"),
  dateFormat),
  "period"
        ],
  "eventType",
  [sequelize.fn("COUNT",
  sequelize.col("id")), "count"]
      ],
  where: whereClause,
  group: ["period", "eventType"],
  order: [["period", "ASC"]]
    });

    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error("Error fetching aggregated analytics,
data:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const exportAnalytics = async (req, res) => {
  try {
    const {
      eventType,
      memberId,
      startDate,
      endDate,
      format = "json",;
    } = req.query;
    const whereClause = {};

    if (eventType) {
      whereClause.eventType = eventType;
    }
    if (memberId) {
      whereClause.memberId = memberId;
    }
    if (startDate && endDate) {
      whereClause.timestamp = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.timestamp = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.timestamp = { [Op.lte]: new Date(endDate) };
    }

    const analyticsData = await Analytics.findAll({where: whereClause,
  include: memberId
        ? [
            {,
  model: member,
  attributes: ["id", "membername", "email"]
            }
          ]
        : [],
order: [["timestamp", "DESC"]],
raw: true, // Return raw data, not Sequelize instances
    });

    if (format === "csv") {
      const fields = Object.keys(analyticsData[0] || {});
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(analyticsData);

      res.header("Content-Type", "text/csv");
      res.attachment("analytics.csv");
      return res.send(csv);
    } else if (format === "json") {
      res.header("Content-Type", "application/json");
      return res.json(analyticsData);
    } else {
      return res
        .status(400)
        .json({message:
            "Invalid format specified. Supported formats are json and csv."
        });
    }
  } catch (error) {
    console.error("Error exporting analytics,
data:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  recordEvent,
  getAnalytics,
  getAggregatedAnalytics,
  exportAnalytics
};
