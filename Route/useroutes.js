const express = require("express");
const bcrypt = require("bcrypt"); // if you want hashed passwords
const router = express.Router();
const User = require("./../Model/user");

// ✅ CREATE: Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password,contact,city } = req.body;

    // Optional: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Optional: hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      contact,
      city,
      password: hashedPassword
      
    });
// POST - Create Account
router.post("/create", async (req, res) => {
    try {
        const { name, email, password, contact, city } = req.body;

        // Save to DB
        const newAccount = new Account({ name, email, password, contact, city });
        await newAccount.save();

        res.status(201).json({ message: "Account created successfully", account: newAccount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating account", error });
    }
});
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

// ✅ LOGIN: Authenticate user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        contact:user.contact,
        city:user.city,
        id:user.id
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ READ: Get all users
router.get("/users-get", async (req, res) => {
  try {
    const users = await User.find(); // get all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// ✅ Get user details by ID
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ DELETE: Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
