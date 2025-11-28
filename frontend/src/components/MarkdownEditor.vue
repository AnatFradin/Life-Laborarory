<template>
  <div class="markdown-editor" @keydown="handleKeydown">
    <!-- Toolbar and mode toggle row -->
    <div class="editor-header">
      <!-- Formatting toolbar (only in edit mode) -->
      <MarkdownToolbar
        v-if="mode === 'edit'"
        @format="handleFormat"
      />

      <!-- Mode toggle button -->
      <button
        class="mode-toggle-button"
        data-test="mode-toggle"
        :aria-label="mode === 'edit' ? 'Switch to preview mode' : 'Switch to edit mode'"
        @click="toggleMode"
      >
        <span :class="{ active: mode === 'edit' }">Edit</span>
        <span class="separator">/</span>
        <span :class="{ active: mode === 'preview' }">Preview</span>
      </button>
    </div>

    <!-- Edit mode: textarea -->
    <textarea
      v-if="mode === 'edit'"
      ref="textareaRef"
      class="markdown-textarea"
      :value="modelValue"
      @input="handleInput"
      @select="handleSelection"
      aria-label="Markdown editor textarea"
      placeholder="Write your reflection using Markdown..."
    ></textarea>

    <!-- Preview mode: rendered Markdown -->
    <MarkdownPreview
      v-else
      :content="modelValue"
    />

    <!-- Link Dialog -->
    <LinkDialog
      :is-open="linkDialogOpen"
      :selected-text="selectedTextForLink"
      @close="linkDialogOpen = false"
      @confirm="handleLinkInsert"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MarkdownPreview from './MarkdownPreview.vue'
import MarkdownToolbar from './MarkdownToolbar.vue'
import LinkDialog from './LinkDialog.vue'
import { useMarkdownEditor } from '@/composables/useMarkdownEditor'
import { useMarkdownToolbar } from '@/composables/useMarkdownToolbar'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// Refs
const textareaRef = ref(null)
const linkDialogOpen = ref(false)
const selectedTextForLink = ref('')

// Use composables
const { mode, toggleMode, setCursorPosition } = useMarkdownEditor(props.modelValue, 'edit')
const {
  applyBold,
  applyItalic,
  applyHeading,
  applyList,
  applyOrderedList,
  applyLink,
  applyBlockquote,
  applyCode,
  handleKeydown: toolbarHandleKeydown
} = useMarkdownToolbar()

// Handle content updates
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

// Handle text selection for cursor position tracking
const handleSelection = (event) => {
  const { selectionStart, selectionEnd } = event.target
  setCursorPosition(selectionStart, selectionEnd)
}

// Get current textarea state
const getTextareaState = () => {
  const textarea = textareaRef.value
  if (!textarea) return { text: props.modelValue, start: 0, end: 0 }
  
  return {
    text: textarea.value,
    start: textarea.selectionStart,
    end: textarea.selectionEnd
  }
}

// Apply formatting result to textarea
const applyFormattingResult = (result) => {
  emit('update:modelValue', result.text)
  
  // Restore selection after Vue updates
  setTimeout(() => {
    const textarea = textareaRef.value
    if (textarea) {
      textarea.focus()
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd)
    }
  }, 0)
}

// Handle formatting from toolbar
const handleFormat = (format) => {
  const state = getTextareaState()
  let result

  switch (format) {
    case 'bold':
      result = applyBold(state.text, state.start, state.end)
      break
    case 'italic':
      result = applyItalic(state.text, state.start, state.end)
      break
    case 'h1':
      result = applyHeading(state.text, state.start, state.end, 1)
      break
    case 'h2':
      result = applyHeading(state.text, state.start, state.end, 2)
      break
    case 'h3':
      result = applyHeading(state.text, state.start, state.end, 3)
      break
    case 'list':
      result = applyList(state.text, state.start, state.end)
      break
    case 'orderedList':
      result = applyOrderedList(state.text, state.start, state.end)
      break
    case 'link':
      // Open link dialog
      selectedTextForLink.value = state.text.substring(state.start, state.end)
      linkDialogOpen.value = true
      return
    case 'blockquote':
      result = applyBlockquote(state.text, state.start, state.end)
      break
    case 'code':
      result = applyCode(state.text, state.start, state.end)
      break
  }

  if (result) {
    applyFormattingResult(result)
  }
}

// Handle link insertion from dialog
const handleLinkInsert = ({ text, url }) => {
  const state = getTextareaState()
  const result = applyLink(state.text, state.start, state.end, url)
  applyFormattingResult(result)
}

// Handle keyboard shortcuts
const handleKeydown = (event) => {
  // Cmd+P (Mac) or Ctrl+P (Windows/Linux) for preview toggle
  if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
    event.preventDefault()
    toggleMode()
    return
  }

  // Toolbar keyboard shortcuts (Cmd+B, Cmd+I, Cmd+K)
  if (mode.value === 'edit') {
    const handled = toolbarHandleKeydown(
      event,
      getTextareaState,
      applyFormattingResult,
      (selectedText) => {
        selectedTextForLink.value = selectedText
        linkDialogOpen.value = true
      }
    )
    
    if (handled) {
      event.preventDefault()
    }
  }
}
</script>

<style scoped>
.markdown-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  min-height: 300px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
  min-height: 44px;
}

.mode-toggle-button {
  padding: 0.5rem 1rem;
  background-color: #f5f7fa;
  color: #2c3e50;
  border: 1px solid #e0e5eb;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.mode-toggle-button span {
  opacity: 0.5;
  transition: opacity 150ms ease;
}

.mode-toggle-button span.active {
  opacity: 1;
  font-weight: 600;
}

.mode-toggle-button .separator {
  opacity: 0.3;
}

.mode-toggle-button:hover {
  background-color: #e8ebf0;
}

.mode-toggle-button:focus {
  outline: 2px solid #5a6c7d;
  outline-offset: 2px;
}

.markdown-textarea {
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #ffffff;
  border: 1px solid #e0e5eb;
  border-radius: 4px;
  resize: vertical;
  transition: border-color 150ms ease;
}

.markdown-textarea:focus {
  outline: none;
  border-color: #5a6c7d;
  box-shadow: 0 0 0 2px rgba(90, 108, 125, 0.1);
}

.markdown-textarea::placeholder {
  color: #a0aec0;
}
</style>
