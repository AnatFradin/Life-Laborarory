<template>
  <aside class="app-sidebar" :class="{ 'collapsed': isCollapsed }">
    <!-- Collapse/Expand Button -->
    <button 
      class="collapse-toggle" 
      @click="toggleCollapse"
      :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      :aria-expanded="!isCollapsed"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        :class="{ 'rotated': isCollapsed }"
      >
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>

    <!-- Privacy Badge -->
    <div v-if="!isCollapsed" class="privacy-badge">
      <span class="privacy-icon">🔒</span>
      <span class="privacy-text">Local-only</span>
    </div>

    <!-- Main Navigation -->
    <nav class="sidebar-nav" aria-label="Main navigation">
      <router-link 
        to="/settings" 
        class="nav-item"
        :class="{ 'active': currentRoute === '/settings' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span v-if="!isCollapsed" class="nav-label">Settings</span>
      </router-link>

      <router-link 
        to="/" 
        class="nav-item"
        :class="{ 'active': currentRoute === '/' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        <span v-if="!isCollapsed" class="nav-label">Journal</span>
      </router-link>

      <router-link 
        to="/history" 
        class="nav-item"
        :class="{ 'active': currentRoute === '/history' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
        <span v-if="!isCollapsed" class="nav-label">Insights</span>
      </router-link>
    </nav>

    <!-- AI Coaches Section -->
    <div v-if="!isCollapsed" class="coaches-section">
      <h3 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon">
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>
        AI COACHES
      </h3>

      <div class="coaches-list">
        <button
          v-for="persona in favoritePersonas"
          :key="persona.id"
          class="coach-card"
          :class="{ 'selected': selectedPersona?.id === persona.id }"
          @click="selectCoach(persona)"
          :aria-label="`Select ${persona.name} coach`"
        >
          <div class="coach-avatar" :style="{ background: persona.color }">
            {{ persona.icon || persona.name?.charAt(0) || '?' }}
          </div>
          <div class="coach-info">
            <div class="coach-name">{{ persona.name }}</div>
            <div class="coach-type">{{ persona.style }}</div>
          </div>
        </button>
      </div>

      <button class="view-all-btn" @click="viewAllCoaches">
        View All Coaches →
      </button>
    </div>

    <!-- Collapsed View AI Coaches -->
    <div v-else class="coaches-collapsed">
      <button
        v-for="persona in favoritePersonas"
        :key="persona.id"
        class="coach-avatar-mini"
        :class="{ 'selected': selectedPersona?.id === persona.id }"
        :style="{ background: persona.color }"
        @click="selectCoach(persona)"
        :aria-label="`Select ${persona.name} coach`"
        :title="`${persona.name} - ${persona.style}`"
      >
        {{ persona.icon || persona.name?.charAt(0) || '?' }}
      </button>
      <button
        class="view-all-mini"
        @click="viewAllCoaches"
        aria-label="View all coaches"
        title="View All Coaches"
      >
        •••
      </button>
    </div>

    <!-- Prompt Selector Dialog -->
    <PromptSelectorDialog
      :persona="promptSelectorPersona"
      :open="showPromptSelector"
      @update:open="showPromptSelector = $event"
    />
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePersonas } from '../composables/usePersonas.js'
import PromptSelectorDialog from './PromptSelectorDialog.vue'

const route = useRoute()
const router = useRouter()

const isCollapsed = ref(false)

const currentRoute = computed(() => route.path)

// Use the personas composable
const { personas, selectedPersona, loadPersonas, selectPersona } = usePersonas()

// Show only first 3 coaches as favorites
const favoritePersonas = computed(() => personas.value.slice(0, 3))

// Dialog state for prompt selector
const showPromptSelector = ref(false)
const promptSelectorPersona = ref(null)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const selectCoach = (persona) => {
  console.log('selectCoach called with:', persona)
  // Select the persona
  selectPersona(persona.id)
  console.log('After selectPersona, selectedPersona is:', selectedPersona.value)
  
  // Open the prompt selector dialog
  promptSelectorPersona.value = persona
  showPromptSelector.value = true
}

const viewAllCoaches = () => {
  router.push('/coach')
}

// Load personas on mount
onMounted(async () => {
  console.log('AppSidebar mounted, loading personas...')
  await loadPersonas()
  console.log('Personas loaded:', personas.value)
  console.log('Favorite personas:', favoritePersonas.value)
})
</script>

<style scoped>
.app-sidebar {
  height: 100vh;
  width: 280px;
  background: var(--color-bg);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  transition: width 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  position: sticky;
  top: 0;
}

.app-sidebar.collapsed {
  width: 60px;
  padding: var(--space-md) var(--space-sm);
}

/* Collapse Toggle */
.collapse-toggle {
  position: absolute;
  right: -12px;
  top: var(--space-xl);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  z-index: 101;
}

.collapse-toggle:hover {
  background: var(--color-accent-purple-light);
  color: var(--color-accent-purple);
  border-color: var(--color-accent-purple);
}

.collapse-toggle svg {
  transition: transform 0.3s ease;
}

.collapse-toggle svg.rotated {
  transform: rotate(180deg);
}

/* Privacy Badge */
.privacy-badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  margin: var(--space-md) var(--space-md) 0;
  background: var(--color-success-light);
  border: 1px solid var(--color-success-border);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
}

.privacy-icon {
  font-size: 14px;
}

.privacy-text {
  color: var(--color-success);
  font-weight: 600;
}

/* Navigation */
.sidebar-nav {
  margin-top: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: var(--text-sm);
  font-weight: 500;
  position: relative;
}

.nav-item:hover {
  background: var(--color-bg-hover);
  color: var(--color-text);
}

.nav-item.active {
  background: var(--color-accent-purple-light);
  color: var(--color-accent-purple);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: var(--color-accent-purple);
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  flex-shrink: 0;
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
}

.collapsed .nav-item {
  justify-content: center;
  padding: var(--space-md) var(--space-sm);
}

/* AI Coaches Section */
.coaches-section {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-accent-purple);
  margin-bottom: var(--space-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-icon {
  opacity: 0.7;
}

.coaches-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.view-all-btn {
  margin-top: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.view-all-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-accent-purple);
  border-color: var(--color-accent-purple);
}

.coach-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.coach-card:hover {
  background: var(--color-accent-purple-light);
  border-color: var(--color-accent-purple-surface);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.coach-card.selected {
  background: var(--color-accent-purple-light);
  border-color: var(--color-accent-purple);
  box-shadow: var(--shadow-sm);
}

.coach-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.coach-info {
  flex: 1;
  min-width: 0;
}

.coach-name {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-text);
}

.coach-type {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

/* Collapsed Coaches */
.coaches-collapsed {
  margin-top: auto;
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.coach-avatar-mini {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.coach-avatar-mini:hover {
  transform: scale(1.1);
  border-color: white;
}

.coach-avatar-mini.selected {
  border-color: white;
  box-shadow: 0 0 0 3px var(--color-accent-purple);
}

.view-all-mini {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid var(--color-border);
  background: var(--color-bg-elevated);
}

.view-all-mini:hover {
  transform: scale(1.1);
  border-color: var(--color-accent-purple);
  color: var(--color-accent-purple);
}

/* Scrollbar */
.app-sidebar::-webkit-scrollbar {
  width: 6px;
}

.app-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.app-sidebar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.app-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-strong);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    transform: translateX(-100%);
  }

  .app-sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>
