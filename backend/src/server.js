import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import errorHandler from './adapters/http/middleware/errorHandler.js';

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

// API routes will be mounted here
// app.use('/api/reflections', reflectionsRouter);
// app.use('/api/ai', aiRouter);
// app.use('/api/export', exportRouter);
// app.use('/api/preferences', preferencesRouter);

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🌱 Laboratory of Life backend running on http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${config.dataDir}`);
  console.log(`🤖 Ollama URL: ${config.ollamaUrl}`);
});

export default app;
