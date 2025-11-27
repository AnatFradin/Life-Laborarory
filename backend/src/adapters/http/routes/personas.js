import express from 'express';
import { getAllPersonas, getPersonaById, isValidPersonaId } from '../../../domain/entities/predefined-personas.js';
import { generateChatGPTLinkForPersona, validateLinkInputs } from '../../../domain/services/ChatGPTLinkGenerator.js';
import { getPersonaPrompt } from '../../../domain/entities/prompt-loader.js';

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

    // Load prompt from file if available, otherwise use inline prompt
    const prompt = await getPersonaPrompt(id, persona.systemPrompt);

    res.json({
      success: true,
      data: {
        personaId: id,
        personaName: persona.name,
        systemPrompt: prompt,
        loadedFromFile: prompt !== persona.systemPrompt,
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
 * POST /api/personas/generate-link
 * Generate a ChatGPT URL with pre-filled prompt
 * Body: { reflectionText: string, personaId: string }
 */
router.post('/generate-link', (req, res) => {
  try {
    const { reflectionText, personaId } = req.body;

    // Validate inputs
    if (!reflectionText || typeof reflectionText !== 'string' || reflectionText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Reflection text is required and cannot be empty.',
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

    // Validate link generation inputs
    const validation = validateLinkInputs(reflectionText, persona.systemPrompt);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // Generate the ChatGPT link
    const chatGPTUrl = generateChatGPTLinkForPersona(reflectionText, persona);

    res.json({
      success: true,
      data: {
        chatGPTUrl,
        personaId: persona.id,
        personaName: persona.name,
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

export default router;
