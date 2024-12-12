import express from "express";
import { createToken, postStk } from "../controllers/tokenController.js"; 

const router = express.Router();

// Route to generate Mpesa token (middleware)
router.get("/generate-token", createToken, (req, res) => {
  res.status(200).json({ message: "Token generated successfully" });
});

// Route to initiate Mpesa STK push
router.post("/stk-push", createToken, postStk);

export default router;
