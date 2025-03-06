const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController, // ✅ Added Booking Handle Controller
  getAllBookingsController,
} = require("../controllers/userController");

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
  try {
    await registerController(req, res);
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  try {
    await loginController(req, res);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Forgot Password
router.post("/forgotpassword", async (req, res) => {
  try {
    await forgotPasswordController(req, res);
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Get All Properties
router.get("/getAllProperties", async (req, res) => {
  try {
    await getAllPropertiesController(req, res);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Get Authenticated User Data
router.post("/getuserdata", authMiddleware, async (req, res) => {
  try {
    await authController(req, res);
  } catch (error) {
    console.error("Get User Data Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Handle Property Booking
router.post("/bookinghandle/:propertyid", authMiddleware, async (req, res) => {
  try {
    await bookingHandleController(req, res);
  } catch (error) {
    console.error("Booking Handle Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Get All Bookings
router.get("/getallbookings", authMiddleware, async (req, res) => {
  try {
    await getAllBookingsController(req, res);
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
