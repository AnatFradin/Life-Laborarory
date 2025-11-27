<template>
  <div 
    class="markdown-preview" 
    data-test="markdown-preview"
    v-html="renderedHtml"
    aria-live="polite"
  ></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { parseMarkdown } from '@/utils/markdown'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const renderedHtml = ref('')

// Debounce function
function debounce(fn, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Debounced render function (200ms delay)
const debouncedRender = debounce((newContent) => {
  renderedHtml.value = parseMarkdown(newContent)
}, 200)

// Watch content changes and debounce rendering
watch(
  () => props.content,
  (newContent) => {
    debouncedRender(newContent)
  },
  { immediate: true } // Render on mount
)
</script>

<style scoped>
.markdown-preview {
  padding: 1rem;
  min-height: 200px;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #ffffff;
}

/* Typography */
.markdown-preview :deep(h1) {
  font-size: 2em;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0.5em;
  color: #2c3e50;
}

.markdown-preview :deep(h2) {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: #2c3e50;
}

.markdown-preview :deep(h3) {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: #2c3e50;
}

.markdown-preview :deep(p) {
  margin-bottom: 1em;
}

.markdown-preview :deep(strong) {
  font-weight: 600;
  color: #2c3e50;
}

.markdown-preview :deep(em) {
  font-style: italic;
}

.markdown-preview :deep(a) {
  color: #5a6c7d;
  text-decoration: underline;
}

.markdown-preview :deep(a:hover) {
  color: #4a5c6d;
}

/* Lists */
.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  margin-left: 1.5em;
  margin-bottom: 1em;
}

.markdown-preview :deep(li) {
  margin-bottom: 0.25em;
}

/* Code */
.markdown-preview :deep(code) {
  background-color: #f5f7fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-preview :deep(pre) {
  background-color: #f5f7fa;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.markdown-preview :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

/* Blockquotes */
.markdown-preview :deep(blockquote) {
  border-left: 4px solid #e0e5eb;
  padding-left: 1em;
  margin-left: 0;
  margin-bottom: 1em;
  color: #5a6c7d;
  font-style: italic;
}
</style>
