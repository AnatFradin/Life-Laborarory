# GitHub Issues for Remaining Tasks

This document contains the list of GitHub issues to be created for all uncompleted tasks in the Life-Laboratory project.

---

## 000-product-vision: Manual Testing (3 issues)

### Issue 1: Manual screen reader testing for all user journeys (T108)

**Title:** Manual screen reader testing for all user journeys (T108)

**Labels:** `testing`, `accessibility`, `manual-testing`, `000-product-vision`

**Description:**
Run manual screen reader testing (VoiceOver on macOS or NVDA on Windows) for all user journeys per SC-009.

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

**Related Spec:** `specs/000-product-vision/tasks.md` (T108)

---

### Issue 2: Verify network isolation and privacy (T109)

**Title:** Verify network isolation and privacy (T109)

**Labels:** `testing`, `security`, `privacy`, `manual-testing`, `000-product-vision`

**Description:**
Verify no network calls except Ollama/user-chosen online AI per FR-018 and SC-001.

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

**Related Spec:** `specs/000-product-vision/tasks.md` (T109)

---

### Issue 3: Performance validation with 1000+ reflections (T110)

**Title:** Performance validation with 1000+ reflections (T110)

**Labels:** `testing`, `performance`, `manual-testing`, `000-product-vision`

**Description:**
Test with 1000+ reflections to verify no performance degradation per SC-017.

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

**Related Spec:** `specs/000-product-vision/tasks.md` (T110)

---

## 001-rich-text-editor: Testing & Documentation (19 issues)

### Issue 4: Test AI rephrasing with local Ollama (T137)

**Title:** Test AI rephrasing with local Ollama (T137)

**Labels:** `testing`, `ai`, `manual-testing`, `001-rich-text-editor`

**Description:**
Test AI-powered text rephrasing feature with local Ollama to ensure privacy is preserved.

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
- Model available: `ollama pull llama2`

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T137)

---

### Issue 5: Test AI rephrasing with online AI providers (T138)

**Title:** Test AI rephrasing with online AI providers (T138)

**Labels:** `testing`, `ai`, `manual-testing`, `001-rich-text-editor`

**Description:**
Test AI rephrasing with online AI providers (OpenAI/Anthropic) and verify privacy warnings are shown.

**Acceptance Criteria:**
- [ ] Configure online AI provider in Settings (OpenAI or Anthropic)
- [ ] Verify warning dialog shown: "This will send data to [provider]"
- [ ] User must acknowledge warning before sending
- [ ] Test all 3 rephrasing styles work with online provider
- [ ] Response time acceptable
- [ ] Privacy warning shown every time

**Requirements:**
- Requires running application
- OpenAI or Anthropic API key
- Follow TASK-EXECUTION-GUIDE.md instructions

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T138)

---

### Issue 6: Create E2E test for Markdown editing (T141)

**Title:** Create E2E test for Markdown editing (T141)

**Labels:** `testing`, `e2e`, `playwright`, `001-rich-text-editor`

**Description:**
Create end-to-end test for Markdown editing flows using Playwright.

**Acceptance Criteria:**
- [ ] Test toggle between Plain Text and Markdown modes
- [ ] Test Markdown preview rendering
- [ ] Test save and load Markdown reflection
- [ ] Test preview mode keyboard shortcut (Cmd/Ctrl+P)
- [ ] Test Markdown syntax rendering (headings, bold, italic, lists, links, blockquotes, code)

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** `frontend/tests/e2e/markdown-editing.spec.js`

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T141)

---

### Issue 7: Create E2E test for Markdown toolbar (T142)

**Title:** Create E2E test for Markdown toolbar (T142)

**Labels:** `testing`, `e2e`, `playwright`, `001-rich-text-editor`

**Description:**
Create end-to-end test for Markdown toolbar functionality using Playwright.

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

**File:** `frontend/tests/e2e/markdown-toolbar.spec.js`

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T142)

---

### Issue 8: Create E2E test for AI rephrasing (T143)

**Title:** Create E2E test for AI rephrasing (T143)

**Labels:** `testing`, `e2e`, `playwright`, `ai`, `001-rich-text-editor`

**Description:**
Create end-to-end test for AI rephrasing flow using Playwright.

**Acceptance Criteria:**
- [ ] Test opening rephrase dialog
- [ ] Test style selection (Clearer, More Positive, More Constructive)
- [ ] Test accepting suggestions
- [ ] Test canceling rephrasing
- [ ] Test error handling when AI unavailable

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** `frontend/tests/e2e/ai-rephrasing.spec.js`

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T143)

---

### Issue 9: Verify backward compatibility with plain text reflections (T144)

**Title:** Verify backward compatibility with plain text reflections (T144)

**Labels:** `testing`, `manual-testing`, `001-rich-text-editor`

**Description:**
Verify existing plain text reflections still work unchanged after Markdown feature addition.

**Acceptance Criteria:**
- [ ] Create plain text reflection (ensure Plain Text mode selected)
- [ ] Reload page and verify text displays correctly
- [ ] Verify no Markdown rendering applied to plain text
- [ ] Edit plain text reflection without enabling Markdown
- [ ] Verify plain text reflections can still be exported

**Requirements:**
- Requires running application

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T144)

---

### Issue 10: Verify export functionality with Markdown reflections (T145)

**Title:** Verify export functionality with Markdown reflections (T145)

**Labels:** `testing`, `manual-testing`, `export`, `001-rich-text-editor`

**Description:**
Verify Markdown reflections export correctly to .md files with formatting preserved (SC-017).

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

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T145)

---

### Issue 11: Verify AI mirror analyzes Markdown content correctly (T146)

**Title:** Verify AI mirror analyzes Markdown content correctly (T146)

**Labels:** `testing`, `manual-testing`, `ai`, `001-rich-text-editor`

**Description:**
Verify AI mirror analyzes Markdown content correctly - renders text, not syntax (SC-018).

**Acceptance Criteria:**
- [ ] Create Markdown reflection with formatting (bold, italic, headings, lists)
- [ ] Click "Ask AI Mirror"
- [ ] Verify AI responds to content meaning, not syntax
- [ ] AI should not mention "bold text", "list items", or Markdown markers
- [ ] Response should be reflective and non-directive

**Requirements:**
- Requires running application
- Ollama running with model available

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T146)

---

### Issue 12: Run accessibility audit (T147)

**Title:** Run accessibility audit (T147)

**Labels:** `testing`, `accessibility`, `automated-testing`, `001-rich-text-editor`

**Description:**
Run accessibility audit for keyboard navigation, screen reader support, and WCAG 2.1 Level AA color contrast.

**Acceptance Criteria:**
- [ ] Run axe-core accessibility tests on all views
- [ ] Verify WCAG 2.1 Level AA compliance
- [ ] Test keyboard navigation (Tab, Enter, Escape, arrows)
- [ ] Verify visible focus indicators
- [ ] Verify color contrast ratios (4.5:1 minimum)
- [ ] Document any violations found

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** `frontend/tests/e2e/accessibility.spec.js`

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T147)

---

### Issue 13: Run performance benchmarks (T148)

**Title:** Run performance benchmarks (T148)

**Labels:** `testing`, `performance`, `automated-testing`, `001-rich-text-editor`

**Description:**
Run performance benchmarks: preview rendering < 200ms, toolbar actions < 100ms, AI rephrasing < 5s (SC-001, SC-006, SC-009).

**Acceptance Criteria:**
- [ ] Markdown preview renders in < 200ms
- [ ] Toolbar actions respond in < 100ms
- [ ] App loads in < 2 seconds
- [ ] AI rephrasing responds in < 5 seconds
- [ ] All benchmarks pass

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** `frontend/tests/e2e/performance.spec.js`

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T148)

---

### Issue 14: Test with large documents (10,000+ words) (T149)

**Title:** Test with large documents (10,000+ words) (T149)

**Labels:** `testing`, `performance`, `manual-testing`, `001-rich-text-editor`

**Description:**
Test with large document (10,000+ words) to verify smooth performance (SC-016).

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

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T149)

---

### Issue 15: Run security audit for XSS protection (T150)

**Title:** Run security audit for XSS protection (T150)

**Labels:** `testing`, `security`, `automated-testing`, `001-rich-text-editor`

**Description:**
Run security audit to verify XSS protection with malicious Markdown input.

**Acceptance Criteria:**
- [ ] Test various XSS payloads (script tags, event handlers, etc.)
- [ ] Verify DOMPurify sanitizes dangerous HTML
- [ ] Verify safe HTML elements rendered correctly
- [ ] Document all XSS payloads tested
- [ ] All security tests pass

**Implementation:**
Complete test code provided in TASK-EXECUTION-GUIDE.md Phase 3.

**File:** `frontend/tests/e2e/security.spec.js`

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T150)

---

### Issue 16: Manual keyboard-only testing (T151)

**Title:** Manual keyboard-only testing (T151)

**Labels:** `testing`, `accessibility`, `manual-testing`, `001-rich-text-editor`

**Description:**
Manual testing with keyboard only (no mouse) - verify all features accessible.

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

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T151)

---

### Issue 17: Manual VoiceOver/screen reader testing (T152)

**Title:** Manual VoiceOver/screen reader testing (T152)

**Labels:** `testing`, `accessibility`, `manual-testing`, `001-rich-text-editor`

**Description:**
Manual testing with VoiceOver (macOS screen reader) - verify all labels readable.

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

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T152)

---

### Issue 18: Run full test suite (T154)

**Title:** Run full test suite (T154)

**Labels:** `testing`, `automated-testing`, `001-rich-text-editor`

**Description:**
Run full test suite: unit, integration, and E2E tests.

**Acceptance Criteria:**
- [ ] Backend: `cd backend && npm test`
- [ ] Backend integration: `cd backend && npm run test:integration`
- [ ] Backend coverage: `cd backend && npm run test:coverage`
- [ ] Frontend: `cd frontend && npm test`
- [ ] Frontend E2E: `cd frontend && npm run test:e2e`
- [ ] Frontend coverage: `cd frontend && npm run test:coverage`
- [ ] All tests pass
- [ ] Coverage > 80%

**Requirements:**
- Dependencies installed: `npm install`

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T154)

---

### Issue 19: Validate against quickstart checklist (T155)

**Title:** Validate against quickstart checklist (T155)

**Labels:** `testing`, `validation`, `001-rich-text-editor`

**Description:**
Validate against quickstart.md completion checklist (all P1, P2, P3 items checked).

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

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T155)

---

### Issue 20: Test storage location switching (T207)

**Title:** Test storage location switching (T207)

**Labels:** `testing`, `manual-testing`, `storage`, `001-rich-text-editor`

**Description:**
Test storage location switching between local, iCloud, and custom paths.

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

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T207)

---

### Issue 21: Test custom storage path (T208)

**Title:** Test custom storage path (T208)

**Labels:** `testing`, `manual-testing`, `storage`, `001-rich-text-editor`

**Description:**
Test custom storage path functionality.

**Acceptance Criteria:**
- [ ] Go to Settings → Storage Location
- [ ] Select "Custom Location"
- [ ] Enter absolute path: `/tmp/life-lab-test`
- [ ] Save settings
- [ ] Create reflection
- [ ] Verify file exists at custom path
- [ ] Verify reflection loads from custom path

**Requirements:**
- Requires running application

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T208)

---

### Issue 22: Test iCloud availability detection (T209)

**Title:** Test iCloud availability detection (T209)

**Labels:** `testing`, `manual-testing`, `storage`, `macos`, `001-rich-text-editor`

**Description:**
Test iCloud availability detection on macOS vs non-macOS systems.

**Acceptance Criteria:**
- [ ] On macOS: verify "iCloud Drive" option appears in Settings
- [ ] On macOS: verify correct iCloud path shown
- [ ] On non-macOS: verify iCloud option not available
- [ ] On macOS without iCloud: verify graceful fallback

**Requirements:**
- Requires running application
- Test on both macOS and non-macOS systems

**Related Spec:** `specs/001-rich-text-editor/tasks.md` (T209)

---

## 002-dynamic-coach-prompts: Manual Testing (10 issues - grouped into 2)

### Issue 23: Manual testing checklist for Dynamic Coach Prompts (Part 1)

**Title:** Manual testing checklist for Dynamic Coach Prompts - Basic Functionality

**Labels:** `testing`, `manual-testing`, `002-dynamic-coach-prompts`

**Description:**
Manual testing of basic Dynamic Coach Prompts functionality.

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

**Related Spec:** `specs/002-dynamic-coach-prompts/tasks.md` (T057 manual checklist)

---

### Issue 24: Manual testing checklist for Dynamic Coach Prompts (Part 2)

**Title:** Manual testing checklist for Dynamic Coach Prompts - Performance & Accessibility

**Labels:** `testing`, `manual-testing`, `performance`, `accessibility`, `002-dynamic-coach-prompts`

**Description:**
Manual testing of Dynamic Coach Prompts performance and accessibility.

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

**Related Spec:** `specs/002-dynamic-coach-prompts/tasks.md` (T058-T059 checklists)

---

## Summary

**Total Issues to Create: 24**

**Breakdown by Category:**
- Manual Testing: 14 issues
- E2E Automated Tests: 6 issues
- Validation/Documentation: 2 issues
- Full Test Suite: 2 issues

**Breakdown by Feature:**
- 000-product-vision: 3 issues
- 001-rich-text-editor: 19 issues
- 002-dynamic-coach-prompts: 2 issues (grouped)

**Labels Used:**
- `testing`
- `manual-testing`
- `automated-testing`
- `e2e`
- `accessibility`
- `performance`
- `security`
- `ai`
- `storage`
- `export`
- `playwright`
- `000-product-vision`
- `001-rich-text-editor`
- `002-dynamic-coach-prompts`
- `macos`

---

## How to Create These Issues

### Option 1: Automated Script (Recommended)

Run the provided shell script to create all 24 issues at once:

```bash
# Authenticate with GitHub first
gh auth login

# Run the script
./create-issues.sh
```

The script will create all 24 issues with proper labels and descriptions.

### Option 2: Manual Creation via GitHub Web UI

Copy/paste each issue template above into GitHub's "New Issue" form.

### Option 3: GitHub CLI (Individual Issues)

Create issues one by one using:
```bash
gh issue create --title "..." --body "..." --label "..."
```

**Note:** The automated script (`create-issues.sh`) is the fastest method and ensures consistency across all issues.
