/**
 * useReflections composable - Reactive state for reflection management
 * 
 * Provides:
 * - reflections: reactive list of reflections
 * - loading: loading state
 * - error: error state
 * - loadReflections(): fetch all reflections
 * - createReflection(): create new reflection
 * - getReflectionById(): get specific reflection
 */

import { ref, computed } from 'vue';
import { reflectionsAPI } from '../services/api.js';

const reflections = ref([]);
const loading = ref(false);
const error = ref(null);
const hasMore = ref(true);
const currentPage = ref(0);

export function useReflections() {
  /**
   * Load all reflections from API
   * For backward compatibility, loads all reflections
   */
  const loadReflections = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await reflectionsAPI.getAll();
      reflections.value = response.data.reflections || [];
      hasMore.value = false;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to load reflections:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Load reflections with lazy loading by month (T100, FR-035)
   * Optimized for 1000+ entries
   * @param {boolean} reset - If true, reset pagination and load from beginning
   */
  const loadReflectionsLazy = async (reset = false) => {
    if (reset) {
      currentPage.value = 0;
      reflections.value = [];
      hasMore.value = true;
    }

    if (!hasMore.value) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await reflectionsAPI.getAll({
        page: currentPage.value,
        perPage: 50, // Load 50 at a time (roughly 1-2 months)
      });
      
      const newReflections = response.data.reflections || [];
      
      if (reset) {
        reflections.value = newReflections;
      } else {
        reflections.value.push(...newReflections);
      }

      // Check if there are more reflections
      hasMore.value = newReflections.length === 50;
      currentPage.value += 1;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to load reflections:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create new reflection
   * @param {Object} reflectionData - Reflection data
   * @returns {Promise<Object>} Created reflection
   */
  const createReflection = async (reflectionData) => {
    loading.value = true;
    error.value = null;

    try {
      let response;
      
      // Visual or mixed mode with images: use FormData
      if ((reflectionData.mode === 'visual' || reflectionData.mode === 'mixed') && 
          reflectionData.images && 
          reflectionData.images.length > 0) {
        const formData = new FormData();
        formData.append('mode', reflectionData.mode);
        
        // Add content for mixed mode
        if (reflectionData.mode === 'mixed' && reflectionData.content) {
          formData.append('content', reflectionData.content);
        }
        
        // Add multiple images
        const images = Array.isArray(reflectionData.images) ? reflectionData.images : [reflectionData.images];
        images.forEach((image) => {
          formData.append('images', image);
        });
        
        if (reflectionData.dimensions) {
          formData.append('dimensions', JSON.stringify(reflectionData.dimensions));
        }
        
        response = await reflectionsAPI.createVisual(formData);
      } 
      // Text mode: use JSON
      else {
        response = await reflectionsAPI.create(reflectionData);
      }
      
      const created = response.data;

      // Add to local state (at beginning since sorted desc)
      reflections.value.unshift(created);

      return created;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to create reflection:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Add images to an existing reflection
   * @param {string} id - Reflection ID
   * @param {Array<File>} images - Array of image files
   * @returns {Promise<Object>} Updated reflection
   */
  const addImagesToReflection = async (id, images) => {
    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await reflectionsAPI.addImages(id, formData);
      
      // Update local state
      const reflection = reflections.value.find((r) => r.id === id);
      if (reflection) {
        Object.assign(reflection, response.data);
      }

      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error(`Failed to add images to reflection ${id}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get reflection by ID
   * @param {string} id - Reflection ID
   * @returns {Promise<Object>} Reflection
   */
  const getReflectionById = async (id) => {
    // Check local state first
    const local = reflections.value.find((r) => r.id === id);
    if (local) {
      return local;
    }

    // Fetch from API
    loading.value = true;
    error.value = null;

    try {
      const response = await reflectionsAPI.getById(id);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error(`Failed to get reflection ${id}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update reflection with AI interaction
   * @param {string} id - Reflection ID
   * @param {Object} aiInteraction - AI interaction data
   */
  const updateReflectionAI = (id, aiInteraction) => {
    const reflection = reflections.value.find((r) => r.id === id);
    if (reflection) {
      reflection.aiInteraction = aiInteraction;
    }
  };

  /**
   * Delete reflection by ID
   * @param {string} id - Reflection ID
   * @returns {Promise<void>}
   */
  const deleteReflection = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      await reflectionsAPI.delete(id);

      // Remove from local state
      const index = reflections.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        reflections.value.splice(index, 1);
      }
    } catch (err) {
      error.value = err.message;
      console.error(`Failed to delete reflection ${id}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete all reflections (requires confirmation)
   * @param {string} confirmation - Must be "DELETE_ALL"
   * @returns {Promise<void>}
   */
  const deleteAllReflections = async (confirmation) => {
    loading.value = true;
    error.value = null;

    try {
      await reflectionsAPI.deleteAll(confirmation);

      // Clear local state
      reflections.value = [];
    } catch (err) {
      error.value = err.message;
      console.error('Failed to delete all reflections:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Attach external AI session metadata to an existing reflection
   * @param {string} id - Reflection ID
   * @param {Object} sessionData - { personaId, personaName, sessionSummary, chatGPTUrl }
   */
  const saveExternalAIResponse = async (id, sessionData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await reflectionsAPI.updateExternalSession(id, sessionData);

      // Update local state if present
      const reflection = reflections.value.find((r) => r.id === id);
      if (reflection) {
        reflection.externalAISession = response.data.externalAISession || response.data.externalAISession || sessionData;
      }

      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to save external AI session:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Computed properties
  const reflectionCount = computed(() => reflections.value.length);

  const hasReflections = computed(() => reflections.value.length > 0);

  return {
    // State
    reflections,
    loading,
    error,
    hasMore,

    // Computed
    reflectionCount,
    hasReflections,

    // Methods
    loadReflections,
    loadReflectionsLazy,
    createReflection,
    addImagesToReflection,
    getReflectionById,
    updateReflectionAI,
    deleteReflection,
    deleteAllReflections,
    saveExternalAIResponse,
  };
}
