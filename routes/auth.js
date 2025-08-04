const express = require('express');
const passport = require('passport');
const { googleAuthSuccess, getProfile, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failure' }),
  googleAuthSuccess
);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.post('/logout', verifyToken, logout);

// Test route
router.get('/verify', verifyToken, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Token is valid',
    userId: req.user.userId
  });
});

module.exports = router;
