import express from 'express';
import { getAllPersonas, getPersonaById, isValidPersonaId } from '../../../domain/entities/predefined-personas.js';
import { generateChatGPTLink, generateChatGPTLinkForPersona, validateLinkInputs } from '../../../domain/services/ChatGPTLinkGenerator.js';
import { getPersonaPrompt } from '../../../domain/entities/prompt-loader.js';

/**
 * Create personas router with PromptFileService dependency
 * @param {PromptFileService} promptFileService - Service for managing prompts
 */
export default function createPersonasRouter(promptFileService) {
  const router = express.Router();

/**
 * GET /api/personas
 * List all predefined coach personas
 */
router.get('/', (req, res) => {
  try {
    const personas = getAllPersonas();
    
    // Return personas with all fields
    const personasData = personas.map((persona) => ({
      id: persona.id,
      name: persona.name,
      style: persona.style,
      description: persona.description,
      systemPrompt: persona.systemPrompt,
      icon: persona.icon,
      color: persona.color,
      tags: persona.tags,
    }));

    res.json({
      success: true,
      data: personasData,
      count: personasData.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Unable to load coach personas. Please try again.',
      details: error.message,
    });
  }
});

/**
 * GET /api/personas/:id
 * Get a single persona by ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const persona = getPersonaById(id);

    if (!persona) {
      return res.status(404).json({
        success: false,
        error: `Coach persona "${id}" not found. Please check the persona ID and try again.`,
      });
    }

    res.json({
      success: true,
      data: {
        id: persona.id,
        name: persona.name,
        style: persona.style,
        description: persona.description,
        systemPrompt: persona.systemPrompt,
        icon: persona.icon,
        color: persona.color,
        tags: persona.tags,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Unable to load persona details. Please try again.',
      details: error.message,
    });
  }
});

/**
 * GET /api/personas/:id/prompt
 * Get the full system prompt for a persona (loads from file if available)
 */
router.get('/:id/prompt', async (req, res) => {
  try {
    const { id } = req.params;
    const persona = getPersonaById(id);

    if (!persona) {
      return res.status(404).json({
        success: false,
        error: `Coach persona "${id}" not found. Please check the persona ID and try again.`,
      });
    }

    // Try to get default prompt from PromptFileService first
    let prompt = persona.systemPrompt;
    let loadedFromFile = false;

    if (promptFileService && promptFileService.prompts) {
      const defaultPrompt = promptFileService.getDefaultPromptForPersona(id);
      if (defaultPrompt) {
        prompt = defaultPrompt.systemPrompt;
        loadedFromFile = true;
      }
    }

    // If not found in file, try loading from individual prompt file
    if (!loadedFromFile) {
      const filePrompt = await getPersonaPrompt(id, persona.systemPrompt);
      if (filePrompt !== persona.systemPrompt) {
        prompt = filePrompt;
        loadedFromFile = true;
      }
    }

    res.json({
      success: true,
      data: {
        personaId: id,
        personaName: persona.name,
        systemPrompt: prompt,
        loadedFromFile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Unable to load persona prompt. Please try again.',
      details: error.message,
    });
  }
});

/**
 * GET /api/personas/:id/prompts
 * Get all available prompts for a persona
 */
router.get('/:id/prompts', (req, res) => {
  try {
    const { id } = req.params;
    const persona = getPersonaById(id);

    if (!persona) {
      return res.status(404).json({
        success: false,
        error: `Coach persona "${id}" not found. Please check the persona ID and try again.`,
      });
    }

    // Get prompts from PromptFileService
    let prompts = [];
    if (promptFileService && promptFileService.prompts) {
      prompts = promptFileService.getPromptsForPersona(id);
    }

    // Return prompts without full systemPrompt (for list view)
    const promptsData = prompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      tags: prompt.tags,
      isDefault: prompt.isDefault,
    }));

    res.json({
      success: true,
      data: {
        personaId: id,
        prompts: promptsData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Unable to load prompts for persona. Please try again.',
      details: error.message,
    });
  }
});

/**
 * GET /api/personas/:id/prompts/:promptId
 * Get a specific prompt with full details
 */
router.get('/:id/prompts/:promptId', (req, res) => {
  try {
    const { id, promptId } = req.params;
    const persona = getPersonaById(id);

    if (!persona) {
      return res.status(404).json({
        success: false,
        error: `Coach persona "${id}" not found. Please check the persona ID and try again.`,
      });
    }

    // Get specific prompt from PromptFileService
    let prompt = null;
    if (promptFileService && promptFileService.prompts) {
      prompt = promptFileService.getPromptById(id, promptId);
    }

    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: `Prompt "${promptId}" not found for persona "${id}".`,
      });
    }

    res.json({
      success: true,
      data: {
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        tags: prompt.tags,
        isDefault: prompt.isDefault,
        systemPrompt: prompt.systemPrompt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Unable to load prompt details. Please try again.',
      details: error.message,
    });
  }
});

/**
 * POST /api/personas/:id/prompts
 * Create a new prompt for a persona
 * Body: { id, title, description, tags, isDefault, systemPrompt }
 */
router.post('/:id/prompts', async (req, res) => {
  try {
    const { id: personaId } = req.params;
    const promptData = req.body;

    // Check if persona exists
    const persona = getPersonaById(personaId);
    if (!persona) {
      return res.status(404).json({
        success: false,
        error: `Coach persona "${personaId}" not found. Please check the persona ID and try again.`,
      });
    }

    // Validate required fields
    const requiredFields = ['id', 'title', 'description', 'tags', 'isDefault', 'systemPrompt'];
    for (const field of requiredFields) {
      if (promptData[field] === undefined) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`,
        });
      }
    }

    // Save the prompt using PromptFileService
    if (!promptFileService) {
      return res.status(500).json({
        success: false,
        error: 'Prompt service not available.',
      });
    }

    const savedPrompt = await promptFileService.savePrompt(personaId, promptData);

    res.status(201).json({
      success: true,
      data: savedPrompt,
      message: 'Prompt created successfully',
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Unable to create prompt. Please try again.',
      details: error.message,
    });
  }
});

/**
 * POST /api/personas/generate-link
 * Generate a ChatGPT URL with pre-filled prompt
 * Body: { reflectionText: string, personaId: string }
 */
router.post('/generate-link', (req, res) => {
  try {
    const { reflectionText, personaId, promptId } = req.body;

    // Validate inputs
    if (reflectionText === null || reflectionText === undefined || typeof reflectionText !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Reflection text is required and must be a string.',
      });
    }

    if (!personaId || typeof personaId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Persona ID is required.',
      });
    }

    // Check if persona exists
    if (!isValidPersonaId(personaId)) {
      return res.status(404).json({
        success: false,
        error: `Coach persona "${personaId}" not found. Please select a valid persona.`,
      });
    }

    // Get the persona
    const persona = getPersonaById(personaId);

    let systemPrompt = persona.systemPrompt;
    let selectedPrompt = null;

    if (promptId) {
      if (!promptFileService || !promptFileService.prompts) {
        return res.status(500).json({
          success: false,
          error: 'Prompt system is not available. Please try again later.',
        });
      }

      selectedPrompt = promptFileService.getPromptById(personaId, promptId);
      if (!selectedPrompt) {
        return res.status(404).json({
          success: false,
          error: `Prompt "${promptId}" not found for this coach.`,
        });
      }

      systemPrompt = selectedPrompt.systemPrompt;
    }

    // Validate link generation inputs
    const validation = validateLinkInputs(reflectionText, systemPrompt);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // Generate the ChatGPT link
    const chatGPTUrl = promptId
      ? generateChatGPTLink(reflectionText, systemPrompt)
      : generateChatGPTLinkForPersona(reflectionText, persona);

    res.json({
      success: true,
      data: {
        chatGPTUrl,
        personaId: persona.id,
        personaName: persona.name,
        promptId: selectedPrompt?.id || null,
        promptTitle: selectedPrompt?.title || null,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Unable to generate ChatGPT link. Please try again.',
      details: error.message,
    });
  }
});

  return router;
}
