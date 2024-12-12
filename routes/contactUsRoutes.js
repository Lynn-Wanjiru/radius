import express from "express";
import {
  createContactUs,
  getContacts,
} from "../controllers/contactUsController.js";

const router = express.Router();

router.post("/", createContactUs); 
router.get("/", getContacts); 

export default router;
