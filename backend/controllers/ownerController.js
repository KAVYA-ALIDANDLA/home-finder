const Owner = require("../schemas/userModel"); // Import the Owner model
const Property = require("../schemas/propertyModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Owner Registration
const registerOwner = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if owner already exists
        const existingOwner = await Owner.findOne({ email });
        if (existingOwner) {
            return res.status(400).json({ success: false, message: "Owner already registered!" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newOwner = new Owner({ name, email, password: hashedPassword });
        await newOwner.save();

        res.status(201).json({ success: true, message: "Owner registered successfully!" });
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
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: owner._id }, "your_secret_key", { expiresIn: "1h" });

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

        const { propertyType, propertyAdType, propertyAddress, ownerContact, propertyAmt, additionalInfo } = req.body;
        const propertyImages = req.files.map(file => file.path); // Extract image paths from Multer

        const newProperty = new Property({
            propertyType,
            propertyAdType,
            propertyAddress,
            ownerContact,
            propertyAmt,
            additionalInfo,
            propertyImages,
        });

        await newProperty.save();
        res.status(201).json({ success: true, message: "Property added successfully!", property: newProperty });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Get All Properties
const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();

        // Ensure isAvailable exists in response
        const updatedProperties = properties.map(property => ({
            ...property._doc,
            isAvailable: property.isAvailable || "Available" // Default to "Available"
        }));

        res.status(200).json({ success: true, data: updatedProperties });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Export All Controllers
module.exports = {
    registerOwner, 
    loginOwner,
    postProperty,
    getAllProperties, // Added function export
};
