/**
 * Unit tests for ExportService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import ExportService from '../../src/domain/services/ExportService.js';

describe('ExportService', () => {
  let mockReflectionRepository;
  let mockExporter;
  let service;

  beforeEach(() => {
    // Create mock repository
    mockReflectionRepository = {
      findAll: vi.fn(),
    };

    // Create mock exporter
    mockExporter = {
      exportToMarkdown: vi.fn(),
      getSupportedFormats: vi.fn(),
    };

    service = new ExportService(mockReflectionRepository, mockExporter);
  });

  describe('exportAllToMarkdown', () => {
    it('should export all reflections to markdown', async () => {
      const reflections = [
        {
          id: '1',
          mode: 'text',
          content: 'First reflection',
          timestamp: '2025-11-19T12:00:00.000Z',
        },
        {
          id: '2',
          mode: 'text',
          content: 'Second reflection',
          timestamp: '2025-11-19T11:00:00.000Z',
        },
      ];

      const exportResult = {
        content: '# My Reflections\n\n## First reflection\n\n## Second reflection',
        attachments: [],
      };

      mockReflectionRepository.findAll.mockResolvedValue(reflections);
      mockExporter.exportToMarkdown.mockResolvedValue(exportResult);

      const result = await service.exportAllToMarkdown();

      expect(mockReflectionRepository.findAll).toHaveBeenCalledOnce();
      expect(mockExporter.exportToMarkdown).toHaveBeenCalledWith(reflections, {
        format: 'folder',
        includeMetadata: true,
      });
      expect(result).toEqual(exportResult);
    });

    it('should accept custom export options', async () => {
      const reflections = [
        {
          id: '1',
          mode: 'text',
          content: 'Test reflection',
          timestamp: '2025-11-19T12:00:00.000Z',
        },
      ];

      const exportResult = {
        content: '# Test',
        attachments: [],
      };

      mockReflectionRepository.findAll.mockResolvedValue(reflections);
      mockExporter.exportToMarkdown.mockResolvedValue(exportResult);

      const options = {
        format: 'folder',
        includeMetadata: false,
      };

      const result = await service.exportAllToMarkdown(options);

      expect(mockExporter.exportToMarkdown).toHaveBeenCalledWith(reflections, options);
      expect(result).toEqual(exportResult);
    });

    it('should handle empty reflections list', async () => {
      mockReflectionRepository.findAll.mockResolvedValue([]);
      mockExporter.exportToMarkdown.mockResolvedValue({
        content: '# My Reflections\n\nNo reflections yet.',
        attachments: [],
      });

      const result = await service.exportAllToMarkdown();

      expect(mockReflectionRepository.findAll).toHaveBeenCalledOnce();
      expect(mockExporter.exportToMarkdown).toHaveBeenCalledWith([], {
        format: 'folder',
        includeMetadata: true,
      });
      expect(result.content).toContain('No reflections');
    });

    it('should handle reflections with AI interactions', async () => {
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

      const exportResult = {
        content: '# My Reflections\n\n## My thoughts\n\n**AI Mirror:** I notice curiosity',
        attachments: [],
      };

      mockReflectionRepository.findAll.mockResolvedValue(reflections);
      mockExporter.exportToMarkdown.mockResolvedValue(exportResult);

      const result = await service.exportAllToMarkdown();

      expect(result.content).toContain('AI Mirror');
    });

    it('should propagate exporter errors', async () => {
      mockReflectionRepository.findAll.mockResolvedValue([]);
      mockExporter.exportToMarkdown.mockRejectedValue(new Error('Export failed'));

      await expect(service.exportAllToMarkdown()).rejects.toThrow('Export failed');
    });

    it('should propagate repository errors', async () => {
      mockReflectionRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.exportAllToMarkdown()).rejects.toThrow('Database error');
    });
  });
});
