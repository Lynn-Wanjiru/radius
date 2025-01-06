// controllers/billingController.js
import Billing from "../models/billing.js";

const conversionRates = {
  USD:1,// base currency
  EUR: 0.96,
  KSH: 129.30,
  GBP: 0.80,
  JPY: 157.61,
  AUD: 1.60,
  CAD: 1.44,
};

// mapping currency to phone number formats
const phoneFormats = {
  USD: /^\+1\d{10}$/,   // US
  EUR: /^\+33\d{9}$/,   // France
  KSH: /^\+254\d{9}$/,  // Kenya
  GBP: /^\+44\d{10}$/,  // UK
  JPY: /^\+81\d{9}$/,   // Japan
  AUD: /^\+61\d{9}$/,   // Australia
  CAD: /^\+1\d{10}$/,   // Canada
};

// Validate phone number based on currency
const validatePhoneNumber = (phoneNumber, currency) => {
  const regex = phoneFormats[currency];
  if (!regex) return false; // Unsupported currency
  return regex.test(phoneNumber);
};



// Create a new billing record
const createBilling = async (req, res) => {
  try {
    const { email, phoneNumber, amount, currency } = req.body;

    // Validate required fields
    if (!email || !phoneNumber || !amount || !currency) {
      return res.status(400).json({
        message: "Email, phone number,  amount and currency are required.",
      });
    }

    // Validate currency
    if (!conversionRates[currency]) {
      // **Ensure currency is in the supported list**
      return res
        .status(400)
        .json({ message: `Unsupported currency: ${currency}` });
    }
    // Validate phone number format based on currency
    if (!validatePhoneNumber(phoneNumber, currency)) {
      return res.status(400).json({
        message: `Invalid phone number format for the selected currency (${currency}).`,
      });
    }

    // Check if billing record with this email already exists
    const existingBilling = await Billing.findOne({ email });
    if (existingBilling) {
      return res
        .status(400)
        .json({ message: "Billing record with this email already exists." });
    }

    // Convert amount to all currencies
     const convertedAmounts = Object.entries(conversionRates).reduce(
       (acc, [curr, rate]) => {
         acc[curr] = (amount / conversionRates[currency]) * rate;
         return acc;
       },
       {}
     );

    // Create new billing record
    const newBilling = new Billing({
      email,
      phoneNumber,
      amount,
      currency,
      convertedAmounts,
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
