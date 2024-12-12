// routes/imageRoutes.js
import express from "express";
import {
  uploadImage,
  getImages,
  deleteImage,
} from "../controllers/imageController.js";

const router = express.Router();

router.post("/", uploadImage);
router.get("/", getImages);
router.delete("/:photo", deleteImage);

export default router;
