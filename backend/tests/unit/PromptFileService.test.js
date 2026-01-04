import { describe, it, expect, beforeEach } from 'vitest';
import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import PromptFileService from '../../src/domain/services/PromptFileService.js';

describe('PromptFileService', () => {
  let testDir;
  let testFilePath;

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = join(tmpdir(), `prompt-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
    testFilePath = join(testDir, 'test-prompts.json');
  });

  describe('loadPrompts', () => {
    it('should load valid prompt file successfully', async () => {
      const validPrompts = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'test-prompt',
                title: 'Test Prompt',
                description: 'A test prompt for testing',
                tags: ['test', 'example'],
                isDefault: true,
                systemPrompt: 'This is a test system prompt that is long enough to pass validation requirements.'
              }
            ]
          }
        }
      };

      await writeFile(testFilePath, JSON.stringify(validPrompts, null, 2));

      const service = new PromptFileService(testFilePath);
      const result = await service.loadPrompts();

      expect(result).toBeDefined();
      expect(result.version).toBe('1.0.0');
      expect(result.personas['test-persona']).toBeDefined();
      expect(result.personas['test-persona'].prompts).toHaveLength(1);
    });

    it('should handle missing file gracefully', async () => {
      const nonExistentPath = join(testDir, 'non-existent.json');
      const service = new PromptFileService(nonExistentPath);
      const result = await service.loadPrompts();

      expect(result).toBeDefined();
      expect(result.personas).toEqual({});
    });

    it('should handle invalid JSON gracefully', async () => {
      await writeFile(testFilePath, 'invalid json content');

      const service = new PromptFileService(testFilePath);
      const result = await service.loadPrompts();

      expect(result).toBeDefined();
      expect(result.personas).toEqual({});
    });

    it('should cache prompts efficiently', async () => {
      const validPrompts = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'test-prompt',
                title: 'Test Prompt',
                description: 'A test prompt',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'This is a test system prompt that is long enough to pass validation.'
              }
            ]
          }
        }
      };

      await writeFile(testFilePath, JSON.stringify(validPrompts));

      const service = new PromptFileService(testFilePath);
      await service.loadPrompts();

      const firstLoadTime = service.lastLoadTime;
      expect(firstLoadTime).toBeDefined();

      // Access cached prompts
      const prompts = service.getPromptsForPersona('test-persona');
      expect(prompts).toHaveLength(1);

      // Load time should not change when using cache
      expect(service.lastLoadTime).toBe(firstLoadTime);
    });
  });

  describe('validatePromptSchema', () => {
    it('should validate correct prompt schema', () => {
      const service = new PromptFileService();
      const validData = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'test-prompt',
                title: 'Test',
                description: 'Test description',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'This is a long enough system prompt for validation to pass successfully.'
              }
            ]
          }
        }
      };

      const result = service.validatePromptSchema(validData);
      expect(result.valid).toBe(true);
    });

    it('should reject missing version', () => {
      const service = new PromptFileService();
      const invalidData = {
        personas: {}
      };

      const result = service.validatePromptSchema(invalidData);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('version');
    });

    it('should reject invalid prompt data', () => {
      const service = new PromptFileService();
      const invalidData = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'test-prompt',
                // Missing required fields
              }
            ]
          }
        }
      };

      const result = service.validatePromptSchema(invalidData);
      expect(result.valid).toBe(false);
    });

    it('should reject duplicate prompt IDs', () => {
      const service = new PromptFileService();
      const invalidData = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'duplicate-id',
                title: 'First',
                description: 'First prompt',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'This is a system prompt that is long enough for validation.'
              },
              {
                id: 'duplicate-id',
                title: 'Second',
                description: 'Second prompt',
                tags: ['test'],
                isDefault: false,
                systemPrompt: 'This is another system prompt that is long enough for validation.'
              }
            ]
          }
        }
      };

      const result = service.validatePromptSchema(invalidData);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Duplicate');
    });

    it('should reject no default prompt', () => {
      const service = new PromptFileService();
      const invalidData = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'test-prompt',
                title: 'Test',
                description: 'Test description',
                tags: ['test'],
                isDefault: false,
                systemPrompt: 'This is a system prompt that is long enough for validation.'
              }
            ]
          }
        }
      };

      const result = service.validatePromptSchema(invalidData);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('no default');
    });

    it('should reject multiple defaults per persona', () => {
      const service = new PromptFileService();
      const invalidData = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'prompt-1',
                title: 'First',
                description: 'First prompt',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'This is a system prompt that is long enough for validation.'
              },
              {
                id: 'prompt-2',
                title: 'Second',
                description: 'Second prompt',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'This is another system prompt that is long enough for validation.'
              }
            ]
          }
        }
      };

      const result = service.validatePromptSchema(invalidData);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Multiple default');
    });

    it('should reject empty tags array', () => {
      const service = new PromptFileService();
      const invalidData = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'test-prompt',
                title: 'Test',
                description: 'Test description',
                tags: [],
                isDefault: true,
                systemPrompt: 'This is a system prompt that is long enough for validation.'
              }
            ]
          }
        }
      };

      const result = service.validatePromptSchema(invalidData);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('tags');
    });

    it('should reject too short systemPrompt', () => {
      const service = new PromptFileService();
      const invalidData = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'test-prompt',
                title: 'Test',
                description: 'Test description',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'Too short'
              }
            ]
          }
        }
      };

      const result = service.validatePromptSchema(invalidData);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('systemPrompt');
    });
  });

  describe('getPromptsForPersona', () => {
    it('should get prompts for a persona', async () => {
      const validPrompts = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'prompt-1',
                title: 'First',
                description: 'First prompt',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'This is a system prompt that is long enough for validation.'
              },
              {
                id: 'prompt-2',
                title: 'Second',
                description: 'Second prompt',
                tags: ['test'],
                isDefault: false,
                systemPrompt: 'This is another system prompt that is long enough for validation.'
              }
            ]
          }
        }
      };

      await writeFile(testFilePath, JSON.stringify(validPrompts));

      const service = new PromptFileService(testFilePath);
      await service.loadPrompts();

      const prompts = service.getPromptsForPersona('test-persona');
      expect(prompts).toHaveLength(2);
      expect(prompts[0].id).toBe('prompt-1');
      expect(prompts[1].id).toBe('prompt-2');
    });

    it('should return empty array for non-existent persona', async () => {
      const validPrompts = {
        version: '1.0.0',
        personas: {}
      };

      await writeFile(testFilePath, JSON.stringify(validPrompts));

      const service = new PromptFileService(testFilePath);
      await service.loadPrompts();

      const prompts = service.getPromptsForPersona('non-existent');
      expect(prompts).toEqual([]);
    });
  });

  describe('getPromptById', () => {
    it('should get specific prompt by ID', async () => {
      const validPrompts = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'target-prompt',
                title: 'Target',
                description: 'Target prompt',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'This is a system prompt that is long enough for validation.'
              }
            ]
          }
        }
      };

      await writeFile(testFilePath, JSON.stringify(validPrompts));

      const service = new PromptFileService(testFilePath);
      await service.loadPrompts();

      const prompt = service.getPromptById('test-persona', 'target-prompt');
      expect(prompt).toBeDefined();
      expect(prompt.id).toBe('target-prompt');
      expect(prompt.title).toBe('Target');
    });

    it('should return null for non-existent prompt ID', async () => {
      const validPrompts = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'existing-prompt',
                title: 'Existing',
                description: 'Existing prompt',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'This is a system prompt that is long enough for validation.'
              }
            ]
          }
        }
      };

      await writeFile(testFilePath, JSON.stringify(validPrompts));

      const service = new PromptFileService(testFilePath);
      await service.loadPrompts();

      const prompt = service.getPromptById('test-persona', 'non-existent');
      expect(prompt).toBeNull();
    });
  });

  describe('getDefaultPromptForPersona', () => {
    it('should get default prompt', async () => {
      const validPrompts = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'non-default',
                title: 'Non-default',
                description: 'Non-default prompt',
                tags: ['test'],
                isDefault: false,
                systemPrompt: 'This is a system prompt that is long enough for validation.'
              },
              {
                id: 'default-prompt',
                title: 'Default',
                description: 'Default prompt',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'This is a default system prompt that is long enough for validation.'
              }
            ]
          }
        }
      };

      await writeFile(testFilePath, JSON.stringify(validPrompts));

      const service = new PromptFileService(testFilePath);
      await service.loadPrompts();

      const prompt = service.getDefaultPromptForPersona('test-persona');
      expect(prompt).toBeDefined();
      expect(prompt.id).toBe('default-prompt');
      expect(prompt.isDefault).toBe(true);
    });

    it('should return first prompt if no default specified', async () => {
      const validPrompts = {
        version: '1.0.0',
        personas: {
          'test-persona': {
            prompts: [
              {
                id: 'first-prompt',
                title: 'First',
                description: 'First prompt',
                tags: ['test'],
                isDefault: true,
                systemPrompt: 'This is a system prompt that is long enough for validation.'
              }
            ]
          }
        }
      };

      await writeFile(testFilePath, JSON.stringify(validPrompts));

      const service = new PromptFileService(testFilePath);
      await service.loadPrompts();

      const prompt = service.getDefaultPromptForPersona('test-persona');
      expect(prompt).toBeDefined();
      expect(prompt.id).toBe('first-prompt');
    });
  });

  describe('mergeWithDefaults', () => {
    it('should merge file prompts with defaults properly', () => {
      const service = new PromptFileService();
      
      const filePrompts = {
        version: '1.0.0',
        personas: {
          'persona-1': {
            prompts: [
              {
                id: 'file-prompt',
                title: 'File Prompt',
                description: 'From file',
                tags: ['file'],
                isDefault: true,
                systemPrompt: 'This is from file'
              }
            ]
          }
        }
      };

      const defaultPrompts = {
        'persona-2': {
          prompts: [
            {
              id: 'default-prompt',
              title: 'Default Prompt',
              description: 'From defaults',
              tags: ['default'],
              isDefault: true,
              systemPrompt: 'This is from defaults'
            }
          ]
        }
      };

      const merged = service.mergeWithDefaults(filePrompts, defaultPrompts);

      expect(merged.personas['persona-1']).toBeDefined();
      expect(merged.personas['persona-2']).toBeDefined();
      expect(merged.personas['persona-1'].prompts[0].id).toBe('file-prompt');
      expect(merged.personas['persona-2'].prompts[0].id).toBe('default-prompt');
    });

    it('should prioritize file prompts over defaults', () => {
      const service = new PromptFileService();
      
      const filePrompts = {
        version: '1.0.0',
        personas: {
          'shared-persona': {
            prompts: [
              {
                id: 'file-prompt',
                title: 'File Version',
                description: 'From file',
                tags: ['file'],
                isDefault: true,
                systemPrompt: 'This is from file'
              }
            ]
          }
        }
      };

      const defaultPrompts = {
        'shared-persona': {
          prompts: [
            {
              id: 'default-prompt',
              title: 'Default Version',
              description: 'From defaults',
              tags: ['default'],
              isDefault: true,
              systemPrompt: 'This is from defaults'
            }
          ]
        }
      };

      const merged = service.mergeWithDefaults(filePrompts, defaultPrompts);

      expect(merged.personas['shared-persona'].prompts[0].id).toBe('file-prompt');
      expect(merged.personas['shared-persona'].prompts[0].title).toBe('File Version');
    });
  });
});
