/**
 * Visuals routes - HTTP endpoints for serving visual attachments
 * 
 * GET /api/visuals/:year-:month/:filename - Serve image file
 */

import express from 'express';
import path from 'path';
import config from '../../../config/index.js';
import storagePathService from '../../../domain/services/StoragePathService.js';
import { LocalPreferencesRepository } from '../../storage/LocalPreferencesRepository.js';

const router = express.Router();
const preferencesRepo = new LocalPreferencesRepository(config.preferencesFile());

/**
 * GET /api/visuals/:year-:month/:filename
 * Serve image files from the visuals directory
 * 
 * Example: /api/visuals/2025-11/abc123-def456.jpg
 */
router.get('/:yearMonth/:filename', async (req, res, next) => {
  try {
    const { yearMonth, filename } = req.params;
    
    // Validate year-month format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(yearMonth)) {
      const error = new Error('Invalid date format. Expected YYYY-MM.');
      error.statusCode = 400;
      throw error;
    }
    
    // Validate filename (alphanumeric, hyphens, and image extensions)
    if (!/^[a-f0-9-]+\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
      const error = new Error('Invalid filename format.');
      error.statusCode = 400;
      throw error;
    }
    
    // Construct file path
    const preferences = await preferencesRepo.getPreferences();
    const storageLocation = preferences.storageLocation || 'local';
    const customPath = preferences.customStoragePath || null;
    const visualsDir = await storagePathService.getVisualsDir(storageLocation, customPath);
    const filePath = path.join(visualsDir, yearMonth, filename);
    
    // Send file (Express handles 404 if file doesn't exist)
    res.sendFile(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          const error = new Error('Image not found');
          error.statusCode = 404;
          next(error);
        } else {
          next(err);
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
