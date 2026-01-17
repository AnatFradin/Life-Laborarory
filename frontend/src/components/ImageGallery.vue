<template>
  <div class="image-gallery">
    <div class="gallery-grid">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="gallery-item"
        @click="openLightbox(index)"
        @keydown.enter="openLightbox(index)"
        @keydown.space.prevent="openLightbox(index)"
        tabindex="0"
        role="button"
        :aria-label="`View ${image.originalFilename || 'image'} full size`"
      >
        <img
          :src="getImageUrl(image)"
          :alt="image.originalFilename || `Image ${index + 1}`"
          class="gallery-image"
          loading="lazy"
          @error="handleImageError(index)"
        />
        <div class="image-overlay">
          <span class="expand-icon" aria-hidden="true">🔍</span>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div
      v-if="lightboxOpen"
      class="lightbox"
      @click="closeLightbox"
      @keydown.esc="closeLightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <button
        class="lightbox-close"
        @click="closeLightbox"
        aria-label="Close image viewer"
      >
        ✕
      </button>
      
      <button
        v-if="images.length > 1"
        class="lightbox-nav lightbox-prev"
        @click.stop="previousImage"
        :disabled="currentIndex === 0"
        aria-label="Previous image"
      >
        ‹
      </button>
      
      <div class="lightbox-content" @click.stop>
        <img
          :src="getImageUrl(images[currentIndex])"
          :alt="images[currentIndex].originalFilename || `Image ${currentIndex + 1}`"
          class="lightbox-image"
        />
        <div class="lightbox-info">
          <span class="lightbox-filename">{{ images[currentIndex].originalFilename }}</span>
          <span v-if="images[currentIndex].size" class="lightbox-size text-tertiary text-sm">
            {{ formatFileSize(images[currentIndex].size) }}
          </span>
          <span v-if="images.length > 1" class="lightbox-counter text-tertiary text-sm">
            {{ currentIndex + 1 }} / {{ images.length }}
          </span>
        </div>
      </div>
      
      <button
        v-if="images.length > 1"
        class="lightbox-nav lightbox-next"
        @click.stop="nextImage"
        :disabled="currentIndex === images.length - 1"
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(img => img.storedPath || img.url);
    }
  },
});

const lightboxOpen = ref(false);
const currentIndex = ref(0);

/**
 * Get image URL from stored path or direct URL
 */
const getImageUrl = (image) => {
  if (image.url) {
    return image.url;
  }
  if (image.storedPath) {
    const path = image.storedPath.replace('visuals/', '');
    return `http://localhost:3000/api/visuals/${path}`;
  }
  return '';
};

/**
 * Open lightbox at specific index
 */
const openLightbox = (index) => {
  currentIndex.value = index;
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

/**
 * Close lightbox
 */
const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = '';
};

/**
 * Navigate to previous image
 */
const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

/**
 * Navigate to next image
 */
const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  }
};

/**
 * Handle image load error
 */
const handleImageError = (index) => {
  console.error(`Failed to load image at index ${index}`);
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};
</script>

<style scoped>
.image-gallery {
  width: 100%;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--space-md);
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-base);
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}

.gallery-item:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.gallery-item:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.gallery-item:hover .image-overlay,
.gallery-item:focus .image-overlay {
  opacity: 1;
}

.expand-icon {
  font-size: 2rem;
  color: white;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-xl);
}

.lightbox-close {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 2rem;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  z-index: 1001;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.lightbox-content {
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: var(--radius-lg);
}

.lightbox-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
}

.lightbox-filename {
  color: white;
  font-weight: 600;
  font-size: var(--text-base);
}

.lightbox-size,
.lightbox-counter {
  color: rgba(255, 255, 255, 0.8);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 3rem;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  line-height: 1;
}

.lightbox-nav:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.lightbox-prev {
  left: var(--space-xl);
}

.lightbox-next {
  right: var(--space-xl);
}
</style>
