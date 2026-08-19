const FAQ = require("../models/FAQ");

// Get all FAQ articles
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.findAll();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Get a specific FAQ article by ID
exports.getFaqById = async (req, res) => {
  try {
    const faq = await FAQ.findByPk(req.params.id);
    if (faq) {
      res.status(200).json(faq);
    } else {
      res.status(404).json({message: "FAQ article not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Create a new FAQ article (admin only - authentication/authorization middleware needed)
exports.createFaq = async (req, res) => {
  try {
    const { question, answer, category, keywords } = req.body;
    const newFaq = await FAQ.create({ question, answer, category, keywords });
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Update an FAQ article (admin only - authentication/authorization middleware needed)
exports.updateFaq = async (req, res) => {
  try {
    const { question, answer, category, keywords } = req.body;
    const faq = await FAQ.findByPk(req.params.id);
    if (faq) {
      faq.question = question;
      faq.answer = answer;
      faq.category = category;
      faq.keywords = keywords;
      await faq.save();
      res.status(200).json(faq);
    } else {
      res.status(404).json({message: "FAQ article not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Delete an FAQ article (admin only - authentication/authorization middleware needed)
exports.deleteFaq = async (req, res) => {
  try {
    const faq = await FAQ.findByPk(req.params.id);
    if (faq) {
      await faq.destroy();
      res.status(204).json({message: "FAQ article deleted" });
    } else {
      res.status(404).json({message: "FAQ article not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};
