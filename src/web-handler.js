import { Router } from 'express';
import todoRoutes from './adapters/inbound/http/express/routes/todo-route/index.js';
import userRoutes from './adapters/inbound/http/express/routes/users/index.js';
import { container } from './di/inversify.config.js'; // Import container
import { CONFIG_UTIL } from './di/ioc.types.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./src/docs/swagger.yaml'); // Load the YAML file

const router = Router();
const configs = container.get(CONFIG_UTIL);
const API_VERSION = configs.get('API_VERSION');

router.get('/health', (_req, res) => {
  return res.send('Healthy todo api');
});

// Swagger setup
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use(`/api/${API_VERSION}/todos`, todoRoutes);
router.use(`/api/${API_VERSION}/users`, userRoutes);

export default router;
