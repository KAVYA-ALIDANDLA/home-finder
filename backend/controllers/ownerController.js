const bcrypt = require("bcryptjs");
const Owner = require("../schemas/userModel"); // Ensure this is the correct model

const registerOwner = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingOwner = await Owner.findOne({ email });
        if (existingOwner) {
            return res.status(400).json({ message: "Owner already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newOwner = new Owner({
            name,
            email,
            password: hashedPassword,
            type: "Owner",
            granted: "granted", // ✅ Explicitly set granted to "granted"
        });

        // 🔍 Debugging: Print the owner object before saving
        console.log("Owner Data Before Saving:", newOwner);

        await newOwner.save();

        res.status(201).json({ message: "Owner registered successfully", owner: newOwner });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Error registering owner" });
    }
};

module.exports = { registerOwner };
