import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import contactUsRoutes from "./routes/contactUsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Database Connection
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/billing", billingRoutes);
app.use("/mpesa", tokenRoutes);
app.use("/profile", profileRoutes);
app.use("/images", imageRoutes);
app.use("/contact-us", contactUsRoutes);

// Server Start
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
