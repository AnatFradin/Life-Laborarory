/**
 * Unit tests for MarkdownExporter
 */

import { describe, it, expect } from 'vitest';
import MarkdownExporter from '../../src/adapters/export/MarkdownExporter.js';

describe('MarkdownExporter', () => {
  let exporter;

  beforeEach(() => {
    exporter = new MarkdownExporter();
  });

  describe('exportToMarkdown', () => {
    it('should export empty reflections list', async () => {
      const reflections = [];
      const options = { format: 'single-file', includeMetadata: true };

      const result = await exporter.exportToMarkdown(reflections, options);

      expect(result.content).toContain('# My Reflections');
      expect(result.content).toContain('No reflections yet');
      expect(result.attachments).toEqual([]);
    });

    it('should export single text reflection with human-readable timestamp', async () => {
      const reflections = [
        {
          id: '1',
          mode: 'text',
          content: 'This is my first reflection',
          timestamp: '2025-11-19T12:30:00.000Z',
        },
      ];

      const options = { format: 'single-file', includeMetadata: true };
      const result = await exporter.exportToMarkdown(reflections, options);

      expect(result.content).toContain('# My Reflections');
      expect(result.content).toContain('This is my first reflection');
      // Human-readable timestamp format
      expect(result.content).toMatch(/November 19, 2025/i);
      expect(result.attachments).toEqual([]);
    });

    it('should export multiple text reflections sorted by timestamp', async () => {
      const reflections = [
        {
          id: '2',
          mode: 'text',
          content: 'Second reflection',
          timestamp: '2025-11-19T14:00:00.000Z',
        },
        {
          id: '1',
          mode: 'text',
          content: 'First reflection',
          timestamp: '2025-11-19T12:00:00.000Z',
        },
      ];

      const options = { format: 'single-file', includeMetadata: true };
      const result = await exporter.exportToMarkdown(reflections, options);

      expect(result.content).toContain('First reflection');
      expect(result.content).toContain('Second reflection');
      
      // Verify order (most recent first)
      const firstIndex = result.content.indexOf('Second reflection');
      const secondIndex = result.content.indexOf('First reflection');
      expect(firstIndex).toBeLessThan(secondIndex);
    });

    it('should include AI interaction when present and includeMetadata is true', async () => {
      const reflections = [
        {
          id: '1',
          mode: 'text',
          content: 'My thoughts today',
          timestamp: '2025-11-19T12:00:00.000Z',
          aiInteraction: {
            model: 'llama2',
            provider: 'local',
            prompt: 'My thoughts today',
            response: 'I notice curiosity in your reflection',
            timestamp: '2025-11-19T12:01:00.000Z',
            systemPromptVersion: '1.0.0',
          },
        },
      ];

      const options = { format: 'single-file', includeMetadata: true };
      const result = await exporter.exportToMarkdown(reflections, options);

      expect(result.content).toContain('My thoughts today');
      expect(result.content).toContain('I notice curiosity in your reflection');
      expect(result.content).toMatch(/AI Mirror|AI Response/i);
    });

    it('should exclude AI interaction when includeMetadata is false', async () => {
      const reflections = [
        {
          id: '1',
          mode: 'text',
          content: 'My thoughts',
          timestamp: '2025-11-19T12:00:00.000Z',
          aiInteraction: {
            model: 'llama2',
            provider: 'local',
            prompt: 'My thoughts',
            response: 'I notice curiosity',
            timestamp: '2025-11-19T12:01:00.000Z',
            systemPromptVersion: '1.0.0',
          },
        },
      ];

      const options = { format: 'single-file', includeMetadata: false };
      const result = await exporter.exportToMarkdown(reflections, options);

      expect(result.content).toContain('My thoughts');
      expect(result.content).not.toContain('I notice curiosity');
      expect(result.content).not.toMatch(/AI Mirror|AI Response/i);
    });

    it('should handle reflections without AI interaction', async () => {
      const reflections = [
        {
          id: '1',
          mode: 'text',
          content: 'Simple reflection without AI',
          timestamp: '2025-11-19T12:00:00.000Z',
        },
      ];

      const options = { format: 'single-file', includeMetadata: true };
      const result = await exporter.exportToMarkdown(reflections, options);

      expect(result.content).toContain('Simple reflection without AI');
      expect(result.content).not.toMatch(/AI Mirror|AI Response/i);
    });

    it('should generate valid markdown structure', async () => {
      const reflections = [
        {
          id: '1',
          mode: 'text',
          content: 'Test reflection',
          timestamp: '2025-11-19T12:00:00.000Z',
        },
      ];

      const options = { format: 'single-file', includeMetadata: true };
      const result = await exporter.exportToMarkdown(reflections, options);

      // Should have h1 header
      expect(result.content).toMatch(/^# /m);
      // Should have h2 or h3 headers for reflections
      expect(result.content).toMatch(/^## /m);
      // Should be valid markdown (no HTML tags unless intentional)
      expect(result.content).not.toContain('<div>');
    });

    it('should preserve markdown formatting in content', async () => {
      const reflections = [
        {
          id: '1',
          mode: 'text',
          content: '**Bold text** and *italic text* with [links](https://example.com)',
          timestamp: '2025-11-19T12:00:00.000Z',
        },
      ];

      const options = { format: 'single-file', includeMetadata: true };
      const result = await exporter.exportToMarkdown(reflections, options);

      expect(result.content).toContain('**Bold text**');
      expect(result.content).toContain('*italic text*');
      expect(result.content).toContain('[links](https://example.com)');
    });
  });

  describe('getSupportedFormats', () => {
    it('should return array of supported formats', () => {
      const formats = exporter.getSupportedFormats();

      expect(Array.isArray(formats)).toBe(true);
      expect(formats).toContain('markdown');
      expect(formats.length).toBeGreaterThan(0);
    });
  });
});
