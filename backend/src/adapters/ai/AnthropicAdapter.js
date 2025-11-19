import Anthropic from '@anthropic-ai/sdk';

/**
 * AnthropicAdapter - Implements IAIProvider for Anthropic Claude models
 * 
 * Online AI adapter - data leaves device per FR-008
 * Requires explicit user opt-in via hasAcknowledgedOnlineWarning
 * 
 * Per User Story 4 (T072):
 * - Implements IAIProvider interface
 * - Uses Anthropic SDK for API calls
 * - Returns standardized AIInteraction format
 * - Handles errors gracefully with gentle messages
 */
export class AnthropicAdapter {
  /**
   * @param {Object} config - Anthropic configuration
   * @param {string} config.apiKey - Anthropic API key
   * @param {string} [config.model] - Model name (e.g., 'claude-3-opus-20240229', 'claude-3-sonnet-20240229')
   * @param {number} [config.temperature] - Response randomness (0-1)
   */
  constructor(config = {}) {
    if (!config.apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.client = new Anthropic({
      apiKey: config.apiKey,
    });

    this.model = config.model || 'claude-3-sonnet-20240229';
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens || 500;
  }

  /**
   * Generate AI response using Anthropic Claude
   * 
   * @param {string} systemPrompt - System instructions for AI behavior
   * @param {string} userMessage - User's reflection content
   * @returns {Promise<Object>} AIInteraction entity data
   */
  async generateResponse(systemPrompt, userMessage) {
    try {
      const startTime = Date.now();

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      const response = message.content[0]?.text;

      if (!response) {
        throw new Error('No response generated from Anthropic');
      }

      const duration = Date.now() - startTime;

      return {
        model: this.model,
        provider: 'anthropic',
        prompt: userMessage,
        response: response.trim(),
        timestamp: new Date().toISOString(),
        systemPromptVersion: '1.0.0', // Should match system-prompt-v1.js version
        metadata: {
          duration,
          tokensUsed: message.usage?.input_tokens + message.usage?.output_tokens,
          stopReason: message.stop_reason,
        },
      };
    } catch (error) {
      // Gentle error handling per FR-028
      if (error.status === 401) {
        throw new Error(
          'The Anthropic API key is not valid. Please check your settings and try again.'
        );
      }

      if (error.status === 429) {
        throw new Error(
          'Anthropic is experiencing high demand. Please try again in a moment, or switch to local AI in Settings.'
        );
      }

      if (error.status === 402) {
        throw new Error(
          'Your Anthropic account has reached its usage limit. You can switch to local AI in Settings for private, unlimited reflections.'
        );
      }

      if (error.type === 'invalid_request_error') {
        throw new Error(
          `Unable to process request: ${error.message}. Please try local AI in Settings.`
        );
      }

      // Generic network error
      throw new Error(
        `Unable to reach Anthropic: ${error.message}. You can continue using local AI in Settings.`
      );
    }
  }

  /**
   * Check if adapter is available (has valid configuration)
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    try {
      // Simple check - try to get account info or make a minimal request
      // Anthropic doesn't have a models endpoint, so we'll just return true if we have an API key
      return !!this.client.apiKey;
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
      provider: 'anthropic',
      model: this.model,
      type: 'online',
      privacyLevel: 'data-leaves-device',
    };
  }
}
