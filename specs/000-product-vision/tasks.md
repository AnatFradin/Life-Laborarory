# Tasks: Laboratory of Life — Product Vision

**Input**: Design documents from `/specs/000-product-vision/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the feature specification. This follows the YAGNI principle from the constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with backend and frontend:
- **Backend**: `backend/src/` (Node.js + Express)
- **Frontend**: `frontend/src/` (Vue 3 + Vite)
- **Data**: `data/` (gitignored, local JSON storage)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure per plan.md: backend/src/{domain,adapters,config}/, backend/tests/{unit,integration,smoke}/
- [X] T002 Create frontend directory structure per plan.md: frontend/src/{components,views,services,composables,router,styles}/, frontend/tests/{unit,e2e}/
- [X] T003 [P] Initialize backend: package.json with Node.js 18+, Express, Zod, fs/promises dependencies
- [X] T004 [P] Initialize frontend: package.json with Vue 3, Vite, Vue Router, Radix Vue, axios dependencies
- [X] T005 [P] Configure ESLint and Prettier for both backend and frontend in respective .eslintrc.js files
- [X] T006 [P] Create .gitignore with data/, node_modules/, dist/, .env entries
- [X] T007 [P] Setup Vitest configuration in backend/vitest.config.js and frontend/vitest.config.js
- [X] T008 [P] Setup Playwright configuration in frontend/playwright.config.js for e2e tests
- [X] T009 Create data directory structure: data/{reflections,visuals,exports}/, data/preferences.json with default settings
- [X] T010 Create README.md at repository root with project overview and setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Create domain ports in backend/src/domain/ports/IReflectionRepository.js with async methods: save, findById, findAll, deleteById, deleteAll
- [X] T012 [P] Create domain port in backend/src/domain/ports/IAIProvider.js with async generateResponse method
- [X] T013 [P] Create domain port in backend/src/domain/ports/IExporter.js with async exportToMarkdown method
- [X] T014 Create Reflection entity in backend/src/domain/entities/Reflection.js with Zod schema validation (id, timestamp, mode, content, visualAttachment, aiInteraction, metadata)
- [X] T015 [P] Create AIInteraction entity in backend/src/domain/entities/AIInteraction.js with Zod schema (model, provider, prompt, response, timestamp, systemPromptVersion)
- [X] T016 [P] Create UserPreferences entity in backend/src/domain/entities/UserPreferences.js with Zod schema and state machine validation (aiProvider, localModel, onlineModel, hasAcknowledgedOnlineWarning, language, theme)
- [X] T017 Create Express server in backend/src/server.js with CORS configuration for http://localhost:5173, JSON body parser, and basic error handling
- [X] T018 [P] Create configuration in backend/src/config/index.js with environment variables for port, data directory path, Ollama URL
- [X] T019 [P] Create error handler middleware in backend/src/adapters/http/middleware/errorHandler.js with gentle, solution-focused error messages per FR-028
- [X] T020 [P] Create validation middleware in backend/src/adapters/http/middleware/validation.js using Zod for request validation
- [X] T021 Create Vue app entry in frontend/src/main.js with Vue Router initialization and global styles
- [X] T022 [P] Create Vue Router configuration in frontend/src/router/index.js with routes: /, /history, /settings, /export
- [X] T023 [P] Create root App component in frontend/src/App.vue with router-view and calm, accessible layout
- [X] T024 [P] Create calm color palette in frontend/src/styles/main.css with WCAG 2.1 AA contrast ratios (FR-005)
- [X] T025 [P] Create accessibility styles in frontend/src/styles/accessibility.css with visible focus indicators per FR-023
- [X] T026 [P] Create API client service in frontend/src/services/api.js with axios instance configured for http://localhost:3000/api
- [X] T027 Create LocalFileRepository adapter in backend/src/adapters/storage/LocalFileRepository.js implementing IReflectionRepository with atomic writes (temp file + rename pattern) and month-based organization
- [X] T028 [P] Create system prompt v1.0.0 in backend/src/adapters/ai/prompts/system-prompt-v1.js with reflective, non-directive language per FR-009, FR-010, FR-011

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Private Self-Reflection Session (Priority: P1) 🎯 MVP

**Goal**: Users can write text reflections, receive gentle AI mirroring from local Ollama, and have all data stored locally without network calls

**Independent Test**: Write a reflection, request AI feedback via local Ollama model, verify no network activity occurred (except to localhost:11434 for Ollama), confirm reflection persists after page reload

### Implementation for User Story 1

- [X] T029 [P] [US1] Create ReflectionService in backend/src/domain/services/ReflectionService.js with createReflection, getReflectionById, getAllReflections methods
- [X] T030 [P] [US1] Create AIMirrorService in backend/src/domain/services/AIMirrorService.js with generateReflection method, system prompt v1.0.0, and non-directive response validation
- [X] T031 [US1] Create OllamaAdapter in backend/src/adapters/ai/OllamaAdapter.js implementing IAIProvider with fetch calls to http://localhost:11434/api/generate
- [X] T032 [US1] Create reflections routes in backend/src/adapters/http/routes/reflections.js with GET /api/reflections, POST /api/reflections, GET /api/reflections/:id endpoints
- [X] T033 [P] [US1] Create AI mirror route in backend/src/adapters/http/routes/ai.js with POST /api/ai/mirror endpoint
- [X] T034 [US1] Register routes in backend/src/server.js: mount /api/reflections and /api/ai routes
- [X] T035 [P] [US1] Create useReflections composable in frontend/src/composables/useReflections.js with reactive state (reflections, loading) and methods (loadReflections, createReflection)
- [X] T036 [P] [US1] Create useAIMirror composable in frontend/src/composables/useAIMirror.js with generateMirrorResponse method and loading state
- [X] T037 [US1] Create ReflectionEditor component in frontend/src/components/ReflectionEditor.vue with textarea, autosave (debounced), manual save button, AI feedback button, and keyboard shortcuts (Cmd+Enter to save)
- [X] T038 [P] [US1] Create AIMirrorPanel component in frontend/src/components/AIMirrorPanel.vue to display AI response with calm, reflective styling
- [X] T039 [US1] Create ComposeView in frontend/src/views/ComposeView.vue integrating ReflectionEditor and AIMirrorPanel with calm, uncluttered layout (max 3 choices per FR-001)
- [X] T040 [P] [US1] Create ReflectionList component in frontend/src/components/ReflectionList.vue displaying reflections chronologically with human-readable timestamps per FR-004
- [X] T041 [US1] Create HistoryView in frontend/src/views/HistoryView.vue using ReflectionList with full keyboard navigation per FR-022
- [X] T042 [US1] Add ARIA labels and roles to ReflectionEditor per FR-024 for screen reader compatibility
- [X] T043 [US1] Add visible focus indicators to all interactive elements per FR-023
- [X] T044 [US1] Implement local-only indicator in ComposeView showing "Local processing only" badge per FR-019

**Checkpoint**: User Story 1 complete - users can write reflections, get local AI feedback, view history, all fully accessible

---

## Phase 4: User Story 3 - Data Sovereignty and Export (Priority: P1)

**Goal**: Users have complete control over data - export to Markdown, delete specific entries, wipe everything - with zero friction

**Independent Test**: Create several reflections, export to Markdown (verify format), delete one reflection (verify removal), delete all data (verify complete wipe with 2-step confirmation)

### Implementation for User Story 3

- [X] T045 [P] [US3] Create ExportService in backend/src/domain/services/ExportService.js with exportAllToMarkdown method generating well-formatted Markdown with human-readable timestamps
- [X] T046 [US3] Create MarkdownExporter adapter in backend/src/adapters/export/MarkdownExporter.js implementing IExporter with support for single-file (base64 images) and folder (separate images) formats per data-model.md
- [X] T047 [US3] Add deleteReflection and deleteAllReflections methods to ReflectionService in backend/src/domain/services/ReflectionService.js with permanent deletion
- [ ] T048 [US3] Create export route in backend/src/adapters/http/routes/export.js with POST /api/export endpoint accepting exportFormat parameter
- [ ] T049 [P] [US3] Add DELETE /api/reflections/:id endpoint to backend/src/adapters/http/routes/reflections.js with single confirmation
- [ ] T050 [P] [US3] Add POST /api/reflections/delete-all endpoint to backend/src/adapters/http/routes/reflections.js requiring "DELETE_ALL" confirmation string per FR-017
- [ ] T051 [US3] Register export route in backend/src/server.js: mount /api/export
- [ ] T052 [P] [US3] Create ExportDialog component in frontend/src/components/ExportDialog.vue using Radix Vue Dialog with format choice (single-file vs folder, folder default) and accessible confirmation
- [ ] T053 [P] [US3] Create DeleteDialog component in frontend/src/components/DeleteDialog.vue using Radix Vue Dialog for single-entry deletion with confirmation
- [ ] T054 [P] [US3] Create DeleteAllDialog component in frontend/src/components/DeleteAllDialog.vue using Radix Vue Dialog with 2-step confirmation process per FR-017
- [ ] T055 [US3] Create ExportView in frontend/src/views/ExportView.vue with export button, delete all button, calm layout, full keyboard navigation
- [ ] T056 [US3] Add delete button to each reflection in ReflectionList component with confirmation dialog trigger
- [ ] T057 [US3] Implement export download functionality in ExportView: trigger browser download of generated Markdown file
- [ ] T058 [US3] Add keyboard shortcut Escape to close all dialogs per FR-027
- [ ] T059 [US3] Ensure all delete/export actions are reversible through export before delete (guidance text in dialogs)

**Checkpoint**: User Story 3 complete - users have full data control with accessible export and delete functions

---

## Phase 5: User Story 5 - Accessible Keyboard Navigation (Priority: P1)

**Goal**: Keyboard-only and screen reader users can access all features with the same ease as mouse users

**Independent Test**: Navigate entire application using only keyboard (Tab, Enter, Esc, arrows), verify all actions accessible, test with VoiceOver/NVDA to confirm proper announcements

### Implementation for User Story 5

- [ ] T060 [P] [US5] Add tabindex and focus management to ComposeView in frontend/src/views/ComposeView.vue ensuring logical tab order per FR-026
- [ ] T061 [P] [US5] Add keyboard shortcuts documentation in frontend/src/components/KeyboardShortcutsHelp.vue (accessible via Shift+? per FR-027)
- [ ] T062 [P] [US5] Implement focus trap in all Radix Vue dialogs (ExportDialog, DeleteDialog, DeleteAllDialog) for accessibility
- [ ] T063 [US5] Add skip-to-main-content link in frontend/src/App.vue for screen reader users
- [ ] T064 [P] [US5] Ensure ReflectionEditor has proper label association (label for="reflection-input") and aria-describedby for hints
- [ ] T065 [P] [US5] Add aria-live region in AIMirrorPanel for announcing AI response completion to screen readers
- [ ] T066 [US5] Implement keyboard navigation (arrow keys + Enter) in ReflectionList for selecting reflections per FR-027
- [ ] T067 [US5] Add aria-busy state to save/AI feedback buttons while processing per FR-024
- [ ] T068 [US5] Configure axe-core accessibility testing in frontend/tests/e2e/ and run against all views
- [ ] T069 [US5] Fix any WCAG 2.1 Level AA violations identified by axe-core per FR-023 through FR-027
- [ ] T070 [US5] Create accessibility testing checklist in specs/000-product-vision/checklists/accessibility.md with VoiceOver/NVDA test scenarios

**Checkpoint**: User Story 5 complete - application fully accessible via keyboard and screen reader

---

## Phase 6: User Story 4 - Choose AI Privacy Level (Priority: P2)

**Goal**: Users can decide between local AI (complete privacy) or online AI (more capable but data leaves device) based on their needs

**Independent Test**: Switch between local and online models in settings, verify clear warnings for online use, confirm local model processes offline (no network to OpenAI/Anthropic), verify online model connects properly with explicit warning

### Implementation for User Story 4

- [ ] T071 [P] [US4] Create OpenAIAdapter in backend/src/adapters/ai/OpenAIAdapter.js implementing IAIProvider using OpenAI SDK
- [ ] T072 [P] [US4] Create AnthropicAdapter in backend/src/adapters/ai/AnthropicAdapter.js implementing IAIProvider using Anthropic SDK
- [ ] T073 [US4] Add provider selection logic to AIMirrorService in backend/src/domain/services/AIMirrorService.js: route to OllamaAdapter, OpenAIAdapter, or AnthropicAdapter based on UserPreferences
- [ ] T074 [US4] Create preferences route in backend/src/adapters/http/routes/preferences.js with GET /api/preferences and PUT /api/preferences endpoints
- [ ] T075 [US4] Register preferences route in backend/src/server.js: mount /api/preferences
- [ ] T076 [P] [US4] Create usePreferences composable in frontend/src/composables/usePreferences.js with loadPreferences, updatePreferences methods
- [ ] T077 [US4] Create SettingsView in frontend/src/views/SettingsView.vue with AI model selection using Radix Vue RadioGroup per FR-008
- [ ] T078 [US4] Add privacy warning dialog in SettingsView for first-time online model selection with explicit "data leaves device" message per FR-008
- [ ] T079 [US4] Implement hasAcknowledgedOnlineWarning state machine in UserPreferences: prevent online model use until warning acknowledged per data-model.md
- [ ] T080 [US4] Add privacy status indicator in App.vue header showing "Local-only" or "Online AI active" per FR-019
- [ ] T081 [US4] Add model selection persistence: save to backend/data/preferences.json via LocalFileRepository
- [ ] T082 [US4] Update ComposeView to use current AI provider from preferences when generating mirror responses
- [ ] T083 [US4] Add clear labels explaining privacy implications in SettingsView per FR-008 acceptance scenario 1

**Checkpoint**: User Story 4 complete - users can choose AI provider with clear privacy controls

---

## Phase 7: User Story 2 - Multiple Expression Modes (Priority: P2)

**Goal**: Users can express themselves through text or visual artifacts (imported photos, drawings, sketches) with equal treatment

**Independent Test**: Import an image file as a reflection, verify it's stored with same calm UX as text mode, view history showing text and visual reflections with equal prominence

### Implementation for User Story 2

- [ ] T084 [P] [US2] Create VisualAttachment entity in backend/src/domain/entities/VisualAttachment.js with Zod schema (originalFilename, storedPath, mimeType, sizeBytes, dimensions, importTimestamp) per data-model.md
- [ ] T085 [US2] Add visual mode support to Reflection entity in backend/src/domain/entities/Reflection.js: conditional validation for mode='visual' requires visualAttachment
- [ ] T086 [US2] Add importVisual method to ReflectionService in backend/src/domain/services/ReflectionService.js: copy image to data/visuals/YYYY-MM/ and create reflection with visualAttachment
- [ ] T087 [US2] Add POST /api/reflections endpoint support for multipart/form-data (image upload) in backend/src/adapters/http/routes/reflections.js
- [ ] T088 [P] [US2] Add image validation in backend/src/adapters/http/middleware/validation.js: check MIME type (jpeg, png, gif, webp), max size 10MB per data-model.md
- [ ] T089 [US2] Update MarkdownExporter in backend/src/adapters/export/MarkdownExporter.js to handle visual attachments per exportFormat choice (single-file base64 or folder with images)
- [ ] T090 [P] [US2] Create VisualReflectionCard component in frontend/src/components/VisualReflectionCard.vue to display imported images with metadata
- [ ] T091 [P] [US2] Create ImageImport component in frontend/src/components/ImageImport.vue with file input, drag-and-drop, preview, accessible labels per FR-024
- [ ] T092 [US2] Add mode selection to ComposeView in frontend/src/views/ComposeView.vue: toggle between text and visual with max 3 choices per FR-001
- [ ] T093 [US2] Update ReflectionList component in frontend/src/components/ReflectionList.vue to render VisualReflectionCard for mode='visual' reflections
- [ ] T094 [US2] Add keyboard navigation to ImageImport (Space/Enter to trigger file dialog) per FR-022
- [ ] T095 [US2] Update useReflections composable to handle image upload with FormData in frontend/src/composables/useReflections.js
- [ ] T096 [US2] Ensure visual reflections receive equal design attention: same calm styling, timestamps, accessibility as text mode per FR-003 and SC-014

**Checkpoint**: User Story 2 complete - users can create text and visual reflections with equal ease

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T097 [P] Add gentle error messages for all error scenarios in backend/src/adapters/http/middleware/errorHandler.js per FR-028: Ollama unavailable (FR-030), low storage (FR-031), corrupted data (FR-029)
- [ ] T098 [P] Implement data integrity validation on read in backend/src/adapters/storage/LocalFileRepository.js per FR-032 with recovery/export options
- [ ] T099 [P] Add loading states and gentle transitions (no animations per FR-006) to all views in frontend/src/views/
- [ ] T100 [P] Optimize reflection list loading for 1000+ entries in frontend/src/composables/useReflections.js: lazy load by month per FR-035
- [ ] T101 [P] Add performance monitoring: ensure app loads < 2 seconds (FR-033), UI interactions < 100ms (FR-034)
- [ ] T102 [P] Create user documentation in docs/user-guide.md with screenshots of calm UX and accessibility features
- [ ] T103 [P] Update README.md with complete setup instructions including Ollama installation
- [ ] T104 [P] Add environment variable validation in backend/src/config/index.js: ensure DATA_DIR, OLLAMA_URL are set
- [ ] T105 [P] Create development quickstart in docs/quickstart.md for developers joining the project
- [ ] T106 Code review all gentle error messages for plain language (no jargon per FR-025)
- [ ] T107 Final accessibility audit with axe-core: ensure all views pass WCAG 2.1 Level AA per SC-008
- [ ] T108 Run manual screen reader testing (VoiceOver on macOS) for all user journeys per SC-009
- [ ] T109 Verify no network calls except Ollama/user-chosen online AI per FR-018 and SC-001
- [ ] T110 Performance validation: test with 1000+ reflections, verify no degradation per SC-017

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3 - P1)**: Depends on Foundational completion
- **User Story 3 (Phase 4 - P1)**: Depends on Foundational completion + US1 (needs ReflectionService for export)
- **User Story 5 (Phase 5 - P1)**: Depends on Foundational completion + US1 + US3 (needs all views to exist for accessibility testing)
- **User Story 4 (Phase 6 - P2)**: Depends on Foundational completion + US1 (extends AI provider system)
- **User Story 2 (Phase 7 - P2)**: Depends on Foundational completion + US1 (extends reflection modes)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: MVP - text reflections + local AI + history
  - Independent: Can be fully tested without other stories
  - Provides: Core reflection system, AI integration, basic views
  
- **US3 (P1)**: Data sovereignty - export + delete
  - Depends on: US1 (uses ReflectionService for export/delete operations)
  - Independent test: After US1, can test export/delete without US2, US4, US5
  
- **US5 (P1)**: Accessibility
  - Depends on: US1 + US3 (needs all views to test keyboard navigation)
  - Independent test: Can verify accessibility without US2 or US4
  
- **US4 (P2)**: AI provider choice
  - Depends on: US1 (extends AIMirrorService with multiple providers)
  - Independent test: Can test provider switching without US2 or US5
  
- **US2 (P2)**: Visual mode
  - Depends on: US1 (extends reflection creation with visual mode)
  - Independent test: Can test visual import without US4 or US5 (though should maintain US5 accessibility)

### Within Each User Story

- Entities before services (e.g., T014 Reflection entity → T029 ReflectionService)
- Services before routes (e.g., T029 ReflectionService → T032 reflections routes)
- Adapters implement ports (e.g., T011 IReflectionRepository port → T027 LocalFileRepository adapter)
- Backend routes before frontend composables (e.g., T032 reflections routes → T035 useReflections composable)
- Composables before components (e.g., T035 useReflections → T037 ReflectionEditor)
- Components before views (e.g., T037 ReflectionEditor → T039 ComposeView)

### Parallel Opportunities

**Phase 1 (Setup)**: T003, T004, T005, T006, T007, T008, T009 can all run in parallel

**Phase 2 (Foundational)**: 
- T012, T013 (ports) can run in parallel
- T015, T016 (entities) can run in parallel after T014
- T019, T020 (middleware) can run in parallel
- T024, T025 (styles) can run in parallel
- T022, T023, T026 (frontend setup) can run in parallel after T021
- T028 (system prompt) can run in parallel with other foundational tasks

**User Story 1**: 
- T029, T030 (services) can run in parallel
- T033 (AI route) can run in parallel with T032 (reflections routes)
- T035, T036 (composables) can run in parallel
- T038 (AIMirrorPanel) can run in parallel with T037 (ReflectionEditor)
- T040 (ReflectionList) can run in parallel with T037, T038

**User Story 3**:
- T045, T047 (ExportService methods) can be done together
- T049, T050 (delete endpoints) can run in parallel after T048
- T052, T053, T054 (dialog components) can all run in parallel

**User Story 5**:
- T060, T061, T062, T064, T065, T067 (accessibility enhancements) can run in parallel

**User Story 4**:
- T071, T072 (AI adapters) can run in parallel
- T076 (usePreferences) can run in parallel with T074 (preferences route)

**User Story 2**:
- T084, T085 (entities) can be done together
- T090, T091 (visual components) can run in parallel

**Polish Phase**: Most tasks (T097-T105) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch domain services together:
Task T029: "Create ReflectionService in backend/src/domain/services/ReflectionService.js"
Task T030: "Create AIMirrorService in backend/src/domain/services/AIMirrorService.js"

# Launch routes together:
Task T032: "Create reflections routes in backend/src/adapters/http/routes/reflections.js"
Task T033: "Create AI mirror route in backend/src/adapters/http/routes/ai.js"

# Launch composables together:
Task T035: "Create useReflections composable"
Task T036: "Create useAIMirror composable"

# Launch components together:
Task T037: "Create ReflectionEditor component"
Task T038: "Create AIMirrorPanel component"
Task T040: "Create ReflectionList component"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 3, 5 Only - All P1)

**Goal**: Deliver core value - private, accessible text reflection with local AI

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T028) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (T029-T044) - Core reflection experience
4. Complete Phase 4: User Story 3 (T045-T059) - Data sovereignty
5. Complete Phase 5: User Story 5 (T060-T070) - Accessibility
6. **STOP and VALIDATE**: 
   - Test full user journey: write reflection → get AI feedback → view history → export data → delete reflection
   - Test keyboard-only navigation
   - Test with screen reader (VoiceOver/NVDA)
   - Verify no network calls except Ollama
7. Deploy/demo MVP

**MVP Scope**: 110 tasks total (T001-T110), but MVP stops at T070 = 70 tasks

### Incremental Delivery

1. **Foundation** (T001-T028): Setup + infrastructure → ~2-3 weeks
2. **MVP** (T029-T070): US1 + US3 + US5 → ~4-6 weeks → **DELIVERABLE #1**
3. **Enhanced** (T071-T083): Add US4 (AI provider choice) → ~1-2 weeks → **DELIVERABLE #2**
4. **Complete** (T084-T096): Add US2 (visual mode) → ~2-3 weeks → **DELIVERABLE #3**
5. **Polish** (T097-T110): Cross-cutting improvements → ~1 week → **DELIVERABLE #4**

Each deliverable adds value without breaking previous features.

### Parallel Team Strategy

With 2-3 developers after Foundational phase completes:

**Scenario 1: 2 developers**
- Developer A: User Story 1 (T029-T044) + User Story 3 (T045-T059)
- Developer B: User Story 5 (T060-T070) in parallel with US1/US3, then US4 (T071-T083)

**Scenario 2: 3 developers** 
- Developer A: User Story 1 (T029-T044)
- Developer B: User Story 3 (T045-T059) after US1 backend complete
- Developer C: User Story 5 (T060-T070) after US1/US3 views exist

Stories integrate smoothly due to Hexagonal architecture and clear interfaces.

---

## Success Metrics

After completing MVP (T001-T070), verify:

- **SC-001**: Network monitoring shows no personal data leaves device (except Ollama on localhost:11434)
- **SC-002**: All user actions reversible (export before delete available)
- **SC-003**: Export completes in < 10 seconds for 100 reflections
- **SC-004**: Interface shows max 3 primary choices at any time
- **SC-005**: Zero attention-grabbing animations or notifications
- **SC-007**: 100% keyboard navigation coverage
- **SC-008**: Passes axe-core WCAG 2.1 Level AA checks
- **SC-010**: AI responses use reflective language (validated by prompt testing)
- **SC-011**: Zero imperative language in AI responses
- **SC-015**: App loads in < 2 seconds on 5-year-old hardware
- **SC-016**: UI interactions respond in < 100ms
- **SC-019**: Export produces valid Markdown

---

## Notes

- **[P] tasks** = different files, no dependencies within phase
- **[Story] label** maps task to specific user story for traceability
- **MVP = US1 + US3 + US5** (all P1 stories): Core reflection, data control, accessibility
- **No tests included**: Tests not requested in spec.md (follows YAGNI principle)
- **Hexagonal Architecture**: Enables parallel development of adapters and independent testing
- **Month-based storage**: Implemented in T027, critical for FR-035 (1000+ entries performance)
- **Calm UX**: Enforced throughout (FR-001, FR-006, max 3 choices, no animations)
- **Accessibility**: Radix Vue provides accessible primitives, axe-core validates WCAG compliance
- **Privacy**: Local-first enforced (FR-018, FR-019), online AI requires explicit opt-in (FR-008)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
