/**
 * AIMirrorService - Domain service for AI mirror responses
 * 
 * Generates reflective, non-directive AI responses using the configured provider
 * Uses system prompt v1.0.0 for consistent, gentle mirroring
 * 
 * Per User Story 4 (T073):
 * - Supports multiple AI providers (Ollama, OpenAI, Anthropic)
 * - Routes requests based on UserPreferences
 * - Enforces privacy validation (requires hasAcknowledgedOnlineWarning for online providers)
 */

import systemPrompt from '../../adapters/ai/prompts/system-prompt-v1.js';
import OllamaAdapter from '../../adapters/ai/OllamaAdapter.js';
import { OpenAIAdapter } from '../../adapters/ai/OpenAIAdapter.js';
import { AnthropicAdapter } from '../../adapters/ai/AnthropicAdapter.js';

class AIMirrorService {
  /**
   * @param {Object} adapters - Available AI adapters
   * @param {OllamaAdapter} adapters.ollama - Local Ollama adapter
   * @param {OpenAIAdapter} [adapters.openai] - Optional OpenAI adapter
   * @param {AnthropicAdapter} [adapters.anthropic] - Optional Anthropic adapter
   */
  constructor(adapters = {}) {
    this.adapters = {
      ollama: adapters.ollama || null,
      openai: adapters.openai || null,
      anthropic: adapters.anthropic || null,
    };
  }

  /**
   * Select AI provider based on user preferences
   * @param {Object} preferences - UserPreferences entity
   * @returns {Object} Selected AI adapter
   * @throws {Error} If preferences are invalid or provider unavailable
   */
  selectProvider(preferences) {
    const { aiProvider, onlineProvider, hasAcknowledgedOnlineWarning } = preferences;

    // Local provider (default)
    if (aiProvider === 'local') {
      if (!this.adapters.ollama) {
        throw new Error(
          'Local AI (Ollama) is not available. Please ensure Ollama is running on your device.'
        );
      }
      return this.adapters.ollama;
    }

    // Online provider - requires privacy acknowledgment
    if (aiProvider === 'online') {
      if (!hasAcknowledgedOnlineWarning) {
        throw new Error(
          'Cannot use online AI without acknowledging privacy implications. Please review settings.'
        );
      }

      if (onlineProvider === 'openai') {
        if (!this.adapters.openai) {
          throw new Error(
            'OpenAI is not configured. Please add your API key in settings or switch to local AI.'
          );
        }
        return this.adapters.openai;
      }

      if (onlineProvider === 'anthropic') {
        if (!this.adapters.anthropic) {
          throw new Error(
            'Anthropic is not configured. Please add your API key in settings or switch to local AI.'
          );
        }
        return this.adapters.anthropic;
      }

      throw new Error('Invalid online provider selected');
    }

    throw new Error('Invalid AI provider configuration');
  }

  /**
   * Generate a reflective mirror response for user's reflection
   * @param {string} userReflection - User's reflection text
   * @param {Object} preferences - UserPreferences entity
   * @returns {Promise<Object>} AIInteraction entity data
   */
  async generateReflection(userReflection, preferences) {
    // Validate input
    if (!userReflection || typeof userReflection !== 'string' || userReflection.trim().length === 0) {
      const error = new Error('Reflection text is required');
      error.statusCode = 400;
      throw error;
    }

    // Select provider based on preferences
    const provider = this.selectProvider(preferences);

    // Determine which model to use based on provider
    const model = preferences.aiProvider === 'local' 
      ? (preferences.localModel || 'llama2')
      : (preferences.onlineModel || null);

    // Generate response using selected provider with specified model
    const aiInteraction = await provider.generateResponse(systemPrompt.prompt, userReflection, { model });

    // Validate response quality (non-directive check)
    const isValid = this._validateResponse(aiInteraction.response);
    if (!isValid) {
      console.warn('AI response failed non-directive validation, but returning anyway');
    }

    return aiInteraction;
  }

  /**
   * Validate that response follows non-directive guidelines
   * @param {string} response - AI response
   * @returns {boolean} True if valid
   */
  _validateResponse(response) {
    // Check for imperative language (FR-010, FR-011)
    const imperatives = [
      /\byou should\b/i,
      /\byou must\b/i,
      /\byou need to\b/i,
      /\btry to\b/i,
      /\bhave you tried\b/i,
      /\bwhat you need\b/i,
      /\bdo this\b/i,
      /\bdon't\b/i,
      /\bstop\b/i,
      /\bavoid\b/i,
    ];

    for (const pattern of imperatives) {
      if (pattern.test(response)) {
        console.warn(`Non-directive violation detected: ${pattern}`);
        return false;
      }
    }

    return true;
  }
}

export default AIMirrorService;
