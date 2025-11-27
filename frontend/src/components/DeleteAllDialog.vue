<script setup>
import { ref, computed } from 'vue';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'radix-vue';

/**
 * DeleteAllDialog - Dialog for deleting all reflections
 * 
 * Features per FR-017:
 * - 2-step confirmation process
 * - Requires typing "DELETE_ALL" to proceed
 * - Strong warning about permanent deletion
 * - Guidance to export before delete
 * - Accessible with ARIA labels
 * - Keyboard navigable (Escape to close)
 */

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  reflectionCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['update:open', 'deleteAll']);

const confirmationText = ref('');
const isDeleting = ref(false);

const REQUIRED_CONFIRMATION = 'DELETE_ALL';

const isConfirmationValid = computed(() => {
  return confirmationText.value === REQUIRED_CONFIRMATION;
});

const handleDeleteAll = async () => {
  if (!isConfirmationValid.value) return;
  
  isDeleting.value = true;
  
  try {
    await emit('deleteAll');
    emit('update:open', false);
    confirmationText.value = ''; // Reset for next time
  } catch (error) {
    console.error('Delete all failed:', error);
  } finally {
    isDeleting.value = false;
  }
};

const handleCancel = () => {
  emit('update:open', false);
  confirmationText.value = ''; // Reset confirmation
};

// Reset confirmation when dialog closes
const handleOpenChange = (value) => {
  emit('update:open', value);
  if (!value) {
    confirmationText.value = '';
  }
};
</script>

<template>
  <DialogRoot :open="open" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content delete-all-dialog">
        <DialogTitle class="dialog-title">
          Delete All Reflections?
        </DialogTitle>
        
        <DialogDescription class="dialog-description">
          This will permanently delete <strong>{{ reflectionCount }}</strong> 
          {{ reflectionCount === 1 ? 'reflection' : 'reflections' }}. 
          This action cannot be undone.
        </DialogDescription>

        <div class="danger-box">
          <div class="danger-icon" aria-hidden="true">🛑</div>
          <div class="danger-content">
            <p class="danger-title">This will delete everything</p>
            <p class="danger-text">
              All your reflections, timestamps, and AI interactions will be permanently removed.
              <strong>Please export your data first to keep a backup.</strong>
            </p>
          </div>
        </div>

        <div class="confirmation-section">
          <label for="delete-confirmation" class="confirmation-label">
            Type <code class="confirmation-code">{{ REQUIRED_CONFIRMATION }}</code> to confirm:
          </label>
          <input
            id="delete-confirmation"
            type="text"
            v-model="confirmationText"
            class="confirmation-input"
            :class="{ 'invalid': confirmationText && !isConfirmationValid }"
            placeholder="Type DELETE_ALL"
            :disabled="isDeleting"
            aria-describedby="confirmation-hint"
            autocomplete="off"
            spellcheck="false"
          />
          <p
            id="confirmation-hint"
            class="confirmation-hint"
            :class="{ 'error': confirmationText && !isConfirmationValid }"
          >
            <template v-if="!confirmationText">
              This confirmation helps prevent accidental deletion.
            </template>
            <template v-else-if="!isConfirmationValid">
              Please type exactly "DELETE_ALL" (without quotes).
            </template>
            <template v-else>
              ✓ Confirmation correct
            </template>
          </p>
        </div>

        <div class="dialog-actions">
          <button
            type="button"
            @click="handleCancel"
            class="button button-secondary"
            :disabled="isDeleting"
          >
            Cancel
          </button>
          
          <button
            type="button"
            @click="handleDeleteAll"
            class="button button-danger"
            :disabled="!isConfirmationValid || isDeleting"
            :aria-busy="isDeleting"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete Everything' }}
          </button>
        </div>

        <DialogClose as-child>
          <button
            type="button"
            class="dialog-close"
            aria-label="Close dialog"
            :disabled="isDeleting"
          >
            <span aria-hidden="true">×</span>
          </button>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
  animation: fadeIn 150ms ease-out;
}

.dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-background);
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 51;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideIn 200ms ease-out;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
}

.dialog-description {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.danger-box {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--color-danger-background, #f8d7da);
  border: 2px solid var(--color-danger, #dc3545);
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.danger-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.danger-content {
  flex: 1;
}

.danger-title {
  font-weight: 600;
  color: var(--color-danger, #dc3545);
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.danger-text {
  font-size: 0.875rem;
  color: var(--color-text);
  margin: 0;
  line-height: 1.6;
}

.confirmation-section {
  margin-bottom: 2rem;
}

.confirmation-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.confirmation-code {
  background-color: var(--color-background-secondary);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9em;
  font-weight: 600;
  color: var(--color-danger, #dc3545);
}

.confirmation-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color 150ms ease;
}

.confirmation-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.confirmation-input.invalid {
  border-color: var(--color-danger, #dc3545);
}

.confirmation-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirmation-hint {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
}

.confirmation-hint.error {
  color: var(--color-danger, #dc3545);
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.button {
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
  border: none;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-secondary {
  background-color: var(--color-background-secondary);
  color: var(--color-text);
}

.button-secondary:hover:not(:disabled) {
  background-color: var(--color-background-hover);
}

.button-danger {
  background-color: var(--color-danger, #dc3545);
  color: white;
}

.button-danger:hover:not(:disabled) {
  background-color: var(--color-danger-dark, #c82333);
}

.dialog-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}

.dialog-close:hover:not(:disabled) {
  background-color: var(--color-background-hover);
  color: var(--color-text);
}

.dialog-close:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

/* Focus styles per FR-023 */
.button:focus-visible,
.confirmation-input:focus-visible,
.dialog-close:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
