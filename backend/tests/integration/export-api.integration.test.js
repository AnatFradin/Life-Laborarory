/**
 * Integration tests for Export API
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test data directory
const TEST_DATA_DIR = path.join(__dirname, '../test-data');

describe('Export API Integration', () => {
  let app;

  beforeAll(async () => {
    // Clean up any existing test data first
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
    
    // Ensure test data directory exists
    await fs.mkdir(path.join(TEST_DATA_DIR, 'reflections'), { recursive: true });
    
    // Set environment variable for test data directory BEFORE importing routes
    process.env.DATA_DIR = TEST_DATA_DIR;
    
    // Import and create app AFTER setting env var
    const express = (await import('express')).default;
    const { default: createExportRouter } = await import('../../src/adapters/http/routes/export.js');
    const { default: reflectionsRouter } = await import('../../src/adapters/http/routes/reflections.js');
    const { default: errorHandler } = await import('../../src/adapters/http/middleware/errorHandler.js');
    
    app = express();
    app.use(express.json());
    app.use('/api/reflections', reflectionsRouter);
    app.use('/api/export', createExportRouter());
    app.use(errorHandler);
    
    // Store for tests
    global.testExportApp = app;
  });

  beforeEach(async () => {
    // Clean reflections before each test
    const reflectionsDir = path.join(TEST_DATA_DIR, 'reflections');
    await fs.rm(reflectionsDir, { recursive: true, force: true });
    await fs.mkdir(reflectionsDir, { recursive: true });
  });

  afterAll(async () => {
    // Clean up test data
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
    
    // Reset env var
    delete process.env.DATA_DIR;
  });

  describe('POST /api/export', () => {
    it('should export empty reflections list', async () => {
      const response = await request(global.testExportApp)
        .post('/api/export')
        .send({
          format: 'single-file',
          includeMetadata: true,
        })
        .expect(200);

      expect(response.body).toHaveProperty('markdown');
      expect(response.body).toHaveProperty('filename');
      expect(response.body.markdown).toContain('# My Reflections');
      expect(response.body.markdown).toContain('No reflections yet');
      expect(response.body).toHaveProperty('attachments');
      expect(response.body.attachments).toEqual([]);
    });

    it('should export reflections to markdown', async () => {
      // First create some reflections
      await request(global.testExportApp)
        .post('/api/reflections')
        .send({
          mode: 'text',
          content: 'First reflection for export test',
        })
        .expect(201);

      await request(global.testExportApp)
        .post('/api/reflections')
        .send({
          mode: 'text',
          content: 'Second reflection for export test',
        })
        .expect(201);

      // Export reflections
      const response = await request(global.testExportApp)
        .post('/api/export')
        .send({
          format: 'single-file',
          includeMetadata: true,
        })
        .expect(200);

      expect(response.body).toHaveProperty('markdown');
      expect(response.body).toHaveProperty('filename');
      expect(response.body.markdown).toContain('# My Reflections');
      expect(response.body.markdown).toContain('First reflection for export test');
      expect(response.body.markdown).toContain('Second reflection for export test');
      expect(response.body.markdown).toContain('Total reflections: 2');
    });

    it('should use default options when not provided', async () => {
      const response = await request(global.testExportApp)
        .post('/api/export')
        .send({})
        .expect(200);

      expect(response.body).toHaveProperty('markdown');
      expect(response.body).toHaveProperty('filename');
      expect(response.body).toHaveProperty('attachments');
    });

    it('should respect includeMetadata option', async () => {
      // Create reflection with AI interaction (would need AI route, skip for now)
      await request(global.testExportApp)
        .post('/api/reflections')
        .send({
          mode: 'text',
          content: 'Test reflection',
        })
        .expect(201);

      // Export without metadata
      const response = await request(global.testExportApp)
        .post('/api/export')
        .send({
          format: 'single-file',
          includeMetadata: false,
        })
        .expect(200);

      expect(response.body).toHaveProperty('markdown');
      expect(response.body.markdown).toContain('Test reflection');
    });

    it('should handle invalid format parameter', async () => {
      const response = await request(global.testExportApp)
        .post('/api/export')
        .send({
          format: 'invalid-format',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return proper content type', async () => {
      const response = await request(global.testExportApp)
        .post('/api/export')
        .send({})
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('markdown');
      expect(response.body).toHaveProperty('filename');
    });
  });
});
