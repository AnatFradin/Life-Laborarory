/**
 * Export routes - HTTP endpoints for exporting reflections
 * 
 * POST /api/export - Export all reflections to Markdown
 */

import express from 'express';
import { z } from 'zod';
import ExportService from '../../../domain/services/ExportService.js';
import MarkdownExporter from '../../export/MarkdownExporter.js';
import config from '../../../config/index.js';
import repositoryFactory from '../../../domain/factories/RepositoryFactory.js';
import storagePathService from '../../../domain/services/StoragePathService.js';
import { LocalPreferencesRepository } from '../../storage/LocalPreferencesRepository.js';

/**
 * Create export router with optional dependencies
 * @param {Object} deps - Dependencies (for testing)
 * @param {IReflectionRepository} deps.repository - Reflection repository
 * @returns {express.Router} Express router
 */
function createExportRouter(deps = {}) {
  const router = express.Router();

  const preferencesRepo = new LocalPreferencesRepository(config.preferencesFile());

  async function getBaseDataDir() {
    const preferences = await preferencesRepo.getPreferences();
    const storageLocation = preferences.storageLocation || 'local';
    const customPath = preferences.customStoragePath || null;
    return await storagePathService.getBasePath(storageLocation, customPath);
  }

// Request validation schema
const ExportRequestSchema = z.object({
  format: z.enum(['single-file', 'folder']).optional().default('single-file'),
  includeMetadata: z.boolean().optional().default(true),
});

/**
 * POST /api/export
 * Export all reflections to Markdown format
 * 
 * Request body:
 * {
 *   format?: 'single-file' | 'folder',  // Default: 'single-file'
 *   includeMetadata?: boolean            // Default: true
 * }
 * 
 * Response:
 * {
 *   content: string,        // Markdown content
 *   attachments: Array      // Visual attachments (if format='folder')
 * }
 */
router.post('/', async (req, res, next) => {
  try {
    // Validate request body
    const validation = ExportRequestSchema.safeParse(req.body);
    
    if (!validation.success) {
      const error = new Error('Invalid export parameters');
      error.statusCode = 400;
      error.details = validation.error.issues;
      throw error;
    }

    const { format, includeMetadata } = validation.data;

    // Export reflections with dataDir for reading images
    const dataDir = await getBaseDataDir();
    const repository = deps.repository || await repositoryFactory.createReflectionRepository();
    const exporter = new MarkdownExporter();
    const exportService = new ExportService(repository, exporter);
    const result = await exportService.exportAllToMarkdown({
      format,
      includeMetadata,
      dataDir,
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `reflections-${timestamp}.md`;

    // Send response with markdown content and filename
    res.json({
      markdown: result.content,
      filename,
      attachments: result.attachments || [],
    });
  } catch (error) {
    next(error);
  }
});

  return router;
}

export default createExportRouter;
