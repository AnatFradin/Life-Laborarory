/**
 * Unit tests for useAIMirror composable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAIMirror } from '../../src/composables/useAIMirror.js';
import { aiAPI } from '../../src/services/api.js';

vi.mock('../../src/services/api.js', () => ({
  aiAPI: {
    generateMirror: vi.fn(),
  },
}));

describe('useAIMirror', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('generateMirrorResponse', () => {
    it('should generate AI response successfully', async () => {
      const reflectionText = 'I feel uncertain about the future';
      const mockResponse = {
        response: 'I notice some uncertainty in your words',
        model: 'llama2',
        provider: 'local',
      };

      aiAPI.generateMirror.mockResolvedValue({ data: mockResponse });

      const { generateMirrorResponse, generating, error } = useAIMirror();

      const result = await generateMirrorResponse(reflectionText);

      expect(aiAPI.generateMirror).toHaveBeenCalledWith(reflectionText, 'llama2');
      expect(generating.value).toBe(false);
      expect(error.value).toBeNull();
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty reflection text', async () => {
      const { generateMirrorResponse, error } = useAIMirror();

      try {
        await generateMirrorResponse('');
      } catch (err) {
        // Expected to throw
      }

      expect(aiAPI.generateMirror).not.toHaveBeenCalled();
      expect(error.value).toBe('Reflection text is required');
    });

    it('should handle whitespace-only reflection text', async () => {
      const { generateMirrorResponse, error } = useAIMirror();

      try {
        await generateMirrorResponse('   ');
      } catch (err) {
        // Expected to throw
      }

      expect(aiAPI.generateMirror).not.toHaveBeenCalled();
      expect(error.value).toBe('Reflection text is required');
    });

    it('should handle API errors', async () => {
      const errorMessage = 'AI service unavailable';
      aiAPI.generateMirror.mockRejectedValue(new Error(errorMessage));

      const { generateMirrorResponse, generating, error } = useAIMirror();

      try {
        await generateMirrorResponse('Test reflection');
      } catch (err) {
        // Expected to throw
      }

      expect(generating.value).toBe(false);
      expect(error.value).toBe(errorMessage);
    });

    it('should set generating state during request', async () => {
      const { generateMirrorResponse, generating } = useAIMirror();
      
      let generatingDuringRequest = false;
      aiAPI.generateMirror.mockImplementation(async () => {
        generatingDuringRequest = generating.value;
        return Promise.resolve({
          data: { response: 'Test', model: 'llama2', provider: 'local' },
        });
      });

      await generateMirrorResponse('Test reflection');

      expect(generatingDuringRequest).toBe(true);
      expect(generating.value).toBe(false); // Should be false after request completes
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      const { error, clearError } = useAIMirror();

      error.value = 'Test error';
      clearError();

      expect(error.value).toBeNull();
    });
  });
});
