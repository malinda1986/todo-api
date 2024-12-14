import rateLimit from 'express-rate-limit';
import { container } from '../../../../../../di/inversify.config.js';
import { CONFIG_UTIL } from '../../../../../../di/ioc.types.js';

const configs = container.get(CONFIG_UTIL);
const API_VERSION = configs.get('RATE_LIMIT_EXTERNAL_API');

// Define the rate limiter
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: API_VERSION, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
});

export default apiRateLimiter;
