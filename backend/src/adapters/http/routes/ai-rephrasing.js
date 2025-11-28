/**
 * AI Rephrasing routes - HTTP endpoints for text rephrasing
 * 
 * POST /api/ai/rephrase - Rephrase text with specified style
 * 
 * Per User Story 3:
 * - Accepts selected text and rephrasing style
 * - Returns 2-3 alternative phrasings
 * - Supports clearer, more-positive, more-constructive styles
 * - Privacy-first: only sends selected text, not entire reflection
 */

import express from 'express';
import { z } from 'zod';
import AIMirrorService from '../../../domain/services/AIMirrorService.js';
import OllamaAdapter from '../../ai/OllamaAdapter.js';
import { OpenAIAdapter } from '../../ai/OpenAIAdapter.js';
import { AnthropicAdapter } from '../../ai/AnthropicAdapter.js';
import { LocalPreferencesRepository } from '../../storage/LocalPreferencesRepository.js';
import { validateBody } from '../middleware/validation.js';
import config from '../../../config/index.js';

const router = express.Router();

// Initialize preferences repository
const preferencesRepo = new LocalPreferencesRepository(config.preferencesFile());

// Initialize all available AI adapters
const adapters = {
  ollama: new OllamaAdapter(),
  openai: config.openaiApiKey ? new OpenAIAdapter({ apiKey: config.openaiApiKey }) : null,
  anthropic: config.anthropicApiKey ? new AnthropicAdapter({ apiKey: config.anthropicApiKey }) : null,
};

// Initialize AI mirror service with all adapters
const aiMirrorService = new AIMirrorService(adapters);

// Request validation schema
const RephraseRequestSchema = z.object({
  originalText: z.string()
    .min(1, 'Text is required for rephrasing')
    .max(5000, 'Text is too long for rephrasing (max 5000 characters)'),
  style: z.enum(['clearer', 'more-positive', 'more-constructive'], {
    errorMap: () => ({ message: 'Invalid rephrasing style. Must be: clearer, more-positive, or more-constructive' })
  }),
  aiProvider: z.enum(['local', 'online']).optional(),
  model: z.string().optional(),
});

/**
 * POST /api/ai/rephrase
 * Rephrase text using AI with specified style
 * 
 * Per User Story 3:
 * - Accepts originalText and style
 * - Returns 2-3 alternative phrasings
 * - Uses user preferences for AI provider selection
 * - Handles AI unavailable gracefully (503)
 */
router.post('/rephrase', validateBody(RephraseRequestSchema), async (req, res, next) => {
  try {
    const { originalText, style, aiProvider, model } = req.body;

    // Load current preferences
    let preferences = await preferencesRepo.getPreferences();

    // Override with request params if provided
    if (aiProvider) {
      preferences = { ...preferences, aiProvider };
    }
    if (model) {
      if (aiProvider === 'local') {
        preferences = { ...preferences, localModel: model };
      } else {
        preferences = { ...preferences, onlineModel: model };
      }
    }

    // Rephrase text using selected provider
    const result = await aiMirrorService.rephrase(originalText, style, preferences);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
