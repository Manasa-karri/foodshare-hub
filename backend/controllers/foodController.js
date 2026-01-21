const Food = require("../models/Food");
const { calculateFreshness } = require("../utils/freshnessCalculator");

/* =====================================================
   CREATE FOOD (DONOR)
===================================================== */
exports.createFood = async (req, res) => {
  try {
    const {
      foodName,
      foodType,
      quantity,
      preparedAt,
      expiryTime,
      location,
    } = req.body;

    const freshnessScore = calculateFreshness(
      new Date(preparedAt),
      Number(expiryTime)
    );

    const food = await Food.create({
      donor: req.user._id,
      foodName,
      foodType,
      quantity,
      preparedAt,
      expiryTime,
      freshnessScore,
      location,
      status: "available",
    });

    res.status(201).json({
      message: "Food donation created successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   VIEW AVAILABLE FOOD (NGO)
===================================================== */
exports.getAvailableFood = async (req, res) => {
  try {
    const foods = await Food.find({ status: "available" })
      .populate("donor", "name location");

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   ACCEPT FOOD (NGO)
===================================================== */
exports.acceptFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.status !== "available") {
      return res.status(400).json({ message: "Food already assigned" });
    }

    food.status = "assigned";
    food.assignedNGO = req.user._id;

    await food.save();

    res.status(200).json({
      message: "Food assigned to NGO successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   PICKUP FOOD (NGO)
===================================================== */
exports.pickupFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.status !== "assigned") {
      return res.status(400).json({
        message: "Food is not ready for pickup",
      });
    }

    if (food.assignedNGO.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to pick this food",
      });
    }

    food.status = "picked";
    await food.save();

    res.status(200).json({
      message: "Food picked up successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   DELIVER FOOD (NGO)
===================================================== */
exports.deliverFood = async (req, res) => {
  try {
    const { organizationId } = req.body;
    const food = await Food.findById(req.params.foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.status !== "picked") {
      return res.status(400).json({
        message: "Food must be picked before delivery",
      });
    }

    food.status = "delivered";
    food.assignedOrganization = organizationId;

    await food.save();

    res.status(200).json({
      message: "Food delivered successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   CHECK & UPDATE FRESHNESS
===================================================== */
exports.checkFreshness = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const freshnessScore = calculateFreshness(
      food.preparedAt,
      food.expiryTime
    );

    food.freshnessScore = freshnessScore;
    await food.save();

    let status =
      freshnessScore >= 70
        ? "Fresh"
        : freshnessScore >= 40
        ? "Moderate"
        : "Spoiled";

    res.status(200).json({
      freshnessScore,
      status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
