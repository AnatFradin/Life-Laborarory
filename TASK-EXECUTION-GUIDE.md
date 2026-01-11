# Task Execution Guide

**Created:** 2026-01-11  
**Purpose:** Step-by-step guide to complete all remaining tasks for Life-Laboratory project

## Overview

This guide provides detailed instructions for completing the 30+ remaining tasks across three feature specifications. Most implementation work is complete; remaining work focuses on testing, documentation, and quality assurance.

---

## Quick Start

### Prerequisites

1. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Start Ollama (for local AI):**
   ```bash
   ollama serve
   ollama pull llama2
   ```

3. **Start development servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

4. **Open application:** http://localhost:5173

---

## Phase 1: Documentation Updates (1-2 hours)

### ✅ T139: Add Markdown Editor Documentation to README

**File:** `README.md`

**Current section exists** (lines 148-188), needs enhancement:

**Add after line 147:**

```markdown
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

#### AI Rephrasing
Improve your writing with AI assistance:

1. Write some text in your reflection
2. Select the text you want to rephrase (or leave unselected to rephrase all)
3. Click the **Rephrase** button (purple) in the toolbar
4. Choose a style:
   - **Clearer**: Simplify complex language
   - **More Positive**: Reframe with a hopeful tone
   - **More Constructive**: Focus on growth and learning
5. Review 2-3 AI-generated suggestions
6. Click **Accept** on your preferred version, or **Cancel** to keep the original

**Privacy Note**: Rephrasing uses your selected AI provider (local Ollama by default, or online AI if configured in Settings). Only the selected/all text is sent - no other reflection data.
```

**Status:** ✅ Already exists in README.md (lines 148-188)

### ✅ T140: Verify CHANGELOG Entry

**File:** `CHANGELOG.md`

**Action:** Review lines 1-207 in CHANGELOG.md

**Status:** ✅ Already complete - comprehensive entry exists for Rich Text Editor feature

### ✅ T153: Code Review and Cleanup

**Action:** Search for and clean up:

```bash
# Find TODO comments
grep -r "TODO" backend/src/ frontend/src/

# Find console.log statements
grep -r "console.log" backend/src/ frontend/src/

# Find commented-out code (multi-line)
# Manual review required
```

**Check:**
- Remove or address TODO comments
- Remove debug console.log statements
- Remove commented-out code blocks
- Verify no sensitive data in code

---

## Phase 2: Manual Testing (3-4 hours)

**⚠️ Requires running application**

### Environment Setup

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Terminal 3 - For testing commands
cd /home/runner/work/Life-Laborarory/Life-Laborarory
```

### ✅ T137: Test AI Rephrasing with Ollama

**Prerequisites:**
- Ollama running: `ollama serve`
- Model available: `ollama pull llama2`

**Test Steps:**

1. Open http://localhost:5173
2. Navigate to Compose view
3. Enable Markdown mode
4. Type: "I'm really struggling with this difficult project and feeling overwhelmed."
5. Select the text
6. Click **Rephrase** button (purple)
7. Choose style: **More Positive**
8. Verify:
   - Loading spinner appears
   - 2-3 suggestions appear within 5 seconds
   - Suggestions are in same language as input
   - Accept button replaces original text
   - Cancel keeps original text

**Repeat for:**
- **Clearer** style: Use complex sentence
- **More Constructive** style: Use negative phrasing
- Full text rephrasing (no selection)
- Different languages (if multilingual)

**Pass Criteria:**
- ✅ All styles work
- ✅ Response time < 5 seconds
- ✅ Language preserved
- ✅ Markdown formatting preserved

### ✅ T138: Test AI Rephrasing with Online AI

**Prerequisites:**
- OpenAI API key set in Settings (or Anthropic)

**Test Steps:**

1. Go to Settings
2. Change AI Provider to Online
3. Select OpenAI or Anthropic
4. Verify warning: "This will send data to [provider]"
5. Save settings
6. Repeat T137 test steps
7. Verify warning dialog appears before sending

**Pass Criteria:**
- ✅ Privacy warning shown
- ✅ User must acknowledge before sending
- ✅ Rephrasing works with online provider

### ✅ T144: Verify Backward Compatibility

**Test Steps:**

1. Create plain text reflection:
   - Open Compose
   - Ensure "Plain Text" mode selected
   - Type: "Today was a good day."
   - Save

2. Reload page
3. Open reflection from History
4. Verify:
   - Text displays correctly
   - No Markdown rendering applied
   - Can edit without enabling Markdown

**Pass Criteria:**
- ✅ Plain text reflections unchanged
- ✅ No forced Markdown conversion

### ✅ T145: Verify Export Functionality

**Test Steps:**

1. Create test reflections:
   - Plain text reflection
   - Markdown reflection with **bold**, *italic*, headers
   - Visual reflection (image)

2. Go to Export view
3. Export all reflections
4. Open exported .md file
5. Verify:
   - All reflections present
   - Markdown formatting preserved
   - Plain text readable
   - Images included (base64 or references)

**Pass Criteria:**
- ✅ Export completes successfully
- ✅ Markdown formatting preserved
- ✅ Valid Markdown syntax

### ✅ T146: Verify AI Mirror Integration

**Test Steps:**

1. Create Markdown reflection with formatting:
   ```markdown
   # Today's Reflection
   
   I worked on **important project** and learned:
   - New skills
   - Better approaches
   ```

2. Click "Ask AI Mirror"
3. Verify AI response:
   - Reflects on content (not Markdown syntax)
   - Doesn't mention "bold text" or "list items"
   - Responds to meaning

**Pass Criteria:**
- ✅ AI analyzes content, not syntax
- ✅ Reflective, non-directive response

### ✅ T207-T211: Storage Location Tests

**T207: Storage Location Switching**

1. Go to Settings → Storage Location
2. Note current location
3. Create test reflection: "Test 1"
4. Switch to different location (iCloud or Custom)
5. Create test reflection: "Test 2"
6. Verify:
   - Only "Test 2" visible in History
7. Switch back to original location
8. Verify:
   - "Test 1" visible again
   - "Test 2" not visible

**T208: Custom Path**

1. Go to Settings → Storage Location
2. Select "Custom Location"
3. Enter absolute path: `/tmp/life-lab-test`
4. Save
5. Create reflection
6. Verify file exists:
   ```bash
   ls -la /tmp/life-lab-test/reflections/
   ```

**T209: iCloud Detection (macOS only)**

1. On macOS, go to Settings
2. Check if "iCloud Drive" option appears
3. If available, verify path shown
4. On non-macOS, verify iCloud not offered

**T210: Migration Scenario**

1. Create 3 reflections in default location
2. Switch to new location
3. Verify old reflections not visible
4. Create new reflection in new location
5. Switch back to default
6. Verify:
   - Original 3 reflections visible
   - New reflection not visible (in other location)

**T211: Error Handling**

1. Enter invalid custom path: `/invalid/path/that/does/not/exist`
2. Save settings
3. Try to create reflection
4. Verify:
   - Graceful error message shown
   - Suggests solution
   - Doesn't crash

### ✅ 002 Dynamic Coach Prompts: Manual Tests

**Load Prompts from File:**

1. Go to Coach view
2. Select a persona (e.g., Stoic Coach)
3. Click "Select Prompt"
4. Verify prompts load from file
5. Check console for errors

**Select Different Prompts:**

1. For each persona, click "Select Prompt"
2. Choose different prompt variant
3. Verify selection persists
4. Verify correct prompt used in chat

**Copy to Clipboard:**

1. Open prompt selector
2. Click "Copy" on a prompt
3. Paste into text editor
4. Verify full prompt text copied

**Chat with Persona:**

1. Select persona
2. Click "Chat" button
3. Send message: "I need advice on time management"
4. Verify:
   - Response appears
   - Uses selected prompt
   - Streaming works (if enabled)
   - Can send multiple messages

**Error Handling:**

1. Stop Ollama: `pkill ollama`
2. Try to chat
3. Verify graceful error message
4. Restart Ollama: `ollama serve`

**Mobile Responsive:**

1. Resize browser to mobile width (375px)
2. Test all features
3. Verify UI adapts

### ✅ T108: Screen Reader Testing

**macOS - VoiceOver:**

```bash
# Enable VoiceOver
Cmd + F5
```

**Test:**
1. Navigate entire app with VoiceOver
2. Verify all buttons announced
3. Check form labels
4. Verify dialog titles
5. Check focus management

**Windows - NVDA:**

1. Install NVDA (free screen reader)
2. Navigate app with NVDA
3. Verify all interactive elements announced

**Pass Criteria:**
- ✅ All buttons have labels
- ✅ Forms properly labeled
- ✅ Dialogs properly announced
- ✅ Focus management works

### ✅ T109: Network Isolation

**Test Steps:**

1. Open DevTools → Network tab
2. Create reflection (plain text)
3. Verify no network calls
4. Create reflection (Markdown)
5. Verify no network calls
6. Use AI Mirror (local Ollama)
7. Verify only localhost:11434 called
8. Switch to online AI
9. Verify warning shown
10. Use AI Mirror
11. Verify only approved provider called

**Pass Criteria:**
- ✅ No unauthorized network calls
- ✅ Local mode: only localhost
- ✅ Online mode: warning + approved provider only

### ✅ T110: Performance with 1000+ Reflections

**Setup:**

```bash
# Generate test reflections (create script)
node scripts/generate-test-data.js 1500
```

**Test Steps:**

1. Open app
2. Go to History view
3. Measure:
   - Initial load time
   - Scroll performance
   - Search/filter performance
4. Create new reflection
5. Verify no lag

**Pass Criteria:**
- ✅ History loads < 3 seconds
- ✅ Smooth scrolling
- ✅ No UI freezing

### ✅ T151: Keyboard-Only Testing

**Test Steps:**

1. Close all dialogs
2. Press Tab repeatedly
3. Navigate entire app with:
   - Tab / Shift+Tab (focus)
   - Enter / Space (activate)
   - Escape (close dialogs)
   - Arrow keys (lists)
   - Cmd/Ctrl+shortcuts

**Test each view:**
- Compose view
- History view
- Settings view
- Export view
- Coach view

**Pass Criteria:**
- ✅ All features accessible via keyboard
- ✅ Visible focus indicators
- ✅ Logical tab order

### ✅ T152: VoiceOver/Screen Reader Labels

**Test Steps:**

1. Enable VoiceOver (Cmd+F5 on macOS)
2. Navigate to each view
3. For each button/input:
   - Verify label announced
   - Verify role announced
   - Verify state announced (if applicable)

**Check:**
- Buttons: "Bold button", "Save button"
- Inputs: "Reflection text, edit text"
- Checkboxes: "Enable Markdown, checkbox, not checked"
- Radio buttons: announce all options

**Pass Criteria:**
- ✅ All interactive elements labeled
- ✅ Roles correctly announced
- ✅ States correctly announced

---

## Phase 3: Automated Testing (2-3 hours)

### ✅ T141: E2E Test for Markdown Editing

**File:** `frontend/tests/e2e/markdown-editing.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Markdown Editing', () => {
  test('should toggle between plain text and Markdown modes', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Go to compose view
    await page.click('[href="/"]');
    
    // Verify default is Plain Text
    await expect(page.locator('text=Plain Text')).toBeVisible();
    
    // Toggle to Markdown
    await page.click('text=Markdown');
    
    // Verify Markdown mode active
    await expect(page.locator('.markdown-toolbar')).toBeVisible();
  });

  test('should render Markdown preview correctly', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Enable Markdown
    await page.click('text=Markdown');
    
    // Type Markdown
    await page.fill('textarea', '# Heading\n\n**Bold** and *italic*');
    
    // Toggle to preview
    await page.keyboard.press('Control+P'); // or Meta+P on macOS
    
    // Verify rendered HTML
    await expect(page.locator('h1:has-text("Heading")')).toBeVisible();
    await expect(page.locator('strong:has-text("Bold")')).toBeVisible();
    await expect(page.locator('em:has-text("italic")')).toBeVisible();
  });

  test('should save and load Markdown reflection', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Create Markdown reflection
    await page.click('text=Markdown');
    await page.fill('textarea', '## Test Reflection\n\nThis is a test.');
    
    // Save
    await page.keyboard.press('Control+Enter');
    
    // Wait for save
    await page.waitForTimeout(1000);
    
    // Go to History
    await page.click('[href="/history"]');
    
    // Verify reflection exists
    await expect(page.locator('text=Test Reflection')).toBeVisible();
  });
});
```

**Run test:**
```bash
cd frontend
npm run test:e2e -- markdown-editing.spec.js
```

### ✅ T142: E2E Test for Toolbar

**File:** `frontend/tests/e2e/markdown-toolbar.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Markdown Toolbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Markdown');
  });

  test('should insert bold formatting', async ({ page }) => {
    const textarea = page.locator('textarea');
    
    // Type text
    await textarea.fill('test text');
    
    // Select "text"
    await textarea.press('Shift+End');
    
    // Click Bold button
    await page.click('[aria-label*="Bold"]');
    
    // Verify Markdown inserted
    const value = await textarea.inputValue();
    expect(value).toContain('**text**');
  });

  test('should insert italic formatting', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('test text');
    await textarea.press('Shift+End');
    
    // Click Italic button
    await page.click('[aria-label*="Italic"]');
    
    const value = await textarea.inputValue();
    expect(value).toContain('*text*');
  });

  test('should insert heading', async ({ page }) => {
    const textarea = page.locator('textarea');
    
    // Click H1 button
    await page.click('[aria-label*="Heading 1"]');
    
    const value = await textarea.inputValue();
    expect(value).toContain('# ');
  });

  test('should insert link with dialog', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('link text');
    
    // Select text
    await textarea.press('Control+A');
    
    // Click Link button
    await page.click('[aria-label*="Link"]');
    
    // Verify dialog opens
    await expect(page.locator('text=Insert Link')).toBeVisible();
    
    // Enter URL
    await page.fill('[placeholder*="URL"]', 'https://example.com');
    
    // Submit
    await page.click('text=Insert');
    
    // Verify Markdown inserted
    const value = await textarea.inputValue();
    expect(value).toBe('[link text](https://example.com)');
  });

  test('should use keyboard shortcuts', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('test');
    await textarea.press('Control+A');
    
    // Cmd/Ctrl+B for bold
    await page.keyboard.press('Control+B');
    
    const value = await textarea.inputValue();
    expect(value).toContain('**test**');
  });
});
```

### ✅ T143: E2E Test for AI Rephrasing

**File:** `frontend/tests/e2e/ai-rephrasing.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('AI Rephrasing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Markdown');
  });

  test('should open rephrase dialog', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('I am struggling with this difficult task.');
    
    // Click Rephrase button
    await page.click('button:has-text("Rephrase")');
    
    // Verify dialog opens
    await expect(page.locator('text=AI Rephrasing')).toBeVisible();
    await expect(page.locator('text=Clearer')).toBeVisible();
    await expect(page.locator('text=More Positive')).toBeVisible();
    await expect(page.locator('text=More Constructive')).toBeVisible();
  });

  test('should rephrase text with selected style', async ({ page }) => {
    const textarea = page.locator('textarea');
    const originalText = 'I am struggling with this difficult task.';
    await textarea.fill(originalText);
    
    // Open rephrase dialog
    await page.click('button:has-text("Rephrase")');
    
    // Select style
    await page.click('text=More Positive');
    
    // Wait for suggestions (mock or actual)
    await page.waitForTimeout(2000);
    
    // Verify suggestions appear
    await expect(page.locator('.suggestion-card')).toBeVisible();
    
    // Accept first suggestion
    await page.click('button:has-text("Accept")').first();
    
    // Verify text replaced
    const newValue = await textarea.inputValue();
    expect(newValue).not.toBe(originalText);
  });

  test('should cancel rephrasing', async ({ page }) => {
    const textarea = page.locator('textarea');
    const originalText = 'Test text';
    await textarea.fill(originalText);
    
    // Open dialog
    await page.click('button:has-text("Rephrase")');
    
    // Click Cancel
    await page.click('button:has-text("Cancel")');
    
    // Verify text unchanged
    const value = await textarea.inputValue();
    expect(value).toBe(originalText);
  });

  test('should handle AI service unavailable', async ({ page }) => {
    // This test requires mocking the API to return error
    // Or stopping Ollama before test
    
    const textarea = page.locator('textarea');
    await textarea.fill('Test text');
    
    await page.click('button:has-text("Rephrase")');
    
    // Select style
    await page.click('text=Clearer');
    
    // Wait for error
    await page.waitForTimeout(2000);
    
    // Verify error message
    await expect(page.locator('text=AI service unavailable')).toBeVisible();
  });
});
```

### ✅ T147: Accessibility Audit

**File:** `frontend/tests/e2e/accessibility.spec.js`

```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('Compose view should pass axe', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('History view should pass axe', async ({ page }) => {
    await page.goto('http://localhost:5173/history');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('Settings view should pass axe', async ({ page }) => {
    await page.goto('http://localhost:5173/settings');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('Coach view should pass axe', async ({ page }) => {
    await page.goto('http://localhost:5173/coach');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    expect(results.violations).toEqual([]);
  });
});
```

**Run:**
```bash
cd frontend
npm install --save-dev @axe-core/playwright
npm run test:e2e -- accessibility.spec.js
```

### ✅ T148: Performance Benchmarks

**File:** `frontend/tests/e2e/performance.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('Markdown preview should render in < 200ms', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Markdown');
    
    const textarea = page.locator('textarea');
    
    // Measure rendering time
    const start = Date.now();
    await textarea.fill('# Heading\n\n**Bold** text\n\n- List item 1\n- List item 2');
    
    // Toggle to preview
    await page.keyboard.press('Control+P');
    
    // Wait for preview to render
    await page.locator('h1:has-text("Heading")').waitFor();
    const elapsed = Date.now() - start;
    
    expect(elapsed).toBeLessThan(200);
  });

  test('Toolbar actions should respond in < 100ms', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Markdown');
    
    const textarea = page.locator('textarea');
    await textarea.fill('test');
    
    // Measure button click response
    const start = Date.now();
    await page.click('[aria-label*="Bold"]');
    await page.waitForTimeout(50); // Small delay for update
    const elapsed = Date.now() - start;
    
    expect(elapsed).toBeLessThan(100);
  });

  test('App should load in < 2 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('http://localhost:5173');
    
    // Wait for main content
    await page.locator('text=Compose').waitFor();
    const elapsed = Date.now() - start;
    
    expect(elapsed).toBeLessThan(2000);
  });
});
```

### ✅ T149: Test Large Documents

**Create test:**

```javascript
test('should handle large document (10,000+ words)', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Markdown');
  
  // Generate large text
  const paragraph = 'Lorem ipsum dolor sit amet. '.repeat(100); // ~500 words
  const largeText = (paragraph + '\n\n').repeat(20); // ~10,000 words
  
  const textarea = page.locator('textarea');
  
  // Fill with large text
  const fillStart = Date.now();
  await textarea.fill(largeText);
  const fillTime = Date.now() - fillStart;
  
  // Toggle to preview
  const previewStart = Date.now();
  await page.keyboard.press('Control+P');
  await page.waitForTimeout(500);
  const previewTime = Date.now() - previewStart;
  
  // Verify performance
  expect(fillTime).toBeLessThan(1000);
  expect(previewTime).toBeLessThan(1000);
  
  // Verify no UI freeze
  await page.click('[href="/history"]');
  await expect(page.locator('text=History')).toBeVisible();
});
```

### ✅ T150: Security Audit (XSS)

**File:** `frontend/tests/e2e/security.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('XSS Protection', () => {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror="alert(1)">',
    '<svg/onload=alert(1)>',
    'javascript:alert(1)',
    '<iframe src="javascript:alert(1)">',
  ];

  for (const payload of xssPayloads) {
    test(`should sanitize XSS payload: ${payload}`, async ({ page }) => {
      await page.goto('http://localhost:5173');
      await page.click('text=Markdown');
      
      const textarea = page.locator('textarea');
      await textarea.fill(payload);
      
      // Toggle to preview
      await page.keyboard.press('Control+P');
      
      // Verify no script executed
      // Check that dangerous tags are removed
      const html = await page.locator('.markdown-preview').innerHTML();
      
      expect(html).not.toContain('<script');
      expect(html).not.toContain('onerror=');
      expect(html).not.toContain('javascript:');
      expect(html).not.toContain('<iframe');
    });
  }

  test('should preserve safe HTML elements', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Markdown');
    
    const safeMarkdown = '# Heading\n\n**Bold** and *italic*\n\n[Link](https://example.com)';
    
    await page.fill('textarea', safeMarkdown);
    await page.keyboard.press('Control+P');
    
    // Verify safe elements rendered
    await expect(page.locator('h1:has-text("Heading")')).toBeVisible();
    await expect(page.locator('strong:has-text("Bold")')).toBeVisible();
    await expect(page.locator('a[href="https://example.com"]')).toBeVisible();
  });
});
```

### ✅ T154: Run Full Test Suite

**Backend:**
```bash
cd backend
npm test
npm run test:integration
npm run test:coverage
```

**Frontend:**
```bash
cd frontend
npm test
npm run test:e2e
npm run test:coverage
```

**Verify:**
- All tests pass
- Coverage > 80%
- No flaky tests

---

## Phase 4: Final Validation (30 min)

### ✅ T155: Validate Against Quickstart Checklist

**File:** `specs/001-rich-text-editor/quickstart.md`

**Go through checklist:**

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

### Final Smoke Test

**Quick test of all major features:**

1. ✅ Create text reflection
2. ✅ Create Markdown reflection
3. ✅ Create visual reflection
4. ✅ Use AI Mirror
5. ✅ Use AI Rephrasing
6. ✅ Chat with coach persona
7. ✅ Export data
8. ✅ Delete reflection
9. ✅ Change settings
10. ✅ Switch storage location

---

## Completion Checklist

### Documentation
- [ ] T139: README updated (already done)
- [ ] T140: CHANGELOG verified (already done)
- [ ] T153: Code reviewed and cleaned

### Manual Testing  
- [ ] T137: Ollama AI rephrasing tested
- [ ] T138: Online AI rephrasing tested
- [ ] T144: Backward compatibility verified
- [ ] T145: Export functionality verified
- [ ] T146: AI mirror integration verified
- [ ] T207-T211: Storage location tests (5 items)
- [ ] T108: Screen reader testing complete
- [ ] T109: Network isolation verified
- [ ] T110: Performance with 1000+ reflections
- [ ] T151: Keyboard-only navigation verified
- [ ] T152: Screen reader labels verified
- [ ] Dynamic coach prompts manual tests (10 items)

### Automated Testing
- [ ] T141: E2E Markdown editing test created
- [ ] T142: E2E toolbar test created
- [ ] T143: E2E AI rephrasing test created
- [ ] T147: Accessibility audit run
- [ ] T148: Performance benchmarks run
- [ ] T149: Large document test created
- [ ] T150: Security audit created
- [ ] T154: Full test suite passes

### Final Validation
- [ ] T155: Quickstart checklist validated
- [ ] Final smoke test complete
- [ ] All issues documented

---

## Success Criteria

✅ **When all tasks complete:**

1. All features manually tested and working
2. Documentation up-to-date
3. E2E tests provide regression protection
4. Accessibility verified (WCAG 2.1 AA)
5. Performance meets requirements
6. Security validated (XSS protection)
7. Ready for production use

---

## Notes for AI Agent

**When executing this guide:**

1. Start with Phase 1 (documentation) - quick wins
2. Install dependencies before Phase 2
3. Keep application running during manual tests
4. Create E2E tests incrementally
5. Document any issues found
6. Update this guide if steps need clarification

**If stuck:**
- Check that dependencies are installed
- Verify servers are running
- Check for port conflicts
- Review error messages carefully
- Test in isolation first

**Time tracking:**
- Log start/end times for each phase
- Note any blockers
- Track actual vs estimated time

---

**End of Task Execution Guide**
