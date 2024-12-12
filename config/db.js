import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const url = process.env.MONGODB_URL;

  if (!url) {
    console.error("Error: No MongoDB connection string provided.");
    process.exit(1); // Exit the application if URI is not provided
  }

  try {
    await mongoose.connect(url); 
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the application if there's a connection failure
  }
};

export default connectDB;
