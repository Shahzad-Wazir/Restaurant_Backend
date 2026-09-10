const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/dashboard.controller");
const protect = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.get("/", protect, admin, getStats);

module.exports = router;
