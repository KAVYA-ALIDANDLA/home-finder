const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true, enum: ["Admin", "Owner", "Renter"] },
    granted: { type: String, default: "granted" }, // ✅ Default to "ungranted" for new Owners
});

const User = mongoose.model("User", userSchema);
module.exports = User;
