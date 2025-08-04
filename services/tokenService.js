const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redisService = require('./redisService');

class TokenService {
  generateToken(userId) {
    const tokenId = crypto.randomBytes(16).toString('hex');
    
    const token = jwt.sign(
      { 
        userId, 
        tokenId,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token, tokenId };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check blacklist
      const isBlacklisted = await redisService.isTokenBlacklisted(decoded.tokenId);
      if (isBlacklisted) {
        throw new Error('Token has been revoked');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async blacklistToken(tokenId, expiresAt) {
    const expiresIn = (expiresAt * 1000) - Date.now();
    if (expiresIn > 0) {
      await redisService.blacklistToken(tokenId, expiresIn);
    }
  }
}

module.exports = new TokenService();
