const express = require('express');
const contentmanagement = require('../controllers/contentmanagementController.js');
const { contentDb } = require("../db");
const router = express.Router();

router.get("/", contentmanagement.getAll);
router.get("/:contentId", contentmanagement.getById);
router.post("/", contentmanagement.create);
router.put("/:contentId", contentmanagement.update);
router.delete("/:contentId", contentmanagement.delete);
router.get("/author/:authorId", contentmanagement.getById);
router.get("/categories", contentmanagement.getAll);
router.get("/tags", contentmanagement.getAll);

module.exports = router;