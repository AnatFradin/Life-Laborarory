import path from 'path';
import { fileURLToPath } from 'url';

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
 * Validate configuration at startup (T104)
 * Ensures critical environment variables are properly set
 */
export function validateConfig() {
  const warnings = [];
  const errors = [];

  // Validate DATA_DIR
  if (!config.dataDir) {
    errors.push('DATA_DIR is not set. Application cannot store reflections.');
  }

  // Validate OLLAMA_URL format
  if (!config.ollamaUrl) {
    warnings.push('OLLAMA_URL is not set. Defaulting to http://localhost:11434');
  } else if (!config.ollamaUrl.startsWith('http://') && !config.ollamaUrl.startsWith('https://')) {
    errors.push(`OLLAMA_URL must start with http:// or https://. Got: ${config.ollamaUrl}`);
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('[Config] Warnings:');
    warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }

  // Throw errors if critical config is missing
  if (errors.length > 0) {
    console.error('[Config] Critical errors:');
    errors.forEach((error) => console.error(`  - ${error}`));
    throw new Error('Configuration validation failed. Please check environment variables.');
  }

  // Log successful validation
  console.log('[Config] Configuration validated successfully');
  console.log(`  - Data directory: ${config.dataDir}`);
  console.log(`  - Ollama URL: ${config.ollamaUrl}`);
  console.log(`  - Environment: ${config.nodeEnv}`);
}

export default config;
