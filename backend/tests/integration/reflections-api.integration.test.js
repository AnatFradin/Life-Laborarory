/**
 * Integration tests for Reflections API
 * Tests the full request/response cycle through HTTP endpoints
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdir, rm } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test data directory
const TEST_DATA_DIR = join(__dirname, '../.test-data');
const TEST_REFLECTIONS_DIR = join(TEST_DATA_DIR, 'reflections');

describe('Reflections API Integration Tests', () => {
  beforeAll(async () => {
    // Set test data directory for this test suite
    process.env.DATA_DIR = TEST_DATA_DIR;
    
    // Create test data directory
    await mkdir(TEST_REFLECTIONS_DIR, { recursive: true });
    
    // Import app AFTER setting env var
    const { default: testApp } = await import('../../src/server.js');
    global.testApp = testApp;
  });

  afterAll(async () => {
    // Clean up test data
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
    
    // Reset env var
    delete process.env.DATA_DIR;
  });

  beforeEach(async () => {
    // Clean reflections before each test
    await rm(TEST_REFLECTIONS_DIR, { recursive: true, force: true });
    await mkdir(TEST_REFLECTIONS_DIR, { recursive: true });
  });

  describe('POST /api/reflections', () => {
    it('should create a text reflection without requiring id or timestamp', async () => {
      const reflectionData = {
        mode: 'text',
        content: 'This is my first reflection',
      };

      const response = await request(global.testApp)
        .post('/api/reflections')
        .send(reflectionData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        mode: 'text',
        content: 'This is my first reflection',
      });
    });

    it('should reject reflection without mode', async () => {
      const invalidData = {
        content: 'Missing mode field',
      };

      const response = await request(global.testApp)
        .post('/api/reflections')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject text reflection without content', async () => {
      const invalidData = {
        mode: 'text',
      };

      const response = await request(global.testApp)
        .post('/api/reflections')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject reflection with invalid mode', async () => {
      const invalidData = {
        mode: 'invalid-mode',
        content: 'Some content',
      };

      const response = await request(global.testApp)
        .post('/api/reflections')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should accept reflection with optional metadata', async () => {
      const reflectionData = {
        mode: 'text',
        content: 'Reflection with metadata',
        metadata: {
          mood: 'contemplative',
          tags: ['personal', 'growth'],
        },
      };

      const response = await request(global.testApp)
        .post('/api/reflections')
        .send(reflectionData)
        .expect(201);

      expect(response.body.metadata).toEqual({
        mood: 'contemplative',
        tags: ['personal', 'growth'],
      });
    });
  });

  describe('GET /api/reflections', () => {
    it('should return empty array when no reflections exist', async () => {
      const response = await request(global.testApp)
        .get('/api/reflections')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        reflections: [],
        count: 0,
      });
    });

    it('should return all reflections after creating some', async () => {
      // Create two reflections
      await request(global.testApp)
        .post('/api/reflections')
        .send({ mode: 'text', content: 'First reflection' });

      await request(global.testApp)
        .post('/api/reflections')
        .send({ mode: 'text', content: 'Second reflection' });

      const response = await request(global.testApp)
        .get('/api/reflections')
        .expect(200);

      expect(response.body.count).toBe(2);
      expect(response.body.reflections).toHaveLength(2);
      expect(response.body.reflections[0]).toHaveProperty('id');
      expect(response.body.reflections[0]).toHaveProperty('timestamp');
      expect(response.body.reflections[0]).toHaveProperty('content');
    });
  });

  describe('GET /api/reflections/:id', () => {
    it('should return specific reflection by id', async () => {
      // Create a reflection
      const createResponse = await request(global.testApp)
        .post('/api/reflections')
        .send({ mode: 'text', content: 'Test reflection' })
        .expect(201);

      const createdId = createResponse.body.id;

      // Fetch it by id
      const response = await request(global.testApp)
        .get(`/api/reflections/${createdId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdId,
        mode: 'text',
        content: 'Test reflection',
      });
    });

    it('should return 404 for non-existent reflection', async () => {
      const fakeId = '12345678-1234-1234-1234-123456789012';

      const response = await request(global.testApp)
        .get(`/api/reflections/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error Handling', () => {
    it('should return gentle error message for validation failures', async () => {
      const response = await request(global.testApp)
        .post('/api/reflections')
        .send({ mode: 'text' }) // Missing content
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBeDefined();
      // Should have validation errors for Zod failures
      if (response.body.validationErrors) {
        expect(Array.isArray(response.body.validationErrors)).toBe(true);
      }
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await request(global.testApp)
        .post('/api/reflections')
        .set('Content-Type', 'application/json')
        .send('{"mode": "text", invalid json}')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('formatted correctly');
    });
  });

  describe('DELETE /api/reflections/:id', () => {
    it('should delete a specific reflection', async () => {
      // Create a reflection first
      const createResponse = await request(global.testApp)
        .post('/api/reflections')
        .send({
          mode: 'text',
          content: 'This reflection will be deleted',
        })
        .expect(201);

      const reflectionId = createResponse.body.id;

      // Delete the reflection
      await request(global.testApp)
        .delete(`/api/reflections/${reflectionId}`)
        .expect(200);

      // Verify it's gone
      await request(global.testApp)
        .get(`/api/reflections/${reflectionId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent reflection', async () => {
      const response = await request(global.testApp)
        .delete('/api/reflections/12345678-1234-1234-1234-123456789012')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('not found');
    });
  });

  describe('POST /api/reflections/delete-all', () => {
    it('should delete all reflections with correct confirmation', async () => {
      // Create multiple reflections
      await request(global.testApp)
        .post('/api/reflections')
        .send({ mode: 'text', content: 'First reflection' })
        .expect(201);

      await request(global.testApp)
        .post('/api/reflections')
        .send({ mode: 'text', content: 'Second reflection' })
        .expect(201);

      // Verify reflections exist
      const beforeDelete = await request(global.testApp)
        .get('/api/reflections')
        .expect(200);
      expect(beforeDelete.body.reflections).toHaveLength(2);

      // Delete all with confirmation
      const response = await request(global.testApp)
        .post('/api/reflections/delete-all')
        .send({ confirmation: 'DELETE_ALL' })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.deletedCount).toBe(2);

      // Verify all reflections are gone
      const afterDelete = await request(global.testApp)
        .get('/api/reflections')
        .expect(200);
      expect(afterDelete.body.reflections).toHaveLength(0);
    });

    it('should reject delete-all without confirmation', async () => {
      const response = await request(global.testApp)
        .post('/api/reflections/delete-all')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('confirmation');
    });

    it('should reject delete-all with incorrect confirmation', async () => {
      const response = await request(global.testApp)
        .post('/api/reflections/delete-all')
        .send({ confirmation: 'delete all' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('DELETE_ALL');
    });
  });
});
