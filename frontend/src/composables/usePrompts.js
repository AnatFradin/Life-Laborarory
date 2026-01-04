import { ref, watch } from 'vue';
import api from '../services/api.js';

/**
 * Composable for managing persona prompts
 * @param {import('vue').Ref<string>|string} personaIdRef - The persona ID (can be a ref or string)
 */
export function usePrompts(personaIdRef) {
  const prompts = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedPrompt = ref(null);

  // Watch personaId changes
  watch(() => typeof personaIdRef === 'string' ? personaIdRef : personaIdRef?.value, 
    (newPersonaId) => {
      if (newPersonaId) {
        fetchPrompts();
      }
    },
    { immediate: true }
  );

  /**
   * Fetch all prompts for the persona
   */
  async function fetchPrompts() {
    const personaId = typeof personaIdRef === 'string' ? personaIdRef : personaIdRef?.value;
    if (!personaId) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/personas/${personaId}/prompts`);
      
      if (response.data.success) {
        prompts.value = response.data.data.prompts;
        
        // Auto-select the default prompt
        const defaultPrompt = prompts.value.find(p => p.isDefault);
        if (defaultPrompt && !selectedPrompt.value) {
          selectedPrompt.value = defaultPrompt;
        }
      } else {
        error.value = response.data.error || 'Failed to load prompts';
        prompts.value = [];
      }
    } catch (err) {
      console.error('Error fetching prompts:', err);
      error.value = err.response?.data?.error || 'Unable to load prompts';
      prompts.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch a specific prompt by ID
   * @param {string} promptId - The prompt ID
   */
  async function fetchPromptById(promptId) {
    const personaId = typeof personaIdRef === 'string' ? personaIdRef : personaIdRef?.value;
    if (!personaId || !promptId) return null;

    try {
      const response = await api.get(`/personas/${personaId}/prompts/${promptId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to load prompt');
      }
    } catch (err) {
      console.error('Error fetching prompt by ID:', err);
      throw err;
    }
  }

  /**
   * Select a prompt
   * @param {Object} prompt - The prompt object to select
   */
  function selectPrompt(prompt) {
    selectedPrompt.value = prompt;
  }

  return {
    prompts,
    loading,
    error,
    selectedPrompt,
    fetchPrompts,
    fetchPromptById,
    selectPrompt,
  };
}
