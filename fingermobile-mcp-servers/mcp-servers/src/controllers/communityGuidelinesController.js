const CommunityGuideline = require("../models/CommunityGuideline");

// Get all community guidelines
exports.getAllGuidelines = async (req, res) => {
  try {
    const guidelines = await CommunityGuideline.findAll();
    res.status(200).json(guidelines);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Get a specific guideline by ID
exports.getGuidelineById = async (req, res) => {
  try {
    const guideline = await CommunityGuideline.findByPk(req.params.id);
    if (guideline) {
      res.status(200).json(guideline);
    } else {
      res.status(404).json({message: "Community guideline not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Create a new guideline (admin only - authentication/authorization middleware needed)
exports.createGuideline = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newGuideline = await CommunityGuideline.create({
      title,
      content,
      category
    });
    res.status(201).json(newGuideline);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Update a guideline (admin only - authentication/authorization middleware needed)
exports.updateGuideline = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const guideline = await CommunityGuideline.findByPk(req.params.id);
    if (guideline) {
      guideline.title = title;
      guideline.content = content;
      guideline.category = category;
      await guideline.save();
      res.status(200).json(guideline);
    } else {
      res.status(404).json({message: "Community guideline not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Delete a guideline (admin only - authentication/authorization middleware needed)
exports.deleteGuideline = async (req, res) => {
  try {
    const guideline = await CommunityGuideline.findByPk(req.params.id);
    if (guideline) {
      await guideline.destroy();
      res.status(204).json({message: "Community guideline deleted" });
    } else {
      res.status(404).json({message: "Community guideline not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};
