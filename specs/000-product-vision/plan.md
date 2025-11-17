# Implementation Plan: Laboratory of Life — Product Vision

**Branch**: `000-product-vision` | **Date**: 2025-11-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/000-product-vision/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**What**: Laboratory of Life is a local-first, AI-assisted space for personal self-reflection. Users write reflections and import visual artifacts—all stored privately on their device. An AI mirror (local via Ollama by default) offers gentle, non-directive feedback. The application is a patient tool that waits until the user needs it, with no pressure or expectations for regular use. It prioritizes calm UX, privacy, accessibility, and complete data sovereignty.

**Technical Approach**: 
- **Architecture**: Hexagonal/Ports & Adapters for flexibility and testability
- **Backend**: Node.js + Express serving REST API, with domain logic isolated from infrastructure
- **Frontend**: Vue 3 with Composition API for reactive, component-based UI
- **Storage**: Local JSON files with atomic writes, no external database
- **AI Integration**: Ollama API for local models (default), OpenAI/Anthropic APIs for online models (opt-in with warning)
- **Version 1 Scope**: Text-based reflections + local AI + data export/delete (MVP). Visual import in future iterations.

## Technical Context

**Language/Version**: Node.js 18+ (backend), Vue 3 (frontend with Composition API)

**Architecture Pattern**: Hexagonal Architecture (Ports & Adapters)
- **Rationale**: Separates core business logic (domain) from external concerns (storage, API, AI providers). Makes it easy to swap file system for cloud storage, switch between local/online AI, or add new input/output formats without touching domain logic. Highly testable.
- **Layers**: 
  - **Domain**: Business logic (Reflection, AI Mirror, Export services)
  - **Ports**: Interfaces (IReflectionRepository, IAIProvider, IExporter)
  - **Adapters**: Implementations (LocalFileStorage, OllamaAdapter, OpenAIAdapter, MarkdownExporter, VueUIAdapter)

**Primary Dependencies**: 
- **Backend**: 
  - Express.js (REST API server)
  - fs/promises (file system operations)
  - Zod (JSON schema validator for data integrity and type safety)
- **AI Integration**: 
  - Ollama (local AI - default, requires local installation)
  - OpenAI SDK (optional online AI)
  - Anthropic SDK (optional online AI)
- **Frontend**: 
  - Vue 3 (Composition API)
  - Vite (dev server & build tool)
  - Vue Router (navigation)
  - Local composables for state management (no Pinia/Vuex initially)
  - Radix Vue (accessible UI primitives - unstyled)
- **Testing**: 
  - Vitest (unit & integration tests - Vue-friendly)
  - Playwright (e2e tests for user flows)
  - axe-core (automated accessibility testing) + manual screen reader testing

**Storage**: Local JSON files in `data/` directory
- Atomic writes with temp file + rename pattern
- Schema validation on read/write with Zod
- Month-based organization (`data/reflections/YYYY-MM/uuid.json`) for performance at scale

**Testing Strategy**: 
- Unit tests for domain logic (pure functions, no I/O)
- Integration tests for adapters (file system, AI providers)
- Smoke tests for main flows (write → save → view → export)
- E2E tests with Playwright for critical user journeys

**Target Platform**: Cross-platform desktop web app (runs locally via localhost)
- Primary: macOS (5+ years old hardware)
- Secondary: Windows, Linux (same performance targets)
- Browser: Modern browsers (Chrome, Firefox, Safari)

**Project Type**: Local-first web application (single-user, no server deployment)

**Performance Goals**: 
- Application load < 2 seconds on modest hardware
- UI interactions < 100ms response time
- File operations < 500ms (save/load)
- Large history (1000+ entries) loads without degradation

**Constraints**: 
- **Offline-first**: Works without internet; AI via local Ollama by default
- **Privacy-first**: No data leaves device except user-triggered export or explicit online AI opt-in
- **Calm UX**: Max 3 primary choices on screen, no animations/notifications
- **Accessibility**: Full keyboard navigation, WCAG 2.1 Level AA
- **Minimal footprint**: < 200MB memory (excluding AI models)
- **Data sovereignty**: User controls all data (export, delete, location)

**Scale/Scope**: 
- Single user per installation
- Expected usage: 10-100 reflections/month
- Simple UI: 3-5 main views (compose, history, settings, export)
- No authentication (local-only, single-user device)
- No backend database (file system only)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Development Process (Constitution v2.0.0)

**✓ Principle I - Small Steps**: Product vision is meta-spec, not feature implementation. Actual features will be broken into user stories per spec template.

**✓ Principle II - Test-First**: Implementation tasks will include acceptance tests before coding. Domain logic designed for testability (Hexagonal Architecture).

**✓ Definition of Done**: This plan follows DoD: Has Spec + Plan, will have Tasks (Phase 2), tests defined, docs updated.

**✓ Quality Bar**: Architecture supports unit/integration/e2e testing. Atomic writes ensure data integrity. Performance targets defined.

**✓ Work Rhythm**: Hexagonal architecture enables small, independent tasks (one adapter at a time, one domain service at a time).

### Product Requirements (Product Spec v1.0)

**✓ AI as Mirror (Principle I)**: System prompts will be reflective, non-directive. Local Ollama default, online APIs opt-in with warning. See FR-008 through FR-013.

**✓ Multiple Forms (Principle II)**: V1 focuses on text mode (MVP). Visual import planned for future iterations. See FR-003.

**✓ Calm Experience (Principle III)**: UI design requires max 3 choices on screen, calm colors, no animations. See FR-001, FR-006, FR-007.

**✓ Local-First (Principle IV)**: All data in local JSON files. No network calls except user-triggered export or explicit online AI. See FR-014, FR-019.

**✓ Trace of Becoming (Principle V)**: Reflections timestamped and retrievable. User controls retention/deletion. See FR-005, Reflection Entry entity.

**✓ Reversibility (Principle VI)**: Export to Markdown always available. Atomic writes prevent corruption. Delete with confirmation. See FR-016, FR-017, FR-018.

**✓ Accessibility (Principle VII)**: Full keyboard navigation, WCAG 2.1 AA, screen reader support. See FR-023 through FR-028.

**✓ Non-Goals Check**: No accounts, analytics, cloud sync, diagnosis, gamification, or social features. Architecture supports local-first explicitly.

**✓ Success Criteria Alignment**: Architecture enables all SC metrics (privacy verifiable, performance measurable, accessibility testable).

**✓ PASS** — All constitution (development process) and product spec (requirements) checks satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── spec.md              # Product requirements (WHAT to build)
├── plan.md              # This file - implementation plan (HOW to build)
├── research.md          # Phase 0 - technology decisions & rationale
├── data-model.md        # Phase 1 - entity definitions with validation
├── contracts/           # Phase 1 - API specifications (OpenAPI)
│   └── api.yaml
├── checklists/          # Quality validation
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── domain/                    # Core business logic (Hexagon center)
│   │   ├── entities/              # Domain entities
│   │   │   ├── Reflection.js      # Reflection entity with validation
│   │   │   ├── AIInteraction.js   # AI request-response pair
│   │   │   └── UserPreferences.js # User settings
│   │   ├── services/              # Domain services (business rules)
│   │   │   ├── ReflectionService.js      # Create, retrieve, delete reflections
│   │   │   ├── AIMirrorService.js        # Generate reflective responses
│   │   │   └── ExportService.js          # Export data to Markdown
│   │   └── ports/                 # Interfaces (contracts for adapters)
│   │       ├── IReflectionRepository.js  # Storage interface
│   │       ├── IAIProvider.js            # AI provider interface
│   │       └── IExporter.js              # Export format interface
│   ├── adapters/                  # External integrations (Hexagon edges)
│   │   ├── storage/               # Storage adapters
│   │   │   ├── LocalFileRepository.js    # JSON file storage
│   │   │   └── schemas/                  # JSON schemas for validation
│   │   ├── ai/                    # AI provider adapters
│   │   │   ├── OllamaAdapter.js          # Local Ollama integration
│   │   │   ├── OpenAIAdapter.js          # Online OpenAI integration
│   │   │   └── AnthropicAdapter.js       # Online Anthropic integration
│   │   ├── export/                # Export format adapters
│   │   │   └── MarkdownExporter.js       # Markdown export
│   │   └── http/                  # HTTP API adapter (Express)
│   │       ├── routes/                   # Route definitions
│   │       │   ├── reflections.js        # /api/reflections endpoints
│   │       │   ├── ai.js                 # /api/ai/mirror endpoint
│   │       │   └── export.js             # /api/export endpoint
│   │       └── middleware/               # Express middleware
│   │           ├── errorHandler.js       # Gentle error responses
│   │           └── validation.js         # Request validation
│   ├── config/                    # Configuration
│   │   └── index.js               # App configuration
│   └── server.js                  # Express server entry point
└── tests/
    ├── unit/                      # Unit tests (domain logic)
    │   ├── entities/              # Entity tests
    │   └── services/              # Service tests
    ├── integration/               # Integration tests (adapters)
    │   ├── storage/               # File storage tests
    │   └── ai/                    # AI provider tests
    └── smoke/                     # Smoke tests (end-to-end flows)

frontend/
├── src/
│   ├── components/                # Reusable Vue components
│   │   ├── ReflectionEditor.vue   # Text input with autosave
│   │   ├── ReflectionList.vue     # History view
│   │   ├── AIMirrorPanel.vue      # AI feedback display
│   │   └── ExportDialog.vue       # Export confirmation
│   ├── views/                     # Page-level components
│   │   ├── ComposeView.vue        # Main reflection writing view
│   │   ├── HistoryView.vue        # Browse past reflections
│   │   ├── SettingsView.vue       # AI model choice, preferences
│   │   └── ExportView.vue         # Data export/delete
│   ├── services/                  # Frontend services
│   │   ├── api.js                 # HTTP client for backend API
│   │   └── storage.js             # Local state management
│   ├── composables/               # Vue 3 composition functions
│   │   ├── useReflections.js      # Reflection CRUD operations
│   │   └── useAIMirror.js         # AI interaction logic
│   ├── router/                    # Vue Router configuration
│   │   └── index.js               # Route definitions
│   ├── styles/                    # Global styles
│   │   ├── main.css               # Calm color palette, typography
│   │   └── accessibility.css      # Focus indicators, WCAG compliance
│   ├── App.vue                    # Root component
│   └── main.js                    # Vue app entry point
├── public/                        # Static assets
└── tests/
    ├── unit/                      # Component unit tests (Vitest)
    └── e2e/                       # User flow tests (Playwright)

data/                              # Local JSON storage (gitignored)
├── reflections/                   # User reflections
│   └── [YYYY-MM]/                # Organized by year-month
│       └── [uuid].json            # One file per reflection
├── preferences.json               # User preferences
└── exports/                       # User-triggered exports
    └── [timestamp]-export.md      # Markdown exports

.specify/                          # Project documentation
├── memory/                        # Project context
│   └── constitution.md            # Development process rules
├── templates/                     # Templates for specs, plans, tasks
└── scripts/                       # Automation scripts
```

**Structure Decision**: 

**Hexagonal Architecture Benefits**:
- **Flexibility**: Swap storage (file system → cloud) without touching domain logic
- **Testability**: Domain services pure, no I/O dependencies
- **Maintainability**: Clear boundaries between business logic and infrastructure
- **Future-proof**: Easy to add adapters (new AI providers, export formats, storage backends)

**Why Vue 3 + Composition API?**:
- **Beginner-friendly**: Progressive framework, gentle learning curve
- **Composition API**: Logic organized by feature (useReflections, useAIMirror), reusable across components
- **Single File Components**: HTML + CSS + JS in one file (easy to understand)
- **Vite**: Lightning-fast dev server with hot reload
- **Strong ecosystem**: Vue Router (navigation), Pinia (state if needed), excellent docs

**Data Organization**: Reflections organized by year-month for performance (avoid loading 1000+ files at once). Each reflection is separate JSON file for atomic writes and easy corruption recovery.

## Complexity Tracking

*No violations. All constitution and product spec checks pass.*
