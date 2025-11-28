/**
 * Integration tests for POST /api/ai/rephrase endpoint
 * Tests AI text rephrasing with different styles
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import rephrasingRouter from '../../src/adapters/http/routes/ai-rephrasing.js';

// Mock AI adapter
const mockAIAdapter = {
  generateResponse: vi.fn(),
  isAvailable: vi.fn().mockResolvedValue(true),
  getMetadata: vi.fn().mockReturnValue({ provider: 'ollama', type: 'local' }),
};

// Mock AIMirrorService
vi.mock('../../src/domain/services/AIMirrorService.js', () => {
  return {
    default: class MockAIMirrorService {
      constructor() {}
      async rephrase(text, style, preferences) {
        if (!text || text.trim().length === 0) {
          const error = new Error('Text is required for rephrasing');
          error.statusCode = 400;
          throw error;
        }

        if (text.length > 5000) {
          const error = new Error('Text is too long for rephrasing (max 5000 characters)');
          error.statusCode = 400;
          throw error;
        }

        if (!['clearer', 'more-positive', 'more-constructive'].includes(style)) {
          const error = new Error('Invalid rephrasing style');
          error.statusCode = 400;
          throw error;
        }

        // Simulate AI unavailable
        if (text === 'AI_UNAVAILABLE') {
          const error = new Error('Could not connect to Ollama. Is it running?');
          error.statusCode = 503;
          throw error;
        }

        return {
          originalText: text,
          style,
          suggestions: [
            `Rephrased version 1 (${style})`,
            `Rephrased version 2 (${style})`,
          ],
          timestamp: new Date().toISOString(),
          provider: 'ollama',
          model: 'llama2',
        };
      }
    },
  };
});

describe('POST /api/ai/rephrase', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/ai', rephrasingRouter);

    // Error handler
    app.use((err, req, res, next) => {
      res.status(err.statusCode || 500).json({
        error: err.message || 'Internal server error',
      });
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should rephrase text successfully with clearer style', async () => {
    const response = await request(app)
      .post('/api/ai/rephrase')
      .send({
        originalText: 'I am feeling really confused',
        style: 'clearer',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      originalText: 'I am feeling really confused',
      style: 'clearer',
      suggestions: expect.arrayContaining([
        expect.stringContaining('clearer'),
      ]),
      timestamp: expect.any(String),
      provider: 'ollama',
      model: 'llama2',
    });
  });

  it('should rephrase text with more-positive style', async () => {
    const response = await request(app)
      .post('/api/ai/rephrase')
      .send({
        originalText: 'I failed again',
        style: 'more-positive',
      })
      .expect(200);

    expect(response.body.style).toBe('more-positive');
    expect(response.body.suggestions).toHaveLength(2);
  });

  it('should rephrase text with more-constructive style', async () => {
    const response = await request(app)
      .post('/api/ai/rephrase')
      .send({
        originalText: 'I keep making mistakes',
        style: 'more-constructive',
      })
      .expect(200);

    expect(response.body.style).toBe('more-constructive');
    expect(response.body.suggestions).toHaveLength(2);
  });

  it('should return 400 with missing originalText', async () => {
    const response = await request(app)
      .post('/api/ai/rephrase')
      .send({
        style: 'clearer',
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it('should return 400 with empty originalText', async () => {
    const response = await request(app)
      .post('/api/ai/rephrase')
      .send({
        originalText: '',
        style: 'clearer',
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it('should return 400 with missing style', async () => {
    const response = await request(app)
      .post('/api/ai/rephrase')
      .send({
        originalText: 'Some text',
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it('should return 400 with invalid style', async () => {
    const response = await request(app)
      .post('/api/ai/rephrase')
      .send({
        originalText: 'Some text',
        style: 'invalid-style',
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it('should return 400 with text too long (> 5000 chars)', async () => {
    const longText = 'a'.repeat(5001);

    const response = await request(app)
      .post('/api/ai/rephrase')
      .send({
        originalText: longText,
        style: 'clearer',
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
    // Zod validation error
  });

  it('should return 503 when AI unavailable', async () => {
    const response = await request(app)
      .post('/api/ai/rephrase')
      .send({
        originalText: 'AI_UNAVAILABLE',
        style: 'clearer',
      })
      .expect(503);

    expect(response.body.error).toContain('Ollama');
  });

  it('should accept aiProvider and model in request', async () => {
    const response = await request(app)
      .post('/api/ai/rephrase')
      .send({
        originalText: 'Some text',
        style: 'clearer',
        aiProvider: 'local',
        model: 'llama2',
      })
      .expect(200);

    expect(response.body).toBeDefined();
  });
});
