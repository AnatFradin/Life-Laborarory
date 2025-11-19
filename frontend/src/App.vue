<template>
  <div id="app" class="app-container">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <header class="app-header">
      <h1 class="app-title">Laboratory of Life</h1>
      <nav class="app-nav" aria-label="Main navigation">
        <RouterLink to="/" class="nav-link">Compose</RouterLink>
        <RouterLink to="/history" class="nav-link">History</RouterLink>
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
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: var(--color-bg);
  padding: 0.5rem 1rem;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

.app-header {
  padding: 2rem 0 1rem;
  border-bottom: 1px solid var(--color-border);
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 1rem 0;
}

.app-nav {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.app-main {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  padding: 1.5rem 0;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.privacy-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.privacy-icon {
  font-size: 1rem;
}
</style>
