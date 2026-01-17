<template>
  <div class="reflection-list">
    <div v-if="reflections.length === 0" class="empty-state">
      <p class="text-secondary">No reflections yet. Start writing to begin your journey.</p>
    </div>

    <div v-else class="reflections-container" role="list" aria-label="Reflections">
      <template v-for="(reflection, index) in reflections" :key="reflection.id">
        <!-- Visual Reflection Card -->
        <VisualReflectionCard
          v-if="reflection.mode === 'visual'"
          :ref="el => setCardRef(el, index)"
          :reflection="reflection"
          role="listitem"
          :tabindex="index === focusedIndex ? 0 : -1"
          @click="$emit('select', reflection)"
          @keydown="handleKeyDown($event, index, reflection)"
          @delete="openDeleteDialog(reflection, $event)"
        />

        <!-- Text Reflection Card -->
        <article
          v-else
          :ref="el => setCardRef(el, index)"
          class="reflection-card"
          role="listitem"
          :tabindex="index === focusedIndex ? 0 : -1"
          :aria-label="`Reflection from ${formatTimestamp(reflection.timestamp)}`"
          @click="$emit('select', reflection)"
          @keydown="handleKeyDown($event, index, reflection)"
        >
          <div class="reflection-header">
            <div class="reflection-meta">
              <div class="reflection-type-icon" :title="getTypeLabel(reflection)" aria-hidden="true">
                {{ getTypeIcon(reflection) }}
              </div>
              <div class="reflection-info">
                <time class="reflection-time text-tertiary text-sm" :datetime="reflection.timestamp">
                  {{ formatTimestamp(reflection.timestamp) }}
                </time>
                <span v-if="reflection.mode" class="reflection-mode text-tertiary text-xs">
                  {{ reflection.mode }}
                </span>
              </div>
            </div>
            <button
              class="delete-button"
              @click="openDeleteDialog(reflection, $event)"
              @keydown.enter.stop="openDeleteDialog(reflection, $event)"
              aria-label="Delete this reflection"
              title="Delete"
            >
              <span aria-hidden="true">🗑️</span>
            </button>
          </div>

          <div class="reflection-content">
            <p class="reflection-text">{{ getFirstLines(reflection) }}</p>
          </div>

          <div v-if="reflection.aiInteraction || reflection.externalAISession" class="reflection-footer">
            <span v-if="reflection.aiInteraction" class="ai-badge">
              <span aria-hidden="true">💭</span>
              <span class="sr-only">Has AI reflection</span>
            </span>
            <span 
              v-if="reflection.externalAISession" 
              class="persona-badge" 
              :title="`External AI session with ${reflection.externalAISession.personaName}`"
              :aria-label="`External AI session with ${reflection.externalAISession.personaName}`"
            >
              <span aria-hidden="true">{{ getPersonaIcon(reflection.externalAISession.personaId) }}</span>
              <span class="persona-name">{{ reflection.externalAISession.personaName }}</span>
            </span>
          </div>
        </article>
      </template>
    </div>

    <!-- Delete Dialog -->
    <DeleteDialog
      :open="showDeleteDialog"
      :reflection-id="reflectionToDelete?.id"
      @delete="handleDelete"
      @update:open="showDeleteDialog = $event"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import DeleteDialog from './DeleteDialog.vue';
import VisualReflectionCard from './VisualReflectionCard.vue';

const props = defineProps({
  reflections: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['select', 'delete']);

// Keyboard navigation state
const focusedIndex = ref(0);
const cardRefs = ref([]);

/**
 * Store card element references
 */
const setCardRef = (el, index) => {
  if (el) {
    cardRefs.value[index] = el;
  }
};

// Delete dialog state
const showDeleteDialog = ref(false);
const reflectionToDelete = ref(null);

/**
 * Open delete confirmation dialog
 */
const openDeleteDialog = (reflection, event) => {
  // Stop propagation to prevent card selection
  event.stopPropagation();
  
  reflectionToDelete.value = reflection;
  showDeleteDialog.value = true;
};

/**
 * Handle keyboard navigation
 */
const handleKeyDown = (event, index, reflection) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      focusNextCard(1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusNextCard(-1);
      break;
    case 'Enter':
      event.preventDefault();
      emit('select', reflection);
      break;
    case 'Home':
      event.preventDefault();
      focusCard(0);
      break;
    case 'End':
      event.preventDefault();
      focusCard(props.reflections.length - 1);
      break;
  }
};

/**
 * Focus the next/previous card
 */
const focusNextCard = (direction) => {
  const newIndex = focusedIndex.value + direction;
  if (newIndex >= 0 && newIndex < props.reflections.length) {
    focusCard(newIndex);
  }
};

/**
 * Focus a specific card by index
 */
const focusCard = (index) => {
  focusedIndex.value = index;
  const card = cardRefs.value[index];
  if (card) {
    card.focus();
  }
};

/**
 * Handle delete confirmation
 */
const handleDelete = () => {
  if (reflectionToDelete.value) {
    // Emit delete event to parent (HistoryView handles the async API call)
    emit('delete', reflectionToDelete.value.id);
    
    // Close dialog and reset state
    showDeleteDialog.value = false;
    reflectionToDelete.value = null;
  }
};

// Format timestamp to human-readable
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get first 3 lines of text (optimized preview)
const getFirstLines = (reflection) => {
  if (reflection.mode === 'text' && reflection.content) {
    const text = reflection.content.trim();
    // Return full text - CSS line-clamp will handle truncation
    return text;
  }
  if (reflection.mode === 'visual' && reflection.visualAttachment) {
    return reflection.visualAttachment.originalFilename;
  }
  return 'Empty reflection';
};

// Get type icon for reflection
const getTypeIcon = (reflection) => {
  // Mixed mode (if it has both content and visual) - check first
  if (reflection.content && reflection.visualAttachment) {
    return '📋';
  }
  if (reflection.mode === 'visual') {
    return '📷';
  }
  if (reflection.mode === 'text') {
    return '📝';
  }
  return '📄';
};

// Get type label for reflection
const getTypeLabel = (reflection) => {
  // Mixed mode (if it has both content and visual) - check first
  if (reflection.content && reflection.visualAttachment) {
    return 'Mixed reflection';
  }
  if (reflection.mode === 'visual') {
    return 'Visual reflection';
  }
  if (reflection.mode === 'text') {
    return 'Text reflection';
  }
  return 'Reflection';
};

// Add helper to get persona icon
const getPersonaIcon = (personaId) => {
  // Basic mapping; prefer emoji in persona definitions
  const mapping = {
    'stoic-coach': '🏛️',
    'franklin': '📜',
    'compassionate': '💝',
    'socratic': '❓',
    'growth-mindset': '🌱',
    'mindfulness-guide': '🧘',
  };
  return mapping[personaId] || '🧑‍🏫';
};
</script>

<style scoped>
.reflection-list {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: var(--space-xl);
}

.reflections-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.reflection-card {
  background: linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-secondary) 100%);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  /* Performance optimizations */
  will-change: transform;
  contain: layout style paint;
}

.reflection-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.reflection-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.reflection-card:hover::before {
  opacity: 1;
}

.reflection-card:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.reflection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
  gap: var(--space-md);
}

.reflection-meta {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  flex: 1;
}

.reflection-type-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  line-height: 1;
}

.reflection-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  flex: 1;
}

.reflection-time {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.delete-button {
  background: transparent;
  border: 1.5px solid var(--color-border);
  padding: var(--space-sm) var(--space-md);
  font-size: 1.125rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.delete-button:hover {
  background: var(--color-danger-surface);
  border-color: var(--color-danger-border);
  color: var(--color-danger);
  transform: scale(1.05);
  box-shadow: var(--shadow-xs);
}

.delete-button:focus-visible {
  outline: 2px solid var(--color-danger);
  outline-offset: 2px;
}

.delete-button:active {
  transform: scale(0.95);
}

.reflection-mode {
  text-transform: capitalize;
  background-color: var(--color-bg-secondary);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  border: 1px solid var(--color-border);
}

.reflection-content {
  margin-bottom: var(--space-md);
}

.reflection-text {
  color: var(--color-text);
  line-height: 1.4;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: var(--text-2xs);
  max-height: 4.2em; /* 3 lines with 1.4 line-height: 1.4 * 3 = 4.2em */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.reflection-footer {
  display: flex;
  align-items: center;
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
  gap: var(--space-sm);
}

.ai-badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding: var(--space-xs) var(--space-sm);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  font-weight: 500;
}

.persona-badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-surface) 100%);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: 600;
  border: 1.5px solid var(--color-success-border);
  box-shadow: var(--shadow-xs);
}

.persona-badge span[aria-hidden] {
  font-size: 1rem;
}

.persona-name {
  font-weight: 600;
}
</style>
