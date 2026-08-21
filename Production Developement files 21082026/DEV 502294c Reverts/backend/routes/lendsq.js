const express = require('express');
const lendsq = require('../controllers/lendsqController.js');
const { authenticate } = require('../middleware/authenticate');
const { monetizationDb, contentDb } = require("../db");
const router = express.Router();

router.get("/loans", lendsq.getAll);
router.get("/loans/:id", lendsq.getById);
router.post("/loans", lendsq.create);
router.put("/loans/:id", lendsq.update);
router.delete("/loans/:id", authenticate, lendsq.delete);
router.post("/loans/:id/invest", authenticate, lendsq.create);
router.get("/loans/:id/investments", lendsq.getById);
router.get("/member/investments", authenticate, lendsq.getAll);
router.get("/member/loans", authenticate, lendsq.getAll);
router.get("/stats", lendsq.getAll);
router.post("/loans/:id/repayment", authenticate, lendsq.create);
router.get("/products", lendsq.getAll);
router.get("/products/:productId", lendsq.getById);
router.post("/applications", lendsq.create);
router.get("/users/:userId/applications", lendsq.getById);
router.get("/users/:userId/loans", lendsq.getById);
router.post("/loans/:loanId/payments", lendsq.create);
router.get("/loans/:loanId/payments", lendsq.getById);
router.get("/categories", lendsq.getAll);

module.exports = router;