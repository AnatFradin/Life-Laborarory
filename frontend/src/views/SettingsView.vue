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

import { ref, onMounted, computed, watch } from 'vue';
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
const selectedLocalModel = ref('llama2');
const selectedOnlineProvider = ref('openai');
const selectedOnlineModel = ref('gpt-3.5-turbo');

// Save state
const saveMessage = ref('');
const saveError = ref(false);

// Available models (will be loaded from API)
const ollamaModels = ref([]);
const loadingOllamaModels = ref(false);

// Storage location state
const selectedStoragePath = ref(''); // Will store the actual path or 'default-local' or 'default-icloud'
const availableStorageOptions = ref([]); // Predefined options from API
const customStoragePath = ref('');
const showCustomPathInput = ref(false);
const loadingStorageLocations = ref(false);
const showStorageMigrationWarning = ref(false);
const pendingStoragePath = ref(null);
const isInitialLoad = ref(true); // Flag to prevent dialog on initial sync

// Collapsible sections state
const expandedSection = ref(null); // Track which section is expanded
const expandedNestedSection = ref(null); // Track which nested section is expanded

// Toggle section expansion
const toggleSection = (sectionName) => {
  if (expandedSection.value === sectionName) {
    expandedSection.value = null; // Collapse if already expanded
  } else {
    expandedSection.value = sectionName; // Expand the clicked section
  }
};

// Toggle nested section expansion
const toggleNestedSection = (sectionName) => {
  if (expandedNestedSection.value === sectionName) {
    expandedNestedSection.value = null;
  } else {
    expandedNestedSection.value = sectionName;
  }
};

// Computed: current effective storage path
const currentStoragePath = computed(() => {
  if (!preferences.value) return '';
  
  // If custom path is set, use it
  if (preferences.value.customStoragePath) {
    return preferences.value.customStoragePath;
  }
  
  // Otherwise, use the storage location default
  if (preferences.value.storageLocation === 'icloud') {
    return 'default-icloud';
  }
  
  return 'default-local';
});

// Track if there are unsaved changes
const hasUnsavedChanges = computed(() => {
  if (!preferences.value) return false;
  
  const currentPath = currentStoragePath.value;
  const newPath = selectedStoragePath.value === 'custom' ? customStoragePath.value : selectedStoragePath.value;
  
  return (
    selectedProvider.value !== preferences.value.aiProvider ||
    selectedLocalModel.value !== preferences.value.localModel ||
    selectedOnlineProvider.value !== preferences.value.onlineProvider ||
    selectedOnlineModel.value !== preferences.value.onlineModel ||
    newPath !== currentPath
  );
});

const openaiModels = [
  { value: 'gpt-4', label: 'GPT-4 (Most capable, slower)', description: 'Best for complex reflections' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Fast, balanced)', description: 'Good for most reflections' },
];

const anthropicModels = [
  { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (Most capable)', description: 'Best understanding and nuance' },
  { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet (Balanced)', description: 'Good balance of speed and quality' },
  { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Fastest)', description: 'Quick responses' },
];

// Sync local state with preferences
const syncWithPreferences = () => {
  if (preferences.value) {
    selectedProvider.value = preferences.value.aiProvider;
    if (preferences.value.localModel) {
      selectedLocalModel.value = preferences.value.localModel;
    }
    if (preferences.value.onlineProvider) {
      selectedOnlineProvider.value = preferences.value.onlineProvider;
    }
    if (preferences.value.onlineModel) {
      selectedOnlineModel.value = preferences.value.onlineModel;
    }
    // Sync storage path
    if (preferences.value.customStoragePath) {
      // Custom path is set
      selectedStoragePath.value = 'custom';
      customStoragePath.value = preferences.value.customStoragePath;
      showCustomPathInput.value = true;
    } else if (preferences.value.storageLocation === 'icloud') {
      selectedStoragePath.value = 'default-icloud';
      customStoragePath.value = '';
      showCustomPathInput.value = false;
    } else {
      // Default local
      selectedStoragePath.value = 'default-local';
      customStoragePath.value = '';
      showCustomPathInput.value = false;
    }
  }
};

// Load available storage locations
const loadStorageLocations = async () => {
  loadingStorageLocations.value = true;
  try {
    const api = await import('../services/api.js');
    const response = await api.default.get('/storage/locations');
    const locations = response.data.data.locations;
    
    // Build options list
    availableStorageOptions.value = [
      // Default local option
      {
        value: 'default-local',
        label: '💾 Default Local Storage',
        path: locations.find(l => l.value === 'local')?.displayPath || './data',
        description: 'Application data folder',
        available: true,
      },
    ];
    
    // Add iCloud option if available
    const icloudLocation = locations.find(l => l.value === 'icloud');
    if (icloudLocation?.available) {
      availableStorageOptions.value.push({
        value: 'default-icloud',
        label: '☁️ iCloud Drive',
        path: icloudLocation.displayPath,
        description: 'Sync across Apple devices',
        available: true,
      });
    }
    
    // Add "Custom" option
    availableStorageOptions.value.push({
      value: 'custom',
      label: '📂 Custom Location',
      path: 'Specify your own path',
      description: 'Choose any directory',
      available: true,
    });
  } catch (err) {
    console.error('Failed to load storage locations:', err);
    // Fallback options
    availableStorageOptions.value = [
      {
        value: 'default-local',
        label: '💾 Default Local Storage',
        path: './data',
        description: 'Application data folder',
        available: true,
      },
      {
        value: 'custom',
        label: '📂 Custom Location',
        path: 'Specify your own path',
        description: 'Choose any directory',
        available: true,
      },
    ];
  } finally {
    loadingStorageLocations.value = false;
  }
};

// Handle storage location change
// Handle storage path selection change
const handleStoragePathChange = () => {
  if (selectedStoragePath.value === 'custom') {
    showCustomPathInput.value = true;
  } else {
    showCustomPathInput.value = false;
    customStoragePath.value = '';
  }
};

// Confirm storage location change
const confirmStorageLocationChange = () => {
  // Keep the new selection that triggered the dialog
  showStorageMigrationWarning.value = false;
  pendingStoragePath.value = null;
};

// Cancel storage location change
const cancelStorageLocationChange = () => {
  showStorageMigrationWarning.value = false;
  // Revert to the saved preference
  syncWithPreferences();
  pendingStoragePath.value = null;
};

// Load available Ollama models
const loadOllamaModels = async () => {
  loadingOllamaModels.value = true;
  try {
    const api = await import('../services/api.js');
    const response = await api.default.get('/ai/models/ollama');
    ollamaModels.value = response.data.models.map(modelName => ({
      value: modelName,
      label: modelName,
    }));
    
    // If no models found, show helpful message
    if (ollamaModels.value.length === 0) {
      console.warn('No Ollama models found. Install models with: ollama pull <model-name>');
    }
  } catch (err) {
    console.error('Failed to load Ollama models:', err);
    // Fallback to some common models
    ollamaModels.value = [
      { value: 'llama2', label: 'llama2' },
      { value: 'mistral', label: 'mistral' },
      { value: 'llama3', label: 'llama3' },
    ];
  } finally {
    loadingOllamaModels.value = false;
  }
};

// Load preferences on mount
onMounted(async () => {
  isInitialLoad.value = true;
  await loadPreferences();
  syncWithPreferences(); // Sync after loading
  await Promise.all([
    loadOllamaModels(),
    loadStorageLocations(),
  ]);
  // After initial sync, enable the watcher
  setTimeout(() => {
    isInitialLoad.value = false;
  }, 100);
});

// Watch preferences and sync when they change
watch(preferences, () => {
  // Temporarily disable watcher during sync to avoid triggering dialog
  isInitialLoad.value = true;
  syncWithPreferences();
  setTimeout(() => {
    isInitialLoad.value = false;
  }, 50);
}, { deep: true });

// Watch for storage path changes and show confirmation dialog
watch(selectedStoragePath, (newValue, oldValue) => {
  // Only show dialog if:
  // 1. Not initial load (prevent dialog on mount)
  // 2. Preferences are loaded
  // 3. Value actually changed
  // 4. Change is different from saved preference
  // 5. Dialog is not already shown
  if (
    !isInitialLoad.value &&
    preferences.value &&
    newValue !== oldValue &&
    newValue !== currentStoragePath.value &&
    !showStorageMigrationWarning.value
  ) {
    pendingStoragePath.value = newValue;
    showStorageMigrationWarning.value = true;
  }
});

// Computed: Is privacy warning needed?
const needsPrivacyWarning = computed(() => {
  return !preferences.value?.hasAcknowledgedOnlineWarning;
});

// Handle local model change (just update local state, don't auto-save)
const handleLocalModelChange = () => {
  // Model change is now tracked as unsaved change
  // User must click Save Settings button
  saveMessage.value = '';
};

// Handle save settings
const handleSaveSettings = async () => {
  saveMessage.value = '';
  saveError.value = false;
  
  try {
    const updates = {};
    
    // Determine storage location and custom path based on selection
    if (selectedStoragePath.value === 'custom') {
      if (!customStoragePath.value || customStoragePath.value.trim() === '') {
        saveMessage.value = '❌ Please enter a custom path or select a predefined location.';
        saveError.value = true;
        return;
      }
      updates.storageLocation = 'local'; // Use local as base
      updates.customStoragePath = customStoragePath.value.trim();
    } else if (selectedStoragePath.value === 'default-icloud') {
      updates.storageLocation = 'icloud';
      updates.customStoragePath = null;
    } else {
      // default-local
      updates.storageLocation = 'local';
      updates.customStoragePath = null;
    }
    
    if (selectedProvider.value === 'local') {
      updates.aiProvider = 'local';
      updates.localModel = selectedLocalModel.value;
    } else {
      updates.aiProvider = 'online';
      updates.onlineProvider = selectedOnlineProvider.value;
      updates.onlineModel = selectedOnlineModel.value;
    }
    
    await updatePreferences(updates);
    saveMessage.value = '✅ Settings saved successfully!';
    
    // Sync state after save
    syncWithPreferences();
    
    // Clear message after 3 seconds
    setTimeout(() => {
      saveMessage.value = '';
    }, 3000);
  } catch (err) {
    console.error('Failed to save settings:', err);
    saveMessage.value = '❌ Failed to save settings. Please try again.';
    saveError.value = true;
  }
};

// Handle provider change
const handleProviderChange = async (value) => {
  selectedProvider.value = value;
  
  if (value === 'local') {
    // Switch to local AI immediately
    await switchToLocalAI();
    // Sync state after successful switch
    syncWithPreferences();
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
      // Sync state after successful switch
      syncWithPreferences();
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
    // Sync state after successful switch
    syncWithPreferences();
  } catch (err) {
    console.error('Failed to switch to online AI:', err);
  }
};

// Cancel privacy warning (revert to local)
const cancelPrivacyWarning = () => {
  showPrivacyWarning.value = false;
  // Revert to current preference (which should be 'local')
  syncWithPreferences();
};

// Update online model selection
const handleOnlineModelChange = async () => {
  if (selectedProvider.value === 'online' && !needsPrivacyWarning.value) {
    await switchToOnlineAI(
      selectedOnlineProvider.value,
      selectedOnlineModel.value,
      true
    );
    // Sync state after successful switch
    syncWithPreferences();
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
      <!-- Save Settings Button - At Top -->
      <section class="setting-section save-section save-section-top">
        <button 
          @click="handleSaveSettings" 
          class="save-button"
          :disabled="loading || !hasUnsavedChanges"
        >
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
        <p v-if="saveMessage" class="save-message" :class="{ error: saveError }">
          {{ saveMessage }}
        </p>
      </section>

      <!-- AI Provider Selection -->
      <!-- AI Processing Section - Collapsible -->
      <section class="setting-section collapsible-section">
        <div class="section-header" @click="toggleSection('aiProcessing')">
          <div class="section-header-content">
            <h2 class="section-title">AI Processing</h2>
            <p v-if="expandedSection !== 'aiProcessing'" class="section-summary">
              {{ selectedProvider === 'local' ? '🔒 Local AI (Ollama)' : '🌐 Online AI' }}
              {{ selectedProvider === 'online' ? `- ${selectedOnlineProvider === 'openai' ? 'OpenAI' : 'Anthropic'}` : '' }}
            </p>
          </div>
          <span class="expand-icon" :class="{ expanded: expandedSection === 'aiProcessing' }">
            {{ expandedSection === 'aiProcessing' ? '▼' : '▶' }}
          </span>
        </div>

        <div v-show="expandedSection === 'aiProcessing'" class="section-content">
          <!-- Privacy Information - First in section -->
          <div class="privacy-info-inline">
            <div class="info-card">
              <p v-if="selectedProvider === 'local'" class="info-text privacy-safe">
                ✅ <strong>Your data is completely private.</strong> All reflections are processed locally on your device using Ollama. Nothing is sent to external servers.
              </p>
              <p v-else class="info-text privacy-warning">
                ⚠️ <strong>Your reflection content will be sent to {{ selectedOnlineProvider === 'openai' ? 'OpenAI' : 'Anthropic' }}.</strong>
                While these services have privacy policies, your reflections will leave your device for processing.
              </p>
            </div>
          </div>

          <p class="section-description">
            Choose how your reflections are processed by AI. This determines where your personal reflections are analyzed.
          </p>

          <RadioGroupRoot
          v-model="selectedProvider"
          @update:modelValue="handleProviderChange"
          class="radio-group"
          aria-label="AI provider selection"
        >
          <!-- Local AI Option -->
          <div class="radio-option-container">
            <label class="radio-option" for="provider-local">
              <RadioGroupItem value="local" class="radio-item" id="provider-local">
                <RadioGroupIndicator class="radio-indicator">
                  <div class="radio-dot"></div>
                </RadioGroupIndicator>
              </RadioGroupItem>
              <div class="radio-label">
                <span class="radio-title">🔒 Local AI (Ollama)</span>
                <span class="radio-description">
                  Complete privacy. Your reflections never leave your device. Requires Ollama running locally.
                </span>
                <span class="privacy-badge local">100% Private</span>
              </div>
            </label>
            
            <!-- Local Model Selection (shown when local is selected) -->
            <div v-if="selectedProvider === 'local'" class="nested-options">
              <div class="nested-section-header" @click="toggleNestedSection('localModel')">
                <h3 class="subsection-title">Ollama Model</h3>
                <span class="expand-icon-small" :class="{ expanded: expandedNestedSection === 'localModel' }">
                  {{ expandedNestedSection === 'localModel' ? '▼' : '▶' }}
                </span>
              </div>
              
              <div v-show="expandedNestedSection === 'localModel'" class="nested-content">
                <p class="model-description">Select which Ollama model to use for reflections.</p>
                
                <div v-if="loadingOllamaModels" class="loading-models">
                  <span>Loading models...</span>
                </div>
                
                <div v-else-if="ollamaModels.length === 0" class="no-models-warning">
                  <p class="warning-text">⚠️ No models found. Install with:</p>
                  <p class="model-hint"><code>ollama pull llama2</code></p>
                </div>
                
                <div v-else>
                  <select
                    v-model="selectedLocalModel"
                    @change="handleLocalModelChange"
                    class="model-select"
                    aria-label="Ollama model selection"
                  >
                    <option
                      v-for="model in ollamaModels"
                      :key="model.value"
                      :value="model.value"
                    >
                      {{ model.label }}
                    </option>
                  </select>
                  <p class="model-hint">
                    💡 {{ ollamaModels.length }} model(s) available
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Online AI Option -->
          <div class="radio-option-container">
            <label class="radio-option" for="provider-online">
              <RadioGroupItem value="online" class="radio-item" id="provider-online">
                <RadioGroupIndicator class="radio-indicator">
                  <div class="radio-dot"></div>
                </RadioGroupIndicator>
              </RadioGroupItem>
              <div class="radio-label">
                <span class="radio-title">🌐 Online AI</span>
                <span class="radio-description">
                  More capable models, but your reflection content is sent to external AI services (OpenAI or Anthropic).
                </span>
                <span class="privacy-badge online">Data Leaves Device</span>
              </div>
            </label>

            <!-- Online Provider Selection (shown when online is selected) -->
            <div v-if="selectedProvider === 'online'" class="nested-options">
              <div class="nested-section-header" @click="toggleNestedSection('onlineProvider')">
                <h3 class="subsection-title">Provider & Model</h3>
                <span class="expand-icon-small" :class="{ expanded: expandedNestedSection === 'onlineProvider' }">
                  {{ expandedNestedSection === 'onlineProvider' ? '▼' : '▶' }}
                </span>
              </div>
              
              <div v-show="expandedNestedSection === 'onlineProvider'" class="nested-content">
                <RadioGroupRoot
                  v-model="selectedOnlineProvider"
                  @update:modelValue="handleOnlineProviderChange"
                  class="radio-group radio-group-compact"
                  aria-label="Online AI provider selection"
                >
                  <label class="radio-option radio-option-compact" for="provider-openai">
                    <RadioGroupItem value="openai" class="radio-item" id="provider-openai">
                      <RadioGroupIndicator class="radio-indicator">
                        <div class="radio-dot"></div>
                      </RadioGroupIndicator>
                    </RadioGroupItem>
                    <div class="radio-label">
                      <span class="radio-title">OpenAI (GPT)</span>
                    </div>
                  </label>

                  <label class="radio-option radio-option-compact" for="provider-anthropic">
                    <RadioGroupItem value="anthropic" class="radio-item" id="provider-anthropic">
                      <RadioGroupIndicator class="radio-indicator">
                        <div class="radio-dot"></div>
                      </RadioGroupIndicator>
                    </RadioGroupItem>
                    <div class="radio-label">
                      <span class="radio-title">Anthropic (Claude)</span>
                    </div>
                  </label>
                </RadioGroupRoot>

                <!-- Model Selection -->
                <div class="model-selection">
                  <label class="model-label">Model:</label>
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
            </div>
          </div>
        </RadioGroupRoot>
        </div>
      </section>

      <!-- Storage Location - Collapsible -->
      <section class="setting-section collapsible-section">
        <div class="section-header" @click="toggleSection('storageLocation')">
          <div class="section-header-content">
            <h2 class="section-title">Storage Location</h2>
            <p v-if="expandedSection !== 'storageLocation'" class="section-summary">
              📁 {{ availableStorageOptions.find(o => o.value === selectedStoragePath)?.label || 'Not configured' }}
            </p>
          </div>
          <span class="expand-icon" :class="{ expanded: expandedSection === 'storageLocation' }">
            {{ expandedSection === 'storageLocation' ? '▼' : '▶' }}
          </span>
        </div>

        <div v-show="expandedSection === 'storageLocation'" class="section-content">
          <p class="section-description">
            Choose where your reflections are stored. Select a predefined location or specify a custom path.
          </p>

          <div v-if="loadingStorageLocations" class="loading-state">
          <p>Loading storage options...</p>
        </div>

        <div v-else class="storage-selector">
          <label for="storage-path-select" class="storage-label">
            📁 Storage Location
          </label>
          <select
            id="storage-path-select"
            v-model="selectedStoragePath"
            @change="handleStoragePathChange"
            class="storage-select"
            aria-label="Storage location selection"
          >
            <option
              v-for="option in availableStorageOptions"
              :key="option.value"
              :value="option.value"
              :disabled="!option.available"
            >
              {{ option.label }}
            </option>
          </select>
          
          <!-- Show path info for selected option -->
          <div v-if="selectedStoragePath !== 'custom'" class="selected-path-info">
            <p class="path-description">
              {{ availableStorageOptions.find(o => o.value === selectedStoragePath)?.description }}
            </p>
            <div class="path-display">
              📂 {{ availableStorageOptions.find(o => o.value === selectedStoragePath)?.path }}
            </div>
          </div>
        </div>

        <!-- Custom Path Input (only shown when "Custom" is selected) -->
        <div v-if="showCustomPathInput" class="custom-path-section">
          <h3 class="subsection-title">Specify Custom Path</h3>
          <p class="path-description">
            Enter the full directory path where you want to store your reflections.
          </p>
          
          <div class="path-input-group">
            <label for="custom-path" class="path-label">
              📂 Directory Path
            </label>
            <input
              id="custom-path"
              v-model="customStoragePath"
              type="text"
              class="path-input"
              placeholder="e.g., /Users/yourname/Documents/MyReflections"
              aria-label="Custom storage path"
            />
            <p class="path-hint">
              💡 <strong>Tip:</strong> Use an absolute path (starting with /) for best results.
            </p>
            <p v-if="customStoragePath" class="path-hint">
              <strong>Selected:</strong> {{ customStoragePath }}
            </p>
          </div>
        </div>

          <div class="storage-info-box">
            <p class="info-icon">💡</p>
            <div class="info-content">
              <p><strong>Note:</strong> Changing storage location does not automatically move existing reflections.</p>
              <p>Your previous reflections will remain in the old location. New reflections will be saved to the new location.</p>
            </div>
          </div>
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

    <!-- Storage Migration Warning Dialog -->
    <DialogRoot v-model:open="showStorageMigrationWarning">
      <DialogPortal>
        <DialogOverlay class="dialog-overlay" />
        <DialogContent class="dialog-content storage-migration-dialog">
          <DialogTitle class="dialog-title">
            📦 Storage Location Change
          </DialogTitle>
          
          <DialogDescription class="dialog-description">
            <p class="warning-text">
              <strong>Important: This does not move your existing reflections.</strong>
            </p>
            <p>
              Changing storage location affects where NEW reflections will be saved:
            </p>
            <ul class="warning-list">
              <li>Existing reflections remain in the current location</li>
              <li>New reflections will be saved to the new location</li>
              <li>You won't see old reflections until you switch back</li>
            </ul>
            <p class="migration-tip">
              <strong>💡 To move existing data:</strong> Manually copy files from the old location to the new one, or use export/import features.
            </p>
          </DialogDescription>

          <div class="dialog-actions">
            <button
              @click="cancelStorageLocationChange"
              class="button button-secondary"
              type="button"
            >
              Cancel
            </button>
            <button
              @click="confirmStorageLocationChange"
              class="button button-primary"
              type="button"
            >
              Continue - Change Location
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
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.settings-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
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
  gap: 0.75rem;
}

.setting-section {
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all 0.2s ease;
}

/* Collapsible section styles */
.collapsible-section {
  padding: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.section-header:hover {
  background-color: var(--color-background-hover);
}

.section-header-content {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.expand-icon {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.expand-icon.expanded {
  transform: rotate(0deg);
}

.section-content {
  padding: 0 1rem 1rem 1rem;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.section-summary {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  font-weight: 400;
  margin: 0;
}

.section-description {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.subsection-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

/* Radio Groups */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-option-container {
  margin-bottom: 0;
}

.radio-option:hover {
  border-color: var(--color-primary);
  background-color: var(--color-background-hover);
}

.radio-option:has(.radio-item[data-state="checked"]) {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.nested-options {
  margin-left: 1.5rem;
  margin-top: 0.625rem;
  padding: 0.625rem;
  border-left: 2px solid var(--color-primary);
  background-color: var(--color-background-subtle);
  border-radius: 0 0.375rem 0.375rem 0;
}

.nested-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  padding: 0.25rem 0;
  margin-bottom: 0.5rem;
}

.nested-section-header:hover {
  opacity: 0.8;
}

.nested-section-header .subsection-title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.expand-icon-small {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.nested-content {
  animation: slideDown 0.15s ease;
}

.nested-options .subsection-title {
  font-size: 0.8125rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}

.nested-options .radio-option {
  margin-bottom: 0.5rem;
}

.nested-options .model-selection {
  margin-top: 0.625rem;
}

/* Compact radio options for nested sections */
.radio-group-compact {
  gap: 0.5rem;
}

.radio-option-compact {
  padding: 0.5rem;
}

.radio-option-compact .radio-description {
  display: none;
}

.radio-item {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background-color: white;
  flex-shrink: 0;
  margin-top: 0.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 0 !important;
  color: transparent !important;
  overflow: hidden;
}

/* Hide any text content inside radio button */
.radio-item::before,
.radio-item::after {
  content: none !important;
}

.radio-item[data-state="checked"] {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
}

/* Add a white inner circle for checked state */
.radio-item[data-state="checked"]::after {
  content: '' !important;
  display: block !important;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.radio-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 0;
  pointer-events: none;
}

.radio-dot {
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
  font-size: 0.875rem;
}

.radio-description {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.privacy-badge {
  display: inline-block;
  padding: 0.1875rem 0.5rem;
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

/* Local Options */
.local-options {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.model-description {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.loading-models {
  padding: 0.75rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
}

.no-models-warning {
  padding: 0.75rem;
  background-color: var(--color-warning-light);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-sm);
  margin-bottom: 0.5rem;
}

.no-models-warning .warning-text {
  color: var(--color-warning);
  font-weight: 600;
  margin-bottom: 0.375rem;
  font-size: 0.8125rem;
}

.model-hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.model-hint code {
  background-color: var(--color-background-secondary);
  padding: 0.125rem 0.3125rem;
  border-radius: var(--radius-sm);
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-primary);
}

/* Online Options */
.online-options {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.model-selection {
  margin-top: 0.75rem;
}

.model-select {
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  background-color: white;
  color: var(--color-text-primary);
  cursor: pointer;
}

.model-select:focus {
  outline: 1px solid var(--color-focus);
  outline-offset: 1px;
  border-color: var(--color-primary);
}

.model-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.375rem;
}

.model-description {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.model-hint {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.375rem;
}

.loading-models, .no-models-warning {
  padding: 0.5rem;
  font-size: 0.8125rem;
}

.no-models-warning .warning-text {
  font-size: 0.8125rem;
  margin-bottom: 0.375rem;
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
.privacy-info-inline {
  margin-bottom: 1rem;
}

.privacy-info-inline .info-card {
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.privacy-safe .info-card,
.privacy-info-inline .info-card:has(.privacy-safe) {
  background-color: #e8f5e9;
  border-color: #4caf50;
}

.privacy-warning .info-card,
.privacy-info-inline .info-card:has(.privacy-warning) {
  background-color: #fff3e0;
  border-color: #ff9800;
}

.info-card .info-text {
  font-size: 0.8125rem;
  line-height: 1.5;
  margin: 0;
  color: var(--color-text-primary);
}

.info-card .privacy-safe {
  color: #2e7d32;
}

.info-card .privacy-warning {
  color: #e65100;
}

.privacy-info .info-card {
  padding: 1rem;
  border-radius: var(--radius-md);
  background-color: var(--color-background-secondary);
}

/* Save Section */
.save-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
  padding: 0.875rem 1rem;
}

.save-section-top {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--color-surface);
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 0.5rem;
}

.save-button {
  padding: 0.625rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.save-button:disabled {
  background-color: var(--color-border);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.save-message {
  font-size: 0.8125rem;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  background-color: var(--color-success-bg, #e8f5e9);
  color: var(--color-success, #2e7d32);
}

.save-message.error {
  background-color: var(--color-error-bg, #ffebee);
  color: var(--color-error, #c62828);
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

/* Storage Location Styles */
.storage-selector {
  margin-bottom: 1rem;
}

.storage-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.375rem;
}

.storage-select {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  color: var(--color-text-primary);
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.storage-select:hover {
  border-color: var(--color-primary);
}

.storage-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.selected-path-info {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.path-display {
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-top: 0.375rem;
  padding: 0.375rem 0.625rem;
  background-color: white;
  border-radius: var(--radius-sm);
}

.custom-path-section {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--color-background-info, #eff6ff);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-primary);
}

.path-description {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.path-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.path-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  display: block;
}

.path-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-family: 'Courier New', monospace;
  color: var(--color-text-primary);
  background-color: white;
  transition: border-color 0.2s ease;
}

.path-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.path-input::placeholder {
  color: var(--color-text-tertiary, #9ca3af);
  font-size: 0.8125rem;
}

.path-hint {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin: 0;
}

.unavailable-badge {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background-color: var(--color-border);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  margin-left: 0.5rem;
  font-weight: normal;
}

.hint-text {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  font-style: italic;
  margin-top: 0.375rem;
}

.radio-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.radio-option.disabled .radio-item {
  cursor: not-allowed;
}

.storage-info-box {
  display: flex;
  gap: 0.625rem;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: var(--color-background-info, #eff6ff);
  border: 1px solid var(--color-border-info, #bfdbfe);
  border-radius: var(--radius-sm);
}

.info-icon {
  font-size: 1.25rem;
  line-height: 1;
  margin: 0;
}

.info-content {
  flex: 1;
}

.info-content p {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0 0 0.375rem 0;
}

.info-content p:last-child {
  margin-bottom: 0;
}

/* Storage Migration Dialog */
.storage-migration-dialog {
  max-width: 550px;
}

.migration-tip {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--color-background-info, #eff6ff);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-sm);
}
</style>
