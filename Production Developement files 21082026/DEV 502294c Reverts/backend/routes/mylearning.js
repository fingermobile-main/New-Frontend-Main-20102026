const express = require('express');
const mylearning = require('../controllers/mylearningController.js');
const { contentDb } = require("../db");
const router = express.Router();

router.get("/courses", mylearning.getAll);
router.get("/courses/:courseId", mylearning.getById);
router.post("/courses", mylearning.create);
router.post("/courses/:courseId/enroll", mylearning.create);
router.get("/students/:studentId/courses", mylearning.getById);
router.get("/instructors/:instructorId/courses", mylearning.getById);
router.post("/courses/:courseId/modules", mylearning.create);
router.get("/courses/:courseId/modules", mylearning.getById);
router.get("/categories", mylearning.getAll);

module.exports = router;