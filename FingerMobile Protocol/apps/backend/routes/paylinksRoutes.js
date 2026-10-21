const express = require('express');
const router = express.Router();
const paylinksController = require('../controllers/paylinksController');

router.get('/', paylinksController.getPaylinks);
router.post('/', paylinksController.createPaylink);
router.post('/create', paylinksController.createPaylink);
router.delete('/:id', paylinksController.deletePaylink);
router.post('/send-gift', paylinksController.sendGift);
router.post('/redeem', paylinksController.redeemPaylink);

module.exports = router;
