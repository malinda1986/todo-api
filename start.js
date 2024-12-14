import 'reflect-metadata'; // Required for InversifyJS decorators
import express, { json } from 'express';
import convertToError from './src/adapters/outbound/logger/convert-to-error.js';
import webHandler from './src/web-handler.js';
import { container } from './src/di/inversify.config.js'; // Import container
import { CONFIG_UTIL } from './src/di/ioc.types.js';
// Get the logger from the container
const logger = container.get('Logger');
const configs = container.get(CONFIG_UTIL);
const app = express();

app.use(json());
app.use('/', webHandler);
const PORT = configs.get('WEB_HANDLER_PORT');

const start = async () => {
  await app.listen(configs.get('WEB_HANDLER_PORT'), () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

start()
  .then(() => logger.info({ message: '[start] Started successfully' }))
  .catch((error) => {
    logger.error(convertToError(error), { message: '[start] Failed to start' });
    process.exit(1);
  });

process
  .on('unhandledRejection', (reason, p) => {
    const error = new Error(`Unhandled Rejection at: ${p} reason: ${reason}`);
    logger.error(convertToError(error), { message: '[error] Unhandled Rejection', reason, p });
    process.exit(1);
  })
  .on('uncaughtException', (errorRaw) => {
    logger.error(convertToError(errorRaw), { message: '[error] Uncaught Exception' });
    process.exit(1);
  });
