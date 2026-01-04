# Changelog

All notable changes to Laboratory of Life will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Rich Text Editor with Markdown Support (Feature 001)
- **Markdown editing mode** with live preview (toggle between Plain Text and Markdown)
- **Formatting toolbar** with buttons for common Markdown syntax:
  - Bold, Italic, Headings (H1-H3)
  - Bullet lists, Numbered lists, Blockquotes
  - Link insertion with preview dialog
  - Visual feedback for active formatting
- **AI-powered text rephrasing** with three styles:
  - Clearer: Simplify complex language
  - More Positive: Reframe with hopeful tone
  - More Constructive: Focus on growth and learning
- **Live preview** with< 200ms rendering time
- **XSS protection** using DOMPurify sanitization
- **Keyboard shortcuts**: Cmd/Ctrl+B (bold), Cmd/Ctrl+I (italic), Cmd/Ctrl+K (link), Cmd/Ctrl+P (toggle preview)
- **Accessibility**: Full keyboard navigation, screen reader support, WCAG 2.1 Level AA color contrast
- **Export support**: Markdown reflections export correctly with formatting preserved

#### Polish & Error Handling (Product Vision)
- **Data integrity validation** on read using Zod schema validation
  - Corrupted reflections flagged with `_corrupted` and `_validationError` fields
  - Recovery/export options available for corrupted data
- **Environment configuration validation** on server startup
  - Validates DATA_DIR accessibility and writability
  - Validates OLLAMA_URL format
  - Validates PORT range (1-65535)
  - Creates data directory if missing
- **Gentle loading states** with fade-in animations (300ms)
  - Applied to CoachView and HistoryView
  - Smooth transitions for buttons and interactive elements
- **Comprehensive error messages** in plain language
  - Ollama unavailable: "The local AI assistant isn't available right now"
  - Low storage: "Your device is running low on storage space"
  - Corrupted data: "Some stored data couldn't be read properly"
  - All messages include solution-focused suggestions

#### Documentation
- **User Guide** (`docs/user-guide.md`): Comprehensive guide for end users
  - Getting started, writing reflections, using AI feedback
  - Markdown editing tutorial with syntax reference
  - Visual reflections, history viewing, data export
  - Settings, privacy, keyboard shortcuts, accessibility
  - Troubleshooting common issues
- **Developer Quickstart** (`docs/quickstart.md`): Fast onboarding for developers
  - Quick setup instructions (< 5 minutes to running)
  - Project structure explanation
  - Architecture overview (Hexagonal/Ports & Adapters)
  - Development workflow, testing, debugging
  - Code style conventions, contribution guidelines

### Changed

- **Test suite improvements**: Fixed AIMirrorService tests to match new API signature using system prompts
- **Error handler**: Now includes all error scenarios from FR-028, FR-029, FR-030, FR-031

### Fixed

- **AIMirrorService tests**: Updated tests to expect `systemPrompt` in options object instead of separate parameter
- **Loading states**: Added visual feedback for asynchronous operations

### Technical Details

#### Backend
- New route: `POST /api/ai/rephrase` for AI-powered text rephrasing
- Enhanced `LocalFileRepository` with data integrity validation
- Enhanced `config/index.js` with validation function
- Enhanced `errorHandler.js` with comprehensive error scenarios
- Tests passing: 243 unit + integration tests

#### Frontend  
- New components: `MarkdownEditor`, `MarkdownPreview`, `MarkdownToolbar`, `LinkDialog`, `RephraseDialog`
- New composables: `useMarkdownEditor`, `useMarkdownToolbar`, `useRephrasing`
- New utilities: `markdown.js` (parsing + sanitization), `markdownShortcuts.js`
- Enhanced views: `CoachView`, `HistoryView` with gentle transitions
- Tests passing: 240 unit tests (37 skipped by design)

## [0.1.0] - Initial Release

### Added

- **Text-based reflections** with auto-save
- **Local AI feedback** using Ollama (non-directive, reflective responses)
- **Visual reflections** (import images, photos, sketches)
- **AI Coach personas** with external ChatGPT integration
- **History view** with chronological display
- **Data export** to Markdown (single file or folder format)
- **Complete privacy controls**:
  - Local-only mode (default)
  - Online AI opt-in (OpenAI/Anthropic)
  - Clear privacy warnings
- **Storage location selection**:
  - Default local storage
  - iCloud Drive (macOS)
  - Custom paths
- **Full accessibility**:
  - 100% keyboard navigation
  - Screen reader support
  - WCAG 2.1 Level AA compliance
  - Visible focus indicators
- **Calm UX design**:
  - Max 3 choices on screen
  - No animations or attention-grabbing effects
  - Gentle color palette
  - Human-readable timestamps

### Architecture

- **Hexagonal (Ports & Adapters) architecture**
  - Clear separation of domain and infrastructure
  - Easy to test and extend
  - Multiple AI providers supported through adapters
- **Backend**: Node.js 18+, Express, Zod validation
- **Frontend**: Vue 3 (Composition API), Vite, Radix Vue
- **Storage**: Local JSON files with atomic writes
- **Testing**: Vitest (unit), Playwright (E2E), axe-core (accessibility)

---

## Future Plans

### Version 0.2.0 (Planned)
- Dynamic Coach Prompts (Feature 002)
  - File-based prompt library
  - Multiple prompt variants per persona
  - In-app chat interface
  - Prompt preview and selection UI

### Potential Future Features
- Mobile app (React Native or Progressive Web App)
- Encrypted local storage
- Tags and search functionality
- Reflection templates
- Mood tracking integration
- Export to other formats (PDF, EPUB)

---

## Migration Guide

### Upgrading from Pre-Markdown Version

If you have existing plain text reflections, they will continue to work unchanged. The Markdown toggle defaults to "Plain Text" mode for backward compatibility.

To convert existing reflections to use Markdown:
1. Open the reflection in Compose view
2. Toggle to "Markdown" mode
3. Edit as needed
4. Save

Your original content remains the same - Markdown only activates when you explicitly enable it.

---

## Known Issues

### Current Limitations

- **Performance**: App is optimized for up to 1000 active reflections. Beyond that, consider exporting and archiving older entries.
- **E2E tests**: E2E tests for Markdown editing, toolbar, and AI rephrasing are not yet implemented (Tasks T141-T143 pending).
- **Visual reflection editing**: Once imported, visual reflections cannot be edited (only deleted and re-imported).
- **Search**: No search functionality yet - use browser's find (Cmd/Ctrl+F) in History view or export to Markdown and search the file.
- **Mobile**: Desktop-optimized UI; mobile responsiveness is basic.

### Workarounds

- **Large document performance**: For documents with 10,000+ words, consider breaking into multiple reflections.
- **Ollama not starting**: On some systems, Ollama needs to be started manually after installation: `ollama serve`

---

## Credits

### Third-Party Libraries

- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- [Radix Vue](https://www.radix-vue.com/) - Unstyled, accessible components
- [marked.js](https://marked.js.org/) - Markdown parser and compiler
- [DOMPurify](https://github.com/cure53/DOMPurify) - XSS sanitizer for HTML
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Vitest](https://vitest.dev/) - Blazing fast unit test framework
- [Playwright](https://playwright.dev/) - End-to-end testing framework
- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing engine

### Inspiration

This project is inspired by:
- The slow technology movement
- Calm design principles
- Local-first software philosophy
- Universal design and accessibility
- Reflective writing practices

---

*"AI helps me walk, but the path is mine. The meaning is mine. The life is mine."* 🌿
