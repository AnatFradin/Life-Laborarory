import { describe, it, expect } from 'vitest';
import { 
  getAllPersonas, 
  getPersonaById, 
  isValidPersonaId,
  PREDEFINED_PERSONAS 
} from '../../src/domain/entities/predefined-personas.js';

describe('Predefined Personas', () => {
  describe('PREDEFINED_PERSONAS', () => {
    it('should have at least 6 personas', () => {
      expect(PREDEFINED_PERSONAS.length).toBeGreaterThanOrEqual(6);
    });

    it('should have unique persona IDs', () => {
      const ids = PREDEFINED_PERSONAS.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all required fields for each persona', () => {
      PREDEFINED_PERSONAS.forEach(persona => {
        expect(persona.id).toBeDefined();
        expect(persona.name).toBeDefined();
        expect(persona.style).toBeDefined();
        expect(persona.description).toBeDefined();
        expect(persona.systemPrompt).toBeDefined();
        expect(persona.icon).toBeDefined();
        expect(persona.color).toBeDefined();
        expect(Array.isArray(persona.tags)).toBe(true);
      });
    });

    it('should have non-empty system prompts', () => {
      PREDEFINED_PERSONAS.forEach(persona => {
        expect(persona.systemPrompt.length).toBeGreaterThanOrEqual(50);
      });
    });

    it('should have valid color hex codes', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      PREDEFINED_PERSONAS.forEach(persona => {
        expect(hexColorRegex.test(persona.color)).toBe(true);
      });
    });
  });

  describe('getAllPersonas', () => {
    it('should return all personas', () => {
      const personas = getAllPersonas();
      expect(personas.length).toBe(PREDEFINED_PERSONAS.length);
    });

    it('should return CoachPersona instances', () => {
      const personas = getAllPersonas();
      personas.forEach(persona => {
        expect(persona.formatPromptForChatGPT).toBeDefined();
        expect(typeof persona.formatPromptForChatGPT).toBe('function');
      });
    });
  });

  describe('getPersonaById', () => {
    it('should return correct persona for valid ID', () => {
      const personas = getAllPersonas();
      const firstPersona = personas[0];
      
      const found = getPersonaById(firstPersona.id);
      
      expect(found).toBeDefined();
      expect(found.id).toBe(firstPersona.id);
      expect(found.name).toBe(firstPersona.name);
    });

    it('should return null for invalid ID', () => {
      const found = getPersonaById('non-existent-persona');
      expect(found).toBeNull();
    });

    it('should return null for empty ID', () => {
      const found = getPersonaById('');
      expect(found).toBeNull();
    });

    it('should handle case-sensitive IDs', () => {
      const personas = getAllPersonas();
      const firstPersona = personas[0];
      
      const found = getPersonaById(firstPersona.id.toUpperCase());
      expect(found).toBeNull();
    });
  });

  describe('isValidPersonaId', () => {
    it('should return true for valid persona IDs', () => {
      const personas = getAllPersonas();
      personas.forEach(persona => {
        expect(isValidPersonaId(persona.id)).toBe(true);
      });
    });

    it('should return false for invalid persona ID', () => {
      expect(isValidPersonaId('non-existent')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidPersonaId('')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidPersonaId(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidPersonaId(undefined)).toBe(false);
    });
  });

  describe('Specific Personas', () => {
    it('should have Stoic Coach persona', () => {
      const stoic = getPersonaById('stoic-coach');
      expect(stoic).toBeDefined();
      expect(stoic.name).toContain('Stoic');
    });

    it('should have Benjamin Franklin persona', () => {
      const franklin = getPersonaById('benjamin-franklin');
      expect(franklin).toBeDefined();
      expect(franklin.name).toContain('Franklin');
    });

    it('should have Compassionate Listener persona', () => {
      const compassionate = getPersonaById('compassionate-listener');
      expect(compassionate).toBeDefined();
      expect(compassionate.name).toContain('Compassionate');
    });

    it('should have Socratic Questioner persona', () => {
      const socratic = getPersonaById('socratic-questioner');
      expect(socratic).toBeDefined();
      expect(socratic.name).toContain('Socratic');
    });

    it('should have Growth Mindset Coach persona', () => {
      const growth = getPersonaById('growth-mindset-coach');
      expect(growth).toBeDefined();
      expect(growth.name).toContain('Growth');
    });

    it('should have Mindfulness Guide persona', () => {
      const mindfulness = getPersonaById('mindfulness-guide');
      expect(mindfulness).toBeDefined();
      expect(mindfulness.name).toContain('Mindfulness');
    });
  });
});
