const User = require("../schemas/userModel"); // ✅ Use userModel.js for both Admin and Owner
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Admin login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await User.findOne({ email, type: "Admin" }); // ✅ Ensure "Admin" type check
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id, type: "Admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, admin });
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Approve an Owner account
const approveOwner = async (req, res) => {
    const { ownerId } = req.body;

    try {
        const owner = await User.findById(ownerId); // ✅ Use User model for Owners
        if (!owner || owner.type !== "Owner") {
            return res.status(404).json({ message: "Owner not found" });
        }

        const updatedOwner = await User.findByIdAndUpdate(
            ownerId,
            { granted: "granted" },
            { new: true } // ✅ Ensure updated owner is returned
        );

        res.json({ message: "Owner approved successfully", owner: updatedOwner });
    } catch (error) {
        console.error("Approve Owner Error:", error);
        res.status(500).json({ message: "Error approving owner" });
    }
};

// ✅ Get all unapproved Owners (waiting for admin approval)
const getUnapprovedOwners = async (req, res) => {
    try {
        const unapprovedOwners = await User.find({ type: "Owner", granted: "ungranted" }); // ✅ Fix query
        res.json(unapprovedOwners);
    } catch (error) {
        console.error("Fetch Unapproved Owners Error:", error);
        res.status(500).json({ message: "Error fetching unapproved owners" });
    }
};

// ✅ Get all approved Owners
const getApprovedOwners = async (req, res) => {
    try {
        const approvedOwners = await User.find({ type: "Owner", granted: "granted" });
        res.json(approvedOwners);
    } catch (error) {
        console.error("Fetch Approved Owners Error:", error);
        res.status(500).json({ message: "Error fetching approved owners" });
    }
};

module.exports = {
    loginAdmin,
    approveOwner,
    getUnapprovedOwners,
    getApprovedOwners,
};
