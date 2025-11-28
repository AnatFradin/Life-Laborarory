/**
 * Unit tests for useRephrasing composable
 * Tests AI rephrasing functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useRephrasing } from '@/composables/useRephrasing.js';
import * as api from '@/services/api.js';

// Mock API
vi.mock('@/services/api.js', () => ({
  aiAPI: {
    rephrase: vi.fn(),
  },
}));

describe('useRephrasing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requestRephrase', () => {
    it('should call API with correct payload', async () => {
      const mockResponse = {
        originalText: 'I feel confused',
        style: 'clearer',
        suggestions: ['I feel uncertain', 'I feel unsure'],
        timestamp: '2025-11-28T10:00:00Z',
        provider: 'ollama',
        model: 'llama2',
      };

      api.aiAPI.rephrase.mockResolvedValue({ data: mockResponse });

      const { requestRephrase } = useRephrasing();
      const result = await requestRephrase('I feel confused', 'clearer');

      expect(api.aiAPI.rephrase).toHaveBeenCalledWith('I feel confused', 'clearer');
      expect(result).toEqual(mockResponse);
    });

    it('should update loading state during request', async () => {
      const mockResponse = {
        originalText: 'Test',
        style: 'clearer',
        suggestions: ['Test 1', 'Test 2'],
        timestamp: '2025-11-28T10:00:00Z',
        provider: 'ollama',
        model: 'llama2',
      };

      // Delay the API response to test loading state
      api.aiAPI.rephrase.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: mockResponse }), 50))
      );

      const { requestRephrase, loading } = useRephrasing();

      expect(loading.value).toBe(false);

      const promise = requestRephrase('Test', 'clearer');
      expect(loading.value).toBe(true);

      await promise;
      expect(loading.value).toBe(false);
    });

    it('should populate suggestions on successful response', async () => {
      const mockResponse = {
        originalText: 'Original text',
        style: 'more-positive',
        suggestions: ['Positive version 1', 'Positive version 2', 'Positive version 3'],
        timestamp: '2025-11-28T10:00:00Z',
        provider: 'ollama',
        model: 'llama2',
      };

      api.aiAPI.rephrase.mockResolvedValue({ data: mockResponse });

      const { requestRephrase, suggestions } = useRephrasing();

      expect(suggestions.value).toEqual([]);

      await requestRephrase('Original text', 'more-positive');

      expect(suggestions.value).toEqual(mockResponse.suggestions);
    });

    it('should set error state on API failure', async () => {
      const errorMessage = 'AI service unavailable';
      api.aiAPI.rephrase.mockRejectedValue(new Error(errorMessage));

      const { requestRephrase, error, suggestions } = useRephrasing();

      expect(error.value).toBeNull();

      await expect(requestRephrase('Test', 'clearer')).rejects.toThrow(errorMessage);

      expect(error.value).toBe(errorMessage);
      expect(suggestions.value).toEqual([]);
    });

    it('should clear error on new request', async () => {
      // First request fails
      api.aiAPI.rephrase.mockRejectedValueOnce(new Error('First error'));

      const { requestRephrase, error } = useRephrasing();

      await expect(requestRephrase('Test', 'clearer')).rejects.toThrow();
      expect(error.value).toBe('First error');

      // Second request succeeds
      const mockResponse = {
        originalText: 'Test',
        style: 'clearer',
        suggestions: ['Test 1'],
        timestamp: '2025-11-28T10:00:00Z',
        provider: 'ollama',
        model: 'llama2',
      };
      api.aiAPI.rephrase.mockResolvedValue({ data: mockResponse });

      await requestRephrase('Test', 'clearer');
      expect(error.value).toBeNull();
    });

    it('should handle empty text gracefully', async () => {
      const { requestRephrase, error } = useRephrasing();

      await expect(requestRephrase('', 'clearer')).rejects.toThrow();
      expect(error.value).toBeDefined();
    });

    it('should support all three rephrasing styles', async () => {
      const mockResponse = (style) => ({
        originalText: 'Test',
        style,
        suggestions: [`${style} version`],
        timestamp: '2025-11-28T10:00:00Z',
        provider: 'ollama',
        model: 'llama2',
      });

      api.aiAPI.rephrase.mockResolvedValue({ data: mockResponse('clearer') });

      const { requestRephrase } = useRephrasing();

      // Test clearer
      await requestRephrase('Test', 'clearer');
      expect(api.aiAPI.rephrase).toHaveBeenCalledWith('Test', 'clearer');

      // Test more-positive
      api.aiAPI.rephrase.mockResolvedValue({ data: mockResponse('more-positive') });
      await requestRephrase('Test', 'more-positive');
      expect(api.aiAPI.rephrase).toHaveBeenCalledWith('Test', 'more-positive');

      // Test more-constructive
      api.aiAPI.rephrase.mockResolvedValue({ data: mockResponse('more-constructive') });
      await requestRephrase('Test', 'more-constructive');
      expect(api.aiAPI.rephrase).toHaveBeenCalledWith('Test', 'more-constructive');
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      api.aiAPI.rephrase.mockRejectedValue(new Error('Test error'));

      const { requestRephrase, error, clearError } = useRephrasing();

      await expect(requestRephrase('Test', 'clearer')).rejects.toThrow();
      expect(error.value).toBe('Test error');

      clearError();
      expect(error.value).toBeNull();
    });
  });

  describe('clearSuggestions', () => {
    it('should clear suggestions state', async () => {
      const mockResponse = {
        originalText: 'Test',
        style: 'clearer',
        suggestions: ['Suggestion 1', 'Suggestion 2'],
        timestamp: '2025-11-28T10:00:00Z',
        provider: 'ollama',
        model: 'llama2',
      };

      api.aiAPI.rephrase.mockResolvedValue({ data: mockResponse });

      const { requestRephrase, suggestions, clearSuggestions } = useRephrasing();

      await requestRephrase('Test', 'clearer');
      expect(suggestions.value).toHaveLength(2);

      clearSuggestions();
      expect(suggestions.value).toEqual([]);
    });
  });
});
