import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'compose',
    component: () => import('../views/ComposeView.vue'),
    meta: {
      title: 'Compose - Laboratory of Life',
    },
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/HistoryView.vue'),
    meta: {
      title: 'History - Laboratory of Life',
    },
  },
  {
    path: '/coach',
    name: 'coach',
    component: () => import('../views/CoachView.vue'),
    meta: {
      title: 'AI Coach - Laboratory of Life',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: {
      title: 'Settings - Laboratory of Life',
    },
  },
  {
    path: '/export',
    name: 'export',
    component: () => import('../views/ExportView.vue'),
    meta: {
      title: 'Export - Laboratory of Life',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Update document title on route change
router.afterEach((to) => {
  document.title = to.meta.title || 'Laboratory of Life';
});

export default router;
