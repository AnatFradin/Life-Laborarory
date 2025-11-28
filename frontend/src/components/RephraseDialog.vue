<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="rephrase-dialog-overlay"
      @click.self="handleClose"
      @keydown.esc="handleClose"
      data-test="rephrase-dialog"
    >
      <div class="rephrase-dialog" role="dialog" aria-labelledby="dialog-title" aria-modal="true">
        <div class="dialog-header">
          <h2 id="dialog-title">Rephrase Text</h2>
          <button
            class="close-button"
            @click="handleClose"
            aria-label="Close dialog"
            :disabled="loading"
          >
            ×
          </button>
        </div>

        <div class="dialog-content">
          <!-- Original Text -->
          <div class="original-section">
            <h3>Original Text</h3>
            <div class="original-text" data-test="original-text">{{ originalText }}</div>
          </div>

          <!-- Style Selector -->
          <div class="style-selector">
            <h3>Rephrasing Style</h3>
            <div class="style-options">
              <label class="style-option">
                <input
                  type="radio"
                  name="style"
                  value="clearer"
                  v-model="selectedStyle"
                  :disabled="loading"
                  @change="handleStyleChange"
                />
                <span class="style-label">
                  <strong>Clearer</strong>
                  <small>Simplify and make more concise</small>
                </span>
              </label>

              <label class="style-option">
                <input
                  type="radio"
                  name="style"
                  value="more-positive"
                  v-model="selectedStyle"
                  :disabled="loading"
                  @change="handleStyleChange"
                />
                <span class="style-label">
                  <strong>More Positive</strong>
                  <small>Reframe with hopeful tone</small>
                </span>
              </label>

              <label class="style-option">
                <input
                  type="radio"
                  name="style"
                  value="more-constructive"
                  v-model="selectedStyle"
                  :disabled="loading"
                  @change="handleStyleChange"
                />
                <span class="style-label">
                  <strong>More Constructive</strong>
                  <small>Focus on growth and learning</small>
                </span>
              </label>
            </div>

            <button
              class="rephrase-button"
              data-test="rephrase-button"
              @click="handleRephrase"
              :disabled="loading"
            >
              {{ loading ? 'Rephrasing...' : 'Rephrase' }}
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-container" data-test="loading-spinner">
            <div class="loading-spinner"></div>
            <p>AI is rephrasing your text...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-message" data-test="error-message">
            <p><strong>AI service unavailable.</strong></p>
            <p>Your original text is preserved. Please try again later.</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="suggestions.length === 0" class="empty-state" data-test="empty-state">
            <p>Select a style and click Rephrase to see AI suggestions.</p>
          </div>

          <!-- Suggestions -->
          <div v-else class="suggestions-section" data-test="suggestions-list">
            <h3>Suggestions ({{ suggestions.length }})</h3>
            <div
              v-for="(suggestion, index) in suggestions"
              :key="index"
              class="suggestion-item"
              data-test="suggestion-item"
            >
              <div class="suggestion-text">{{ suggestion }}</div>
              <button
                class="accept-button"
                data-test="accept-suggestion"
                @click="handleAccept(suggestion)"
                aria-label="Accept this suggestion"
              >
                Accept
              </button>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button
            class="cancel-button"
            data-test="cancel-button"
            @click="handleClose"
            :disabled="loading"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  originalText: {
    type: String,
    default: '',
  },
  suggestions: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['close', 'rephrase', 'accept']);

const selectedStyle = ref('clearer');

const handleClose = () => {
  if (!props.loading) {
    emit('close');
  }
};

const handleStyleChange = () => {
  // Auto-trigger rephrase when style changes (optional behavior)
  // Comment out if you want manual trigger only
  // emit('rephrase', selectedStyle.value);
};

const handleRephrase = () => {
  emit('rephrase', selectedStyle.value);
};

const handleAccept = (suggestion) => {
  emit('accept', suggestion);
};

// Reset to default style when dialog opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedStyle.value = 'clearer';
  }
});
</script>

<style scoped>
.rephrase-dialog-overlay {
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
  padding: 1rem;
}

.rephrase-dialog {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: fadeIn 200ms ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e5eb;
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 150ms ease;
}

.close-button:hover:not(:disabled) {
  background-color: #f5f7fa;
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.original-section {
  margin-bottom: 1.5rem;
}

.original-section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.original-text {
  padding: 1rem;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #2c3e50;
  line-height: 1.6;
  border: 1px solid #e0e5eb;
}

.style-selector {
  margin-bottom: 1.5rem;
}

.style-selector h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.style-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.style-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e0e5eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 150ms ease;
}

.style-option:hover:not(:has(input:disabled)) {
  border-color: #5a6c7d;
  background-color: #f9fafb;
}

.style-option:has(input:checked) {
  border-color: #5a6c7d;
  background-color: #f5f7fa;
}

.style-option input[type="radio"] {
  margin-top: 0.25rem;
  cursor: pointer;
}

.style-option input[type="radio"]:disabled {
  cursor: not-allowed;
}

.style-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.style-label strong {
  color: #2c3e50;
  font-size: 0.95rem;
}

.style-label small {
  color: #718096;
  font-size: 0.85rem;
}

.rephrase-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: #5a6c7d;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease;
}

.rephrase-button:hover:not(:disabled) {
  background-color: #4a5568;
}

.rephrase-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.loading-container {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e5eb;
  border-top-color: #5a6c7d;
  border-radius: 50%;
  animation: spin 800ms linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: #718096;
  margin: 0;
}

.error-message {
  padding: 1.5rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  color: #991b1b;
}

.error-message p {
  margin: 0.5rem 0;
}

.error-message p:first-child {
  margin-top: 0;
}

.error-message p:last-child {
  margin-bottom: 0;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #718096;
}

.empty-state p {
  margin: 0;
}

.suggestions-section {
  margin-top: 1.5rem;
}

.suggestions-section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.suggestion-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #e0e5eb;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  transition: all 150ms ease;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
  border-color: #cbd5e0;
}

.suggestion-text {
  flex: 1;
  color: #2c3e50;
  line-height: 1.6;
}

.accept-button {
  padding: 0.5rem 1rem;
  background-color: #5a6c7d;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease;
  flex-shrink: 0;
}

.accept-button:hover {
  background-color: #4a5568;
}

.accept-button:focus {
  outline: 2px solid #5a6c7d;
  outline-offset: 2px;
}

.dialog-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e5eb;
  display: flex;
  justify-content: flex-end;
}

.cancel-button {
  padding: 0.5rem 1.5rem;
  background-color: #f5f7fa;
  color: #2c3e50;
  border: 1px solid #e0e5eb;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
}

.cancel-button:hover:not(:disabled) {
  background-color: #e8ebf0;
}

.cancel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-button:focus {
  outline: 2px solid #5a6c7d;
  outline-offset: 2px;
}
</style>
