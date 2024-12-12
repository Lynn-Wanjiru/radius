// routes/billingRoutes.js
import express from "express";
import {
  createBilling,
  getBillingRecords,
  getBillingByEmail,
} from "../controllers/billingController.js";

const router = express.Router();

// Route to create a new billing record
router.post("/", createBilling);

// Route to get all billing records
router.get("/", getBillingRecords);

// Route to get a specific billing record by email
router.get("/:email", getBillingByEmail);

export default router;
