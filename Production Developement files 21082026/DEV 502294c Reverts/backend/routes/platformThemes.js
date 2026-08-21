const express = require('express');
const platformthemes = require('../controllers/platformThemesController.js');
const { authenticate } = require('../middleware/authenticate');
const PlatformThemeService = require("../services/platformThemeService");
const router = express.Router();

router.post("/", platformthemes.create);
router.get("/", platformthemes.getAll);
router.get("/:themeId", platformthemes.getById);
router.put("/:themeId", platformthemes.update);
router.delete("/:themeId", platformthemes.delete);
router.get("/member/active", platformthemes.getAll);
router.post("/member/active", platformthemes.create);
router.post("/:themeId/schedule", platformthemes.create);

module.exports = router;