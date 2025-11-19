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

export function useReflections() {
  /**
   * Load all reflections from API
   */
  const loadReflections = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await reflectionsAPI.getAll();
      reflections.value = response.data.reflections || [];
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
      const response = await reflectionsAPI.create(reflectionData);
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

  // Computed properties
  const reflectionCount = computed(() => reflections.value.length);

  const hasReflections = computed(() => reflections.value.length > 0);

  return {
    // State
    reflections,
    loading,
    error,

    // Computed
    reflectionCount,
    hasReflections,

    // Methods
    loadReflections,
    createReflection,
    getReflectionById,
    updateReflectionAI,
    deleteReflection,
    deleteAllReflections,
  };
}
