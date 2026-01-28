import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import createPersonasRouter from '../../src/adapters/http/routes/personas.js';
import PromptFileService from '../../src/domain/services/PromptFileService.js';

describe('Personas API Integration Tests', () => {
  let app;
  let promptFileService;

  beforeAll(async () => {
    // Initialize PromptFileService with test data
    promptFileService = new PromptFileService();
    await promptFileService.loadPrompts();

    app = express();
    app.use(express.json());
    app.use('/api/personas', createPersonasRouter(promptFileService));
  });

  describe('GET /api/personas', () => {
    it('should return list of all personas', async () => {
      const response = await request(app)
        .get('/api/personas')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(6);
      expect(response.body.data.length).toBe(response.body.count);
    });

    it('should return personas with all required fields', async () => {
      const response = await request(app)
        .get('/api/personas')
        .expect(200);

      const firstPersona = response.body.data[0];
      expect(firstPersona).toHaveProperty('id');
      expect(firstPersona).toHaveProperty('name');
      expect(firstPersona).toHaveProperty('style');
      expect(firstPersona).toHaveProperty('description');
      expect(firstPersona).toHaveProperty('systemPrompt');
      expect(firstPersona).toHaveProperty('icon');
      expect(firstPersona).toHaveProperty('color');
      expect(firstPersona).toHaveProperty('tags');
    });

    it('should return personas with non-empty system prompts', async () => {
      const response = await request(app)
        .get('/api/personas')
        .expect(200);

      response.body.data.forEach(persona => {
        expect(persona.systemPrompt.length).toBeGreaterThanOrEqual(50);
      });
    });
  });

  describe('GET /api/personas/:id', () => {
    it('should return specific persona by ID', async () => {
      const response = await request(app)
        .get('/api/personas/stoic-coach')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('stoic-coach');
      expect(response.body.data.name).toBeDefined();
    });

    it('should return 404 for non-existent persona', async () => {
      const response = await request(app)
        .get('/api/personas/non-existent-persona')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should return all persona fields', async () => {
      const response = await request(app)
        .get('/api/personas/compassionate-listener')
        .expect(200);

      const persona = response.body.data;
      expect(persona.id).toBe('compassionate-listener');
      expect(persona.name).toBeDefined();
      expect(persona.style).toBeDefined();
      expect(persona.description).toBeDefined();
      expect(persona.systemPrompt).toBeDefined();
      expect(persona.icon).toBeDefined();
      expect(persona.color).toBeDefined();
      expect(Array.isArray(persona.tags)).toBe(true);
    });
  });

  describe('GET /api/personas/:id/prompt', () => {
    it('should return persona system prompt', async () => {
      const response = await request(app)
        .get('/api/personas/stoic-coach/prompt')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.personaId).toBe('stoic-coach');
      expect(response.body.data.personaName).toBeDefined();
      expect(response.body.data.systemPrompt).toBeDefined();
      expect(response.body.data).toHaveProperty('loadedFromFile');
    });

    it('should return 404 for non-existent persona prompt', async () => {
      const response = await request(app)
        .get('/api/personas/non-existent/prompt')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should indicate if prompt was loaded from file', async () => {
      const response = await request(app)
        .get('/api/personas/stoic-coach/prompt')
        .expect(200);

      expect(typeof response.body.data.loadedFromFile).toBe('boolean');
    });
  });

  describe('POST /api/personas/generate-link', () => {
    it('should generate ChatGPT link with valid inputs', async () => {
      const requestBody = {
        reflectionText: 'Today I struggled with procrastination.',
        personaId: 'stoic-coach',
      };

      const response = await request(app)
        .post('/api/personas/generate-link')
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.chatGPTUrl).toContain('https://chat.openai.com');
      expect(response.body.data.personaId).toBe('stoic-coach');
      expect(response.body.data.personaName).toBeDefined();
      expect(response.body.data.timestamp).toBeDefined();
    });

    it('should return 400 for missing reflection text', async () => {
      const requestBody = {
        personaId: 'stoic-coach',
      };

      const response = await request(app)
        .post('/api/personas/generate-link')
        .send(requestBody)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Reflection text');
    });

    it('should allow empty reflection text', async () => {
      const requestBody = {
        reflectionText: '   ',
        personaId: 'stoic-coach',
      };

      const response = await request(app)
        .post('/api/personas/generate-link')
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.chatGPTUrl).toContain('https://chat.openai.com');
    });

    it('should return 400 for missing persona ID', async () => {
      const requestBody = {
        reflectionText: 'My reflection',
      };

      const response = await request(app)
        .post('/api/personas/generate-link')
        .send(requestBody)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Persona ID');
    });

    it('should return 404 for invalid persona ID', async () => {
      const requestBody = {
        reflectionText: 'My reflection',
        personaId: 'non-existent-persona',
      };

      const response = await request(app)
        .post('/api/personas/generate-link')
        .send(requestBody)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should generate different URLs for different personas', async () => {
      const reflection = 'Same reflection text';

      const response1 = await request(app)
        .post('/api/personas/generate-link')
        .send({ reflectionText: reflection, personaId: 'stoic-coach' })
        .expect(200);

      const response2 = await request(app)
        .post('/api/personas/generate-link')
        .send({ reflectionText: reflection, personaId: 'compassionate-listener' })
        .expect(200);

      // URLs should be different because personas have different prompts
      expect(response1.body.data.chatGPTUrl).not.toBe(response2.body.data.chatGPTUrl);
    });

    it('should handle special characters in reflection', async () => {
      const requestBody = {
        reflectionText: "Today's reflection: 100% effort & growth!",
        personaId: 'growth-mindset-coach',
      };

      const response = await request(app)
        .post('/api/personas/generate-link')
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.chatGPTUrl).toContain('https://chat.openai.com');
    });

    it('should handle multi-line reflections', async () => {
      const requestBody = {
        reflectionText: 'Line 1\nLine 2\nLine 3',
        personaId: 'socratic-questioner',
      };

      const response = await request(app)
        .post('/api/personas/generate-link')
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.chatGPTUrl).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/personas/generate-link')
        .send('{ invalid json }')
        .set('Content-Type', 'application/json')
        .expect(400);
    });

    it('should return proper error structure', async () => {
      const response = await request(app)
        .get('/api/personas/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('error');
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/personas/:id/prompts', () => {
    it('should return all prompts for a persona', async () => {
      const response = await request(app)
        .get('/api/personas/stoic-coach/prompts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.personaId).toBe('stoic-coach');
      expect(Array.isArray(response.body.data.prompts)).toBe(true);
      
      // Should have multiple prompts from prompts.json
      if (response.body.data.prompts.length > 0) {
        const firstPrompt = response.body.data.prompts[0];
        expect(firstPrompt).toHaveProperty('id');
        expect(firstPrompt).toHaveProperty('title');
        expect(firstPrompt).toHaveProperty('description');
        expect(firstPrompt).toHaveProperty('tags');
        expect(firstPrompt).toHaveProperty('isDefault');
        // Should NOT include full systemPrompt in list view
        expect(firstPrompt).not.toHaveProperty('systemPrompt');
      }
    });

    it('should return 404 for non-existent persona', async () => {
      const response = await request(app)
        .get('/api/personas/non-existent-persona/prompts')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should return empty array for persona without prompts in file', async () => {
      const response = await request(app)
        .get('/api/personas/benjamin-franklin/prompts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.prompts)).toBe(true);
      // May be empty if not in prompts.json
    });
  });

  describe('GET /api/personas/:id/prompts/:promptId', () => {
    it('should return specific prompt with full details', async () => {
      const response = await request(app)
        .get('/api/personas/stoic-coach/prompts/stoic-daily-reflection')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('stoic-daily-reflection');
      expect(response.body.data.title).toBeDefined();
      expect(response.body.data.description).toBeDefined();
      expect(response.body.data.tags).toBeDefined();
      expect(response.body.data.isDefault).toBeDefined();
      // Should include full systemPrompt in detail view
      expect(response.body.data.systemPrompt).toBeDefined();
      expect(response.body.data.systemPrompt.length).toBeGreaterThan(50);
    });

    it('should return 404 for non-existent prompt ID', async () => {
      const response = await request(app)
        .get('/api/personas/stoic-coach/prompts/non-existent-prompt')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should return 404 for non-existent persona', async () => {
      const response = await request(app)
        .get('/api/personas/non-existent-persona/prompts/some-prompt')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });
});
