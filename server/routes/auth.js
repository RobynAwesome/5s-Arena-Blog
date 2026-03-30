import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const router = Router();

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Registration error:", err); // More detailed logging
    res.status(500).json({ error: "Server error during registration." }); // Generic message to client
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Login error:", err); // More detailed logging
    res.status(500).json({ error: "Server error during login." }); // Generic message to client
  }
});

// GET /me - get current user from JWT (protected route)
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authentication failed: No token provided" }); // Missing check for no token/malformed header
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password -__v"); // Exclude password and __v field
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Return a simplified user object, without the full Mongoose model
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err); // More detailed logging
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Authentication failed: Invalid or expired token." });
    }
    res.status(500).json({ error: "Server error during profile fetch." }); // Generic message to client
  }
});

// POST /google - Login or Register with Google
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body; // This is the Google ID Token

    if (!credential) {
      return res.status(400).json({ error: "Google credential not provided" });
    }

    // Verify the Google ID token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches the client ID used by your frontend
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, register them
      // Note: Google login doesn't provide a password, so we'll set a placeholder or generate one
      // For a real app, consider a more robust password handling (e.g., allow user to set after first Google login)
      user = await User.create({
        username: name.toLowerCase().replace(/\s+/g, "") || email.split("@")[0], // Generate username from name or email
        email,
        password: Math.random().toString(36).slice(-8), // Placeholder password
        avatar: picture,
        role: "reader", // Default role for new Google users
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google authentication failed" });
  }
});

export default router;
