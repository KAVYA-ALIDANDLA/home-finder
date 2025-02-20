const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/connect"); // Make sure connectDB is correctly set up

// ✅ Load environment variables before database connection
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Enable CORS (Allow frontend to access backend)
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from your React frontend
  credentials: true, // Allow cookies and authentication headers if needed
}));

// ✅ Middleware
app.use(express.json()); // Parse JSON request body

// ✅ Sample route (to check if backend is running)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Import and use routes
const userRoutes = require("./routes/userRoutes"); // Make sure routes are correctly set up
app.use("/api/user", userRoutes); // Adjust as per your routes

// ✅ Handle errors for unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1); // Exit process if there's an unhandled rejection
});

// ✅ Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
