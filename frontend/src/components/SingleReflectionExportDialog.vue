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
 * SingleReflectionExportDialog - Dialog for exporting a single reflection
 * 
 * Features:
 * - Export as text (Markdown)
 * - Include/exclude metadata option
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

const emit = defineEmits(['update:open', 'export']);

// Export options
const includeMetadata = ref(true);
const isExporting = ref(false);

const handleExport = async () => {
  if (!props.reflectionId) {
    return;
  }

  isExporting.value = true;
  
  try {
    await emit('export', {
      reflectionId: props.reflectionId,
      includeMetadata: includeMetadata.value,
    });
    
    // Close dialog after successful export
    emit('update:open', false);
  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    isExporting.value = false;
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
      <DialogContent class="dialog-content export-dialog">
        <DialogTitle class="dialog-title">
          Export Reflection
        </DialogTitle>
        
        <DialogDescription class="dialog-description">
          Download this reflection as a Markdown file.
        </DialogDescription>

        <div class="export-options">
          <!-- Metadata option -->
          <label class="checkbox-option">
            <input
              type="checkbox"
              v-model="includeMetadata"
            />
            <span class="checkbox-label">
              Include AI interaction details
            </span>
          </label>

          <!-- Info note -->
          <div class="info-note">
            💡 The reflection will be exported as a Markdown (.md) file that you can open in any text editor.
          </div>
        </div>

        <div class="dialog-actions">
          <button
            type="button"
            @click="handleCancel"
            class="button button-secondary"
            :disabled="isExporting"
          >
            Cancel
          </button>
          
          <button
            type="button"
            @click="handleExport"
            class="button button-primary"
            :disabled="isExporting"
            :aria-busy="isExporting"
          >
            {{ isExporting ? 'Exporting...' : 'Export as Markdown' }}
          </button>
        </div>

        <DialogClose as-child>
          <button
            type="button"
            class="dialog-close"
            aria-label="Close dialog"
            :disabled="isExporting"
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

.export-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 150ms ease;
}

.checkbox-option:hover {
  background-color: var(--color-background-hover);
}

.checkbox-option input[type="checkbox"] {
  cursor: pointer;
  width: 1.125rem;
  height: 1.125rem;
}

.checkbox-label {
  font-size: 0.95rem;
  color: var(--color-text);
}

.info-note {
  background-color: var(--color-background-secondary);
  border-left: 3px solid var(--color-primary);
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--color-text);
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

.button-primary {
  background-color: var(--color-primary);
  color: white;
}

.button-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
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

/* Focus styles */
.button:focus-visible,
.checkbox-option input:focus-visible,
.dialog-close:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
