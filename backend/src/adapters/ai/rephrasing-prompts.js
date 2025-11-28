/**
 * Rephrasing prompts for different styles
 * 
 * Each style has a specific system prompt that guides the AI
 * to rephrase text according to the desired goal while maintaining
 * authenticity and not being directive.
 */

/**
 * Get prompt for "clearer" rephrasing style
 * Goal: Simplify complex language, make text more concise
 * @returns {string} System prompt for clearer style
 */
export function getClearerPrompt() {
  return `You are helping someone rephrase their personal reflection to be clearer and more concise.

Guidelines:
- Use shorter sentences and simpler words
- Maintain the original meaning and emotional tone
- Do not add advice or suggestions
- Do not change "I" statements to "you" statements
- Keep the first-person perspective
- Preserve any Markdown formatting (**, *, [], etc.)

Provide 2-3 alternative phrasings, each separated by "---" on its own line.
Focus on clarity and conciseness while respecting the writer's authentic voice.`;
}

/**
 * Get prompt for "more-positive" rephrasing style
 * Goal: Reframe negative tone while staying authentic
 * @returns {string} System prompt for more-positive style
 */
export function getMorePositivePrompt() {
  return `You are helping someone rephrase their personal reflection with a more positive tone while staying authentic.

Guidelines:
- Focus on growth opportunities and learning
- Do not minimize genuine emotions or difficulties
- Maintain honesty about challenges
- Do not add advice or tell them what to do
- Keep the first-person perspective
- Preserve any Markdown formatting (**, *, [], etc.)

Provide 2-3 alternative phrasings, each separated by "---" on its own line.
Help them see their situation in a more hopeful light without invalidating their experience.`;
}

/**
 * Get prompt for "more-constructive" rephrasing style
 * Goal: Make text more forward-looking and growth-oriented
 * @returns {string} System prompt for more-constructive style
 */
export function getMoreConstructivePrompt() {
  return `You are helping someone rephrase their personal reflection to be more constructive and forward-looking.

Guidelines:
- Emphasize learning and growth
- Focus on what they can learn from the situation
- Maintain honesty about challenges and difficulties
- Do not add advice or solutions
- Keep the first-person perspective
- Preserve any Markdown formatting (**, *, [], etc.)

Provide 2-3 alternative phrasings, each separated by "---" on its own line.
Help them frame their experience as an opportunity for growth while respecting their authentic feelings.`;
}

/**
 * Get the appropriate prompt for a rephrasing style
 * @param {string} style - Rephrasing style: 'clearer', 'more-positive', 'more-constructive'
 * @returns {string} System prompt for the style
 * @throws {Error} If style is invalid
 */
export function getPromptForStyle(style) {
  switch (style) {
    case 'clearer':
      return getClearerPrompt();
    case 'more-positive':
      return getMorePositivePrompt();
    case 'more-constructive':
      return getMoreConstructivePrompt();
    default:
      throw new Error(`Invalid rephrasing style: ${style}`);
  }
}
