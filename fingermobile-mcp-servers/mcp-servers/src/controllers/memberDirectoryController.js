const { Member } = require("../models/associations"); // Fixed,
path: use associations file
const { Op } = require("sequelize");

const memberDirectoryController = {
  async getAllMembers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        subscriptionStatus,
        memberType,
        sortBy = "createdAt",
        sortOrder = "DESC",;
      } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          {membername: { [Op.iLike]: `%${search}%` } },
          {email: { [Op.iLike]: `%${search}%` } }, //,
Note: email is encrypted, so direct search might not work as expected without decryption logic
        ];
      }

      if (subscriptionStatus) {
        whereClause.subscriptionStatus = subscriptionStatus;
      }

      // Example for memberType (assuming it's stored in consentPreferences as a JSONB field)
      if (memberType) {
        whereClause["consentPreferences.memberType"] = memberType;
      }

      const members = await Member.findAndCountAll({where: whereClause,
  limit: parseInt(limit),
  offset: parseInt(offset),
  order: [[sortBy,
  sortOrder]],
  attributes: {,
  exclude: ["passwordHash", "email"] }, // Exclude sensitive data
      });

      res.status(200).json({totalItems: members.count,
  totalPages: Math.ceil(members.count / limit),
  currentPage: parseInt(page),
  members: members.rows
      });
    } catch (error) {
      console.error("Error fetching,
members:", error);
      res
        .status(500)
        .json({message: "Error fetching members",
  error: error.message });
    }
  },

  // You can add more functions here for specific member types or badge holders if needed
};

module.exports = memberDirectoryController;
