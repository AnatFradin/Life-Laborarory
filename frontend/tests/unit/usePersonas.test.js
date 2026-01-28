import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePersonas } from '../../src/composables/usePersonas';
import api from '../../src/services/api';

// Mock the API module
vi.mock('../../src/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('usePersonas Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadPersonas', () => {
    it('should load personas successfully', async () => {
      const mockPersonas = [
        {
          id: 'stoic-coach',
          name: 'Stoic Coach',
          style: 'Stoic Philosophy',
          description: 'Marcus Aurelius-inspired guidance',
          icon: '🏛️',
          color: '#4A5568',
        },
        {
          id: 'franklin',
          name: 'Benjamin Franklin',
          style: 'Pragmatic Wisdom',
          description: 'Practical virtue tracking',
          icon: '📜',
          color: '#B7791F',
        },
      ];

      api.get.mockResolvedValueOnce({ data: { success: true, data: mockPersonas } });

      const { personas, loading, error, loadPersonas } = usePersonas();

      expect(loading.value).toBe(false);
      expect(personas.value).toEqual([]);

      const promise = loadPersonas();
      expect(loading.value).toBe(true);

      await promise;

      expect(loading.value).toBe(false);
      expect(personas.value).toEqual(mockPersonas);
      expect(error.value).toBeNull();
      expect(api.get).toHaveBeenCalledWith('/personas');
    });

    it('should handle load personas error', async () => {
      const mockError = new Error('Network error');
      api.get.mockRejectedValueOnce(mockError);

      const { personas, loading, error, loadPersonas } = usePersonas();

      await loadPersonas();

      expect(loading.value).toBe(false);
      expect(personas.value).toEqual([]);
      expect(error.value).toBe('Unable to load coach personas. Please try again.');
    });

    it('should not load personas if already loading', async () => {
      api.get.mockResolvedValueOnce({ data: { data: [] } });

      const { loadPersonas } = usePersonas();

      const promise1 = loadPersonas();
      const promise2 = loadPersonas();

      await Promise.all([promise1, promise2]);

      expect(api.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('selectPersona', () => {
    it('should select a persona by id', async () => {
      const mockPersonas = [
        { id: 'stoic-coach', name: 'Stoic Coach' },
        { id: 'franklin', name: 'Benjamin Franklin' },
      ];

      api.get.mockResolvedValueOnce({ data: { success: true, data: mockPersonas } });

      const { selectedPersona, loadPersonas, selectPersona } = usePersonas();

      await loadPersonas();

      selectPersona('franklin');

      expect(selectedPersona.value).toEqual(mockPersonas[1]);
    });

    it('should clear selection if persona not found', async () => {
      const mockPersonas = [{ id: 'stoic-coach', name: 'Stoic Coach' }];

      api.get.mockResolvedValueOnce({ data: { success: true, data: mockPersonas } });

      const { selectedPersona, loadPersonas, selectPersona } = usePersonas();

      await loadPersonas();
      selectPersona('stoic-coach');
      expect(selectedPersona.value).toEqual(mockPersonas[0]);

      selectPersona('non-existent');
      expect(selectedPersona.value).toBeNull();
    });

    it('should handle null persona id', async () => {
      const mockPersonas = [{ id: 'stoic-coach', name: 'Stoic Coach' }];

      api.get.mockResolvedValueOnce({ data: { success: true, data: mockPersonas } });

      const { selectedPersona, loadPersonas, selectPersona } = usePersonas();

      await loadPersonas();
      selectPersona('stoic-coach');
      expect(selectedPersona.value).toEqual(mockPersonas[0]);

      selectPersona(null);
      expect(selectedPersona.value).toBeNull();
    });
  });

  describe('generateChatGPTLink', () => {
    it('should generate ChatGPT link successfully', async () => {
      const mockPersonas = [{ id: 'stoic-coach', name: 'Stoic Coach' }];
      api.get.mockResolvedValueOnce({ data: { success: true, data: mockPersonas } });
      
      const mockResponse = { chatGPTUrl: 'https://chat.openai.com/?q=encoded-prompt' };
      api.post.mockResolvedValueOnce({ data: { success: true, data: mockResponse } });

      const { generateChatGPTLink, loadPersonas, selectPersona } = usePersonas();
      
      await loadPersonas();
      selectPersona('stoic-coach');

      const result = await generateChatGPTLink('My reflection text');

      expect(result).toEqual(mockResponse);
      expect(api.post).toHaveBeenCalledWith('/personas/generate-link', {
        personaId: 'stoic-coach',
        reflectionText: 'My reflection text',
        promptId: null,
      });
    });

    it('should handle generate link error', async () => {
      const mockPersonas = [{ id: 'stoic-coach', name: 'Stoic Coach' }];
      api.get.mockResolvedValueOnce({ data: { success: true, data: mockPersonas } });
      api.post.mockRejectedValueOnce({ response: { data: { error: 'Server error' } } });

      const { generateChatGPTLink, loadPersonas, selectPersona } = usePersonas();
      
      await loadPersonas();
      selectPersona('stoic-coach');

      await expect(generateChatGPTLink('text')).rejects.toThrow('Server error');
    });

    it('should validate required parameters', async () => {
      const mockPersonas = [{ id: 'stoic-coach', name: 'Stoic Coach' }];
      api.get.mockResolvedValueOnce({ data: { success: true, data: mockPersonas } });
      api.post.mockResolvedValueOnce({ data: { success: true, data: { chatGPTUrl: 'https://chat.openai.com/?q=prompt' } } });

      const { generateChatGPTLink, loadPersonas, selectPersona } = usePersonas();
      
      await loadPersonas();
      selectPersona('stoic-coach');

      await expect(generateChatGPTLink('')).resolves.toBeDefined();
    });
  });

  describe('getPersonaById', () => {
    it('should get persona by id', async () => {
      const mockPersonas = [
        { id: 'stoic-coach', name: 'Stoic Coach' },
        { id: 'franklin', name: 'Benjamin Franklin' },
      ];

      api.get.mockResolvedValueOnce({ data: { success: true, data: mockPersonas } });

      const { loadPersonas, getPersonaById } = usePersonas();

      await loadPersonas();

      expect(getPersonaById('franklin')).toEqual(mockPersonas[1]);
      expect(getPersonaById('non-existent')).toBeNull();
    });

    it('should return null for empty personas list', () => {
      const { getPersonaById } = usePersonas();

      expect(getPersonaById('stoic-coach')).toBeNull();
    });
  });

  describe('reactive state', () => {
    it('should maintain reactive state across multiple operations', async () => {
      const mockPersonas = [
        { id: 'stoic-coach', name: 'Stoic Coach' },
        { id: 'franklin', name: 'Benjamin Franklin' },
      ];

      api.get.mockResolvedValueOnce({ data: { success: true, data: mockPersonas } });

      const { personas, selectedPersona, loading, loadPersonas, selectPersona } =
        usePersonas();

      expect(personas.value).toEqual([]);
      expect(selectedPersona.value).toBeNull();
      expect(loading.value).toBe(false);

      await loadPersonas();

      expect(personas.value).toEqual(mockPersonas);
      expect(loading.value).toBe(false);

      selectPersona('franklin');
      expect(selectedPersona.value).toEqual(mockPersonas[1]);

      selectPersona('stoic-coach');
      expect(selectedPersona.value).toEqual(mockPersonas[0]);
    });
  });
});
