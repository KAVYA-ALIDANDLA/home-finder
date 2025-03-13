const Owner = require("../schemas/userModel"); // Import the Owner model
const Property = require("../schemas/propertyModel");
const Booking = require("../schemas/bookingModel"); // Import the Booking model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Owner Registration
const registerOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if owner already exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res
        .status(400)
        .json({ success: false, message: "Owner already registered!" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = new Owner({ name, email, password: hashedPassword });
    await newOwner.save();

    res
      .status(201)
      .json({ success: true, message: "Owner registered successfully!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Owner Login
const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email });

    if (!owner) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: owner._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.json({ success: true, message: "Login successful!", token });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Property Posting Function
const postProperty = async (req, res) => {
  try {
    console.log("Received Property Data:", req.body);

    const {
      propertyType,
      propertyAdType,
      propertyAddress,
      ownerContact,
      propertyAmt,
      additionalInfo,
    } = req.body;
    const propertyImages = req.files.map((file) => file.path); // Extract image paths from Multer

    const newProperty = new Property({
      propertyType,
      propertyAdType,
      propertyAddress,
      ownerContact,
      propertyAmt,
      additionalInfo,
      propertyImages,
      ownerID: req.user.id,
    });

    await newProperty.save();
    res.status(201).json({
      success: true,
      message: "Property added successfully!",
      property: newProperty,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get All Properties
const getAllProperties = async (req, res) => {
  try {
    // Fetch all properties from the database
    const properties = await Property.find();

    // Map through properties and ensure `isAvailable` is set correctly
    const updatedProperties = properties.map((property) => ({
      ...property._doc,
      isAvailable:
        property.isAvailable === "false" ? "Unavailable" : "Available",
    }));

    res.status(200).json({ success: true, data: updatedProperties });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get All Bookings
const getAllBookings = async (req, res) => {
  try {
    // Get the logged-in owner's ID
    const ownerID = req.user.id;

    // Find properties owned by the owner
    const ownerProperties = await Property.find({ ownerID }).select("_id");

    // Extract property IDs owned by this owner
    const ownerPropertyIDs = ownerProperties.map((property) =>
      property._id.toString()
    );

    // Find bookings related to the owner's properties
    const bookings = await Booking.find({
      propertyID: { $in: ownerPropertyIDs },
    })
      .populate("propertyID", "propertyType propertyAddress") // Fetch property details
      .populate("renterID", "name phone"); // Fetch renter details

    // Format response to match frontend structure
    const formattedBookings = bookings.map((booking) => ({
      _id: booking._id,
      propertyId: booking.propertyID?._id || "N/A",
      propertyType: booking.propertyID?.propertyType || "N/A",
      propertyAddress: booking.propertyID?.propertyAddress || "N/A",
      userName: booking.renterID?.name || "N/A",
      phone: booking.renterID?.phone || "N/A",
      bookingStatus: booking.bookingStatus,
    }));

    res.status(200).json({ success: true, data: formattedBookings });
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching bookings", error });
  }
};

// ✅ Export All Controllers
module.exports = {
  registerOwner,
  loginOwner,
  postProperty,
  getAllProperties,
  getAllBookings, // Added function export
};
