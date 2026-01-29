/**
 * useTemplates composable - Manage reflection templates
 * 
 * Provides reactive state and methods for loading and managing templates
 */

import { ref, onMounted } from 'vue';
import * as templatesService from '../services/templates.js';

export function useTemplates() {
  const templates = ref([]);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Load all templates from the API
   */
  async function loadTemplates() {
    loading.value = true;
    error.value = null;

    try {
      const data = await templatesService.getTemplates();
      templates.value = data;
    } catch (err) {
      error.value = err.message || 'Failed to load templates';
      console.error('[useTemplates] Error loading templates:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get a specific template by ID
   * @param {string} id - Template ID
   * @returns {Promise<Object>} Template object
   */
  async function getTemplate(id) {
    try {
      return await templatesService.getTemplate(id);
    } catch (err) {
      error.value = err.message || 'Failed to load template';
      throw err;
    }
  }

  /**
   * Create a new template
   * @param {Object} templateData - Template data
   * @returns {Promise<Object>} Created template
   */
  async function createTemplate(templateData) {
    try {
      const created = await templatesService.createTemplate(templateData);
      await loadTemplates(); // Reload to get updated list
      return created;
    } catch (err) {
      error.value = err.message || 'Failed to create template';
      throw err;
    }
  }

  /**
   * Update an existing template
   * @param {string} id - Template ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated template
   */
  async function updateTemplate(id, updates) {
    try {
      const updated = await templatesService.updateTemplate(id, updates);
      await loadTemplates(); // Reload to get updated list
      return updated;
    } catch (err) {
      error.value = err.message || 'Failed to update template';
      throw err;
    }
  }

  /**
   * Delete a template
   * @param {string} id - Template ID
   */
  async function deleteTemplate(id) {
    try {
      await templatesService.deleteTemplate(id);
      await loadTemplates(); // Reload to get updated list
    } catch (err) {
      error.value = err.message || 'Failed to delete template';
      throw err;
    }
  }

  // Load templates on mount
  onMounted(() => {
    loadTemplates();
  });

  return {
    templates,
    loading,
    error,
    loadTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
