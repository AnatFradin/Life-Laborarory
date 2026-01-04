# 🌿 Laboratory of Life

> A local-first, AI-assisted space for personal self-reflection

Laboratory of Life is a calm, private tool for self-reflection. Write your thoughts, import visual artifacts, and receive gentle, non-directive feedback from an AI mirror—all stored locally on your device. No accounts, no cloud sync, no tracking.

## ✨ Key Features

- **🔒 Complete Privacy**: All data stays on your device. No external servers, no tracking.
- **🤖 AI Mirror**: Gentle, reflective feedback from local Ollama (default) or online AI (opt-in).
- **📝 Rich Text Editing**: Markdown support with live preview and formatting toolbar.
- **✨ AI Rephrasing**: Rephrase text to be clearer, more positive, or more constructive.
- **🖼️ Multiple Expression Modes**: Write text reflections or import visual artifacts.
- **♿ Fully Accessible**: Keyboard navigation, screen reader support, WCAG 2.1 AA compliant.
- **📤 Data Sovereignty**: Export everything to Markdown anytime. Delete what you want.
- **🎨 Calm Experience**: Max 3 choices on screen, gentle transitions, no distractions.

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
   cd ..
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Install Ollama and pull a model** (for local AI)
   
   **macOS:**
   ```bash
   # Download from https://ollama.ai/ or use Homebrew
   brew install ollama
   
   # Start Ollama service
   ollama serve
   
   # Pull a model (in a new terminal)
   ollama pull llama2
   ```
   
   **Linux:**
   ```bash
   # Install via curl
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Start Ollama
   ollama serve
   
   # Pull a model (in a new terminal)
   ollama pull llama2
   ```
   
   **Windows:**
   ```bash
   # Download installer from https://ollama.ai/download/windows
   # Follow installation wizard
   # Ollama starts automatically as a service
   
   # Pull a model in PowerShell/CMD
   ollama pull llama2
   ```
   
   **Verify installation:**
   ```bash
   # Check if Ollama is running
   curl http://localhost:11434/api/tags
   
   # List available models
   ollama list
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
2. Choose your mode:
   - **Plain Text**: Simple text entry
   - **Markdown**: Rich text with formatting
3. Write your thoughts
4. Press `Cmd/Ctrl + Enter` to save
5. Optionally, click "Ask AI Mirror" for gentle, reflective feedback

### Using Markdown

**Enable Markdown mode** in the Compose view to access rich text formatting:

#### Live Editing with Toolbar
- **Bold**: Select text and click **B** or press `Cmd/Ctrl+B`
- **Italic**: Select text and click **I** or press `Cmd/Ctrl+I`
- **Headings**: Click H1, H2, or H3 to add heading markers
- **Lists**: Click the list button for bullets or numbers
- **Links**: Click the link button or press `Cmd/Ctrl+K`
- **Blockquote**: Click the quote button to add quote markers
- **Preview**: Toggle between Edit and Preview modes with `Cmd/Ctrl+P`

#### Markdown Syntax Quick Reference
```markdown
**bold text**          → bold text
*italic text*          → italic text
# Heading 1            → Large heading
## Heading 2           → Medium heading
### Heading 3          → Small heading
- bullet item          → • bullet item
1. numbered item       → 1. numbered item
> quote                → Blockquote
[link text](url)       → Hyperlink
`code`                 → Inline code
```

#### AI Rephrasing
Improve your writing with AI assistance:

1. Write some text in your reflection
2. Select the text you want to rephrase (or leave unselected to rephrase all text)
3. Click the **Rephrase** button (purple) in the toolbar
4. Choose a style:
   - **Clearer**: Simplify complex language
   - **More Positive**: Reframe with a hopeful tone
   - **More Constructive**: Focus on growth and learning
5. Review 2-3 AI-generated suggestions
6. Click **Accept** on your preferred version, or **Cancel** to keep the original

**Privacy Note**: Rephrasing uses your selected AI provider (local Ollama by default, or online AI if configured in Settings). Only the selected/all text is sent - no other reflection data.

### Visual Reflections

1. In Compose view, switch from "Text" to "Visual"
2. Click to browse or drag and drop an image
3. Supported: JPEG, PNG, GIF, WebP, PDF (max 10MB)
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

- **[User Guide](./docs/user-guide.md)**: Complete guide for end users
- **[Developer Quickstart](./docs/quickstart.md)**: Get started developing in < 5 minutes
- **[CHANGELOG](./CHANGELOG.md)**: Version history and release notes
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
