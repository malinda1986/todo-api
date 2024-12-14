import express from 'express';
import { container } from '../../../../../../di/inversify.config.js';
import { USER_CONTROLLER } from '../../../../../../di/ioc.types.js';
import apiRateLimiter from '../../middlewares/rate-limit/rate-limiter.js';

const router = express.Router();
const userController = container.get(USER_CONTROLLER);

router.get('/', apiRateLimiter, (req, res) => userController.list(req, res));

export default router;
