/**
 * AI routes - HTTP endpoints for AI mirror service
 * 
 * POST /api/ai/mirror - Generate AI mirror response
 * POST /api/ai/chat - Interactive chat with coach personas
 * 
 * Per User Story 4 (T073):
 * - Supports multiple AI providers (Ollama, OpenAI, Anthropic)
 * - Selects provider based on user preferences
 * - Enforces privacy validation
 */

import express from 'express';
import { z } from 'zod';
import AIMirrorService from '../../../domain/services/AIMirrorService.js';
import OllamaAdapter from '../../ai/OllamaAdapter.js';
import { OpenAIAdapter } from '../../ai/OpenAIAdapter.js';
import { AnthropicAdapter } from '../../ai/AnthropicAdapter.js';
import { LocalPreferencesRepository } from '../../storage/LocalPreferencesRepository.js';
import { validateBody } from '../middleware/validation.js';
import { getPersonaById } from '../../../domain/entities/predefined-personas.js';
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
const MirrorRequestSchema = z.object({
  prompt: z.string().min(1, 'Reflection text is required'),
});

/**
 * POST /api/ai/mirror
 * Generate AI mirror response for a reflection
 * 
 * Per User Story 4:
 * - Loads current user preferences
 * - Selects AI provider based on preferences
 * - Returns AI interaction with privacy-aware response
 */
router.post('/mirror', validateBody(MirrorRequestSchema), async (req, res, next) => {
  try {
    const { prompt } = req.body;

    // Load current preferences
    const preferences = await preferencesRepo.getPreferences();

    // Generate mirror response using preferred provider
    const aiInteraction = await aiMirrorService.generateReflection(prompt, preferences);

    res.json(aiInteraction);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/models/ollama
 * Get list of available Ollama models
 * 
 * Returns:
 * - List of installed Ollama models
 * - Empty array if Ollama is not available
 */
router.get('/models/ollama', async (req, res, next) => {
  try {
    if (!adapters.ollama) {
      return res.json({ models: [] });
    }

    const models = await adapters.ollama.listModels();
    res.json({ models });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/status
 * Check which AI providers are available
 * 
 * Per User Story 4:
 * - Returns status for all configured providers
 * - Shows available models for each provider
 */
router.get('/status', async (req, res, next) => {
  try {
    const status = {
      ollama: null,
      openai: null,
      anthropic: null,
    };

    // Check Ollama
    if (adapters.ollama) {
      const isAvailable = await adapters.ollama.isAvailable();
      status.ollama = {
        available: isAvailable,
        models: isAvailable ? await adapters.ollama.listModels() : [],
      };
    }

    // Check OpenAI
    if (adapters.openai) {
      const isAvailable = await adapters.openai.isAvailable();
      status.openai = {
        available: isAvailable,
        configured: true,
      };
    } else {
      status.openai = {
        available: false,
        configured: false,
        message: 'API key not configured',
      };
    }

    // Check Anthropic
    if (adapters.anthropic) {
      const isAvailable = await adapters.anthropic.isAvailable();
      status.anthropic = {
        available: isAvailable,
        configured: true,
      };
    } else {
      status.anthropic = {
        available: false,
        configured: false,
        message: 'API key not configured',
      };
    }

    // Load current preferences
    const preferences = await preferencesRepo.getPreferences();

    res.json({
      providers: status,
      currentProvider: preferences.aiProvider,
      currentModel: preferences.aiProvider === 'local' ? preferences.localModel : preferences.onlineModel,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/rephrase
 * Rephrase text using AI with different styles
 * 
 * Per User Story 3 (P3):
 * - Supports three styles: clearer, more-positive, more-constructive
 * - Returns 2-3 alternative suggestions
 * - Privacy-focused: only sends selected text
 */
const RephraseRequestSchema = z.object({
  originalText: z.string().min(1).max(5000, 'Text must be between 1 and 5000 characters'),
  style: z.enum(['clearer', 'more-positive', 'more-constructive']),
  aiProvider: z.enum(['local', 'openai', 'anthropic']).optional(),
  model: z.string().optional(),
});

router.post('/rephrase', validateBody(RephraseRequestSchema), async (req, res, next) => {
  try {
    const { originalText, style, aiProvider, model } = req.body;

    // Load current preferences
    const preferences = await preferencesRepo.getPreferences();

    // Override preferences if specified in request
    if (aiProvider) {
      preferences.aiProvider = aiProvider;
    }
    if (model) {
      if (preferences.aiProvider === 'local') {
        preferences.localModel = model;
      } else {
        preferences.onlineModel = model;
      }
    }

    // Generate rephrase suggestions using AI
    const result = await aiMirrorService.rephrase(originalText, style, preferences);

    res.json(result);
  } catch (error) {
    // AI service unavailable error
    if (error.message?.includes('not available') || error.message?.includes('unavailable')) {
      return res.status(503).json({
        error: true,
        message: 'AI service unavailable. Your original text is preserved. Please try again later.',
      });
    }
    
    // Timeout error
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return res.status(504).json({
        error: true,
        message: 'AI is taking longer than expected. Your original text is preserved. Please try again.',
      });
    }
    
    // Connection error (Ollama not running)
    if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
      return res.status(503).json({
        error: true,
        message: 'AI service is not running. Your original text is preserved. Please start Ollama and try again.',
      });
    }
    
    next(error);
  }
});

export default router;
