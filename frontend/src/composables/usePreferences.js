import { ref, readonly } from 'vue';
import api from '../services/api.js';

/**
 * usePreferences - Composable for managing user preferences
 * 
 * Per User Story 4 (T076):
 * - Load/update preferences from backend
 * - Reactive state for preferences
 * - Privacy validation (hasAcknowledgedOnlineWarning)
 */

// Shared state across all instances
const preferences = ref(null);
const loading = ref(false);
const error = ref(null);

export function usePreferences() {
  /**
   * Load current preferences from backend
   * @returns {Promise<Object>} User preferences
   */
  const loadPreferences = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/preferences');
      preferences.value = response.data.data;
      return preferences.value;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to load preferences';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update preferences
   * @param {Object} updates - Partial preferences to update
   * @returns {Promise<Object>} Updated preferences
   */
  const updatePreferences = async (updates) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.put('/preferences', updates);
      preferences.value = response.data.data;
      return preferences.value;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to update preferences';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Switch to local AI (Ollama)
   * @returns {Promise<Object>} Updated preferences
   */
  const switchToLocalAI = async () => {
    return await updatePreferences({
      aiProvider: 'local',
    });
  };

  /**
   * Switch to online AI (requires acknowledgment)
   * @param {string} provider - 'openai' or 'anthropic'
   * @param {string} model - Model name
   * @param {boolean} acknowledged - Has user acknowledged privacy warning
   * @returns {Promise<Object>} Updated preferences
   */
  const switchToOnlineAI = async (provider, model, acknowledged = false) => {
    if (!acknowledged) {
      throw new Error('Must acknowledge privacy warning before using online AI');
    }

    return await updatePreferences({
      aiProvider: 'online',
      onlineProvider: provider,
      onlineModel: model,
      hasAcknowledgedOnlineWarning: true,
    });
  };

  /**
   * Update theme
   * @param {string} theme - 'calm-light' or 'calm-dark'
   * @returns {Promise<Object>} Updated preferences
   */
  const updateTheme = async (theme) => {
    return await updatePreferences({ theme });
  };

  /**
   * Update language
   * @param {string} language - ISO 639-1 language code
   * @returns {Promise<Object>} Updated preferences
   */
  const updateLanguage = async (language) => {
    return await updatePreferences({ language });
  };

  /**
   * Reset preferences to defaults
   * @returns {Promise<Object>} Default preferences
   */
  const resetPreferences = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post('/preferences/reset');
      preferences.value = response.data.data;
      return preferences.value;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to reset preferences';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Check if user is using local AI
   * @returns {boolean}
   */
  const isUsingLocalAI = () => {
    return preferences.value?.aiProvider === 'local';
  };

  /**
   * Check if user is using online AI
   * @returns {boolean}
   */
  const isUsingOnlineAI = () => {
    return preferences.value?.aiProvider === 'online';
  };

  /**
   * Get current privacy level
   * @returns {string} 'local-only' or 'online'
   */
  const getPrivacyLevel = () => {
    return isUsingLocalAI() ? 'local-only' : 'online';
  };

  return {
    // State
    preferences: readonly(preferences),
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    loadPreferences,
    updatePreferences,
    switchToLocalAI,
    switchToOnlineAI,
    updateTheme,
    updateLanguage,
    resetPreferences,

    // Getters
    isUsingLocalAI,
    isUsingOnlineAI,
    getPrivacyLevel,
  };
}
