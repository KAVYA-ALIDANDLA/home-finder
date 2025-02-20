const express = require("express");
const {
    loginAdmin,
    approveOwner,
    getUnapprovedOwners,
    getApprovedOwners,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/approve-owner", authMiddleware, approveOwner);
router.get("/unapproved-owners", authMiddleware, getUnapprovedOwners);
router.get("/approved-owners", authMiddleware, getApprovedOwners);

module.exports = router;
