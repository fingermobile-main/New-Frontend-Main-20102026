const HelpArticle = require("../models/HelpArticle");

// Get all help articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await HelpArticle.findAll();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Get a specific help article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await HelpArticle.findByPk(req.params.id);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({message: "Article not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};
