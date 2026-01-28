<template>
  <div
    :class="['persona-card', { 'persona-card--selected': props.selected }]"
    :style="{ '--persona-color': persona.color }"
    data-testid="persona-card"
    role="button"
    :tabindex="0"
    :aria-pressed="props.selected ? 'true' : 'false'"
    :aria-label="`${persona.name} - ${persona.style}. ${persona.description}. ${props.selected ? 'Currently selected' : 'Press Space or Enter to select'}`"
    @click="handleSelect"
    @keydown.space.prevent="handleSelect"
    @keydown.enter.prevent="handleSelect"
  >
    <div class="persona-card__icon">{{ persona.icon }}</div>
    
    <div class="persona-card__content">
      <h3 class="persona-card__name">{{ persona.name }}</h3>
      <p class="persona-card__style">{{ persona.style }}</p>
      <p class="persona-card__description">{{ persona.description }}</p>
      
      <div class="persona-card__tags" v-if="persona.tags && persona.tags.length > 0">
        <span 
          v-for="tag in persona.tags" 
          :key="tag" 
          class="persona-card__tag"
        >
          {{ tag }}
        </span>
      </div>

      <div class="persona-card__buttons" @click.stop @mousedown.stop>
        <button
          type="button"
          @click.stop.prevent="handleSelectPrompt"
          @mousedown.stop
          class="persona-card__select-prompt-btn"
          data-testid="select-prompt-button"
          :aria-label="`Select prompt for ${persona.name}`"
        >
          📝 Select Prompt
        </button>
        <button
          type="button"
          @click.stop.prevent="handleViewPrompt"
          @mousedown.stop
          class="persona-card__view-prompt-btn"
          data-testid="view-prompt-button"
          :aria-label="`View coaching prompt for ${persona.name}`"
        >
          👁️ View Default
        </button>
      </div>
    </div>

    <div class="persona-card__check" v-if="props.selected" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  persona: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['select', 'view-prompt', 'select-prompt']);

function handleSelect() {
  emit('select', props.persona.id);
}

function handleViewPrompt() {
  emit('view-prompt', props.persona);
}

function handleSelectPrompt() {
  emit('select-prompt', props.persona);
}
</script>

<style scoped>
.persona-card {
  position: relative;
  display: flex;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border: 2px solid var(--color-border-light, #e0e0e0);
  border-radius: 8px;
  background: var(--color-bg-surface, #ffffff);
  cursor: pointer;
  transition: all 0.2s ease;
}

.persona-card:hover {
  border-color: var(--persona-color, #8B7355);
  background: var(--color-bg-hover, #f9f9f9);
}

.persona-card:focus {
  outline: 3px solid var(--color-focus, #4A90E2);
  outline-offset: 2px;
  border-color: var(--persona-color, #8B7355);
}

.persona-card--selected {
  border-color: var(--persona-color, #8B7355);
  border-width: 3px;
  background: var(--color-bg-selected, #f5f5f5);
}

.persona-card__icon {
  font-size: 2.2rem;
  line-height: 1;
  flex-shrink: 0;
}

.persona-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.persona-card__name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
}

.persona-card__style {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--persona-color, #8B7355);
}

.persona-card__description {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-secondary, #666666);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.persona-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.persona-card__tag {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  background: var(--color-bg-tag, #f0f0f0);
  color: var(--color-text-tertiary, #888888);
  border-radius: 12px;
}

.persona-card__buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}

.persona-card__select-prompt-btn,
.persona-card__view-prompt-btn {
  flex: 1;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-bg-surface, #f9f9f9);
  border: 1px solid var(--persona-color, #8B7355);
  color: var(--persona-color, #8B7355);
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  pointer-events: auto;
}

.persona-card__select-prompt-btn:hover,
.persona-card__view-prompt-btn:hover {
  background-color: var(--persona-color, #8B7355);
  color: white;
}

.persona-card__select-prompt-btn:focus-visible,
.persona-card__view-prompt-btn:focus-visible {
  outline: 2px solid var(--color-focus, #4A90E2);
  outline-offset: 2px;
}

.persona-card__check {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: var(--persona-color, #8B7355);
}

/* Ensure proper spacing in grid layouts */
@media (min-width: 768px) {
  .persona-card {
    min-height: 150px;
  }
}
</style>
