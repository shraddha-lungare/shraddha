const express = require("express");
const bcrypt = require("bcrypt"); // for hashing passwords
const router = express.Router();
const User = require("./../Model/user");

// ✅ CREATE: Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, contact, city } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    const newUser = await User.create({
      name,
      email,
      contact,
      city,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        contact: newUser.contact,
        city: newUser.city
      }
    });
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

    // ✅ Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        city: user.city
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
    const users = await User.find().select("-password"); // exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// ✅ Get user details by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
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
