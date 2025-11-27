/**
 * Validation middleware using Zod for request validation
 * 
 * Validates request body, query parameters, and uploaded files
 */

/**
 * Creates validation middleware for request body
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.issues = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return next(error);
    }

    // Replace body with validated and transformed data
    req.body = result.data;
    next();
  };
};

/**
 * Creates validation middleware for query parameters
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const error = new Error('Invalid query parameters');
      error.statusCode = 400;
      error.issues = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return next(error);
    }

    // Replace query with validated and transformed data
    req.query = result.data;
    next();
  };
};

/**
 * Validates uploaded image files
 * - MIME type: jpeg, png, gif, webp
 * - Max size: 10MB
 * @returns {import('express').RequestHandler}
 */
export const validateImageUpload = (req, res, next) => {
  if (!req.file) {
    const error = new Error('No image file provided');
    error.statusCode = 400;
    return next(error);
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  // Check MIME type
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    const error = new Error(
      'Invalid image format. Please upload JPEG, PNG, GIF, or WebP images.'
    );
    error.statusCode = 400;
    return next(error);
  }

  // Check file size
  if (req.file.size > maxSizeBytes) {
    const error = new Error('Image file is too large (maximum 10MB)');
    error.statusCode = 413;
    error.code = 'LIMIT_FILE_SIZE';
    return next(error);
  }

  next();
};
