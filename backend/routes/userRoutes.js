const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getAllBookingsController,
  getAllBookingsAdminController,
} = require("../controllers/userController");

const router = express.Router();

// ✅ Register User
router.post("/register", registerController);

// ✅ Login User
router.post("/login", loginController);

// ✅ Forgot Password
router.post("/forgotpassword", forgotPasswordController);

// ✅ Get All Properties
router.get("/getAllProperties", authMiddleware, getAllPropertiesController);

// ✅ Get Authenticated User Data
router.post("/getuserdata", authMiddleware, authController);

// ✅ Handle Property Booking
router.post("/bookinghandle", authMiddleware, bookingHandleController);

// ✅ Get All Bookings for a User
router.get("/getallbookings", authMiddleware, getAllBookingsController);

// ✅ Get All Bookings (Admin)
router.get("/admin/bookings", authMiddleware, getAllBookingsAdminController);

module.exports = router;
