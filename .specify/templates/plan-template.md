# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

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

**Principle I - Small Steps**: Can this feature be completed in one focused session (45 min max)? If not, break into smaller stories.

**Principle II - AI as Mirror**: Does any AI interaction avoid instruction/diagnosis? All prompts must be reflective, not directive. If AI feature: user chooses model (local Ollama default), online APIs require opt-in with privacy warning.

**Principle III - Multiple Forms**: Does the feature support diverse expression modes equally?

**Principle IV - Calm Experience**: Does the design minimize choices, use calm colors, avoid time pressure?

**Principle V - Local-First**: Is all data stored locally? No network calls for personal data?

**Principle VI - Trace of Becoming**: Can interactions be persisted with timestamps if user chooses?

**Principle VII - Reversibility**: Are all actions undoable, deletable, exportable?

**Principle VIII - Accessibility**: Full keyboard navigation? WCAG compliance? Plain language?

**Non-Goals Check**: Does NOT include accounts, analytics, cloud sync, diagnosis, gamification, or social features?

**DoD Alignment**: Will this feature have Spec + Plan + Tasks, pass tests, work via keyboard, persist locally, export to Markdown, and update docs?

**Quality Bar**: Can this meet performance goals (instant load, atomic writes), privacy (no telemetry), and tone (calm, reflective) standards?

**✓ PASS** if all checks satisfied | **⚠ NEEDS ADJUSTMENT** if violations exist → document in Complexity Tracking table

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
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
backend/
├── src/
│   ├── models/          # Data models (notes, sessions, reflections)
│   ├── services/        # Business logic (storage, reflection tools)
│   ├── api/             # REST/HTTP endpoints
│   └── storage/         # Local file system operations
└── tests/
    ├── unit/            # Unit tests for models and services
    ├── integration/     # Integration tests for storage operations
    └── smoke/           # Smoke tests for main user flows

frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Main application pages/views
│   ├── services/        # API client, local state management
│   ├── styles/          # CSS/styling (calm, accessible design)
│   └── utils/           # Helper functions
├── public/              # Static assets
└── tests/
    ├── unit/            # Component unit tests
    └── e2e/             # End-to-end user flow tests

data/                    # Local JSON storage directory (gitignored)
├── notes/               # User notes and reflections
├── sessions/            # Session history
└── exports/             # User-triggered exports
```

**Structure Decision**: Web application with local-first architecture. Node.js backend (Express) handles file system operations and serves REST API. Vue 3 frontend with Vite for development and building. Vue's component-based architecture keeps code organized and maintainable. All user data persists in local `data/` directory which can be placed in iCloud Drive for automatic sync across user's macOS devices. No cloud services, no external APIs for user data.

**Why Vue 3?**
- **Beginner-friendly**: Progressive framework, gentle learning curve from HTML/CSS/JS
- **Great documentation**: Official Vue docs are excellent for learning
- **Composition API**: Modern approach, similar to writing functions (familiar to backend devs)
- **Single File Components**: Each component is HTML + CSS + JS in one file (easy to understand)
- **Vite dev server**: Lightning-fast hot reload, instant feedback while learning
- **Wide adoption**: Large community, many resources, good career skill

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
