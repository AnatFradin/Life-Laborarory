/**
 * Integration tests for Reflections API
 * Tests the full request/response cycle through HTTP endpoints
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdir, rm, readFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test data directory
const TEST_DATA_DIR = join(__dirname, '../.test-data');
const TEST_REFLECTIONS_DIR = join(TEST_DATA_DIR, 'reflections');
const TEST_VISUALS_DIR = join(TEST_DATA_DIR, 'visuals');

describe('Reflections API Integration Tests', () => {
  beforeAll(async () => {
    // Set test data directory for this test suite
    process.env.DATA_DIR = TEST_DATA_DIR;
    
    // Create test data directories
    await mkdir(TEST_REFLECTIONS_DIR, { recursive: true });
    await mkdir(TEST_VISUALS_DIR, { recursive: true });
    
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
    // Clean reflections and visuals before each test
    await rm(TEST_REFLECTIONS_DIR, { recursive: true, force: true });
    await mkdir(TEST_REFLECTIONS_DIR, { recursive: true });
    await rm(TEST_VISUALS_DIR, { recursive: true, force: true });
    await mkdir(TEST_VISUALS_DIR, { recursive: true });
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
      expect(response.body.message).toContain('Something went wrong with your request');
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

  describe('POST /api/reflections (visual mode - image upload)', () => {
    // Helper function to create a minimal valid PNG image buffer
    function createTestPngBuffer() {
      // Minimal 1x1 PNG (transparent pixel)
      return Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
        0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
        0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, // IDAT chunk
        0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, // IEND chunk
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
        0x42, 0x60, 0x82,
      ]);
    }

    it('should create a visual reflection with image upload', async () => {
      const imageBuffer = createTestPngBuffer();

      const response = await request(global.testApp)
        .post('/api/reflections')
        .field('mode', 'visual')
        .attach('image', imageBuffer, {
          filename: 'test-image.png',
          contentType: 'image/png',
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        mode: 'visual',
        visualAttachment: {
          originalFilename: 'test-image.png',
          storedPath: expect.stringMatching(/^visuals\/\d{4}-\d{2}\/[a-f0-9-]+\.png$/),
          mimeType: 'image/png',
          sizeBytes: expect.any(Number),
          importTimestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        },
      });
    });

    it('should accept JPEG images', async () => {
      // Minimal JPEG header
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46,
        0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
        0x00, 0x01, 0x00, 0x00, 0xff, 0xd9,
      ]);

      const response = await request(global.testApp)
        .post('/api/reflections')
        .field('mode', 'visual')
        .attach('image', jpegBuffer, {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        })
        .expect(201);

      expect(response.body.visualAttachment.mimeType).toBe('image/jpeg');
      expect(response.body.visualAttachment.storedPath).toMatch(/\.jpg$/);
    });

    it('should accept WebP images', async () => {
      // Minimal WebP RIFF header
      const webpBuffer = Buffer.from([
        0x52, 0x49, 0x46, 0x46, 0x1a, 0x00, 0x00, 0x00,
        0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x20,
        0x0e, 0x00, 0x00, 0x00, 0x30, 0x01, 0x00, 0x9d,
        0x01, 0x2a, 0x01, 0x00, 0x01, 0x00,
      ]);

      const response = await request(global.testApp)
        .post('/api/reflections')
        .field('mode', 'visual')
        .attach('image', webpBuffer, {
          filename: 'test.webp',
          contentType: 'image/webp',
        })
        .expect(201);

      expect(response.body.visualAttachment.mimeType).toBe('image/webp');
      expect(response.body.visualAttachment.storedPath).toMatch(/\.webp$/);
    });

    it('should store dimensions when provided', async () => {
      const imageBuffer = createTestPngBuffer();

      const response = await request(global.testApp)
        .post('/api/reflections')
        .field('mode', 'visual')
        .field('width', '1920')
        .field('height', '1080')
        .attach('image', imageBuffer, {
          filename: 'high-res.png',
          contentType: 'image/png',
        })
        .expect(201);

      expect(response.body.visualAttachment.dimensions).toEqual({
        width: 1920,
        height: 1080,
      });
    });

    it('should reject visual mode without image file', async () => {
      const response = await request(global.testApp)
        .post('/api/reflections')
        .field('mode', 'visual')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('Image file is required');
    });

    it('should reject unsupported image types', async () => {
      const bmpBuffer = Buffer.from([0x42, 0x4d]); // BMP header

      const response = await request(global.testApp)
        .post('/api/reflections')
        .field('mode', 'visual')
        .attach('image', bmpBuffer, {
          filename: 'test.bmp',
          contentType: 'image/bmp',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('Invalid file type');
    });

    it('should reject files exceeding 10MB limit', async () => {
      // Create a buffer larger than 10MB
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024);

      const response = await request(global.testApp)
        .post('/api/reflections')
        .field('mode', 'visual')
        .attach('image', largeBuffer, {
          filename: 'large.png',
          contentType: 'image/png',
        })
        .expect(413); // Payload Too Large

      // Multer returns 413 for file size limit exceeded
    });

    it('should actually save the image file to disk', async () => {
      const imageBuffer = createTestPngBuffer();

      const response = await request(global.testApp)
        .post('/api/reflections')
        .field('mode', 'visual')
        .attach('image', imageBuffer, {
          filename: 'persistent-test.png',
          contentType: 'image/png',
        })
        .expect(201);

      const storedPath = response.body.visualAttachment.storedPath;
      const fullPath = join(TEST_DATA_DIR, storedPath);

      // Verify file exists on disk
      const savedBuffer = await readFile(fullPath);
      expect(savedBuffer).toBeTruthy();
      expect(savedBuffer.length).toBeGreaterThan(0);
    });
  });
});
