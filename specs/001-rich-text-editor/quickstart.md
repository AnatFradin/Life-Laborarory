# Quick Start - Rich Text Editor Implementation

**Feature**: 001-rich-text-editor  
**Last Updated**: November 27, 2025

This guide helps developers implement the Markdown editor feature in order of priority.

---

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Project cloned and dependencies installed (`npm install`)
- [ ] Dev server can start successfully (`npm run dev`)
- [ ] Ollama installed (optional, for P3 AI rephrasing)

---

## Implementation Order

Follow priorities: **P1 → P2 → P3**. Each priority is independently testable.

### ✅ Phase P1: Basic Markdown Editor (MVP)

**Goal**: Users can write Markdown and see live preview

**Steps**:

1. **Install dependencies**
   ```bash
   npm install marked@^11.0.0 dompurify@^3.0.0
   npm install --save-dev @types/marked @types/dompurify
   ```

2. **Create utility: `frontend/src/utils/markdown.js`**
   - Import marked and DOMPurify
   - Export `parseMarkdown(text)` function
   - Configure sanitization (see research.md #1)
   - Add unit tests: `frontend/tests/unit/markdown.test.js`

3. **Create composable: `frontend/src/composables/useMarkdownEditor.js`**
   - State: content, mode ('edit'|'preview'), cursorPosition
   - Methods: toggleMode(), updateContent()
   - Add unit tests

4. **Create component: `frontend/src/components/MarkdownPreview.vue`**
   - Props: `content` (string)
   - Computes HTML from Markdown (debounced 200ms)
   - Displays sanitized HTML
   - Add unit tests

5. **Create component: `frontend/src/components/MarkdownEditor.vue`**
   - Combines textarea + MarkdownPreview
   - Toggle button between edit/preview
   - Keyboard shortcut (Cmd/Ctrl+P)
   - Add unit tests

6. **Integrate: Update `ReflectionEditor.vue`**
   - Add "Enable Markdown" toggle
   - When enabled, use MarkdownEditor component
   - When disabled, use plain textarea (existing)

7. **Test P1 Acceptance Scenarios**
   - Scenario 1: Type `# Heading`, see formatted heading in preview ✓
   - Scenario 2: Type `**bold**`, see bold text in preview ✓
   - Scenario 3: Type list syntax, see bulleted list ✓
   - Scenario 4: Toggle edit/preview smoothly (< 200ms) ✓
   - Scenario 5: Save reflection, view later, Markdown preserved ✓

**Verification**: Run `npm test` - all P1 tests pass ✅

---

### ✅ Phase P2: Formatting Toolbar

**Goal**: Non-Markdown users can format via buttons

**Steps**:

1. **Create utility: `frontend/src/utils/markdownShortcuts.js`**
   - Functions: `insertBold()`, `insertItalic()`, `insertHeading()`, etc.
   - Each function inserts Markdown syntax at cursor position
   - Handle text selection wrapping
   - Add unit tests

2. **Create composable: `frontend/src/composables/useMarkdownToolbar.js`**
   - Methods for each toolbar action
   - Keyboard shortcut handlers (Cmd+B, Cmd+I, Cmd+K)
   - Button disabled state logic
   - Add unit tests

3. **Create component: `frontend/src/components/LinkDialog.vue`**
   - Input for URL
   - Preview of `[text](url)` syntax
   - Escape to close
   - Add unit tests

4. **Create component: `frontend/src/components/MarkdownToolbar.vue`**
   - Buttons: Bold, Italic, H1-H3, List (UL/OL), Link, Blockquote
   - Icons + text labels (calm design)
   - Keyboard navigation (Tab, Enter)
   - aria-label for accessibility
   - Add unit tests

5. **Integrate: Update `MarkdownEditor.vue`**
   - Add MarkdownToolbar above textarea
   - Wire up toolbar actions to editor state
   - Test keyboard shortcuts

6. **Style: Add `frontend/src/styles/markdown-editor.css`**
   - Calm colors, gentle hover states
   - Focus indicators (2px outline)
   - High contrast (WCAG 2.1 Level AA)

7. **Test P2 Acceptance Scenarios**
   - Scenario 1: Click Bold, text wrapped with `**` ✓
   - Scenario 2: Click H1, `# ` inserted ✓
   - Scenario 3: Click List, `- ` inserted ✓
   - Scenario 4: Click Link, dialog opens, `[text](url)` inserted ✓
   - Scenario 5: Use Cmd+B keyboard shortcut ✓

**Verification**: Run `npm test` - all P1 + P2 tests pass ✅

---

### ✅ Phase P3: AI Rephrasing

**Goal**: Users can rephrase selected text with AI

**Steps**:

1. **Backend: Create `backend/src/adapters/ai/rephrasing-prompts.js`**
   - Export system prompts for each style:
     - `clearerPrompt`
     - `morePositivePrompt`
     - `moreConstructivePrompt`
   - Each prompt includes instructions and examples

2. **Backend: Extend `backend/src/domain/services/AIMirrorService.js`**
   - Add `rephrase(text, style, provider, model)` method
   - Reuse existing Ollama/OpenAI adapters
   - Return 2-3 suggestions
   - Add unit tests: `backend/tests/unit/RephraseService.test.js`

3. **Backend: Create endpoint `POST /api/ai/rephrase`**
   - Validate request (text length, style, provider)
   - Call AIMirrorService.rephrase()
   - Return RephrasingSuggestion
   - Handle errors gracefully (503 if AI down)
   - Add integration test

4. **Frontend: Create composable `frontend/src/composables/useRephrasing.js`**
   - State: loading, error, suggestions
   - Method: `requestRephrase(text, style)`
   - Calls backend API
   - Add unit tests

5. **Frontend: Create component `frontend/src/components/RephraseDialog.vue`**
   - Show original text
   - Style selector (Clearer, More Positive, More Constructive)
   - Display suggestions side-by-side
   - Accept/Reject buttons
   - Escape to close
   - Add unit tests

6. **Frontend: Integrate into `MarkdownEditor.vue`**
   - Add "Rephrase" button to toolbar
   - Opens RephraseDialog when text selected
   - Apply accepted suggestion to content
   - Add to undo stack

7. **Test P3 Acceptance Scenarios**
   - Scenario 1: Select text, click Rephrase, dialog opens ✓
   - Scenario 2: Choose style, AI suggests 2-3 alternatives (< 5s) ✓
   - Scenario 3: Hover suggestion, see preview in context ✓
   - Scenario 4: Accept suggestion, text replaced smoothly ✓
   - Scenario 5: Cancel, original text unchanged ✓
   - Scenario 6: AI unavailable, gentle error message ✓

**Verification**: Run `npm test` - all tests pass (P1 + P2 + P3) ✅

---

## Testing Strategy

### Unit Tests

**Frontend** (`frontend/tests/unit/`):
- `markdown.test.js` - Markdown parsing & sanitization
- `useMarkdownEditor.test.js` - Editor state management
- `useMarkdownToolbar.test.js` - Toolbar actions
- `useRephrasing.test.js` - AI rephrasing logic
- `MarkdownEditor.test.js` - Component behavior
- `MarkdownToolbar.test.js` - Toolbar component
- `RephraseDialog.test.js` - Dialog component

**Backend** (`backend/tests/unit/`):
- `RephraseService.test.js` - AI rephrasing service

**Run**: `npm test` (Vitest)

### Integration Tests

**Backend** (`backend/tests/integration/`):
- `ai-rephrasing-api.integration.test.js` - API endpoint with mocked AI

**Run**: `npm run test:integration`

### Acceptance Tests

**E2E** (`frontend/tests/e2e/`):
- `markdown-editing.spec.js` - P1 user scenarios
- `markdown-toolbar.spec.js` - P2 user scenarios
- `ai-rephrasing.spec.js` - P3 user scenarios

**Run**: `npm run test:e2e` (Playwright)

### Manual Testing

- [ ] Create new reflection, enable Markdown
- [ ] Type Markdown syntax, verify preview renders
- [ ] Toggle edit/preview mode, verify smooth transition
- [ ] Use toolbar buttons, verify Markdown inserted
- [ ] Test keyboard shortcuts (Cmd+B, Cmd+I, Cmd+K, Cmd+P)
- [ ] Select text, click Rephrase, verify AI suggestions
- [ ] Accept AI suggestion, verify text replaced
- [ ] Test with existing plain text reflection (should work unchanged)
- [ ] Test accessibility with keyboard navigation only
- [ ] Test with screen reader (VoiceOver on macOS)

---

## Development Workflow

1. **Checkout feature branch**:
   ```bash
   git checkout 001-rich-text-editor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start dev server** (frontend + backend):
   ```bash
   npm run dev
   # or use start-dev.sh script
   ./start-dev.sh
   ```

4. **Start Ollama** (for P3 AI rephrasing):
   ```bash
   ollama serve
   # In another terminal:
   ollama pull llama3
   ```

5. **Run tests in watch mode**:
   ```bash
   npm run test:watch
   ```

6. **Implement feature** (follow P1 → P2 → P3 order)

7. **Commit after each completed priority**:
   ```bash
   git add .
   git commit -m "feat(editor): implement P1 Markdown editing with preview"
   ```

---

## Debugging Tips

### Markdown Not Rendering

- Check browser console for errors
- Verify marked.js and DOMPurify installed
- Test `parseMarkdown()` function in isolation
- Check sanitization config (allowed tags)

### Preview Lag

- Verify debounce is working (200ms delay)
- Check content length (> 10K words?)
- Profile rendering with browser DevTools
- Consider virtual scrolling for large docs

### Toolbar Not Inserting Markdown

- Check cursor position tracking
- Verify textarea has focus
- Test insertion functions in isolation
- Check for event handler binding issues

### AI Rephrasing Not Working

- Verify Ollama is running: `ollama list`
- Check backend logs for errors
- Test API endpoint with curl:
  ```bash
  curl -X POST http://localhost:3000/api/ai/rephrase \
    -H "Content-Type: application/json" \
    -d '{"originalText":"test","style":"clearer","aiProvider":"ollama","model":"llama3"}'
  ```
- Verify system prompts in `rephrasing-prompts.js`

### Accessibility Issues

- Test keyboard navigation: Tab through all buttons
- Verify focus indicators visible (2px outline)
- Check aria-label attributes on buttons
- Test with screen reader (VoiceOver: Cmd+F5)
- Run axe DevTools extension

---

## Performance Benchmarks

Target performance (from spec):

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Preview update** | < 200ms | Type Markdown, time until preview updates |
| **Toolbar action** | < 100ms | Click button, time until syntax inserted |
| **AI rephrasing** | < 5s | Request rephrase, time until suggestions shown |
| **Mode toggle** | < 200ms | Switch edit/preview, time until transition complete |

**Measure with**:
```javascript
console.time('preview-render')
parseMarkdown(content)
console.timeEnd('preview-render')
```

Or use browser DevTools Performance tab.

---

## Common Pitfalls

1. **Don't parse Markdown on every keystroke** → Use debouncing (200ms)
2. **Don't skip sanitization** → Always use DOMPurify.sanitize()
3. **Don't hardcode AI provider** → Use user's preference from settings
4. **Don't send entire reflection to AI** → Only selected text (FR-026)
5. **Don't break existing plain text reflections** → Test backward compatibility
6. **Don't forget keyboard navigation** → Test without mouse
7. **Don't ignore accessibility** → Run axe checks, test with screen reader

---

## Completion Checklist

### P1 - Markdown Editing
- [ ] marked.js and DOMPurify installed
- [ ] `markdown.js` utility with sanitization
- [ ] `useMarkdownEditor` composable
- [ ] `MarkdownPreview` component
- [ ] `MarkdownEditor` component
- [ ] Integration with `ReflectionEditor`
- [ ] All P1 unit tests pass
- [ ] All P1 acceptance scenarios verified
- [ ] Manual testing complete

### P2 - Formatting Toolbar
- [ ] `markdownShortcuts.js` utility
- [ ] `useMarkdownToolbar` composable
- [ ] `LinkDialog` component
- [ ] `MarkdownToolbar` component
- [ ] Keyboard shortcuts working
- [ ] Calm styles applied
- [ ] All P2 unit tests pass
- [ ] All P2 acceptance scenarios verified
- [ ] Accessibility checked (WCAG 2.1 Level AA)

### P3 - AI Rephrasing
- [ ] `rephrasing-prompts.js` with system prompts
- [ ] `AIMirrorService` extended
- [ ] `POST /api/ai/rephrase` endpoint
- [ ] `useRephrasing` composable
- [ ] `RephraseDialog` component
- [ ] Privacy preserved (only selected text sent)
- [ ] All P3 unit tests pass
- [ ] All P3 integration tests pass
- [ ] All P3 acceptance scenarios verified
- [ ] Ollama integration tested

### Documentation
- [ ] README updated with Markdown feature
- [ ] CHANGELOG entry added
- [ ] Comments added to complex logic
- [ ] API documentation updated (if needed)

### Final Verification
- [ ] All tests pass (`npm test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Manual testing complete
- [ ] Code review requested
- [ ] Feature deployed to branch

---

## Resources

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contract**: [contracts/ai-rephrasing.openapi.yaml](./contracts/ai-rephrasing.openapi.yaml)

**External**:
- [marked.js Documentation](https://marked.js.org/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [WCAG 2.1 Level AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aa)

**Need help?** Check the repository's main README or ask in team chat.
