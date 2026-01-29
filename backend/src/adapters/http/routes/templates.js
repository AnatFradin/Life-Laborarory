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
import storagePathService from '../../../domain/services/StoragePathService.js';
import { LocalPreferencesRepository } from '../../storage/LocalPreferencesRepository.js';

const router = express.Router();

const preferencesRepo = new LocalPreferencesRepository(config.preferencesFile());

async function getTemplateService() {
  const preferences = await preferencesRepo.getPreferences();
  const storageLocation = preferences.storageLocation || 'local';
  const customPath = preferences.customStoragePath || null;
  const templatesDir = await storagePathService.getTemplatesDir(
    storageLocation,
    customPath
  );

  return new TemplateService(templatesDir);
}

/**
 * GET /api/templates
 * Get all reflection templates
 */
router.get('/', async (req, res, next) => {
  try {
    const templateService = await getTemplateService();
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
    const templateService = await getTemplateService();
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
 *   name: string (required, display name)
 *   description?: string
 *   content: string (required, markdown content)
 *   tags?: string[]
 *   isDefault?: boolean
 * }
 */
router.post('/', async (req, res, next) => {
  try {
    const templateService = await getTemplateService();
    const { name, description, content, tags, isDefault } = req.body;

    // Validate required fields
    if (!name || !content) {
      const error = new Error('name and content are required');
      error.statusCode = 400;
      throw error;
    }

    const templateData = {
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
    const templateService = await getTemplateService();
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
    const templateService = await getTemplateService();
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
