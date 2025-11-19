import { z } from 'zod';

/**
 * CoachPersona entity
 * Represents a predefined coaching style/persona that formats reflections for external ChatGPT use
 */

export const CoachPersonaSchema = z.object({
  id: z.string().min(1, 'Persona ID is required'),
  name: z.string().min(1, 'Persona name is required'),
  style: z.string().min(1, 'Coaching style is required'),
  description: z.string().min(1, 'Description is required'),
  systemPrompt: z.string().min(1, 'System prompt is required'),
  icon: z.string().emoji('Icon must be a valid emoji'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color'),
  tags: z.array(z.string()).default([]),
});

export class CoachPersona {
  constructor(data) {
    const validated = CoachPersonaSchema.parse(data);
    Object.assign(this, validated);
  }

  /**
   * Formats a reflection with this persona's system prompt for ChatGPT
   * @param {string} reflectionText - The user's reflection text
   * @returns {string} - Formatted prompt for ChatGPT
   */
  formatPromptForChatGPT(reflectionText) {
    return `${this.systemPrompt}\n\n---\n\nMy reflection:\n\n${reflectionText}`;
  }

  /**
   * Validates persona data
   * @param {Object} data - Persona data to validate
   * @returns {Object} - Validation result {success: boolean, errors?: array}
   */
  static validate(data) {
    try {
      CoachPersonaSchema.parse(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      };
    }
  }
}
