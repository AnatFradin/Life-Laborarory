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
  padding: var(--space-sm) var(--space-md);
  background: linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-secondary) 100%);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-xs);
}

.keyboard-shortcuts-trigger:hover {
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-hover) 100%);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.keyboard-shortcuts-trigger:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Dialog overlay */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 50;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Dialog content */
.dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(to bottom, white 0%, var(--color-bg) 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  max-width: 650px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 51;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.dialog-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--space-sm) 0;
  letter-spacing: -0.02em;
}

.dialog-description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2xl) 0;
  line-height: var(--leading-relaxed);
}

/* Shortcuts list */
.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
}

.shortcuts-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--space-sm) 0;
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--color-primary-light);
  letter-spacing: -0.01em;
}

.shortcuts-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin: 0;
}

.shortcut-item {
  display: grid;
  grid-template-columns: minmax(140px, auto) 1fr;
  gap: var(--space-lg);
  align-items: center;
}

.shortcut-key {
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  gap: var(--space-xs);
  align-items: center;
  flex-wrap: wrap;
}

.shortcut-key kbd {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  font-weight: 600;
  background: linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-secondary) 100%);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  min-width: 2rem;
  text-align: center;
}

.shortcut-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
}

/* Close button */
.dialog-close {
  width: 100%;
  padding: var(--space-md) var(--space-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.dialog-close:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.dialog-close:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 640px) {
  .shortcut-item {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
  
  .dialog-content {
    padding: var(--space-xl);
  }
}
</style>
