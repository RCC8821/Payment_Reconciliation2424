

const express = require('express');
const jwt = require('jsonwebtoken');
const { sheets, SPREADSHEET_ID_OFFICE_EXPENSES } = require('../config/googleSheet');

const router = express.Router();

// Allowed user types - हमेशा UPPERCASE में रखो (spaces replace करके)
const ALLOWED_USER_TYPES = [
  'ADMIN',
  'PAYMENT',
  'ABBOTT',
  'RANA',
  'RNTU',
  'SCOPE',
  'NEWSCOPE',
  'GUPTA_JI_C',
  'GUPTA_JI_B',
  'GUPTA_JI_D',
  'Scope_Adjusting'
];

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email और password जरूरी हैं' });
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId:SPREADSHEET_ID_OFFICE_EXPENSES,
      range: 'Users!A:D',          // ← अब A:D ले रहे हैं (D = Name)
    });

    const rows = response.data.values || [];

    if (rows.length <= 1) {
      return res.status(400).json({ error: 'कोई user नहीं मिला' });
    }

    // Case-insensitive email + exact password match
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const userRow = rows.slice(1).find(
      (row) =>
        row[0]?.trim().toLowerCase() === normalizedEmail &&
        row[1]?.trim() === normalizedPassword
    );

    if (!userRow) {
      return res.status(401).json({ error: 'गलत email या password' });
    }

    // Extract values
    const userTypeRaw = (userRow[2] || '').trim();
    const name = (userRow[3] || 'Unknown').trim();  // ← Name column D से

    // UserType normalize: uppercase + spaces हटाकर एक साथ
    let userType = userTypeRaw.toUpperCase().replace(/\s+/g, '');

    // Allowed check
    if (!ALLOWED_USER_TYPES.includes(userType)) {
      // Fallback: original value से भी check (कुछ spaces वाले cases के लिए)
      const originalUserType = userTypeRaw;
      console.log('Original userType from sheet:', originalUserType);

      const normalizedOriginal = originalUserType.toUpperCase().replace(/\s+/g, '');

      if (!ALLOWED_USER_TYPES.some(allowed => 
        allowed.replace(/\s+/g, '') === normalizedOriginal
      )) {
        return res.status(403).json({ error: 'इस user type की अनुमति नहीं है' });
      }

      userType = normalizedOriginal; // normalized version use करो आगे
    }

    // JWT Token - अब name भी include
    const token = jwt.sign(
      { 
        email: normalizedEmail, 
        userType,
        name                      // ← name token में add
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Response में name भी भेज रहे हैं (frontend sessionStorage के लिए)
    res.json({
      success: true,
      token,
      userType,
      name,                        // ← यहाँ name return हो रहा है
      message: 'Login सफल!'
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error. बाद में कोशिश करें।' });
  }
});

// Middleware: JWT Verify (अब req.user में name भी उपलब्ध होगा)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token नहीं मिला' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session expire हो गया' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;   // अब req.user.name भी है
    next();
  });
}

// Example protected route (name भी दिखा सकते हो)
router.get('/user', authenticateToken, (req, res) => {
  res.json({
    email: req.user.email,
    userType: req.user.userType,
    name: req.user.name || 'Unknown'   // ← name भी return
  });
});

module.exports = router;