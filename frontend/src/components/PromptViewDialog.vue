<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content prompt-view-dialog" role="dialog" :aria-labelledby="`dialog-title-${persona?.id}`">
        <DialogTitle class="dialog-title" :id="`dialog-title-${persona?.id}`" data-testid="dialog-title">
          {{ persona?.icon }} {{ persona?.name }} - System Prompt
        </DialogTitle>
        
        <DialogDescription class="dialog-description">
          <p class="prompt-intro">
            This is the coaching approach and guidance that {{ persona?.name }} will use when reflecting on your thoughts.
          </p>
        </DialogDescription>

        <div v-if="loading" class="loading-state">
          <p>Loading...</p>
        </div>

        <div v-else-if="error" class="error-state" role="alert">
          <p>Unable to load prompt. Please try again.</p>
          <button @click="loadPrompt" class="button button-primary" data-testid="retry-button">
            Retry
          </button>
        </div>

        <div v-else class="prompt-content">
          <div v-if="loadedFromFile" class="file-badge" data-testid="file-loaded-badge">
            📄 Loaded from external file
          </div>
          <pre class="prompt-text" data-testid="prompt-text">{{ promptText }}</pre>
        </div>

        <div class="dialog-actions">
          <button
            @click="handleTalkInChatGPT"
            class="button button-secondary"
            type="button"
            :disabled="loading || openingChat"
          >
            {{ openingChat ? 'Opening...' : 'Talk in ChatGPT' }}
          </button>
          <button
            @click="closeDialog"
            class="button button-primary"
            data-testid="close-button"
            type="button"
          >
            Close
          </button>
        </div>

        <DialogClose class="dialog-close" data-testid="dialog-close" aria-label="Close dialog">
          ×
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'radix-vue';
import api from '../services/api.js';

const props = defineProps({
  persona: {
    type: Object,
    default: null,
  },
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open', 'close']);

const isOpen = ref(props.open);
const loading = ref(false);
const error = ref(null);
const promptText = ref('');
const loadedFromFile = ref(false);
const openingChat = ref(false);

// Watch for open prop changes
watch(() => props.open, (newValue) => {
  isOpen.value = newValue;
  if (newValue && props.persona) {
    loadPrompt();
  }
});

// Watch for persona changes while dialog is open
watch(() => props.persona, (newPersona) => {
  if (isOpen.value && newPersona) {
    loadPrompt();
  }
});

// Watch for dialog close
watch(isOpen, (newValue) => {
  emit('update:open', newValue);
  if (!newValue) {
    emit('close');
  }
});

/**
 * Load the full prompt for the persona
 */
async function loadPrompt() {
  if (!props.persona) return;

  loading.value = true;
  error.value = null;

  try {
    const response = await api.get(`/personas/${props.persona.id}/prompt`);
    
    if (response.data.success) {
      promptText.value = response.data.data.systemPrompt;
      loadedFromFile.value = response.data.data.loadedFromFile;
    } else {
      error.value = response.data.error || 'Failed to load prompt';
    }
  } catch (err) {
    console.error('Error loading prompt:', err);
    error.value = err.response?.data?.error || 'Unable to load prompt. Please try again.';
  } finally {
    loading.value = false;
  }
}

/**
 * Close the dialog
 */
function closeDialog() {
  isOpen.value = false;
}

/**
 * Open ChatGPT with the current coach prompt
 */
async function handleTalkInChatGPT() {
  if (!props.persona) return;
  openingChat.value = true;

  const basePrompt = promptText.value || props.persona.systemPrompt || '';
  const fullPrompt = basePrompt.trim().length > 0 ? basePrompt : props.persona.name;
  const url = `https://chat.openai.com/?q=${encodeURIComponent(fullPrompt)}`;

  try {
    const newTab = window.open(url, '_blank');
    if (!newTab) {
      window.location.href = url;
    }
  } catch (err) {
    console.error('Failed to open ChatGPT link', err);
  } finally {
    openingChat.value = false;
  }
}
</script>

<style scoped>
.prompt-view-dialog {
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.prompt-intro {
  font-size: 0.9375rem;
  color: var(--color-text-secondary, #666666);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.loading-state,
.error-state {
  padding: 2rem;
  text-align: center;
}

.error-state {
  color: var(--color-error, #d32f2f);
}

.prompt-content {
  margin-top: 1rem;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  overflow: hidden;
}

.file-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background-color: var(--color-primary-light, #E3F2FD);
  color: var(--color-primary, #4A90E2);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.prompt-text {
  background-color: var(--color-bg-secondary, #f7f5f0);
  border: 1px solid var(--color-border-strong, #d4cfc3);
  border-radius: 8px;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--color-text-primary, #1a1a1a);
  white-space: pre-wrap;
  word-wrap: break-word;
  flex: 1;
  overflow-y: auto;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border, #e5e1d9);
  background: white;
  flex-shrink: 0;
}

.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.button-primary {
  background-color: var(--color-primary, #4A90E2);
  color: white;
}

.button-primary:hover {
  background-color: var(--color-primary-hover, #357ABD);
}

.button-secondary {
  background: var(--color-bg-elevated, #ffffff);
  color: var(--color-text, #1a1a1a);
  border: 1px solid var(--color-border, #e5e1d9);
}

.button-secondary:hover {
  background: var(--color-bg-hover, #f0ede5);
}

.button:focus-visible {
  outline: 3px solid var(--color-focus, #4A90E2);
  outline-offset: 2px;
}

/* Dialog base styles */
.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  z-index: 50;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 51;
  max-width: 90vw;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
  margin-bottom: 0.5rem;
}

.dialog-description {
  color: var(--color-text-secondary, #666666);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.dialog-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary, #666666);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-close:hover {
  background-color: var(--color-bg-hover, #f0f0f0);
}

.dialog-close:focus-visible {
  outline: 2px solid var(--color-focus, #4A90E2);
  outline-offset: 2px;
}
</style>
