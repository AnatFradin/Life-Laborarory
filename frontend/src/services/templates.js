/**
 * Templates Service - API client for reflection templates
 */

import apiClient from './api.js';

/**
 * Get all reflection templates
 * @returns {Promise<Array>} Array of template objects
 */
export async function getTemplates() {
  const response = await apiClient.get('/templates');
  return response.data.templates;
}

/**
 * Get a specific template by ID
 * @param {string} id - Template ID
 * @returns {Promise<Object>} Template object
 */
export async function getTemplate(id) {
  const response = await apiClient.get(`/templates/${id}`);
  return response.data;
}

/**
 * Create a new template
 * @param {Object} templateData - Template data
 * @param {string} templateData.id - Unique identifier
 * @param {string} templateData.name - Display name
 * @param {string} templateData.content - Markdown content
 * @param {string} [templateData.description] - Optional description
 * @param {string[]} [templateData.tags] - Optional tags
 * @param {boolean} [templateData.isDefault] - Whether this is a default template
 * @returns {Promise<Object>} Created template
 */
export async function createTemplate(templateData) {
  const response = await apiClient.post('/templates', templateData);
  return response.data;
}

/**
 * Update an existing template
 * @param {string} id - Template ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated template
 */
export async function updateTemplate(id, updates) {
  const response = await apiClient.put(`/templates/${id}`, updates);
  return response.data;
}

/**
 * Delete a template
 * @param {string} id - Template ID
 * @returns {Promise<void>}
 */
export async function deleteTemplate(id) {
  await apiClient.delete(`/templates/${id}`);
}

export default {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
