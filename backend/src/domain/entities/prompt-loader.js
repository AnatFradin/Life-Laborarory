import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROMPTS_DIR = join(__dirname, 'persona-prompts');

/**
 * Load a persona's system prompt from a file
 * @param {string} personaId - The persona ID
 * @returns {Promise<string|null>} The prompt content or null if file doesn't exist
 */
export async function loadPromptFromFile(personaId) {
  try {
    const promptPath = join(PROMPTS_DIR, `${personaId}.txt`);
    const content = await readFile(promptPath, 'utf-8');
    return content.trim();
  } catch (error) {
    // File doesn't exist or can't be read - this is okay, we'll use the inline prompt
    return null;
  }
}

/**
 * Load prompt for a persona - tries file first, then falls back to inline prompt
 * @param {string} personaId - The persona ID
 * @param {string} inlinePrompt - The fallback inline prompt
 * @returns {Promise<string>} The prompt content
 */
export async function getPersonaPrompt(personaId, inlinePrompt) {
  const filePrompt = await loadPromptFromFile(personaId);
  return filePrompt || inlinePrompt;
}
