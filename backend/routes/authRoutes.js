import express from "express";
import User from "../models/User.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
      username
    });

    if (existingUser) {
      return res.json({
        message: "User already exists"
      });
    }

    const newUser = new User({
      username,
      password,
      role:
        username === "admin"
          ? "admin"
          : "user"
    });

    await newUser.save();

    res.json({
      message: "Signup successful"
    });
  } catch (error) {
    res.json({
      message: "Signup failed"
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
      password
    });

    if (!user) {
      return res.json({
        message: "Invalid credentials"
      });
    }

    res.json({
      message: "Login successful",
      role: user.role,
      username: user.username
    });
  } catch (error) {
    res.json({
      message: "Login failed"
    });
  }
});

export default router;