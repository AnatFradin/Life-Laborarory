/**
 * Unit tests for rephrasing-prompts.js
 * Tests the system prompts for each rephrasing style
 */

import { describe, it, expect } from 'vitest';
import {
  getClearerPrompt,
  getMorePositivePrompt,
  getMoreConstructivePrompt,
  getPromptForStyle,
} from '../../src/adapters/ai/rephrasing-prompts.js';

describe('rephrasing-prompts', () => {
  describe('getClearerPrompt', () => {
    it('should return clearer style prompt', () => {
      const prompt = getClearerPrompt();

      expect(prompt).toBeDefined();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(50);
    });

    it('should include key guidance for clarity', () => {
      const prompt = getClearerPrompt();

      expect(prompt.toLowerCase()).toContain('clear');
      expect(prompt.toLowerCase()).toContain('concise');
      expect(prompt.toLowerCase()).toContain('simpler');
    });

    it('should instruct to maintain original meaning', () => {
      const prompt = getClearerPrompt();

      expect(prompt.toLowerCase()).toContain('maintain');
      expect(prompt.toLowerCase()).toContain('meaning');
    });

    it('should instruct not to add advice', () => {
      const prompt = getClearerPrompt();

      expect(prompt.toLowerCase()).toContain('do not add advice');
    });
  });

  describe('getMorePositivePrompt', () => {
    it('should return more positive style prompt', () => {
      const prompt = getMorePositivePrompt();

      expect(prompt).toBeDefined();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(50);
    });

    it('should include key guidance for positive tone', () => {
      const prompt = getMorePositivePrompt();

      expect(prompt.toLowerCase()).toContain('positive');
      expect(prompt.toLowerCase()).toContain('authentic');
    });

    it('should instruct to focus on growth', () => {
      const prompt = getMorePositivePrompt();

      expect(prompt.toLowerCase()).toContain('growth');
    });

    it('should instruct not to minimize emotions', () => {
      const prompt = getMorePositivePrompt();

      expect(prompt.toLowerCase()).toContain('do not minimize');
      expect(prompt.toLowerCase()).toContain('emotion');
    });
  });

  describe('getMoreConstructivePrompt', () => {
    it('should return more constructive style prompt', () => {
      const prompt = getMoreConstructivePrompt();

      expect(prompt).toBeDefined();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(50);
    });

    it('should include key guidance for constructive tone', () => {
      const prompt = getMoreConstructivePrompt();

      expect(prompt.toLowerCase()).toContain('constructive');
      expect(prompt.toLowerCase()).toContain('forward');
    });

    it('should instruct to emphasize learning', () => {
      const prompt = getMoreConstructivePrompt();

      expect(prompt.toLowerCase()).toContain('learning');
    });

    it('should instruct to maintain honesty', () => {
      const prompt = getMoreConstructivePrompt();

      expect(prompt.toLowerCase()).toContain('honest');
      expect(prompt.toLowerCase()).toContain('challenge');
    });
  });

  describe('getPromptForStyle', () => {
    it('should return clearer prompt for "clearer" style', () => {
      const prompt = getPromptForStyle('clearer');

      expect(prompt).toBe(getClearerPrompt());
    });

    it('should return more positive prompt for "more-positive" style', () => {
      const prompt = getPromptForStyle('more-positive');

      expect(prompt).toBe(getMorePositivePrompt());
    });

    it('should return more constructive prompt for "more-constructive" style', () => {
      const prompt = getPromptForStyle('more-constructive');

      expect(prompt).toBe(getMoreConstructivePrompt());
    });

    it('should throw error for invalid style', () => {
      expect(() => getPromptForStyle('invalid-style')).toThrow('Invalid rephrasing style');
    });

    it('should throw error for undefined style', () => {
      expect(() => getPromptForStyle()).toThrow('Invalid rephrasing style');
    });
  });
});
