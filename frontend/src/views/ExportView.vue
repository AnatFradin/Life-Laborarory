<script setup>
/**
 * ExportView - Data sovereignty interface
 * 
 * Features:
 * - Export all reflections to Markdown
 * - Delete all reflections (2-step confirmation)
 * - Calm, clear layout with keyboard navigation
 * - Export-before-delete guidance per FR-017
 */

import { ref, onMounted } from 'vue';
import { useReflections } from '../composables/useReflections.js';
import { exportAPI } from '../services/api.js';
import ExportDialog from '../components/ExportDialog.vue';
import DeleteAllDialog from '../components/DeleteAllDialog.vue';

// State
const { reflectionCount, loadReflections } = useReflections();
const showExportDialog = ref(false);
const showDeleteAllDialog = ref(false);
const isExporting = ref(false);
const exportError = ref(null);
const exportSuccess = ref(false);

// Load reflections on mount to get count
onMounted(async () => {
  await loadReflections();
});

/**
 * Handle export request from dialog
 * Downloads generated Markdown file
 */
const handleExport = async ({ format, includeMetadata }) => {
  isExporting.value = true;
  exportError.value = null;
  exportSuccess.value = false;

  try {
    // Request export from backend
    const response = await exportAPI.exportToMarkdown(format, includeMetadata);
    const { markdown, filename } = response.data;

    // Trigger browser download
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    exportSuccess.value = true;
    
    // Close dialog after successful export
    setTimeout(() => {
      showExportDialog.value = false;
      exportSuccess.value = false;
    }, 1500);
  } catch (err) {
    exportError.value = err.message || 'Export failed. Please try again.';
    console.error('Export failed:', err);
  } finally {
    isExporting.value = false;
  }
};

/**
 * Handle delete all request from dialog
 */
const handleDeleteAll = async (confirmation) => {
  // Dialog component validates confirmation text
  // Just close dialog after successful deletion
  showDeleteAllDialog.value = false;
};

/**
 * Open export dialog
 */
const openExportDialog = () => {
  showExportDialog.value = true;
};

/**
 * Open delete all dialog
 */
const openDeleteAllDialog = () => {
  showDeleteAllDialog.value = true;
};
</script>

<template>
  <div class="export-view">
    <div class="export-container">
      <!-- Header -->
      <header class="export-header">
        <h1 class="export-title">Your Data</h1>
        <p class="export-subtitle">
          Export your reflections to keep them safe, or delete them permanently.
        </p>
      </header>

      <!-- Reflection count -->
      <div class="reflection-count-card">
        <div class="count-label">Total Reflections</div>
        <div class="count-value">{{ reflectionCount }}</div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <div class="action-card">
          <div class="action-icon" aria-hidden="true">📦</div>
          <h2 class="action-title">Export to Markdown</h2>
          <p class="action-description">
            Download all your reflections as Markdown files. Keep them forever,
            share them privately, or archive them for safekeeping.
          </p>
          <button
            class="action-button export-button"
            @click="openExportDialog"
            :disabled="reflectionCount === 0"
            aria-label="Export all reflections to Markdown"
          >
            Export Reflections
          </button>
        </div>

        <div class="action-card danger-card">
          <div class="action-icon" aria-hidden="true">🗑️</div>
          <h2 class="action-title">Delete All Reflections</h2>
          <p class="action-description">
            Permanently delete all reflections from this device. This cannot be
            undone. We recommend exporting first.
          </p>
          <button
            class="action-button delete-button"
            @click="openDeleteAllDialog"
            :disabled="reflectionCount === 0"
            aria-label="Delete all reflections permanently"
          >
            Delete All
          </button>
        </div>
      </div>

      <!-- Guidance -->
      <div class="guidance-section">
        <h2 class="guidance-title">Data Sovereignty</h2>
        <p class="guidance-text">
          Your reflections belong to you. They live on your device, not in the
          cloud. Export them anytime, delete them whenever you choose. No one
          else has access.
        </p>
      </div>
    </div>

    <!-- Export Dialog -->
    <ExportDialog
      :open="showExportDialog"
      @export="handleExport"
      @update:open="showExportDialog = $event"
    />

    <!-- Delete All Dialog -->
    <DeleteAllDialog
      :open="showDeleteAllDialog"
      :reflection-count="reflectionCount"
      @delete-all="handleDeleteAll"
      @update:open="showDeleteAllDialog = $event"
    />
  </div>
</template>

<style scoped>
.export-view {
  min-height: 100vh;
  background: var(--color-background);
  padding: 2rem 1rem;
}

.export-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Header */
.export-header {
  margin-bottom: 2rem;
}

.export-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
}

.export-subtitle {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.5;
}

/* Reflection count card */
.reflection-count-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.count-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.count-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1;
}

/* Actions section */
.actions-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .actions-section {
    grid-template-columns: 1fr 1fr;
  }
}

.action-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.action-card.danger-card {
  border-color: var(--color-danger-light);
  background: var(--color-danger-surface);
}

.action-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.action-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.75rem 0;
}

.action-description {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
  flex: 1;
}

.action-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.export-button {
  background: var(--color-primary);
  color: white;
}

.export-button:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.export-button:active:not(:disabled) {
  transform: translateY(0);
}

.export-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.delete-button {
  background: var(--color-danger);
  color: white;
}

.delete-button:hover:not(:disabled) {
  background: var(--color-danger-hover);
  transform: translateY(-1px);
}

.delete-button:active:not(:disabled) {
  transform: translateY(0);
}

.delete-button:focus-visible {
  outline: 2px solid var(--color-danger);
  outline-offset: 2px;
}

/* Guidance section */
.guidance-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
}

.guidance-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.75rem 0;
}

.guidance-text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 639px) {
  .export-title {
    font-size: 1.5rem;
  }

  .count-value {
    font-size: 2rem;
  }

  .action-icon {
    font-size: 2rem;
  }
}
</style>
