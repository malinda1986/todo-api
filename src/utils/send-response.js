export const HTTP_STATUS_CODES = {
  SUCCESS: {
    OK: 200, // Standard response for successful GET or PATCH requests
    CREATED: 201, // Used when a resource is successfully created (POST)
    NO_CONTENT: 204, // Used for successful DELETE requests with no body returned
  },
  ERROR: {
    BAD_REQUEST: 400, // Client error, e.g., validation errors
    NOT_FOUND: 404, // Resource not found
    INTERNAL_SERVER_ERROR: 500, // Generic server error
  },
};

export const sendResponse = (res, data, success = true, statusCode = 200) => {
  res.status(statusCode).json({
    success,
    data: success ? data : {}, // Include the payload if success,
    error: !success ? data.error || 'An error occurred' : null, // Include error message if present
  });
};
