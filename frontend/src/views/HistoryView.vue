<template>
  <div class="history-view">
    <header class="view-header">
      <h2>History</h2>
      <div v-if="reflectionCount > 0" class="reflection-count text-secondary">
        {{ reflectionCount }} reflection{{ reflectionCount !== 1 ? 's' : '' }}
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <p class="text-secondary">Loading your reflections...</p>
    </div>

    <div v-else-if="error" class="error-state" role="alert">
      <p class="error-message">{{ error }}</p>
      <button @click="loadReflections" class="btn-retry">Try Again</button>
    </div>

    <ReflectionList
      v-else
      :reflections="reflections"
      @select="handleSelectReflection"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ReflectionList from '../components/ReflectionList.vue';
import { useReflections } from '../composables/useReflections.js';

const router = useRouter();
const { reflections, loading, error, reflectionCount, loadReflections } = useReflections();

/**
 * Handle reflection selection
 */
const handleSelectReflection = (reflection) => {
  // For now, just log - we'll add a detail view later
  console.log('Selected reflection:', reflection);
  // Could navigate to detail view: router.push(`/reflections/${reflection.id}`)
};

// Load reflections on mount
onMounted(() => {
  loadReflections();
});
</script>

<style scoped>
.history-view {
  max-width: 1000px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.view-header h2 {
  margin: 0;
}

.reflection-count {
  font-size: 0.875rem;
  font-weight: 500;
}

.loading-state,
.error-state {
  text-align: center;
  padding: var(--space-xl);
}

.error-message {
  color: var(--color-error);
  margin-bottom: var(--space-md);
}

.btn-retry {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: 1rem;
  cursor: pointer;
}

.btn-retry:hover {
  background-color: var(--color-primary-hover);
}
</style>
