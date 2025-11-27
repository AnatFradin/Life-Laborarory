# 🌿 Laboratory of Life

> A local-first, AI-assisted space for personal self-reflection

Laboratory of Life is a calm, private tool for self-reflection. Write your thoughts, import visual artifacts, and receive gentle, non-directive feedback from an AI mirror—all stored locally on your device. No accounts, no cloud sync, no tracking.

## ✨ Key Features

- **🔒 Complete Privacy**: All data stays on your device. No external servers, no tracking.
- **🤖 AI Mirror**: Gentle, reflective feedback from local Ollama (default) or online AI (opt-in).
- **📝 Multiple Expression Modes**: Write text reflections or import visual artifacts.
- **♿ Fully Accessible**: Keyboard navigation, screen reader support, WCAG 2.1 AA compliant.
- **📤 Data Sovereignty**: Export everything to Markdown anytime. Delete what you want.
- **🎨 Calm Experience**: Max 3 choices on screen, no animations, no notifications.

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters):

```
backend/          # Node.js + Express REST API
├── src/
│   ├── domain/       # Core business logic (entities, services)
│   ├── adapters/     # External integrations (storage, AI, HTTP)
│   └── config/       # Configuration
└── tests/            # Unit, integration, smoke tests

frontend/         # Vue 3 + Vite
├── src/
│   ├── components/   # Reusable Vue components
│   ├── views/        # Page-level components
│   ├── composables/  # Vue 3 composition functions
│   ├── services/     # API client
│   └── styles/       # Calm color palette, accessibility
└── tests/            # Unit (Vitest) and E2E (Playwright) tests

data/             # Local JSON storage (gitignored)
├── reflections/      # Your reflections (organized by month)
├── visuals/          # Imported images
└── preferences.json  # User settings
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Ollama** (for local AI) - [Installation Guide](https://ollama.ai/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnatFradin/Life-Laborarory.git
   cd Life-Laborarory
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Install Ollama and pull a model** (for local AI)
   ```bash
   # Install Ollama from https://ollama.ai/
   # Then pull a model (e.g., llama2)
   ollama pull llama2
   ```

### Running the Application

1. **Start the backend** (in `backend/` directory)
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:3000`

2. **Start the frontend** (in `frontend/` directory, new terminal)
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

### Writing a Reflection

1. Click "Compose" or press `Cmd/Ctrl + N`
2. Write your thoughts in the text area
3. Press `Cmd/Ctrl + Enter` to save
4. Optionally, click "Ask AI Mirror" for gentle, reflective feedback

### Viewing History

1. Click "History" to see all past reflections
2. Navigate with keyboard: `Tab`, arrow keys, `Enter`
3. Search and filter by date

### Exporting Your Data

1. Go to "Export" view
2. Choose format (single file or folder with images)
3. Click "Export to Markdown"
4. Your data is downloaded as a readable `.md` file

### Deleting Data

- **Single reflection**: Click delete button → confirm
- **All data**: Go to Export → "Delete All" → type "DELETE_ALL" → confirm

## 🔐 Privacy & Security

- **Local-first**: All data stored in `data/` directory on your device
- **No telemetry**: Zero tracking, analytics, or external calls (except to your chosen AI)
- **AI options**:
  - **Local (default)**: Ollama on `localhost:11434` - data never leaves your device
  - **Online (opt-in)**: OpenAI/Anthropic - clear warning that data leaves device
- **Data control**: Export and delete anytime

## 🧪 Development

### Running Tests

**Backend**
```bash
cd backend
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:coverage # With coverage report
```

**Frontend**
```bash
cd frontend
npm test              # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)
npm run test:coverage # Coverage report
```

## 📚 Documentation

- **[Product Vision](./specs/000-product-vision/spec.md)**: What and why
- **[Implementation Plan](./specs/000-product-vision/plan.md)**: Architecture and technical decisions
- **[Data Model](./specs/000-product-vision/data-model.md)**: Entity definitions and validation
- **[API Contracts](./specs/000-product-vision/contracts/)**: REST API specifications
- **[Tasks](./specs/000-product-vision/tasks.md)**: Implementation task breakdown

## 🌱 Philosophy

This project embodies **seven core principles**:

1. **AI as Mirror**: Reflective, non-directive feedback
2. **Multiple Forms**: Text and visual expression modes
3. **Calm Experience**: Max 3 choices, no animations, no pressure
4. **Local-First**: Privacy by design, data stays on your device
5. **Trace of Becoming**: Your journey through time, preserved
6. **Reversibility**: Export and delete with zero friction
7. **Accessibility**: Full keyboard navigation, screen reader support

See [О-чем-проект.md](./О-чем-проект.md) for the personal manifesto behind this project (in Russian).

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Zod (validation)
- **Frontend**: Vue 3 (Composition API), Vite, Radix Vue (accessible primitives)
- **Storage**: Local JSON files with atomic writes
- **AI**: Ollama (local), OpenAI/Anthropic (optional)
- **Testing**: Vitest (unit/integration), Playwright (e2e), axe-core (accessibility)

## 📝 License

**UNLICENSED** - This is a personal project, not intended for redistribution.

## 🤝 Contributing

This is a personal reflection tool. However, if you find bugs or have suggestions, feel free to open an issue.

## 💚 Acknowledgments

Built with care for those seeking a calm, private space for self-reflection.

---

*AI helps me walk, but the path is mine. The meaning is mine. The life is mine.*
