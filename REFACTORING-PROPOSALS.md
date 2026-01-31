# 🔧 Refactoring Proposals - Laboratory of Life

> **Document Purpose**: Identify code quality issues and propose improvements  
> **Last Review**: 2026-01-29  
> **Status**: Active proposals - prioritized by impact

---

## Executive Summary

The Laboratory of Life codebase demonstrates strong architectural principles with clean separation of concerns and comprehensive error handling. However, there are opportunities to reduce duplication, improve maintainability, and enhance code clarity.

### Overall Code Quality: **B+ (Good)**

**Strengths**:
- ✅ Clean hexagonal architecture with well-defined boundaries
- ✅ Comprehensive Zod validation on all entities
- ✅ Consistent error handling philosophy
- ✅ Good test coverage (37 unit/integration tests)
- ✅ Accessible frontend (WCAG 2.1 AA compliant)

**Areas for Improvement**:
- ⚠️ Significant boilerplate duplication in Vue composables (~40 lines repeated)
- ⚠️ Hardcoded magic numbers throughout (timeouts, limits, pagination)
- ⚠️ Inconsistent error logging (mix of console.log/console.error, no log levels)
- ⚠️ Some missing validation in critical flows
- ⚠️ Large files that should be split for better maintainability

---

## Refactoring Priority Matrix

| Priority | Impact | Effort | Items |
|----------|--------|--------|-------|
| **P0 - Critical** | High | Low | Extract `useAsync` composable (eliminates 40+ lines duplication) |
| **P1 - High** | High | Medium | Move magic numbers to config constants |
| **P1 - High** | High | Low | Fix API parameter consistency (OllamaAdapter signature mismatch) |
| **P2 - Medium** | Medium | Medium | Split large files (predefined-personas.js, PromptFileService.js) |
| **P2 - Medium** | Medium | Low | Standardize error logging (introduce logger utility) |
| **P3 - Low** | Low | Low | Remove debug console.log statements |
| **P3 - Low** | Low | Medium | Add missing edge-case tests |

---

## P0 - Critical Priority

### 1. Extract `useAsync` Composable (HIGHEST IMPACT)

**Issue**: Identical state management pattern repeated across 8+ composables

**Affected Files**:
- `/frontend/src/composables/useReflections.js` (12 occurrences)
- `/frontend/src/composables/usePersonas.js` (3 occurrences)
- `/frontend/src/composables/useTemplates.js` (4 occurrences)
- `/frontend/src/composables/useAIMirror.js` (2 occurrences)
- `/frontend/src/composables/useRephrasing.js` (2 occurrences)
- `/frontend/src/composables/usePreferences.js` (2 occurrences)

**Current Pattern** (repeated ~40+ times):
```javascript
const loading = ref(false);
const error = ref(null);

const someAsyncFunction = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.someCall();
    return response.data;
  } catch (err) {
    error.value = err.message;
    throw err;
  } finally {
    loading.value = false;
  }
};
```

**Proposed Solution**: Create `useAsync.js` composable

```javascript
// /frontend/src/composables/useAsync.js
import { ref } from 'vue';

/**
 * Wraps an async function with loading and error state management.
 * 
 * @param {Function} asyncFn - Async function to wrap
 * @returns {Object} { execute, loading, error, data, reset }
 * 
 * @example
 * const { execute, loading, error, data } = useAsync(async (id) => {
 *   const response = await api.getReflection(id);
 *   return response.data;
 * });
 * 
 * await execute(123); // data.value contains result
 */
export function useAsync(asyncFn) {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);

  const execute = async (...args) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await asyncFn(...args);
      data.value = result;
      return result;
    } catch (err) {
      error.value = err.message || 'An error occurred';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    loading.value = false;
    error.value = null;
    data.value = null;
  };

  return { execute, loading, error, data, reset };
}
```

**After Refactor** (example from `useReflections.js`):
```javascript
import { useAsync } from './useAsync';
import api from '../services/api';

export function useReflections() {
  const reflections = ref([]);
  
  const { execute: fetchAllAsync, loading, error } = useAsync(async (month) => {
    const response = await api.reflections.getAll(month);
    reflections.value = response.data;
    return response.data;
  });

  return {
    reflections,
    fetchAll: fetchAllAsync,
    loading,
    error
  };
}
```

**Benefits**:
- ✅ Eliminates ~40+ lines of duplication
- ✅ Consistent error handling across all composables
- ✅ Easier to add features (e.g., retry logic, request cancellation)
- ✅ Single source of truth for async state management

**Estimated Impact**: **HIGH** (reduces codebase by ~150 lines, improves maintainability)  
**Estimated Effort**: **2-3 hours** (create composable + refactor existing usage)

---

## P1 - High Priority

### 2. Move Magic Numbers to Configuration Constants

**Issue**: Hardcoded values throughout codebase make tuning difficult and obscure intent

**Affected Files & Examples**:

| File | Line | Value | Purpose |
|------|------|-------|---------|
| `useReflections.js` | 65 | `perPage: 50` | Pagination size |
| `OllamaAdapter.js` | 30, 45 | `120000` | API timeout (2 min) |
| `OllamaAdapter.js` | 45 | `0.7` | AI temperature |
| `OpenAIAdapter.js` | 31, 53 | `500` | Max tokens |
| `OpenAIAdapter.js` | 53 | `0.7` | AI temperature |
| `AnthropicAdapter.js` | 45 | `1024` | Max tokens |
| `AIMirrorService.js` | 136 | `5000` | Character limit |
| `ImageImport.vue` | 42 | `10485760` | Max file size (10MB) |
| `MarkdownEditor.vue` | 89 | `50000` | Max content length |

**Proposed Solution**: Create configuration files

```javascript
// /backend/src/config/constants.js
export const AI_CONFIG = {
  TIMEOUT_MS: 120000, // 2 minutes
  DEFAULT_TEMPERATURE: 0.7,
  MAX_TOKENS: {
    OPENAI: 500,
    ANTHROPIC: 1024,
    OLLAMA: 2000
  },
  CHARACTER_LIMITS: {
    REFLECTION: 50000,
    AI_RESPONSE: 5000
  }
};

export const STORAGE_CONFIG = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  REFLECTIONS_PER_PAGE: 50
};

// /frontend/src/config/constants.js
export const UI_CONFIG = {
  PAGINATION_SIZE: 50,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_CONTENT_LENGTH: 50000,
  TOAST_DURATION_MS: 3000
};
```

**After Refactor**:
```javascript
// Before:
const timeout = 120000;

// After:
import { AI_CONFIG } from '@/config/constants';
const timeout = AI_CONFIG.TIMEOUT_MS;
```

**Benefits**:
- ✅ Single source of truth for configuration values
- ✅ Easier to tune performance (change once, affects all usages)
- ✅ Self-documenting code (constant name explains purpose)
- ✅ Type-safe with JSDoc comments

**Estimated Impact**: **HIGH** (improves maintainability, makes tuning easier)  
**Estimated Effort**: **2-3 hours** (create constants files + refactor ~20 usages)

---

### 3. Fix API Parameter Consistency (OllamaAdapter Signature Mismatch)

**Issue**: Inconsistent function signatures between AI adapters

**Affected Files**:
- `/backend/src/adapters/ai/OllamaAdapter.js:24`
- `/backend/src/adapters/ai/OpenAIAdapter.js:22`
- `/backend/src/domain/services/AIMirrorService.js:107`

**Current State** (broken):
```javascript
// OllamaAdapter.js - expects 2 parameters
async generateResponse(prompt, options = {}) {
  // ...
}

// AIMirrorService.js - passes 3 parameters
const response = await provider.generateResponse(
  systemPrompt.prompt,  // arg 1
  userReflection,        // arg 2
  { model }              // arg 3 - ignored!
);
```

**Proposed Solution**: Standardize interface across all adapters

```javascript
// /backend/src/domain/ports/IAIProvider.js
/**
 * AI Provider interface
 */
export default class IAIProvider {
  /**
   * Generate AI response
   * @param {string} systemPrompt - System/persona prompt
   * @param {string} userMessage - User's reflection text
   * @param {Object} options - Generation options
   * @param {string} options.model - Model name (e.g., 'llama2', 'gpt-4')
   * @param {number} options.temperature - Randomness (0-1)
   * @param {number} options.maxTokens - Max response length
   * @returns {Promise<string>} AI response text
   */
  async generateResponse(systemPrompt, userMessage, options = {}) {
    throw new Error('generateResponse() must be implemented');
  }
  
  // ... other methods
}
```

**Update all adapters**:
```javascript
// OllamaAdapter.js
async generateResponse(systemPrompt, userMessage, options = {}) {
  const { model = 'llama2', temperature = 0.7, maxTokens } = options;
  // ... implementation
}

// OpenAIAdapter.js
async generateResponse(systemPrompt, userMessage, options = {}) {
  const { model = 'gpt-3.5-turbo', temperature = 0.7, maxTokens = 500 } = options;
  // ... implementation
}

// AnthropicAdapter.js
async generateResponse(systemPrompt, userMessage, options = {}) {
  const { model = 'claude-3-sonnet-20240229', temperature = 0.7, maxTokens = 1024 } = options;
  // ... implementation
}
```

**Benefits**:
- ✅ Fixes actual bug (model parameter currently ignored by Ollama)
- ✅ Consistent interface across all AI providers
- ✅ Easier to add new providers (clear contract)
- ✅ Better testability

**Estimated Impact**: **HIGH** (fixes bug, improves API consistency)  
**Estimated Effort**: **1 hour** (update 3 adapters + 1 service)

---

## P2 - Medium Priority

### 4. Split Large Files

**Issue**: Some files exceed 300 lines and have multiple responsibilities

#### 4a. Split `predefined-personas.js` (320 lines)

**Current Structure**:
```
/backend/src/domain/entities/predefined-personas.js (320 lines)
├─ Socratic Guide (80 lines)
├─ Inner Critic Befriender (80 lines)
├─ Gratitude Amplifier (80 lines)
└─ Transition Mapper (80 lines)
```

**Proposed Structure**:
```
/backend/src/domain/entities/personas/
├─ index.js (exports all personas)
├─ socratic-guide.js
├─ inner-critic-befriender.js
├─ gratitude-amplifier.js
└─ transition-mapper.js
```

**Example** (`socratic-guide.js`):
```javascript
export const SocraticGuide = {
  id: 'socratic-guide',
  name: 'Socratic Guide',
  style: 'Questioning and curious',
  description: 'Asks thoughtful questions to help you explore your own thinking.',
  systemPrompt: `You are a Socratic guide...`,
  icon: '🤔',
  color: '#4A90E2',
  tags: ['philosophy', 'questioning', 'self-discovery']
};
```

**Benefits**:
- ✅ Easier to find specific persona
- ✅ Cleaner git diffs when editing single persona
- ✅ Easier to add new personas (copy template)
- ✅ Each file under 100 lines

**Estimated Impact**: **MEDIUM** (improves maintainability)  
**Estimated Effort**: **1 hour** (split file + update imports)

---

#### 4b. Extract Complex Logic from `PromptFileService.js` (210 lines)

**Issue**: `loadFromFolders()` method is 60+ lines with nested loops

**Current State**:
```javascript
// Lines 85-145: Complex folder traversal + file reading
async loadFromFolders() {
  // Nested loops, error handling, path manipulation
  // 60+ lines of complex logic
}
```

**Proposed Solution**: Extract to utility module

```javascript
// /backend/src/utils/folderLoader.js
export async function loadPromptsFromFolder(folderPath) {
  // Extracted logic
}

// PromptFileService.js
import { loadPromptsFromFolder } from '../utils/folderLoader.js';

async loadFromFolders() {
  const prompts = await loadPromptsFromFolder(this.baseDir);
  return prompts;
}
```

**Benefits**:
- ✅ More testable (utility can be tested independently)
- ✅ Reusable (other services might need folder loading)
- ✅ PromptFileService focuses on orchestration, not implementation

**Estimated Impact**: **MEDIUM** (improves testability)  
**Estimated Effort**: **1-2 hours** (extract + write tests)

---

### 5. Standardize Error Logging

**Issue**: Mix of `console.log`, `console.error`, `console.warn` with no log level control

**Affected Files** (examples):
- `PromptFileService.js:39,47,63,67` - Production debug logs
- `AIMirrorService.js:161-165` - Debug logs in prod
- `LocalFileRepository.js:237-240` - Silent error swallowing

**Current State**:
```javascript
// No log level control
console.log('[PromptFileService] Loading prompts...');
console.error('[Error]', err);
// Silent error
catch { /* ignore */ }
```

**Proposed Solution**: Create simple logger utility

```javascript
// /backend/src/utils/logger.js
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor(level = process.env.LOG_LEVEL || 'INFO') {
    this.level = LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO;
  }

  error(message, ...args) {
    if (this.level >= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  warn(message, ...args) {
    if (this.level >= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  info(message, ...args) {
    if (this.level >= LOG_LEVELS.INFO) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }

  debug(message, ...args) {
    if (this.level >= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
}

export default new Logger();
```

**Usage**:
```javascript
// Before:
console.log('[PromptFileService] Loading prompts...');

// After:
import logger from '@/utils/logger';
logger.debug('PromptFileService: Loading prompts...');
```

**Benefits**:
- ✅ Control verbosity via `LOG_LEVEL` env var
- ✅ Cleaner production logs (set `LOG_LEVEL=ERROR` in prod)
- ✅ Consistent log format
- ✅ Easy to extend (add file logging, remote logging, etc.)

**Estimated Impact**: **MEDIUM** (improves debugging, cleaner prod logs)  
**Estimated Effort**: **2-3 hours** (create logger + refactor ~30 usages)

---

## P3 - Low Priority

### 6. Remove Debug Console.log Statements

**Issue**: Production code contains debug logging

**Affected Files**:
- `predefined-personas.js:15-35` - 21 lines of `console.log` calls
- `PromptFileService.js:39,47,63,67` - Debug logs
- `AIMirrorService.js:161-165` - Debug logs

**Proposed Solution**: Remove or convert to logger.debug() (see Proposal #5)

**Benefits**:
- ✅ Cleaner production logs
- ✅ Smaller bundle size (minor)

**Estimated Impact**: **LOW**  
**Estimated Effort**: **30 minutes** (remove ~30 statements)

---

### 7. Fix Silent Error Swallowing

**Issue**: Some error handlers silently ignore errors without logging

**Example** (`LocalFileRepository.js:237-240`):
```javascript
try {
  await fs.rmdir(monthDir);
} catch {
  // Directory not empty or other error, ignore ❌
}
```

**Proposed Solution**: At minimum, log the error
```javascript
try {
  await fs.rmdir(monthDir);
} catch (err) {
  // Expected: ENOTEMPTY if directory has files
  // Unexpected: permission errors, I/O errors
  if (err.code !== 'ENOTEMPTY') {
    logger.warn(`Failed to remove directory ${monthDir}:`, err.message);
  }
}
```

**Benefits**:
- ✅ Easier debugging when issues occur
- ✅ Distinguish expected errors from unexpected ones

**Estimated Impact**: **LOW**  
**Estimated Effort**: **30 minutes** (review + fix 5-10 instances)

---

### 8. Fix Duplicate Code in `useReflections.js`

**Issue**: Line 281 has duplicate property assignment

**File**: `/frontend/src/composables/useReflections.js:281`

**Current Code**:
```javascript
reflection.externalAISession = response.data.externalAISession || response.data.externalAISession || sessionData;
```

**Fix**:
```javascript
reflection.externalAISession = response.data.externalAISession || sessionData;
```

**Estimated Impact**: **LOW** (bug, but no functional impact)  
**Estimated Effort**: **1 minute**

---

### 9. Add Missing Edge-Case Tests

**Issue**: Some complex logic lacks edge-case test coverage

**Missing Test Scenarios**:

1. **`LocalFileRepository`**:
   - Data corruption recovery (malformed JSON)
   - Concurrent write scenarios
   - File system permission errors
   - Disk full errors

2. **`AIMirrorService._validateResponse()`** (lines 204-227):
   - Regex pattern edge cases (markdown variations)
   - Truncation behavior when response too long
   - Invalid UTF-8 characters

3. **`services/api.js` response interceptors**:
   - Network timeout handling
   - 429 rate limiting responses
   - Refresh token scenarios (if added in future)

4. **`MarkdownEditor.vue` keyboard shortcuts**:
   - Edge cases (empty selection, cursor at start/end)
   - Multiple selections
   - Nested formatting (bold inside italic)

**Proposed Approach**:
```javascript
// Example: LocalFileRepository corruption recovery test
describe('LocalFileRepository - Error Handling', () => {
  it('should recover from malformed JSON', async () => {
    // Create corrupted file
    await fs.writeFile(reflectionPath, '{ invalid json }');
    
    // Should throw descriptive error
    await expect(repo.findById(id))
      .rejects.toThrow('Reflection file corrupted');
  });
});
```

**Benefits**:
- ✅ Catch edge-case bugs before production
- ✅ More confidence in refactoring
- ✅ Documentation of expected behavior

**Estimated Impact**: **LOW** (tests are defensive, app works without them)  
**Estimated Effort**: **4-6 hours** (write ~15-20 new test cases)

---

## Quick Wins (< 30 minutes each)

1. **Fix duplicate assignment** in `useReflections.js:281`
2. **Add logger.warn** to `LocalFileRepository.js:237-240`
3. **Remove console.log** from `predefined-personas.js:15-35`
4. **Add JSDoc comments** to `IAIProvider` interface methods
5. **Extract constants** from `ImageImport.vue` (max file size)

---

## Anti-Patterns & Code Smells (Observations)

### Observed Patterns (Not Critical, FYI)

1. **Try-Catch Without Type Checking**:
   - Pattern: `catch (err)` without checking error type
   - Recommendation: Consider error type checking for different handling strategies

2. **State Mutation in Finally Blocks**:
   - Current: Good pattern, but some composables don't use (inconsistent)
   - Recommendation: Adopt consistently (or use `useAsync` proposal)

3. **Implicit Null Checks**:
   - Pattern: `response.data?.suggestions || []`
   - Note: Good defensive programming, but consider making optional chaining explicit in docs

4. **Console Logging in Production**:
   - Issue: Mix of `console.log`, `console.error`, no log levels
   - Recommendation: See Proposal #5 (Logger utility)

---

## Not Recommended for Refactoring

### Things That Are Fine As-Is

1. **JSON File Storage**: Some might suggest database, but JSON files are appropriate for this use case
2. **Express Route Handlers**: Some are long but clear and readable
3. **Vue Component Size**: Most components are well-sized (100-200 lines)
4. **Zod Validation**: Comprehensive and well-structured
5. **Error Handler Middleware**: Centralized and effective

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] P0-1: Extract `useAsync` composable
- [ ] P1-2: Move magic numbers to constants
- [ ] P1-3: Fix OllamaAdapter signature

### Phase 2: Structure (Week 2)
- [ ] P2-4a: Split predefined-personas.js
- [ ] P2-4b: Extract folder loading utility
- [ ] P2-5: Create logger utility

### Phase 3: Polish (Week 3)
- [ ] P3-6: Remove debug console.log
- [ ] P3-7: Fix silent error swallowing
- [ ] P3-8: Fix duplicate assignment
- [ ] Quick wins

### Phase 4: Testing (Week 4)
- [ ] P3-9: Add missing edge-case tests

---

## Success Metrics

After implementing proposals, measure:

| Metric | Before | Target | How to Measure |
|--------|--------|--------|----------------|
| **Lines of Duplication** | ~150 | ~10 | Grep for async/await patterns |
| **Magic Numbers** | ~20 | 0 | Grep for hardcoded numbers |
| **Console.log in Prod** | ~30 | 0 | Grep for console.log |
| **Files > 300 Lines** | 2 | 0 | `wc -l` on key files |
| **Test Coverage** | 85% | 90% | `npm run test:coverage` |

---

## Conclusion

The Laboratory of Life codebase is **well-architected and maintainable**. The proposed refactorings are **optimizations, not critical fixes**. The P0 and P1 proposals offer the highest ROI and should be prioritized.

**Recommended First Steps**:
1. Extract `useAsync` composable (P0-1) - Biggest impact
2. Fix OllamaAdapter signature (P1-3) - Bug fix
3. Move magic numbers to constants (P1-2) - Improves maintainability

---

*Last Updated: 2026-01-29*  
*Next Review: After implementing Phase 1 proposals*
