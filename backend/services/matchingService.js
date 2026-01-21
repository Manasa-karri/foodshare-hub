const Food = require("../models/Food");
const FoodRequest = require("../models/FoodRequest");
const { calculateDistance } = require("../utils/distanceCalculator");

exports.matchFoodToBestRequest = async (ngoId) => {
  // 1️⃣ Get all approved requests for this NGO
  const requests = await FoodRequest.find({
    status: "approved",
    assignedNGO: ngoId,
  }).populate("organization");

  if (!requests.length) {
    throw new Error("No approved requests available");
  }

  // 2️⃣ Get one available food (freshness <= 30)
  const food = await Food.findOne({
    status: "available",
    freshnessScore: { $lte: 30 },
  });

  if (!food) {
    throw new Error("No suitable food available");
  }

  // 3️⃣ Evaluate requests (urgency + distance)
  const evaluated = requests.map((req) => {
    const distance = calculateDistance(
      food.location.latitude,
      food.location.longitude,
      req.location.latitude,
      req.location.longitude
    );

    const urgencyScore =
      req.urgency === "high"
        ? 80
        : req.urgency === "medium"
        ? 65
        : 40;

    return { req, urgencyScore, distance };
  });

  // 4️⃣ Sort → urgency DESC, distance ASC
  evaluated.sort((a, b) => {
    if (b.urgencyScore !== a.urgencyScore) {
      return b.urgencyScore - a.urgencyScore;
    }
    return a.distance - b.distance;
  });

  // 5️⃣ Select winning organization
  const selectedRequest = evaluated[0].req;

  // 6️⃣ Update DB
  selectedRequest.status = "fulfilled";
  selectedRequest.allocatedFood = food._id;

  food.status = "delivered";
  food.assignedNGO = ngoId;

  await selectedRequest.save();
  await food.save();

  return {
    selectedRequest,
    food,
  };
};
