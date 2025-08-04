const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

class RedisService {
  // Simple token blacklisting
  async blacklistToken(tokenId, expiresIn) {
    const key = `blacklist:${tokenId}`;
    await redis.setex(key, Math.ceil(expiresIn / 1000), 'blacklisted');
  }

  async isTokenBlacklisted(tokenId) {
    const result = await redis.get(`blacklist:${tokenId}`);
    return result === 'blacklisted';
  }
}

module.exports = new RedisService();
