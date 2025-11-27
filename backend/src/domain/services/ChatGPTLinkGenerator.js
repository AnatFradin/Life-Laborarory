/**
 * ChatGPTLinkGenerator
 * Generates ChatGPT URLs with pre-filled prompts for coach personas
 */

/**
 * Generate a ChatGPT link with a pre-filled prompt
 * @param {string} reflectionText - The user's reflection text
 * @param {string} personaSystemPrompt - The persona's system prompt
 * @returns {string} - ChatGPT URL with encoded prompt
 */
export function generateChatGPTLink(reflectionText, personaSystemPrompt) {
  if (!reflectionText || typeof reflectionText !== 'string') {
    throw new Error('Reflection text is required and must be a string');
  }

  if (!personaSystemPrompt || typeof personaSystemPrompt !== 'string') {
    throw new Error('Persona system prompt is required and must be a string');
  }

  // Format the complete prompt: persona's system instructions + user's reflection
  const fullPrompt = `${personaSystemPrompt}\n\n---\n\nMy reflection:\n\n${reflectionText}`;

  // Encode the prompt for URL
  const encodedPrompt = encodeURIComponent(fullPrompt);

  // Generate ChatGPT URL with pre-filled query parameter
  // Using the ?q= parameter to pre-fill the message box
  return `https://chat.openai.com/?q=${encodedPrompt}`;
}

/**
 * Generate a ChatGPT link with persona formatting
 * @param {string} reflectionText - The user's reflection text
 * @param {Object} persona - CoachPersona instance or persona object with systemPrompt
 * @returns {string} - ChatGPT URL with encoded prompt
 */
export function generateChatGPTLinkForPersona(reflectionText, persona) {
  if (!persona || !persona.systemPrompt) {
    throw new Error('Persona must have a systemPrompt property');
  }

  return generateChatGPTLink(reflectionText, persona.systemPrompt);
}

/**
 * Validate inputs before generating link
 * @param {string} reflectionText - The user's reflection text
 * @param {string} personaSystemPrompt - The persona's system prompt
 * @returns {Object} - { valid: boolean, error?: string }
 */
export function validateLinkInputs(reflectionText, personaSystemPrompt) {
  if (!reflectionText || typeof reflectionText !== 'string') {
    return {
      valid: false,
      error: 'Reflection text is required and must be a string',
    };
  }

  if (reflectionText.trim().length === 0) {
    return {
      valid: false,
      error: 'Reflection text cannot be empty',
    };
  }

  if (!personaSystemPrompt || typeof personaSystemPrompt !== 'string') {
    return {
      valid: false,
      error: 'Persona system prompt is required and must be a string',
    };
  }

  if (personaSystemPrompt.trim().length === 0) {
    return {
      valid: false,
      error: 'Persona system prompt cannot be empty',
    };
  }

  return { valid: true };
}
