const express = require('express');
const ugc_media_routes = require('../controllers/ugc_media_routesController.js');
const { authenticate } = require('../middleware/authenticate');
const ugcMediaService = require('../services/ugc_media_service');
const router = express.Router();

router.post("/upload", authenticate, ugc_media_routes.create);
router.post("/process/:mediaId", authenticate, ugc_media_routes.create);
router.get("/:mediaId/metadata", authenticate, ugc_media_routes.getById);
router.delete("/:mediaId", authenticate, ugc_media_routes.delete);

module.exports = router;