/**
 * IAIProvider - Port/Interface for AI model providers
 * 
 * Defines the contract for any AI provider (Ollama, OpenAI, Anthropic).
 * Enables swapping AI backends without changing domain logic.
 * 
 * @interface
 */
export class IAIProvider {
  /**
   * Generate a reflective, non-directive response
   * 
   * @param {string} prompt - User's reflection text
   * @param {Object} options - Provider-specific options
   * @param {string} options.model - Model identifier (e.g., 'llama2', 'gpt-4')
   * @param {string} options.systemPrompt - System prompt for the AI
   * @param {number} [options.temperature=0.7] - Creativity (0-1)
   * @param {number} [options.maxTokens] - Max response length
   * @returns {Promise<string>} AI-generated reflective response
   * @throws {Error} If provider is unavailable or request fails
   */
  async generateResponse(prompt, options) {
    throw new Error('IAIProvider.generateResponse() must be implemented');
  }

  /**
   * Check if provider is available/healthy
   * @returns {Promise<boolean>} True if provider is reachable
   */
  async isAvailable() {
    throw new Error('IAIProvider.isAvailable() must be implemented');
  }

  /**
   * Get provider name for logging/tracking
   * @returns {string} Provider name (e.g., 'ollama', 'openai', 'anthropic')
   */
  getProviderName() {
    throw new Error('IAIProvider.getProviderName() must be implemented');
  }
}
