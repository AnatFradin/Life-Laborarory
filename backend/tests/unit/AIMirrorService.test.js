/**
 * Unit tests for AIMirrorService
 * Updated for User St      const result = await service.generateReflection(userReflection, defaultPreferences);

      expect(mockOllamaProvider.generateResponse).toHaveBeenCalledWith(
        expect.any(String), // system prompt
        userReflection,
        { model: 'llama2' } // model options object
      ); multiple AI providers
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
      getProviderName: vi.fn().mockReturnValue('ollama'),
    };

    mockOpenAIProvider = {
      generateResponse: vi.fn(),
      isAvailable: vi.fn(),
      getMetadata: vi.fn().mockReturnValue({ provider: 'openai', type: 'online' }),
      getProviderName: vi.fn().mockReturnValue('openai'),
    };

    mockAnthropicProvider = {
      generateResponse: vi.fn(),
      isAvailable: vi.fn(),
      getMetadata: vi.fn().mockReturnValue({ provider: 'anthropic', type: 'online' }),
      getProviderName: vi.fn().mockReturnValue('anthropic'),
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
        userReflection,
        { model: 'llama2' } // model options object
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

  describe('rephrase', () => {
    it('should rephrase text successfully with clearer style', async () => {
      const originalText = 'I am feeling really confused about what to do next';
      const mockSuggestions = [
        'I feel uncertain about my next steps',
        'I am unsure about what to do next',
      ];
      const mockResponse = mockSuggestions.join('\n---\n');

      mockOllamaProvider.generateResponse.mockResolvedValue(mockResponse);

      const result = await service.rephrase(originalText, 'clearer', defaultPreferences);

      expect(result).toMatchObject({
        originalText,
        style: 'clearer',
        suggestions: mockSuggestions,
        timestamp: expect.any(String),
        provider: 'ollama',
        model: 'llama2',
      });

      expect(mockOllamaProvider.generateResponse).toHaveBeenCalledWith(
        expect.stringContaining(originalText),
        expect.objectContaining({
          model: 'llama2',
          systemPrompt: expect.stringContaining('clear')
        })
      );
    });

    it('should rephrase text with more-positive style', async () => {
      const originalText = 'I failed at this task again';
      const mockSuggestions = [
        'I am learning from this experience',
        'This is an opportunity to grow',
      ];
      const mockResponse = mockSuggestions.join('\n---\n');

      mockOllamaProvider.generateResponse.mockResolvedValue(mockResponse);

      const result = await service.rephrase(originalText, 'more-positive', defaultPreferences);

      expect(result.style).toBe('more-positive');
      expect(result.suggestions).toEqual(mockSuggestions);
      expect(mockOllamaProvider.generateResponse).toHaveBeenCalledWith(
        expect.stringContaining(originalText),
        expect.objectContaining({
          model: 'llama2',
          systemPrompt: expect.stringContaining('positive')
        })
      );
    });

    it('should rephrase text with more-constructive style', async () => {
      const originalText = 'I keep making the same mistakes';
      const mockSuggestions = [
        'I am noticing a pattern I can learn from',
        'I am becoming aware of what I want to change',
      ];
      const mockResponse = mockSuggestions.join('\n---\n');

      mockOllamaProvider.generateResponse.mockResolvedValue(mockResponse);

      const result = await service.rephrase(originalText, 'more-constructive', defaultPreferences);

      expect(result.style).toBe('more-constructive');
      expect(result.suggestions).toEqual(mockSuggestions);
      expect(mockOllamaProvider.generateResponse).toHaveBeenCalledWith(
        expect.stringContaining(originalText),
        expect.objectContaining({
          model: 'llama2',
          systemPrompt: expect.stringContaining('constructive')
        })
      );
    });

    it('should throw error if text is empty', async () => {
      await expect(service.rephrase('', 'clearer', defaultPreferences)).rejects.toThrow(
        'Text is required for rephrasing'
      );

      expect(mockOllamaProvider.generateResponse).not.toHaveBeenCalled();
    });

    it('should throw error if text is too long (> 5000 chars)', async () => {
      const longText = 'a'.repeat(5001);

      await expect(service.rephrase(longText, 'clearer', defaultPreferences)).rejects.toThrow(
        'Text is too long for rephrasing'
      );

      expect(mockOllamaProvider.generateResponse).not.toHaveBeenCalled();
    });

    it('should throw error for invalid style', async () => {
      await expect(
        service.rephrase('Some text', 'invalid-style', defaultPreferences)
      ).rejects.toThrow('Invalid rephrasing style');

      expect(mockOllamaProvider.generateResponse).not.toHaveBeenCalled();
    });

    it('should use online provider when configured', async () => {
      const onlinePreferences = {
        ...defaultPreferences,
        aiProvider: 'online',
        onlineProvider: 'openai',
        onlineModel: 'gpt-3.5-turbo',
        hasAcknowledgedOnlineWarning: true,
      };

      const mockSuggestions = ['Clearer version 1', 'Clearer version 2'];
      const mockResponse = mockSuggestions.join('\n---\n');

      mockOpenAIProvider.generateResponse.mockResolvedValue(mockResponse);

      const result = await service.rephrase('Some text', 'clearer', onlinePreferences);

      expect(result.provider).toBe('openai');
      expect(result.model).toBe('gpt-3.5-turbo');
      expect(mockOpenAIProvider.generateResponse).toHaveBeenCalled();
    });

    it('should preserve Markdown formatting in suggestions', async () => {
      const originalText = 'I am feeling **very** confused';
      const mockSuggestions = [
        'I am feeling **quite** uncertain',
        'I feel **deeply** unsure',
      ];
      const mockResponse = mockSuggestions.join('\n---\n');

      mockOllamaProvider.generateResponse.mockResolvedValue(mockResponse);

      const result = await service.rephrase(originalText, 'clearer', defaultPreferences);

      expect(result.suggestions[0]).toContain('**');
      expect(result.suggestions[1]).toContain('**');
    });

    it('should handle AI response with multiple suggestions separated by ---', async () => {
      const mockSuggestions = [
        'Suggestion one',
        'Suggestion two',
        'Suggestion three',
      ];
      const mockResponse = mockSuggestions.join('\n---\n');

      mockOllamaProvider.generateResponse.mockResolvedValue(mockResponse);

      const result = await service.rephrase('Some text', 'clearer', defaultPreferences);

      expect(result.suggestions).toHaveLength(3);
      expect(result.suggestions).toEqual(mockSuggestions);
    });

    it('should handle AI response with single suggestion (no separator)', async () => {
      const mockResponse = 'Single suggestion text';

      mockOllamaProvider.generateResponse.mockResolvedValue(mockResponse);

      const result = await service.rephrase('Some text', 'clearer', defaultPreferences);

      expect(result.suggestions).toHaveLength(1);
      expect(result.suggestions[0]).toBe(mockResponse);
    });
  });
});
