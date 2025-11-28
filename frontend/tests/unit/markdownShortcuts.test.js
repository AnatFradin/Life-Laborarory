/**
 * Tests for Markdown shortcuts utility
 * 
 * Tests text insertion helpers for formatting toolbar:
 * - Bold, Italic, Headings, Lists, Links, Blockquotes
 * - Text wrapping vs cursor insertion
 * - Line-start formatting
 */

import { describe, it, expect } from 'vitest'
import {
  insertBold,
  insertItalic,
  insertHeading,
  insertList,
  insertOrderedList,
  insertLink,
  insertBlockquote,
  insertCode
} from '@/utils/markdownShortcuts'

describe('markdownShortcuts', () => {
  describe('insertBold', () => {
    it('wraps selected text with **', () => {
      const result = insertBold('hello world', 0, 5) // "hello" selected
      expect(result.text).toBe('**hello** world')
      expect(result.selectionStart).toBe(2) // After opening **
      expect(result.selectionEnd).toBe(7) // Before closing **
    })

    it('inserts ** at cursor when no selection', () => {
      const result = insertBold('hello world', 5, 5) // Cursor at position 5
      expect(result.text).toBe('hello**** world')
      expect(result.selectionStart).toBe(7) // Between **|**
      expect(result.selectionEnd).toBe(7)
    })

    it('handles text at start of string', () => {
      const result = insertBold('hello', 0, 5)
      expect(result.text).toBe('**hello**')
    })

    it('handles text at end of string', () => {
      const result = insertBold('hello world', 6, 11)
      expect(result.text).toBe('hello **world**')
    })
  })

  describe('insertItalic', () => {
    it('wraps selected text with *', () => {
      const result = insertItalic('hello world', 0, 5)
      expect(result.text).toBe('*hello* world')
      expect(result.selectionStart).toBe(1)
      expect(result.selectionEnd).toBe(6)
    })

    it('inserts * at cursor when no selection', () => {
      const result = insertItalic('hello world', 5, 5)
      expect(result.text).toBe('hello** world')
      expect(result.selectionStart).toBe(6)
      expect(result.selectionEnd).toBe(6)
    })
  })

  describe('insertHeading', () => {
    it('adds # at line start for H1', () => {
      const result = insertHeading('hello world', 0, 0, 1)
      expect(result.text).toBe('# hello world')
      expect(result.selectionStart).toBe(2)
    })

    it('adds ## at line start for H2', () => {
      const result = insertHeading('hello world', 0, 0, 2)
      expect(result.text).toBe('## hello world')
      expect(result.selectionStart).toBe(3)
    })

    it('adds ### at line start for H3', () => {
      const result = insertHeading('hello world', 0, 0, 3)
      expect(result.text).toBe('### hello world')
      expect(result.selectionStart).toBe(4)
    })

    it('works in middle of multiline text', () => {
      const text = 'line one\nline two\nline three'
      const result = insertHeading(text, 9, 9, 2) // Cursor on line two
      expect(result.text).toBe('line one\n## line two\nline three')
    })

    it('removes existing heading if already present', () => {
      const result = insertHeading('## hello world', 0, 0, 2)
      expect(result.text).toBe('hello world')
    })
  })

  describe('insertList', () => {
    it('adds - at line start', () => {
      const result = insertList('hello world', 0, 0)
      expect(result.text).toBe('- hello world')
      expect(result.selectionStart).toBe(2)
    })

    it('works in middle of multiline text', () => {
      const text = 'line one\nline two\nline three'
      const result = insertList(text, 9, 9)
      expect(result.text).toBe('line one\n- line two\nline three')
    })

    it('removes list marker if already present', () => {
      const result = insertList('- hello world', 0, 0)
      expect(result.text).toBe('hello world')
    })
  })

  describe('insertOrderedList', () => {
    it('adds 1. at line start', () => {
      const result = insertOrderedList('hello world', 0, 0)
      expect(result.text).toBe('1. hello world')
      expect(result.selectionStart).toBe(3)
    })

    it('removes ordered list marker if already present', () => {
      const result = insertOrderedList('1. hello world', 0, 0)
      expect(result.text).toBe('hello world')
    })
  })

  describe('insertLink', () => {
    it('inserts [text](url) format with selected text', () => {
      const result = insertLink('hello world', 0, 5, 'https://example.com')
      expect(result.text).toBe('[hello](https://example.com) world')
      expect(result.selectionStart).toBe(1)
      expect(result.selectionEnd).toBe(6)
    })

    it('inserts [](url) format when no text selected', () => {
      const result = insertLink('hello world', 5, 5, 'https://example.com')
      expect(result.text).toBe('hello[](https://example.com) world')
      expect(result.selectionStart).toBe(6) // Inside []
      expect(result.selectionEnd).toBe(6)
    })

    it('inserts []() when no URL provided', () => {
      const result = insertLink('hello world', 0, 5)
      expect(result.text).toBe('[hello]() world')
    })
  })

  describe('insertBlockquote', () => {
    it('adds > at line start', () => {
      const result = insertBlockquote('hello world', 0, 0)
      expect(result.text).toBe('> hello world')
      expect(result.selectionStart).toBe(2)
    })

    it('works in middle of multiline text', () => {
      const text = 'line one\nline two\nline three'
      const result = insertBlockquote(text, 9, 9)
      expect(result.text).toBe('line one\n> line two\nline three')
    })

    it('removes blockquote marker if already present', () => {
      const result = insertBlockquote('> hello world', 0, 0)
      expect(result.text).toBe('hello world')
    })
  })

  describe('insertCode', () => {
    it('wraps selected text with `', () => {
      const result = insertCode('hello world', 0, 5)
      expect(result.text).toBe('`hello` world')
      expect(result.selectionStart).toBe(1)
      expect(result.selectionEnd).toBe(6)
    })

    it('inserts `` at cursor when no selection', () => {
      const result = insertCode('hello world', 5, 5)
      expect(result.text).toBe('hello`` world')
      expect(result.selectionStart).toBe(6)
      expect(result.selectionEnd).toBe(6)
    })
  })

  describe('edge cases', () => {
    it('handles empty string', () => {
      const result = insertBold('', 0, 0)
      expect(result.text).toBe('****')
    })

    it('handles cursor at position 0', () => {
      const result = insertBold('hello', 0, 0)
      expect(result.text).toBe('****hello')
    })

    it('handles full text selection', () => {
      const result = insertBold('hello', 0, 5)
      expect(result.text).toBe('**hello**')
    })

    it('handles multiline selection', () => {
      const result = insertBold('hello\nworld', 0, 11)
      expect(result.text).toBe('**hello\nworld**')
    })
  })
})
