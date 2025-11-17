# Research & Technical Decisions

**Feature**: Laboratory of Life — Product Vision  
**Date**: 2025-11-11  
**Phase**: 0 (Research)

## Purpose

This document resolves all "NEEDS CLARIFICATION" items from the Technical Context section of plan.md and documents technology choices with rationale.

---

## Research Tasks Resolved

### 1. JSON Schema Validator

**Question**: Which JSON schema validator to use for data integrity validation?

**Options Evaluated**:
- **joi**: Mature, feature-rich, but larger bundle size (~150KB)
- **ajv**: Fast, JSON Schema standard-compliant, smaller (~50KB)
- **zod**: TypeScript-first, excellent DX, growing popularity (~35KB)

**Decision**: **Zod**

**Rationale**:
- **Type Safety**: Zod infers TypeScript types from schemas automatically (important if we add TS later)
- **Developer Experience**: Clean, readable schema definitions
- **Size**: Smaller than joi, suitable for local-first app
- **Validation**: Supports complex validations (custom rules, transforms, async validation)
- **Community**: Rapidly growing, excellent docs, active maintenance
- **Use Case Fit**: Perfect for validating reflection data, user preferences, export formats

**Example**:
```javascript
import { z } from 'zod';

const ReflectionSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
  timestamp: z.string().datetime(),
  mode: z.enum(['text', 'visual', 'silence']),
  aiInteraction: z.object({
    prompt: z.string(),
    response: z.string(),
    model: z.string()
  }).optional()
});
```

**Alternatives Considered**:
- **joi**: More verbose, larger bundle, but would work fine
- **ajv**: JSON Schema standard, but less intuitive API than Zod

---

### 2. State Management for Vue Frontend

**Question**: State management approach - Pinia, Vuex, or local component state?

**Options Evaluated**:
- **Pinia**: Official Vue recommendation (replaces Vuex), TypeScript-first, composition API friendly
- **Vuex**: Legacy Vue state management, still maintained but not recommended for new projects
- **Local component state**: Reactive refs + provide/inject, no library needed

**Decision**: **Local Component State with Composables**

**Rationale**:
- **Simplicity**: Application state is simple (reflections list, current reflection, AI response)
- **YAGNI Principle**: No need for centralized state management yet
- **Composition API**: Composables (`useReflections`, `useAIMirror`) encapsulate state + logic
- **Performance**: No overhead of state management library
- **Small Steps**: Start simple, add Pinia later only if complexity grows
- **Use Case Fit**: Single-user local app with direct API calls, no complex cross-component state

**Pattern**:
```javascript
// composables/useReflections.js
import { ref, computed } from 'vue';
import api from '@/services/api';

const reflections = ref([]);
const loading = ref(false);

export function useReflections() {
  const loadReflections = async () => {
    loading.value = true;
    reflections.value = await api.getReflections();
    loading.value = false;
  };
  
  return { reflections, loading, loadReflections };
}
```

**When to reconsider**: If we add features requiring complex cross-component state (e.g., undo/redo, draft autosave across routes, real-time sync), migrate to Pinia.

**Alternatives Considered**:
- **Pinia**: Excellent library, but adds complexity we don't need yet
- **Vuex**: Legacy, not recommended for new Vue 3 projects

---

### 3. UI Component Library for Accessibility

**Question**: Which UI library ensures WCAG 2.1 AA compliance with minimal effort?

**Options Evaluated**:
- **Headless UI**: Unstyled, accessible components (by Tailwind team)
- **Radix Vue**: Unstyled, accessible primitives (port of Radix UI for React)
- **Custom components**: Build from scratch with ARIA attributes

**Decision**: **Radix Vue**

**Rationale**:
- **Accessibility Built-In**: Components follow WAI-ARIA patterns out of the box
- **Unstyled**: Full control over calm, minimalist design (no need to fight opinionated styles)
- **Primitives**: Focus indicators, keyboard navigation, screen reader support baked in
- **Composition**: Works seamlessly with Vue 3 Composition API
- **Focus on Behavior**: Handles complex accessibility patterns (dialogs, dropdowns, menus) correctly
- **Use Case Fit**: Provides accessible foundation for custom calm UI

**Components Needed**:
- **Dialog**: Export confirmation, delete confirmation, AI model warning
- **RadioGroup**: AI model selection (local vs. online)
- **Focus Trap**: Modal dialogs keep focus within
- **VisuallyHidden**: Screen reader announcements

**Example**:
```vue
<script setup>
import { DialogRoot, DialogTrigger, DialogContent } from 'radix-vue';
</script>

<template>
  <DialogRoot>
    <DialogTrigger>Delete All Data</DialogTrigger>
    <DialogContent>
      <!-- Accessible modal with focus trap, Esc to close, etc. -->
      <p>Are you sure? This cannot be undone.</p>
      <button @click="confirmDelete">Yes, Delete Everything</button>
    </DialogContent>
  </DialogRoot>
</template>
```

**Alternatives Considered**:
- **Headless UI**: Excellent, but primarily React-focused (Vue support newer)
- **Custom components**: Reinventing the wheel, high risk of accessibility bugs

---

### 4. Accessibility Testing

**Question**: Automated accessibility testing approach?

**Options Evaluated**:
- **axe-core**: Industry standard, integrates with Playwright/Vitest
- **pa11y**: CLI-based, good for CI/CD
- **Manual testing**: Screen reader testing (VoiceOver, NVDA)

**Decision**: **axe-core + Manual Testing**

**Rationale**:
- **axe-core**: Detects 57% of WCAG issues automatically (color contrast, ARIA usage, keyboard navigation)
- **Integration**: Works with Vitest (unit tests) and Playwright (e2e tests)
- **Fast Feedback**: Catches issues during development
- **Manual Testing**: Required for remaining 43% (screen reader announcements, focus management, real user experience)
- **Use Case Fit**: Combination ensures WCAG 2.1 AA compliance (SC-008)

**Implementation**:
```javascript
// In Playwright e2e tests
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('reflection editor is accessible', async ({ page }) => {
  await page.goto('/compose');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

**Manual Testing Plan**:
- **VoiceOver** (macOS): Primary screen reader testing
- **NVDA** (Windows): Secondary verification
- **Keyboard-only navigation**: Tab through entire app, verify all actions accessible
- **Color contrast**: Manual verification of calm palette meets WCAG AA (4.5:1 for text)

**Alternatives Considered**:
- **pa11y**: Good for CI, but less integrated with our test stack
- **Manual only**: High risk, slow feedback, no regression protection

---

### 5. File Organization Strategy

**Question**: Single JSON per reflection, or batched by date/month?

**Options Evaluated**:
- **Single file per reflection**: `data/reflections/[uuid].json`
- **Batched by month**: `data/reflections/[YYYY-MM]/[uuid].json`
- **Single large file**: `data/reflections.json` (all reflections in one file)

**Decision**: **Batched by Month** (`data/reflections/[YYYY-MM]/[uuid].json`)

**Rationale**:
- **Performance**: Loading 1000+ files from single directory is slow; month-based folders reduce directory size
- **Atomic Writes**: Each reflection is separate file (prevents corruption of entire history)
- **Organization**: Natural chronological organization matches "Trace of Becoming" principle
- **Scalability**: Handles years of daily reflections without performance degradation (FR-037)
- **Recovery**: If one file corrupts, only that reflection is lost (not entire month or history)
- **Use Case Fit**: Typical usage is viewing recent reflections (this month, last month), not entire history at once

**Trade-offs**:
- **Complexity**: Need to scan directories to load reflections (vs. single file)
- **Mitigation**: Cache month index in memory, lazy-load older months on demand

**File Structure**:
```
data/
├── reflections/
│   ├── 2025-11/
│   │   ├── uuid-1.json
│   │   ├── uuid-2.json
│   │   └── uuid-3.json
│   ├── 2025-10/
│   │   └── uuid-4.json
│   └── index.json  # Optional: month → count mapping for quick stats
├── preferences.json
└── exports/
    └── 2025-11-11-export.md
```

**Alternatives Considered**:
- **Single file per reflection (flat)**: Simple but doesn't scale (1000+ files in one directory)
- **Single large file**: Fast to load initially, but atomic writes complex, total corruption risk

---

## Best Practices Research

### Hexagonal Architecture in Node.js

**Resources**:
- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Node.js Hexagonal Architecture Examples](https://github.com/topics/hexagonal-architecture-nodejs)
- [Domain-Driven Design patterns](https://martinfowler.com/tags/domain%20driven%20design.html)

**Key Patterns**:
1. **Dependency Inversion**: Domain depends on ports (interfaces), adapters depend on domain
2. **Pure Domain Logic**: Services are pure functions where possible (testable without I/O)
3. **Adapter Registration**: Inject adapters into domain services at startup (dependency injection)

**Example**:
```javascript
// domain/ports/IReflectionRepository.js
export class IReflectionRepository {
  async save(reflection) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findAll() { throw new Error('Not implemented'); }
}

// adapters/storage/LocalFileRepository.js
import { IReflectionRepository } from '../../domain/ports/IReflectionRepository.js';

export class LocalFileRepository extends IReflectionRepository {
  async save(reflection) {
    // Write to file system
  }
}

// domain/services/ReflectionService.js
export class ReflectionService {
  constructor(reflectionRepository) {
    this.repository = reflectionRepository; // Injected adapter
  }
  
  async createReflection(content) {
    // Pure business logic
    const reflection = new Reflection({ content, timestamp: new Date() });
    await this.repository.save(reflection);
    return reflection;
  }
}
```

---

### Ollama API Integration

**Resources**:
- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Ollama JavaScript SDK](https://github.com/ollama/ollama-js)

**Key Findings**:
- **REST API**: Simple HTTP POST to `http://localhost:11434/api/generate`
- **Streaming**: Supports streaming responses (for future real-time feedback)
- **Model Selection**: User can choose from installed models (llama2, mistral, etc.)
- **System Prompts**: Set non-directive, reflective tone via system message

**Example**:
```javascript
// adapters/ai/OllamaAdapter.js
import { IAIProvider } from '../../domain/ports/IAIProvider.js';

export class OllamaAdapter extends IAIProvider {
  constructor(baseUrl = 'http://localhost:11434') {
    super();
    this.baseUrl = baseUrl;
  }
  
  async generateResponse(prompt, model = 'llama2') {
    const systemPrompt = `You are a gentle mirror for self-reflection. 
      Respond with curiosity and openness, never with instruction or diagnosis.
      Ask clarifying questions. Reflect back what you hear. 
      Use "I notice..." or "I wonder..." language.`;
    
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        system: systemPrompt,
        stream: false
      })
    });
    
    return response.json();
  }
}
```

---

### Vue 3 Accessibility Best Practices

**Resources**:
- [Vue Accessibility Guide](https://vuejs.org/guide/best-practices/accessibility.html)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inclusive Components](https://inclusive-components.design/)

**Key Patterns**:
1. **Semantic HTML**: Use `<button>`, `<nav>`, `<main>` instead of `<div>` with click handlers
2. **ARIA Labels**: `aria-label`, `aria-labelledby` for screen readers
3. **Focus Management**: `ref` + `.focus()` after route changes, modal opens
4. **Keyboard Events**: `@keydown.enter`, `@keydown.esc` for keyboard users
5. **Skip Links**: "Skip to main content" for screen reader users

**Example**:
```vue
<template>
  <div class="reflection-editor">
    <label for="reflection-input" class="visually-hidden">
      Write your reflection
    </label>
    <textarea
      id="reflection-input"
      ref="inputRef"
      v-model="content"
      @keydown.meta.enter="save"
      aria-describedby="save-hint"
      :aria-invalid="hasErrors"
    />
    <span id="save-hint" class="visually-hidden">
      Press Command+Enter to save
    </span>
    <button @click="save" :aria-busy="saving">
      {{ saving ? 'Saving...' : 'Save Reflection' }}
    </button>
  </div>
</template>
```

---

## Summary of Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| JSON Schema Validator | **Zod** | Type-safe, small bundle, excellent DX |
| State Management | **Local Composables** | Simple, no library needed yet, YAGNI |
| UI Component Library | **Radix Vue** | Accessible primitives, unstyled, ARIA built-in |
| Accessibility Testing | **axe-core + Manual** | Automated (57% coverage) + manual (remaining 43%) |
| File Organization | **Batched by Month** | Performance at scale, atomic writes, natural organization |

**Technology Stack Summary**:
- **Backend**: Node.js 18+ + Express + Zod
- **Frontend**: Vue 3 + Vite + Radix Vue + Composables
- **Testing**: Vitest (unit/integration) + Playwright (e2e) + axe-core (a11y)
- **AI**: Ollama (local default) + OpenAI/Anthropic SDKs (optional online)
- **Storage**: Local JSON files organized by year-month

**Next Phase**: Phase 1 (Design & Contracts) - Generate data-model.md, API contracts, quickstart.md
