// models/billing.js
import mongoose from "mongoose";

// Create billing schema with email as the primary key
const billingSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensures that email is unique 
      
    },
    phoneNumber: {
      type: String,
      required: true,
      
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } 
);

// Check if the model already exists to avoid overwriting
const Billing =
  mongoose.models.Billing || mongoose.model("Billing", billingSchema);

export default Billing;
