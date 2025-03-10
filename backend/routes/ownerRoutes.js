const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    registerOwner,
    loginOwner,
    postProperty,
    getAllProperties,
    getAllBookings // ✅ Added getAllBookings
} = require("../controllers/ownerController");

const router = express.Router();

// ✅ Owner Authentication Routes
router.post("/register", registerOwner);
router.post("/login", loginOwner);

// ✅ Property Management Routes
router.post("/postproperty", authMiddleware, multer().array("propertyImages"), postProperty);
router.get("/getallproperties", getAllProperties); // Get all properties

// ✅ Booking Management Route
router.get("/getallbookings", authMiddleware, getAllBookings); // ✅ Added getAllBookings route

module.exports = router;