<template>
  <div v-if="aiResponse" class="ai-mirror-panel" role="region" aria-label="AI Mirror Response">
    <div class="panel-header">
      <h3 class="panel-title">Reflection</h3>
      <span class="panel-subtitle text-tertiary text-sm">
        From your AI companion
      </span>
    </div>

    <div class="panel-content" aria-live="polite">
      <p class="mirror-response">{{ aiResponse.response }}</p>
    </div>

    <div class="panel-footer text-tertiary text-xs">
      <span>{{ aiResponse.provider }} • {{ aiResponse.model }}</span>
      <span>{{ formatTimestamp(aiResponse.timestamp) }}</span>
    </div>
  </div>

  <div v-else-if="loading" class="ai-mirror-panel loading" role="status" aria-live="polite">
    <div class="panel-content">
      <div class="loading-indicator">
        <span class="loading-text">Reflecting...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  aiResponse: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Format timestamp to human-readable
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / 60000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};
</script>

<style scoped>
.ai-mirror-panel {
  background-color: var(--color-primary-light);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.ai-mirror-panel.loading {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-border);
}

.panel-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.panel-subtitle {
  display: block;
}

.panel-content {
  flex: 1;
}

.mirror-response {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text);
  margin: 0;
  white-space: pre-wrap;
}

.panel-footer {
  display: flex;
  justify-content: space-between;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border);
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
}

.loading-text {
  font-size: 1rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

/* Gentle pulse for loading state - very subtle */
.loading-indicator {
  animation: gentle-pulse 2s ease-in-out infinite;
}

@keyframes gentle-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
