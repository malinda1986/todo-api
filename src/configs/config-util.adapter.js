import dotEnv from 'dotenv';
dotEnv.config();
import { z } from 'zod';

export const CONFIG_UTIL = Symbol.for('CONFIG_UTIL');

const DEFAULT_WEB_HANDLER_PORT = 3008;

export const ConfigurationSchema = z.object({
  APP_ENV: z.string().default('local'),
  API_VERSION: z.string().default('v1'),

  /**
   * AWS Configurations
   */
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET_NAME: z.string().optional(),

  /**
   * Web Handler Configurations
   */
  WEB_HANDLER_PORT: z.preprocess(Number, z.number()).default(DEFAULT_WEB_HANDLER_PORT),

  /**
   * Rate limit for external api (user api)
   */
  RATE_LIMIT_EXTERNAL_API: z.preprocess(Number, z.number()).default(5),
});

export class ConfigError extends Error {
  constructor(cause) {
    super('[ConfigUtil: ConfigError]', cause);
  }
}

export class ConfigUtilAdapter {
  configs;
  constructor() {
    const configRaw = Object.keys(ConfigurationSchema.shape).reduce((acc, key) => {
      acc[key] = process.env[key];
      return acc;
    }, {});
    try {
      this.configs = ConfigurationSchema.parse(configRaw);
    } catch (errorRaw) {
      console.log(errorRaw);
      const error = errorRaw; // todo - format the error more readable way
      throw new ConfigError(error);
    }
  }

  get(key) {
    return this.configs[key];
  }
}
