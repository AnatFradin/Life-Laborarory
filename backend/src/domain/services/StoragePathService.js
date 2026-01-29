import path from 'path';
import os from 'os';
import config from '../../config/index.js';
import { getiCloudStoragePath } from '../../utils/icloud.js';

/**
 * StoragePathService
 * 
 * Provides dynamic storage paths based on user preferences.
 * Supports:
 * - Local storage (./data) - default local directory
 * - iCloud Drive storage (~/Library/Mobile Documents/com~apple~CloudDocs/Life-Laboratory) - macOS only
 * - Custom storage path - user can specify any directory path for either local or iCloud
 * 
 * When customStoragePath is provided in preferences, it overrides the default location.
 */
class StoragePathService {
  constructor() {
    this._currentBasePath = null;
    this._currentStorageLocation = 'local';
  }

  /**
   * Get base storage path based on storage location preference
   * @param {string} storageLocation - 'local', 'icloud', or 'custom'
   * @param {string|null} customPath - Custom path (overrides default location)
   * @returns {Promise<string>} Base storage path
   */
  async getBasePath(storageLocation = 'local', customPath = null) {
    // If custom path is provided, use it regardless of storage location
    if (customPath && customPath.trim() !== '') {
      const trimmed = customPath.trim();
      let normalized = trimmed;

      if (trimmed === '~') {
        normalized = os.homedir();
      } else if (trimmed.startsWith('~/')) {
        normalized = path.join(os.homedir(), trimmed.slice(2));
      }

      if (!path.isAbsolute(normalized)) {
        console.warn('Custom storage path is not absolute; resolving relative to home directory');
        normalized = path.resolve(os.homedir(), normalized);
      }

      console.log(`Using custom storage path: ${normalized}`);
      return normalized;
    }

    switch (storageLocation) {
      case 'icloud': {
        const iCloudPath = await getiCloudStoragePath();
        if (!iCloudPath) {
          console.warn('iCloud Drive not available, falling back to local storage');
          return config.dataDir;
        }
        return iCloudPath;
      }

      case 'custom':
        // Custom location but no path provided
        console.warn('Custom storage location selected but no path provided, falling back to local storage');
        return config.dataDir;

      case 'local':
      default:
        return config.dataDir;
    }
  }

  /**
   * Get reflections directory path
   * @param {string} storageLocation
   * @param {string|null} customPath
   * @returns {Promise<string>}
   */
  async getReflectionsDir(storageLocation = 'local', customPath = null) {
    const basePath = await this.getBasePath(storageLocation, customPath);
    return path.join(basePath, 'reflections');
  }

  /**
   * Get visuals directory path
   * @param {string} storageLocation
   * @param {string|null} customPath
   * @returns {Promise<string>}
   */
  async getVisualsDir(storageLocation = 'local', customPath = null) {
    const basePath = await this.getBasePath(storageLocation, customPath);
    return path.join(basePath, 'visuals');
  }

  /**
   * Get exports directory path
   * @param {string} storageLocation
   * @param {string|null} customPath
   * @returns {Promise<string>}
   */
  async getExportsDir(storageLocation = 'local', customPath = null) {
    const basePath = await this.getBasePath(storageLocation, customPath);
    return path.join(basePath, 'exports');
  }

  /**
   * Get templates directory path
   * @param {string} storageLocation
   * @param {string|null} customPath
   * @returns {Promise<string>}
   */
  async getTemplatesDir(storageLocation = 'local', customPath = null) {
    const basePath = await this.getBasePath(storageLocation, customPath);
    return path.join(basePath, 'templates');
  }

  /**
   * Get preferences file path
   * NOTE: Preferences are always stored locally to avoid circular dependency
   * @returns {string}
   */
  getPreferencesFile() {
    return path.join(config.dataDir, 'preferences.json');
  }

  /**
   * Update current storage location (for caching)
   * @param {string} storageLocation
   */
  setCurrentStorageLocation(storageLocation) {
    this._currentStorageLocation = storageLocation;
    this._currentBasePath = null; // Clear cache
  }
}

// Export singleton instance
export default new StoragePathService();
