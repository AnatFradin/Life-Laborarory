/**
 * AIMirrorService - Domain service for AI mirror responses
 * 
 * Generates reflective, non-directive AI responses using the configured provider
 * Uses system prompt v1.0.0 for consistent, gentle mirroring
 */

import systemPrompt from '../../adapters/ai/prompts/system-prompt-v1.js';

class AIMirrorService {
  constructor(aiProvider) {
    this.aiProvider = aiProvider;
  }

  /**
   * Generate a reflective mirror response for user's reflection
   * @param {string} userReflection - User's reflection text
   * @param {Object} options - Generation options
   * @param {string} options.model - AI model to use
   * @returns {Promise<Object>} AI interaction object
   */
  async generateReflection(userReflection, options = {}) {
    // Validate input
    if (!userReflection || typeof userReflection !== 'string' || userReflection.trim().length === 0) {
      const error = new Error('Reflection text is required');
      error.statusCode = 400;
      throw error;
    }

    // Check if AI provider is available
    const isAvailable = await this.aiProvider.isAvailable();
    if (!isAvailable) {
      const error = new Error('AI provider is not available');
      error.statusCode = 503;
      throw error;
    }

    // Prepare prompt
    const prompt = this._buildPrompt(userReflection);

    // Generate response
    const response = await this.aiProvider.generateResponse(prompt, {
      model: options.model,
      systemPrompt: systemPrompt.prompt,
    });

    // Validate response quality (non-directive check)
    const isValid = this._validateResponse(response);
    if (!isValid) {
      console.warn('AI response failed non-directive validation, but returning anyway');
    }

    // Build AI interaction object
    const aiInteraction = {
      model: options.model || 'unknown',
      provider: this.aiProvider.getProviderName(),
      prompt: userReflection,
      response: response,
      timestamp: new Date().toISOString(),
      systemPromptVersion: systemPrompt.version,
    };

    return aiInteraction;
  }

  /**
   * Build the prompt for AI mirror response
   * @param {string} userReflection - User's reflection
   * @returns {string} Complete prompt
   */
  _buildPrompt(userReflection) {
    return `Here is a reflection from someone:\n\n"${userReflection}"\n\nPlease mirror back what you notice, without giving advice or direction.`;
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

  /**
   * Change AI provider
   * @param {Object} newProvider - New AI provider instance
   */
  setProvider(newProvider) {
    this.aiProvider = newProvider;
  }
}

export default AIMirrorService;
