const express = require('express');
const jwt = require('jsonwebtoken');
const USERS = require('./Users'); // ऊपर वाली file का path

const router = express.Router();

// Secret key for JWT (real app में .env में रखो)
const jwt_secret = process.env.JWT_SECRET; // change this!

// POST /api/login
router.post('/login-user', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  // Hardcoded users में से match करो
  const user = USERS.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  // JWT token generate करो
  const token = jwt.sign(
    { email: user.email, type: user.type },
    jwt_secret,
    { expiresIn: '1h' } 
  );

  // Frontend को response भेजो
  res.json({
    success: true,
    message: "Login successful",
    token,
    user: {
      email: user.email,
      type: user.type
    }
  });
});

module.exports = router;