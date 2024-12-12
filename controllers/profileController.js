import Profile from "../models/profile.js";

// Create a new profile
export const createProfile = async (req, res) => {
  try {
    const { profilePhoto, userName, email, phoneNumber, address, town } =
      req.body;

    // Validate profilePhoto format
    if (typeof profilePhoto !== "string" || !profilePhoto.includes(".")) {
      return res.status(400).json({
        message:
          "Invalid profilePhoto. It must be a valid string with an extension.",
      });
    }

    const allowedFormats = ["jpg", "jpeg", "png"];
    const fileExtension = profilePhoto.split(".").pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      return res.status(400).json({
        message: `Invalid file format for profilePhoto. Only ${allowedFormats.join(
          ", "
        )} are allowed.`,
      });
    }

    const existingProfile = await Profile.findOne({ email });
    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "Profile with this email already exists" });
    }

    const newProfile = new Profile({
      profilePhoto, // Assuming file name like profilePhoto.jpg/png
      userName,
      email,
      phoneNumber,
      address,
      town,
    });

    await newProfile.save();
    res
      .status(201)
      .json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    res.status(500).json({ message: "Error creating profile", error });
  }
};

// Get all profiles
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res
      .status(200)
      .json({ message: "Profiles retrieved successfully", profiles });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profiles", error });
  }
};

// Get profile by email
export const getProfileByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const profile = await Profile.findOne({ email });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res
      .status(200)
      .json({ message: "Profile retrieved successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

// Update a specific field in the profile (edit or delete field)
export const updateProfileField = async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    // Log the incoming updates
    console.log("Incoming Updates: ", updates);

    // Find the profile by email
    const profile = await Profile.findOne({ email });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Apply the updates
    Object.keys(updates).forEach((key) => {
      if (profile[key] !== undefined) {
        profile[key] = updates[key] || null;
      }
    });

    // Save the updated profile
    const updatedProfile = await profile.save();

    // Log and return the updated profile
    console.log("Updated Profile: ", updatedProfile);
    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile: ", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};

// Delete profile by email
export const deleteProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const profile = await Profile.findOneAndDelete({ email });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error });
  }
};
