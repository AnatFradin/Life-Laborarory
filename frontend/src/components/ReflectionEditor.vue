<template>
  <div class="reflection-editor">
    <div class="editor-header">
      <div class="header-top">
        <label for="reflection-input" class="editor-label">
          Your Reflection
        </label>
        
        <!-- Editor mode toggle switch -->
        <label class="toggle-switch">
          <span class="toggle-label-left" :class="{ active: !markdownEnabled }">Plain Text</span>
          <input
            type="checkbox"
            v-model="markdownEnabled"
            aria-label="Toggle Markdown mode"
            class="toggle-input"
          />
          <span class="toggle-slider"></span>
          <span class="toggle-label-right" :class="{ active: markdownEnabled }">Markdown</span>
        </label>
      </div>
      
      <span class="editor-hint text-tertiary text-sm" id="editor-hint">
        {{ markdownEnabled 
          ? 'Use Markdown syntax for formatting. Press Cmd+P to toggle preview.'
          : 'Write freely. Press Cmd+Enter to save, or use the button below.'
        }}
      </span>
    </div>

    <!-- Markdown editor (when enabled) -->
    <MarkdownEditor
      v-if="markdownEnabled"
      v-model="localContent"
      @keydown="handleKeyDown"
    />

    <!-- Plain text editor (backward compatible) -->
    <textarea
      v-else
      id="reflection-input"
      ref="textareaRef"
      v-model="localContent"
      class="reflection-textarea"
      placeholder="What's on your mind?"
      aria-describedby="editor-hint"
      :aria-busy="saving"
      @keydown="handleKeyDown"
    ></textarea>

    <div class="editor-actions">
      <button
        type="button"
        class="btn-save"
        @click="handleSave"
        :disabled="!hasContent || saving"
        :aria-busy="saving"
      >
        {{ saving ? 'Saving...' : 'Save Reflection' }}
      </button>

      <button
        v-if="hasSavedContent"
        type="button"
        class="btn-ai"
        @click="handleAIFeedback"
        :disabled="generatingAI"
        :aria-busy="generatingAI"
      >
        {{ generatingAI ? 'Thinking...' : 'Get AI Feedback' }}
      </button>

      <span v-if="lastSaved" class="save-status text-tertiary text-sm">
        Saved {{ formatTimeAgo(lastSaved) }}
      </span>
    </div>

    <div v-if="error" class="error-message" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import MarkdownEditor from './MarkdownEditor.vue';

const props = defineProps({
  initialContent: {
    type: String,
    default: '',
  },
  saving: {
    type: Boolean,
    default: false,
  },
  generatingAI: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  lastSaved: {
    type: Date,
    default: null,
  },
});

const emit = defineEmits(['save', 'request-ai-feedback']);

const textareaRef = ref(null);
const localContent = ref(props.initialContent);
const hasSavedContent = ref(false);
const markdownEnabled = ref(true); // Default: enabled

// Computed properties
const hasContent = computed(() => localContent.value.trim().length > 0);

// Watch for initial content changes
watch(
  () => props.initialContent,
  (newValue) => {
    localContent.value = newValue;
  }
);

// Keyboard shortcuts
const handleKeyDown = (event) => {
  // Cmd+Enter or Ctrl+Enter to save
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    handleSave();
  }
};

// Save reflection
const handleSave = () => {
  if (!hasContent.value || props.saving) return;

  emit('save', localContent.value);
  hasSavedContent.value = true;
};

// Request AI feedback
const handleAIFeedback = () => {
  if (props.generatingAI) return;
  emit('request-ai-feedback', localContent.value);
};

// Format time ago
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

// Focus textarea on mount
onMounted(() => {
  textareaRef.value?.focus();
});
</script>

<style scoped>
.reflection-editor {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.editor-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
}

.editor-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  user-select: none;
}

.toggle-label-left,
.toggle-label-right {
  font-size: 0.6875rem;
  color: var(--color-text-tertiary, #a0aec0);
  transition: color 150ms ease;
  font-weight: 400;
}

.toggle-label-left.active,
.toggle-label-right.active {
  color: var(--color-text-secondary, #5a6c7d);
  font-weight: 500;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: relative;
  width: 32px;
  height: 16px;
  background-color: var(--color-border, #e0e5eb);
  border-radius: 16px;
  transition: background-color 200ms ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 12px;
  width: 12px;
  left: 2px;
  top: 2px;
  background-color: white;
  border-radius: 50%;
  transition: transform 200ms ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-slider {
  background-color: var(--color-primary, #5a6c7d);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(16px);
}

.toggle-input:focus + .toggle-slider {
  box-shadow: 0 0 0 2px rgba(90, 108, 125, 0.2);
}

.toggle-switch:hover .toggle-slider {
  background-color: var(--color-border-focus, #c5ced9);
}

.toggle-input:checked + .toggle-slider:hover {
  background-color: var(--color-primary-hover, #4a5c6d);
}

.editor-hint {
  display: block;
}

.reflection-textarea {
  width: 100%;
  min-height: 300px;
  padding: var(--space-md);
  font-size: 1rem;
  line-height: 1.6;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  resize: vertical;
  font-family: var(--font-sans);
  transition: border-color 0.2s;
}

.reflection-textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
}

.reflection-textarea::placeholder {
  color: var(--color-text-tertiary);
}

.editor-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.btn-save,
.btn-ai {
  padding: var(--space-sm) var(--space-lg);
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.btn-save {
  background-color: var(--color-primary);
  color: white;
  border: none;
}

.btn-save:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn-ai {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-ai:hover:not(:disabled) {
  background-color: var(--color-border);
}

.btn-save:disabled,
.btn-ai:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-status {
  margin-left: auto;
}

.error-message {
  padding: var(--space-sm) var(--space-md);
  background-color: #fee;
  color: var(--color-error);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}
</style>
