/**
 * Templates routes - HTTP endpoints for reflection template management
 * 
 * GET    /api/templates        - Get all templates
 * GET    /api/templates/:id    - Get specific template
 * POST   /api/templates        - Create new template
 * PUT    /api/templates/:id    - Update existing template
 * DELETE /api/templates/:id    - Delete template
 */

import express from 'express';
import TemplateService from '../../../domain/services/TemplateService.js';
import config from '../../../config/index.js';
import path from 'path';

const router = express.Router();

// Create a shared TemplateService instance to maintain cache
const templatesDir = path.join(config.dataDir, 'reflection-templates');
const templateService = new TemplateService(templatesDir);

/**
 * GET /api/templates
 * Get all reflection templates
 */
router.get('/', async (req, res, next) => {
  try {
    const templates = await templateService.getAllTemplates();
    
    res.json({
      templates,
      count: templates.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/templates/:id
 * Get specific template by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await templateService.getTemplateById(id);

    if (!template) {
      const error = new Error('Template not found');
      error.statusCode = 404;
      throw error;
    }

    res.json(template);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/templates
 * Create new template
 * 
 * Request body:
 * {
 *   id: string (required, unique identifier/filename without .md)
 *   name: string (required, display name)
 *   description?: string
 *   content: string (required, markdown content)
 *   tags?: string[]
 *   isDefault?: boolean
 * }
 */
router.post('/', async (req, res, next) => {
  try {
    const { id, name, description, content, tags, isDefault } = req.body;

    // Validate required fields
    if (!id || !name || !content) {
      const error = new Error('id, name, and content are required');
      error.statusCode = 400;
      throw error;
    }

    // Check if template with this ID already exists
    const existing = await templateService.getTemplateById(id);
    if (existing) {
      const error = new Error('Template with this ID already exists');
      error.statusCode = 409;
      throw error;
    }

    const templateData = {
      id,
      name,
      description,
      content,
      tags,
      isDefault,
    };

    const created = await templateService.saveTemplate(templateData);

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/templates/:id
 * Update existing template
 * 
 * Request body: Same as POST (all fields optional except those being updated)
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await templateService.updateTemplate(id, updates);

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/templates/:id
 * Delete a template
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await templateService.deleteTemplate(id);

    if (!deleted) {
      const error = new Error('Template not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      message: 'Template deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
