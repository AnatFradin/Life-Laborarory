# Laboratory of Life

> A calm, private, AI-assisted space where you can return to life — hear inner striving, know yourself, and find your path — through simple expression, gentle reflection, and authentic contact with technology.

## Purpose

The Laboratory of Life exists to reconnect technology with the human pulse — to help a person see, hear, and live more deeply. This is not a productivity tool, a therapy app, or a social platform. It is a private sanctuary for reflection and self-discovery.

## Core Principles

1. **Small Steps, Always** — Work in tiny, testable slices
2. **AI as Mirror, Not Guru** — Reflects and clarifies, never instructs or diagnoses
3. **Multiple Forms, One Doorway** — Writing, metaphor, drawing, silence — all valid
4. **Calm Experience** — Low cognitive load, gentle pace, emotional safety
5. **Local-First, Private by Design** — Your data stays on your device
6. **Trace of Becoming** — Meaningful reflections showing growth over time
7. **Reversibility** — Easy to undo, delete, or export
8. **Accessibility and Simplicity** — Clear language, keyboard navigation, readable design

## What This Is NOT

- ❌ No accounts, analytics, or cloud synchronization
- ❌ No medical, therapeutic, or diagnostic functions
- ❌ No gamification, scoring, or attention-grabbing features
- ❌ No social sharing or external tracking

## Technology Stack

- **Backend**: Node.js 18+ with Express (local API server)
- **Frontend**: Vue 3 with Composition API, Vite for development
- **AI (Future)**: Ollama (local models - default), optional OpenAI/Anthropic API (requires explicit opt-in)
- **Storage**: Local JSON files (optionally in iCloud Drive for sync across your devices)
- **Testing**: Vitest for unit tests, optional Playwright for end-to-end testing

### AI Model Choice & Privacy

When AI features are added, you'll choose between:
- **Local Models (Ollama)** - Default, fully private, runs on your machine, no internet needed
- **Online APIs (OpenAI, etc.)** - Optional, requires explicit consent with clear warning that your reflections will be sent to external services

## Project Structure

```
backend/          # Node.js API server
frontend/         # Web interface
data/             # Your private data (gitignored)
.specify/         # Spec-driven development templates and constitution
```

## Getting Started

_Coming soon: Once the first feature is implemented, this section will include setup instructions._

## Development Philosophy

This project follows **Spec-Driven Development** using the Specify framework:

1. Every feature starts with a Specification (user stories, acceptance criteria)
2. A Plan is created (technical approach, structure, constitution checks)
3. Tasks are defined (small, testable units of work)
4. Implementation follows with tests written first
5. Each feature can be completed in a single focused session (max 45 minutes)

See [.specify/memory/constitution.md](.specify/memory/constitution.md) for the complete project constitution.

## Contributing

This is a personal project for single-user use. However, the constitution and development approach may be useful to others building similar calm, private tools.

## License

_To be determined_

---

**Last Updated**: November 8, 2025  
**Constitution Version**: 1.0.0
