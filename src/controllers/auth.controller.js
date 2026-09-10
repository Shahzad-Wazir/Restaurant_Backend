const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

// @desc   Register a new user (always role: user)
// @route  POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password, role: "user" });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc   Login (shared by user + admin, role comes back in response)
// @route  POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc   Get logged-in user's profile
// @route  GET /api/auth/me
exports.getMe = async (req, res) => {
  return res.json(req.user);
};

// @desc   Update profile (name / avatar)
// @route  PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    if (req.body.avatar) user.avatar = req.body.avatar;
    await user.save();

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc   Change password
// @route  PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
