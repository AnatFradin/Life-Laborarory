# Developer Quickstart

> Get Laboratory of Life up and running for development in minutes

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Ollama** (for local AI) - [Install](https://ollama.ai/)
- **Git** (for cloning the repository)

## Quick Setup

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

### 2. Setup Ollama

```bash
# Pull a model (llama2 is a good default)
ollama pull llama2

# Start Ollama (if not already running)
ollama serve
```

### 3. Run Development Servers

Open two terminal windows/tabs:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### 4. Open in Browser

Navigate to `http://localhost:5173`

You're ready to develop! 🎉

---

## Project Structure

```
Life-Laborarory/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── domain/       # Core business logic
│   │   │   ├── entities/ # Data models with Zod schemas
│   │   │   ├── services/ # Business logic services
│   │   │   └── ports/    # Interface definitions (Hexagonal Architecture)
│   │   ├── adapters/     # External integrations
│   │   │   ├── ai/       # Ollama, OpenAI, Anthropic adapters
│   │   │   ├── storage/  # Local file storage
│   │   │   ├── export/   # Markdown exporter
│   │   │   └── http/     # Express routes & middleware
│   │   └── config/       # Configuration & environment
│   └── tests/            # Unit, integration, smoke tests
│       ├── unit/         # Fast, isolated tests
│       ├── integration/  # API endpoint tests
│       └── smoke/        # Full system tests
│
├── frontend/             # Vue 3 + Vite
│   ├── src/
│   │   ├── components/   # Reusable Vue components
│   │   ├── views/        # Page-level components
│   │   ├── composables/  # Vue 3 composition functions
│   │   ├── services/     # API client (axios)
│   │   ├── router/       # Vue Router config
│   │   ├── styles/       # Global styles, calm palette
│   │   └── utils/        # Helpers (Markdown, sanitization)
│   └── tests/            # Unit (Vitest) + E2E (Playwright)
│       ├── unit/         # Component & composable tests
│       └── e2e/          # End-to-end tests
│
├── data/                 # Local storage (gitignored)
│   ├── reflections/      # User reflections (month-based folders)
│   ├── visuals/          # Imported images
│   └── preferences.json  # User settings
│
├── docs/                 # Documentation
│   ├── user-guide.md     # End-user documentation
│   └── quickstart.md     # This file
│
└── specs/                # Feature specifications
    ├── 000-product-vision/
    ├── 001-rich-text-editor/
    └── 002-dynamic-coach-prompts/
```

---

## Development Workflow

### Running Tests

**Backend:**
```bash
cd backend
npm test                # All tests
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests only
npm run test:coverage   # With coverage report
```

**Frontend:**
```bash
cd frontend
npm test                # Unit tests (Vitest)
npm run test:e2e        # E2E tests (Playwright)
npm run test:coverage   # Coverage report
```

### Hot Reload

Both backend and frontend support hot reload during development:

- **Backend**: Uses `--watch` flag (Node.js 18+)
- **Frontend**: Vite HMR (Hot Module Replacement)

Make changes and see them instantly!

### API Testing

**Using cURL:**
```bash
# Health check
curl http://localhost:3000/health

# Get all reflections
curl http://localhost:3000/api/reflections

# Create a reflection
curl -X POST http://localhost:3000/api/reflections \
  -H "Content-Type: application/json" \
  -d '{"mode":"text","content":"My first reflection"}'

# Get user preferences
curl http://localhost:3000/api/preferences
```

**Using Postman/Insomnia:**
- Import the OpenAPI spec from `specs/000-product-vision/contracts/api.yaml`
- Base URL: `http://localhost:3000/api`

---

## Architecture: Hexagonal (Ports & Adapters)

### Why Hexagonal?

1. **Testability**: Core domain logic is isolated from external dependencies
2. **Flexibility**: Easy to swap implementations (e.g., different AI providers)
3. **Parallel development**: Teams can work on adapters independently
4. **Maintainability**: Clear separation of concerns

### Key Concepts

**Domain** (Inner hexagon):
- Pure business logic
- No dependencies on frameworks or external services
- Defines **ports** (interfaces) for what it needs

**Adapters** (Outer hexagon):
- Implement the ports
- Handle external services (AI, storage, HTTP)
- Can be swapped without changing domain code

**Example:**
```javascript
// Domain port (interface)
// backend/src/domain/ports/IAIProvider.js
export default class IAIProvider {
  async generateResponse(prompt, content, options) {
    throw new Error('Must implement generateResponse');
  }
}

// Adapters (implementations)
// backend/src/adapters/ai/OllamaAdapter.js
// backend/src/adapters/ai/OpenAIAdapter.js
// backend/src/adapters/ai/AnthropicAdapter.js
```

---

## Common Tasks

### Adding a New Feature

1. **Write the spec** in `specs/<feature-number>-<name>/`
2. **Define entities** in `backend/src/domain/entities/`
3. **Create services** in `backend/src/domain/services/`
4. **Implement adapters** in `backend/src/adapters/`
5. **Add routes** in `backend/src/adapters/http/routes/`
6. **Create composables** in `frontend/src/composables/`
7. **Build components** in `frontend/src/components/`
8. **Wire into views** in `frontend/src/views/`
9. **Write tests** (unit, integration, E2E)
10. **Update docs**

### Adding a New AI Provider

1. Create adapter in `backend/src/adapters/ai/<ProviderName>Adapter.js`
2. Implement `IAIProvider` interface
3. Add configuration in `backend/src/config/index.js`
4. Update `AIMirrorService` to support new provider
5. Add UI for selection in `frontend/src/views/SettingsView.vue`
6. Write tests

### Adding a New Route

1. Create route file in `backend/src/adapters/http/routes/`
2. Define endpoints with validation
3. Call domain services (not adapters directly)
4. Add error handling
5. Register in `backend/src/server.js`
6. Write integration tests in `backend/tests/integration/`

---

## Code Style & Conventions

### JavaScript/Vue

- **ES Modules**: Use `import/export` (not CommonJS)
- **Async/await**: Prefer over `.then()` chains
- **Named exports**: For better tree-shaking
- **Vue 3 Composition API**: All new components use `<script setup>`
- **Zod**: For all data validation

### Naming

- **Files**: kebab-case (`my-component.vue`, `my-service.js`)
- **Components**: PascalCase (`MyComponent`)
- **Composables**: camelCase starting with `use` (`useReflections`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### Comments

- **JSDoc**: For all public functions
- **Inline**: Only for complex logic that isn't obvious
- **Why over what**: Explain the reasoning, not the mechanics

### Error Messages

- **Plain language**: No jargon, no technical error codes
- **Solution-focused**: Tell users what they can do
- **Gentle tone**: Calm and reassuring (FR-028)

Example:
```javascript
// ✅ Good
throw new Error('The local AI assistant isn\'t available right now. Try starting Ollama with: ollama serve');

// ❌ Bad
throw new Error('ECONNREFUSED: Connection refused on port 11434');
```

---

## Environment Variables

All are optional (defaults provided):

```bash
# Backend
PORT=3000                    # Server port
DATA_DIR=./data              # Data storage location
OLLAMA_URL=http://localhost:11434  # Ollama API URL
OPENAI_API_KEY=              # OpenAI API key (optional)
ANTHROPIC_API_KEY=           # Anthropic API key (optional)
NODE_ENV=development         # Environment

# Frontend
# No environment variables needed - uses Vite defaults
```

Create a `.env` file in the backend directory to override defaults:

```bash
cd backend
cat > .env << EOF
PORT=3001
OLLAMA_URL=http://192.168.1.100:11434
EOF
```

---

## Debugging

### Backend

**Using Node Debugger:**
```bash
cd backend
node --inspect src/server.js
```

Then attach Chrome DevTools: `chrome://inspect`

**Console logging:**
```javascript
console.log('[ServiceName] Debug info:', data);
```

Use prefixes like `[ServiceName]` to filter logs.

### Frontend

**Vue DevTools:**
1. Install [Vue DevTools](https://devtools.vuejs.org/) browser extension
2. Open DevTools → Vue tab
3. Inspect components, state, and events

**Browser Console:**
```javascript
console.log('[ComposableName] State:', state);
```

**Vitest:**
```bash
npm test -- --reporter=verbose
```

---

## Performance Considerations

### Backend

- **Month-based storage**: Reflections organized by `YYYY-MM` folders
- **Lazy loading**: Load only what's needed
- **Atomic writes**: Temp file + rename pattern
- **Caching**: Repository factory pattern for reuse

### Frontend

- **Debouncing**: Auto-save debounced to 500ms
- **Virtual scrolling**: Not yet implemented (use for 1000+ reflections)
- **Code splitting**: Vite automatically splits routes
- **Markdown rendering**: Debounced to 200ms

### Database Alternative

Currently using JSON files for simplicity. If scaling beyond 10,000 reflections:
- Consider SQLite for querying and indexing
- Adapter pattern makes this swap easy
- Keep file-based as default for transparency

---

## Security

### XSS Protection

- **DOMPurify**: Sanitizes all Markdown output
- **Zod**: Validates all inputs
- **CORS**: Restricted to `localhost:5173` in development

### File Upload

- **MIME type validation**: Only allow image types
- **Size limits**: 10MB maximum
- **Path traversal prevention**: Validate file paths
- **Atomic writes**: Prevent partial writes

### AI Prompts

- **System prompts versioned**: Track which prompt version was used
- **Input validation**: Max 5000 characters for rephrasing
- **No code execution**: AI responses are text only

---

## Accessibility Testing

### Automated

```bash
cd frontend
npm run test:e2e -- --grep "accessibility"
```

Uses `@axe-core/playwright` for WCAG 2.1 Level AA checks.

### Manual

1. **Keyboard only**: Unplug mouse, navigate entire app
2. **Screen reader**: Test with VoiceOver (macOS) or NVDA (Windows)
3. **Zoom**: Test at 200% browser zoom
4. **Color blindness**: Use browser DevTools to simulate

---

## Deployment

### Production Build

**Backend:**
```bash
cd backend
npm start  # Uses node src/server.js
```

**Frontend:**
```bash
cd frontend
npm run build  # Outputs to dist/
npm run preview  # Preview production build
```

### Environment

- Set `NODE_ENV=production`
- Configure `DATA_DIR` to persistent storage
- Ensure Ollama is running if using local AI
- Set up reverse proxy (nginx) for production

### Docker (Future)

Dockerfile not yet provided. Consider:
- Multi-stage build for smaller images
- Volume mount for `data/` directory
- Health checks for Ollama and backend

---

## Troubleshooting Development Issues

### "Cannot find module"

```bash
# Clear node_modules and reinstall
cd backend && rm -rf node_modules package-lock.json && npm install
cd ../frontend && rm -rf node_modules package-lock.json && npm install
```

### "Port already in use"

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use a different port
PORT=3001 npm run dev
```

### "Ollama connection refused"

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Verify model is available
ollama list
```

### Tests failing after changes

```bash
# Clear test cache
cd backend && npx vitest run --clearCache
cd frontend && npx vitest run --clearCache
```

---

## Contributing

This is a personal project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Write tests for new features
5. Update documentation
6. Submit a pull request

---

## Resources

- **Vue 3**: https://vuejs.org/guide/
- **Vite**: https://vitejs.dev/guide/
- **Radix Vue**: https://www.radix-vue.com/
- **Zod**: https://zod.dev/
- **Vitest**: https://vitest.dev/
- **Playwright**: https://playwright.dev/
- **Ollama**: https://ollama.ai/
- **Hexagonal Architecture**: https://alistair.cockburn.us/hexagonal-architecture/

---

## Philosophy

Read the manifesto in **О-чем-проект.md** (Russian) to understand the deeper purpose behind this tool. Key principles:

1. **Local-first**: Privacy by design
2. **Calm UX**: Max 3 choices, no animations
3. **AI as mirror**: Reflective, non-directive
4. **Accessible**: Full keyboard & screen reader support
5. **Reversible**: Export and delete with zero friction

---

*Happy developing! The code is here to serve the reflection, not the other way around.* 🌿
