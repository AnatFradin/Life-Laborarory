import { z } from 'zod';

/**
 * UserPreferences Entity Schema
 * User settings for AI model choice, privacy level, and UI preferences
 * 
 * Per data-model.md:
 * - Default aiProvider is always 'local' (Ollama)
 * - Cannot use online AI without acknowledging privacy warning
 * - State machine validation prevents unsafe configurations
 */
export const UserPreferencesSchema = z
  .object({
    aiProvider: z.enum(['local', 'online'], {
      errorMap: () => ({ message: 'AI provider must be local or online' }),
    }),
    localModel: z.string().min(1).optional(),
    onlineModel: z.string().nullable(),
    onlineProvider: z.enum(['openai', 'anthropic']).nullable(),
    hasAcknowledgedOnlineWarning: z.boolean(),
    language: z
      .string()
      .length(2, 'Language must be ISO 639-1 code (2 characters)')
      .regex(/^[a-z]{2}$/, 'Language must be lowercase ISO 639-1 code'),
    theme: z.enum(['calm-light', 'calm-dark'], {
      errorMap: () => ({ message: 'Theme must be calm-light or calm-dark' }),
    }),
  })
  .refine(
    data => {
      // State machine rule: Cannot use online AI without acknowledging warning
      if (data.aiProvider === 'online') {
        return data.hasAcknowledgedOnlineWarning && data.onlineModel !== null;
      }
      return true;
    },
    {
      message:
        'Cannot use online AI without acknowledging privacy warning and selecting a model',
      path: ['aiProvider'],
    }
  );

/**
 * Default user preferences (safe defaults per FR-014, FR-019)
 */
export const DEFAULT_PREFERENCES = {
  aiProvider: 'local',
  localModel: 'llama2',
  onlineModel: null,
  onlineProvider: null,
  hasAcknowledgedOnlineWarning: false,
  language: 'en',
  theme: 'calm-light',
};

/**
 * Validate user preferences
 * @param {Object} data - Raw preferences data
 * @returns {Object} Validated preferences
 * @throws {z.ZodError} If validation fails
 */
export function validateUserPreferences(data) {
  return UserPreferencesSchema.parse(data);
}

/**
 * Safe validation (returns result instead of throwing)
 * @param {Object} data - Raw preferences data
 * @returns {Object} { success: boolean, data?: Object, error?: ZodError }
 */
export function safeValidateUserPreferences(data) {
  return UserPreferencesSchema.safeParse(data);
}

/**
 * Merge partial preferences with defaults
 * @param {Object} partial - Partial preferences
 * @returns {Object} Complete validated preferences
 */
export function mergeWithDefaults(partial = {}) {
  const merged = { ...DEFAULT_PREFERENCES, ...partial };
  return validateUserPreferences(merged);
}

/**
 * Check if user can use online AI (has acknowledged warning)
 * @param {Object} preferences - User preferences
 * @returns {boolean}
 */
export function canUseOnlineAI(preferences) {
  return preferences.hasAcknowledgedOnlineWarning && preferences.onlineModel !== null;
}
