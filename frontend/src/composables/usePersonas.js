import { ref } from 'vue';
import api from '../services/api.js';

/**
 * usePersonas composable
 * Manages coach personas state and operations
 */
export function usePersonas() {
  const personas = ref([]);
  const selectedPersona = ref(null);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Load all available coach personas from the backend
   * @returns {Promise<void>}
   */
  async function loadPersonas() {
    // Prevent loading if already in progress
    if (loading.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/personas');
      
      if (response.data.success) {
        personas.value = response.data.data;
        
        // If no persona is selected yet, select the default (first one, typically Stoic Coach)
        if (!selectedPersona.value && personas.value.length > 0) {
          selectedPersona.value = personas.value[0];
        }
      } else {
        error.value = response.data.error || 'Failed to load coach personas';
      }
    } catch (err) {
      console.error('Error loading personas:', err);
      error.value = err.response?.data?.error || 'Unable to load coach personas. Please try again.';
    } finally {
      loading.value = false;
    }
  }

  /**
   * Select a persona by ID
   * @param {string} personaId - The ID of the persona to select
   */
  function selectPersona(personaId) {
    if (!personaId) {
      selectedPersona.value = null;
      return;
    }
    const persona = personas.value.find((p) => p.id === personaId);
    selectedPersona.value = persona || null;
  }

  /**
   * Generate a ChatGPT link for the current reflection with the selected persona
   * @param {string} reflectionText - The reflection text to send to ChatGPT
   * @param {string} personaId - Optional persona ID (uses selected if not provided)
   * @param {string} promptId - Optional prompt ID (uses persona default if not provided)
   * @returns {Promise<Object>} - Response with chatGPTUrl, personaId, personaName, timestamp
   */
  async function generateChatGPTLink(reflectionText, personaId = null, promptId = null) {
    loading.value = true;
    error.value = null;

    try {
      const targetPersonaId = personaId || selectedPersona.value?.id;

      if (!targetPersonaId) {
        throw new Error('No persona selected. Please select a coach persona first.');
      }

      if (reflectionText === null || reflectionText === undefined || typeof reflectionText !== 'string') {
        throw new Error('Reflection text is required to generate a ChatGPT link.');
      }

      const response = await api.post('/personas/generate-link', {
        reflectionText: reflectionText.trim(),
        personaId: targetPersonaId,
        promptId: promptId || null,
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to generate ChatGPT link');
      }
    } catch (err) {
      console.error('Error generating ChatGPT link:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Unable to generate ChatGPT link. Please try again.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get a persona by ID
   * @param {string} personaId - The persona ID to find
   * @returns {Object|null} - The persona or null if not found
   */
  function getPersonaById(personaId) {
    return personas.value.find((p) => p.id === personaId) || null;
  }

  return {
    personas,
    selectedPersona,
    loading,
    error,
    loadPersonas,
    selectPersona,
    generateChatGPTLink,
    getPersonaById,
  };
}
