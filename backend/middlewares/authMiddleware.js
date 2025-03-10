const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract token
      if (!token) {
         return res.status(401).json({ success: false, message: "Authorization token missing" });
      }

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded user data to request
      next();
   } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
   }
};
