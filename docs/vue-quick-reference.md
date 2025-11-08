# Vue 3 Quick Reference for Backend Developers

> A practical guide for someone familiar with Node.js/Express learning Vue 3

## What is Vue?

Vue is a JavaScript framework for building user interfaces. Think of it like Express for the frontend - it provides structure and tools to build interactive web pages efficiently.

## Key Concepts (in Backend Terms)

| Vue Concept | Backend Equivalent | What It Does |
|-------------|-------------------|--------------|
| **Component** | Route handler function | Reusable piece of UI (HTML + CSS + JS) |
| **Props** | Function parameters | Data passed from parent to child component |
| **State (ref/reactive)** | Variables in your code | Data that can change and triggers UI updates |
| **Computed** | Derived values/getters | Calculated values that auto-update when dependencies change |
| **Methods** | Functions | Regular functions in your component |
| **Lifecycle hooks** | Middleware | Functions that run at specific times (mount, update, unmount) |

## Single File Component Structure

A `.vue` file has three sections (all optional):

```vue
<!-- ReflectionCard.vue -->

<!-- 1. Template: Your HTML (what the user sees) -->
<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
    <button @click="saveReflection">Save</button>
  </div>
</template>

<!-- 2. Script: Your JavaScript (the logic) -->
<script setup>
import { ref } from 'vue'

// This is like defining variables in a function
const title = ref('My Reflection')
const content = ref('Today I learned...')

// This is like a regular function
const saveReflection = async () => {
  // Just like fetch in Node.js!
  const response = await fetch('http://localhost:3000/api/reflections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      title: title.value, 
      content: content.value 
    })
  })
  const data = await response.json()
  console.log('Saved!', data)
}
</script>

<!-- 3. Style: Your CSS (how it looks) -->
<style scoped>
.card {
  padding: 20px;
  border-radius: 8px;
  background: #f5f5f5;
}
</style>
```

## Basic Patterns You'll Use

### 1. Reactive Data (like variables that trigger updates)

```javascript
import { ref } from 'vue'

// ref() makes a reactive variable
const message = ref('Hello')

// To read it: use .value
console.log(message.value)  // "Hello"

// To change it: assign to .value
message.value = 'World'  // UI updates automatically!
```

### 2. Fetching Data (just like in Node.js)

```javascript
import { ref, onMounted } from 'vue'

const reflections = ref([])
const loading = ref(false)

// onMounted runs when component loads (like Express middleware)
onMounted(async () => {
  loading.value = true
  const response = await fetch('http://localhost:3000/api/reflections')
  reflections.value = await response.json()
  loading.value = false
})
```

### 3. Displaying Data in Template

```vue
<template>
  <!-- Show loading state -->
  <p v-if="loading">Loading...</p>
  
  <!-- Loop through array (like .map() in JS) -->
  <div v-for="reflection in reflections" :key="reflection.id">
    <h3>{{ reflection.title }}</h3>
    <p>{{ reflection.content }}</p>
  </div>
  
  <!-- Show if no data -->
  <p v-if="reflections.length === 0">No reflections yet</p>
</template>
```

### 4. Handling User Input

```vue
<template>
  <!-- Two-way binding: v-model syncs input with data -->
  <input 
    v-model="userText" 
    placeholder="Write your reflection..."
  />
  
  <!-- Button with click handler -->
  <button @click="handleSave">Save</button>
  
  <!-- Show what they typed -->
  <p>You typed: {{ userText }}</p>
</template>

<script setup>
import { ref } from 'vue'

const userText = ref('')

const handleSave = () => {
  console.log('Saving:', userText.value)
  // Save to API...
  userText.value = ''  // Clear input
}
</script>
```

## Project Structure with Vue

```
frontend/
├── index.html           # Entry point (loads Vue app)
├── src/
│   ├── main.js          # Initialize Vue app (like app.js in Express)
│   ├── App.vue          # Root component (main layout)
│   ├── components/      # Reusable UI pieces
│   │   ├── ReflectionCard.vue
│   │   ├── ReflectionForm.vue
│   │   └── Navigation.vue
│   ├── pages/           # Full page views
│   │   ├── Home.vue
│   │   ├── History.vue
│   │   └── Settings.vue
│   ├── services/        # API calls (like controllers in backend)
│   │   └── api.js
│   └── styles/          # Global CSS
│       └── main.css
├── package.json
└── vite.config.js       # Build tool config
```

## Getting Started Commands

```bash
# Create Vue project (Vite will ask questions)
npm create vue@latest frontend

# Options to choose:
# ✓ TypeScript? No (start simple)
# ✓ JSX? No
# ✓ Vue Router? Yes (for navigation)
# ✓ Pinia? No (state management - add later if needed)
# ✓ Vitest? Yes (for testing)
# ✓ ESLint? Yes (code quality)

# Install dependencies
cd frontend
npm install

# Run dev server (like nodemon)
npm run dev  # Opens http://localhost:5173

# Build for production
npm run build
```

## Common Gotchas for Backend Devs

1. **`.value` is required**: When using `ref()`, you must access with `.value` in JavaScript
   ```javascript
   const count = ref(0)
   count.value++  // ✓ Correct
   count++        // ✗ Wrong
   ```

2. **No `.value` in template**: In `<template>`, Vue automatically unwraps refs
   ```vue
   <p>{{ count }}</p>  <!-- ✓ Correct, no .value needed -->
   ```

3. **Reactivity**: Only use Vue's reactive primitives (`ref`, `reactive`) for data that should trigger UI updates
   ```javascript
   let count = 0          // Regular variable - UI won't update
   const count = ref(0)   // Reactive - UI updates automatically
   ```

4. **Async/Await works the same**: All your Node.js async knowledge applies!
   ```javascript
   const loadData = async () => {
     try {
       const response = await fetch('/api/data')
       data.value = await response.json()
     } catch (error) {
       console.error('Error:', error)
     }
   }
   ```

## Learning Path

1. **Week 1**: Build one simple component (form that saves to your API)
2. **Week 2**: Add routing (multiple pages)
3. **Week 3**: Add more components, refine styling
4. **Week 4**: Add tests, polish accessibility

## Resources

- **Official Vue 3 Docs**: https://vuejs.org/guide/introduction.html (excellent!)
- **Vue School**: https://vueschool.io/courses (free intro courses)
- **Composition API Guide**: https://vuejs.org/guide/extras/composition-api-faq.html

## Example: Complete Mini Component

```vue
<!-- frontend/src/components/QuickNote.vue -->
<template>
  <div class="quick-note">
    <h2>Quick Reflection</h2>
    
    <textarea 
      v-model="noteText"
      placeholder="What's on your mind?"
      rows="5"
    />
    
    <button 
      @click="saveNote" 
      :disabled="!noteText.trim() || saving"
    >
      {{ saving ? 'Saving...' : 'Save Note' }}
    </button>
    
    <p v-if="saved" class="success">Note saved!</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const noteText = ref('')
const saving = ref(false)
const saved = ref(false)

const saveNote = async () => {
  saving.value = true
  saved.value = false
  
  try {
    const response = await fetch('http://localhost:3000/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: noteText.value,
        timestamp: new Date().toISOString()
      })
    })
    
    if (response.ok) {
      saved.value = true
      noteText.value = ''  // Clear form
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        saved.value = false
      }, 2000)
    }
  } catch (error) {
    console.error('Failed to save:', error)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.quick-note {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

textarea {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 12px;
}

button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.success {
  color: #4CAF50;
  margin-top: 10px;
}
</style>
```

---

**Remember**: Vue is just JavaScript. Everything you know about async/await, functions, objects, and arrays applies. Vue just adds reactivity and a nice way to organize your UI code!
