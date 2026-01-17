<template>
  <div class="image-import">
    <div
      class="drop-zone"
      :class="{ 'drop-zone--active': isDragging, 'drop-zone--has-image': previewUrl }"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
      @keydown.enter.prevent="triggerFileInput"
      tabindex="0"
      role="button"
      :aria-label="previewUrl ? 'Change image' : 'Click or drag to upload an image'"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
        :multiple="multiple"
        @change="handleFileSelect"
        class="file-input"
        :aria-label="multiple ? 'Select one or more image files' : 'Select image or PDF file'"
      />

      <div v-if="!previewUrl" class="drop-zone-content">
        <span class="upload-icon" aria-hidden="true">�</span>
        <p class="upload-text">
          <strong>Click to select</strong> or drag and drop a file
        </p>
        <p class="upload-hint text-tertiary text-sm">
          Supports: JPEG, PNG, GIF, WebP, PDF (max 10MB)
        </p>
      </div>

      <div v-else class="preview-container">
        <!-- PDF Preview -->
        <div v-if="isPDF" class="pdf-preview">
          <span class="pdf-icon" aria-hidden="true">📄</span>
          <p class="pdf-name">{{ fileName }}</p>
        </div>
        <!-- Image Preview -->
        <img
          v-else
          :src="previewUrl"
          :alt="fileName"
          class="preview-image"
        />
        <div class="preview-overlay">
          <span class="change-text">Click to change</span>
        </div>
      </div>
    </div>

    <div v-if="previewUrl" class="image-info">
      <div class="info-row">
        <span class="info-label text-tertiary text-sm">File:</span>
        <span class="info-value text-sm">{{ fileName }}</span>
      </div>
      <div class="info-row">
        <span class="info-label text-tertiary text-sm">Size:</span>
        <span class="info-value text-sm">{{ formatFileSize(fileSize) }}</span>
      </div>
      <div v-if="imageDimensions" class="info-row">
        <span class="info-label text-tertiary text-sm">Dimensions:</span>
        <span class="info-value text-sm">{{ imageDimensions.width }}×{{ imageDimensions.height }}</span>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="previewUrl" class="actions">
      <button
        class="btn-secondary"
        @click.stop="clearImage"
        type="button"
        :aria-label="multiple ? 'Remove selected images' : 'Remove selected image'"
      >
        {{ multiple ? 'Remove Images' : 'Remove Image' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [File, Array, null],
    default: null,
  },
  maxSizeBytes: {
    type: Number,
    default: 10 * 1024 * 1024, // 10MB
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'dimensions-loaded']);

// Component state
const fileInput = ref(null);
const isDragging = ref(false);
const previewUrl = ref(null);
const fileName = ref('');
const fileSize = ref(0);
const imageDimensions = ref(null);
const errorMessage = ref('');
const isPDF = ref(false);
const selectedFiles = ref([]);

// Allowed MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

/**
 * Trigger the hidden file input
 */
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

/**
 * Handle drag enter event
 */
const handleDragEnter = (event) => {
  isDragging.value = true;
};

/**
 * Handle drag over event
 */
const handleDragOver = (event) => {
  isDragging.value = true;
};

/**
 * Handle drag leave event
 */
const handleDragLeave = (event) => {
  // Only set to false if leaving the drop zone entirely
  if (event.target.classList.contains('drop-zone')) {
    isDragging.value = false;
  }
};

/**
 * Handle drop event
 */
const handleDrop = (event) => {
  isDragging.value = false;
  
  const files = Array.from(event.dataTransfer.files);
  if (files.length > 0) {
    if (props.multiple) {
      processMultipleFiles(files);
    } else {
      processFile(files[0]);
    }
  }
};

/**
 * Handle file selection from input
 */
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    if (props.multiple) {
      processMultipleFiles(files);
    } else {
      processFile(files[0]);
    }
  }
};

/**
 * Process and validate the selected file
 */
const processFile = (file) => {
  errorMessage.value = '';

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    errorMessage.value = 'Invalid file type. Please select a JPEG, PNG, GIF, WebP image, or PDF.';
    return;
  }

  // Validate file size
  if (file.size > props.maxSizeBytes) {
    errorMessage.value = `File too large. Maximum size is ${formatFileSize(props.maxSizeBytes)}.`;
    return;
  }

  // Check if it's a PDF
  isPDF.value = file.type === 'application/pdf';

  // Create preview URL
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = URL.createObjectURL(file);
  fileName.value = file.name;
  fileSize.value = file.size;

  // Load image dimensions (only for images, not PDFs)
  if (!isPDF.value) {
    loadImageDimensions(file);
  } else {
    // For PDFs, clear dimensions and emit null
    imageDimensions.value = null;
    emit('dimensions-loaded', null);
  }

  // Emit the file
  emit('update:modelValue', file);
};

/**
 * Load image dimensions
 */
const loadImageDimensions = (file) => {
  const img = new Image();
  img.onload = () => {
    imageDimensions.value = {
      width: img.width,
      height: img.height,
    };
    // Emit dimensions for parent component
    emit('dimensions-loaded', imageDimensions.value);
  };
  img.src = URL.createObjectURL(file);
};

/**
 * Process multiple files
 */
const processMultipleFiles = (files) => {
  errorMessage.value = '';
  const validFiles = [];
  
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      errorMessage.value = `Skipped ${file.name}: Invalid file type`;
      continue;
    }
    if (file.size > props.maxSizeBytes) {
      errorMessage.value = `Skipped ${file.name}: File too large`;
      continue;
    }
    validFiles.push(file);
  }
  
  if (validFiles.length === 0) {
    return;
  }
  
  selectedFiles.value = validFiles;
  
  // For preview, show first file
  const firstFile = validFiles[0];
  isPDF.value = firstFile.type === 'application/pdf';
  
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = URL.createObjectURL(firstFile);
  fileName.value = validFiles.length > 1 ? `${validFiles.length} files selected` : firstFile.name;
  fileSize.value = validFiles.reduce((sum, f) => sum + f.size, 0);
  
  if (!isPDF.value && validFiles.length === 1) {
    loadImageDimensions(firstFile);
  } else {
    imageDimensions.value = null;
    emit('dimensions-loaded', null);
  }
  
  emit('update:modelValue', validFiles);
};

/**
 * Clear the selected file
 */
const clearImage = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  
  previewUrl.value = null;
  fileName.value = '';
  fileSize.value = 0;
  imageDimensions.value = null;
  errorMessage.value = '';
  isPDF.value = false;
  selectedFiles.value = [];
  
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  
  emit('update:modelValue', null);
};

/**
 * Format file size to human-readable format
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue === null && previewUrl.value) {
    // Clear internal state without emitting (already null externally)
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = null;
    fileName.value = '';
    fileSize.value = 0;
    imageDimensions.value = null;
    errorMessage.value = '';
    isPDF.value = false;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
});
</script>

<style scoped>
.image-import {
  width: 100%;
}

.drop-zone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--color-bg-elevated);
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-zone:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-surface);
}

.drop-zone:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.drop-zone--active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-surface);
  transform: scale(1.01);
}

.drop-zone--has-image {
  padding: 0;
  min-height: 300px;
}

.file-input {
  display: none;
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.upload-icon {
  font-size: 3rem;
  opacity: 0.7;
}

.upload-text {
  margin: 0;
  color: var(--color-text);
  font-size: 1rem;
}

.upload-text strong {
  color: var(--color-primary);
}

.upload-hint {
  margin: 0;
}

.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.pdf-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.pdf-icon {
  font-size: 4rem;
  margin-bottom: var(--space-md);
  opacity: 0.8;
}

.pdf-name {
  font-size: 1rem;
  color: var(--color-text);
  font-weight: 500;
  text-align: center;
  padding: 0 var(--space-md);
  word-break: break-word;
}

.preview-image {
  width: 100%;
  height: 100%;
  max-height: 400px;
  object-fit: contain;
  display: block;
  background-color: var(--color-bg-secondary);
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.drop-zone:hover .preview-overlay,
.drop-zone:focus .preview-overlay {
  opacity: 1;
}

.change-text {
  color: white;
  font-weight: 500;
  font-size: 1.1rem;
}

.image-info {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-weight: 500;
  min-width: 100px;
}

.info-value {
  text-align: right;
  word-break: break-all;
  flex: 1;
}

.error-message {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background-color: var(--color-danger-surface);
  border: 1px solid var(--color-danger-light);
  border-radius: var(--radius-md);
  color: var(--color-danger);
  font-size: 0.875rem;
}

.actions {
  margin-top: var(--space-md);
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background: var(--color-danger-surface);
  border-color: var(--color-danger-light);
  color: var(--color-danger);
}

.btn-secondary:focus-visible {
  outline: 2px solid var(--color-danger);
  outline-offset: 2px;
}

.btn-secondary:active {
  transform: scale(0.98);
}
</style>
