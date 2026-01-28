<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content add-coach-dialog" role="dialog" aria-labelledby="add-coach-title">
        <DialogTitle class="dialog-title" id="add-coach-title">
          Add a new coach
        </DialogTitle>
        <DialogDescription class="dialog-description">
          Coaches are currently defined in the codebase. To add one, follow these steps:
        </DialogDescription>

        <ol class="add-coach-steps">
          <li>
            Add a new coach entry in
            <span class="path">backend/src/domain/entities/predefined-personas.js</span>
          </li>
          <li>
            Add prompt files under
            <span class="path">data/coach-prompts/&lt;coach-id&gt;/</span>
          </li>
          <li>Restart the backend to load the new coach</li>
        </ol>

        <div class="dialog-actions">
          <button class="button button-secondary" type="button" @click="closeDialog">
            Close
          </button>
        </div>

        <DialogClose class="dialog-close" aria-label="Close dialog">×</DialogClose>
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

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open']);

const isOpen = ref(props.open);

watch(() => props.open, (newValue) => {
  isOpen.value = newValue;
});

watch(isOpen, (newValue) => {
  emit('update:open', newValue);
});

function closeDialog() {
  isOpen.value = false;
}
</script>

<style scoped>
.add-coach-dialog {
  max-width: 520px;
}

.add-coach-steps {
  margin: 1rem 0 0;
  padding-left: 1.25rem;
  color: var(--color-text-secondary, #666666);
  line-height: 1.6;
}

.add-coach-steps li {
  margin-bottom: 0.5rem;
}

.path {
  display: inline-block;
  padding: 0 0.35rem;
  border-radius: 4px;
  background: var(--color-bg-secondary, #f7f5f0);
  border: 1px solid var(--color-border, #e5e1d9);
  color: var(--color-text, #1a1816);
  font-size: 0.85em;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.button {
  padding: 0.65rem 1.25rem;
  border: 1px solid var(--color-border, #e5e1d9);
  border-radius: 8px;
  background: var(--color-bg-elevated, #ffffff);
  color: var(--color-text, #1a1816);
  cursor: pointer;
}

.button:hover {
  background: var(--color-bg-hover, #f0ede5);
}

.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  z-index: 50;
}

.dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 51;
  max-width: 90vw;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text, #1a1816);
  margin-bottom: 0.5rem;
}

.dialog-description {
  color: var(--color-text-secondary, #666666);
  line-height: 1.6;
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
</style>
