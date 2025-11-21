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
            v-model="selectedImage"
            @dimensions-loaded="handleDimensionsLoaded"
          />
          
          <div v-if="selectedImage" class="visual-actions">
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

// Mode state
const currentMode = ref('text'); // 'text' or 'visual'

// Text mode state
const currentContent = ref('');
const currentReflectionId = ref(null);
const currentAIResponse = ref(null);

// Visual mode state
const selectedImage = ref(null);
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
  if (!selectedImage.value) return;

  saving.value = true;
  error.value = null;

  try {
    // TODO: Implement visual reflection save in T095
    // This will use FormData to upload the image
    console.log('Saving visual reflection:', {
      file: selectedImage.value,
      dimensions: imageDimensions.value,
    });

    // Placeholder success
    lastSaved.value = new Date();
    
    // Clear the image after successful save
    selectedImage.value = null;
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
  margin-bottom: var(--space-lg);
}

.view-header h2 {
  margin: 0;
}

.privacy-badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  background-color: var(--color-primary-light);
  border-radius: var(--radius-md);
  color: var(--color-primary);
}

.privacy-icon {
  font-size: 1rem;
}

.privacy-text {
  font-weight: 500;
}

.mode-selection {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  padding: var(--space-sm);
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-md);
}

.mode-option {
  flex: 1;
  display: flex;
  cursor: pointer;
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
  padding: var(--space-md) var(--space-lg);
  background-color: transparent;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  transition: all 0.15s ease;
}

.mode-option input[type="radio"]:checked + .mode-label {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary);
}

.mode-option input[type="radio"]:focus-visible + .mode-label {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.mode-icon {
  font-size: 1.25rem;
}

.mode-name {
  font-weight: 500;
  color: var(--color-text);
}

.compose-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.visual-compose {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
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
  padding: var(--space-md);
  background-color: var(--color-error-light);
  color: var(--color-error);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-error);
}

.external-ai-actions {
  margin-top: var(--space-md);
}
.talk-chatgpt-btn {
  padding: 0.75rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.talk-chatgpt-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
