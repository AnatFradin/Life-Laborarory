/**
 * PromptFileService - Service for loading and managing coach prompts from files
 * 
 * Handles loading prompts from JSON files (folder-based or single file), 
 * validation, caching, saving new prompts, and fallback to defaults
 */

import { readFile, writeFile, readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '../../../../data/coach-prompts');

class PromptFileService {
  constructor(promptFilePath = null, useFolderBased = true) {
    this.promptFilePath = promptFilePath || join(DATA_DIR, 'prompts.json');
    this.dataDir = promptFilePath ? dirname(promptFilePath) : DATA_DIR;
    this.prompts = null;
    this.lastLoadTime = null;
    this.watchEnabled = process.env.NODE_ENV !== 'production';
    this.useFolderBased = useFolderBased && !promptFilePath; // Only use folder-based if no specific file is provided
  }

  /**
   * Load prompts from folder-based structure or single file
   * @returns {Promise<Object>} Loaded prompts object
   */
  async loadPrompts() {
    try {
      // Try folder-based loading first
      if (this.useFolderBased) {
        const folderPrompts = await this.loadFromFolders();
        if (folderPrompts && Object.keys(folderPrompts.personas).length > 0) {
          this.prompts = folderPrompts;
          this.lastLoadTime = Date.now();
          console.log('[PromptFileService] Prompts loaded from folders successfully');
          return this.prompts;
        }
      }

      // Fall back to single file loading
      if (!existsSync(this.promptFilePath)) {
        console.log('[PromptFileService] Prompts file not found, using empty prompts');
        this.prompts = { version: '1.0.0', personas: {} };
        this.lastLoadTime = Date.now();
        return this.prompts;
      }

      const fileContent = await readFile(this.promptFilePath, 'utf-8');
      const promptData = JSON.parse(fileContent);

      // Validate schema
      const validation = this.validatePromptSchema(promptData);
      if (!validation.valid) {
        throw new Error(`Invalid prompt schema: ${validation.error}`);
      }

      this.prompts = promptData;
      this.lastLoadTime = Date.now();
      console.log('[PromptFileService] Prompts loaded from single file successfully');

      return this.prompts;
    } catch (error) {
      console.error('[PromptFileService] Error loading prompts:', error.message);
      // Return empty prompts on error to allow fallback to defaults
      this.prompts = { version: '1.0.0', personas: {} };
      this.lastLoadTime = Date.now();
      return this.prompts;
    }
  }

  /**
   * Load prompts from persona folders (stoic-coach/, compassionate-listener/, etc.)
   * Each folder can contain multiple .json files with individual prompts
   * @returns {Promise<Object>} Loaded prompts object
   */
  async loadFromFolders() {
    try {
      if (!existsSync(this.dataDir)) {
        return null;
      }

      const entries = await readdir(this.dataDir, { withFileTypes: true });
      const personas = {};

      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) {
          continue;
        }

        const personaId = entry.name;
        const personaDir = join(this.dataDir, personaId);
        const promptFiles = await readdir(personaDir);

        const prompts = [];
        for (const file of promptFiles) {
          if (!file.endsWith('.json')) {
            continue;
          }

          try {
            const filePath = join(personaDir, file);
            const fileContent = await readFile(filePath, 'utf-8');
            const promptData = JSON.parse(fileContent);

            // Support both single prompt and array of prompts
            if (Array.isArray(promptData)) {
              prompts.push(...promptData);
            } else if (promptData.id) {
              prompts.push(promptData);
            }
          } catch (err) {
            console.warn(`[PromptFileService] Error loading ${file} for ${personaId}:`, err.message);
          }
        }

        if (prompts.length > 0) {
          personas[personaId] = { prompts };
        }
      }

      return {
        version: '1.0.0',
        personas
      };
    } catch (error) {
      console.error('[PromptFileService] Error loading from folders:', error.message);
      return null;
    }
  }

  /**
   * Save a new prompt for a persona
   * @param {string} personaId - Persona identifier
   * @param {Object} promptData - Prompt data to save
   * @returns {Promise<Object>} Saved prompt with validation
   */
  async savePrompt(personaId, promptData) {
    try {
      // Validate prompt data
      const validation = this.validateSinglePrompt(promptData);
      if (!validation.valid) {
        throw new Error(`Invalid prompt data: ${validation.error}`);
      }

      // Create persona folder if it doesn't exist
      const personaDir = join(this.dataDir, personaId);
      if (!existsSync(personaDir)) {
        await mkdir(personaDir, { recursive: true });
      }

      // Generate filename from prompt ID
      const filename = `${promptData.id}.json`;
      const filePath = join(personaDir, filename);

      // Check if file already exists
      if (existsSync(filePath)) {
        throw new Error(`Prompt with ID "${promptData.id}" already exists`);
      }

      // Save the prompt
      await writeFile(filePath, JSON.stringify(promptData, null, 2), 'utf-8');
      console.log(`[PromptFileService] Saved prompt ${promptData.id} for ${personaId}`);

      // Reload prompts to update cache
      await this.reloadPrompts();

      return promptData;
    } catch (error) {
      console.error('[PromptFileService] Error saving prompt:', error.message);
      throw error;
    }
  }

  /**
   * Validate a single prompt object
   * @param {Object} prompt - Prompt to validate
   * @returns {Object} Validation result {valid: boolean, error: string}
   */
  validateSinglePrompt(prompt) {
    const requiredFields = ['id', 'title', 'description', 'tags', 'isDefault', 'systemPrompt'];
    for (const field of requiredFields) {
      if (prompt[field] === undefined) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    // Check ID format
    if (!/^[a-z0-9-]+$/.test(prompt.id)) {
      return { valid: false, error: `Invalid prompt ID format: ${prompt.id}. Use lowercase letters, numbers, and hyphens only.` };
    }

    // Check title
    if (typeof prompt.title !== 'string' || prompt.title.trim().length === 0) {
      return { valid: false, error: 'Title must be a non-empty string' };
    }

    // Check description
    if (typeof prompt.description !== 'string' || prompt.description.trim().length === 0) {
      return { valid: false, error: 'Description must be a non-empty string' };
    }

    // Check tags
    if (!Array.isArray(prompt.tags) || prompt.tags.length === 0) {
      return { valid: false, error: 'Tags must be a non-empty array' };
    }

    // Check isDefault
    if (typeof prompt.isDefault !== 'boolean') {
      return { valid: false, error: 'isDefault must be a boolean' };
    }

    // Check systemPrompt
    if (typeof prompt.systemPrompt !== 'string' || prompt.systemPrompt.length < 50) {
      return { valid: false, error: 'System prompt must be at least 50 characters long' };
    }

    return { valid: true };
  }

  /**
   * Reload prompts from file (useful for dev mode)
   * @returns {Promise<Object>} Reloaded prompts object
   */
  async reloadPrompts() {
    console.log('[PromptFileService] Reloading prompts...');
    return await this.loadPrompts();
  }

  /**
   * Get all prompts for a specific persona
   * @param {string} personaId - Persona identifier
   * @returns {Array} Array of prompt objects
   */
  getPromptsForPersona(personaId) {
    if (!this.prompts) {
      throw new Error('Prompts not loaded. Call loadPrompts() first.');
    }

    const personaPrompts = this.prompts.personas[personaId];
    if (!personaPrompts || !personaPrompts.prompts) {
      return [];
    }

    return personaPrompts.prompts;
  }

  /**
   * Get a specific prompt by ID for a persona
   * @param {string} personaId - Persona identifier
   * @param {string} promptId - Prompt identifier
   * @returns {Object|null} Prompt object or null if not found
   */
  getPromptById(personaId, promptId) {
    const prompts = this.getPromptsForPersona(personaId);
    return prompts.find(p => p.id === promptId) || null;
  }

  /**
   * Get the default prompt for a persona
   * @param {string} personaId - Persona identifier
   * @returns {Object|null} Default prompt object or null if not found
   */
  getDefaultPromptForPersona(personaId) {
    const prompts = this.getPromptsForPersona(personaId);
    return prompts.find(p => p.isDefault === true) || prompts[0] || null;
  }

  /**
   * Validate prompt schema
   * @param {Object} promptData - Prompt data to validate
   * @returns {Object} Validation result {valid: boolean, error: string}
   */
  validatePromptSchema(promptData) {
    // Check required top-level fields
    if (!promptData.version || typeof promptData.version !== 'string') {
      return { valid: false, error: 'Missing or invalid version field' };
    }

    if (!promptData.personas || typeof promptData.personas !== 'object') {
      return { valid: false, error: 'Missing or invalid personas field' };
    }

    // Validate each persona
    for (const [personaId, personaData] of Object.entries(promptData.personas)) {
      // Check persona ID format
      if (!/^[a-z0-9-]+$/.test(personaId)) {
        return { valid: false, error: `Invalid persona ID format: ${personaId}` };
      }

      // Check prompts array
      if (!personaData.prompts || !Array.isArray(personaData.prompts)) {
        return { valid: false, error: `Persona ${personaId} missing prompts array` };
      }

      if (personaData.prompts.length === 0) {
        return { valid: false, error: `Persona ${personaId} has no prompts` };
      }

      // Validate each prompt
      const promptIds = new Set();
      let hasDefault = false;

      for (const prompt of personaData.prompts) {
        // Check required fields
        const requiredFields = ['id', 'title', 'description', 'tags', 'isDefault', 'systemPrompt'];
        for (const field of requiredFields) {
          if (prompt[field] === undefined) {
            return { valid: false, error: `Prompt missing required field: ${field}` };
          }
        }

        // Check ID uniqueness
        if (promptIds.has(prompt.id)) {
          return { valid: false, error: `Duplicate prompt ID: ${prompt.id} in persona ${personaId}` };
        }
        promptIds.add(prompt.id);

        // Check ID format
        if (!/^[a-z0-9-]+$/.test(prompt.id)) {
          return { valid: false, error: `Invalid prompt ID format: ${prompt.id}` };
        }

        // Check tags
        if (!Array.isArray(prompt.tags) || prompt.tags.length === 0) {
          return { valid: false, error: `Prompt ${prompt.id} has invalid or empty tags` };
        }

        // Check for default
        if (prompt.isDefault === true) {
          if (hasDefault) {
            return { valid: false, error: `Multiple default prompts in persona ${personaId}` };
          }
          hasDefault = true;
        }

        // Check systemPrompt length
        if (typeof prompt.systemPrompt !== 'string' || prompt.systemPrompt.length < 50) {
          return { valid: false, error: `Prompt ${prompt.id} has invalid or too short systemPrompt` };
        }
      }

      // Ensure at least one default
      if (!hasDefault) {
        return { valid: false, error: `Persona ${personaId} has no default prompt` };
      }
    }

    return { valid: true };
  }

  /**
   * Merge file prompts with hardcoded defaults (for backward compatibility)
   * @param {Object} filePrompts - Prompts loaded from file
   * @param {Object} defaultPrompts - Hardcoded default prompts
   * @returns {Object} Merged prompts object
   */
  mergeWithDefaults(filePrompts, defaultPrompts = {}) {
    const merged = {
      version: filePrompts.version,
      personas: { ...filePrompts.personas }
    };

    // Add any default personas that aren't in the file
    for (const [personaId, defaultData] of Object.entries(defaultPrompts)) {
      if (!merged.personas[personaId]) {
        merged.personas[personaId] = defaultData;
      }
    }

    return merged;
  }
}

export default PromptFileService;
