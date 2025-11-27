/**
 * IReflectionRepository - Port/Interface for reflection storage
 * 
 * Defines the contract that any reflection storage adapter must implement.
 * Enables swapping storage backends (local files, cloud, database) without
 * changing domain logic.
 * 
 * @interface
 */
export class IReflectionRepository {
  /**
   * Save a reflection (create or update)
   * @param {Object} reflection - Reflection entity (validated)
   * @returns {Promise<Object>} Saved reflection with any generated fields
   */
  async save(reflection) {
    throw new Error('IReflectionRepository.save() must be implemented');
  }

  /**
   * Find a reflection by ID
   * @param {string} id - Reflection UUID
   * @returns {Promise<Object|null>} Reflection or null if not found
   */
  async findById(id) {
    throw new Error('IReflectionRepository.findById() must be implemented');
  }

  /**
   * Find all reflections (optionally filtered)
   * @param {Object} [filters] - Optional filters (e.g., { mode: 'text', startDate, endDate })
   * @returns {Promise<Array<Object>>} Array of reflections, sorted by timestamp (newest first)
   */
  async findAll(filters = {}) {
    throw new Error('IReflectionRepository.findAll() must be implemented');
  }

  /**
   * Delete a reflection by ID
   * @param {string} id - Reflection UUID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteById(id) {
    throw new Error('IReflectionRepository.deleteById() must be implemented');
  }

  /**
   * Delete all reflections (with confirmation)
   * @param {string} confirmationString - Must be "DELETE_ALL" per FR-017
   * @returns {Promise<number>} Number of reflections deleted
   */
  async deleteAll(confirmationString) {
    throw new Error('IReflectionRepository.deleteAll() must be implemented');
  }
}
