<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent 
        class="dialog-content prompt-selector-dialog" 
        role="dialog" 
        :aria-labelledby="`prompt-selector-${persona?.id}`"
      >
        <DialogTitle class="dialog-title" :id="`prompt-selector-${persona?.id}`">
          {{ persona?.icon }} {{ persona?.name }} - Select Prompt
        </DialogTitle>
        
        <DialogDescription class="dialog-description">
          Choose the coaching approach that best fits your current situation.
        </DialogDescription>

        <div v-if="loading" class="loading-state">
          <p>Loading prompts...</p>
        </div>

        <div v-else-if="error" class="error-state" role="alert">
          <p>{{ error }}</p>
          <button @click="loadPrompts" class="button button-secondary">
            Try Again
          </button>
        </div>

        <div v-else-if="prompts.length === 0" class="empty-state">
          <p>No prompts available for this coach.</p>
        </div>

        <div v-else class="prompts-list">
          <div
            v-for="prompt in prompts"
            :key="prompt.id"
            :class="['prompt-card', { 'prompt-card--selected': selectedPromptId === prompt.id }]"
            @click="handleSelectPrompt(prompt.id)"
            role="button"
            tabindex="0"
            @keydown.space.prevent="handleSelectPrompt(prompt.id)"
            @keydown.enter.prevent="handleSelectPrompt(prompt.id)"
          >
            <div class="prompt-card__header">
              <div class="prompt-card__indicator">
                <input
                  type="radio"
                  :id="`prompt-${prompt.id}`"
                  :name="`prompt-${persona?.id}`"
                  :checked="selectedPromptId === prompt.id"
                  @change="handleSelectPrompt(prompt.id)"
                  tabindex="-1"
                />
              </div>
              <label :for="`prompt-${prompt.id}`" class="prompt-card__title">
                {{ prompt.title }}
              </label>
              <span v-if="prompt.isDefault" class="prompt-card__badge">DEFAULT</span>
            </div>
            
            <p class="prompt-card__description">{{ prompt.description }}</p>
            
            <div v-if="prompt.tags && prompt.tags.length > 0" class="prompt-card__tags">
              <span 
                v-for="tag in prompt.tags" 
                :key="tag"
                class="prompt-card__tag"
              >
                {{ tag }}
              </span>
            </div>

            <div class="prompt-card__actions">
              <button
                @click.stop="handlePreview(prompt.id)"
                class="button button-text"
                :disabled="loadingPromptDetails"
              >
                👁️ Preview
              </button>
              <button
                @click.stop="handleCopy(prompt.id)"
                class="button button-text"
                :disabled="copying"
              >
                📋 Copy
              </button>
              <button
                @click.stop="handleChat(prompt.id)"
                class="button button-text"
              >
                💬 Chat
              </button>
            </div>
          </div>
        </div>

        <!-- Preview Section -->
        <div v-if="previewPrompt" class="preview-section">
          <div class="preview-header">
            <h3>Preview: {{ previewPrompt.title }}</h3>
            <button @click="closePreview" class="button-icon" aria-label="Close preview">
              ×
            </button>
          </div>
          <pre class="preview-text">{{ previewPrompt.systemPrompt }}</pre>
        </div>

        <div class="dialog-actions">
          <button
            @click="closeDialog"
            class="button button-secondary"
            type="button"
          >
            Cancel
          </button>
          <button
            @click="handleUseSelected"
            class="button button-primary"
            type="button"
            :disabled="!selectedPromptId"
          >
            Use Selected Prompt
          </button>
        </div>

        <DialogClose class="dialog-close" aria-label="Close dialog">
          ×
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>

  <!-- Toast notifications -->
  <Toast
    :show="showToast"
    :message="toastMessage"
    :type="toastType"
    @close="showToast = false"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'radix-vue';
import { usePrompts } from '../composables/usePrompts.js';
import { useClipboard } from '../composables/useClipboard.js';
import Toast from './Toast.vue';

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

const emit = defineEmits(['update:open', 'select', 'chat']);

const isOpen = ref(props.open);
const selectedPromptId = ref(null);
const previewPrompt = ref(null);
const loadingPromptDetails = ref(false);

// Toast state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('info');

// Use composables
const personaId = computed(() => props.persona?.id);
const { prompts, loading, error, fetchPrompts, fetchPromptById } = usePrompts(personaId.value);
const { copying, copy } = useClipboard();

// Watch for open prop changes
watch(() => props.open, (newValue) => {
  isOpen.value = newValue;
  if (newValue && props.persona) {
    loadPrompts();
  }
});

// Watch for dialog close
watch(isOpen, (newValue) => {
  emit('update:open', newValue);
  if (!newValue) {
    previewPrompt.value = null;
  }
});

// Watch for persona changes
watch(() => props.persona, (newPersona) => {
  if (isOpen.value && newPersona) {
    loadPrompts();
  }
});

/**
 * Load prompts for the persona
 */
async function loadPrompts() {
  if (!props.persona) return;
  
  await fetchPrompts();
  
  // Auto-select default prompt
  const defaultPrompt = prompts.value.find(p => p.isDefault);
  if (defaultPrompt) {
    selectedPromptId.value = defaultPrompt.id;
  } else if (prompts.value.length > 0) {
    selectedPromptId.value = prompts.value[0].id;
  }
}

/**
 * Handle prompt selection
 */
function handleSelectPrompt(promptId) {
  selectedPromptId.value = promptId;
}

/**
 * Handle preview button
 */
async function handlePreview(promptId) {
  if (loadingPromptDetails.value) return;
  
  loadingPromptDetails.value = true;
  
  try {
    const promptDetails = await fetchPromptById(promptId);
    previewPrompt.value = promptDetails;
  } catch (err) {
    showToastMessage('Unable to load prompt preview', 'error');
  } finally {
    loadingPromptDetails.value = false;
  }
}

/**
 * Close preview
 */
function closePreview() {
  previewPrompt.value = null;
}

/**
 * Handle copy button
 */
async function handleCopy(promptId) {
  if (copying.value) return;
  
  try {
    const promptDetails = await fetchPromptById(promptId);
    const result = await copy(promptDetails.systemPrompt);
    
    if (result.success) {
      showToastMessage('Prompt copied to clipboard!', 'success');
    } else {
      showToastMessage('Failed to copy prompt', 'error');
    }
  } catch (err) {
    showToastMessage('Failed to copy prompt', 'error');
  }
}

/**
 * Handle chat button
 */
function handleChat(promptId) {
  const prompt = prompts.value.find(p => p.id === promptId);
  if (prompt) {
    emit('chat', { personaId: props.persona.id, promptId, prompt });
    closeDialog();
  }
}

/**
 * Handle use selected prompt
 */
function handleUseSelected() {
  const prompt = prompts.value.find(p => p.id === selectedPromptId.value);
  if (prompt) {
    emit('select', { personaId: props.persona.id, promptId: selectedPromptId.value, prompt });
    closeDialog();
  }
}

/**
 * Close dialog
 */
function closeDialog() {
  isOpen.value = false;
}

/**
 * Show toast message
 */
function showToastMessage(message, type = 'info') {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
}
</script>

<style scoped>
.prompt-selector-dialog {
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
}

.loading-state,
.error-state,
.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary, #666666);
}

.error-state {
  color: var(--color-error, #d32f2f);
}

.prompts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.prompt-card {
  border: 2px solid var(--color-border-light, #e0e0e0);
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
}

.prompt-card:hover {
  border-color: var(--color-primary, #4A90E2);
  background-color: var(--color-bg-hover, #f9f9f9);
}

.prompt-card:focus {
  outline: 3px solid var(--color-focus, #4A90E2);
  outline-offset: 2px;
}

.prompt-card--selected {
  border-color: var(--color-primary, #4A90E2);
  border-width: 3px;
  background-color: var(--color-bg-selected, #f0f7ff);
}

.prompt-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.prompt-card__indicator input[type="radio"] {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.prompt-card__title {
  flex: 1;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
  cursor: pointer;
}

.prompt-card__badge {
  padding: 0.25rem 0.625rem;
  background-color: var(--color-primary-light, #E3F2FD);
  color: var(--color-primary, #4A90E2);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.prompt-card__description {
  font-size: 0.9375rem;
  color: var(--color-text-secondary, #666666);
  line-height: 1.6;
  margin: 0 0 0.75rem 2rem;
}

.prompt-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0 0.75rem 2rem;
}

.prompt-card__tag {
  padding: 0.25rem 0.625rem;
  background-color: var(--color-bg-tag, #f0f0f0);
  color: var(--color-text-tertiary, #888888);
  border-radius: 12px;
  font-size: 0.75rem;
}

.prompt-card__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  margin-left: 2rem;
}

.preview-section {
  margin: 1.5rem 0;
  border: 1px solid var(--color-border-light, #e0e0e0);
  border-radius: 8px;
  background-color: var(--color-bg-surface, #f9f9f9);
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid var(--color-border-light, #e0e0e0);
}

.preview-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
}

.preview-text {
  padding: 1.25rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-primary, #1a1a1a);
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
  margin: 0;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border-light, #e0e0e0);
}

.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-primary {
  background-color: var(--color-primary, #4A90E2);
  color: white;
}

.button-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover, #357ABD);
}

.button-secondary {
  background-color: var(--color-bg-surface, #f0f0f0);
  color: var(--color-text-primary, #1a1a1a);
}

.button-secondary:hover {
  background-color: var(--color-bg-hover, #e0e0e0);
}

.button-text {
  padding: 0.5rem 0.75rem;
  background-color: transparent;
  color: var(--color-primary, #4A90E2);
  border: 1px solid var(--color-border-light, #e0e0e0);
  font-size: 0.875rem;
}

.button-text:hover:not(:disabled) {
  background-color: var(--color-bg-hover, #f9f9f9);
  border-color: var(--color-primary, #4A90E2);
}

.button:focus-visible {
  outline: 3px solid var(--color-focus, #4A90E2);
  outline-offset: 2px;
}

.button-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--color-text-secondary, #666666);
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.button-icon:hover {
  background-color: var(--color-bg-hover, #f0f0f0);
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
  font-size: 0.9375rem;
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

@media (max-width: 768px) {
  .prompt-selector-dialog {
    max-width: 95vw;
  }

  .prompt-card__actions {
    flex-direction: column;
  }

  .button-text {
    width: 100%;
  }
}
</style>
