<template>
  <aside class="formatting-guide" :class="{ 'visible': isVisible }">
    <div class="guide-header">
      <h3 class="guide-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="4 7 4 4 20 4 20 7"></polyline>
          <line x1="9" x2="15" y1="20" y2="20"></line>
          <line x1="12" x2="12" y1="4" y2="20"></line>
        </svg>
        Formatting
      </h3>
      <button 
        class="close-button"
        @click="$emit('close')"
        aria-label="Close formatting guide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>

    <div class="guide-content">
      <!-- Markdown Toolbar Section -->
      <section class="toolbar-section">
        <div class="toolbar-grid">
          <button class="toolbar-btn" title="Bold (⌘+B)">
            <strong>B</strong>
          </button>
          <button class="toolbar-btn" title="Italic (⌘+I)">
            <em>I</em>
          </button>
          <button class="toolbar-btn" title="Heading 1">
            H1
          </button>
          <button class="toolbar-btn" title="Heading 2">
            H2
          </button>
          <button class="toolbar-btn" title="Heading 3">
            H3
          </button>
          <button class="toolbar-btn" title="Bulleted List">
            • List
          </button>
          <button class="toolbar-btn" title="Numbered List">
            1. List
          </button>
          <button class="toolbar-btn" title="Link (⌘+K)">
            🔗
          </button>
          <button class="toolbar-btn" title="Quote">
            " "
          </button>
          <button class="toolbar-btn" title="Code">
            &lt;/&gt;
          </button>
        </div>
      </section>

      <!-- BASIC Section -->
      <section class="guide-section">
        <h4 class="section-title">BASIC</h4>
        <div class="format-item">
          <span class="format-label">Bold</span>
          <code class="format-syntax">**text**</code>
        </div>
        <div class="format-item">
          <span class="format-label">Italic</span>
          <code class="format-syntax">*text*</code>
        </div>
        <div class="format-item">
          <span class="format-label">Heading</span>
          <code class="format-syntax"># Title</code>
        </div>
      </section>

      <!-- LISTS Section -->
      <section class="guide-section">
        <h4 class="section-title">LISTS</h4>
        <div class="format-item">
          <span class="format-label">Bulleted</span>
          <code class="format-syntax">- item</code>
        </div>
        <div class="format-item">
          <span class="format-label">Numbered</span>
          <code class="format-syntax">1. item</code>
        </div>
        <div class="format-item">
          <span class="format-label">Task</span>
          <code class="format-syntax">[ ] item</code>
        </div>
      </section>

      <!-- ADVANCED Section -->
      <section class="guide-section">
        <h4 class="section-title">ADVANCED</h4>
        <div class="format-item">
          <span class="format-label">Quote</span>
          <code class="format-syntax">> text</code>
        </div>
        <div class="format-item">
          <span class="format-label">Link</span>
          <code class="format-syntax">[name](url)</code>
        </div>
        <div class="format-item">
          <span class="format-label">Code</span>
          <code class="format-syntax">`code`</code>
        </div>
      </section>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  isVisible: {
    type: Boolean,
    default: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.formatting-guide {
  height: 100vh;
  width: 240px;
  background: var(--color-bg-secondary);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  overflow-y: auto;
  position: sticky;
  top: 0;
}

.formatting-guide:not(.visible) {
  transform: translateX(100%);
}

/* Header */
.guide-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.guide-title {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.guide-title svg {
  color: var(--color-accent-purple);
  width: 14px;
  height: 14px;
}

.close-button {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--color-bg-hover);
  color: var(--color-text);
}

/* Content */
.guide-content {
  padding: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* Toolbar Section */
.toolbar-section {
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
}

.toolbar-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

.toolbar-btn {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 6px;
  font-size: 11px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
}

.toolbar-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-accent-purple);
}

.toolbar-btn strong,
.toolbar-btn em {
  font-style: normal;
  font-weight: 600;
}

.guide-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 4px 0;
}

/* Format Items */
.format-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.format-label {
  font-size: 11px;
  color: var(--color-text);
  font-weight: 500;
}

.format-syntax {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-accent-purple);
  background: var(--color-accent-purple-light);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--color-accent-purple-surface);
  white-space: nowrap;
}

/* Scrollbar */
.formatting-guide::-webkit-scrollbar {
  width: 6px;
}

.formatting-guide::-webkit-scrollbar-track {
  background: transparent;
}

.formatting-guide::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.formatting-guide::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-strong);
}

/* Tablet and Mobile */
@media (max-width: 1024px) {
  .formatting-guide {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 90;
    transform: translateX(100%);
  }

  .formatting-guide.visible {
    transform: translateX(0);
    box-shadow: var(--shadow-xl);
  }
}

@media (max-width: 768px) {
  .formatting-guide {
    width: 100%;
    max-width: 280px;
  }
}
</style>
