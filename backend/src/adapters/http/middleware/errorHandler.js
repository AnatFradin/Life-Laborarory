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
    userMessage = 'The local AI assistant isn\'t available right now.';
    suggestions = [
      'Check if Ollama is running on your computer',
      'Try starting Ollama with: ollama serve',
      'You can still write reflections without AI feedback',
    ];
  }
  // Ollama model not found
  else if (err.message?.includes('model') && err.message?.includes('not found')) {
    statusCode = 404;
    userMessage = 'The AI model you selected isn\'t available.';
    suggestions = [
      'Try pulling the model: ollama pull llama2',
      'Check available models: ollama list',
      'You can change models in Settings',
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
    userMessage = 'We couldn\'t access the storage location.';
    suggestions = [
      'Check file permissions in your data directory',
      'Your reflections are still safe',
    ];
  }
  // Data corruption (FR-029)
  else if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    statusCode = 500;
    userMessage = 'Some stored data couldn\'t be read properly.';
    suggestions = [
      'Your other reflections are safe',
      'Export your data to create a backup',
      'The problematic file will be skipped',
    ];
  }
  // Validation errors (Zod or custom)
  else if (err.name === 'ZodError' || err.statusCode === 400) {
    statusCode = 400;
    userMessage = 'Some information wasn\'t quite right.';
    suggestions = [
      err.issues ? err.issues[0]?.message : 'Please check your input and try again',
    ];
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
    userMessage = 'We couldn\'t find what you were looking for.';
    suggestions = ['It may have been deleted', 'Check the History view for your reflections'];
  }
  // Online AI provider errors
  else if (err.message?.includes('OpenAI') || err.message?.includes('Anthropic')) {
    statusCode = 503;
    userMessage = 'The online AI service isn\'t responding right now.';
    suggestions = [
      'Check your internet connection',
      'Verify your API key in Settings',
      'Switch to local AI for complete privacy',
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
