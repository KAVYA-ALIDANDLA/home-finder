const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    propertyType: { type: String, required: true },
    propertyAdType: { type: String, required: true },
    propertyAddress: { type: String, required: true },
    ownerContact: { type: String, required: true },
    propertyAmt: { type: Number, required: true },
    additionalInfo: { type: String },
    propertyImages: [{ type: String }],
    isAvailable: { type: String, default: "Available" }, // ✅ Ensure this field exists
    ownerID:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required:true
    }

}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
