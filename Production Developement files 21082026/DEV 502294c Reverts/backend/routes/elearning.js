const express = require('express');
const elearning = require('../controllers/elearningController.js');
const { contentDb } = require("../db");
const router = express.Router();

router.get("/programs", elearning.getAll);
router.get("/programs/:programId", elearning.getById);
router.post("/programs", elearning.create);
router.post("/programs/:programId/enroll", elearning.create);
router.get("/students/:studentId/programs", elearning.getById);
router.get("/providers/:providerId/programs", elearning.getById);
router.post("/programs/:programId/courses", elearning.create);
router.get("/programs/:programId/courses", elearning.getById);
router.get("/categories", elearning.getAll);
router.post("/assignments/:assignmentId/submit", elearning.create);

module.exports = router;