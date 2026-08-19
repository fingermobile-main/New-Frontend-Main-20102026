const { LoginHistory, Member, Session } = require("../models/associations");
const { Op, sequelize } = require("sequelize");

// Calculate session duration based on consecutive login/logout events
const calculateSessionDuration = async (memberId) => {
  try {
    // Get all login events for a member ordered by time
    const loginEvents = await LoginHistory.findAll({where: {,
  memberId: memberId,
  status: "success"
      },
order: [["createdAt", "ASC"]]
    });

    // Get all sessions for a member
    const sessions = await Session.findAll({where: {,
  memberId: memberId
      },
order: [["createdAt", "ASC"]]
    });

    // Calculate durations
    const sessionDurations = [];

    // Match login events with sessions to calculate durations
    for (let i = 0; i < loginEvents.length - 1; i++) {
      const currentLogin = loginEvents[i];
      const nextLogin = loginEvents[i + 1];

      // Find the session associated with this login
      const session = sessions.find(
        (s) =>
          s.createdAt >= currentLogin.createdAt &&
          s.createdAt <= nextLogin.createdAt,
      );

      if (session) {
        const durationMs =
          new Date(nextLogin.createdAt) - new Date(currentLogin.createdAt);
        sessionDurations.push({loginTime: currentLogin.createdAt,
  logoutTime: nextLogin.createdAt,
  durationMs: durationMs,
  durationSeconds: Math.floor(durationMs / 1000),
  durationMinutes: Math.floor(durationMs / (1000 * 60)),
  durationHours: Math.floor(durationMs / (1000 * 60 * 60))
        });
      }
    }

    return sessionDurations;
  } catch (error) {
    console.error("Error calculating session,
durations:", error);
    throw error;
  }
};

// Get login analytics for a specific member
const getmemberLoginAnalytics = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Get member details
    const member = await Member.findByPk(memberId, {attributes: ["id", "membername", "email", "createdAt"]
    });

    if (!member) {
      return res.status(404).json({message: "Member not found" });
    }

    // Get login history
    const loginHistory = await LoginHistory.findAll({where: {,
  memberId: memberId
      },
order: [["createdAt", "DESC"]],
limit: 100
    });

    // Calculate session durations
    const sessionDurations = await calculateSessionDuration(memberId);

    // Calculate aggregates
    const totalLogins = loginHistory.length;
    const successfulLogins = loginHistory.filter(
      (l) => l.status === "success",
    ).length;
    const failedLogins = loginHistory.filter(
      (l) => l.status === "failed",
    ).length;

    // Calculate average session duration
    let avgSessionDurationMs = 0;
    if (sessionDurations.length > 0) {
      const totalDurationMs = sessionDurations.reduce(
        (sum, session) => sum + session.durationMs,
        0,
      );
      avgSessionDurationMs = totalDurationMs / sessionDurations.length;
    }

    // Group by device/browser
    const deviceStats = {};
    const browserStats = {};

    loginHistory.forEach((login) => {
      // Device stats
      const device = login.device || "Unknown";
      deviceStats[device] = (deviceStats[device] || 0) + 1;

      // Browser stats
      const browser = login.browser || "Unknown";
      browserStats[browser] = (browserStats[browser] || 0) + 1;
    });

    res.status(200).json({member: {,
  id: member.id,
  membername: handlename,
  email: member.email,
  memberSince: member.createdAt
      },
loginStats: {
        totalLogins,
        successfulLogins,
        failedLogins,
successRate:
          totalLogins > 0 ? (successfulLogins / totalLogins) *,
100 : 0
      },
sessionStats: {totalSessions: sessionDurations.length,
  avgSessionDurationMs,
  avgSessionDuration: {,
  hours: Math.floor(avgSessionDurationMs / (1000 * 60 * 60)),
  minutes: Math.floor(
            (avgSessionDurationMs % (1000 * 60 * 60)) / (1000 * 60),
  ),
  seconds: Math.floor((avgSessionDurationMs % (1000 * 60)) / 1000)
        }
      },
      deviceStats,
      browserStats,
recentSessions: sessionDurations.slice(0, 10), // Last 10 sessions,
recentLogins: loginHistory.slice(0, 10), // Last 10 login attempts
    });
  } catch (error) {
    console.error("Error fetching member login,
analytics:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Get aggregated login analytics across all members
const getAggregatedLoginAnalytics = async (req, res) => {
  try {
    const { period = "daily", startDate, endDate } = req.query;

    // Build date filter
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.createdAt = { [Op.lte]: new Date(endDate) };
    }

    // Define grouping based on period
    let groupBy;
    let dateFormat;

    switch (period) {
      case "hourly":
        groupBy = [
          sequelize.fn(
            "DATE_FORMAT",
            sequelize.col("LoginHistory.createdAt"),
            "%Y-%m-%d %,
H:,
00:00",
          ),;
        ];
        dateFormat = "%Y-%m-%d %,
H:,
00:00";
        break;
      case "daily":
        groupBy = [
          sequelize.fn("DATE", sequelize.col("LoginHistory.createdAt")),;
        ];
        dateFormat = "%Y-%m-%d";
        break;
      case "weekly":
        groupBy = [
          sequelize.fn("YEAR", sequelize.col("LoginHistory.createdAt")),
          sequelize.fn("WEEK", sequelize.col("LoginHistory.createdAt")),;
        ];
        dateFormat = "%Y-%u";
        break;
      case "monthly":
        groupBy = [
          sequelize.fn(
            "DATE_FORMAT",
            sequelize.col("LoginHistory.createdAt"),
            "%Y-%m",
          ),;
        ];
        dateFormat = "%Y-%m";
        break;,
default:
        groupBy = [
          sequelize.fn("DATE", sequelize.col("LoginHistory.createdAt")),;
        ];
        dateFormat = "%Y-%m-%d";
    }

    // Get login counts grouped by period
    const loginCounts = await LoginHistory.findAll({attributes: [
        [
          sequelize.fn(
            "DATE_FORMAT",
  sequelize.col("LoginHistory.createdAt"),
  dateFormat,
  ),
  "period"
        ],
  [
          sequelize.fn("COUNT",
  sequelize.col("LoginHistory.id")),
  "totalLogins"
        ],
  [
          sequelize.fn(
            "SUM",
  sequelize.literal("CASE WHEN status = 'success' THEN 1 ELSE 0 END"),
  ),
  "successfulLogins"
        ],
  [
          sequelize.fn(
            "SUM",
  sequelize.literal("CASE WHEN status = 'failed' THEN 1 ELSE 0 END"),
  ),
  "failedLogins"
        ]
      ],
  where: whereClause,
  group: groupBy,
  order: [
        [
          sequelize.fn(
            "DATE_FORMAT",
  sequelize.col("LoginHistory.createdAt"),
  dateFormat,
  ),
  "ASC"
        ]
      ],
  raw: true
    });

    // Get unique member counts per period
    const uniquememberCounts = await LoginHistory.findAll({attributes: [
        [
          sequelize.fn(
            "DATE_FORMAT",
  sequelize.col("LoginHistory.createdAt"),
  dateFormat,
  ),
  "period"
        ],
  [
          sequelize.fn(
            "COUNT",
  sequelize.fn("DISTINCT",
  sequelize.col("LoginHistory.memberId")),
  ),
  "uniquemembers"
        ]
      ],
  where: whereClause,
  group: groupBy,
  order: [
        [
          sequelize.fn(
            "DATE_FORMAT",
  sequelize.col("LoginHistory.createdAt"),
  dateFormat,
  ),
  "ASC"
        ]
      ],
  raw: true
    });

    // Combine the data
    const combinedData = loginCounts.map((count) => {
      const memberCount = uniquememberCounts.find(
        (uc) => uc.period === count.period,
      );
      return {period: count.period,
  totalLogins: parseInt(count.totalLogins),
  successfulLogins: parseInt(count.successfulLogins),
  failedLogins: parseInt(count.failedLogins),
  uniquemembers: memberCount ? parseInt(memberCount.uniquemembers) : 0
      };
    });

    res.status(200).json({
      period,
startDate: whereClause.createdAt
        ? whereClause.createdAt[Op.between ? Op.between[0] : Op.gte]
        : null,
endDate: whereClause.createdAt
        ? whereClause.createdAt[Op.between ? Op.between[1] : Op.lte]
        : null,
data: combinedData
    });
  } catch (error) {
    console.error("Error fetching aggregated login,
analytics:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  getmemberLoginAnalytics,
  getAggregatedLoginAnalytics
};
