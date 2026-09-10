const User = require("../models/user.model");
const MenuItem = require("../models/menuItem.model");

// @desc   Get admin dashboard stats
// @route  GET /api/dashboard
exports.getStats = async (req, res) => {
  try {
    const totalMenuItems = await MenuItem.countDocuments();

    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const categoryAgg = await MenuItem.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const categories = {
      Starter: 0,
      "Main Course": 0,
      Dessert: 0,
      Beverage: 0,
    };

    categoryAgg.forEach((category) => {
      categories[category._id] = category.count;
    });

    const recentMenuItems = await MenuItem.find()
      .sort({ createdAt: -1 })
      .limit(4);

    const recentUsers = await User.find({
      role: "user",
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      totalMenuItems,
      totalUsers,
      totalOrders: 0,
      categories,
      recentMenuItems,
      recentUsers,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};