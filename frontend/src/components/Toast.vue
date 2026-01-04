<template>
  <Transition name="toast">
    <div
      v-if="visible"
      :class="['toast', `toast--${type}`]"
      role="alert"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
    >
      <div class="toast__icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else>ℹ️</span>
      </div>
      <div class="toast__message">{{ message }}</div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info'].includes(value),
  },
  duration: {
    type: Number,
    default: 3000,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const visible = ref(props.show);
let timeoutId = null;

watch(() => props.show, (newValue) => {
  visible.value = newValue;
  
  if (newValue) {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Auto-dismiss after duration
    timeoutId = setTimeout(() => {
      visible.value = false;
      emit('close');
    }, props.duration);
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 250px;
  max-width: 400px;
}

.toast--success {
  border-left: 4px solid #4caf50;
}

.toast--error {
  border-left: 4px solid #f44336;
}

.toast--info {
  border-left: 4px solid #2196f3;
}

.toast__icon {
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.toast--success .toast__icon {
  color: #4caf50;
  background-color: #e8f5e9;
}

.toast--error .toast__icon {
  color: #f44336;
  background-color: #ffebee;
}

.toast--info .toast__icon {
  color: #2196f3;
  background-color: #e3f2fd;
}

.toast__message {
  font-size: 0.9375rem;
  color: var(--color-text-primary, #1a1a1a);
  line-height: 1.5;
}

/* Transition animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .toast {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}
</style>
