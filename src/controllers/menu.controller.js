const MenuItem = require("../models/menuItem.model");
const cloudinary = require("../config/cloudinary");

// @desc   Get all menu items (supports ?category= & ?search= & ?availability=)
// @route  GET /api/menu
exports.getMenuItems = async (req, res) => {
  try {
    const { category, search, availability } = req.query;
    const filter = {};

    if (category && category !== "All") filter.category = category;
    if (availability !== undefined) filter.availability = availability === "true";
    if (search) filter.name = { $regex: search, $options: "i" };

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc   Get single menu item
// @route  GET /api/menu/:id
exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc   Create menu item (admin only)
// @route  POST /api/menu
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, availability } = req.body;

    const image = req.file
      ? { url: req.file.path, public_id: req.file.filename }
      : { url: "", public_id: "" };

    const item = await MenuItem.create({
      name,
      description,
      category,
      price,
      availability: availability === "false" ? false : true,
      image,
    });

    return res.status(201).json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc   Update menu item (admin only)
// @route  PUT /api/menu/:id
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    const { name, description, category, price, availability } = req.body;

    if (req.file) {
      if (item.image?.public_id) {
        await cloudinary.uploader.destroy(item.image.public_id).catch(() => {});
      }
      item.image = { url: req.file.path, public_id: req.file.filename };
    }

    item.name = name ?? item.name;
    item.description = description ?? item.description;
    item.category = category ?? item.category;
    item.price = price ?? item.price;
    if (availability !== undefined) item.availability = availability === "true" || availability === true;

    await item.save();
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc   Delete menu item (admin only)
// @route  DELETE /api/menu/:id
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    if (item.image?.public_id) {
      await cloudinary.uploader.destroy(item.image.public_id).catch(() => {});
    }
    await item.deleteOne();

    return res.json({ message: "Menu item deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
