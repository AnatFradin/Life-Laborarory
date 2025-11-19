/**
 * AI routes - HTTP endpoints for AI mirror service
 * 
 * POST /api/ai/mirror - Generate AI mirror response
 */

import express from 'express';
import { z } from 'zod';
import AIMirrorService from '../../../domain/services/AIMirrorService.js';
import OllamaAdapter from '../../ai/OllamaAdapter.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

// Initialize AI service with Ollama adapter
const ollamaAdapter = new OllamaAdapter();
const aiMirrorService = new AIMirrorService(ollamaAdapter);

// Request validation schema
const MirrorRequestSchema = z.object({
  prompt: z.string().min(1, 'Reflection text is required'),
  model: z.string().optional().default('llama2'),
});

/**
 * POST /api/ai/mirror
 * Generate AI mirror response for a reflection
 */
router.post('/mirror', validateBody(MirrorRequestSchema), async (req, res, next) => {
  try {
    const { prompt, model } = req.body;

    // Generate mirror response
    const aiInteraction = await aiMirrorService.generateReflection(prompt, { model });

    res.json(aiInteraction);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/status
 * Check if AI provider is available
 */
router.get('/status', async (req, res, next) => {
  try {
    const isAvailable = await ollamaAdapter.isAvailable();
    const models = isAvailable ? await ollamaAdapter.listModels() : [];

    res.json({
      available: isAvailable,
      provider: ollamaAdapter.getProviderName(),
      models,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
