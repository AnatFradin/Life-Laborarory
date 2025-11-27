import { describe, it, expect } from 'vitest';
import { CoachPersona } from '../../src/domain/entities/CoachPersona.js';

describe('CoachPersona Entity', () => {
  const validPersonaData = {
    id: 'test-coach',
    name: 'Test Coach',
    style: 'Testing Style',
    description: 'A coach for testing purposes',
    systemPrompt: 'You are a test coach. Provide helpful guidance.',
    icon: '🧪',
    color: '#FF5733',
    tags: ['test', 'coaching'],
  };

  describe('Validation', () => {
    it('should validate a valid persona', () => {
      const result = CoachPersona.validate(validPersonaData);
      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should reject persona without required id', () => {
      const invalid = { ...validPersonaData };
      delete invalid.id;
      expect(() => new CoachPersona(invalid)).toThrow();
    });

    it('should reject persona without required name', () => {
      const invalid = { ...validPersonaData };
      delete invalid.name;
      expect(() => new CoachPersona(invalid)).toThrow();
    });

    it('should reject persona without required systemPrompt', () => {
      const invalid = { ...validPersonaData };
      delete invalid.systemPrompt;
      expect(() => new CoachPersona(invalid)).toThrow();
    });

    it('should reject persona with empty systemPrompt', () => {
      const invalid = { ...validPersonaData, systemPrompt: '' };
      expect(() => new CoachPersona(invalid)).toThrow();
    });

    it('should reject persona with invalid color format', () => {
      const invalid = { ...validPersonaData, color: 'not-a-color' };
      expect(() => new CoachPersona(invalid)).toThrow();
    });

    it('should accept persona with valid hex color', () => {
      const valid = { ...validPersonaData, color: '#123ABC' };
      expect(() => new CoachPersona(valid)).not.toThrow();
    });

    it('should reject persona with non-array tags', () => {
      const invalid = { ...validPersonaData, tags: 'not-an-array' };
      expect(() => new CoachPersona(invalid)).toThrow();
    });
  });

  describe('formatPromptForChatGPT', () => {
    it('should format reflection with persona prompt', () => {
      const persona = new CoachPersona(validPersonaData);
      const reflection = 'Today I struggled with procrastination.';
      
      const formatted = persona.formatPromptForChatGPT(reflection);
      
      expect(formatted).toContain(persona.systemPrompt);
      expect(formatted).toContain(reflection);
      expect(formatted).toContain('My reflection:');
    });

    it('should handle multi-line reflections', () => {
      const persona = new CoachPersona(validPersonaData);
      const reflection = 'Line 1\nLine 2\nLine 3';
      
      const formatted = persona.formatPromptForChatGPT(reflection);
      
      expect(formatted).toContain('Line 1');
      expect(formatted).toContain('Line 2');
      expect(formatted).toContain('Line 3');
    });

    it('should include reflection text', () => {
      const persona = new CoachPersona(validPersonaData);
      const reflection = '   Extra spaces   ';
      
      const formatted = persona.formatPromptForChatGPT(reflection);
      
      expect(formatted).toContain('Extra spaces');
      expect(formatted).toContain('My reflection:');
    });
  });

  describe('Constructor', () => {
    it('should create persona with all properties', () => {
      const persona = new CoachPersona(validPersonaData);
      
      expect(persona.id).toBe(validPersonaData.id);
      expect(persona.name).toBe(validPersonaData.name);
      expect(persona.style).toBe(validPersonaData.style);
      expect(persona.description).toBe(validPersonaData.description);
      expect(persona.systemPrompt).toBe(validPersonaData.systemPrompt);
      expect(persona.icon).toBe(validPersonaData.icon);
      expect(persona.color).toBe(validPersonaData.color);
      expect(persona.tags).toEqual(validPersonaData.tags);
    });

    it('should validate data on construction', () => {
      const invalid = { ...validPersonaData, id: '' };
      expect(() => new CoachPersona(invalid)).toThrow();
    });
  });
});
