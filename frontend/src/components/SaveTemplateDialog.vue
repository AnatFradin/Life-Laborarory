<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-dialog" role="dialog" aria-labelledby="save-template-title" aria-modal="true">
      <header class="modal-header">
        <h2 id="save-template-title">Save as Template</h2>
        <button
          type="button"
          class="close-button"
          @click="close"
          aria-label="Close dialog"
        >
          ×
        </button>
      </header>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="template-name" class="form-label">
              Display Name <span class="required">*</span>
            </label>
            <input
              id="template-name"
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="e.g., My Custom Template"
              required
              :disabled="saving"
            />
          </div>

          <div class="form-group">
            <label for="template-description" class="form-label">
              Description
            </label>
            <textarea
              id="template-description"
              v-model="formData.description"
              class="form-textarea"
              placeholder="What is this template for?"
              rows="2"
              :disabled="saving"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="template-tags" class="form-label">
              Tags
            </label>
            <input
              id="template-tags"
              v-model="formData.tagsInput"
              type="text"
              class="form-input"
              placeholder="e.g., daily, reflection, journal"
              :disabled="saving"
            />
            <p class="form-hint">Comma-separated tags for organizing templates</p>
          </div>

          <div v-if="error" class="error-message" role="alert">
            {{ error }}
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="close"
              :disabled="saving"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="saving || !isFormValid"
            >
              {{ saving ? 'Saving...' : 'Save Template' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close', 'save']);

const formData = ref({
  name: '',
  description: '',
  tagsInput: '',
});

const saving = ref(false);
const error = ref(null);

const isFormValid = computed(() => {
  return formData.value.name.trim() !== '';
});

/**
 * Handle form submission
 */
async function handleSubmit() {
  if (!isFormValid.value) return;

  saving.value = true;
  error.value = null;

  try {
    const tags = formData.value.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const templateData = {
      name: formData.value.name.trim(),
      description: formData.value.description.trim(),
      content: props.content,
      tags,
    };

    emit('save', templateData);
    // Reset saving state after a short delay to allow parent to handle
    setTimeout(() => {
      saving.value = false;
    }, 100);
  } catch (err) {
    error.value = err.message || 'Failed to save template';
    saving.value = false;
  }
}

/**
 * Close dialog
 */
function close() {
  if (!saving.value) {
    emit('close');
    // Reset form after a short delay
    setTimeout(() => {
      formData.value = {
        name: '',
        description: '',
        tagsInput: '',
      };
      error.value = null;
    }, 300);
  }
}

/**
 * Handle overlay click (close on outside click)
 */
function handleOverlayClick(event) {
  if (event.target.classList.contains('modal-overlay')) {
    close();
  }
}

// Watch for dialog open to reset form
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    saving.value = false;
    error.value = null;
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-dialog {
  background: var(--color-bg-elevated, #ffffff);
  border: 1px solid var(--color-border, #e5e1d9);
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border, #e5e1d9);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text, #1a1816);
}

.close-button {
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-secondary, #524e47);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s;
}

.close-button:hover {
  color: var(--color-text, #1a1816);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text, #1a1816);
}

.required {
  color: var(--color-error, #a63232);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--color-border, #e5e1d9);
  border-radius: 0.5rem;
  background: var(--color-bg-elevated, #ffffff);
  color: var(--color-text, #1a1816);
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary, #2d5a3d);
  box-shadow: 0 0 0 3px var(--color-focus-ring, rgba(45, 90, 61, 0.15));
}

.form-input:disabled,
.form-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

.form-hint {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-text-tertiary, #6b6762);
}

.error-message {
  padding: 0.75rem;
  background: var(--color-error-light, #fef1f1);
  color: var(--color-error, #a63232);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-secondary,
.btn-primary {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: var(--color-bg-hover, #f0ede5);
  color: var(--color-text, #1a1816);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-border, #e5e1d9);
}

.btn-primary {
  background: var(--color-primary, #2d5a3d);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover, #234a30);
}

.btn-secondary:disabled,
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
