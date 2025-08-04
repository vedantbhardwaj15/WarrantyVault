const User = require("../models/User");
const tokenService = require("../services/tokenService");

// Google OAuth success
const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    // Generate token
    const { token } = tokenService.generateToken(req.user._id);
    const redirectUrl = `${process.env.CLIENT_URL}/login/callback?token=${encodeURIComponent(token)}`;
    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
    // res.json({
    //   success: true,
    //   message: 'Login successful',
    //   user: {
    //     id: req.user._id,
    //     name: req.user.name,
    //     email: req.user.email,
    //     avatar: req.user.avatar
    //   },
    //   token
    // });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-googleId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Secure logout with blacklisting
const logout = async (req, res) => {
  try {
    const token = req.get("Authorization")?.split(" ")[1];

    if (token) {
      const decoded = await tokenService.verifyToken(token);
      await tokenService.blacklistToken(decoded.tokenId, decoded.exp);
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    // Even if verification fails, consider logout successful
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  }
};

module.exports = {
  googleAuthSuccess,
  getProfile,
  logout,
};
