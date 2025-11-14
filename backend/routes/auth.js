// routes/auth.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// email verification removed: no crypto/nodemailer required
require("dotenv").config();

// Register (students only)
router.post("/register", async (req, res) => {
  const { fullname, email, phone, password } = req.body;
  if (!fullname || !email || !phone || !password) return res.status(400).json({ error: "Missing fields" });

  // ensure institutional email
  if (!email.endsWith("@paterostechnologicalcollege.edu.ph")) {
    return res.status(400).json({ error: "Use institutional email" });
  }

  try {
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (fullname, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [fullname, email, phone, hashed, "student"]
    );

    res.json({ message: "Registration successful. You can now log in.", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Login (student & admin)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

  try {
    const [rows] = await pool.query("SELECT id, fullname, email, password, role, avatar FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(400).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    // return safe user object
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role, avatar: user.avatar ? `/uploads/${user.avatar}` : null },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
