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
 * ExportDialog - Dialog for exporting reflections to Markdown
 * 
 * Features per FR-017, FR-027:
 * - Format choice: single-file vs folder (folder default)
 * - Include metadata option (default true)
 * - Accessible with ARIA labels
 * - Keyboard navigable (Escape to close)
 * - Guidance text for export before delete
 */

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:open', 'export']);

// Export options
const format = ref('single-file');
const includeMetadata = ref(true);
const isExporting = ref(false);

const handleExport = async () => {
  isExporting.value = true;
  
  try {
    await emit('export', {
      format: format.value,
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
          Export Your Reflections
        </DialogTitle>
        
        <DialogDescription class="dialog-description">
          Download all your reflections as Markdown files. This creates a backup you can keep forever.
        </DialogDescription>

        <div class="export-options">
          <!-- Format selection -->
          <fieldset class="option-group">
            <legend class="option-label">Export format</legend>
            
            <label class="radio-option">
              <input
                type="radio"
                v-model="format"
                value="single-file"
                name="format"
              />
              <span class="radio-label">
                <strong>Single file</strong>
                <span class="radio-description">One Markdown file with all reflections</span>
              </span>
            </label>

            <label class="radio-option">
              <input
                type="radio"
                v-model="format"
                value="folder"
                name="format"
              />
              <span class="radio-label">
                <strong>Folder</strong>
                <span class="radio-description">Organized by month (recommended)</span>
              </span>
            </label>
          </fieldset>

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

          <!-- Guidance text for data sovereignty -->
          <div class="guidance-note">
            💡 <strong>Tip:</strong> Export before deleting to keep a backup of your reflections.
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
            {{ isExporting ? 'Exporting...' : 'Export' }}
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

.option-group {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 1rem;
  margin: 0;
}

.option-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  display: block;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 150ms ease;
}

.radio-option:hover {
  background-color: var(--color-background-hover);
}

.radio-option input[type="radio"] {
  margin-top: 0.25rem;
  cursor: pointer;
}

.radio-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.radio-description {
  font-size: 0.875rem;
  color: var(--color-text-muted);
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

.guidance-note {
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

/* Focus styles per FR-023 */
.button:focus-visible,
.radio-option input:focus-visible,
.checkbox-option input:focus-visible,
.dialog-close:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
