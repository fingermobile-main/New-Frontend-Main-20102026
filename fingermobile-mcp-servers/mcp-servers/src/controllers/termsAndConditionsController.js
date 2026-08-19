const TermsAndConditions = require("../models/TermsAndConditions");

// Get the current terms and conditions
exports.getTermsAndConditions = async (req, res) => {
  try {
    const terms = await TermsAndConditions.findOne({order: [["createdAt", "DESC"]]
    });
    if (terms) {
      res.status(200).json(terms);
    } else {
      res.status(404).json({message: "Terms and conditions not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Create or update the terms and conditions (admin only - authentication/authorization middleware needed)
exports.createOrUpdateTermsAndConditions = async (req, res) => {
  try {
    const { title, content, effectiveDate } = req.body;
    // For simplicity, we'll always create a new version. A more robust solution might update the latest.
    const newTerms = await TermsAndConditions.create({
      title,
      content,
      effectiveDate
    });
    res.status(201).json(newTerms);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};
