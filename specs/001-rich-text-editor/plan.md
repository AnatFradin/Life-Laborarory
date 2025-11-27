# Implementation Plan: Rich Text Editor with Markdown Support

**Branch**: `001-rich-text-editor` | **Date**: November 27, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-rich-text-editor/spec.md`

## Summary

Add rich text editing capabilities to the reflection editor with three priority levels:
1. **P1 (MVP)**: Markdown editing with live preview - users can write reflections using Markdown syntax (headings, bold, italic, lists, links) and toggle between edit and preview modes
2. **P2 (Accessibility)**: Formatting toolbar - visual buttons for non-Markdown users to apply formatting via clicks and keyboard shortcuts
3. **P3 (Enhancement)**: AI-powered rephrasing - select text and request AI to rephrase for clarity, positivity, or constructiveness

**Technical Approach**: Use marked.js (well-tested Markdown parser with XSS protection) for rendering. Build on existing ReflectionEditor component. Store reflections as plain text with Markdown (no schema changes). Preview uses debouncing (200ms) for performance. AI rephrasing reuses AIMirrorService with new system prompts. Maintain calm UX with gentle transitions and no distracting animations.

## Technical Context

**Language/Version**: Node.js 18+ (backend), Vue 3 (frontend with Composition API)  
**Primary Dependencies**: 
- Backend: Express.js (simple, well-documented), fs/promises for file operations
- AI (Future): Ollama (local models - default), optional OpenAI/Anthropic API (online - requires opt-in)
- Frontend: Vue 3, Vite (fast dev server & build tool), Vue Router (for navigation)
- Testing: Vitest (Vue-friendly Jest alternative) for unit tests, optional Playwright for e2e

**Storage**: Local JSON files in `data/` directory (can be placed in iCloud Drive for sync)  
**Testing**: Jest for unit/integration tests, smoke tests for main flows (write → save → view history)  
**Target Platform**: macOS (primary), cross-platform web app (runs locally via localhost)  
**Project Type**: Web application (local-first, single-user)  
**Performance Goals**: 
- Instant application load (< 2 seconds on modest hardware)
- UI interactions < 100ms response time
- File operations feel immediate (< 500ms for save/load)

**Constraints**: 
- Offline-capable (no internet required; AI features work via local Ollama by default)
- Runs entirely on user's machine
- Data never leaves device unless user explicitly exports OR chooses online AI API
- When online AI used, clear warning that reflection content is sent to external service
- Minimal memory footprint (< 200MB excluding AI models)
- Accessible via keyboard only
- WCAG 2.1 Level AA compliance

**Scale/Scope**: 
- Single user
- ~10-100 reflection entries per month expected
- Simple UI: 3-5 main screens/views
- No authentication/accounts
- No backend database (just file system)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I - Small Steps**: ✅ **PASS** - Feature broken into 3 independently testable priorities (P1, P2, P3). Each can be completed in focused sessions. P1 alone is viable MVP.

**Principle II - Test-First Development**: ✅ **PASS** - Plan includes unit tests for Markdown rendering, toolbar actions, AI integration. Acceptance tests defined in spec for each user story.

**Principle III - AI Assistant Guidelines**: ✅ **PASS** - No auto-commits. Tests will be created and run before review. Implementation follows red-green-refactor.

**Product Alignment - AI as Mirror** (from product spec): ✅ **PASS** - AI rephrasing (P3) is reflective, not prescriptive. Offers alternatives without diagnosis. User maintains agency (accept/reject). Local AI (Ollama) default with privacy warning for online APIs.

**Product Alignment - Multiple Forms**: ✅ **PASS** - Markdown enhances text reflections without overshadowing other modes. Visual mode remains equally prominent (SC-019). Plain text still fully supported.

**Product Alignment - Calm Experience**: ✅ **PASS** - FR-027: Gentle transitions (200ms max), calm colors, no attention-grabbing animations. FR-013: Toolbar uses calm design. SC-014/SC-015 measure calm UX.

**Product Alignment - Local-First**: ✅ **PASS** - FR-004: Reflections stored locally as plain text. FR-026: Only selected text sent to AI (not entire reflection). No cloud dependencies.

**Product Alignment - Trace of Becoming**: ✅ **PASS** - Markdown reflections persist with timestamps. Export preserved (SC-017). History view works (User Story 1, scenario 5).

**Product Alignment - Reversibility**: ✅ **PASS** - FR-007: Undo/redo for 50 operations. FR-025: AI suggestions undoable. Markdown stored as plain text (can be exported/deleted).

**Product Alignment - Accessibility**: ✅ **PASS** - FR-014: Keyboard navigation. FR-012: Keyboard shortcuts. FR-028: WCAG 2.1 Level AA. SC-007/SC-013 validate accessibility.

**Non-Goals Check**: ✅ **PASS** - No accounts, analytics, cloud sync, gamification, or social features. Explicitly excludes WYSIWYG, extended Markdown, collaborative editing.

**DoD Alignment**: ✅ **PASS** - Has Spec + Plan (this file) + Tasks (next phase). Tests defined. Keyboard navigation required. Local persistence maintained. Markdown export natural. Docs will be updated.

**Quality Bar**: ✅ **PASS** - SC-001: 200ms preview performance. SC-006: 100ms toolbar. SC-016: Smooth with 10,000 word reflections. FR-026: Privacy preserved (only selected text to AI).

**✅ PASS** - All constitution and product principles satisfied. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ReflectionEditor.vue           # EXISTING - base editor component
│   │   ├── MarkdownEditor.vue             # NEW - extends ReflectionEditor with Markdown
│   │   ├── MarkdownToolbar.vue            # NEW (P2) - formatting toolbar
│   │   ├── MarkdownPreview.vue            # NEW (P1) - rendered preview pane
│   │   ├── RephraseDialog.vue             # NEW (P3) - AI rephrasing UI
│   │   └── LinkDialog.vue                 # NEW (P2) - URL input for links
│   ├── composables/
│   │   ├── useMarkdownEditor.js           # NEW - editor state & logic
│   │   ├── useMarkdownToolbar.js          # NEW (P2) - toolbar actions
│   │   └── useRephrasing.js               # NEW (P3) - AI rephrasing logic
│   ├── utils/
│   │   ├── markdown.js                    # NEW - marked.js wrapper & sanitization
│   │   └── markdownShortcuts.js           # NEW (P2) - keyboard shortcut handlers
│   └── styles/
│       ├── markdown-editor.css            # NEW - calm editor styles
│       └── markdown-preview.css           # NEW - calm preview styles
└── tests/
    └── unit/
        ├── MarkdownEditor.test.js         # NEW - P1 tests
        ├── MarkdownToolbar.test.js        # NEW - P2 tests
        ├── RephraseDialog.test.js         # NEW - P3 tests
        └── markdown.test.js               # NEW - utility tests

backend/
├── src/
│   ├── domain/
│   │   └── services/
│   │       └── AIMirrorService.js         # EXISTING - extend for rephrasing
│   └── adapters/
│       └── ai/
│           ├── OllamaAdapter.js           # EXISTING - extend rephrasing prompts
│           └── rephrasing-prompts.js      # NEW (P3) - system prompts for styles
└── tests/
    └── unit/
        └── RephraseService.test.js        # NEW (P3) - rephrasing logic tests

data/
└── reflections/                           # EXISTING - no changes needed
    └── 2025-11/                          # Markdown stored as plain text
        └── *.json                         # content field contains Markdown

package.json                               # UPDATE - add marked & DOMPurify deps
```

**Structure Decision**: 
- **Frontend-heavy**: Most changes in Vue components since this is a UI feature
- **Reuse Existing**: Builds on ReflectionEditor.vue, doesn't replace it
- **Composables Pattern**: Vue 3 Composition API for reusable logic (editor state, toolbar, rephrasing)
- **P1/P2/P3 Separation**: Components clearly marked by priority for incremental implementation
- **No Backend Changes for P1/P2**: Only P3 (AI rephrasing) requires backend modifications
- **No Data Migration**: Existing reflections work as-is; Markdown is just text content

**Key Dependencies**:
- **marked.js** (P1): Fast, secure Markdown parser (MIT license, 50K+ stars)
- **DOMPurify** (P1): XSS sanitization (trusted by Mozilla, Google)
- Both are lightweight (~25KB combined minified) and well-maintained

## Complexity Tracking

✅ **No violations** - All constitution and product principles satisfied. No complexity justification needed.

---

## Planning Summary

**Phase 0 (Research)**: ✅ Complete - All technology decisions documented in [research.md](./research.md)  
**Phase 1 (Design)**: ✅ Complete - Data model, API contracts, and quickstart guide created  
**Phase 2 (Tasks)**: ⏳ Pending - Use `/speckit.tasks` command to generate tasks.md

**Key Deliverables**:
- ✅ [plan.md](./plan.md) - This implementation plan
- ✅ [research.md](./research.md) - Technology research and decisions
- ✅ [data-model.md](./data-model.md) - Entity definitions and relationships
- ✅ [contracts/ai-rephrasing.openapi.yaml](./contracts/ai-rephrasing.openapi.yaml) - API specification for P3
- ✅ [quickstart.md](./quickstart.md) - Developer implementation guide
- ⏳ tasks.md - Pending (next phase)

**Agent Context**: ✅ Updated - GitHub Copilot context includes new dependencies (marked.js, DOMPurify)

**Next Step**: Run `/speckit.tasks` command to generate task breakdown for implementation.

---

## Phase 0: Research & Technology Decisions

### Research Tasks

1. **Markdown Library Selection**
   - **Decision**: Use marked.js v11+ with DOMPurify v3+
   - **Rationale**: 
     - marked.js: Most popular (50K+ stars), fast (500ms for 100KB), CommonMark compliant, actively maintained
     - DOMPurify: Industry standard for XSS prevention (used by Mozilla, Google)
     - Both have TypeScript types available
   - **Alternatives Considered**:
     - markdown-it: More features but heavier (40KB vs 25KB)
     - showdown: Older, less maintained
     - remark: More complex API, overkill for our needs

2. **Editor State Management**
   - **Decision**: Vue 3 Composition API with reactive refs
   - **Rationale**:
     - Native Vue pattern, no additional dependencies
     - `useMarkdownEditor` composable for reusable logic
     - Easy to test in isolation
   - **Alternatives Considered**:
     - Pinia store: Too heavy for editor-specific state
     - Plain JavaScript: Loses Vue reactivity benefits

3. **Preview Rendering Strategy**
   - **Decision**: Debounced rendering (200ms after typing stops)
   - **Rationale**:
     - Meets SC-001 performance requirement (< 200ms)
     - Prevents excessive re-renders during rapid typing
     - Balances responsiveness with performance
   - **Alternatives Considered**:
     - Instant rendering: Too CPU-intensive for large docs
     - Manual trigger: Poor UX, requires extra user action

4. **Toolbar Implementation Pattern**
   - **Decision**: Action-based buttons that insert Markdown syntax
   - **Rationale**:
     - Simple: no need to track selection state constantly
     - Predictable: users see Markdown syntax, understand what's happening
     - Accessible: clear button labels with aria attributes
   - **Alternatives Considered**:
     - WYSIWYG toolbar: Violates spec (explicitly out of scope)
     - Context-aware toolbar: Complex state management

5. **AI Rephrasing Architecture**
   - **Decision**: Extend AIMirrorService with new system prompts
   - **Rationale**:
     - Reuses existing Ollama/OpenAI infrastructure
     - Three prompt templates for each style (clearer, positive, constructive)
     - Same privacy model: user controls AI selection
   - **Alternatives Considered**:
     - Separate service: Code duplication
     - Client-side AI: Too heavy for browser

### Best Practices Research

**Markdown Rendering Security**:
- Always sanitize HTML output with DOMPurify
- Use marked.js `sanitize: true` option as first line of defense
- Configure DOMPurify to allow only safe tags: `<h1-h6>, <p>, <a>, <ul>, <ol>, <li>, <strong>, <em>, <code>, <pre>, <blockquote>`
- Never use `innerHTML` directly, always `DOMPurify.sanitize()` first

**Accessible Toolbar Design**:
- Use `<button>` elements, not `<div>` with click handlers
- Include visible text labels (not just icons)
- Add `aria-label` for screen readers
- Support keyboard navigation: Tab to focus, Enter/Space to activate
- Show visual focus indicators (FR-028: WCAG 2.1 Level AA)

**Performance Optimization**:
- Debounce preview updates (lodash.debounce or custom)
- Use `v-show` for mode toggle (keep both DOM nodes, just hide/show)
- Avoid parsing Markdown on every keystroke
- For large docs (10K+ words), consider virtual scrolling in preview

**Vue 3 Composition API Patterns**:
- One composable per concern (`useMarkdownEditor`, `useMarkdownToolbar`, `useRephrasing`)
- Return reactive state and methods as object
- Use `toRefs()` to preserve reactivity when destructuring
- Keep composables testable (no hard-coded dependencies)
