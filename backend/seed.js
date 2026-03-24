import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");

    const adminExists = await User.findOne({ email: "admin@retailhub.com" });

    if (adminExists) {
      console.log("Admin user already exists.");
    } else {
      await User.create({
        username: "admin",
        email: "admin@retailhub.com",
        password: "admin123456",
        role: "Admin",
      });
      console.log("Admin user created.");
      console.log("  Email:    admin@retailhub.com");
      console.log("  Password: admin123456");
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
