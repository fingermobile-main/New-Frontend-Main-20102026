const express = require('express');
const camus = require('../controllers/camusController.js');
const { authenticate } = require('../middleware/authenticate');
const { contentDb } = require("../db");
const router = express.Router();

router.get("/courses", camus.getAll);
router.get("/courses/:courseId", camus.getById);
router.post("/courses", authenticate, camus.create);
router.put("/courses/:courseId", camus.update);
router.delete("/courses/:courseId", authenticate, camus.delete);
router.get("/courses/:courseId/modules", camus.getById);
router.post("/courses/:courseId/modules", authenticate, camus.create);
router.get("/modules/:moduleId/lessons", camus.getById);
router.post("/modules/:moduleId/lessons", camus.create);
router.post("/enrollments", authenticate, camus.create);
router.get("/members/:memberId/enrollments", camus.getById);
router.get("/courses/:courseId/enrollments", authenticate, camus.getById);
router.post("/courses/:courseId/reviews", authenticate, camus.create);
router.get("/courses/:courseId/reviews", camus.getById);

module.exports = router;