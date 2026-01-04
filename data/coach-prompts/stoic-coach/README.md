# Stoic Coach Prompts

This folder contains prompt variants for the Stoic Coach persona.

## Adding New Prompts

You can add new prompts by creating JSON files in this folder. Each file should contain a single prompt object with the following structure:

```json
{
  "id": "unique-prompt-id",
  "title": "Prompt Title",
  "description": "Brief description of when to use this prompt",
  "tags": ["tag1", "tag2", "tag3"],
  "isDefault": false,
  "systemPrompt": "The full system prompt that defines the coach's behavior and approach..."
}
```

### Field Requirements:

- **id**: Unique identifier using lowercase letters, numbers, and hyphens only (e.g., `stoic-morning-reflection`)
- **title**: Short, descriptive title (e.g., "Morning Reflection")
- **description**: 1-2 sentences explaining when to use this prompt
- **tags**: Array of relevant keywords for filtering
- **isDefault**: Boolean - only ONE prompt per coach should have `true`
- **systemPrompt**: At least 50 characters, defines the coaching approach

### Example:

See existing `.json` files in this folder for examples.

### Tips:

- Use descriptive IDs that start with the persona name (e.g., `stoic-evening-review`)
- Keep system prompts focused and clear
- Test your prompts with the chat feature before finalizing
- Only set one prompt as default - this is the one users see first
