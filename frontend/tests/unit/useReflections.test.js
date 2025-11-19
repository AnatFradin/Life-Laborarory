/**
 * Unit tests for useReflections composable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useReflections } from '../../src/composables/useReflections.js';
import { reflectionsAPI } from '../../src/services/api.js';

vi.mock('../../src/services/api.js', () => ({
  reflectionsAPI: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    deleteAll: vi.fn(),
  },
}));

describe('useReflections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('loadReflections', () => {
    it('should load reflections successfully', async () => {
      const mockReflections = [
        { id: '1', content: 'Test 1', timestamp: '2024-01-01T00:00:00.000Z' },
        { id: '2', content: 'Test 2', timestamp: '2024-01-02T00:00:00.000Z' },
      ];

      reflectionsAPI.getAll.mockResolvedValue({ data: { reflections: mockReflections } });

      const { loadReflections, reflections, loading, error } = useReflections();
      
      await loadReflections();

      expect(reflectionsAPI.getAll).toHaveBeenCalled();
      expect(reflections.value).toEqual(mockReflections);
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('should handle load errors', async () => {
      const { loadReflections, reflections, error } = useReflections();
      
      // Clear any previous data from shared state
      reflections.value = [];
      
      const errorMessage = 'Network error';
      reflectionsAPI.getAll.mockRejectedValue(new Error(errorMessage));
      
      await loadReflections();

      expect(reflections.value).toEqual([]);
      expect(error.value).toBe(errorMessage);
    });
  });

  describe('createReflection', () => {
    it('should create reflection successfully', async () => {
      const newReflection = {
        mode: 'text',
        content: 'New reflection',
      };

      const createdReflection = {
        id: 'new-id',
        timestamp: '2024-01-03T00:00:00.000Z',
        ...newReflection,
      };

      reflectionsAPI.create.mockResolvedValue({ data: createdReflection });

      const { createReflection, reflections, error } = useReflections();
      
      const result = await createReflection(newReflection);

      expect(reflectionsAPI.create).toHaveBeenCalledWith(newReflection);
      expect(reflections.value).toContainEqual(createdReflection);
      expect(error.value).toBeNull();
      expect(result).toEqual(createdReflection);
    });

  });

  describe('getReflectionById', () => {
    it('should get reflection from cache if available', async () => {
      const mockReflection = {
        id: 'test-id',
        content: 'Cached reflection',
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      const { reflections, getReflectionById } = useReflections();
      reflections.value = [mockReflection];

      const result = await getReflectionById('test-id');

      expect(reflectionsAPI.getById).not.toHaveBeenCalled();
      expect(result).toEqual(mockReflection);
    });

    it('should fetch reflection from API if not in cache', async () => {
      const { reflections, getReflectionById } = useReflections();
      
      // Clear cache to ensure API is called
      reflections.value = [];
      
      const mockReflection = {
        id: 'test-id',
        content: 'API reflection',
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      reflectionsAPI.getById.mockResolvedValue({ data: mockReflection });
      
      const result = await getReflectionById('test-id');

      expect(reflectionsAPI.getById).toHaveBeenCalledWith('test-id');
      expect(result).toEqual(mockReflection);
    });
  });

  describe('updateReflectionAI', () => {
    it('should update reflection with AI interaction', () => {
      const existingReflection = {
        id: 'test-id',
        content: 'Original',
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      const aiInteraction = {
        timestamp: '2024-01-01T01:00:00.000Z',
        provider: 'local',
        model: 'llama2',
        response: 'AI response',
      };

      const { reflections, updateReflectionAI } = useReflections();
      reflections.value = [existingReflection];

      updateReflectionAI('test-id', aiInteraction);

      expect(reflections.value[0].aiInteraction).toEqual(aiInteraction);
    });

    it('should not update if reflection not found', () => {
      const aiInteraction = {
        timestamp: '2024-01-01T01:00:00.000Z',
        provider: 'local',
        model: 'llama2',
        response: 'AI response',
      };

      const { reflections, updateReflectionAI } = useReflections();
      reflections.value = [];
      
      updateReflectionAI('non-existent', aiInteraction);

      expect(reflections.value).toEqual([]);
    });
  });
});
