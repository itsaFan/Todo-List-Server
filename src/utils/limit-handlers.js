const cache = require("memory-cache");

const FAILED_ATTEMPTS_LIMIT = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

const handleFailedAttempt = (res, cacheKey, message) => {
  const currentAttempts = cache.get(cacheKey) || 0;

  if (currentAttempts >= FAILED_ATTEMPTS_LIMIT - 1) {
    cache.put(cacheKey, currentAttempts + 1, LOCKOUT_DURATION);
    return res.status(429).json({ message: "You have been locked out because this account has attempted to login too many times. Please try again in 15 minutes." });
  } else {
    cache.put(cacheKey, currentAttempts + 1);
    return res.status(404).json({ message });
  }
};

module.exports = {
  handleFailedAttempt,
  FAILED_ATTEMPTS_LIMIT,
};
