import LocalFileRepository from '../../adapters/storage/LocalFileRepository.js';
import { LocalPreferencesRepository } from '../../adapters/storage/LocalPreferencesRepository.js';
import config from '../../config/index.js';
import storagePathService from '../services/StoragePathService.js';

/**
 * RepositoryFactory
 * 
 * Creates repository instances with correct storage paths based on user preferences.
 * This ensures reflections are saved to the location chosen by the user (local vs iCloud).
 */
class RepositoryFactory {
  constructor() {
    this._cachedPreferences = null;
    this._preferencesRepo = new LocalPreferencesRepository(config.preferencesFile());
  }

  /**
   * Get user preferences (with caching)
   * @returns {Promise<Object>} User preferences
   */
  async _getPreferences() {
    if (!this._cachedPreferences) {
      try {
        this._cachedPreferences = await this._preferencesRepo.getPreferences();
      } catch (error) {
        console.error('Failed to load preferences, using defaults:', error);
        // Fall back to local storage
        return { storageLocation: 'local', customStoragePath: null };
      }
    }
    return this._cachedPreferences;
  }

  /**
   * Clear cached preferences (call when preferences change)
   */
  clearCache() {
    this._cachedPreferences = null;
  }

  /**
   * Create LocalFileRepository with correct storage path based on preferences
   * @returns {Promise<LocalFileRepository>}
   */
  async createReflectionRepository() {
    const preferences = await this._getPreferences();
    const storageLocation = preferences.storageLocation || 'local';
    const customPath = preferences.customStoragePath;

    const reflectionsDir = await storagePathService.getReflectionsDir(
      storageLocation,
      customPath
    );

    return new LocalFileRepository(reflectionsDir);
  }

  /**
   * Get preferences repository (always local)
   * @returns {LocalPreferencesRepository}
   */
  getPreferencesRepository() {
    return this._preferencesRepo;
  }
}

// Export singleton instance
export default new RepositoryFactory();
