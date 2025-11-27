/**
 * OllamaAdapter - Implements IAIProvider for local Ollama
 * 
 * Connects to Ollama running on localhost:11434
 * Provides local, privacy-first AI mirror responses
 */

import config from '../../config/index.js';

class OllamaAdapter {
  constructor(ollamaUrl = null) {
    this.ollamaUrl = ollamaUrl || config.ollamaUrl;
    this.defaultModel = 'llama2';
  }

  /**
   * Generate AI response using Ollama
   * @param {string} prompt - User prompt
   * @param {Object} options - Generation options
   * @param {string} options.model - Model name (default: llama2)
   * @param {string} options.systemPrompt - System prompt for context
   * @returns {Promise<string>} Generated response
   */
  async generateResponse(prompt, options = {}) {
    const model = options.model || this.defaultModel;
    const systemPrompt = options.systemPrompt || '';

    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          system: systemPrompt,
          stream: false, // Get complete response at once
          options: {
            temperature: 0.7, // Balanced creativity
            top_p: 0.9,
            top_k: 40,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Handle specific Ollama errors
        if (response.status === 404) {
          const error = new Error(`Model "${model}" not found. Please pull it first: ollama pull ${model}`);
          error.statusCode = 404;
          throw error;
        }

        const error = new Error(`Ollama request failed: ${errorText}`);
        error.statusCode = response.status;
        throw error;
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('No response received from Ollama');
      }

      return data.response.trim();
    } catch (error) {
      // Handle network errors (Ollama not running)
      if (error.code === 'ECONNREFUSED' || error.cause?.code === 'ECONNREFUSED') {
        const enhancedError = new Error('Could not connect to Ollama. Is it running?');
        enhancedError.code = 'ECONNREFUSED';
        enhancedError.statusCode = 503;
        throw enhancedError;
      }

      throw error;
    }
  }

  /**
   * Check if Ollama is available
   * @returns {Promise<boolean>} True if available
   */
  async isAvailable() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get provider name
   * @returns {string} Provider name
   */
  getProviderName() {
    return 'ollama';
  }

  /**
   * List available models
   * @returns {Promise<Array>} Array of model names
   */
  async listModels() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`);
      if (!response.ok) {
        throw new Error('Failed to fetch models from Ollama');
      }

      const data = await response.json();
      return data.models.map((model) => model.name);
    } catch (error) {
      console.error('Error listing Ollama models:', error);
      return [];
    }
  }
}

export default OllamaAdapter;
