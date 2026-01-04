/**
 * AI Chat routes - HTTP endpoints for interactive coach chat
 * 
 * POST /api/ai/chat - Send message to coach persona
 */

import express from 'express';
import { z } from 'zod';
import OllamaAdapter from '../../ai/OllamaAdapter.js';
import { OpenAIAdapter } from '../../ai/OpenAIAdapter.js';
import { AnthropicAdapter } from '../../ai/AnthropicAdapter.js';
import { LocalPreferencesRepository } from '../../storage/LocalPreferencesRepository.js';
import { validateBody } from '../middleware/validation.js';
import { getPersonaById } from '../../../domain/entities/predefined-personas.js';
import config from '../../../config/index.js';

/**
 * Create chat router with PromptFileService dependency
 * @param {PromptFileService} promptFileService - Service for managing prompts
 */
export default function createChatRouter(promptFileService) {
  const router = express.Router();

  // Initialize preferences repository
  const preferencesRepo = new LocalPreferencesRepository(config.preferencesFile());

  // Initialize all available AI adapters
  const adapters = {
    ollama: new OllamaAdapter(),
    openai: config.openaiApiKey ? new OpenAIAdapter({ apiKey: config.openaiApiKey }) : null,
    anthropic: config.anthropicApiKey ? new AnthropicAdapter({ apiKey: config.anthropicApiKey }) : null,
  };

  // Request validation schema
  const ChatRequestSchema = z.object({
    personaId: z.string().min(1, 'Persona ID is required'),
    promptId: z.string().min(1, 'Prompt ID is required'),
    message: z.string().min(1, 'Message is required').max(5000, 'Message must be less than 5000 characters'),
  });

  /**
   * POST /api/ai/chat
   * Send a message to a coach persona with a specific prompt
   * 
   * Request body:
   * - personaId: The coach persona to chat with
   * - promptId: The specific prompt variant to use
   * - message: The user's message
   * 
   * Returns the AI response
   */
  router.post('/', validateBody(ChatRequestSchema), async (req, res, next) => {
    try {
      const { personaId, promptId, message } = req.body;

      // Validate persona exists
      const persona = getPersonaById(personaId);
      if (!persona) {
        return res.status(404).json({
          success: false,
          error: `Coach persona "${personaId}" not found.`,
        });
      }

      // Get the specific prompt from PromptFileService
      let systemPrompt = persona.systemPrompt; // Default fallback
      
      if (promptFileService && promptFileService.prompts) {
        const prompt = promptFileService.getPromptById(personaId, promptId);
        if (prompt) {
          systemPrompt = prompt.systemPrompt;
        } else {
          return res.status(404).json({
            success: false,
            error: `Prompt "${promptId}" not found for persona "${personaId}".`,
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          error: 'Prompt service not available.',
        });
      }

      // Load current preferences
      const preferences = await preferencesRepo.getPreferences();

      // Select AI adapter based on preferences
      let adapter;
      let model;

      if (preferences.aiProvider === 'local' || preferences.aiProvider === 'ollama') {
        adapter = adapters.ollama;
        model = preferences.localModel || 'llama2';
      } else if (preferences.aiProvider === 'openai') {
        adapter = adapters.openai;
        model = preferences.onlineModel || 'gpt-3.5-turbo';
      } else if (preferences.aiProvider === 'anthropic') {
        adapter = adapters.anthropic;
        model = preferences.onlineModel || 'claude-3-haiku-20240307';
      } else {
        // Default to Ollama
        adapter = adapters.ollama;
        model = 'llama2';
      }

      if (!adapter) {
        return res.status(503).json({
          success: false,
          error: `AI provider "${preferences.aiProvider}" is not configured.`,
        });
      }

      // Generate AI response
      const aiResponse = await adapter.generateResponse(message, {
        model,
        systemPrompt,
      });

      res.json({
        success: true,
        data: {
          message: aiResponse,
          personaId,
          promptId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      // AI service unavailable error
      if (error.message?.includes('not available') || error.message?.includes('unavailable')) {
        return res.status(503).json({
          success: false,
          error: 'AI service unavailable. Please try again later.',
        });
      }
      
      // Timeout error
      if (error.code === 'TIMEOUT' || error.message?.includes('timeout')) {
        return res.status(504).json({
          success: false,
          error: 'AI is taking longer than expected. Please try again.',
        });
      }
      
      // Connection error (Ollama not running)
      if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
        return res.status(503).json({
          success: false,
          error: 'AI service is not running. Please start Ollama and try again.',
        });
      }
      
      next(error);
    }
  });

  return router;
}
