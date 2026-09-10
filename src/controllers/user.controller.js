const User = require("../models/user.model");

// @desc   Get all users (admin only)
// @route  GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(filter).sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc   Get single user (admin only)
// @route  GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc   Update a user's role or details (admin only)
// @route  PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, role } = req.body;
    user.name = name ?? user.name;
    if (role && ["admin", "user"].includes(role)) user.role = role;

    await user.save();
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc   Delete a user (admin only)
// @route  DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.equals(req.user._id)) {
      return res.status(400).json({ message: "You can't delete your own account" });
    }

    await user.deleteOne();
    return res.json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
