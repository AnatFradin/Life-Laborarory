<template>
  <article
    class="visual-reflection-card"
    role="listitem"
    :tabindex="tabindex"
    :aria-label="`${isMixed ? 'Mixed' : 'Visual'} reflection from ${formatTimestamp(reflection.timestamp)}`"
    @click="$emit('select', reflection)"
    @keydown="$emit('keydown', $event)"
  >
    <div class="reflection-header">
      <div class="reflection-meta">
        <time class="reflection-time text-tertiary text-sm" :datetime="reflection.timestamp">
          {{ formatTimestamp(reflection.timestamp) }}
        </time>
        <span class="reflection-mode text-tertiary text-xs">
          {{ isMixed ? 'mixed' : 'visual' }}
        </span>
      </div>
      <div class="action-buttons">
        <button
          class="export-button"
          @click="handleExport"
          @keydown.enter.stop="handleExport"
          aria-label="Export this reflection"
          title="Export"
        >
          <span aria-hidden="true">📤</span>
        </button>
        <button
          class="delete-button"
          @click="handleDelete"
          @keydown.enter.stop="handleDelete"
          aria-label="Delete this reflection"
          title="Delete"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>
    </div>

    <!-- Text content for mixed mode -->
    <div v-if="isMixed && reflection.content" class="text-content">
      <p class="reflection-text">{{ getFirstLines(reflection.content) }}</p>
    </div>

    <div class="visual-content">
      <!-- Multiple images -->
      <div v-if="hasMultipleImages" class="image-grid">
        <div
          v-for="(attachment, index) in visualAttachments.slice(0, 4)"
          :key="index"
          class="grid-image-wrapper"
        >
          <img
            v-if="!isPDFAttachment(attachment)"
            :src="getImageUrl(attachment)"
            :alt="attachment.originalFilename"
            class="grid-image"
            loading="lazy"
            @error="handleImageError"
          />
          <div v-else class="pdf-preview-small">
            <span class="pdf-icon-small" aria-hidden="true">📄</span>
          </div>
        </div>
        <div v-if="visualAttachments.length > 4" class="more-images">
          +{{ visualAttachments.length - 4 }} more
        </div>
      </div>

      <!-- Single image -->
      <div v-else-if="visualAttachments.length === 1" class="single-image">
        <!-- PDF Preview -->
        <div v-if="isPDFAttachment(visualAttachments[0])" class="pdf-preview-card">
          <span class="pdf-icon" aria-hidden="true">📄</span>
          <span class="pdf-label text-sm text-tertiary">{{ visualAttachments[0].originalFilename }}</span>
        </div>
        <!-- Image Preview -->
        <div v-else class="image-preview-compact">
          <img
            :src="getImageUrl(visualAttachments[0])"
            :alt="visualAttachments[0].originalFilename"
            class="visual-image-thumbnail"
            loading="lazy"
            @error="handleImageError"
          />
          <div class="image-info">
            <span class="image-filename text-sm">
              {{ visualAttachments[0].originalFilename }}
            </span>
            <span v-if="visualAttachments[0].dimensions" class="image-dimensions text-xs text-tertiary">
              {{ visualAttachments[0].dimensions.width }}×{{ visualAttachments[0].dimensions.height }}
            </span>
          </div>
        </div>
      </div>
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

<script setup>
import { computed, ref } from 'vue';
import { getVisualUrl } from '../utils/url.js';

const props = defineProps({
  reflection: {
    type: Object,
    required: true,
  },
  tabindex: {
    type: Number,
    default: -1,
  },
});

const emit = defineEmits(['select', 'delete', 'export', 'keydown']);

const imageError = ref(false);

/**
 * Check if reflection is mixed mode (explicit mode only)
 */
const isMixed = computed(() => {
  return props.reflection.mode === 'mixed';
});

/**
 * Get all visual attachments (support both single and array)
 */
const visualAttachments = computed(() => {
  if (props.reflection.visualAttachments && Array.isArray(props.reflection.visualAttachments)) {
    return props.reflection.visualAttachments;
  }
  if (props.reflection.visualAttachment) {
    return [props.reflection.visualAttachment];
  }
  return [];
});

/**
 * Check if there are multiple images
 */
const hasMultipleImages = computed(() => {
  return visualAttachments.value.length > 1;
});

/**
 * Check if attachment is a PDF
 */
const isPDFAttachment = (attachment) => {
  return attachment?.mimeType === 'application/pdf';
};

/**
 * Get image URL from attachment
 */
const getImageUrl = (attachment) => {
  if (!attachment || !attachment.storedPath) return '';
  return getVisualUrl(attachment.storedPath);
};

/**
 * Get first lines of text content
 */
const getFirstLines = (content) => {
  if (!content) return '';
  const text = content.trim();
  const lines = text.split('\n').slice(0, 3);
  return lines.join('\n');
};

/**
 * Handle delete button click
 */
const handleDelete = (event) => {
  event.stopPropagation();
  emit('delete', props.reflection.id);
};

/**
 * Handle image load error
 */
const handleImageError = () => {
  imageError.value = true;
};

/**
 * Format timestamp to human-readable
 */
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

/**
 * Get persona icon emoji
 */
const getPersonaIcon = (personaId) => {
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

/**
 * Handle export button click
 */
const handleExport = (event) => {
  event.stopPropagation();
  emit('export', props.reflection, event);
};
</script>

<style scoped>
.visual-reflection-card {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  /* Performance optimizations */
  will-change: transform;
  contain: layout style paint;
}

.visual-reflection-card:hover {
  border-color: var(--color-primary);
}

.visual-reflection-card:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 2px var(--color-primary-light);
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
  flex-direction: column;
  gap: var(--space-xs);
  flex: 1;
}

.reflection-time {
  font-weight: 500;
}

.reflection-mode {
  text-transform: capitalize;
  background-color: var(--color-bg-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  width: fit-content;
}

.action-buttons {
  display: flex;
  gap: var(--space-xs);
  flex-shrink: 0;
}

.export-button,
.delete-button {
  background: transparent;
  border: 1px solid var(--color-border);
  padding: var(--space-xs) var(--space-sm);
  font-size: 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all 0.15s ease;
}

.export-button:hover {
  background: var(--color-primary-surface);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: scale(1.05);
}

.export-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.export-button:active {
  transform: scale(0.95);
}

.delete-button:hover {
  background: var(--color-danger-surface);
  border-color: var(--color-danger-light);
  color: var(--color-danger);
  transform: scale(1.05);
}

.delete-button:focus-visible {
  outline: 2px solid var(--color-danger);
  outline-offset: 2px;
}

.delete-button:active {
  transform: scale(0.98);
}

.visual-content {
  margin-bottom: var(--space-sm);
}

.text-content {
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.reflection-text {
  color: var(--color-text);
  line-height: 1.4;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: var(--text-2xs);
  max-height: 4.2em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
  position: relative;
}

.grid-image-wrapper {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-bg-secondary);
}

.grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pdf-preview-small {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
}

.pdf-icon-small {
  font-size: 2rem;
  opacity: 0.6;
}

.more-images {
  position: absolute;
  bottom: var(--space-sm);
  right: var(--space-sm);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: 600;
}

.single-image {
  width: 100%;
}

.image-preview-compact {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.pdf-preview-card {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.pdf-icon {
  font-size: 2rem;
  opacity: 0.8;
  flex-shrink: 0;
}

.pdf-label {
  font-weight: 500;
  word-break: break-all;
}

.visual-image-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  flex-shrink: 0;
  /* Performance optimization */
  will-change: transform;
}

.visual-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  display: block;
}

.image-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  flex: 1;
  min-width: 0; /* Allow text truncation */
}

.image-filename {
  color: var(--color-text);
  font-weight: 500;
  word-break: break-all;
  font-size: var(--text-2xs);
}

.image-dimensions {
  font-family: var(--font-mono, 'Monaco', 'Courier New', monospace);
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

.persona-badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background-color: var(--color-primary-light);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  color: var(--color-primary);
  margin-left: var(--space-sm);
}

.persona-badge span[aria-hidden] {
  font-size: 1rem;
}

.persona-name {
  font-weight: 500;
}
</style>
