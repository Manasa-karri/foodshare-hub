const express = require("express");
const router = express.Router();

const {
  createFoodRequest,
  getFoodRequests,
  approveFoodRequest,
  fulfillFoodRequest,
  autoMatchByPriority,
} = require("../controllers/foodRequestController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ORGANIZATION
router.post(
  "/create",
  protect,
  authorize("organization"),
  createFoodRequest
);

// NGO
router.get(
  "/all",
  protect,
  authorize("ngo"),
  getFoodRequests
);

router.put(
  "/approve/:requestId",
  protect,
  authorize("ngo"),
  approveFoodRequest
);

router.put(
  "/fulfill/:requestId",
  protect,
  authorize("ngo"),
  fulfillFoodRequest
);

router.put(
  "/auto-match-priority",
  protect,
  authorize("ngo"),
  autoMatchByPriority
);

module.exports = router;
