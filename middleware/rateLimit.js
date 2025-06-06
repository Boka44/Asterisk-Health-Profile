const rateLimit = require('express-rate-limit')

// TODO: Implement proper rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
})

const profileLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 profile updates per hour
  message: 'Too many profile updates, please try again later'
})

const healthConditionLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 20, // 20 health condition updates per day
  message: 'Too many health condition updates, please try again later'
})

module.exports = {
  limiter,
  profileLimiter,
  healthConditionLimiter
} 