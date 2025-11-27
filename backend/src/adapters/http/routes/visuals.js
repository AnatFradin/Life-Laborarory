/**
 * Visuals routes - HTTP endpoints for serving visual attachments
 * 
 * GET /api/visuals/:year-:month/:filename - Serve image file
 */

import express from 'express';
import path from 'path';
import config from '../../../config/index.js';

const router = express.Router();

/**
 * GET /api/visuals/:year-:month/:filename
 * Serve image files from the visuals directory
 * 
 * Example: /api/visuals/2025-11/abc123-def456.jpg
 */
router.get('/:yearMonth/:filename', (req, res, next) => {
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
    const filePath = path.join(config.visualsDir(), yearMonth, filename);
    
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
