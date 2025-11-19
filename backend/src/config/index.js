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

export default config;
