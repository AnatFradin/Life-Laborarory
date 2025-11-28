/**
 * Tests for useMarkdownToolbar composable
 * 
 * Tests toolbar state management and actions:
 * - Formatting actions integration
 * - Keyboard shortcuts (Cmd+B, Cmd+I, Cmd+K)
 * - Button disabled states
 */

import { describe, it, expect, vi } from 'vitest'
import { useMarkdownToolbar } from '@/composables/useMarkdownToolbar'

describe('useMarkdownToolbar', () => {
  describe('formatting actions', () => {
    it('applies bold formatting', () => {
      const { applyBold } = useMarkdownToolbar()
      const result = applyBold('hello world', 0, 5)
      
      expect(result.text).toBe('**hello** world')
      expect(result.selectionStart).toBe(2)
      expect(result.selectionEnd).toBe(7)
    })

    it('applies italic formatting', () => {
      const { applyItalic } = useMarkdownToolbar()
      const result = applyItalic('hello world', 0, 5)
      
      expect(result.text).toBe('*hello* world')
    })

    it('applies heading formatting', () => {
      const { applyHeading } = useMarkdownToolbar()
      const result = applyHeading('hello world', 0, 0, 1)
      
      expect(result.text).toBe('# hello world')
    })

    it('applies list formatting', () => {
      const { applyList } = useMarkdownToolbar()
      const result = applyList('hello world', 0, 0)
      
      expect(result.text).toBe('- hello world')
    })

    it('applies link formatting', () => {
      const { applyLink } = useMarkdownToolbar()
      const result = applyLink('hello', 0, 5, 'https://example.com')
      
      expect(result.text).toBe('[hello](https://example.com)')
    })
  })

  describe('keyboard shortcuts', () => {
    it('handles Cmd+B (Mac) for bold', () => {
      const { handleKeydown } = useMarkdownToolbar()
      const event = new KeyboardEvent('keydown', {
        key: 'b',
        metaKey: true
      })
      
      const mockGetContent = () => ({ text: 'hello', start: 0, end: 5 })
      const mockSetContent = vi.fn()
      
      const handled = handleKeydown(event, mockGetContent, mockSetContent)
      
      expect(handled).toBe(true)
      expect(mockSetContent).toHaveBeenCalledWith(expect.objectContaining({
        text: '**hello**'
      }))
    })

    it('handles Ctrl+B (Windows/Linux) for bold', () => {
      const { handleKeydown } = useMarkdownToolbar()
      const event = new KeyboardEvent('keydown', {
        key: 'b',
        ctrlKey: true
      })
      
      const mockGetContent = () => ({ text: 'hello', start: 0, end: 5 })
      const mockSetContent = vi.fn()
      
      const handled = handleKeydown(event, mockGetContent, mockSetContent)
      
      expect(handled).toBe(true)
      expect(mockSetContent).toHaveBeenCalled()
    })

    it('handles Cmd+I for italic', () => {
      const { handleKeydown } = useMarkdownToolbar()
      const event = new KeyboardEvent('keydown', {
        key: 'i',
        metaKey: true
      })
      
      const mockGetContent = () => ({ text: 'hello', start: 0, end: 5 })
      const mockSetContent = vi.fn()
      
      handleKeydown(event, mockGetContent, mockSetContent)
      
      expect(mockSetContent).toHaveBeenCalledWith(expect.objectContaining({
        text: '*hello*'
      }))
    })

    it('handles Cmd+K for link', () => {
      const { handleKeydown } = useMarkdownToolbar()
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true
      })
      
      const mockGetContent = () => ({ text: 'hello', start: 0, end: 5 })
      const mockSetContent = vi.fn()
      const mockOpenLinkDialog = vi.fn()
      
      handleKeydown(event, mockGetContent, mockSetContent, mockOpenLinkDialog)
      
      expect(mockOpenLinkDialog).toHaveBeenCalledWith('hello')
    })

    it('does not handle other shortcuts', () => {
      const { handleKeydown } = useMarkdownToolbar()
      const event = new KeyboardEvent('keydown', {
        key: 'x',
        metaKey: true
      })
      
      const mockGetContent = () => ({ text: 'hello', start: 0, end: 5 })
      const mockSetContent = vi.fn()
      
      const handled = handleKeydown(event, mockGetContent, mockSetContent)
      
      expect(handled).toBe(false)
      expect(mockSetContent).not.toHaveBeenCalled()
    })
  })

  describe('button states', () => {
    it('enables all buttons when text is present', () => {
      const { getButtonState } = useMarkdownToolbar()
      const state = getButtonState('hello world', 0, 5)
      
      expect(state.boldDisabled).toBe(false)
      expect(state.italicDisabled).toBe(false)
      expect(state.headingDisabled).toBe(false)
      expect(state.listDisabled).toBe(false)
      expect(state.linkDisabled).toBe(false)
    })

    it('keeps buttons enabled when cursor is at position 0', () => {
      const { getButtonState } = useMarkdownToolbar()
      const state = getButtonState('hello', 0, 0)
      
      // All buttons should work at cursor position
      expect(state.boldDisabled).toBe(false)
      expect(state.italicDisabled).toBe(false)
    })

    it('provides button labels', () => {
      const { getButtonLabels } = useMarkdownToolbar()
      const labels = getButtonLabels()
      
      expect(labels.bold).toBe('Bold')
      expect(labels.italic).toBe('Italic')
      expect(labels.h1).toBe('Heading 1')
      expect(labels.h2).toBe('Heading 2')
      expect(labels.h3).toBe('Heading 3')
      expect(labels.list).toBe('Bullet List')
      expect(labels.orderedList).toBe('Numbered List')
      expect(labels.link).toBe('Insert Link')
      expect(labels.blockquote).toBe('Quote')
      expect(labels.code).toBe('Code')
    })
  })
})
