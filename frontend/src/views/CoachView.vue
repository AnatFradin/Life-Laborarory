<template>
  <div class="coach-view">
    <header class="view-header">
      <h1 class="view-title">AI Coach</h1>
      <p class="view-description">
        Choose a coaching style and talk with ChatGPT using your existing ChatGPT Plus subscription. Your reflections will open in ChatGPT with pre-filled prompts tailored to each coach's perspective.
      </p>
    </header>

    <div v-if="loading" class="loading-state">
      <p>Loading coach personas...</p>
    </div>

    <div v-else-if="error" class="error-state" role="alert">
      <p>{{ error }}</p>
      <button @click="loadPersonas" class="retry-button" data-testid="retry-button">
        Try Again
      </button>
    </div>

    <div v-else class="coach-content" role="main">
      <!-- Coach Personas Grid -->
      <section class="personas-section">
        <h2 class="section-title">Choose Your Coach</h2>
        <p class="section-description">
          Each coach offers a unique perspective and approach to reflection. Select the one that resonates with you today.
        </p>

        <div v-if="personas.length === 0" class="empty-state">
          <p>No personas available</p>
        </div>

        <div v-else class="personas-grid" data-testid="personas-grid">
          <PersonaCard
            v-for="persona in personas"
            :key="persona.id"
            :persona="persona"
            :selected="selectedPersona?.id === persona.id"
            @select="handleSelectPersona"
            @view-prompt="handleViewPrompt"
          />
        </div>
      </section>

      <!-- Prompt View Dialog -->
      <PromptViewDialog
        :persona="promptViewPersona"
        :open="showPromptDialog"
        @update:open="showPromptDialog = $event"
        @close="closePromptDialog"
      />

      <!-- Privacy & Cost Information -->
      <section class="info-section">
        <h3 class="section-title">How It Works</h3>
        <div class="info-cards" data-testid="privacy-info">
          <div class="info-card">
            <div class="info-icon">💬</div>
            <div class="info-content">
              <h3>Uses Your ChatGPT Plus</h3>
              <p>
                This feature opens ChatGPT with a pre-filled prompt. You'll use your existing ChatGPT Plus subscription ($20/month) — no API fees from this app.
              </p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">🌐</div>
            <div class="info-content">
              <h3>Privacy: Data Goes to OpenAI</h3>
              <p>
                When you click "Talk in ChatGPT", your reflection text will be sent to OpenAI's ChatGPT service. This is different from our local-first approach — your data will leave your device and be handled per ChatGPT's privacy policy.
              </p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">🔄</div>
            <div class="info-content">
              <h3>Copy Back Insights</h3>
              <p>
                After ChatGPT responds, you can copy the key insights back into this app to save them with your reflection. This keeps your coaching session connected to your reflection history.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- How to Use Instructions -->
      <section class="instructions-section">
        <h3 class="section-title">Quick Start</h3>
        <ol class="instructions-list">
          <li>
            <strong>Write a reflection</strong> in the Compose tab
          </li>
          <li>
            <strong>Select a coach persona</strong> above that matches your needs
          </li>
          <li>
            <strong>Click "Talk to [Coach Name] in ChatGPT"</strong> button in Compose view
          </li>
          <li>
            <strong>ChatGPT opens</strong> in a new tab with your reflection pre-filled
          </li>
          <li>
            <strong>Copy insights</strong> from ChatGPT's response back to your reflection
          </li>
        </ol>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePersonas } from '../composables/usePersonas.js';
import { usePreferences } from '../composables/usePreferences.js';
import PersonaCard from '../components/PersonaCard.vue';
import PromptViewDialog from '../components/PromptViewDialog.vue';

const { personas, selectedPersona, loading, error, loadPersonas, selectPersona } = usePersonas();
const { preferences, updatePreferences } = usePreferences();

// Prompt view dialog state
const showPromptDialog = ref(false);
const promptViewPersona = ref(null);

/**
 * Handle persona selection
 */
const handleSelectPersona = async (personaId) => {
  selectPersona(personaId);
  
  // Save selected persona to preferences
  if (preferences.value) {
    await updatePreferences({
      selectedPersonaId: personaId,
    });
  }
};

/**
 * Handle view prompt request
 */
const handleViewPrompt = (persona) => {
  promptViewPersona.value = persona;
  showPromptDialog.value = true;
};

/**
 * Close prompt dialog
 */
const closePromptDialog = () => {
  showPromptDialog.value = false;
  promptViewPersona.value = null;
};

// Load personas on mount
onMounted(async () => {
  await loadPersonas();
  
  // If preferences have a selected persona, sync it
  if (preferences.value?.selectedPersonaId) {
    selectPersona(preferences.value.selectedPersonaId);
  }
});
</script>

<style scoped>
.coach-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.view-header {
  margin-bottom: 3rem;
  text-align: center;
}

.view-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
  margin-bottom: 1rem;
}

.view-description {
  font-size: 1.125rem;
  color: var(--color-text-secondary, #666666);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-state {
  color: var(--color-error, #d32f2f);
}

.empty-state {
  color: var(--color-text-secondary, #666666);
}

.retry-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary, #4A90E2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.retry-button:hover {
  background-color: var(--color-primary-hover, #3a7bc8);
  transform: translateY(-1px);
}

.retry-button:active {
  transform: translateY(0);
}
}

.retry-button:hover {
  background-color: var(--color-primary-hover, #357ABD);
}

.retry-button:focus-visible {
  outline: 3px solid var(--color-focus, #4A90E2);
  outline-offset: 2px;
}

.coach-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Personas Section */
.personas-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
  margin-bottom: 0.75rem;
}

.section-description {
  font-size: 1rem;
  color: var(--color-text-secondary, #666666);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.personas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .personas-grid {
    grid-template-columns: 1fr;
  }
}

/* Info Section */
.info-section {
  background-color: var(--color-bg-surface, #f9f9f9);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--color-border-light, #e0e0e0);
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.info-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid var(--color-border-light, #e0e0e0);
}

.info-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
}

.info-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
  margin: 0 0 0.5rem 0;
}

.info-content p {
  font-size: 0.9375rem;
  color: var(--color-text-secondary, #666666);
  line-height: 1.6;
  margin: 0;
}

/* Instructions Section */
.instructions-section {
  background-color: var(--color-bg-subtle, #ffffff);
  border-radius: 12px;
  padding: 2rem;
  border: 2px solid var(--color-primary-light, #E3F2FD);
}

.instructions-list {
  list-style: none;
  counter-reset: instruction-counter;
  padding: 0;
  margin-top: 1.5rem;
}

.instructions-list li {
  counter-increment: instruction-counter;
  position: relative;
  padding-left: 3rem;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-secondary, #666666);
}

.instructions-list li::before {
  content: counter(instruction-counter);
  position: absolute;
  left: 0;
  top: 0;
  width: 2rem;
  height: 2rem;
  background-color: var(--color-primary, #4A90E2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
}

.instructions-list li strong {
  color: var(--color-text-primary, #1a1a1a);
  font-weight: 600;
}

@media (max-width: 768px) {
  .view-title {
    font-size: 2rem;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>
