const express = require('express');
const memberprofiles = require('../controllers/memberprofilesController.js');
const { identityDb } = require("../db");
const router = express.Router();

router.get("/:id", memberprofiles.getById);
router.post("/", memberprofiles.create);
router.put("/:id", memberprofiles.update);
router.delete("/:id", memberprofiles.delete);
router.get("/:id/account-settings", memberprofiles.getById);
router.put("/:id/account-settings", memberprofiles.update);
router.get("/:id/privacy-controls", memberprofiles.getById);
router.put("/:id/privacy-controls/:contentType", memberprofiles.update);
router.get("/:id/security-settings", memberprofiles.getById);
router.put("/:id/security-settings", memberprofiles.update);
router.get("/:id/login-history", memberprofiles.getById);

module.exports = router;