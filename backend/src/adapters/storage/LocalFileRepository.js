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
  constructor() {
    this.reflectionsDir = config.reflectionsDir();
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
      // Search all month directories
      const monthDirs = await this._getAllMonthDirs();

      for (const monthDir of monthDirs) {
        const filePath = path.join(monthDir, `${id}.json`);
        try {
          const data = await fs.readFile(filePath, 'utf8');
          return JSON.parse(data);
        } catch (err) {
          // File not in this month, continue searching
          if (err.code !== 'ENOENT') {
            throw err;
          }
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
      const reflections = [];

      for (const monthDir of monthDirs) {
        const files = await fs.readdir(monthDir);

        for (const file of files) {
          if (file.endsWith('.json') && !file.endsWith('.tmp')) {
            const filePath = path.join(monthDir, file);
            try {
              const data = await fs.readFile(filePath, 'utf8');
              const reflection = JSON.parse(data);
              reflections.push(reflection);
            } catch (err) {
              // Log corrupted file but continue (FR-029)
              console.error(`Skipping corrupted file ${filePath}:`, err.message);
            }
          }
        }
      }

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

      for (const monthDir of monthDirs) {
        const filePath = path.join(monthDir, `${id}.json`);
        try {
          await fs.unlink(filePath);
          return true;
        } catch (err) {
          if (err.code !== 'ENOENT') {
            throw err;
          }
        }
      }

      return false;
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
      let deletedCount = 0;

      for (const monthDir of monthDirs) {
        const files = await fs.readdir(monthDir);

        for (const file of files) {
          if (file.endsWith('.json')) {
            const filePath = path.join(monthDir, file);
            await fs.unlink(filePath);
            deletedCount++;
          }
        }

        // Remove empty month directory
        try {
          await fs.rmdir(monthDir);
        } catch {
          // Directory not empty or other error, ignore
        }
      }

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
