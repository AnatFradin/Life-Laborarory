<template>
  <div id="app" class="app-container">
    <a href="#main-content" class="skip-to-main">Skip to main content</a>
    
    <!-- Left Sidebar Navigation -->
    <AppSidebar />

    <!-- Main Content Area -->
    <div class="main-wrapper">
      <main id="main-content" class="app-main">
        <RouterView />
      </main>

      <footer class="app-footer">
        <p class="privacy-indicator">
          <span class="privacy-icon" aria-hidden="true">🔒</span>
          <span>Your reflections stay on your device</span>
        </p>
        <KeyboardShortcutsHelp />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import AppSidebar from './components/AppSidebar.vue';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp.vue';
import { usePreferences } from './composables/usePreferences.js';

const { preferences, loadPreferences, isUsingLocalAI, isUsingOnlineAI } = usePreferences();

// Load preferences on mount
onMounted(async () => {
  await loadPreferences();
});
</script>

<style scoped>
.app-container {
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100vh;
  background: var(--color-bg);
  overflow-x: hidden;
}

/* Main content wrapper */
.main-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: var(--space-md) var(--space-lg);
  width: 100%;
}

/* Header - streamlined */
.app-header {
  padding: var(--space-xl) 0;
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
}

.header-logo {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.header-logo svg {
  color: var(--color-accent-purple);
}

.app-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  letter-spacing: -0.02em;
}

.header-status {
  display: flex;
  align-items: center;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-xs);
}

.status-badge.local {
  background: linear-gradient(135deg, var(--color-success-light) 0%, #d4ebe0 100%);
  color: var(--color-success);
  border: 1.5px solid var(--color-success-border);
}

.status-badge.online {
  background: linear-gradient(135deg, var(--color-warning-light) 0%, #fef0d9 100%);
  color: var(--color-warning);
  border: 1.5px solid var(--color-warning-border);
}

.status-icon {
  font-size: 1.125rem;
  line-height: 1;
}

.status-text {
  font-weight: 600;
  letter-spacing: 0.01em;
}

/* Main content */
.app-main {
  flex: 1;
  padding: var(--space-2xl) 0;
}

/* Footer */
.app-footer {
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-top: auto;
}

.privacy-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  padding: var(--space-xs) var(--space-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-full);
}

.privacy-icon {
  font-size: 1rem;
}

/* Skip to main content link */
.skip-to-main {
  position: fixed;
  left: -9999px;
  top: var(--space-md);
  z-index: 9999;
  padding: var(--space-md) var(--space-lg);
  background-color: var(--color-accent-purple);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  box-shadow: var(--shadow-lg);
}

.skip-to-main:focus {
  left: var(--space-md);
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .app-container {
    grid-template-columns: 280px 1fr;
  }
}

@media (max-width: 768px) {
  .app-container {
    grid-template-columns: 1fr;
    position: relative;
  }

  .main-wrapper {
    padding: 0 var(--space-md);
  }
}
</style>
