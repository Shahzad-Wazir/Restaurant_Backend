// Run with: node seed.js
// Creates (or resets) a default admin account so you can log in immediately.
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/user.model");

const ADMIN_EMAIL = "admin@tastybites.com";
const ADMIN_PASSWORD = "Admin@123";

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (admin) {
    console.log("Admin already exists:", ADMIN_EMAIL);
  } else {
    admin = await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    console.log("Admin created!");
    console.log("Email:   ", ADMIN_EMAIL);
    console.log("Password:", ADMIN_PASSWORD);
  }

  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
