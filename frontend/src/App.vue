<template>
  <div id="app" class="app-container">
    <a href="#main-content" class="skip-to-main">Skip to main content</a>
    
    <header class="app-header">
      <div class="header-top">
        <h1 class="app-title">Laboratory of Life</h1>
        <div class="header-status" role="status" aria-live="polite">
          <span v-if="isUsingLocalAI" class="status-badge local" title="All processing happens locally on your device">
            <span class="status-icon" aria-hidden="true">🔒</span>
            <span class="status-text">Local-only</span>
          </span>
          <span v-else-if="isUsingOnlineAI" class="status-badge online" title="AI processing uses external services">
            <span class="status-icon" aria-hidden="true">🌐</span>
            <span class="status-text">Online AI Active</span>
          </span>
        </div>
      </div>
      <nav class="app-nav" aria-label="Main navigation">
        <RouterLink to="/" class="nav-link">Compose</RouterLink>
        <RouterLink to="/history" class="nav-link">History</RouterLink>
        <RouterLink to="/coach" class="nav-link">AI Coach</RouterLink>
        <RouterLink to="/settings" class="nav-link">Settings</RouterLink>
        <RouterLink to="/export" class="nav-link">Export</RouterLink>
      </nav>
    </header>

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
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.app-header {
  padding: var(--space-xl) 0 var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(to bottom, var(--color-bg) 0%, var(--color-bg-secondary) 100%);
  margin: 0 calc(-1 * var(--space-lg));
  padding-left: var(--space-lg);
  padding-right: var(--space-lg);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  gap: var(--space-md);
  flex-wrap: wrap;
}

.app-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

.app-nav {
  display: flex;
  gap: var(--space-xl);
  flex-wrap: wrap;
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: var(--space-sm) var(--space-xs);
  border-bottom: 2px solid transparent;
  transition: all var(--transition-base);
  font-weight: 500;
  font-size: var(--text-base);
  position: relative;
}

.nav-link:hover {
  color: var(--color-primary);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  box-shadow: 0 2px 8px rgba(45, 90, 61, 0.3);
}

.app-main {
  flex: 1;
  padding: var(--space-2xl) 0;
}

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

/* Skip to main content link - visible only on focus */
.skip-to-main {
  position: fixed;
  left: -9999px;
  top: var(--space-md);
  z-index: 9999;
  padding: var(--space-md) var(--space-lg);
  background-color: var(--color-primary);
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
</style>
