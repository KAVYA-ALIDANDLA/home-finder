const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userModel");
const propertySchema = require("../schemas/propertyModel");
const bookingSchema = require("../schemas/bookingModel");

// ------------- Register User -------------
const registerController = async (req, res) => {
  try {
    let granted = "";
    const existsUser = await userSchema.findOne({ email: req.body.email });

    if (existsUser) {
      return res
        .status(200)
        .json({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    if (req.body.type === "Owner") {
      granted = "granted";
    }

    const newUser = new userSchema({ ...req.body, granted });
    await newUser.save();

    return res.status(201).json({ message: "Register Success", success: true });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ------------- Login User -------------
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user.password = undefined;

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ------------- Forgot Password -------------
const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    return res
      .status(200)
      .json({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ------------- Authenticated User Data -------------
const authController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id);

    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).json({ message: "Auth error", success: false });
  }
};

// ------------- Get All Properties -------------
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find();
    return res.status(200).json({ success: true, data: allProperties });
  } catch (error) {
    console.error("Get All Properties Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// ------------- Handle Property Booking -------------
const bookingHandleController = async (req, res) => {
  try {
    const { propertyID } = req.body;
    const userID = req.user.id; // Get user ID from authentication middleware

    if (!propertyID) {
      return res
        .status(400)
        .json({ success: false, message: "Property ID is required" });
    }

    // Fetch property details to get ownerID
    const property = await propertySchema.findById(propertyID);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Check if the property is already booked
    if (!property.isAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "Property is already booked" });
    }

    // Create a new booking
    const newBooking = new bookingSchema({
      propertyID,
      ownerID: property.ownerID, // Fetch ownerID from the property model
      userID, // Use userID from `req.user`
      bookingStatus: "pending",
    });

    await newBooking.save();

    // ✅ Update property availability to false
    property.isAvailable = false;
    await property.save();

    res.status(201).json({
      success: true,
      message: "Booking successful!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ------------- Get All Bookings for a User -------------
const getAllBookingsController = async (req, res) => {
  try {
    console.log("from allbookings");
    const userID = req.user.id;

    if (!userID) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const userBookings = await bookingSchema
      .find({ userID })
      .populate("ownerID")
      .populate("propertyID")
      .populate("userID");
    console.log("getuserbook", userBookings);
    return res.status(200).json({ success: true, data: userBookings });
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// ------------- Get All Bookings (Admin) -------------
const getAllBookingsAdminController = async (req, res) => {
  try {
    const allBookings = await bookingSchema.find();
    return res.status(200).json({ success: true, data: allBookings });
  } catch (error) {
    console.error("Get All Bookings Admin Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getAllBookingsController,
  getAllBookingsAdminController,
};
