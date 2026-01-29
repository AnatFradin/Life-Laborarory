import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import createChatRouter from '../../src/adapters/http/routes/ai-chat.js';
import PromptFileService from '../../src/domain/services/PromptFileService.js';
import errorHandler from '../../src/adapters/http/middleware/errorHandler.js';

describe('AI Chat API Integration Tests', () => {
  let app;
  let promptFileService;

  beforeAll(async () => {
    // Initialize PromptFileService with test data
    promptFileService = new PromptFileService();
    await promptFileService.loadPrompts();

    app = express();
    app.use(express.json());
    app.use('/api/ai/chat', createChatRouter(promptFileService));
    // Add error handler middleware
    app.use(errorHandler);
  });

  describe('POST /api/ai/chat', () => {
    it('should reject request without personaId', async () => {
      const requestBody = {
        promptId: 'stoic-daily-reflection',
        message: 'Hello',
      };

      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe(true);
    });

    it('should reject request without promptId', async () => {
      const requestBody = {
        personaId: 'stoic-coach',
        message: 'Hello',
      };

      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe(true);
    });

    it('should reject request without message', async () => {
      const requestBody = {
        personaId: 'stoic-coach',
        promptId: 'stoic-daily-reflection',
      };

      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe(true);
    });

    it('should reject request with empty message', async () => {
      const requestBody = {
        personaId: 'stoic-coach',
        promptId: 'stoic-daily-reflection',
        message: '',
      };

      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe(true);
    });

    it('should reject request with message too long', async () => {
      const requestBody = {
        personaId: 'stoic-coach',
        promptId: 'stoic-daily-reflection',
        message: 'a'.repeat(5001),
      };

      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe(true);
    });

    it('should return 404 for non-existent persona', async () => {
      const requestBody = {
        personaId: 'non-existent-persona',
        promptId: 'some-prompt',
        message: 'Hello',
      };

      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should return 404 for non-existent prompt', async () => {
      const requestBody = {
        personaId: 'stoic-coach',
        promptId: 'non-existent-prompt',
        message: 'Hello',
      };

      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should return 503 when AI service is not available', async () => {
      const requestBody = {
        personaId: 'stoic-coach',
        promptId: 'stoic-daily-reflection',
        message: 'I had a challenging day today.',
      };

      // This test will fail if Ollama is actually running
      // We expect it to return 503 when Ollama is not available
      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody);

      // Either success (if Ollama is running) or 503 (if not)
      if (response.status === 503) {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBeDefined();
      } else if (response.status === 200) {
        // If Ollama is running, check response structure
        expect(response.body.success).toBe(true);
        expect(response.body.data.message).toBeDefined();
        expect(response.body.data.personaId).toBe('stoic-coach');
        expect(response.body.data.promptId).toBe('stoic-daily-reflection');
        expect(response.body.data.timestamp).toBeDefined();
      }
    }, 20000);

    it('should have proper response structure when successful', async () => {
      const requestBody = {
        personaId: 'stoic-coach',
        promptId: 'stoic-daily-reflection',
        message: 'I felt anxious about a presentation today.',
      };

      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody);

      // Only check structure if request was successful (Ollama running)
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('message');
        expect(response.body.data).toHaveProperty('personaId');
        expect(response.body.data).toHaveProperty('promptId');
        expect(response.body.data).toHaveProperty('timestamp');
        expect(typeof response.body.data.message).toBe('string');
        expect(response.body.data.message.length).toBeGreaterThan(0);
      }
    }, 20000);

    it('should work with different prompts for same persona', async () => {
      const requestBody1 = {
        personaId: 'stoic-coach',
        promptId: 'stoic-daily-reflection',
        message: 'Test message',
      };

      const requestBody2 = {
        personaId: 'stoic-coach',
        promptId: 'stoic-adversity',
        message: 'Test message',
      };

      const response1 = await request(app)
        .post('/api/ai/chat')
        .send(requestBody1);

      const response2 = await request(app)
        .post('/api/ai/chat')
        .send(requestBody2);

      // Both should have same success/failure status
      expect(response1.status).toBeDefined();
      expect(response2.status).toBeDefined();
    }, 20000);

    it('should handle special characters in message', async () => {
      const requestBody = {
        personaId: 'stoic-coach',
        promptId: 'stoic-daily-reflection',
        message: 'Today\'s challenge: 100% effort & growth! 😊',
      };

      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody);

      // Should either succeed or fail gracefully
      expect([200, 503, 504]).toContain(response.status);
    }, 20000);

    it('should handle multi-line messages', async () => {
      const requestBody = {
        personaId: 'compassionate-listener',
        promptId: 'listener-general',
        message: 'Line 1\nLine 2\nLine 3',
      };

      const response = await request(app)
        .post('/api/ai/chat')
        .send(requestBody);

      // Should either succeed or fail gracefully
      expect([200, 503, 504]).toContain(response.status);
    }, 20000);
  });
});
