<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent 
        class="dialog-content create-prompt-dialog" 
        role="dialog" 
        :aria-labelledby="`create-prompt-${persona?.id}`"
      >
        <DialogTitle class="dialog-title" :id="`create-prompt-${persona?.id}`">
          {{ persona?.icon }} Create New Prompt for {{ persona?.name }}
        </DialogTitle>
        
        <DialogDescription class="dialog-description">
          Fill in the details below to create a custom prompt for this coach.
        </DialogDescription>

        <form @submit.prevent="handleSubmit" class="prompt-form">
          <!-- Prompt ID -->
          <div class="form-field">
            <label for="prompt-id" class="form-label">
              Prompt ID <span class="required">*</span>
            </label>
            <input
              id="prompt-id"
              v-model="formData.id"
              type="text"
              class="form-input"
              placeholder="e.g., stoic-evening-review"
              pattern="[a-z0-9-]+"
              required
              :disabled="isSubmitting"
            />
            <p class="form-hint">Use lowercase letters, numbers, and hyphens only</p>
          </div>

          <!-- Title -->
          <div class="form-field">
            <label for="prompt-title" class="form-label">
              Title <span class="required">*</span>
            </label>
            <input
              id="prompt-title"
              v-model="formData.title"
              type="text"
              class="form-input"
              placeholder="e.g., Evening Review"
              required
              maxlength="100"
              :disabled="isSubmitting"
            />
          </div>

          <!-- Description -->
          <div class="form-field">
            <label for="prompt-description" class="form-label">
              Description <span class="required">*</span>
            </label>
            <textarea
              id="prompt-description"
              v-model="formData.description"
              class="form-textarea"
              placeholder="Brief description of when to use this prompt..."
              required
              maxlength="500"
              rows="3"
              :disabled="isSubmitting"
            ></textarea>
            <p class="form-hint">{{ formData.description.length }}/500 characters</p>
          </div>

          <!-- Tags -->
          <div class="form-field">
            <label for="prompt-tags" class="form-label">
              Tags <span class="required">*</span>
            </label>
            <input
              id="prompt-tags"
              v-model="tagsInput"
              type="text"
              class="form-input"
              placeholder="e.g., evening, reflection, review"
              required
              :disabled="isSubmitting"
            />
            <p class="form-hint">Comma-separated keywords (at least one required)</p>
          </div>

          <!-- Default Checkbox -->
          <div class="form-field form-checkbox">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="formData.isDefault"
                :disabled="isSubmitting"
              />
              <span>Set as default prompt</span>
            </label>
            <p class="form-hint">Only one prompt per coach can be the default</p>
          </div>

          <!-- System Prompt -->
          <div class="form-field">
            <label for="prompt-system" class="form-label">
              System Prompt <span class="required">*</span>
            </label>
            <textarea
              id="prompt-system"
              v-model="formData.systemPrompt"
              class="form-textarea"
              placeholder="You are a coach who helps users with..."
              required
              minlength="50"
              rows="10"
              :disabled="isSubmitting"
            ></textarea>
            <p class="form-hint">
              {{ formData.systemPrompt.length }} characters (minimum 50 required)
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="form-error" role="alert">
            {{ error }}
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button
              type="button"
              @click="closeDialog"
              class="button button-secondary"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="button button-primary"
              :disabled="isSubmitting || !isFormValid"
            >
              {{ isSubmitting ? 'Creating...' : 'Create Prompt' }}
            </button>
          </div>
        </form>

        <DialogClose class="dialog-close" aria-label="Close dialog">
          ×
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>

  <!-- Success Toast -->
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
import api from '../services/api.js';
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

const emit = defineEmits(['update:open', 'created']);

const isOpen = ref(props.open);
const isSubmitting = ref(false);
const error = ref(null);
const tagsInput = ref('');

// Toast state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('info');

// Form data
const formData = ref({
  id: '',
  title: '',
  description: '',
  tags: [],
  isDefault: false,
  systemPrompt: '',
});

// Watch for open prop changes
watch(() => props.open, (newValue) => {
  isOpen.value = newValue;
  if (newValue) {
    resetForm();
  }
});

// Watch for dialog close
watch(isOpen, (newValue) => {
  emit('update:open', newValue);
});

// Computed form validation
const isFormValid = computed(() => {
  return (
    formData.value.id.length > 0 &&
    /^[a-z0-9-]+$/.test(formData.value.id) &&
    formData.value.title.trim().length > 0 &&
    formData.value.description.trim().length > 0 &&
    tagsInput.value.trim().length > 0 &&
    formData.value.systemPrompt.length >= 50
  );
});

/**
 * Reset form to initial state
 */
function resetForm() {
  formData.value = {
    id: '',
    title: '',
    description: '',
    tags: [],
    isDefault: false,
    systemPrompt: '',
  };
  tagsInput.value = '';
  error.value = null;
}

/**
 * Handle form submission
 */
async function handleSubmit() {
  if (!isFormValid.value || !props.persona) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    // Parse tags from comma-separated string
    const tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (tags.length === 0) {
      throw new Error('At least one tag is required');
    }

    // Prepare prompt data
    const promptData = {
      ...formData.value,
      tags,
    };

    // Submit to API
    const response = await api.post(`/personas/${props.persona.id}/prompts`, promptData);

    if (response.data.success) {
      showToastMessage('Prompt created successfully!', 'success');
      emit('created', response.data.data);
      closeDialog();
    } else {
      throw new Error(response.data.error || 'Failed to create prompt');
    }
  } catch (err) {
    console.error('Error creating prompt:', err);
    error.value = err.response?.data?.error || err.message || 'Failed to create prompt. Please try again.';
  } finally {
    isSubmitting.value = false;
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
.create-prompt-dialog {
  max-width: 700px;
  width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
}

.prompt-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
}

.required {
  color: var(--color-error, #d32f2f);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border-light, #e0e0e0);
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.5;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: 2px solid var(--color-focus, #4A90E2);
  outline-offset: 0;
  border-color: var(--color-primary, #4A90E2);
}

.form-input:disabled,
.form-textarea:disabled {
  background-color: var(--color-bg-surface, #f9f9f9);
  cursor: not-allowed;
  opacity: 0.6;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  font-size: 0.8125rem;
  color: var(--color-text-tertiary, #888888);
  margin: 0;
}

.form-checkbox {
  flex-direction: row;
  align-items: flex-start;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9375rem;
  color: var(--color-text-primary, #1a1a1a);
}

.checkbox-label input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.form-error {
  padding: 1rem;
  background-color: #ffebee;
  border: 1px solid #ef5350;
  border-radius: 6px;
  color: #c62828;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
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

.button-secondary:hover:not(:disabled) {
  background-color: var(--color-bg-hover, #e0e0e0);
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
  .create-prompt-dialog {
    width: 95vw;
    max-height: 95vh;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .button {
    width: 100%;
  }
}
</style>
