/**
 * Composable for Markdown toolbar functionality
 * 
 * Provides formatting actions, keyboard shortcut handling, and button state management
 */

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

export function useMarkdownToolbar() {
  // Formatting actions (wrappers around utility functions)
  const applyBold = (text, start, end) => insertBold(text, start, end)
  const applyItalic = (text, start, end) => insertItalic(text, start, end)
  const applyHeading = (text, start, end, level) => insertHeading(text, start, end, level)
  const applyList = (text, start, end) => insertList(text, start, end)
  const applyOrderedList = (text, start, end) => insertOrderedList(text, start, end)
  const applyLink = (text, start, end, url) => insertLink(text, start, end, url)
  const applyBlockquote = (text, start, end) => insertBlockquote(text, start, end)
  const applyCode = (text, start, end) => insertCode(text, start, end)

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} event
   * @param {Function} getContent - Returns { text, start, end }
   * @param {Function} setContent - Accepts { text, selectionStart, selectionEnd }
   * @param {Function} openLinkDialog - Optional: opens link dialog
   * @returns {boolean} - true if handled, false otherwise
   */
  const handleKeydown = (event, getContent, setContent, openLinkDialog = null) => {
    const isMac = event.metaKey
    const isWindows = event.ctrlKey
    
    if (!isMac && !isWindows) return false

    const { text, start, end } = getContent()

    // Cmd/Ctrl + B: Bold
    if (event.key === 'b') {
      event.preventDefault()
      const result = insertBold(text, start, end)
      setContent(result)
      return true
    }

    // Cmd/Ctrl + I: Italic
    if (event.key === 'i') {
      event.preventDefault()
      const result = insertItalic(text, start, end)
      setContent(result)
      return true
    }

    // Cmd/Ctrl + K: Link
    if (event.key === 'k') {
      event.preventDefault()
      if (openLinkDialog) {
        const selectedText = text.substring(start, end)
        openLinkDialog(selectedText)
      } else {
        const result = insertLink(text, start, end, '')
        setContent(result)
      }
      return true
    }

    return false
  }

  /**
   * Get button disabled states
   * All buttons are always enabled for now (can insert at cursor or wrap selection)
   */
  const getButtonState = (text, start, end) => {
    return {
      boldDisabled: false,
      italicDisabled: false,
      headingDisabled: false,
      listDisabled: false,
      linkDisabled: false,
      blockquoteDisabled: false,
      codeDisabled: false
    }
  }

  /**
   * Get button labels for accessibility
   */
  const getButtonLabels = () => {
    return {
      bold: 'Bold',
      italic: 'Italic',
      h1: 'Heading 1',
      h2: 'Heading 2',
      h3: 'Heading 3',
      list: 'Bullet List',
      orderedList: 'Numbered List',
      link: 'Insert Link',
      blockquote: 'Quote',
      code: 'Code',
      rephrase: 'AI Rephrase (select text first)'
    }
  }

  return {
    // Formatting actions
    applyBold,
    applyItalic,
    applyHeading,
    applyList,
    applyOrderedList,
    applyLink,
    applyBlockquote,
    applyCode,
    
    // Keyboard shortcuts
    handleKeydown,
    
    // Button state
    getButtonState,
    getButtonLabels
  }
}
