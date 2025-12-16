/**
 * Error handler middleware with gentle, solution-focused messages per FR-028
 * 
 * Handles:
 * - Ollama unavailable (FR-030)
 * - Low storage (FR-031)
 * - Corrupted data (FR-029)
 * - Validation errors
 * - General errors
 */

const errorHandler = (err, req, res, next) => {
  // Log error for debugging (not exposed to user)
  console.error('[Error]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let userMessage = 'Something unexpected happened. Your data is safe.';
  let suggestions = [];

  // Ollama unavailable (FR-030)
  if (err.code === 'ECONNREFUSED' && err.message.includes('11434')) {
    statusCode = 503;
    userMessage = 'The local AI isn\'t available right now.';
    suggestions = [
      'Make sure Ollama is running on your computer',
      'You can still write reflections without AI feedback',
      'Need help? Check the user guide for setup instructions',
    ];
  }
  // Ollama model not found
  else if (err.message?.includes('model') && err.message?.includes('not found')) {
    statusCode = 404;
    userMessage = 'The AI model you chose isn\'t installed yet.';
    suggestions = [
      'You can change models in Settings',
      'Need a different model? Check the user guide for installation',
      'You can still write reflections without AI feedback',
    ];
  }
  // Storage/file system errors (FR-031, FR-029)
  else if (err.code === 'ENOSPC') {
    statusCode = 507;
    userMessage = 'Your device is running low on storage space.';
    suggestions = [
      'Free up some space on your device',
      'Export your reflections to keep them safe',
      'Consider deleting older reflections you no longer need',
    ];
  } else if (err.code === 'EACCES' || err.code === 'EPERM') {
    statusCode = 500;
    userMessage = 'We couldn\'t access your data folder.';
    suggestions = [
      'Your reflections are still safe',
      'Try restarting the application',
      'If this persists, check folder permissions',
    ];
  }
  // Malformed JSON in request (different from file corruption)
  else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    userMessage = 'Something went wrong with your request.';
    suggestions = ['Please try again', 'If this keeps happening, try refreshing the page'];
  }
  // Data corruption (FR-029, FR-032)
  else if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    statusCode = 500;
    userMessage = 'Some stored data couldn\'t be read properly.';
    suggestions = [
      'Your other reflections are safe',
      'Export your data to create a backup',
      'The problematic file will be skipped',
    ];
  }
  // Data validation errors from corrupted files
  else if (err.code === 'DATA_CORRUPTION' || err.message?.includes('corrupted')) {
    statusCode = 500;
    userMessage = 'We found a file that couldn\'t be read.';
    suggestions = [
      'Your other reflections are still accessible',
      'Consider exporting your data as a backup',
      'The damaged file will be skipped automatically',
    ];
  }
  // Validation errors (Zod or custom)
  else if (err.name === 'ZodError' || err.statusCode === 400) {
    statusCode = 400;
    
    // For Zod errors, extract the validation issues
    if (err.name === 'ZodError' && err.issues) {
      // Return validation errors in a more usable format
      return res.status(400).json({
        error: JSON.stringify(err.issues, null, 2),
        validationErrors: err.issues,
      });
    }
    
    // Use custom message if provided, otherwise use default
    userMessage = err.message || 'Some information wasn\'t quite right.';
    suggestions = ['Please check your input and try again'];
  }
  // File size errors
  else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    userMessage = 'The file you\'re uploading is too large.';
    suggestions = [
      'Try a smaller image (maximum 10MB)',
      'You can compress the image before uploading',
    ];
  }
  // Not found errors
  else if (err.statusCode === 404) {
    statusCode = 404;
    // Use custom message if provided, otherwise use default
    userMessage = err.message || 'We couldn\'t find what you were looking for.';
    suggestions = ['It may have been deleted', 'Check the History view for your reflections'];
  }
  // Online AI provider errors
  else if (err.message?.includes('OpenAI') || err.message?.includes('Anthropic')) {
    statusCode = 503;
    userMessage = 'The online AI service isn\'t responding.';
    suggestions = [
      'Check your internet connection',
      'You can switch to local AI in Settings',
      'Try again in a few moments',
    ];
  }

  // Build gentle error response
  const response = {
    error: true,
    message: userMessage,
    suggestions,
  };

  // Include validation details in development mode
  if (process.env.NODE_ENV === 'development' && err.issues) {
    response.validationErrors = err.issues;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
