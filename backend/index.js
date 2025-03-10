const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const connectionofDb = require("./config/connect.js");

// Import Routes
const ownerRoutes = require("./routes/ownerRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectionofDb();

// ✅ Middleware Setup
app.use(express.json());
//app.use(cors());
app.use(morgan("dev")); // Logs API requests in the console (optional but useful)
app.use(cors());
// ✅ Prevent API Caching (IMPORTANT: Add this before routes)
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// ✅ Static Files (For Serving Uploaded Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/owner", ownerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Default API Route
app.get("/", (req, res) => {
  res.send("🏡 House Rental API is running...");
});

// 🚀 404 Error Handling Middleware
app.use((req, res, next) => {
  console.warn(`⚠️ 404 Not Found - ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// 🚀 Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`❌ Server Error: ${err.message}`);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Server Listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
