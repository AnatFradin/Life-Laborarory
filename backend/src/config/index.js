import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  // Server configuration
  port: process.env.PORT || 3000,

  // Data directory path (default: repository root/data/)
  dataDir: process.env.DATA_DIR || path.resolve(__dirname, '../../../data'),

  // Ollama configuration
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',

  // Online AI providers configuration (User Story 4)
  openaiApiKey: process.env.OPENAI_API_KEY || null,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || null,

  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',

  // Storage configuration
  reflectionsDir: function () {
    return path.join(this.dataDir, 'reflections');
  },
  visualsDir: function () {
    return path.join(this.dataDir, 'visuals');
  },
  exportsDir: function () {
    return path.join(this.dataDir, 'exports');
  },
  preferencesFile: function () {
    return path.join(this.dataDir, 'preferences.json');
  },
};

/**
 * Validate configuration on startup (T104)
 * Ensures critical paths exist or can be created
 */
export function validateConfig() {
  const errors = [];

  // Validate DATA_DIR is accessible
  try {
    // Try to create data directory if it doesn't exist (handles race condition with try-catch)
    try {
      fs.mkdirSync(config.dataDir, { recursive: true });
    } catch (err) {
      // Directory might already exist, check if it's accessible
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
    
    // Check if we can write to the data directory
    fs.accessSync(config.dataDir, fs.constants.W_OK | fs.constants.R_OK);
  } catch (err) {
    errors.push(`DATA_DIR (${config.dataDir}) is not accessible or writable: ${err.message}`);
  }

  // Validate OLLAMA_URL format (should be valid URL)
  try {
    new URL(config.ollamaUrl);
  } catch (err) {
    errors.push(`OLLAMA_URL (${config.ollamaUrl}) is not a valid URL: ${err.message}`);
  }

  // Validate port is a number in valid range
  const port = Number(config.port);
  if (isNaN(port) || port < 1 || port > 65535) {
    errors.push(`PORT (${config.port}) must be a number between 1 and 65535`);
  }

  if (errors.length > 0) {
    console.error('[Config] Validation errors:');
    errors.forEach(err => console.error(`  - ${err}`));
    throw new Error('Configuration validation failed. Please check the errors above.');
  }

  console.log('[Config] Validation passed ✓');
  console.log(`[Config] Data directory: ${config.dataDir}`);
  console.log(`[Config] Ollama URL: ${config.ollamaUrl}`);
  console.log(`[Config] Server port: ${config.port}`);
}

export default config;
