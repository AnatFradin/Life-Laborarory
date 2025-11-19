/**
 * Unit tests for AIMirrorService
 * Updated for User Story 4 - multiple AI providers
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import AIMirrorService from '../../src/domain/services/AIMirrorService.js';
import { DEFAULT_PREFERENCES } from '../../src/domain/entities/UserPreferences.js';

describe('AIMirrorService', () => {
  let mockOllamaProvider;
  let mockOpenAIProvider;
  let mockAnthropicProvider;
  let service;
  let defaultPreferences;

  beforeEach(() => {
    // Create mock AI providers
    mockOllamaProvider = {
      generateResponse: vi.fn(),
      isAvailable: vi.fn(),
      getMetadata: vi.fn().mockReturnValue({ provider: 'ollama', type: 'local' }),
    };

    mockOpenAIProvider = {
      generateResponse: vi.fn(),
      isAvailable: vi.fn(),
      getMetadata: vi.fn().mockReturnValue({ provider: 'openai', type: 'online' }),
    };

    mockAnthropicProvider = {
      generateResponse: vi.fn(),
      isAvailable: vi.fn(),
      getMetadata: vi.fn().mockReturnValue({ provider: 'anthropic', type: 'online' }),
    };

    service = new AIMirrorService({
      ollama: mockOllamaProvider,
      openai: mockOpenAIProvider,
      anthropic: mockAnthropicProvider,
    });

    // Default preferences (local AI)
    defaultPreferences = { ...DEFAULT_PREFERENCES };
  });

  describe('generateReflection', () => {
    it('should generate AI mirror response successfully with local provider', async () => {
      const userReflection = 'I feel uncertain about my career path';
      const aiInteraction = {
        model: 'llama2',
        provider: 'ollama',
        prompt: userReflection,
        response: 'I notice some uncertainty about direction in your reflection',
        timestamp: new Date().toISOString(),
        systemPromptVersion: '1.0.0',
      };

      mockOllamaProvider.generateResponse.mockResolvedValue(aiInteraction);

      const result = await service.generateReflection(userReflection, defaultPreferences);

      expect(mockOllamaProvider.generateResponse).toHaveBeenCalledWith(
        expect.any(String), // system prompt
        userReflection
      );

      expect(result).toMatchObject({
        model: 'llama2',
        provider: 'ollama',
        prompt: userReflection,
        response: expect.stringContaining('uncertainty'),
        timestamp: expect.any(String),
        systemPromptVersion: '1.0.0',
      });
    });

    it('should throw error if reflection text is empty', async () => {
      await expect(service.generateReflection('', defaultPreferences)).rejects.toThrow(
        'Reflection text is required'
      );

      expect(mockOllamaProvider.generateResponse).not.toHaveBeenCalled();
    });

    it('should throw error if preferences are invalid', async () => {
      await expect(
        service.generateReflection('Test reflection', undefined)
      ).rejects.toThrow();
    });

    it('should use online provider when configured', async () => {
      const onlinePreferences = {
        ...defaultPreferences,
        aiProvider: 'online',
        onlineProvider: 'openai',
        onlineModel: 'gpt-3.5-turbo',
        hasAcknowledgedOnlineWarning: true,
      };

      const aiInteraction = {
        model: 'gpt-3.5-turbo',
        provider: 'openai',
        prompt: 'Test reflection',
        response: 'Test response',
        timestamp: new Date().toISOString(),
        systemPromptVersion: '1.0.0',
      };

      mockOpenAIProvider.generateResponse.mockResolvedValue(aiInteraction);

      const result = await service.generateReflection('Test reflection', onlinePreferences);

      expect(mockOpenAIProvider.generateResponse).toHaveBeenCalled();
      expect(result.provider).toBe('openai');
    });

    it('should validate non-directive language', async () => {
      const userReflection = 'I feel stuck';
      
      // Test with directive language (should warn but still return)
      const aiInteraction = {
        model: 'llama2',
        provider: 'ollama',
        prompt: userReflection,
        response: 'You should try meditation. You need to set boundaries.',
        timestamp: new Date().toISOString(),
        systemPromptVersion: '1.0.0',
      };
      
      mockOllamaProvider.generateResponse.mockResolvedValue(aiInteraction);

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await service.generateReflection(userReflection, defaultPreferences);

      expect(result.response).toContain('should');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Non-directive violation detected')
      );

      warnSpy.mockRestore();
    });

    it('should accept non-directive language', async () => {
      const userReflection = 'I feel stuck';
      const aiInteraction = {
        model: 'llama2',
        provider: 'ollama',
        prompt: userReflection,
        response: 'I notice some feelings of being stuck in your reflection',
        timestamp: new Date().toISOString(),
        systemPromptVersion: '1.0.0',
      };

      mockOllamaProvider.generateResponse.mockResolvedValue(aiInteraction);

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await service.generateReflection(userReflection, defaultPreferences);

      expect(result.response).toContain('notice');
      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });

  describe('selectProvider', () => {
    it('should select local provider by default', () => {
      const provider = service.selectProvider(defaultPreferences);
      expect(provider).toBe(mockOllamaProvider);
    });

    it('should select online provider when configured', () => {
      const onlinePreferences = {
        ...defaultPreferences,
        aiProvider: 'online',
        onlineProvider: 'openai',
        hasAcknowledgedOnlineWarning: true,
        onlineModel: 'gpt-3.5-turbo',
      };

      const provider = service.selectProvider(onlinePreferences);
      expect(provider).toBe(mockOpenAIProvider);
    });

    it('should throw error if online provider not acknowledged', () => {
      const onlinePreferences = {
        ...defaultPreferences,
        aiProvider: 'online',
        onlineProvider: 'openai',
        hasAcknowledgedOnlineWarning: false,
      };

      expect(() => service.selectProvider(onlinePreferences)).toThrow(
        'Cannot use online AI without acknowledging privacy'
      );
    });

    it('should throw error if provider not available', () => {
      const serviceWithoutOllama = new AIMirrorService({
        ollama: null,
        openai: mockOpenAIProvider,
      });

      expect(() => serviceWithoutOllama.selectProvider(defaultPreferences)).toThrow(
        'Local AI (Ollama) is not available'
      );
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
