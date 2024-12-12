import Register from "../models/register.js"; 

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email in the Register model
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error", error });
  }
};

export { loginUser };
