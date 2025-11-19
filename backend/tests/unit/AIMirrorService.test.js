/**
 * Unit tests for AIMirrorService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import AIMirrorService from '../../src/domain/services/AIMirrorService.js';

describe('AIMirrorService', () => {
  let mockProvider;
  let service;

  beforeEach(() => {
    // Create mock AI provider
    mockProvider = {
      generateResponse: vi.fn(),
      isAvailable: vi.fn(),
      getProviderName: vi.fn().mockReturnValue('test-provider'),
    };

    service = new AIMirrorService(mockProvider);
  });

  describe('generateReflection', () => {
    it('should generate AI mirror response successfully', async () => {
      const userReflection = 'I feel uncertain about my career path';
      const aiResponse = 'I notice some uncertainty about direction in your reflection';

      mockProvider.isAvailable.mockResolvedValue(true);
      mockProvider.generateResponse.mockResolvedValue(aiResponse);

      const result = await service.generateReflection(userReflection, { model: 'llama2' });

      expect(mockProvider.isAvailable).toHaveBeenCalled();
      expect(mockProvider.generateResponse).toHaveBeenCalledWith(
        expect.stringContaining(userReflection),
        expect.objectContaining({
          model: 'llama2',
          systemPrompt: expect.any(String),
        })
      );

      expect(result).toMatchObject({
        model: 'llama2',
        provider: 'test-provider',
        prompt: userReflection,
        response: aiResponse,
        timestamp: expect.any(String),
        systemPromptVersion: '1.0.0',
      });
    });

    it('should throw error if reflection text is empty', async () => {
      await expect(service.generateReflection('')).rejects.toThrow(
        'Reflection text is required'
      );

      expect(mockProvider.generateResponse).not.toHaveBeenCalled();
    });

    it('should throw error if AI provider is not available', async () => {
      mockProvider.isAvailable.mockResolvedValue(false);

      await expect(
        service.generateReflection('Test reflection')
      ).rejects.toThrow('AI provider is not available');

      expect(mockProvider.generateResponse).not.toHaveBeenCalled();
    });

    it('should use default model if not specified', async () => {
      mockProvider.isAvailable.mockResolvedValue(true);
      mockProvider.generateResponse.mockResolvedValue('Test response');

      const result = await service.generateReflection('Test reflection');

      expect(result.model).toBe('unknown');
    });

    it('should validate non-directive language', async () => {
      const userReflection = 'I feel stuck';
      
      // Test with directive language (should warn but still return)
      const directiveResponse = 'You should try meditation. You need to set boundaries.';
      
      mockProvider.isAvailable.mockResolvedValue(true);
      mockProvider.generateResponse.mockResolvedValue(directiveResponse);

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await service.generateReflection(userReflection);

      expect(result.response).toBe(directiveResponse);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Non-directive violation detected')
      );

      warnSpy.mockRestore();
    });

    it('should accept non-directive language', async () => {
      const userReflection = 'I feel stuck';
      const nonDirectiveResponse = 'I notice some feelings of being stuck in your reflection';

      mockProvider.isAvailable.mockResolvedValue(true);
      mockProvider.generateResponse.mockResolvedValue(nonDirectiveResponse);

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await service.generateReflection(userReflection);

      expect(result.response).toBe(nonDirectiveResponse);
      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });

  describe('setProvider', () => {
    it('should allow changing AI provider', () => {
      const newProvider = {
        generateResponse: vi.fn(),
        isAvailable: vi.fn(),
        getProviderName: vi.fn().mockReturnValue('new-provider'),
      };

      service.setProvider(newProvider);

      expect(service.aiProvider).toBe(newProvider);
    });
  });

  describe('_buildPrompt', () => {
    it('should build prompt with user reflection', () => {
      const userReflection = 'Test reflection';
      const prompt = service._buildPrompt(userReflection);

      expect(prompt).toContain(userReflection);
      expect(prompt).toContain('mirror');
    });
  });

  describe('_validateResponse', () => {
    it('should reject imperative language patterns', () => {
      const imperativeResponses = [
        'You should try this',
        'You must do that',
        'You need to change',
        'Try to be better',
        'Have you tried meditation',
        "Don't worry about it",
      ];

      imperativeResponses.forEach((response) => {
        expect(service._validateResponse(response)).toBe(false);
      });
    });

    it('should accept reflective language patterns', () => {
      const reflectiveResponses = [
        'I notice some uncertainty in your words',
        'It sounds like you are exploring different options',
        "I'm wondering if there's a pattern here",
        'It seems like this situation brings up complex feelings',
      ];

      reflectiveResponses.forEach((response) => {
        expect(service._validateResponse(response)).toBe(true);
      });
    });
  });
});
