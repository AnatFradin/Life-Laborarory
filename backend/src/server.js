import express from 'express';
import cors from 'cors';
import config, { validateConfig } from './config/index.js';
import errorHandler from './adapters/http/middleware/errorHandler.js';

// Validate configuration at startup (T104)
validateConfig();

const app = express();

// CORS configuration for frontend (Vite dev server on localhost:5173)
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// JSON body parser
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import routes
import reflectionsRouter from './adapters/http/routes/reflections.js';
import aiRouter from './adapters/http/routes/ai.js';
import createExportRouter from './adapters/http/routes/export.js';
import preferencesRouter from './adapters/http/routes/preferences.js';
import personasRouter from './adapters/http/routes/personas.js';
import visualsRouter from './adapters/http/routes/visuals.js';
import storageRouter from './adapters/http/routes/storage.js';

// API routes
app.use('/api/reflections', reflectionsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/export', createExportRouter());
app.use('/api/preferences', preferencesRouter);
app.use('/api/personas', personasRouter);
app.use('/api/visuals', visualsRouter);
app.use('/api/storage', storageRouter);

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server only if this file is run directly (not imported for testing)
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`🌱 Laboratory of Life backend running on http://localhost:${PORT}`);
    console.log(`📁 Data directory: ${config.dataDir}`);
    console.log(`🤖 Ollama URL: ${config.ollamaUrl}`);
  });
}

export default app;
