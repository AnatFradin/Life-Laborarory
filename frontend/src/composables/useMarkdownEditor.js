/**
 * Composable for Markdown editor state management
 * 
 * Manages editor mode (edit/preview), content, and cursor position
 * Used by MarkdownEditor component for reactive state
 */

import { ref, toRefs } from 'vue'

export function useMarkdownEditor(initialContent = '', initialMode = 'edit') {
  // State
  const content = ref(initialContent)
  const mode = ref(initialMode)
  const cursorPosition = ref({ start: 0, end: 0 })

  // Methods
  const toggleMode = () => {
    mode.value = mode.value === 'edit' ? 'preview' : 'edit'
  }

  const updateContent = (newContent) => {
    content.value = newContent
  }

  const setCursorPosition = (start, end = start) => {
    cursorPosition.value = { start, end }
  }

  // Return reactive refs
  return {
    content,
    mode,
    cursorPosition,
    toggleMode,
    updateContent,
    setCursorPosition
  }
}
