<script setup>
import { ref } from 'vue';
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
 * DeleteDialog - Dialog for deleting a single reflection
 * 
 * Features per FR-017, FR-027:
 * - Single confirmation required
 * - Clear warning about permanent deletion
 * - Guidance to export before delete
 * - Accessible with ARIA labels
 * - Keyboard navigable (Escape to close)
 */

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  reflectionId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['update:open', 'delete']);

const isDeleting = ref(false);

const handleDelete = async () => {
  if (!props.reflectionId) return;
  
  isDeleting.value = true;
  
  try {
    await emit('delete', props.reflectionId);
    emit('update:open', false);
  } catch (error) {
    console.error('Delete failed:', error);
  } finally {
    isDeleting.value = false;
  }
};

const handleCancel = () => {
  emit('update:open', false);
};
</script>

<template>
  <DialogRoot :open="open" @update:open="(value) => emit('update:open', value)">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content delete-dialog">
        <DialogTitle class="dialog-title">
          Delete Reflection?
        </DialogTitle>
        
        <DialogDescription class="dialog-description">
          This reflection will be permanently deleted. This action cannot be undone.
        </DialogDescription>

        <div class="warning-box">
          <div class="warning-icon" aria-hidden="true">⚠️</div>
          <div class="warning-content">
            <p class="warning-title">This is permanent</p>
            <p class="warning-text">
              Consider exporting your reflections first to keep a backup.
            </p>
          </div>
        </div>

        <div class="dialog-actions">
          <button
            type="button"
            @click="handleCancel"
            class="button button-secondary"
            :disabled="isDeleting"
          >
            Keep It
          </button>
          
          <button
            type="button"
            @click="handleDelete"
            class="button button-danger"
            :disabled="isDeleting"
            :aria-busy="isDeleting"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
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
  max-width: 450px;
  width: 90%;
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

.warning-box {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-warning-background, #fff3cd);
  border: 1px solid var(--color-warning-border, #ffc107);
  border-radius: 6px;
  margin-bottom: 2rem;
}

.warning-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
}

.warning-text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.5;
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
.dialog-close:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
