/**
 * ReflectionService - Domain service for reflection management
 * 
 * Orchestrates reflection operations using the repository pattern
 */

import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { validateReflection } from '../entities/Reflection.js';
import { createVisualAttachment } from '../entities/VisualAttachment.js';

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
   * Update external AI session for a reflection
   * @param {string} reflectionId - Reflection ID
   * @param {Object} sessionData - External AI session data {personaId, personaName, sessionSummary, timestamp, chatGPTUrl}
   * @returns {Promise<Object>} Updated reflection
   */
  async updateExternalAISession(reflectionId, sessionData) {
    const reflection = await this.repository.findById(reflectionId);
    if (!reflection) {
      const error = new Error('Reflection not found');
      error.statusCode = 404;
      throw error;
    }

    // Add external AI session data
    reflection.externalAISession = {
      personaId: sessionData.personaId,
      personaName: sessionData.personaName,
      sessionSummary: sessionData.sessionSummary || '',
      timestamp: sessionData.timestamp || new Date().toISOString(),
      chatGPTUrl: sessionData.chatGPTUrl || undefined,
    };

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

  /**
   * Import a visual reflection (image)
   * @param {Object} imageData - Image file data
   * @param {Buffer} imageData.buffer - Image file buffer
   * @param {string} imageData.originalFilename - Original filename
   * @param {string} imageData.mimeType - MIME type (image/jpeg, image/png, etc.)
   * @param {number} imageData.sizeBytes - File size in bytes
   * @param {Object} imageData.dimensions - Optional {width, height}
   * @param {string} dataDir - Base data directory path
   * @returns {Promise<Object>} Created visual reflection
   */
  async importVisual(imageData, dataDir) {
    const { buffer, originalFilename, mimeType, sizeBytes, dimensions } = imageData;

    // Generate unique ID and timestamp
    const id = randomUUID();
    const timestamp = new Date().toISOString();
    
    // Determine file extension based on MIME type
    const extMap = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    const ext = extMap[mimeType] || 'jpg';

    // Create month-based directory structure (e.g., data/visuals/2025-11/)
    const date = new Date(timestamp);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const visualsDir = path.join(dataDir, 'visuals', yearMonth);
    
    // Ensure directory exists
    await fs.mkdir(visualsDir, { recursive: true });

    // Generate filename: UUID + original extension
    const filename = `${id}.${ext}`;
    const filePath = path.join(visualsDir, filename);
    
    // Write file to disk
    await fs.writeFile(filePath, buffer);

    // Create stored path relative to data directory
    const storedPath = `visuals/${yearMonth}/${filename}`;

    // Create VisualAttachment entity
    const visualAttachment = createVisualAttachment({
      originalFilename,
      storedPath,
      mimeType,
      sizeBytes,
      dimensions,
      importTimestamp: timestamp,
    });

    // Create reflection with visual mode
    const reflectionData = {
      id,
      timestamp,
      mode: 'visual',
      visualAttachment,
    };

    // Validate and save reflection
    const validatedReflection = validateReflection(reflectionData);
    const savedReflection = await this.repository.save(validatedReflection);

    return savedReflection;
  }
}

export default ReflectionService;
