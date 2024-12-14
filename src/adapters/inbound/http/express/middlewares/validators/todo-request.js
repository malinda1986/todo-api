import { ZodError } from 'zod';

/**
 * Middleware to validate request data against a given Zod schema
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateRequest = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // Parse and validate the request body
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors }); // Return validation errors
    } else {
      next(error); // Pass other errors to the error handler
    }
  }
};

/**
 * Middleware to validate path parameters for todo routes
 * @returns {Function} Express middleware function
 */
export const validateTodoId = (schema) => (req, res, next) => {
  try {
    req.params = schema.parse(req.params); // Parse and validate `req.params`
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors }); // Return validation errors
    } else {
      next(error); // Pass other errors to the error handler
    }
  }
};
