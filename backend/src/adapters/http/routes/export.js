/**
 * Export routes - HTTP endpoints for exporting reflections
 * 
 * POST /api/export - Export all reflections to Markdown
 */

import express from 'express';
import { z } from 'zod';
import ExportService from '../../../domain/services/ExportService.js';
import ReflectionService from '../../../domain/services/ReflectionService.js';
import MarkdownExporter from '../../export/MarkdownExporter.js';
import LocalFileRepository from '../../storage/LocalFileRepository.js';

/**
 * Create export router with optional dependencies
 * @param {Object} deps - Dependencies (for testing)
 * @param {IReflectionRepository} deps.repository - Reflection repository
 * @returns {express.Router} Express router
 */
function createExportRouter(deps = {}) {
  const router = express.Router();

  // Initialize services (use injected or create new)
  const repository = deps.repository || new LocalFileRepository();
  const reflectionService = new ReflectionService(repository);
  const exporter = new MarkdownExporter();
  const exportService = new ExportService(repository, exporter);

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

    // Export reflections
    const result = await exportService.exportAllToMarkdown({
      format,
      includeMetadata,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

  return router;
}

export default createExportRouter;
