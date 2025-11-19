/**
 * Unit tests for ReflectionService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { randomUUID } from 'node:crypto';
import ReflectionService from '../../src/domain/services/ReflectionService.js';

describe('ReflectionService', () => {
  let mockRepository;
  let service;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      deleteById: vi.fn(),
      deleteAll: vi.fn(),
    };

    service = new ReflectionService(mockRepository);
  });

  describe('createReflection', () => {
    it('should create and save a valid text reflection', async () => {
      const reflectionData = {
        mode: 'text',
        content: 'This is my reflection',
      };

      const savedReflection = {
        id: 'test-id-123',
        timestamp: '2025-11-19T12:00:00.000Z',
        ...reflectionData,
      };

      mockRepository.save.mockResolvedValue(savedReflection);

      const result = await service.createReflection(reflectionData);

      expect(mockRepository.save).toHaveBeenCalledOnce();
      expect(result).toEqual(savedReflection);
      expect(result.id).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should throw validation error for invalid reflection data', async () => {
      const invalidData = {
        mode: 'invalid-mode',
      };

      await expect(service.createReflection(invalidData)).rejects.toThrow();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error if content is missing for text mode', async () => {
      const invalidData = {
        mode: 'text',
        // content is missing
      };

      await expect(service.createReflection(invalidData)).rejects.toThrow();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getReflectionById', () => {
    it('should return reflection when found', async () => {
      const reflection = {
        id: 'test-id-123',
        mode: 'text',
        content: 'Test reflection',
        timestamp: '2025-11-19T12:00:00.000Z',
      };

      mockRepository.findById.mockResolvedValue(reflection);

      const result = await service.getReflectionById('test-id-123');

      expect(mockRepository.findById).toHaveBeenCalledWith('test-id-123');
      expect(result).toEqual(reflection);
    });

    it('should return null when reflection not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.getReflectionById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('getAllReflections', () => {
    it('should return all reflections', async () => {
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

      mockRepository.findAll.mockResolvedValue(reflections);

      const result = await service.getAllReflections();

      expect(mockRepository.findAll).toHaveBeenCalledOnce();
      expect(result).toEqual(reflections);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no reflections exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.getAllReflections();

      expect(result).toEqual([]);
    });
  });

  describe('updateReflection', () => {
    it('should update existing reflection', async () => {
      const existingReflection = {
        id: randomUUID(),
        mode: 'text',
        content: 'Original content',
        timestamp: '2025-11-19T12:00:00.000Z',
      };

      const updates = {
        content: 'Updated content',
      };

      const updatedReflection = {
        ...existingReflection,
        ...updates,
      };

      mockRepository.findById.mockResolvedValue(existingReflection);
      mockRepository.save.mockResolvedValue(updatedReflection);

      const result = await service.updateReflection(existingReflection.id, updates);

      expect(mockRepository.findById).toHaveBeenCalledWith(existingReflection.id);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.content).toBe('Updated content');
      expect(result.id).toBe(existingReflection.id);
      expect(result.timestamp).toBe(existingReflection.timestamp);
    });

    it('should throw error when reflection not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateReflection('non-existent-id', { content: 'New content' })
      ).rejects.toThrow('Reflection not found');

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should preserve id and timestamp when updating', async () => {
      const existingReflection = {
        id: randomUUID(),
        mode: 'text',
        content: 'Original content',
        timestamp: '2025-11-19T12:00:00.000Z',
      };

      const maliciousUpdates = {
        id: 'hacked-id',
        timestamp: '2025-11-20T12:00:00.000Z',
        content: 'Updated content',
      };

      mockRepository.findById.mockResolvedValue(existingReflection);
      mockRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.updateReflection(existingReflection.id, maliciousUpdates);

      expect(result.id).toBe(existingReflection.id);
      expect(result.timestamp).toBe('2025-11-19T12:00:00.000Z');
    });
  });

  describe('addAIInteraction', () => {
    it('should add AI interaction to reflection', async () => {
      const reflection = {
        id: randomUUID(),
        mode: 'text',
        content: 'My reflection',
        timestamp: '2025-11-19T12:00:00.000Z',
      };

      const aiInteraction = {
        model: 'llama2',
        provider: 'local',
        prompt: 'My reflection',
        response: 'I notice some curiosity in your reflection',
        timestamp: '2025-11-19T12:01:00.000Z',
        systemPromptVersion: '1.0.0',
      };

      const updatedReflection = {
        ...reflection,
        aiInteraction,
      };

      mockRepository.findById.mockResolvedValue(reflection);
      mockRepository.save.mockResolvedValue(updatedReflection);

      const result = await service.addAIInteraction(reflection.id, aiInteraction);

      expect(mockRepository.findById).toHaveBeenCalledWith(reflection.id);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.aiInteraction).toEqual(aiInteraction);
    });

    it('should throw error when reflection not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const aiInteraction = {
        model: 'llama2',
        provider: 'local',
        prompt: 'Test',
        response: 'Test response',
        timestamp: '2025-11-19T12:01:00.000Z',
        systemPromptVersion: '1.0.0',
      };

      await expect(
        service.addAIInteraction('non-existent-id', aiInteraction)
      ).rejects.toThrow('Reflection not found');

      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
