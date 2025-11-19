<template>
  <div class="reflection-editor">
    <div class="editor-header">
      <label for="reflection-input" class="editor-label">
        Your Reflection
      </label>
      <span class="editor-hint text-tertiary text-sm" id="editor-hint">
        Write freely. Press Cmd+Enter to save, or use the button below.
      </span>
    </div>

    <textarea
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

.editor-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
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
