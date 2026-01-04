<template>
  <div class="history-view">
    <header class="view-header">
      <h2>History</h2>
      <div v-if="reflectionCount > 0" class="reflection-count text-secondary">
        {{ reflectionCount }} reflection{{ reflectionCount !== 1 ? 's' : '' }}
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="text-secondary">Loading your reflections...</p>
    </div>

    <div v-else-if="error" class="error-state" role="alert">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
      <button @click="loadReflections" class="btn-retry">Try Again</button>
    </div>

    <div v-else-if="reflections.length === 0" class="empty-state">
      <div class="empty-illustration">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="var(--color-primary-light)" opacity="0.5"/>
          <path d="M40 50 Q60 30 80 50" stroke="var(--color-primary)" stroke-width="3" fill="none" stroke-linecap="round"/>
          <circle cx="45" cy="55" r="3" fill="var(--color-primary)"/>
          <circle cx="75" cy="55" r="3" fill="var(--color-primary)"/>
          <path d="M35 75 Q60 90 85 75" stroke="var(--color-primary)" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>
      </div>
      <h3 class="empty-title">Your reflection journey begins here</h3>
      <p class="empty-message">Start writing to capture your thoughts and watch your story unfold over time.</p>
      <router-link to="/" class="empty-cta">
        ✍️ Write Your First Reflection
      </router-link>
    </div>

    <ReflectionList
      v-else
      :reflections="reflections"
      @select="handleSelectReflection"
      @delete="handleDeleteReflection"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ReflectionList from '../components/ReflectionList.vue';
import { useReflections } from '../composables/useReflections.js';

const router = useRouter();
const { reflections, loading, error, reflectionCount, loadReflections, deleteReflection } = useReflections();

/**
 * Handle reflection selection
 */
const handleSelectReflection = (reflection) => {
  // For now, just log - we'll add a detail view later
  console.log('Selected reflection:', reflection);
  // Could navigate to detail view: router.push(`/reflections/${reflection.id}`)
};

/**
 * Handle reflection deletion
 */
const handleDeleteReflection = async (reflectionId) => {
  try {
    await deleteReflection(reflectionId);
  } catch (err) {
    console.error('Failed to delete reflection:', err);
    // Error is already handled in composable
  }
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
  margin-bottom: var(--space-2xl);
}

.view-header h2 {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.reflection-count {
  font-size: var(--text-sm);
  font-weight: 600;
  padding: var(--space-xs) var(--space-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-full);
}

.loading-state {
  text-align: center;
  padding: var(--space-4xl) var(--space-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: var(--space-4xl) var(--space-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.error-icon {
  font-size: 48px;
  opacity: 0.8;
}

.error-message {
  color: var(--color-error);
  margin-bottom: var(--space-md);
  font-weight: 500;
}

.btn-retry {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-2xl);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.btn-retry:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Enhanced Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-4xl) var(--space-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  max-width: 500px;
  margin: 0 auto;
}

.empty-illustration {
  margin-bottom: var(--space-md);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.empty-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  letter-spacing: -0.02em;
}

.empty-message {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.empty-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-2xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  margin-top: var(--space-md);
}

.empty-cta:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
</style>
