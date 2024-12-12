import Image from "../models/image.js";
import mongoose from "mongoose";

// Upload a new image
export const uploadImage = async (req, res) => {
  try {
    const { photo } = req.body;

    // Debug: Log request body
    console.log("Request Body:", req.body);

    // Validate photo format
    if (typeof photo !== "string" || !photo.includes(".")) {
      return res.status(400).json({
        message: "Invalid photo. It must be a valid string with an extension.",
      });
    }

    const allowedFormats = ["jpg", "jpeg", "png"];
    const fileExtension = photo.split(".").pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      return res.status(400).json({
        message: `Invalid file format for photo. Only ${allowedFormats.join(
          ", "
        )} are allowed.`,
      });
    }

    // Check for duplicates (ensure file names are unique)
    const existingImage = await Image.findOne({ photo });
    if (existingImage) {
      return res.status(400).json({
        message:
          "An image with the same name already exists. Use a unique name.",
      });
    }

    const newImage = new Image({ photo });
    await newImage.save();
    res.status(201).json({
      message: "Image uploaded successfully",
      image: newImage,
    });
  } catch (error) {
    console.error("Error in uploadImage:", error); // Debug: Log error details
    res.status(500).json({ message: "Error uploading image", error });
  }
};

// Get all images
export const getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json({
      message: "Images retrieved successfully",
      images,
    });
  } catch (error) {
    console.error("Error in getImages:", error); // Debug: Log error details
    res.status(500).json({ message: "Error fetching images", error });
  }
};

// Delete an image by name (photo field)
export const deleteImage = async (req, res) => {
  try {
    const { photo } = req.params;

    // Find and delete the image by the photo name
    const deletedImage = await Image.findOneAndDelete({ photo });
    if (!deletedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({
      message: "Image deleted successfully",
      image: deletedImage,
    });
  } catch (error) {
    console.error("Error in deleteImage:", error); // Debug: Log error details
    res.status(500).json({ message: "Error deleting image", error });
  }
};
