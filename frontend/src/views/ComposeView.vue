<template>
  <div class="compose-view">
    <header class="view-header">
      <h2 tabindex="-1">Compose</h2>
      <div class="privacy-badge" role="status" aria-live="polite">
        <span class="privacy-icon" aria-hidden="true">{{ privacyStatus.icon }}</span>
        <span class="privacy-text text-sm">{{ privacyStatus.text }}</span>
      </div>
    </header>

    <!-- Mode Selection -->
    <div class="mode-selection" role="group" aria-label="Expression mode">
      <label class="mode-option">
        <input
          type="radio"
          name="mode"
          value="text"
          v-model="currentMode"
          @change="handleModeChange"
        />
        <span class="mode-label">
          <span class="mode-icon" aria-hidden="true">✍️</span>
          <span class="mode-name">Text</span>
        </span>
      </label>
      <label class="mode-option">
        <input
          type="radio"
          name="mode"
          value="visual"
          v-model="currentMode"
          @change="handleModeChange"
        />
        <span class="mode-label">
          <span class="mode-icon" aria-hidden="true">🖼️</span>
          <span class="mode-name">Visual</span>
        </span>
      </label>
      <label class="mode-option">
        <input
          type="radio"
          name="mode"
          value="mixed"
          v-model="currentMode"
          @change="handleModeChange"
        />
        <span class="mode-label">
          <span class="mode-icon" aria-hidden="true">📋</span>
          <span class="mode-name">Mixed</span>
        </span>
      </label>
    </div>

    <div class="compose-content" role="region" aria-label="Reflection composition area">
      <!-- Text Mode -->
      <template v-if="currentMode === 'text'">
        <ReflectionEditor
          :initial-content="currentContent"
          :saving="saving"
          :generating-a-i="generating"
          :error="error"
          :last-saved="lastSaved"
          @save="handleSave"
          @request-ai-feedback="handleAIFeedback"
        />

        <AIMirrorPanel
          v-if="currentAIResponse || generating"
          :ai-response="currentAIResponse"
          :loading="generating"
        />

        <div v-if="currentContent && currentContent.trim().length > 0" class="external-ai-actions">
          <button
            class="talk-chatgpt-btn"
            @click="handleTalkInChatGPT"
            :disabled="personasLoading || !selectedPersona"
            :aria-label="`Open ChatGPT with this reflection and persona ${selectedPersona?.name ?? ''}`"
          >
            <!-- show persona name when selected -->
            <span v-if="selectedPersona">Talk to {{ selectedPersona.name }} in ChatGPT</span>
            <span v-else>Talk in ChatGPT</span>
          </button>
        </div>
      </template>

      <!-- Visual Mode -->
      <template v-else-if="currentMode === 'visual'">
        <div class="visual-compose">
          <ImageImport
            v-model="selectedImages"
            :multiple="true"
            @dimensions-loaded="handleDimensionsLoaded"
          />
          
          <div v-if="selectedImages && selectedImages.length > 0" class="visual-actions">
            <button
              class="btn-primary"
              @click="handleSaveVisual"
              :disabled="saving"
              :aria-label="saving ? 'Saving...' : 'Save visual reflection'"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>

          <div v-if="error" class="error-message" role="alert">
            {{ error }}
          </div>

          <p v-if="lastSaved" class="last-saved text-tertiary text-sm">
            Last saved: {{ lastSaved.toLocaleString() }}
          </p>
        </div>
      </template>

      <!-- Mixed Mode -->
      <template v-else-if="currentMode === 'mixed'">
        <div class="mixed-compose">
          <ReflectionEditor
            :initial-content="currentContent"
            :saving="saving"
            :generating-a-i="false"
            :error="error"
            :last-saved="null"
            @save="handleMixedContentUpdate"
          />

          <div class="mixed-divider">
            <span class="divider-text text-tertiary text-sm">Add Images</span>
          </div>

          <ImageImport
            v-model="selectedImages"
            :multiple="true"
            @dimensions-loaded="handleDimensionsLoaded"
          />
          
          <div v-if="canSaveMixed" class="mixed-actions">
            <button
              class="btn-primary"
              @click="handleSaveMixed"
              :disabled="saving || !canSaveMixed"
              :aria-label="saving ? 'Saving...' : 'Save mixed reflection'"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>

          <div v-if="error" class="error-message" role="alert">
            {{ error }}
          </div>

          <p v-if="lastSaved" class="last-saved text-tertiary text-sm">
            Last saved: {{ lastSaved.toLocaleString() }}
          </p>
        </div>
      </template>

    </div>

    <!-- External AI Dialog -->
    <ExternalAIDialog
      :open="showExternalDialog"
      v-model="externalSummary"
      @update:open="showExternalDialog = $event"
      @save="handleSaveExternalSummary"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ReflectionEditor from '../components/ReflectionEditor.vue';
import AIMirrorPanel from '../components/AIMirrorPanel.vue';
import ExternalAIDialog from '../components/ExternalAIDialog.vue';
import ImageImport from '../components/ImageImport.vue';
import { useReflections } from '../composables/useReflections.js';
import { useAIMirror } from '../composables/useAIMirror.js';
import { usePreferences } from '../composables/usePreferences.js';
import { usePersonas } from '../composables/usePersonas.js';

const { createReflection, updateReflectionAI, saveExternalAIResponse } = useReflections();
const { generateMirrorResponse, generating, error: aiError } = useAIMirror();
const { preferences, loadPreferences, isUsingLocalAI, isUsingOnlineAI, getPrivacyLevel } = usePreferences();
const { personas, selectedPersona, loadPersonas, generateChatGPTLink, loading: personasLoading } = usePersonas();

// Local state for external AI dialog
const showExternalDialog = ref(false);
const externalSummary = ref('');
// store last generated URL so we can persist it with the session
const lastGeneratedUrl = ref(null);

// Load preferences and personas on mount
onMounted(async () => {
  await loadPreferences();
  await loadPersonas();
});

const privacyStatus = computed(() => {
  if (!preferences.value) return { text: 'Loading...', icon: '⏳' };
  if (isUsingLocalAI()) return { text: 'Local processing only', icon: '🔒' };
  if (isUsingOnlineAI()) {
    const provider = preferences.value.onlineProvider === 'openai' ? 'OpenAI' : 'Anthropic';
    return { text: `Online AI active (${provider})`, icon: '🌐' };
  }
  return { text: 'Local processing only', icon: '🔒' };
});

/**
 * Check if mixed mode reflection can be saved
 * Mixed mode requires BOTH text content AND at least one image
 */
const canSaveMixed = computed(() => {
  const hasContent = currentContent.value && currentContent.value.trim().length > 0;
  const hasImages = selectedImages.value && selectedImages.value.length > 0;
  return hasContent && hasImages;
});

// Mode state
const currentMode = ref('text'); // 'text', 'visual', or 'mixed'

// Text mode state
const currentContent = ref('');
const currentReflectionId = ref(null);
const currentAIResponse = ref(null);

// Visual/mixed mode state
const selectedImages = ref(null);
const imageDimensions = ref(null);

// Common state
const saving = ref(false);
const error = ref(null);
const lastSaved = ref(null);

/**
 * Handle mode change
 */
const handleModeChange = () => {
  // Clear error when switching modes
  error.value = null;
  // Clear current reflection ID when switching modes
  currentReflectionId.value = null;
};

/**
 * Handle dimensions loaded from image
 */
const handleDimensionsLoaded = (dimensions) => {
  imageDimensions.value = dimensions;
};

/**
 * Save text reflection
 */
const handleSave = async (content) => {
  if (!content || content.trim().length === 0) return;

  saving.value = true;
  error.value = null;

  try {
    const reflection = await createReflection({
      mode: 'text',
      content: content,
    });

    currentReflectionId.value = reflection.id;
    currentContent.value = content;
    lastSaved.value = new Date();
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
  }
};

/**
 * Save visual reflection
 */
const handleSaveVisual = async () => {
  if (!selectedImages.value || selectedImages.value.length === 0) return;

  saving.value = true;
  error.value = null;

  try {
    const reflection = await createReflection({
      mode: 'visual',
      images: selectedImages.value,
      dimensions: imageDimensions.value,
    });

    currentReflectionId.value = reflection.id;
    lastSaved.value = new Date();
    
    // Clear the images after successful save
    selectedImages.value = null;
    imageDimensions.value = null;
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
  }
};

/**
 * Handle content update in mixed mode
 */
const handleMixedContentUpdate = (content) => {
  currentContent.value = content;
};

/**
 * Save mixed reflection
 */
const handleSaveMixed = async () => {
  // Mixed mode requires both text and images
  const hasContent = currentContent.value && currentContent.value.trim().length > 0;
  const hasImages = selectedImages.value && selectedImages.value.length > 0;
  
  if (!hasContent || !hasImages) {
    if (!hasContent && !hasImages) {
      error.value = 'Please add both text and images to save a mixed reflection';
    } else if (!hasContent) {
      error.value = 'Please add text content to save a mixed reflection';
    } else {
      error.value = 'Please add at least one image to save a mixed reflection';
    }
    return;
  }

  saving.value = true;
  error.value = null;

  try {
    const reflection = await createReflection({
      mode: 'mixed',
      content: currentContent.value,
      images: selectedImages.value || [],
      dimensions: imageDimensions.value,
    });

    currentReflectionId.value = reflection.id;
    lastSaved.value = new Date();
    
    // Clear after successful save
    currentContent.value = '';
    selectedImages.value = null;
    imageDimensions.value = null;
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
  }
};

/**
 * Request AI feedback
 */
const handleAIFeedback = async (content) => {
  if (!content || content.trim().length === 0) return;

  // Clear previous AI response
  currentAIResponse.value = null;
  error.value = null;

  try {
    const aiInteraction = await generateMirrorResponse(content);
    currentAIResponse.value = aiInteraction;

    // Update reflection with AI interaction if we have a saved reflection
    if (currentReflectionId.value) {
      updateReflectionAI(currentReflectionId.value, aiInteraction);
    }
  } catch (err) {
    error.value = err.message || aiError.value;
  }
};

// Open ChatGPT link in new tab for selected persona
const handleTalkInChatGPT = async () => {
  // Open a blank tab immediately to avoid popup blockers
  let newTab = null;
  try {
    newTab = window.open('about:blank', '_blank');
  } catch (openErr) {
    console.warn('Failed to open blank tab before async call', openErr);
    newTab = null;
  }

  try {
    const result = await generateChatGPTLink(currentContent.value, selectedPersona?.value?.id);
    if (result && result.chatGPTUrl) {
      lastGeneratedUrl.value = result.chatGPTUrl;
      // If we successfully opened a blank tab, navigate it to the generated URL.
      if (newTab) {
        try {
          newTab.location.href = result.chatGPTUrl;
        } catch (navErr) {
          // Some browsers disallow setting location on tabs opened cross-origin; fallback: open normally
          window.open(result.chatGPTUrl, '_blank');
        }
      }

      // After user returns, they'll paste summary into dialog; open dialog to collect it
      showExternalDialog.value = true;
      externalSummary.value = '';

      // Optionally store a draft external session with URL locally (we'll persist when user saves)
    } else {
      // Close blank tab if no URL returned
      if (newTab) newTab.close();
    }
  } catch (err) {
    console.error('Failed to open ChatGPT link', err);
    error.value = err.message;
    if (newTab) newTab.close();
  }
};

// Save pasted AI summary and attach to reflection
const handleSaveExternalSummary = async () => {
  if (!externalSummary.value || externalSummary.value.trim().length === 0) return;
  if (!currentReflectionId.value) {
    // If there's no saved reflection yet, create one first
    const created = await createReflection({ mode: 'text', content: currentContent.value });
    currentReflectionId.value = created.id;
  }

  const sessionData = {
    personaId: selectedPersona.value?.id,
    personaName: selectedPersona.value?.name,
    sessionSummary: externalSummary.value.trim(),
    chatGPTUrl: lastGeneratedUrl.value || null,
  };

  try {
    await saveExternalAIResponse(currentReflectionId.value, sessionData);
    showExternalDialog.value = false;
    externalSummary.value = '';
    lastGeneratedUrl.value = null;
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style scoped>
.compose-view {
  max-width: 900px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2xl);
  gap: var(--space-md);
  flex-wrap: wrap;
}

.view-header h2 {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.privacy-badge {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-surface) 100%);
  border-radius: var(--radius-full);
  color: var(--color-primary);
  border: 1.5px solid var(--color-success-border);
  box-shadow: var(--shadow-xs);
}

.privacy-icon {
  font-size: 1.125rem;
}

.privacy-text {
  font-weight: 600;
  letter-spacing: 0.01em;
}

.mode-selection {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
  padding: var(--space-sm);
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg) 100%);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.mode-option {
  flex: 1;
  display: flex;
  cursor: pointer;
  transition: transform var(--transition-base);
}

.mode-option:hover {
  transform: scale(1.02);
}

.mode-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.mode-label {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-xl);
  background-color: transparent;
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.mode-option input[type="radio"]:checked + .mode-label {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, white 100%);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.mode-option input[type="radio"]:focus-visible + .mode-label {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.mode-icon {
  font-size: 1.5rem;
}

.mode-name {
  font-weight: 600;
  font-size: var(--text-lg);
  color: var(--color-text);
}

.compose-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.visual-compose {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.mixed-compose {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.mixed-divider {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin: var(--space-md) 0;
}

.mixed-divider::before,
.mixed-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}

.divider-text {
  font-weight: 600;
  white-space: nowrap;
}

.mixed-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
}

.visual-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
}

.last-saved {
  text-align: right;
  margin-top: var(--space-sm);
}

.error-message {
  padding: var(--space-md) var(--space-lg);
  background: linear-gradient(135deg, var(--color-error-light) 0%, #fff5f5 100%);
  color: var(--color-error);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-error);
  box-shadow: var(--shadow-sm);
  font-weight: 500;
}

.external-ai-actions {
  margin-top: var(--space-lg);
}

.talk-chatgpt-btn {
  padding: var(--space-md) var(--space-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.talk-chatgpt-btn:hover:not(:disabled) {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.talk-chatgpt-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>
