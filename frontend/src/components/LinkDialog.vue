<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="link-dialog-overlay"
      @click="handleOverlayClick"
      @keydown.esc="handleClose"
    >
      <div
        class="link-dialog"
        data-test="link-dialog"
        @click.stop
      >
        <h3 class="dialog-title">Insert Link</h3>

        <div class="form-group">
          <label for="link-text" class="form-label">Link Text</label>
          <input
            id="link-text"
            ref="textInputRef"
            v-model="linkText"
            type="text"
            class="form-input"
            data-test="link-text"
            placeholder="Link text"
          />
        </div>

        <div class="form-group">
          <label for="link-url" class="form-label">URL</label>
          <input
            id="link-url"
            ref="urlInputRef"
            v-model="linkUrl"
            type="text"
            class="form-input"
            data-test="link-url"
            placeholder="https://example.com"
            @keydown.enter="handleConfirm"
          />
          <p v-if="errorMessage" class="error-message" data-test="error-message">
            {{ errorMessage }}
          </p>
        </div>

        <div class="dialog-actions">
          <button
            type="button"
            class="btn-cancel"
            data-test="cancel-button"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn-confirm"
            data-test="confirm-button"
            @click="handleConfirm"
          >
            Insert Link
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  selectedText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'confirm'])

const textInputRef = ref(null)
const urlInputRef = ref(null)
const linkText = ref('')
const linkUrl = ref('')
const errorMessage = ref('')

// Watch for dialog open/close
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    // Pre-fill with selected text
    linkText.value = props.selectedText
    linkUrl.value = ''
    errorMessage.value = ''
    
    // Focus URL input
    await nextTick()
    urlInputRef.value?.focus()
  } else {
    // Reset form on close
    linkText.value = ''
    linkUrl.value = ''
    errorMessage.value = ''
  }
}, { immediate: true }) // Run immediately on mount if already open

// Also watch selectedText separately to handle updates
watch(() => props.selectedText, (newText) => {
  if (props.isOpen) {
    linkText.value = newText
  }
})

// Validate URL
const isValidUrl = (url) => {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// Handle confirm
const handleConfirm = () => {
  errorMessage.value = ''

  if (!isValidUrl(linkUrl.value)) {
    errorMessage.value = 'Please enter a valid URL (starting with http:// or https://)'
    return
  }

  emit('confirm', {
    text: linkText.value,
    url: linkUrl.value
  })

  handleClose()
}

// Handle close
const handleClose = () => {
  emit('close')
}

// Handle overlay click (close dialog)
const handleOverlayClick = () => {
  handleClose()
}
</script>

<style scoped>
.link-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.link-dialog {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text, #2c3e50);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text, #2c3e50);
}

.form-input {
  width: 100%;
  padding: 0.625rem;
  font-size: 0.9375rem;
  border: 1px solid var(--color-border, #e0e5eb);
  border-radius: 4px;
  transition: border-color 150ms ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary, #5a6c7d);
  box-shadow: 0 0 0 2px rgba(90, 108, 125, 0.1);
}

.error-message {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-error, #e53e3e);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-cancel,
.btn-confirm {
  padding: 0.5rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: 4px;
  transition: all 150ms ease;
  cursor: pointer;
}

.btn-cancel {
  background-color: transparent;
  color: var(--color-text-secondary, #5a6c7d);
  border: 1px solid var(--color-border, #e0e5eb);
}

.btn-cancel:hover {
  background-color: var(--color-bg-secondary, #f5f7fa);
}

.btn-confirm {
  background-color: var(--color-primary, #5a6c7d);
  color: white;
  border: none;
}

.btn-confirm:hover {
  background-color: var(--color-primary-hover, #4a5c6d);
}

.btn-cancel:focus,
.btn-confirm:focus {
  outline: 2px solid var(--color-primary, #5a6c7d);
  outline-offset: 2px;
}
</style>
