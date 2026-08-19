const PrivacyPolicy = require("../models/PrivacyPolicy");

// Get the current privacy policy
exports.getPrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findOne({order: [["createdAt", "DESC"]]
    });
    if (policy) {
      res.status(200).json(policy);
    } else {
      res.status(404).json({message: "Privacy policy not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Create or update the privacy policy (admin only - authentication/authorization middleware needed)
exports.createOrUpdatePrivacyPolicy = async (req, res) => {
  try {
    const { title, content, effectiveDate } = req.body;
    // For simplicity, we'll always create a new version. A more robust solution might update the latest.
    const newPolicy = await PrivacyPolicy.create({
      title,
      content,
      effectiveDate
    });
    res.status(201).json(newPolicy);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};
