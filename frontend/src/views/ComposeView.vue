<template>
  <div class="compose-view">
    <header class="view-header">
      <h2>Compose</h2>
      <div class="privacy-badge">
        <span class="privacy-icon" aria-hidden="true">🔒</span>
        <span class="privacy-text text-sm">Local processing only</span>
      </div>
    </header>

    <div class="compose-content">
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ReflectionEditor from '../components/ReflectionEditor.vue';
import AIMirrorPanel from '../components/AIMirrorPanel.vue';
import { useReflections } from '../composables/useReflections.js';
import { useAIMirror } from '../composables/useAIMirror.js';

const { createReflection, updateReflectionAI } = useReflections();
const { generateMirrorResponse, generating, error: aiError } = useAIMirror();

const currentContent = ref('');
const currentReflectionId = ref(null);
const currentAIResponse = ref(null);
const saving = ref(false);
const error = ref(null);
const lastSaved = ref(null);

/**
 * Save reflection
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

.compose-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}
</style>
