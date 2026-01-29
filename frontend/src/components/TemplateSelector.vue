<template>
  <div class="template-selector">
    <label class="template-label">
      <span class="label-text">Start from template</span>
      <select
        v-model="selectedTemplateId"
        @change="handleTemplateSelect"
        class="template-select"
        :disabled="loading || templates.length === 0"
        aria-label="Select a reflection template"
      >
        <option value="">{{ loading ? 'Loading templates...' : 'Blank reflection' }}</option>
        <option
          v-for="template in templates"
          :key="template.id"
          :value="template.id"
        >
          {{ template.name }}
        </option>
      </select>
    </label>

    <button
      v-if="selectedTemplateId"
      type="button"
      class="clear-template-btn"
      @click="clearTemplate"
      aria-label="Clear selected template"
      title="Clear template"
    >
      ×
    </button>

    <div v-if="error" class="error-message" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTemplates } from '../composables/useTemplates.js';

const emit = defineEmits(['template-selected', 'template-cleared']);

const { templates, loading, error } = useTemplates();
const selectedTemplateId = ref('');

/**
 * Handle template selection
 */
async function handleTemplateSelect() {
  if (!selectedTemplateId.value) {
    emit('template-cleared');
    return;
  }

  const template = templates.value.find(t => t.id === selectedTemplateId.value);
  if (template) {
    emit('template-selected', template);
  }
}

/**
 * Clear selected template
 */
function clearTemplate() {
  selectedTemplateId.value = '';
  emit('template-cleared');
}

// Watch for external changes to reset selection
watch(() => templates.value, () => {
  // If current selection is no longer valid, clear it
  if (selectedTemplateId.value && !templates.value.find(t => t.id === selectedTemplateId.value)) {
    clearTemplate();
  }
});
</script>

<style scoped>
.template-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.template-label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary, #524e47);
}

.template-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border, #e5e1d9);
  border-radius: 0.5rem;
  background: var(--color-bg-elevated, #ffffff);
  color: var(--color-text, #1a1816);
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s;
}

.template-select:hover:not(:disabled) {
  border-color: var(--color-border-strong, #d4cfc3);
}

.template-select:focus {
  outline: none;
  border-color: var(--color-primary, #2d5a3d);
  box-shadow: 0 0 0 3px var(--color-focus-ring, rgba(45, 90, 61, 0.15));
}

.template-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-template-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-border, #e5e1d9);
  border-radius: 0.375rem;
  background: var(--color-bg-elevated, #ffffff);
  color: var(--color-text-secondary, #524e47);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-template-btn:hover {
  background: var(--color-bg-hover, #f0ede5);
  border-color: var(--color-border-strong, #d4cfc3);
  color: var(--color-text, #1a1816);
}

.error-message {
  padding: 0.5rem 0.75rem;
  background: var(--color-error-light, #fef1f1);
  color: var(--color-error, #a63232);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}
</style>
