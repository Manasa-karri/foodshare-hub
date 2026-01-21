const express = require("express");
const router = express.Router();

const {
  createFood,
  getAvailableFood,
  acceptFood,
  pickupFood,
  deliverFood,
  checkFreshness,
} = require("../controllers/foodController");

const { protect, authorize } = require("../middleware/authMiddleware");

/* =====================================================
   FRESHNESS CHECK
===================================================== */
router.get(
  "/freshness/:foodId",
  protect,
  checkFreshness
);

/* =====================================================
   DONOR ROUTES
===================================================== */
// Donor creates food
router.post(
  "/create",
  protect,
  authorize("donor"),
  createFood
);

/* =====================================================
   NGO ROUTES
===================================================== */
// NGO views available food
router.get(
  "/available",
  protect,
  authorize("ngo"),
  getAvailableFood
);

// NGO accepts food
router.put(
  "/accept/:foodId",
  protect,
  authorize("ngo"),
  acceptFood
);

// NGO picks up food
router.put(
  "/pickup/:foodId",
  protect,
  authorize("ngo"),
  pickupFood
);

// NGO delivers food to organization
router.put(
  "/deliver/:foodId",
  protect,
  authorize("ngo"),
  deliverFood
);

module.exports = router;
