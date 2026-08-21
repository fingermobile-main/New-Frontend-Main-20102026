const express = require('express');
const activity = require('../controllers/activityController.js');
const { authenticate } = require('../middleware/authenticate');
const { socialDb } = require("../db");
const router = express.Router();

router.get("/", authenticate, activity.getAll);
router.get("/own", authenticate, activity.getAll);
router.get("/member/:memberId", authenticate, activity.getById);
router.post("/", authenticate, activity.create);
router.get("/types/:activityType", activity.getById);
router.get("/content/:contentId", activity.getById);
router.get("/recent/:days?", authenticate, activity.getById);
router.get("/stats/:memberId", activity.getById);
router.delete("/:activityId", authenticate, activity.delete);

module.exports = router;