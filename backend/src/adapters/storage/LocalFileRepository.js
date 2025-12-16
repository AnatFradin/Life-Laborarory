import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import config from '../../config/index.js';

/**
 * LocalFileRepository - Implements IReflectionRepository
 * 
 * Storage strategy:
 * - Month-based organization: data/reflections/YYYY-MM/
 * - Atomic writes: temp file + rename pattern
 * - JSON format for human-readability
 * 
 * Performance considerations:
 * - Handles 1000+ reflections without degradation (FR-035)
 * - Month-based organization enables efficient pagination
 */

class LocalFileRepository {
  constructor(reflectionsDir = null) {
    this.reflectionsDir = reflectionsDir || config.reflectionsDir();
  }

  /**
   * Ensures directory exists, creates if needed
   * @param {string} dirPath - Directory path
   */
  async _ensureDir(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Gets month-based directory path for a timestamp
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Path to month directory
   */
  _getMonthDir(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return path.join(this.reflectionsDir, `${year}-${month}`);
  }

  /**
   * Atomic write using temp file + rename pattern
   * @param {string} filePath - Target file path
   * @param {string} data - Data to write
   */
  async _atomicWrite(filePath, data) {
    const tempPath = `${filePath}.tmp`;
    await fs.writeFile(tempPath, data, 'utf8');
    await fs.rename(tempPath, filePath);
  }

  /**
   * Save a reflection (create or update)
   * @param {Object} reflection - Reflection entity
   * @returns {Promise<Object>} Saved reflection
   */
  async save(reflection) {
    // Ensure ID exists
    if (!reflection.id) {
      reflection.id = randomUUID();
    }

    // Ensure timestamp exists
    if (!reflection.timestamp) {
      reflection.timestamp = new Date().toISOString();
    }

    const monthDir = this._getMonthDir(reflection.timestamp);
    await this._ensureDir(monthDir);

    const filePath = path.join(monthDir, `${reflection.id}.json`);
    const data = JSON.stringify(reflection, null, 2);

    await this._atomicWrite(filePath, data);

    return reflection;
  }

  /**
   * Find reflection by ID
   * @param {string} id - Reflection ID
   * @returns {Promise<Object|null>} Reflection or null if not found
   */
  async findById(id) {
    try {
      // Search all month directories in parallel
      const monthDirs = await this._getAllMonthDirs();

      // Try reading from all directories in parallel
      const results = await Promise.allSettled(
        monthDirs.map(async (monthDir) => {
          const filePath = path.join(monthDir, `${id}.json`);
          const data = await fs.readFile(filePath, 'utf8');
          return JSON.parse(data);
        })
      );

      // Find the first successful result
      for (const result of results) {
        if (result.status === 'fulfilled') {
          return result.value;
        }
      }

      return null;
    } catch (err) {
      console.error(`Error finding reflection ${id}:`, err);
      throw err;
    }
  }

  /**
   * Find all reflections (sorted by timestamp desc)
   * @returns {Promise<Array>} Array of reflections
   */
  async findAll() {
    try {
      await this._ensureDir(this.reflectionsDir);

      const monthDirs = await this._getAllMonthDirs();

      // Process all month directories in parallel
      const monthResults = await Promise.all(
        monthDirs.map(async (monthDir) => {
          const files = await fs.readdir(monthDir);
          
          // Filter JSON files
          const jsonFiles = files.filter(
            (file) => file.endsWith('.json') && !file.endsWith('.tmp')
          );

          // Read all files in this month in parallel
          const fileResults = await Promise.allSettled(
            jsonFiles.map(async (file) => {
              const filePath = path.join(monthDir, file);
              const data = await fs.readFile(filePath, 'utf8');
              return JSON.parse(data);
            })
          );

          // Extract successful results and log errors
          return fileResults
            .filter((result) => {
              if (result.status === 'rejected') {
                // Log corrupted file but continue (FR-029)
                console.error(`Skipping corrupted file:`, result.reason.message);
                return false;
              }
              return true;
            })
            .map((result) => result.value);
        })
      );

      // Flatten all reflections from all months
      const reflections = monthResults.flat();

      // Sort by timestamp descending (newest first)
      reflections.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return reflections;
    } catch (err) {
      console.error('Error finding all reflections:', err);
      throw err;
    }
  }

  /**
   * Delete reflection by ID
   * @param {string} id - Reflection ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteById(id) {
    try {
      const monthDirs = await this._getAllMonthDirs();

      // Try to delete from all directories in parallel
      const results = await Promise.allSettled(
        monthDirs.map(async (monthDir) => {
          const filePath = path.join(monthDir, `${id}.json`);
          await fs.unlink(filePath);
          return true;
        })
      );

      // Return true if any deletion succeeded
      return results.some((result) => result.status === 'fulfilled');
    } catch (err) {
      console.error(`Error deleting reflection ${id}:`, err);
      throw err;
    }
  }

  /**
   * Delete all reflections
   * @returns {Promise<number>} Number of reflections deleted
   */
  async deleteAll() {
    try {
      await this._ensureDir(this.reflectionsDir);

      const monthDirs = await this._getAllMonthDirs();

      // Process all month directories in parallel
      const monthResults = await Promise.all(
        monthDirs.map(async (monthDir) => {
          const files = await fs.readdir(monthDir);
          const jsonFiles = files.filter((file) => file.endsWith('.json'));

          // Delete all JSON files in parallel
          await Promise.all(
            jsonFiles.map((file) => {
              const filePath = path.join(monthDir, file);
              return fs.unlink(filePath);
            })
          );

          // Try to remove empty month directory
          try {
            await fs.rmdir(monthDir);
          } catch {
            // Directory not empty or other error, ignore
          }

          return jsonFiles.length;
        })
      );

      // Sum up deleted files from all months
      const deletedCount = monthResults.reduce((sum, count) => sum + count, 0);

      return deletedCount;
    } catch (err) {
      console.error('Error deleting all reflections:', err);
      throw err;
    }
  }

  /**
   * Get all month directories
   * @returns {Promise<Array<string>>} Array of month directory paths
   */
  async _getAllMonthDirs() {
    try {
      const entries = await fs.readdir(this.reflectionsDir, { withFileTypes: true });
      const monthDirs = entries
        .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}$/.test(entry.name))
        .map((entry) => path.join(this.reflectionsDir, entry.name))
        .sort()
        .reverse(); // Newest months first

      return monthDirs;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  }
}

export default LocalFileRepository;
