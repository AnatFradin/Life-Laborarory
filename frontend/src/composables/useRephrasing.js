/**
 * useRephrasing composable - AI text rephrasing
 * 
 * Provides:
 * - loading: loading state for rephrasing request
 * - error: error state
 * - suggestions: array of rephrasing suggestions
 * - requestRephrase(): request AI rephrasing
 * - clearError(): clear error state
 * - clearSuggestions(): clear suggestions
 */

import { ref } from 'vue';
import { aiAPI } from '../services/api.js';

export function useRephrasing() {
  const loading = ref(false);
  const error = ref(null);
  const suggestions = ref([]);

  /**
   * Request AI rephrasing for text
   * @param {string} text - Text to rephrase
   * @param {string} style - Rephrasing style: 'clearer', 'more-positive', 'more-constructive'
   * @returns {Promise<Object>} Rephrasing result
   */
  const requestRephrase = async (text, style) => {
    if (!text || text.trim().length === 0) {
      const err = new Error('Text is required for rephrasing');
      error.value = err.message;
      throw err;
    }

    loading.value = true;
    error.value = null;
    suggestions.value = [];

    try {
      const response = await aiAPI.rephrase(text, style);
      suggestions.value = response.data.suggestions;
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to rephrase text:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null;
  };

  /**
   * Clear suggestions
   */
  const clearSuggestions = () => {
    suggestions.value = [];
  };

  return {
    // State
    loading,
    error,
    suggestions,

    // Methods
    requestRephrase,
    clearError,
    clearSuggestions,
  };
}
