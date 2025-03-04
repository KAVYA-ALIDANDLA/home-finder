const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    registerOwner,
    loginOwner,
    postProperty,
    getAllProperties
} = require("../controllers/ownerController");

const router = express.Router();

// ✅ Owner Authentication Routes
router.post("/register", registerOwner);
router.post("/login", loginOwner);

// ✅ Property Management Routes
router.post("/postproperty", authMiddleware, multer().array("propertyImages"), postProperty);
router.get("/properties", getAllProperties); // Get all properties

module.exports = router;
