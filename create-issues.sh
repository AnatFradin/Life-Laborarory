#!/bin/bash

# Script to create GitHub issues for all remaining tasks
# Repository: AnatFradin/Life-Laborarory

set -e

REPO="AnatFradin/Life-Laborarory"

echo "Creating GitHub issues for remaining tasks..."
echo "Repository: $REPO"
echo ""

# Issue 1: T108
gh issue create \
  --repo "$REPO" \
  --title "Manual screen reader testing for all user journeys (T108)" \
  --label "testing,accessibility,manual-testing,000-product-vision" \
  --body "Run manual screen reader testing (VoiceOver on macOS or NVDA on Windows) for all user journeys per SC-009.

**Acceptance Criteria:**
- [ ] Test with VoiceOver (macOS) or NVDA (Windows)
- [ ] Verify all interactive elements are properly announced
- [ ] Test all user flows: compose, history, settings, export, coach
- [ ] Verify screen reader can navigate entire application
- [ ] Document any accessibility issues found

**Requirements:**
- Requires running application
- VoiceOver (macOS) or NVDA (Windows) installed
- Follow TASK-EXECUTION-GUIDE.md Phase 2 instructions

**Related Spec:** \`specs/000-product-vision/tasks.md\` (T108)"

echo "✅ Created issue 1: Manual screen reader testing (T108)"

# Issue 2: T109
gh issue create \
  --repo "$REPO" \
  --title "Verify network isolation and privacy (T109)" \
  --label "testing,security,privacy,manual-testing,000-product-vision" \
  --body "Verify no network calls except Ollama/user-chosen online AI per FR-018 and SC-001.

**Acceptance Criteria:**
- [ ] Use browser DevTools Network tab to monitor all requests
- [ ] Test local mode: verify only localhost:11434 (Ollama) is called
- [ ] Test plain text reflections: verify no network calls
- [ ] Test Markdown reflections: verify no network calls
- [ ] Test online AI mode: verify warning shown and only approved provider called
- [ ] Document all network activity observed

**Requirements:**
- Requires running application
- Browser DevTools Network tab
- Test both local and online AI modes

**Related Spec:** \`specs/000-product-vision/tasks.md\` (T109)"

echo "✅ Created issue 2: Verify network isolation (T109)"

# Issue 3: T110
gh issue create \
  --repo "$REPO" \
  --title "Performance validation with 1000+ reflections (T110)" \
  --label "testing,performance,manual-testing,000-product-vision" \
  --body "Test with 1000+ reflections to verify no performance degradation per SC-017.

**Acceptance Criteria:**
- [ ] Generate 1500+ test reflections (script needed)
- [ ] Measure History view load time (should be < 3 seconds)
- [ ] Test scrolling performance (should be smooth)
- [ ] Test search/filter performance
- [ ] Create new reflection with large dataset (should be < 1 second)
- [ ] Verify UI remains responsive throughout

**Requirements:**
- Requires running application
- Script to generate test data (see TASK-EXECUTION-GUIDE.md)
- Large dataset with 1000+ reflections

**Related Spec:** \`specs/000-product-vision/tasks.md\` (T110)"

echo "✅ Created issue 3: Performance validation (T110)"

# Issue 4: T137
gh issue create \
  --repo "$REPO" \
  --title "Test AI rephrasing with local Ollama (T137)" \
  --label "testing,ai,manual-testing,001-rich-text-editor" \
  --body "Test AI-powered text rephrasing feature with local Ollama to ensure privacy is preserved.

**Acceptance Criteria:**
- [ ] Ollama running with llama2 model
- [ ] Test all 3 rephrasing styles: Clearer, More Positive, More Constructive
- [ ] Response time < 5 seconds
- [ ] Language preserved (test with different languages)
- [ ] Markdown formatting preserved in suggestions
- [ ] Test both full-text and selection rephrasing
- [ ] Verify no network calls except localhost:11434

**Requirements:**
- Requires running application
- Ollama installed and running
- Model available: \`ollama pull llama2\`

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T137)"

echo "✅ Created issue 4: Test AI rephrasing with Ollama (T137)"

# Issue 5: T138
gh issue create \
  --repo "$REPO" \
  --title "Test AI rephrasing with online AI providers (T138)" \
  --label "testing,ai,manual-testing,001-rich-text-editor" \
  --body "Test AI rephrasing with online AI providers (OpenAI/Anthropic) and verify privacy warnings are shown.

**Acceptance Criteria:**
- [ ] Configure online AI provider in Settings (OpenAI or Anthropic)
- [ ] Verify warning dialog shown: \"This will send data to [provider]\"
- [ ] User must acknowledge warning before sending
- [ ] Test all 3 rephrasing styles work with online provider
- [ ] Response time acceptable
- [ ] Privacy warning shown every time

**Requirements:**
- Requires running application
- OpenAI or Anthropic API key
- Follow TASK-EXECUTION-GUIDE.md instructions

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T138)"

echo "✅ Created issue 5: Test AI rephrasing with online AI (T138)"

# Issue 6: T141
gh issue create \
  --repo "$REPO" \
  --title "Create E2E test for Markdown editing (T141)" \
  --label "testing,e2e,playwright,001-rich-text-editor" \
  --body "Create end-to-end test for Markdown editing flows using Playwright.

**Acceptance Criteria:**
- [ ] Test toggle between Plain Text and Markdown modes
- [ ] Test Markdown preview rendering
- [ ] Test save and load Markdown reflection
- [ ] Test preview mode keyboard shortcut (Cmd/Ctrl+P)
- [ ] Test Markdown syntax rendering (headings, bold, italic, lists, links, blockquotes, code)

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** \`frontend/tests/e2e/markdown-editing.spec.js\`

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T141)"

echo "✅ Created issue 6: Create E2E test for Markdown editing (T141)"

# Issue 7: T142
gh issue create \
  --repo "$REPO" \
  --title "Create E2E test for Markdown toolbar (T142)" \
  --label "testing,e2e,playwright,001-rich-text-editor" \
  --body "Create end-to-end test for Markdown toolbar functionality using Playwright.

**Acceptance Criteria:**
- [ ] Test Bold button and Cmd/Ctrl+B shortcut
- [ ] Test Italic button and Cmd/Ctrl+I shortcut
- [ ] Test Heading buttons (H1, H2, H3)
- [ ] Test List buttons (bullets, numbers)
- [ ] Test Link button and dialog
- [ ] Test Blockquote button
- [ ] Verify Markdown syntax inserted correctly

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** \`frontend/tests/e2e/markdown-toolbar.spec.js\`

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T142)"

echo "✅ Created issue 7: Create E2E test for Markdown toolbar (T142)"

# Issue 8: T143
gh issue create \
  --repo "$REPO" \
  --title "Create E2E test for AI rephrasing (T143)" \
  --label "testing,e2e,playwright,ai,001-rich-text-editor" \
  --body "Create end-to-end test for AI rephrasing flow using Playwright.

**Acceptance Criteria:**
- [ ] Test opening rephrase dialog
- [ ] Test style selection (Clearer, More Positive, More Constructive)
- [ ] Test accepting suggestions
- [ ] Test canceling rephrasing
- [ ] Test error handling when AI unavailable

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** \`frontend/tests/e2e/ai-rephrasing.spec.js\`

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T143)"

echo "✅ Created issue 8: Create E2E test for AI rephrasing (T143)"

# Issue 9: T144
gh issue create \
  --repo "$REPO" \
  --title "Verify backward compatibility with plain text reflections (T144)" \
  --label "testing,manual-testing,001-rich-text-editor" \
  --body "Verify existing plain text reflections still work unchanged after Markdown feature addition.

**Acceptance Criteria:**
- [ ] Create plain text reflection (ensure Plain Text mode selected)
- [ ] Reload page and verify text displays correctly
- [ ] Verify no Markdown rendering applied to plain text
- [ ] Edit plain text reflection without enabling Markdown
- [ ] Verify plain text reflections can still be exported

**Requirements:**
- Requires running application

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T144)"

echo "✅ Created issue 9: Verify backward compatibility (T144)"

# Issue 10: T145
gh issue create \
  --repo "$REPO" \
  --title "Verify export functionality with Markdown reflections (T145)" \
  --label "testing,manual-testing,export,001-rich-text-editor" \
  --body "Verify Markdown reflections export correctly to .md files with formatting preserved (SC-017).

**Acceptance Criteria:**
- [ ] Create test reflections: plain text, Markdown, visual
- [ ] Export all reflections to Markdown
- [ ] Open exported .md file
- [ ] Verify all reflections present
- [ ] Verify Markdown formatting preserved
- [ ] Verify valid Markdown syntax
- [ ] Verify images included (base64 or references)

**Requirements:**
- Requires running application

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T145)"

echo "✅ Created issue 10: Verify export functionality (T145)"

# Issue 11: T146
gh issue create \
  --repo "$REPO" \
  --title "Verify AI mirror analyzes Markdown content correctly (T146)" \
  --label "testing,manual-testing,ai,001-rich-text-editor" \
  --body "Verify AI mirror analyzes Markdown content correctly - renders text, not syntax (SC-018).

**Acceptance Criteria:**
- [ ] Create Markdown reflection with formatting (bold, italic, headings, lists)
- [ ] Click \"Ask AI Mirror\"
- [ ] Verify AI responds to content meaning, not syntax
- [ ] AI should not mention \"bold text\", \"list items\", or Markdown markers
- [ ] Response should be reflective and non-directive

**Requirements:**
- Requires running application
- Ollama running with model available

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T146)"

echo "✅ Created issue 11: Verify AI mirror integration (T146)"

# Issue 12: T147
gh issue create \
  --repo "$REPO" \
  --title "Run accessibility audit (T147)" \
  --label "testing,accessibility,automated-testing,001-rich-text-editor" \
  --body "Run accessibility audit for keyboard navigation, screen reader support, and WCAG 2.1 Level AA color contrast.

**Acceptance Criteria:**
- [ ] Run axe-core accessibility tests on all views
- [ ] Verify WCAG 2.1 Level AA compliance
- [ ] Test keyboard navigation (Tab, Enter, Escape, arrows)
- [ ] Verify visible focus indicators
- [ ] Verify color contrast ratios (4.5:1 minimum)
- [ ] Document any violations found

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** \`frontend/tests/e2e/accessibility.spec.js\`

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T147)"

echo "✅ Created issue 12: Run accessibility audit (T147)"

# Issue 13: T148
gh issue create \
  --repo "$REPO" \
  --title "Run performance benchmarks (T148)" \
  --label "testing,performance,automated-testing,001-rich-text-editor" \
  --body "Run performance benchmarks: preview rendering < 200ms, toolbar actions < 100ms, AI rephrasing < 5s (SC-001, SC-006, SC-009).

**Acceptance Criteria:**
- [ ] Markdown preview renders in < 200ms
- [ ] Toolbar actions respond in < 100ms
- [ ] App loads in < 2 seconds
- [ ] AI rephrasing responds in < 5 seconds
- [ ] All benchmarks pass

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** \`frontend/tests/e2e/performance.spec.js\`

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T148)"

echo "✅ Created issue 13: Run performance benchmarks (T148)"

# Issue 14: T149
gh issue create \
  --repo "$REPO" \
  --title "Test with large documents (10,000+ words) (T149)" \
  --label "testing,performance,manual-testing,001-rich-text-editor" \
  --body "Test with large document (10,000+ words) to verify smooth performance (SC-016).

**Acceptance Criteria:**
- [ ] Create reflection with 10,000+ words
- [ ] Test typing performance (no lag)
- [ ] Test preview rendering (< 1 second)
- [ ] Test scrolling (smooth)
- [ ] Test save performance
- [ ] Verify UI doesn't freeze

**Requirements:**
- Requires running application
- Generate large text for testing

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T149)"

echo "✅ Created issue 14: Test large documents (T149)"

# Issue 15: T150
gh issue create \
  --repo "$REPO" \
  --title "Run security audit for XSS protection (T150)" \
  --label "testing,security,automated-testing,001-rich-text-editor" \
  --body "Run security audit to verify XSS protection with malicious Markdown input.

**Acceptance Criteria:**
- [ ] Test various XSS payloads (script tags, event handlers, etc.)
- [ ] Verify DOMPurify sanitizes dangerous HTML
- [ ] Verify safe HTML elements rendered correctly
- [ ] Document all XSS payloads tested
- [ ] All security tests pass

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** \`frontend/tests/e2e/security.spec.js\`

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T150)"

echo "✅ Created issue 15: Run security audit (T150)"

# Issue 16: T151
gh issue create \
  --repo "$REPO" \
  --title "Manual keyboard-only testing (T151)" \
  --label "testing,accessibility,manual-testing,001-rich-text-editor" \
  --body "Manual testing with keyboard only (no mouse) - verify all features accessible.

**Acceptance Criteria:**
- [ ] Navigate entire app using only keyboard
- [ ] Test Tab/Shift+Tab navigation
- [ ] Test Enter/Space activation
- [ ] Test Escape to close dialogs
- [ ] Test arrow keys in lists
- [ ] Test all keyboard shortcuts (Cmd+B, Cmd+I, Cmd+K, Cmd+P)
- [ ] Verify logical tab order
- [ ] Test all views: Compose, History, Settings, Export, Coach

**Requirements:**
- Requires running application
- No mouse usage allowed during test

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T151)"

echo "✅ Created issue 16: Manual keyboard-only testing (T151)"

# Issue 17: T152
gh issue create \
  --repo "$REPO" \
  --title "Manual VoiceOver/screen reader testing (T152)" \
  --label "testing,accessibility,manual-testing,001-rich-text-editor" \
  --body "Manual testing with VoiceOver (macOS screen reader) - verify all labels readable.

**Acceptance Criteria:**
- [ ] Enable VoiceOver (Cmd+F5 on macOS)
- [ ] Navigate to each view
- [ ] Verify all buttons have proper labels
- [ ] Verify all inputs have proper labels
- [ ] Verify roles correctly announced
- [ ] Verify states correctly announced (checked, expanded, etc.)
- [ ] Document any missing or incorrect labels

**Requirements:**
- Requires running application
- VoiceOver (macOS) or NVDA (Windows)

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T152)"

echo "✅ Created issue 17: Manual VoiceOver testing (T152)"

# Issue 18: T154
gh issue create \
  --repo "$REPO" \
  --title "Run full test suite (T154)" \
  --label "testing,automated-testing,001-rich-text-editor" \
  --body "Run full test suite: unit, integration, and E2E tests.

**Acceptance Criteria:**
- [ ] Backend: \`cd backend && npm test\`
- [ ] Backend integration: \`cd backend && npm run test:integration\`
- [ ] Backend coverage: \`cd backend && npm run test:coverage\`
- [ ] Frontend: \`cd frontend && npm test\`
- [ ] Frontend E2E: \`cd frontend && npm run test:e2e\`
- [ ] Frontend coverage: \`cd frontend && npm run test:coverage\`
- [ ] All tests pass
- [ ] Coverage > 80%

**Requirements:**
- Dependencies installed: \`npm install\`

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T154)"

echo "✅ Created issue 18: Run full test suite (T154)"

# Issue 19: T155
gh issue create \
  --repo "$REPO" \
  --title "Validate against quickstart checklist (T155)" \
  --label "testing,validation,001-rich-text-editor" \
  --body "Validate against quickstart.md completion checklist (all P1, P2, P3 items checked).

**Acceptance Criteria:**
- [ ] P1: Basic Markdown editing works
- [ ] P1: Live preview renders correctly
- [ ] P1: Toggle between edit/preview
- [ ] P1: Keyboard shortcuts work
- [ ] P2: Formatting toolbar complete
- [ ] P2: All toolbar buttons functional
- [ ] P2: Link dialog works
- [ ] P3: AI rephrasing functional
- [ ] P3: All three styles work
- [ ] P3: Privacy preserved

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T155)"

echo "✅ Created issue 19: Validate quickstart checklist (T155)"

# Issue 20: T207
gh issue create \
  --repo "$REPO" \
  --title "Test storage location switching (T207)" \
  --label "testing,manual-testing,storage,001-rich-text-editor" \
  --body "Test storage location switching between local, iCloud, and custom paths.

**Acceptance Criteria:**
- [ ] Create reflection in default location
- [ ] Switch to iCloud Drive
- [ ] Create another reflection
- [ ] Verify both reflections saved correctly in their respective locations
- [ ] Switch back to default location
- [ ] Verify original reflection visible, new one not visible

**Requirements:**
- Requires running application
- macOS for iCloud testing (optional)

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T207)"

echo "✅ Created issue 20: Test storage location switching (T207)"

# Issue 21: T208
gh issue create \
  --repo "$REPO" \
  --title "Test custom storage path (T208)" \
  --label "testing,manual-testing,storage,001-rich-text-editor" \
  --body "Test custom storage path functionality.

**Acceptance Criteria:**
- [ ] Go to Settings → Storage Location
- [ ] Select \"Custom Location\"
- [ ] Enter absolute path: \`/tmp/life-lab-test\`
- [ ] Save settings
- [ ] Create reflection
- [ ] Verify file exists at custom path
- [ ] Verify reflection loads from custom path

**Requirements:**
- Requires running application

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T208)"

echo "✅ Created issue 21: Test custom storage path (T208)"

# Issue 22: T209
gh issue create \
  --repo "$REPO" \
  --title "Test iCloud availability detection (T209)" \
  --label "testing,manual-testing,storage,macos,001-rich-text-editor" \
  --body "Test iCloud availability detection on macOS vs non-macOS systems.

**Acceptance Criteria:**
- [ ] On macOS: verify \"iCloud Drive\" option appears in Settings
- [ ] On macOS: verify correct iCloud path shown
- [ ] On non-macOS: verify iCloud option not available
- [ ] On macOS without iCloud: verify graceful fallback

**Requirements:**
- Requires running application
- Test on both macOS and non-macOS systems

**Related Spec:** \`specs/001-rich-text-editor/tasks.md\` (T209)"

echo "✅ Created issue 22: Test iCloud availability detection (T209)"

# Issue 23: Dynamic Coach Prompts - Basic Functionality
gh issue create \
  --repo "$REPO" \
  --title "Manual testing: Dynamic Coach Prompts - Basic Functionality" \
  --label "testing,manual-testing,002-dynamic-coach-prompts" \
  --body "Manual testing of basic Dynamic Coach Prompts functionality.

**Acceptance Criteria:**
- [ ] Load prompts from file
- [ ] Select different prompts for each persona
- [ ] Copy prompt to clipboard (verify paste works)
- [ ] Chat with each persona
- [ ] Send multiple messages
- [ ] Verify streaming responses work
- [ ] Test error handling (invalid file, AI errors)
- [ ] Verify fallback to hardcoded prompts
- [ ] Test UI responsive on mobile

**Requirements:**
- Requires running application
- Follow manual testing checklist in specs/002-dynamic-coach-prompts/tasks.md

**Related Spec:** \`specs/002-dynamic-coach-prompts/tasks.md\` (T057 manual checklist)"

echo "✅ Created issue 23: Dynamic Coach Prompts - Basic Functionality"

# Issue 24: Dynamic Coach Prompts - Performance & Accessibility
gh issue create \
  --repo "$REPO" \
  --title "Manual testing: Dynamic Coach Prompts - Performance & Accessibility" \
  --label "testing,manual-testing,performance,accessibility,002-dynamic-coach-prompts" \
  --body "Manual testing of Dynamic Coach Prompts performance and accessibility.

**Acceptance Criteria:**

**Performance:**
- [ ] Prompt loading time < 100ms
- [ ] Chat response starts < 1s
- [ ] Streaming smooth (no stutters)
- [ ] No memory leaks
- [ ] File caching works

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Screen reader friendly
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

**Requirements:**
- Requires running application
- Performance monitoring tools
- Screen reader (VoiceOver/NVDA)

**Related Spec:** \`specs/002-dynamic-coach-prompts/tasks.md\` (T058-T059 checklists)"

echo "✅ Created issue 24: Dynamic Coach Prompts - Performance & Accessibility"

echo ""
echo "✅ Successfully created all 24 GitHub issues!"
echo ""
echo "Summary:"
echo "- 000-product-vision: 3 issues"
echo "- 001-rich-text-editor: 19 issues"
echo "- 002-dynamic-coach-prompts: 2 issues"
echo "- Total: 24 issues"
