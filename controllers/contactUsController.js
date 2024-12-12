// controllers/contactUsController.js
import ContactUs from "../models/contactUs.js";

// Create a new contact entry
export const createContactUs = async (req, res) => {
  try {
    const { firstName, lastName, email, description } = req.body;
    const newContact = new ContactUs({
      firstName,
      lastName,
      email,
      description,
    });
    await newContact.save();
    res.status(201).json({
      message: "Contact message submitted successfully",
      contact: newContact,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting contact message", error });
  }
};

// Fetch all contact entries
export const getContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.find();
    res
      .status(200)
      .json({ message: "Contacts retrieved successfully", contacts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error });
  }
};
