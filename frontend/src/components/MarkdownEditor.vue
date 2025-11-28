<template>
  <div class="markdown-editor" @keydown="handleKeydown">
    <!-- Toolbar and mode toggle row -->
    <div class="editor-header">
      <!-- Formatting toolbar (only in edit mode) -->
      <MarkdownToolbar
        v-if="mode === 'edit'"
        :has-selection="hasTextToRephrase"
        @format="handleFormat"
        @rephrase="handleRephrase"
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

    <!-- Rephrase Dialog -->
    <RephraseDialog
      :is-open="rephraseDialogOpen"
      :original-text="selectedTextForRephrase"
      :suggestions="rephraseSuggestions"
      :loading="rephraseLoading"
      :error="rephraseError"
      @close="handleRephraseClose"
      @rephrase="handleRephraseRequest"
      @accept="handleRephraseAccept"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MarkdownPreview from './MarkdownPreview.vue'
import MarkdownToolbar from './MarkdownToolbar.vue'
import LinkDialog from './LinkDialog.vue'
import RephraseDialog from './RephraseDialog.vue'
import { useMarkdownEditor } from '@/composables/useMarkdownEditor'
import { useMarkdownToolbar } from '@/composables/useMarkdownToolbar'
import { useRephrasing } from '@/composables/useRephrasing'

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
const rephraseDialogOpen = ref(false)
const selectedTextForRephrase = ref('')
const selectionStart = ref(0)
const selectionEnd = ref(0)

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
const {
  loading: rephraseLoading,
  error: rephraseError,
  suggestions: rephraseSuggestions,
  requestRephrase,
  clearSuggestions
} = useRephrasing()

// Computed
const hasTextToRephrase = computed(() => {
  // Button is enabled if there's any content in the editor
  return props.modelValue && props.modelValue.trim().length > 0
})

// Handle content updates
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

// Handle text selection for cursor position tracking
const handleSelection = (event) => {
  const { selectionStart: start, selectionEnd: end } = event.target
  selectionStart.value = start
  selectionEnd.value = end
  setCursorPosition(start, end)
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

// Handle rephrase button click from toolbar
const handleRephrase = () => {
  const state = getTextareaState()
  
  // If there's a selection, use it. Otherwise, use all text.
  let textToRephrase
  if (state.start !== state.end) {
    // Text is selected
    textToRephrase = state.text.substring(state.start, state.end)
  } else {
    // No selection, use all text
    textToRephrase = state.text
  }
  
  if (!textToRephrase || textToRephrase.trim().length === 0) {
    // No text to rephrase
    return
  }
  
  selectedTextForRephrase.value = textToRephrase
  clearSuggestions()
  rephraseDialogOpen.value = true
}

// Handle rephrase request from dialog (when user selects style)
const handleRephraseRequest = async (style) => {
  await requestRephrase(selectedTextForRephrase.value, style)
}

// Handle accepting a suggestion from dialog
const handleRephraseAccept = (suggestion) => {
  const textarea = textareaRef.value
  if (!textarea) return
  
  const text = textarea.value
  
  // Check if we had a selection or used all text
  if (selectionStart.value === selectionEnd.value || selectedTextForRephrase.value === text) {
    // Replace all text
    emit('update:modelValue', suggestion)
    
    // Close dialog and restore focus
    rephraseDialogOpen.value = false
    clearSuggestions()
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(suggestion.length, suggestion.length)
    }, 0)
  } else {
    // Replace only selected text
    const before = text.substring(0, selectionStart.value)
    const after = text.substring(selectionEnd.value)
    const newText = before + suggestion + after
    
    emit('update:modelValue', newText)
    
    // Close dialog and restore focus
    rephraseDialogOpen.value = false
    clearSuggestions()
    
    // Restore cursor after the replaced text
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = selectionStart.value + suggestion.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }
}

// Handle closing rephrase dialog
const handleRephraseClose = () => {
  rephraseDialogOpen.value = false
  clearSuggestions()
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
