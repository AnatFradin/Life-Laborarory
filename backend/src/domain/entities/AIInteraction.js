import { z } from 'zod';

/**
 * AIInteraction Entity Schema
 * Represents a single AI request-response pair
 * 
 * Per data-model.md:
 * - Tracks which model/provider was used
 * - Records system prompt version for traceability
 * - Validates non-directive responses (enforced via system prompt)
 */
export const AIInteractionSchema = z.object({
  model: z.string().min(1, 'Model identifier is required'),
  provider: z.enum(['local', 'online'], {
    errorMap: () => ({ message: 'Provider must be local or online' }),
  }),
  prompt: z.string().min(1, 'Prompt cannot be empty'),
  response: z.string().min(1, 'Response cannot be empty'),
  timestamp: z.string().datetime('Invalid timestamp format'),
  systemPromptVersion: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'System prompt version must follow semantic versioning (e.g., 1.0.0)'),
});

/**
 * Validate AIInteraction data
 * @param {Object} data - Raw AI interaction data
 * @returns {Object} Validated AI interaction
 * @throws {z.ZodError} If validation fails
 */
export function validateAIInteraction(data) {
  return AIInteractionSchema.parse(data);
}

/**
 * Safe validation (returns result instead of throwing)
 * @param {Object} data - Raw AI interaction data
 * @returns {Object} { success: boolean, data?: Object, error?: ZodError }
 */
export function safeValidateAIInteraction(data) {
  return AIInteractionSchema.safeParse(data);
}

/**
 * Create a new AI interaction record
 * @param {Object} params
 * @param {string} params.model - Model identifier (e.g., 'llama2', 'gpt-4')
 * @param {string} params.provider - 'local' or 'online'
 * @param {string} params.prompt - User's reflection text
 * @param {string} params.response - AI's reflective response
 * @param {string} params.systemPromptVersion - Version of system prompt used
 * @returns {Object} Validated AI interaction
 */
export function createAIInteraction({ model, provider, prompt, response, systemPromptVersion }) {
  const interaction = {
    model,
    provider,
    prompt,
    response,
    timestamp: new Date().toISOString(),
    systemPromptVersion,
  };

  return validateAIInteraction(interaction);
}
