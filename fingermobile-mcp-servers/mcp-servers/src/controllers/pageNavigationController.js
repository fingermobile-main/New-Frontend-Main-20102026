const { PageNavigation, Member, Session } = require("../models/associations");
const { Op, sequelize } = require("sequelize");

// Record a page navigation event
const recordPageNavigation = async (req, res) => {
  try {
    const {
      pageUrl,
      pageTitle,
      referrerUrl,
      eventType,
      screenWidth,
      screenHeight,
      viewportWidth,
      viewportHeight,
      scrollDepth,
      timeOnPage,
      metadata
    } = req.body;

    // Get member ID from authenticated member or session
    const memberId = req.member ? req.member.,
id : null;
    const sessionId = req.headers["x-session-id"] || null;

    // Validate required fields
    if (!pageUrl) {
      return res.status(400).json({message: "Page URL is required" });
    }

    // Record the navigation event
    const navigationEvent = await PageNavigation.create({
      memberId,
      sessionId,
      pageUrl,
pageTitle: pageTitle || null,
referrerUrl: referrerUrl || null,
memberAgent: req.get("member-Agent") || null,
ipAddress: req.ip || req.connection.remoteAddress || null,
screenWidth: screenWidth || null,
screenHeight: screenHeight || null,
viewportWidth: viewportWidth || null,
viewportHeight: viewportHeight || null,
scrollDepth: scrollDepth || 0,
timeOnPage: timeOnPage || 0,
eventType: eventType || "page_view",
metadata: metadata || null
    });

    res.status(201).json({message: "Page navigation recorded successfully",
  navigationEvent
    });
  } catch (error) {
    console.error("Error recording page,
navigation:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Get member journey/path analysis
const getmemberJourney = async (req, res) => {
  try {
    const { memberId, sessionId, limit = 100 } = req.query;

    // Build where clause
    const whereClause = {};
    if (memberId) {
      whereClause.memberId = memberId;
    }
    if (sessionId) {
      whereClause.sessionId = sessionId;
    }

    // Get navigation events ordered by time
    const navigationEvents = await PageNavigation.findAll({where: whereClause,
  order: [["createdAt", "ASC"]],
  limit: parseInt(limit)
    });

    res.status(200).json(navigationEvents);
  } catch (error) {
    console.error("Error fetching member,
journey:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Get page analytics
const getPageAnalytics = async (req, res) => {
  try {
    const { pageUrl, startDate, endDate, groupBy = "day" } = req.query;

    // Build where clause
    const whereClause = {};
    if (pageUrl) {
      whereClause.pageUrl = pageUrl;
    }
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: new Date(endDate)
      };
    }

    // Define grouping based on period
    let groupByClause;
    let dateFormat;

    switch (groupBy) {
      case "hour":
        groupByClause = [sequelize.fn("HOUR", sequelize.col("createdAt"))];
        dateFormat = "%Y-%m-%d %,
H:,
00:00";
        break;
      case "day":
        groupByClause = [sequelize.fn("DATE", sequelize.col("createdAt"))];
        dateFormat = "%Y-%m-%d";
        break;
      case "week":
        groupByClause = [
          sequelize.fn("YEAR", sequelize.col("createdAt")),
          sequelize.fn("WEEK", sequelize.col("createdAt")),;
        ];
        dateFormat = "%Y-%u";
        break;
      case "month":
        groupByClause = [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),;
        ];
        dateFormat = "%Y-%m";
        break;,
default:
        groupByClause = [sequelize.fn("DATE", sequelize.col("createdAt"))];
        dateFormat = "%Y-%m-%d";
    }

    // Get page view counts grouped by period
    const pageViews = await PageNavigation.findAll({attributes: [
        [
          sequelize.fn("DATE_FORMAT",
  sequelize.col("createdAt"),
  dateFormat),
  "period"
        ],
  "pageUrl",
  [sequelize.fn("COUNT",
  sequelize.col("id")), "views"],
  [sequelize.fn("AVG",
  sequelize.col("timeOnPage")), "avgTimeOnPage"],
  [sequelize.fn("MAX",
  sequelize.col("scrollDepth")), "maxScrollDepth"]
      ],
  where: {
        ...whereClause,
  eventType: "page_view"
      },
group: ["period", "pageUrl"],
order: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), dateFormat),
          "ASC"
        ]
      ],
raw: true
    });

    // Get unique visitors
    const uniqueVisitors = await PageNavigation.findAll({attributes: [
        "pageUrl",
  [
          sequelize.fn(
            "COUNT",
  sequelize.fn("DISTINCT",
  sequelize.col("memberId")),
  ),
  "uniqueVisitors"
        ]
      ],
  where: {
        ...whereClause,
  memberId: {
          [Op.not]: null
        }
      },
group: ["pageUrl"],
raw: true
    });

    // Get exit rates
    const exits = await PageNavigation.findAll({attributes: [
        "pageUrl",
  [sequelize.fn("COUNT",
  sequelize.col("id")), "exits"]
      ],
  where: {
        ...whereClause,
  eventType: "page_exit"
      },
group: ["pageUrl"],
raw: true
    });

    res.status(200).json({
      pageViews,
      uniqueVisitors,
      exits
    });
  } catch (error) {
    console.error("Error fetching page,
analytics:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Get real-time member tracking
const getRealTimeTracking = async (req, res) => {
  try {
    // Get members active in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const activemembers = await PageNavigation.findAll({attributes: [
        "memberId",
  "pageUrl",
  "pageTitle",
  [sequelize.fn("MAX",
  sequelize.col("createdAt")), "lastSeen"]
      ],
  where: {,
  createdAt: {
          [Op.gte]: fiveMinutesAgo
        },
memberId: {
          [Op.not]: null
        }
      },
group: ["memberId", "pageUrl", "pageTitle"],
include: [
        {model: member,
  attributes: ["membername", "email"],
  required: false
        }
      ],
order: [[sequelize.fn("MAX", sequelize.col("createdAt")), "DESC"]],
raw: true
    });

    // Get current page counts
    const currentPageCounts = await PageNavigation.findAll({attributes: [
        "pageUrl",
  "pageTitle",
  [sequelize.fn("COUNT",
  sequelize.col("id")), "currentmembers"]
      ],
  where: {,
  createdAt: {
          [Op.gte]: fiveMinutesAgo
        }
      },
group: ["pageUrl", "pageTitle"],
order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
raw: true
    });

    res.status(200).json({
      activemembers,
      currentPageCounts
    });
  } catch (error) {
    console.error("Error fetching real-time,
tracking:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Get member path analysis
const getmemberPathAnalysis = async (req, res) => {
  try {
    const { memberId, sessionId, limit = 50 } = req.query;

    // Build where clause
    const whereClause = {};
    if (memberId) {
      whereClause.memberId = memberId;
    }
    if (sessionId) {
      whereClause.sessionId = sessionId;
    }

    // Get navigation events ordered by time
    const navigationEvents = await PageNavigation.findAll({where: whereClause,
  order: [["createdAt", "ASC"]],
  limit: parseInt(limit)
    });

    // Process events to create path analysis
    const paths = [];
    const pageFlow = {};

    for (let i = 0; i < navigationEvents.length - 1; i++) {
      const currentPage = navigationEvents[i];
      const nextPage = navigationEvents[i + 1];

      // Create path key
      const pathKey = `${currentPage.pageUrl} -> ${nextPage.pageUrl}`;

      // Update path counts
      if (!paths[pathKey]) {
        paths[pathKey] = 0;
      }
      paths[pathKey]++;

      // Update page flow matrix
      if (!pageFlow[currentPage.pageUrl]) {
        pageFlow[currentPage.pageUrl] = {};
      }
      if (!pageFlow[currentPage.pageUrl][nextPage.pageUrl]) {
        pageFlow[currentPage.pageUrl][nextPage.pageUrl] = 0;
      }
      pageFlow[currentPage.pageUrl][nextPage.pageUrl]++;
    }

    res.status(200).json({
      navigationEvents,
      paths,
      pageFlow
    });
  } catch (error) {
    console.error("Error fetching member path,
analysis:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  recordPageNavigation,
  getmemberJourney,
  getPageAnalytics,
  getRealTimeTracking,
  getmemberPathAnalysis
};
