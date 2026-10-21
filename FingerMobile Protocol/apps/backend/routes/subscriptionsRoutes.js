const express = require('express');
const router = express.Router();
const subscriptionsController = require('../controllers/subscriptionsController');

router.get('/', subscriptionsController.getSubscriptions);
router.post('/', subscriptionsController.createSubscription);
router.post('/:id/cancel', subscriptionsController.cancelSubscription);
router.put('/:id/cancel', subscriptionsController.cancelSubscription);
router.delete('/:id', subscriptionsController.cancelSubscription);

module.exports = router;
