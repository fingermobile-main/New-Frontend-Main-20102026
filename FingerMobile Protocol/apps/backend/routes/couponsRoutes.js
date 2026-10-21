/**
 * couponsRoutes.js
 * Express routes for Coupons & Promotions
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/couponsController');

router.get('/', controller.getAll);
router.get('/my-coupons', controller.getMyCoupons);
router.post('/claim/:id', controller.claim);
router.post('/redeem', controller.redeem);

module.exports = router;
