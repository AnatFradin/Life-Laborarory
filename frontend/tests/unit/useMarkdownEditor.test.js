/**
 * Tests for useMarkdownEditor composable
 * 
 * Te  it('maintains cursor position during mode toggle', () => {
    const { mode, cursorPosition, toggleMode, setCursorPosition } = useMarkdownEditor()
    
    // Set cursor position in edit mode
    setCursorPosition(42)
    expect(cursorPosition.value).toEqual({ start: 42, end: 42 })
    
    // Toggle to preview
    toggleMode()
    expect(mode.value).toBe('preview')
    expect(cursorPosition.value).toEqual({ start: 42, end: 42 }) // Position preserved
    
    // Toggle back to edit
    toggleMode()
    expect(mode.value).toBe('edit')
    expect(cursorPosition.value).toEqual({ start: 42, end: 42 }) // Still preserved
  })or state management:
 * - Content management
 * - Edit/Preview mode toggling
 * - Cursor position tracking
 */

import { describe, it, expect } from 'vitest'
import { useMarkdownEditor } from '@/composables/useMarkdownEditor'

describe('useMarkdownEditor', () => {
  it('initializes with default values (content="", mode="edit")', () => {
    const { content, mode, cursorPosition } = useMarkdownEditor()
    
    expect(content.value).toBe('')
    expect(mode.value).toBe('edit')
    expect(cursorPosition.value).toEqual({ start: 0, end: 0 })
  })

  it('initializes with provided content', () => {
    const initialContent = '# Hello World'
    const { content } = useMarkdownEditor(initialContent)
    
    expect(content.value).toBe('# Hello World')
  })

  it('toggles between edit and preview modes', () => {
    const { mode, toggleMode } = useMarkdownEditor()
    
    // Starts in edit mode
    expect(mode.value).toBe('edit')
    
    // Toggle to preview
    toggleMode()
    expect(mode.value).toBe('preview')
    
    // Toggle back to edit
    toggleMode()
    expect(mode.value).toBe('edit')
  })

  it('updates content reactively', () => {
    const { content, updateContent } = useMarkdownEditor()
    
    expect(content.value).toBe('')
    
    updateContent('# New content')
    expect(content.value).toBe('# New content')
    
    updateContent('Updated again')
    expect(content.value).toBe('Updated again')
  })

  it('maintains cursor position during mode toggle', () => {
    const { mode, cursorPosition, setCursorPosition, toggleMode } = useMarkdownEditor()
    
    // Set cursor position in edit mode
    setCursorPosition(42)
    expect(cursorPosition.value).toEqual({ start: 42, end: 42 })
    
    // Toggle to preview
    toggleMode()
    expect(mode.value).toBe('preview')
    expect(cursorPosition.value).toEqual({ start: 42, end: 42 }) // Should preserve position
    
    // Toggle back to edit
    toggleMode()
    expect(mode.value).toBe('edit')
    expect(cursorPosition.value).toEqual({ start: 42, end: 42 }) // Should still be preserved
  })

  it('tracks cursor position changes', () => {
    const { cursorPosition, setCursorPosition } = useMarkdownEditor()
    
    expect(cursorPosition.value).toEqual({ start: 0, end: 0 })
    
    setCursorPosition(10)
    expect(cursorPosition.value).toEqual({ start: 10, end: 10 })
    
    setCursorPosition(100)
    expect(cursorPosition.value).toEqual({ start: 100, end: 100 })
  })

  it('returns reactive refs that update UI', () => {
    const { content, mode } = useMarkdownEditor()
    
    // Check that values are reactive (have .value property)
    expect(content).toHaveProperty('value')
    expect(mode).toHaveProperty('value')
  })

  it('allows direct content modification via ref', () => {
    const { content } = useMarkdownEditor('Initial')
    
    // Can modify via .value
    content.value = 'Modified'
    expect(content.value).toBe('Modified')
  })

  it('allows direct mode modification via ref', () => {
    const { mode } = useMarkdownEditor()
    
    // Can modify via .value
    mode.value = 'preview'
    expect(mode.value).toBe('preview')
    
    mode.value = 'edit'
    expect(mode.value).toBe('edit')
  })
})
