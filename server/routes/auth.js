import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import { protect } from "../middleware/auth.js";

const router = Router();

// GET /authors - list all authors and admins
router.get("/authors", async (req, res) => {
  try {
    const authors = await User.find({ role: { $in: ["author", "admin"] } })
      .select("username avatar bio role");
    
    // Map backend to frontend expectations
    const mapped = authors.map(a => ({
      name: a.username,
      image: a.avatar,
      bio: a.bio,
      role: a.role
    }));
    
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// PUT /me - update current user profile (protected route)
router.put("/me", protect, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Server error during profile update." });
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
