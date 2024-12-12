import express from "express";
import {
  createProfile,
  getProfiles,
  getProfileByEmail,
  updateProfileField,
  deleteProfile,
} from "../controllers/profileController.js";

const router = express.Router();

// Create a new profile
router.post("/", createProfile);

// Get all profiles
router.get("/", getProfiles);

// Get profile by email
router.get("/email/:email", getProfileByEmail);

// Update a specific field in the profile
router.patch("/email/:email", updateProfileField); 

// Delete profile by email
router.delete("/email/:email", deleteProfile);

export default router;
