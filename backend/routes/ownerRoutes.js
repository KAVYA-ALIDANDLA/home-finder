const express = require("express");
const multer = require("multer");

const authMiddleware = require("../middlewares/authMiddleware");
const { 
  registerOwner,
  loginOwner,
  addPropertyController,
  getAllOwnerPropertiesController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
  handleAllBookingstatusController,
} = require("../controllers/ownerController");

const router = express.Router();

// Multer Storage Configuration for Uploading Property Images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Save images to "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/* ------------------- Owner Authentication Routes ------------------- */
router.post("/register", registerOwner); // Register a new owner
router.post("/login", loginOwner); // Owner login

/* ------------------- Property Management Routes ------------------- */
router.post(
  "/postproperty",
  upload.array("propertyImages"), // Allow multiple images upload
  authMiddleware,
  addPropertyController
);

router.get("/getallproperties", authMiddleware, getAllOwnerPropertiesController);

router.get("/getallbookings", authMiddleware, getAllBookingsController);

router.post("/handlebookingstatus", authMiddleware, handleAllBookingstatusController);

router.delete("/deleteproperty/:propertyid", authMiddleware, deletePropertyController);

router.patch(
  "/updateproperty/:propertyid",
  upload.single("propertyImage"), // Allow single image update
  authMiddleware,
  updatePropertyController
);

module.exports = router;
