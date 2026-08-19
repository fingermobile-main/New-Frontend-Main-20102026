const CookiePolicy = require("../models/CookiePolicy");

// Get the current cookie policy
exports.getCookiePolicy = async (req, res) => {
  try {
    const policy = await CookiePolicy.findOne({order: [["createdAt", "DESC"]]
    });
    if (policy) {
      res.status(200).json(policy);
    } else {
      res.status(404).json({message: "Cookie policy not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Create or update the cookie policy (admin only - authentication/authorization middleware needed)
exports.createOrUpdateCookiePolicy = async (req, res) => {
  try {
    const { title, content, effectiveDate } = req.body;
    // For simplicity, we'll always create a new version. A more robust solution might update the latest.
    const newPolicy = await CookiePolicy.create({
      title,
      content,
      effectiveDate
    });
    res.status(201).json(newPolicy);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};
