<script setup>
/**
 * SettingsView - User preferences and AI provider configuration
 * 
 * Per User Story 4 (T077, T078, T079):
 * - AI model selection using Radix Vue RadioGroup
 * - Privacy warning dialog for first-time online model selection
 * - Clear labels explaining privacy implications
 * - State machine validation (requires hasAcknowledgedOnlineWarning)
 * - Accessible keyboard navigation
 */

import { ref, onMounted, computed } from 'vue';
import { usePreferences } from '../composables/usePreferences.js';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'radix-vue';
import {
  RadioGroupRoot,
  RadioGroupItem,
  RadioGroupIndicator,
} from 'radix-vue';

const { preferences, loading, error, loadPreferences, updatePreferences, switchToOnlineAI, switchToLocalAI } = usePreferences();

// Privacy warning dialog state
const showPrivacyWarning = ref(false);
const pendingOnlineProvider = ref(null);
const pendingOnlineModel = ref(null);

// Local state for form
const selectedProvider = ref('local');
const selectedOnlineProvider = ref('openai');
const selectedOnlineModel = ref('gpt-3.5-turbo');

// Available models
const openaiModels = [
  { value: 'gpt-4', label: 'GPT-4 (Most capable, slower)', description: 'Best for complex reflections' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Fast, balanced)', description: 'Good for most reflections' },
];

const anthropicModels = [
  { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (Most capable)', description: 'Best understanding and nuance' },
  { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet (Balanced)', description: 'Good balance of speed and quality' },
  { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Fastest)', description: 'Quick responses' },
];

// Load preferences on mount
onMounted(async () => {
  await loadPreferences();
  
  if (preferences.value) {
    selectedProvider.value = preferences.value.aiProvider;
    if (preferences.value.onlineProvider) {
      selectedOnlineProvider.value = preferences.value.onlineProvider;
    }
    if (preferences.value.onlineModel) {
      selectedOnlineModel.value = preferences.value.onlineModel;
    }
  }
});

// Computed: Is privacy warning needed?
const needsPrivacyWarning = computed(() => {
  return !preferences.value?.hasAcknowledgedOnlineWarning;
});

// Handle provider change
const handleProviderChange = async (value) => {
  selectedProvider.value = value;
  
  if (value === 'local') {
    // Switch to local AI immediately
    await switchToLocalAI();
  } else if (value === 'online') {
    // Check if privacy warning is needed
    if (needsPrivacyWarning.value) {
      // Show privacy warning dialog
      pendingOnlineProvider.value = selectedOnlineProvider.value;
      pendingOnlineModel.value = selectedOnlineModel.value;
      showPrivacyWarning.value = true;
    } else {
      // Already acknowledged, update directly
      await switchToOnlineAI(
        selectedOnlineProvider.value,
        selectedOnlineModel.value,
        true
      );
    }
  }
};

// Handle online provider selection
const handleOnlineProviderChange = (value) => {
  selectedOnlineProvider.value = value;
  
  // Set default model for selected provider
  if (value === 'openai') {
    selectedOnlineModel.value = 'gpt-3.5-turbo';
  } else if (value === 'anthropic') {
    selectedOnlineModel.value = 'claude-3-sonnet-20240229';
  }
};

// Acknowledge privacy warning and enable online AI
const acknowledgePrivacyWarning = async () => {
  try {
    await switchToOnlineAI(
      pendingOnlineProvider.value,
      pendingOnlineModel.value,
      true
    );
    showPrivacyWarning.value = false;
  } catch (err) {
    console.error('Failed to switch to online AI:', err);
  }
};

// Cancel privacy warning (revert to local)
const cancelPrivacyWarning = () => {
  selectedProvider.value = 'local';
  showPrivacyWarning.value = false;
};

// Update online model selection
const handleOnlineModelChange = async () => {
  if (selectedProvider.value === 'online' && !needsPrivacyWarning.value) {
    await switchToOnlineAI(
      selectedOnlineProvider.value,
      selectedOnlineModel.value,
      true
    );
  }
};
</script>

<template>
  <div class="settings-view">
    <header class="settings-header">
      <h1 class="settings-title">Settings</h1>
      <p class="settings-description">
        Choose how your reflections are processed and configure your preferences.
      </p>
    </header>

    <div v-if="loading" class="loading-state">
      <p>Loading preferences...</p>
    </div>

    <div v-else-if="error" class="error-state" role="alert">
      <p>{{ error }}</p>
      <button @click="loadPreferences" class="retry-button">
        Try Again
      </button>
    </div>

    <div v-else-if="preferences" class="settings-content">
      <!-- AI Provider Selection -->
      <section class="setting-section">
        <h2 class="section-title">AI Processing</h2>
        <p class="section-description">
          Choose how your reflections are processed by AI. This determines where your personal reflections are analyzed.
        </p>
        
        <div class="privacy-explainer" role="region" aria-label="Privacy explanation">
          <div class="explainer-card">
            <div class="explainer-icon">🔒</div>
            <div class="explainer-content">
              <strong>Local AI (Recommended for Privacy):</strong> Your reflections never leave your device. All processing happens locally on your computer. Requires Ollama to be installed and running.
            </div>
          </div>
          <div class="explainer-card">
            <div class="explainer-icon">🌐</div>
            <div class="explainer-content">
              <strong>Online AI (Requires API Key):</strong> Your reflections are sent over the internet to OpenAI or Anthropic for processing. More capable models, but your personal data leaves your device and is subject to their privacy policies.
            </div>
          </div>
        </div>

        <RadioGroupRoot
          v-model="selectedProvider"
          @update:modelValue="handleProviderChange"
          class="radio-group"
          aria-label="AI provider selection"
        >
          <!-- Local AI Option -->
          <div class="radio-option">
            <RadioGroupItem value="local" class="radio-item" id="provider-local">
              <RadioGroupIndicator class="radio-indicator" />
            </RadioGroupItem>
            <label for="provider-local" class="radio-label">
              <span class="radio-title">🔒 Local AI (Ollama)</span>
              <span class="radio-description">
                Complete privacy. Your reflections never leave your device. Requires Ollama running locally.
              </span>
              <span class="privacy-badge local">100% Private</span>
            </label>
          </div>

          <!-- Online AI Option -->
          <div class="radio-option">
            <RadioGroupItem value="online" class="radio-item" id="provider-online">
              <RadioGroupIndicator class="radio-indicator" />
            </RadioGroupItem>
            <label for="provider-online" class="radio-label">
              <span class="radio-title">🌐 Online AI</span>
              <span class="radio-description">
                More capable models, but your reflection content is sent to external AI services (OpenAI or Anthropic).
              </span>
              <span class="privacy-badge online">Data Leaves Device</span>
            </label>
          </div>
        </RadioGroupRoot>

        <!-- Online Provider Selection (shown when online is selected) -->
        <div v-if="selectedProvider === 'online'" class="online-options">
          <h3 class="subsection-title">Choose Online Provider</h3>
          
          <RadioGroupRoot
            v-model="selectedOnlineProvider"
            @update:modelValue="handleOnlineProviderChange"
            class="radio-group"
            aria-label="Online AI provider selection"
          >
            <div class="radio-option">
              <RadioGroupItem value="openai" class="radio-item" id="provider-openai">
                <RadioGroupIndicator class="radio-indicator" />
              </RadioGroupItem>
              <label for="provider-openai" class="radio-label">
                <span class="radio-title">OpenAI (GPT)</span>
                <span class="radio-description">ChatGPT models - versatile and reliable</span>
              </label>
            </div>

            <div class="radio-option">
              <RadioGroupItem value="anthropic" class="radio-item" id="provider-anthropic">
                <RadioGroupIndicator class="radio-indicator" />
              </RadioGroupItem>
              <label for="provider-anthropic" class="radio-label">
                <span class="radio-title">Anthropic (Claude)</span>
                <span class="radio-description">Claude models - thoughtful and nuanced</span>
              </label>
            </div>
          </RadioGroupRoot>

          <!-- Model Selection -->
          <div class="model-selection">
            <h4 class="subsection-title">Select Model</h4>
            <select
              v-model="selectedOnlineModel"
              @change="handleOnlineModelChange"
              class="model-select"
              aria-label="AI model selection"
            >
              <optgroup v-if="selectedOnlineProvider === 'openai'" label="OpenAI Models">
                <option
                  v-for="model in openaiModels"
                  :key="model.value"
                  :value="model.value"
                >
                  {{ model.label }}
                </option>
              </optgroup>
              <optgroup v-if="selectedOnlineProvider === 'anthropic'" label="Anthropic Models">
                <option
                  v-for="model in anthropicModels"
                  :key="model.value"
                  :value="model.value"
                >
                  {{ model.label }}
                </option>
              </optgroup>
            </select>
          </div>
        </div>
      </section>

      <!-- Privacy Information -->
      <section class="setting-section privacy-info">
        <h2 class="section-title">Privacy Information</h2>
        <div class="info-card">
          <p v-if="selectedProvider === 'local'" class="info-text">
            ✅ <strong>Your data is completely private.</strong> All reflections are processed locally on your device. Nothing is sent to external servers.
          </p>
          <p v-else class="info-text warning">
            ⚠️ <strong>Your reflection content will be sent to {{ selectedOnlineProvider === 'openai' ? 'OpenAI' : 'Anthropic' }}.</strong>
            While these services have privacy policies, your reflections will leave your device for processing.
          </p>
        </div>
      </section>
    </div>

    <!-- Privacy Warning Dialog (T078) -->
    <DialogRoot v-model:open="showPrivacyWarning">
      <DialogPortal>
        <DialogOverlay class="dialog-overlay" />
        <DialogContent class="dialog-content privacy-warning-dialog">
          <DialogTitle class="dialog-title">
            ⚠️ Privacy Notice
          </DialogTitle>
          
          <DialogDescription class="dialog-description">
            <p class="warning-text">
              <strong>Your reflection content will leave your device.</strong>
            </p>
            <p>
              When you use online AI ({{ pendingOnlineProvider === 'openai' ? 'OpenAI' : 'Anthropic' }}), your reflections are sent to their servers for processing. This means:
            </p>
            <ul class="warning-list">
              <li>Your personal reflections will be transmitted over the internet</li>
              <li>They will be processed by {{ pendingOnlineProvider === 'openai' ? 'OpenAI' : 'Anthropic' }}'s systems</li>
              <li>The service provider's privacy policy will apply</li>
            </ul>
            <p>
              <strong>For complete privacy, use Local AI (Ollama) instead.</strong> Your reflections will never leave your device.
            </p>
          </DialogDescription>

          <div class="dialog-actions">
            <button
              @click="cancelPrivacyWarning"
              class="button button-secondary"
              type="button"
            >
              Cancel - Use Local AI
            </button>
            <button
              @click="acknowledgePrivacyWarning"
              class="button button-primary"
              type="button"
            >
              I Understand - Use Online AI
            </button>
          </div>

          <DialogClose class="dialog-close" aria-label="Close dialog">
            ×
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>

<style scoped>
.settings-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.settings-description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem 1rem;
}

.error-state {
  color: var(--color-error);
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setting-section {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.section-description,
.subsection-title {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.subsection-title {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-top: 1.5rem;
}

/* Radio Groups */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-option:hover {
  border-color: var(--color-primary);
  background-color: var(--color-background-hover);
}

.radio-option:has(.radio-item[data-state="checked"]) {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.radio-item {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background-color: white;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.radio-item[data-state="checked"] {
  border-color: var(--color-primary);
}

.radio-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.radio-indicator::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--color-primary);
}

.radio-label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
}

.radio-title {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 1rem;
}

.radio-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.privacy-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.privacy-badge.local {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.privacy-badge.online {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
}

/* Online Options */
.online-options {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.model-selection {
  margin-top: 1rem;
}

.model-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  background-color: white;
  color: var(--color-text-primary);
  cursor: pointer;
}

.model-select:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-color: var(--color-primary);
}

/* Privacy Explainer */
.privacy-explainer {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.explainer-card {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.explainer-icon {
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.explainer-content {
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.explainer-content strong {
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 0.25rem;
}

/* Privacy Info */
.privacy-info .info-card {
  padding: 1rem;
  border-radius: var(--radius-md);
  background-color: var(--color-background-secondary);
}

.info-text {
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.info-text.warning {
  color: var(--color-warning);
}

/* Privacy Warning Dialog */
.privacy-warning-dialog {
  max-width: 500px;
}

.warning-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-warning);
  margin-bottom: 1rem;
}

.warning-list {
  margin: 1rem 0;
  padding-left: 1.5rem;
  line-height: 1.8;
}

.warning-list li {
  margin-bottom: 0.5rem;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-secondary {
  background-color: var(--color-background-secondary);
  color: var(--color-text-primary);
}

.button-secondary:hover {
  background-color: var(--color-background-hover);
}

.button-primary {
  background-color: var(--color-primary);
  color: white;
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
}

.button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Dialog styles from other dialogs */
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
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 51;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.dialog-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.dialog-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-close:hover {
  background-color: var(--color-background-hover);
}

.dialog-close:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
</style>
