const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const AIGenerationService = require("../services/aiGenerationService");

// Apply admin authentication to all AI generation routes
router.use(requireAdmin);

// Generate text content
router.post("/text", requireAdmin, async (req, res) => {
  try {
    const { prompt, options } = req.body;

    if (!prompt) {
      return res.status(400).json({success: false,
  message: "Prompt is required"
      });
    }

    const result = await AIGenerationService.generateText(prompt, options);

    res.status(200).json({success: true,
  message: "Text generated successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error generating, text:", error);
    res.status(500).json({success: false,
  message: "Failed to generate text",
  error: error.message
    });
  }
});

// Generate image
router.post("/image", requireAdmin, async (req, res) => {
  try {
    const { prompt, options } = req.body;

    if (!prompt) {
      return res.status(400).json({success: false,
  message: "Prompt is required"
      });
    }

    const result = await AIGenerationService.generateImage(prompt, options);

    res.status(200).json({success: true,
  message: "Image generated successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error generating, image:", error);
    res.status(500).json({success: false,
  message: "Failed to generate image",
  error: error.message
    });
  }
});

// Get generation history
router.get("/history", requireAdmin, async (req, res) => {
  try {
    const result = await AIGenerationService.getGenerationHistory();

    res.status(200).json({success: true,
  message: "Generation history retrieved successfully",
  data: result.data
    });
  } catch (error) {
    logger.error("Error getting generation, history:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve generation history",
  error: error.message
    });
  }
});

// Get code suggestions
router.post("/code-suggestions", requireAdmin, async (req, res) => {
  try {
    const { code, context } = req.body;

    if (!code) {
      return res.status(400).json({success: false,
  message: "Code is required"
      });
    }

    const result = await AIGenerationService.getCodeSuggestions(code, context);

    res.status(200).json({success: true,
  message: "Code suggestions retrieved successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error getting code, suggestions:", error);
    res.status(500).json({success: false,
  message: "Failed to get code suggestions",
  error: error.message
    });
  }
});

// Generate sitemap
router.post("/sitemap", requireAdmin, async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({success: false,
  message: "Project ID is required"
      });
    }

    const result = await AIGenerationService.generateSitemap(projectId);

    res.status(200).json({success: true,
  message: "Sitemap generated successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error generating, sitemap:", error);
    res.status(500).json({success: false,
  message: "Failed to generate sitemap",
  error: error.message
    });
  }
});

module.exports = router;
