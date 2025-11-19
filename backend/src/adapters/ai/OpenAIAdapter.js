import OpenAI from 'openai';

/**
 * OpenAIAdapter - Implements IAIProvider for OpenAI models
 * 
 * Online AI adapter - data leaves device per FR-008
 * Requires explicit user opt-in via hasAcknowledgedOnlineWarning
 * 
 * Per User Story 4 (T071):
 * - Implements IAIProvider interface
 * - Uses OpenAI SDK for API calls
 * - Returns standardized AIInteraction format
 * - Handles errors gracefully with gentle messages
 */
export class OpenAIAdapter {
  /**
   * @param {Object} config - OpenAI configuration
   * @param {string} config.apiKey - OpenAI API key
   * @param {string} [config.model] - Model name (e.g., 'gpt-4', 'gpt-3.5-turbo')
   * @param {number} [config.temperature] - Response randomness (0-2)
   */
  constructor(config = {}) {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: config.apiKey,
    });

    this.model = config.model || 'gpt-3.5-turbo';
    this.temperature = config.temperature ?? 0.7;
  }

  /**
   * Generate AI response using OpenAI
   * 
   * @param {string} systemPrompt - System instructions for AI behavior
   * @param {string} userMessage - User's reflection content
   * @returns {Promise<Object>} AIInteraction entity data
   */
  async generateResponse(systemPrompt, userMessage) {
    try {
      const startTime = Date.now();

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: this.temperature,
        max_tokens: 500, // Reasonable limit for reflective responses
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No response generated from OpenAI');
      }

      const duration = Date.now() - startTime;

      return {
        model: this.model,
        provider: 'openai',
        prompt: userMessage,
        response: response.trim(),
        timestamp: new Date().toISOString(),
        systemPromptVersion: '1.0.0', // Should match system-prompt-v1.js version
        metadata: {
          duration,
          tokensUsed: completion.usage?.total_tokens,
        },
      };
    } catch (error) {
      // Gentle error handling per FR-028
      if (error.code === 'insufficient_quota') {
        throw new Error(
          'Your OpenAI account has reached its usage limit. You can switch to local AI in Settings for private, unlimited reflections.'
        );
      }

      if (error.code === 'invalid_api_key') {
        throw new Error(
          'The OpenAI API key is not valid. Please check your settings and try again.'
        );
      }

      if (error.message?.includes('rate_limit')) {
        throw new Error(
          'OpenAI is experiencing high demand. Please try again in a moment, or switch to local AI in Settings.'
        );
      }

      // Generic network error
      throw new Error(
        `Unable to reach OpenAI: ${error.message}. You can continue using local AI in Settings.`
      );
    }
  }

  /**
   * Check if adapter is available (has valid configuration)
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    try {
      // Simple check - try to list models
      await this.client.models.list();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get adapter metadata
   * @returns {Object}
   */
  getMetadata() {
    return {
      provider: 'openai',
      model: this.model,
      type: 'online',
      privacyLevel: 'data-leaves-device',
    };
  }
}
