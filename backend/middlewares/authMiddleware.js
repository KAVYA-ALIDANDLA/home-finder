const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure environment variables are loaded

const authMiddleware = async (req, res, next) => {
   try {
      const authorizationHeader = req.headers["authorization"];

      // ✅ Check if Authorization header is missing
      if (!authorizationHeader) {
         return res.status(401).json({
            success: false,
            message: "Authorization header missing",
         });
      }

      // ✅ Extract token
      const token = authorizationHeader.split(" ")[1];
      if (!token) {
         return res.status(401).json({
            success: false,
            message: "Token missing or incorrectly formatted",
         });
      }

      // ✅ Verify Token using JWT Secret
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
         if (err) {
            return res.status(403).json({
               success: false,
               message: "Invalid or expired token",
            });
         }

         // ✅ Store user ID in `req.user` for further use in protected routes
         req.user = { id: decoded.id };
         next();
      });
   } catch (error) {
      console.error("Auth Middleware Error:", error);
      res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};

module.exports = authMiddleware; // Export authMiddleware only once
