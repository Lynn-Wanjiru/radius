// controllers/billingController.js
import Billing from "../models/billing.js";

// Create a new billing record
const createBilling = async (req, res) => {
  try {
    const { email, phoneNumber, amount } = req.body;

    // Validate required fields
    if (!email || !phoneNumber || !amount) {
      return res
        .status(400)
        .json({ message: "Email, phone number, and amount are required." });
    }

    // Check if billing record with this email already exists
    const existingBilling = await Billing.findOne({ email });
    if (existingBilling) {
      return res
        .status(400)
        .json({ message: "Billing record with this email already exists." });
    }

    // Create new billing record
    const newBilling = new Billing({
      email,
      phoneNumber,
      amount,
    });

    await newBilling.save();

    res.status(201).json({
      message: "Billing record created successfully",
      billing: newBilling,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all billing records
const getBillingRecords = async (req, res) => {
  try {
    const billings = await Billing.find();
    res.status(200).json({
      message: "Billing records fetched successfully",
      billings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific billing record by email
const getBillingByEmail = async (req, res) => {
  try {
    const billing = await Billing.findOne({ email: req.params.email });
    if (!billing) {
      return res.status(404).json({ message: "Billing record not found" });
    }

    res.status(200).json({
      message: "Billing record fetched successfully",
      billing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export { createBilling, getBillingRecords, getBillingByEmail };
