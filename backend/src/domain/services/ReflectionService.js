/**
 * ReflectionService - Domain service for reflection management
 * 
 * Orchestrates reflection operations using the repository pattern
 */

import { randomUUID } from 'node:crypto';
import { validateReflection } from '../entities/Reflection.js';

class ReflectionService {
  constructor(reflectionRepository) {
    this.repository = reflectionRepository;
  }

  /**
   * Create a new reflection
   * @param {Object} reflectionData - Reflection data (mode, content, etc.)
   * @returns {Promise<Object>} Created reflection
   */
  async createReflection(reflectionData) {
    // Add id and timestamp if not provided
    const dataWithDefaults = {
      id: reflectionData.id || randomUUID(),
      timestamp: reflectionData.timestamp || new Date().toISOString(),
      ...reflectionData,
    };

    // Validate reflection data
    const validatedReflection = validateReflection(dataWithDefaults);

    // Save to repository
    const savedReflection = await this.repository.save(validatedReflection);

    return savedReflection;
  }

  /**
   * Get reflection by ID
   * @param {string} id - Reflection ID
   * @returns {Promise<Object|null>} Reflection or null if not found
   */
  async getReflectionById(id) {
    return await this.repository.findById(id);
  }

  /**
   * Get all reflections (sorted by timestamp desc)
   * @returns {Promise<Array>} Array of reflections
   */
  async getAllReflections() {
    return await this.repository.findAll();
  }

  /**
   * Update existing reflection
   * @param {string} id - Reflection ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated reflection
   */
  async updateReflection(id, updates) {
    // Get existing reflection
    const existing = await this.repository.findById(id);
    if (!existing) {
      const error = new Error('Reflection not found');
      error.statusCode = 404;
      throw error;
    }

    // Merge updates with existing data
    const updated = {
      ...existing,
      ...updates,
      id: existing.id, // Preserve ID
      timestamp: existing.timestamp, // Preserve original timestamp
    };

    // Validate merged data
    const validated = validateReflection(updated);

    // Save updated reflection
    return await this.repository.save(validated);
  }

  /**
   * Add AI interaction to a reflection
   * @param {string} reflectionId - Reflection ID
   * @param {Object} aiInteraction - AI interaction data
   * @returns {Promise<Object>} Updated reflection
   */
  async addAIInteraction(reflectionId, aiInteraction) {
    const reflection = await this.repository.findById(reflectionId);
    if (!reflection) {
      const error = new Error('Reflection not found');
      error.statusCode = 404;
      throw error;
    }

    // Add AI interaction
    reflection.aiInteraction = aiInteraction;

    // Validate and save
    const validated = validateReflection(reflection);
    return await this.repository.save(validated);
  }

  /**
   * Delete a reflection by ID
   * @param {string} id - Reflection ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteReflection(id) {
    return await this.repository.deleteById(id);
  }

  /**
   * Delete all reflections (permanent deletion)
   * @returns {Promise<number>} Number of reflections deleted
   */
  async deleteAllReflections() {
    return await this.repository.deleteAll();
  }
}

export default ReflectionService;
