import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';

// Global styles
import './styles/main.css';
import './styles/accessibility.css';

const app = createApp(App);

// Install Vue Router
app.use(router);

// Mount app
app.mount('#app');
