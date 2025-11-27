import fs from 'fs/promises';
import path from 'path';
import { validateUserPreferences, DEFAULT_PREFERENCES, mergeWithDefaults } from '../../domain/entities/UserPreferences.js';

/**
 * LocalPreferencesRepository - Manages user preferences in local JSON file
 * 
 * Per User Story 4 (T074):
 * - Store/retrieve preferences from data/preferences.json
 * - Atomic writes using temp file + rename pattern
 * - Validates preferences against UserPreferences schema
 * - Returns default preferences if file doesn't exist
 */
export class LocalPreferencesRepository {
  constructor(preferencesFilePath) {
    this.filePath = preferencesFilePath;
  }

  /**
   * Get user preferences
   * @returns {Promise<Object>} Validated user preferences
   */
  async getPreferences() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      
      // Merge with defaults in case new fields were added
      return mergeWithDefaults(parsed);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return and save defaults
        await this.savePreferences(DEFAULT_PREFERENCES);
        return { ...DEFAULT_PREFERENCES };
      }
      throw new Error(`Failed to read preferences: ${error.message}`);
    }
  }

  /**
   * Save user preferences
   * @param {Object} preferences - Preferences to save
   * @returns {Promise<Object>} Saved preferences
   */
  async savePreferences(preferences) {
    // Validate before saving
    const validated = validateUserPreferences(preferences);

    // Ensure directory exists
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });

    // Atomic write: write to temp file, then rename
    const tempPath = `${this.filePath}.tmp`;
    
    try {
      await fs.writeFile(
        tempPath,
        JSON.stringify(validated, null, 2),
        'utf-8'
      );
      
      await fs.rename(tempPath, this.filePath);
      
      return validated;
    } catch (error) {
      // Clean up temp file if it exists
      try {
        await fs.unlink(tempPath);
      } catch {
        // Ignore cleanup errors
      }
      throw new Error(`Failed to save preferences: ${error.message}`);
    }
  }

  /**
   * Update specific preference fields
   * @param {Object} partial - Partial preferences to update
   * @returns {Promise<Object>} Updated preferences
   */
  async updatePreferences(partial) {
    const current = await this.getPreferences();
    const updated = { ...current, ...partial };
    return await this.savePreferences(updated);
  }

  /**
   * Reset preferences to defaults
   * @returns {Promise<Object>} Default preferences
   */
  async resetPreferences() {
    return await this.savePreferences(DEFAULT_PREFERENCES);
  }
}
