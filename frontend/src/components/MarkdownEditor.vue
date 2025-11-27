<template>
  <div class="markdown-editor" @keydown="handleKeydown">
    <!-- Mode toggle button -->
    <button
      class="mode-toggle-button"
      data-test="mode-toggle"
      :aria-label="mode === 'edit' ? 'Switch to preview mode' : 'Switch to edit mode'"
      @click="toggleMode"
    >
      {{ mode === 'edit' ? 'Preview' : 'Edit' }}
    </button>

    <!-- Edit mode: textarea -->
    <textarea
      v-if="mode === 'edit'"
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MarkdownPreview from './MarkdownPreview.vue'
import { useMarkdownEditor } from '@/composables/useMarkdownEditor'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// Use composable for state management
const { mode, toggleMode, setCursorPosition } = useMarkdownEditor(props.modelValue, 'edit')

// Handle content updates
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

// Handle text selection for cursor position tracking
const handleSelection = (event) => {
  const { selectionStart, selectionEnd } = event.target
  setCursorPosition(selectionStart, selectionEnd)
}

// Handle keyboard shortcuts
const handleKeydown = (event) => {
  // Cmd+P (Mac) or Ctrl+P (Windows/Linux)
  if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
    event.preventDefault()
    toggleMode()
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

.mode-toggle-button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  background-color: #f5f7fa;
  color: #2c3e50;
  border: 1px solid #e0e5eb;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease;
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
