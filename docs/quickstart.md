# 🚀 Developer Quickstart - Laboratory of Life

Welcome! This guide will help you get up and running with Laboratory of Life development as quickly as possible.

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Ollama** (for local AI testing) - [Installation](https://ollama.ai/)
- **Git** (for version control)
- A code editor (VS Code recommended)

## ⚡ Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/AnatFradin/Life-Laborarory.git
cd Life-Laborarory

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 2. Setup Ollama (Local AI)

```bash
# Install Ollama from https://ollama.ai/
# Then pull a model
ollama pull llama2

# Start Ollama (if not already running)
ollama serve
```

### 3. Start Development Servers

```bash
# Terminal 1: Start backend (from backend/ directory)
cd backend
npm run dev
# Backend runs on http://localhost:3000

# Terminal 2: Start frontend (from frontend/ directory)
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Open Your Browser

Navigate to `http://localhost:5173` and start developing!

## 🏗️ Project Structure

```
Life-Laborarory/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── domain/         # Business logic (entities, services, ports)
│   │   │   ├── entities/   # Data models with Zod validation
│   │   │   ├── services/   # Core business logic
│   │   │   └── ports/      # Interfaces for adapters
│   │   ├── adapters/       # External integrations
│   │   │   ├── http/       # Express routes & middleware
│   │   │   ├── storage/    # File system storage
│   │   │   ├── ai/         # AI providers (Ollama, OpenAI, Anthropic)
│   │   │   └── export/     # Markdown export
│   │   ├── config/         # Configuration & env vars
│   │   └── server.js       # Express app entry point
│   └── tests/              # Backend tests
│       ├── unit/           # Unit tests
│       ├── integration/    # Integration tests
│       └── smoke/          # Smoke tests
│
├── frontend/               # Vue 3 + Vite
│   ├── src/
│   │   ├── components/    # Reusable Vue components
│   │   ├── views/         # Page-level components
│   │   ├── composables/   # Vue 3 composition functions
│   │   ├── services/      # API client
│   │   ├── router/        # Vue Router config
│   │   ├── styles/        # CSS (calm palette, accessibility)
│   │   └── utils/         # Helper functions
│   └── tests/             # Frontend tests
│       ├── unit/          # Vitest unit tests
│       └── e2e/           # Playwright E2E tests
│
├── data/                  # Local storage (gitignored)
│   ├── reflections/       # User reflections (by month)
│   ├── visuals/           # Uploaded images
│   └── preferences.json   # User settings
│
├── docs/                  # Documentation
│   ├── user-guide.md      # User documentation
│   ├── quickstart.md      # This file
│   └── *.md               # Other guides
│
└── specs/                 # Feature specifications
    └── 000-product-vision/
        ├── spec.md        # Product requirements
        ├── plan.md        # Technical architecture
        ├── tasks.md       # Implementation tasks
        └── data-model.md  # Data structures
```

## 🎯 Architecture Overview

Laboratory of Life follows **Hexagonal Architecture** (Ports & Adapters):

### Backend Layers

1. **Domain** (`backend/src/domain/`)
   - Pure business logic, no external dependencies
   - Entities: Data models with validation
   - Services: Business operations
   - Ports: Interfaces that adapters must implement

2. **Adapters** (`backend/src/adapters/`)
   - HTTP: Express routes and middleware
   - Storage: File system operations
   - AI: Ollama and online AI providers
   - Export: Markdown generation

3. **Configuration** (`backend/src/config/`)
   - Environment variables
   - Application settings

### Frontend Layers

1. **Views** (`frontend/src/views/`)
   - Page-level components
   - Route targets

2. **Components** (`frontend/src/components/`)
   - Reusable UI elements
   - Use Radix Vue for accessibility

3. **Composables** (`frontend/src/composables/`)
   - Reactive state management
   - Business logic
   - API integration

4. **Services** (`frontend/src/services/`)
   - API client (axios)
   - External integrations

## 🧪 Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:smoke         # Smoke tests

# With coverage
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend

# Run unit tests (Vitest)
npm test

# Run E2E tests (Playwright)
npm run test:e2e
npm run test:e2e:ui        # With UI

# With coverage
npm run test:coverage
```

## 🔧 Development Workflow

### 1. Pick a Task

Check `specs/000-product-vision/tasks.md` for the task list. Look for:
- `[ ]` Incomplete tasks
- `[P]` Parallel-safe tasks (can work independently)

### 2. Create a Branch

```bash
git checkout -b feature/task-TXXX-description
```

### 3. Make Changes

Follow these principles:
- **Minimal changes**: Only modify what's necessary
- **Test as you go**: Write/update tests for your changes
- **Follow conventions**: Match existing code style
- **Accessibility first**: All UI changes must be keyboard-accessible

### 4. Test Your Changes

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# Manual testing
# Start both servers and test in browser
```

### 5. Commit

```bash
git add .
git commit -m "feat(TXXX): Brief description of change"
git push origin feature/task-TXXX-description
```

### 6. Create Pull Request

- Reference the task number (TXXX)
- Describe what you changed and why
- Include screenshots for UI changes
- Mark related task as `[X]` in tasks.md

## 📝 Code Style Guidelines

### General Principles

1. **Plain Language**: No jargon, technical terms in user-facing text
2. **Calm UX**: No animations, notifications, or time pressure
3. **Accessibility**: All features keyboard-accessible, screen-reader compatible
4. **Privacy**: No network calls for user data without explicit consent

### Backend Conventions

- Use ES modules (`import/export`)
- Async/await for all async operations
- Zod for validation (see `backend/src/domain/entities/`)
- Gentle error messages (see error handler)
- JSDoc comments for public APIs

### Frontend Conventions

- Vue 3 Composition API (not Options API)
- Composables for shared logic
- Radix Vue for accessible primitives
- Scoped styles in components
- Keyboard shortcuts for all actions

### Accessibility Checklist

Every UI component must:
- [ ] Work with keyboard only (Tab, Enter, Escape, Arrows)
- [ ] Have proper ARIA labels and roles
- [ ] Show visible focus indicators
- [ ] Pass WCAG 2.1 Level AA contrast
- [ ] Be tested with a screen reader

## 🐛 Debugging Tips

### Backend Debugging

```bash
# Check if backend is running
curl http://localhost:3000/health

# View server logs
# Logs appear in the terminal where you ran `npm run dev`

# Check data directory
ls -la data/reflections/

# Verify Ollama connection
curl http://localhost:11434/api/tags
```

### Frontend Debugging

```bash
# Open browser DevTools (F12)
# Check Console for errors
# Check Network tab for API calls

# Vue DevTools
# Install browser extension for better debugging
```

### Common Issues

**Backend won't start**
- Check port 3000 isn't in use: `lsof -i :3000`
- Verify Node.js version: `node --version` (need 18+)

**Frontend won't start**
- Check port 5173 isn't in use: `lsof -i :5173`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Ollama connection fails**
- Verify Ollama is running: `ollama list`
- Check URL in settings (default: `http://localhost:11434`)

**Tests failing**
- Make sure both servers are stopped before running tests
- Check if data directory has proper permissions

## 🎨 UI Development

### Calm Color Palette

Laboratory of Life uses a calm, accessible color palette (see `frontend/src/styles/main.css`):

- **Primary**: Muted blue-green
- **Background**: Soft white/cream
- **Text**: Dark gray (not pure black)
- **Focus**: Clear, calm blue outline

### Design Principles

1. **Max 3 choices** per screen (FR-001)
2. **No animations** that grab attention (FR-006)
3. **High contrast** (WCAG 2.1 AA minimum)
4. **Generous spacing** for calm feeling
5. **Large click targets** (min 44x44px)

## 🔐 Privacy Considerations

When adding features, ensure:

1. **Data stays local** by default
2. **Clear warnings** before any data leaves device
3. **No analytics** or tracking code
4. **User control** over all data (export, delete)
5. **Atomic writes** to prevent corruption

## 📚 Key Resources

- **Product Vision**: `specs/000-product-vision/spec.md`
- **Architecture**: `specs/000-product-vision/plan.md`
- **Data Models**: `specs/000-product-vision/data-model.md`
- **API Contracts**: `specs/000-product-vision/contracts/`
- **User Guide**: `docs/user-guide.md`

## 💡 Pro Tips

1. **Use git hooks** for linting (if available)
2. **Test with keyboard only** regularly
3. **Test with screen reader** (VoiceOver on Mac, NVDA on Windows)
4. **Keep commits small** and focused
5. **Write tests first** when fixing bugs
6. **Ask questions** in issues/PRs

## 🤝 Contributing

1. Read the [Constitution](../specs/000-product-vision/constitution.md)
2. Follow the task list in `tasks.md`
3. Maintain hexagonal architecture
4. Ensure accessibility (WCAG 2.1 AA)
5. Keep user privacy as top priority

## 🎓 Learning Resources

### Vue 3
- [Vue 3 Docs](https://vuejs.org/)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Radix Vue Docs](https://www.radix-vue.com/)

### Architecture
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Ports and Adapters Pattern](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)

---

**Need help?** Open an issue or check existing documentation. Happy coding! 🌱
