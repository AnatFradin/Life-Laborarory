<template>
  <div class="reflection-editor">
    <div class="editor-header">
      <div class="header-top">
        <div class="editor-label">
          Your Reflection
        </div>
        
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

const emit = defineEmits(['save', 'request-ai-feedback', 'update:content']);

const textareaRef = ref(null);
const localContent = ref(props.initialContent);

// Emit content changes to parent
watch(localContent, (newValue) => {
  emit('update:content', newValue);
});
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
  gap: var(--space-lg);
}

.editor-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
}

.editor-label {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  position: relative;
  user-select: none;
  padding: var(--space-xs) var(--space-sm);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.toggle-switch:hover {
  background-color: var(--color-bg-hover);
}

.toggle-label-left,
.toggle-label-right {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  transition: all var(--transition-base);
  font-weight: 500;
}

.toggle-label-left.active,
.toggle-label-right.active {
  color: var(--color-text);
  font-weight: 700;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  left: 2px;
  top: 2px;
  background-color: white;
  border-radius: 50%;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-xs);
}

.toggle-input:checked + .toggle-slider {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.toggle-input:focus + .toggle-slider {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.toggle-switch:hover .toggle-slider {
  background-color: var(--color-border-strong);
}

.toggle-input:checked + .toggle-slider:hover {
  background: linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%);
}

.editor-hint {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.reflection-textarea {
  width: 100%;
  min-height: 350px;
  padding: var(--space-lg);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  resize: vertical;
  font-family: var(--font-sans);
  transition: all var(--transition-base);
  background: linear-gradient(to bottom, white 0%, var(--color-bg) 100%);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.reflection-textarea:hover {
  border-color: var(--color-border-strong);
}

.reflection-textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-focus-ring), inset 0 1px 3px rgba(0, 0, 0, 0.05);
  background: white;
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
  padding: var(--space-md) var(--space-2xl);
  font-size: var(--text-base);
  font-weight: 600;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.btn-save {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  border: none;
}

.btn-save:hover:not(:disabled) {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.btn-ai {
  background-color: var(--color-bg-elevated);
  color: var(--color-text);
  border: 1.5px solid var(--color-border);
}

.btn-ai:hover:not(:disabled) {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.btn-save:disabled,
.btn-ai:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.save-status {
  margin-left: auto;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.error-message {
  padding: var(--space-md) var(--space-lg);
  background: linear-gradient(135deg, var(--color-error-light) 0%, #fff5f5 100%);
  color: var(--color-error);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: 500;
  border-left: 4px solid var(--color-error);
  box-shadow: var(--shadow-xs);
}
</style>
