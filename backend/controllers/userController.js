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
      return res.status(200).send({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    if (req.body.type === "Owner") {
      granted = "granted";
    }

    const newUser = new userSchema({ ...req.body, granted });
    await newUser.save();

    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: `${error.message}` });
  }
};

// ------------- Login User -------------
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });

    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    user.password = undefined;

    return res.status(200).send({
      message: "Login successful",
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: `${error.message}` });
  }
};

// ------------- Forgot Password -------------
const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    return res.status(200).send({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: `${error.message}` });
  }
};

// ------------- Authenticated User Data -------------
const authController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);

    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }

    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Auth error", success: false });
  }
};

// ------------- Get All Properties -------------
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find();
    return res.status(200).send({ success: true, data: allProperties });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error", success: false });
  }
};

// ------------- Handle Booking -------------
const bookingHandleController = async (req, res) => {
  const { propertyId } = req.params;
  const { userDetails, status, userId, ownerId } = req.body;

  try {
    const booking = new bookingSchema({
      propertyId, // Ensure this matches the model field name
      userID: userId,
      ownerID: ownerId,
      userName: userDetails.fullName,
      phone: userDetails.phone,
      bookingStatus: status,
    });

    await booking.save();
    return res.status(200).send({ success: true, message: "Booking status updated" });
  } catch (error) {
    console.error("Error handling booking:", error);
    return res.status(500).send({ success: false, message: "Error handling booking" });
  }
};

// ------------- Get All Bookings for User -------------
const getAllBookingsController = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send({ success: false, message: "User ID is required" });
  }

  try {
    const getAllBookings = await bookingSchema.find();
    const userBookings = getAllBookings.filter(
      (booking) => booking.userID && booking.userID.toString() === userId
    );

    return res.status(200).send({ success: true, data: userBookings });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", success: false });
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
};
