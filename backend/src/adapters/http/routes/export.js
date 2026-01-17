/**
 * Export routes - HTTP endpoints for exporting reflections
 * 
 * POST /api/export - Export all reflections to Markdown
 * POST /api/export/:id - Export a single reflection to Markdown
 */

import express from 'express';
import { z } from 'zod';
import ExportService from '../../../domain/services/ExportService.js';
import ReflectionService from '../../../domain/services/ReflectionService.js';
import MarkdownExporter from '../../export/MarkdownExporter.js';
import LocalFileRepository from '../../storage/LocalFileRepository.js';
import config from '../../../config/index.js';

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

    // Export reflections with dataDir for reading images
    const result = await exportService.exportAllToMarkdown({
      format,
      includeMetadata,
      dataDir: config.dataDir,
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

/**
 * POST /api/export/:id
 * Export a single reflection to Markdown format
 * 
 * Request body:
 * {
 *   includeMetadata?: boolean            // Default: true
 * }
 * 
 * Response:
 * {
 *   markdown: string,       // Markdown content
 *   filename: string,       // Suggested filename
 *   attachments: Array      // Visual attachments (if visual reflection)
 * }
 */
router.post('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate request body (only includeMetadata is relevant for single export)
    const validation = z.object({
      includeMetadata: z.boolean().optional().default(true),
    }).safeParse(req.body);
    
    if (!validation.success) {
      const error = new Error('Invalid export parameters');
      error.statusCode = 400;
      error.details = validation.error.issues;
      throw error;
    }

    const { includeMetadata } = validation.data;

    // Export single reflection
    const result = await exportService.exportSingleToMarkdown(id, {
      includeMetadata,
      dataDir: config.dataDir,
    });

    // Generate filename with reflection ID and timestamp
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `reflection-${id}-${timestamp}.md`;

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
