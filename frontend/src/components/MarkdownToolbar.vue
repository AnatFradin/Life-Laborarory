<template>
  <div class="markdown-toolbar" role="toolbar" aria-label="Markdown formatting toolbar">
    <!-- Bold -->
    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.bold"
      :title="`${labels.bold} (Cmd/Ctrl+B)`"
      @click="$emit('format', 'bold')"
    >
      <strong>B</strong>
    </button>

    <!-- Italic -->
    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.italic"
      :title="`${labels.italic} (Cmd/Ctrl+I)`"
      @click="$emit('format', 'italic')"
    >
      <em>I</em>
    </button>

    <span class="toolbar-divider"></span>

    <!-- Headings -->
    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.h1"
      :title="labels.h1"
      @click="$emit('format', 'h1')"
    >
      H1
    </button>

    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.h2"
      :title="labels.h2"
      @click="$emit('format', 'h2')"
    >
      H2
    </button>

    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.h3"
      :title="labels.h3"
      @click="$emit('format', 'h3')"
    >
      H3
    </button>

    <span class="toolbar-divider"></span>

    <!-- Lists -->
    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.list"
      :title="labels.list"
      @click="$emit('format', 'list')"
    >
      •  List
    </button>

    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.orderedList"
      :title="labels.orderedList"
      @click="$emit('format', 'orderedList')"
    >
      1. List
    </button>

    <span class="toolbar-divider"></span>

    <!-- Link -->
    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.link"
      :title="`${labels.link} (Cmd/Ctrl+K)`"
      @click="$emit('format', 'link')"
    >
      🔗 Link
    </button>

    <!-- Blockquote -->
    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.blockquote"
      :title="labels.blockquote"
      @click="$emit('format', 'blockquote')"
    >
      " Quote
    </button>

    <!-- Code -->
    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.code"
      :title="labels.code"
      @click="$emit('format', 'code')"
    >
      &lt;/&gt; Code
    </button>

    <span class="toolbar-divider"></span>

    <!-- Rephrase (AI) -->
    <button
      type="button"
      class="toolbar-button"
      :aria-label="labels.rephrase"
      :title="labels.rephrase"
      :disabled="!hasSelection"
      @click="$emit('rephrase')"
      data-test="rephrase-button"
    >
      ✨ Rephrase
    </button>
  </div>
</template>

<script setup>
import { useMarkdownToolbar } from '@/composables/useMarkdownToolbar'

defineProps({
  hasSelection: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['format', 'rephrase'])

const { getButtonLabels } = useMarkdownToolbar()
const labels = getButtonLabels()
</script>

<style scoped>
.markdown-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  background-color: var(--color-bg-secondary, #f5f7fa);
  border: 1px solid var(--color-border, #e0e5eb);
  border-radius: 4px;
  flex-wrap: wrap;
}

.toolbar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 28px;
  padding: 4px 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-secondary, #5a6c7d);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  transition: all 150ms ease;
  white-space: nowrap;
}

.toolbar-button:hover {
  background-color: rgba(90, 108, 125, 0.08);
  border-color: var(--color-border, #e0e5eb);
}

.toolbar-button:active {
  background-color: rgba(90, 108, 125, 0.12);
}

.toolbar-button:focus {
  outline: 2px solid var(--color-primary, #5a6c7d);
  outline-offset: 1px;
}

.toolbar-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar-button strong,
.toolbar-button em {
  font-style: normal;
  font-weight: 600;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background-color: var(--color-border, #e0e5eb);
  margin: 0 4px;
}

/* Special styling for Rephrase button */
.toolbar-button[data-test="rephrase-button"]:not(:disabled) {
  color: #7c3aed;
  font-weight: 600;
  background-color: rgba(124, 58, 237, 0.08);
  border-color: rgba(124, 58, 237, 0.2);
}

.toolbar-button[data-test="rephrase-button"]:not(:disabled):hover {
  background-color: rgba(124, 58, 237, 0.15);
  border-color: rgba(124, 58, 237, 0.3);
}

.toolbar-button[data-test="rephrase-button"]:disabled {
  opacity: 0.3;
}
</style>
