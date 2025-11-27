/**
 * useAIMirror composable - AI mirror response generation
 * 
 * Provides:
 * - generating: loading state for AI generation
 * - error: error state
 * - generateMirrorResponse(): generate AI response
 */

import { ref } from 'vue';
import { aiAPI } from '../services/api.js';

export function useAIMirror() {
  const generating = ref(false);
  const error = ref(null);

  /**
   * Generate AI mirror response for reflection
   * @param {string} prompt - User's reflection text
   * @param {string} model - AI model to use (default: llama2)
   * @returns {Promise<Object>} AI interaction object
   */
  const generateMirrorResponse = async (prompt, model = 'llama2') => {
    if (!prompt || prompt.trim().length === 0) {
      const err = new Error('Reflection text is required');
      error.value = err.message;
      throw err;
    }

    generating.value = true;
    error.value = null;

    try {
      const response = await aiAPI.generateMirror(prompt, model);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to generate AI mirror response:', err);
      throw err;
    } finally {
      generating.value = false;
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    generating,
    error,

    // Methods
    generateMirrorResponse,
    clearError,
  };
}
