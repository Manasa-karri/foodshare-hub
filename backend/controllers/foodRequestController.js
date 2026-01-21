const FoodRequest = require("../models/FoodRequest");
const Food = require("../models/Food");
const Notification = require("../models/Notification");
const { matchFoodToBestRequest } = require("../services/matchingService");
const { getIO } = require("../socket");

/* =====================================================
   ORGANIZATION CREATES FOOD REQUEST
===================================================== */
exports.createFoodRequest = async (req, res) => {
  try {
    const request = await FoodRequest.create({
      organization: req.user._id,
      quantityRequired: req.body.quantityRequired,
      urgency: req.body.urgency,
      location: req.body.location,
    });

    res.status(201).json({
      message: "Food request submitted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   NGO VIEWS PENDING FOOD REQUESTS
===================================================== */
exports.getFoodRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.find({ status: "pending" })
      .populate("organization", "name location email");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   NGO APPROVES FOOD REQUEST
===================================================== */
exports.approveFoodRequest = async (req, res) => {
  try {
    const request = await FoodRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: "Food request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Request already processed" });
    }

    request.status = "approved";
    request.assignedNGO = req.user._id;
    await request.save();

    res.status(200).json({
      message: "Food request approved",
      request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   NGO FULFILLS FOOD REQUEST (MANUAL)
===================================================== */
exports.fulfillFoodRequest = async (req, res) => {
  try {
    const { foodId } = req.body;

    const request = await FoodRequest.findById(req.params.requestId);
    const food = await Food.findById(foodId);

    if (!request || !food) {
      return res.status(404).json({
        message: "Food request or food not found",
      });
    }

    if (request.status !== "approved") {
      return res.status(400).json({
        message: "Food request not approved yet",
      });
    }

    if (food.assignedNGO.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Food not assigned to this NGO",
      });
    }

    request.status = "fulfilled";
    request.allocatedFood = food._id;
    food.status = "delivered";

    await request.save();
    await food.save();

    res.status(200).json({
      message: "Food request fulfilled successfully",
      request,
      food,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   NGO AUTO MATCH (URGENCY → LOCATION → FRESHNESS)
===================================================== */
exports.autoMatchByPriority = async (req, res) => {
  try {
    const { selectedRequest, food } =
      await matchFoodToBestRequest(req.user._id);

    // 🔔 Create notification
    const notification = await Notification.create({
      user: selectedRequest.organization._id,
      title: "Food Assigned",
      message: "Food has been allocated to your organization",
      type: "food",
      relatedId: food._id,
    });

    getIO()
      .to(selectedRequest.organization._id.toString())
      .emit("newNotification", notification);

    res.status(200).json({
      message: "Food allocated using matching algorithm",
      organization: {
        id: selectedRequest.organization._id,
        name: selectedRequest.organization.name,
        email: selectedRequest.organization.email,
        location: selectedRequest.organization.location,
      },
      food: {
        id: food._id,
        foodName: food.foodName,
        quantity: food.quantity,
        status: food.status,
      },
      requestId: selectedRequest._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
