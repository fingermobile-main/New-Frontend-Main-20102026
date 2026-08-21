const express = require('express');
const fingerlux = require('../controllers/fingerluxController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

router.get("/users/:userId/items", fingerlux.getById);
router.get("/auctions", fingerlux.getAll);
router.get("/auctions/:auctionId", fingerlux.getById);
router.post("/auctions/:auctionId/bids", fingerlux.create);
router.post("/auctions", fingerlux.create);
router.get("/items/:itemId/reviews", fingerlux.getById);
router.post("/items/:itemId/reviews", fingerlux.create);
router.post("/reviews/:reviewId/helpful", fingerlux.create);
router.get("/wishlist", fingerlux.getAll);
router.post("/wishlist", fingerlux.create);
router.delete("/wishlist/:itemId", fingerlux.delete);
router.get("/cart", fingerlux.getAll);
router.post("/cart", fingerlux.create);
router.put("/cart/:itemId", fingerlux.update);
router.delete("/cart/:itemId", fingerlux.delete);
router.delete("/cart", fingerlux.delete);
router.get("/search", fingerlux.getAll);
router.get("/featured", fingerlux.getAll);
router.get("/", authenticate, fingerlux.getAll);
router.get("/", authenticate, fingerlux.getAll);

module.exports = router;