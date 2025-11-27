/**
 * Unit tests for OllamaAdapter
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import OllamaAdapter from '../../src/adapters/ai/OllamaAdapter.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('OllamaAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new OllamaAdapter('http://localhost:11434');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateResponse', () => {
    it('should generate response successfully', async () => {
      const mockResponse = {
        response: 'I notice some curiosity in your reflection',
        model: 'llama2',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await adapter.generateResponse('Test prompt', {
        model: 'llama2',
        systemPrompt: 'You are a gentle mirror',
      });

      expect(result).toBe('I notice some curiosity in your reflection');
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/generate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('llama2'),
        })
      );
    });

    it('should use default model if not specified', async () => {
      const mockResponse = {
        response: 'Test response',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await adapter.generateResponse('Test prompt');

      const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(callBody.model).toBe('llama2');
    });

    it('should throw error if model not found', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'model not found',
      });

      await expect(
        adapter.generateResponse('Test prompt', { model: 'non-existent-model' })
      ).rejects.toThrow('Model "non-existent-model" not found');
    });

    it('should handle connection refused error', async () => {
      const connectionError = new Error('fetch failed');
      connectionError.cause = { code: 'ECONNREFUSED' };
      global.fetch.mockRejectedValueOnce(connectionError);

      await expect(adapter.generateResponse('Test prompt')).rejects.toThrow(
        'Could not connect to Ollama'
      );
    });

    it('should throw error if response is empty', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await expect(adapter.generateResponse('Test prompt')).rejects.toThrow(
        'No response received from Ollama'
      );
    });

    it('should include system prompt in request', async () => {
      const mockResponse = { response: 'Test' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await adapter.generateResponse('Test prompt', {
        systemPrompt: 'Custom system prompt',
      });

      const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(callBody.system).toBe('Custom system prompt');
    });

    it('should set stream to false', async () => {
      const mockResponse = { response: 'Test' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await adapter.generateResponse('Test prompt');

      const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(callBody.stream).toBe(false);
    });
  });

  describe('isAvailable', () => {
    it('should return true if Ollama is available', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
      });

      const result = await adapter.isAvailable();

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:11434/api/tags', {
        method: 'GET',
      });
    });

    it('should return false if Ollama is not available', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await adapter.isAvailable();

      expect(result).toBe(false);
    });
  });

  describe('getProviderName', () => {
    it('should return "ollama"', () => {
      expect(adapter.getProviderName()).toBe('ollama');
    });
  });

  describe('listModels', () => {
    it('should list available models', async () => {
      const mockResponse = {
        models: [{ name: 'llama2' }, { name: 'mistral' }],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await adapter.listModels();

      expect(result).toEqual(['llama2', 'mistral']);
    });

    it('should return empty array on error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Failed'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = await adapter.listModels();

      expect(result).toEqual([]);
      consoleSpy.mockRestore();
    });
  });
});
