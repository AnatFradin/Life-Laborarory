import { describe, it, expect } from 'vitest';
import {
  generateChatGPTLink,
  generateChatGPTLinkForPersona,
  validateLinkInputs,
} from '../../src/domain/services/ChatGPTLinkGenerator.js';
import { getPersonaById } from '../../src/domain/entities/predefined-personas.js';

describe('ChatGPTLinkGenerator', () => {
  describe('validateLinkInputs', () => {
    it('should validate correct inputs', () => {
      const result = validateLinkInputs('My reflection text', 'System prompt here');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should allow empty reflection text', () => {
      const result = validateLinkInputs('', 'System prompt');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should allow whitespace-only reflection text', () => {
      const result = validateLinkInputs('   ', 'System prompt');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty system prompt', () => {
      const result = validateLinkInputs('My reflection', '');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('system prompt');
    });

    it('should reject whitespace-only system prompt', () => {
      const result = validateLinkInputs('My reflection', '   ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('system prompt');
    });

    it('should reject non-string reflection text', () => {
      const result = validateLinkInputs(123, 'System prompt');
      expect(result.valid).toBe(false);
    });

    it('should reject non-string system prompt', () => {
      const result = validateLinkInputs('My reflection', null);
      expect(result.valid).toBe(false);
    });
  });

  describe('generateChatGPTLink', () => {
    it('should generate valid ChatGPT URL', () => {
      const reflection = 'Today I felt anxious about work.';
      const systemPrompt = 'You are a helpful coach.';
      
      const url = generateChatGPTLink(reflection, systemPrompt);
      
      expect(url).toContain('https://chat.openai.com');
      expect(url).toContain('?q=');
    });

    it('should URL-encode the prompt', () => {
      const reflection = 'Question: How do I improve?';
      const systemPrompt = 'Be helpful & supportive!';
      
      const url = generateChatGPTLink(reflection, systemPrompt);
      
      // URL should start with base and have encoded query parameter
      expect(url).toContain('https://chat.openai.com/?q=');
      // Check that special characters in the query part are encoded
      const queryPart = url.split('?q=')[1];
      expect(queryPart).toContain('%20'); // space encoded
      expect(queryPart).toContain('%26'); // & encoded
      expect(queryPart).toContain('%3A'); // : encoded
    });

    it('should combine system prompt and reflection', () => {
      const reflection = 'My reflection';
      const systemPrompt = 'My system prompt';
      
      const url = generateChatGPTLink(reflection, systemPrompt);
      const decodedUrl = decodeURIComponent(url);
      
      expect(decodedUrl).toContain('My system prompt');
      expect(decodedUrl).toContain('My reflection');
    });

    it('should handle multi-line reflections', () => {
      const reflection = 'Line 1\nLine 2\nLine 3';
      const systemPrompt = 'System prompt';
      
      const url = generateChatGPTLink(reflection, systemPrompt);
      
      expect(url).toBeDefined();
      expect(url).toContain('https://chat.openai.com');
    });

    it('should handle special characters', () => {
      const reflection = "Today's reflection: 100% effort!";
      const systemPrompt = 'Coach with empathy & wisdom';
      
      const url = generateChatGPTLink(reflection, systemPrompt);
      
      expect(url).toBeDefined();
      expect(url).toContain('https://chat.openai.com');
    });

    it('should throw error for invalid inputs', () => {
      expect(() => generateChatGPTLink('', 'prompt')).toThrow();
      expect(() => generateChatGPTLink('text', '')).toThrow();
    });
  });

  describe('generateChatGPTLinkForPersona', () => {
    it('should generate link with persona system prompt', () => {
      const persona = getPersonaById('stoic-coach');
      const reflection = 'I am struggling with change.';
      
      const url = generateChatGPTLinkForPersona(reflection, persona);
      
      expect(url).toContain('https://chat.openai.com');
      expect(url).toContain('?q=');
    });

    it('should use persona formatPromptForChatGPT method', () => {
      const persona = getPersonaById('compassionate-listener');
      const reflection = 'I feel overwhelmed.';
      
      const url = generateChatGPTLinkForPersona(reflection, persona);
      const decodedUrl = decodeURIComponent(url);
      
      // Should contain parts of the persona's system prompt
      expect(decodedUrl.length).toBeGreaterThan(reflection.length);
    });

    it('should work with all predefined personas', () => {
      const personaIds = [
        'stoic-coach',
        'benjamin-franklin',
        'compassionate-listener',
        'socratic-questioner',
        'growth-mindset-coach',
        'mindfulness-guide',
      ];

      personaIds.forEach(id => {
        const persona = getPersonaById(id);
        if (persona) {
          const url = generateChatGPTLinkForPersona('Test reflection', persona);
          expect(url).toContain('https://chat.openai.com');
        }
      });
    });

    it('should throw error for null persona', () => {
      expect(() => generateChatGPTLinkForPersona('text', null)).toThrow();
    });

    it('should throw error for empty reflection', () => {
      const persona = getPersonaById('stoic-coach');
      expect(() => generateChatGPTLinkForPersona('', persona)).toThrow();
    });
  });

  describe('URL Structure', () => {
    it('should start with ChatGPT base URL', () => {
      const url = generateChatGPTLink('reflection', 'prompt');
      expect(url.startsWith('https://chat.openai.com')).toBe(true);
    });

    it('should have query parameter', () => {
      const url = generateChatGPTLink('reflection', 'prompt');
      expect(url).toContain('?q=');
    });

    it('should be a valid URL', () => {
      const url = generateChatGPTLink('reflection', 'prompt');
      expect(() => new URL(url)).not.toThrow();
    });
  });
});
