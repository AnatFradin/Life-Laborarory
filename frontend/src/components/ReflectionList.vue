<template>
  <div class="reflection-list">
    <div v-if="reflections.length === 0" class="empty-state">
      <p class="text-secondary">No reflections yet. Start writing to begin your journey.</p>
    </div>

    <div v-else class="reflections-container">
      <article
        v-for="reflection in reflections"
        :key="reflection.id"
        class="reflection-card"
        :tabindex="0"
        @click="$emit('select', reflection)"
        @keydown.enter="$emit('select', reflection)"
      >
        <div class="reflection-header">
          <time class="reflection-time text-tertiary text-sm" :datetime="reflection.timestamp">
            {{ formatTimestamp(reflection.timestamp) }}
          </time>
          <span v-if="reflection.mode" class="reflection-mode text-tertiary text-xs">
            {{ reflection.mode }}
          </span>
        </div>

        <div class="reflection-content">
          <p class="reflection-text">{{ getPreview(reflection) }}</p>
        </div>

        <div v-if="reflection.aiInteraction" class="reflection-footer">
          <span class="ai-badge">
            <span aria-hidden="true">💭</span>
            <span class="sr-only">Has AI reflection</span>
          </span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  reflections: {
    type: Array,
    required: true,
  },
});

defineEmits(['select']);

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

// Get preview text (first 150 characters)
const getPreview = (reflection) => {
  if (reflection.mode === 'text' && reflection.content) {
    const text = reflection.content.trim();
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }
  if (reflection.mode === 'visual' && reflection.visualAttachment) {
    return `📷 ${reflection.visualAttachment.originalFilename}`;
  }
  return 'Empty reflection';
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
  gap: var(--space-md);
}

.reflection-card {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.reflection-card:hover {
  border-color: var(--color-primary);
}

.reflection-card:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.reflection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.reflection-time {
  font-weight: 500;
}

.reflection-mode {
  text-transform: capitalize;
  background-color: var(--color-bg-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
}

.reflection-content {
  margin-bottom: var(--space-sm);
}

.reflection-text {
  color: var(--color-text);
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.reflection-footer {
  display: flex;
  align-items: center;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border);
}

.ai-badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
</style>
