<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent
        class="dialog-content"
        aria-describedby="external-ai-description"
      >
        <DialogTitle class="dialog-title">Paste AI Response Summary</DialogTitle>
        <DialogDescription id="external-ai-description" class="dialog-description">
          Your reflection has been opened in ChatGPT. After receiving the AI response,
          copy the key insights and paste them below to save with your reflection.
        </DialogDescription>

        <div class="dialog-body">
          <label for="external-summary" class="sr-only">AI Response Summary</label>
          <textarea
            id="external-summary"
            ref="textareaRef"
            v-model="localSummary"
            class="summary-textarea"
            rows="8"
            placeholder="Paste the AI response summary here..."
            aria-label="Paste AI response summary"
          />
        </div>

        <div class="dialog-actions">
          <button
            class="button-primary"
            @click="handleSave"
            :disabled="!localSummary || localSummary.trim().length === 0"
            aria-label="Save AI response summary"
          >
            Save
          </button>
          <DialogClose as-child>
            <button class="button-secondary" aria-label="Cancel and close dialog">
              Cancel
            </button>
          </DialogClose>
        </div>

        <DialogClose class="dialog-close" aria-label="Close dialog">
          <span aria-hidden="true">×</span>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'radix-vue';

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:open', 'update:modelValue', 'save']);

const localSummary = ref(props.modelValue);
const textareaRef = ref(null);

// Sync local summary with prop
watch(() => props.modelValue, (newVal) => {
  localSummary.value = newVal;
});

// Focus textarea when dialog opens
watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    textareaRef.value?.focus();
  }
});

/**
 * Handle save action
 */
const handleSave = () => {
  emit('update:modelValue', localSummary.value);
  emit('save', localSummary.value);
};
</script>

<style scoped>
.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.dialog-content {
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 600px;
  max-height: 85vh;
  padding: var(--space-xl);
  z-index: 1001;
  overflow-y: auto;
}

.dialog-content:focus {
  outline: none;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--space-sm) 0;
}

.dialog-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-lg);
}

.dialog-body {
  margin-bottom: var(--space-lg);
}

.summary-textarea {
  width: 100%;
  padding: var(--space-md);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 150px;
}

.summary-textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.summary-textarea::placeholder {
  color: var(--color-text-muted);
}

.dialog-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}

.button-primary,
.button-secondary {
  padding: var(--space-sm) var(--space-lg);
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.button-primary {
  background-color: var(--color-primary);
  color: white;
}

.button-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-primary:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.button-secondary {
  background-color: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}

.button-secondary:hover {
  background-color: var(--color-bg-secondary);
}

.button-secondary:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.dialog-close {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 1.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}

.dialog-close:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
}

.dialog-close:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
</style>
