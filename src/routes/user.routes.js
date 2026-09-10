const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const protect = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.use(protect, admin);

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
