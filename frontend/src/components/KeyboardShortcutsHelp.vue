<template>
  <DialogRoot v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot name="trigger">
        <button
          type="button"
          class="keyboard-shortcuts-trigger"
          aria-label="Show keyboard shortcuts"
          title="Keyboard shortcuts (Shift+?)"
        >
          <span aria-hidden="true">⌨️</span>
        </button>
      </slot>
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content" aria-describedby="shortcuts-description">
        <DialogTitle class="dialog-title">
          Keyboard Shortcuts
        </DialogTitle>

        <DialogDescription id="shortcuts-description" class="dialog-description">
          Navigate the application efficiently using your keyboard
        </DialogDescription>

        <div class="shortcuts-list">
          <section class="shortcuts-section">
            <h3 class="section-title">Global</h3>
            <dl class="shortcuts-items">
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>Tab</kbd></dt>
                <dd class="shortcut-description">Navigate forward between interactive elements</dd>
              </div>
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>Shift</kbd> + <kbd>Tab</kbd></dt>
                <dd class="shortcut-description">Navigate backward between interactive elements</dd>
              </div>
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>Esc</kbd></dt>
                <dd class="shortcut-description">Close dialogs and cancel actions</dd>
              </div>
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>Shift</kbd> + <kbd>?</kbd></dt>
                <dd class="shortcut-description">Show this keyboard shortcuts help</dd>
              </div>
            </dl>
          </section>

          <section class="shortcuts-section">
            <h3 class="section-title">Compose View</h3>
            <dl class="shortcuts-items">
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>Cmd</kbd> + <kbd>Enter</kbd></dt>
                <dd class="shortcut-description">Save current reflection (macOS)</dd>
              </div>
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>Ctrl</kbd> + <kbd>Enter</kbd></dt>
                <dd class="shortcut-description">Save current reflection (Windows/Linux)</dd>
              </div>
            </dl>
          </section>

          <section class="shortcuts-section">
            <h3 class="section-title">History View</h3>
            <dl class="shortcuts-items">
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>↑</kbd> <kbd>↓</kbd></dt>
                <dd class="shortcut-description">Navigate between reflections</dd>
              </div>
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>Enter</kbd></dt>
                <dd class="shortcut-description">Open selected reflection</dd>
              </div>
            </dl>
          </section>

          <section class="shortcuts-section">
            <h3 class="section-title">Dialogs</h3>
            <dl class="shortcuts-items">
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>Esc</kbd></dt>
                <dd class="shortcut-description">Close dialog without action</dd>
              </div>
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>Tab</kbd></dt>
                <dd class="shortcut-description">Navigate between dialog controls (focus trapped)</dd>
              </div>
              <div class="shortcut-item">
                <dt class="shortcut-key"><kbd>Enter</kbd></dt>
                <dd class="shortcut-description">Confirm action when button is focused</dd>
              </div>
            </dl>
          </section>
        </div>

        <DialogClose as-child>
          <button type="button" class="dialog-close" aria-label="Close keyboard shortcuts">
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'radix-vue';

const isOpen = ref(false);

// Handle Shift+? keyboard shortcut
const handleKeyDown = (event) => {
  // Shift+? (Shift+/)
  if (event.shiftKey && event.key === '?') {
    event.preventDefault();
    isOpen.value = !isOpen.value;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.keyboard-shortcuts-trigger {
  padding: var(--space-sm);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.keyboard-shortcuts-trigger:hover {
  background-color: var(--color-background-hover);
  border-color: var(--color-primary);
}

.keyboard-shortcuts-trigger:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Dialog overlay */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

/* Dialog content */
.dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 51;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
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
  margin: 0 0 var(--space-lg) 0;
}

/* Shortcuts list */
.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.shortcuts-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--space-xs) 0;
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--color-border);
}

.shortcuts-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin: 0;
}

.shortcut-item {
  display: grid;
  grid-template-columns: minmax(120px, auto) 1fr;
  gap: var(--space-md);
  align-items: baseline;
}

.shortcut-key {
  font-weight: 500;
  color: var(--color-text);
  display: flex;
  gap: var(--space-xs);
  align-items: center;
}

.shortcut-key kbd {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-family: var(--font-mono, monospace);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.shortcut-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

/* Close button */
.dialog-close {
  width: 100%;
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dialog-close:hover {
  background-color: var(--color-primary-hover);
}

.dialog-close:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 640px) {
  .shortcut-item {
    grid-template-columns: 1fr;
    gap: var(--space-xs);
  }
}
</style>
