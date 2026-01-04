# Phase 8 Final Testing Guide (T108-T110)

This guide covers the manual testing required to complete Phase 8 tasks T108-T110. These tasks require a running application and cannot be fully automated.

## Prerequisites

1. **Running Application**:
   ```bash
   # Terminal 1: Start backend
   cd backend && npm run dev
   
   # Terminal 2: Start frontend
   cd frontend && npm run dev
   
   # Terminal 3: Ensure Ollama is running
   ollama serve
   ```

2. **Test Data**: Have at least a few reflections created for testing

## T108: Screen Reader Testing

**Objective**: Verify all user journeys work with screen readers (VoiceOver/NVDA)

### Setup

**macOS (VoiceOver)**:
- Enable: `Cmd + F5`
- Practice mode: `Cmd + F8`
- Navigate: `Control + Option + Arrow keys`

**Windows (NVDA)**:
- Download: https://www.nvaccess.org/download/
- Start: `Ctrl + Alt + N`
- Navigate: Arrow keys
- Forms mode: Automatic

### Test Scenarios

#### 1. Writing a Reflection
1. Navigate to Compose view
2. Verify heading is announced: "Compose"
3. Tab to textarea
4. Verify input is labeled properly
5. Type some text
6. Tab to "Save" button
7. Verify button is announced with state
8. Activate button (Space/Enter)
9. Verify success message is announced

**Expected**: All controls are properly labeled and announced

#### 2. Requesting AI Feedback
1. After writing reflection, tab to "Ask AI Mirror" button
2. Verify button purpose is clear
3. Activate button
4. Verify loading state is announced
5. Verify AI response is announced when ready

**Expected**: Loading and completion states are announced

#### 3. Viewing History
1. Navigate to History view
2. Verify heading "History" is announced
3. Verify reflection count is announced
4. Navigate through reflection list
5. Verify each reflection's date and preview are read

**Expected**: List is navigable and all content is readable

#### 4. Exporting Data
1. Navigate to Export view
2. Navigate through export options
3. Verify all buttons and descriptions are read
4. Open export dialog
5. Verify dialog is announced
6. Navigate dialog controls
7. Close with Escape

**Expected**: Dialog traps focus and all controls are accessible

#### 5. Changing Settings
1. Navigate to Settings view
2. Navigate through settings groups
3. Verify radio buttons for AI provider
4. Verify select controls for models
5. Verify save button state

**Expected**: All form controls are properly labeled

### Pass Criteria

- [ ] All interactive elements are announced
- [ ] Form labels are read correctly
- [ ] Button states (disabled, loading) are announced
- [ ] Error messages are read
- [ ] Success messages are announced
- [ ] Dialogs are properly announced and escapable
- [ ] Focus order is logical
- [ ] No "unlabeled button" or "blank" announcements

### Known Issues to Document

Document any issues found with:
- Missing labels
- Unclear announcements
- Focus traps
- Illogical reading order

---

## T109: Network Call Verification

**Objective**: Verify no unauthorized network calls (FR-018, SC-001)

### Setup

1. Open browser DevTools (F12)
2. Go to Network tab
3. Clear any existing requests
4. Keep Network tab open during all tests

### Test Scenarios

#### 1. Local-Only Mode (Default)
1. Verify Settings shows "Local AI (Ollama)" selected
2. Clear network log
3. Write a reflection
4. Request AI feedback
5. **Check Network tab**

**Expected**:
- Only requests to `localhost:3000` (backend API)
- Only requests to `localhost:11434` (Ollama)
- NO requests to external domains
- NO analytics/tracking requests

#### 2. Page Load
1. Clear network log
2. Refresh page
3. Let app fully load
4. **Check Network tab**

**Expected**:
- Requests only to localhost
- No external CDNs
- No tracking pixels
- No analytics scripts

#### 3. Online AI Mode (If Configured)
1. Go to Settings
2. Switch to online AI (OpenAI/Anthropic)
3. Acknowledge warning
4. Clear network log
5. Request AI feedback
6. **Check Network tab**

**Expected**:
- Requests to OpenAI/Anthropic API (expected)
- Request contains reflection content (expected)
- NO other external requests
- NO analytics/tracking

#### 4. Export Function
1. Clear network log
2. Export reflections
3. Download starts
4. **Check Network tab**

**Expected**:
- Only requests to `localhost:3000/api/export`
- NO upload to external servers
- File downloads locally

### Pass Criteria

- [ ] Local mode: Zero external network calls
- [ ] Local mode: Only localhost:3000 and localhost:11434
- [ ] Online AI: Only authorized AI provider calls
- [ ] No analytics or tracking scripts
- [ ] No data sent to unexpected domains
- [ ] Export downloads locally, not uploaded

### Document Any Violations

If unexpected network calls found:
- Domain called
- Request payload
- When it occurred
- Why it might be happening

---

## T110: Performance Validation (1000+ Reflections)

**Objective**: Verify app handles large datasets without degradation (SC-017)

### Setup: Generate Test Data

Create a script to generate 1000+ test reflections:

```javascript
// Save as backend/scripts/generate-test-reflections.js
import { LocalFileRepository } from '../src/adapters/storage/LocalFileRepository.js';

const repo = new LocalFileRepository();

async function generateReflections(count) {
  console.log(`Generating ${count} test reflections...`);
  
  for (let i = 0; i < count; i++) {
    // Spread across 12 months
    const date = new Date();
    date.setMonth(date.getMonth() - (i % 12));
    date.setDate(Math.floor(Math.random() * 28) + 1);
    
    await repo.save({
      mode: 'text',
      content: `Test reflection ${i + 1}. This is some sample text for testing performance with many reflections. The date is ${date.toISOString()}.`,
      timestamp: date.toISOString(),
    });
    
    if ((i + 1) % 100 === 0) {
      console.log(`Generated ${i + 1}/${count}...`);
    }
  }
  
  console.log('Done!');
}

generateReflections(1000);
```

Run it:
```bash
cd backend
node scripts/generate-test-reflections.js
```

### Test Scenarios

#### 1. Initial Load Time
1. Clear browser cache
2. Close and reopen browser
3. Open DevTools Console
4. Navigate to http://localhost:5173
5. Note: "Page load: X ms" in console
6. Verify page becomes interactive

**Pass Criteria**:
- [ ] Page loads in < 2 seconds
- [ ] No "slow load" warnings in console
- [ ] UI is immediately responsive

#### 2. History View Load
1. Navigate to History view
2. Note load time
3. Verify reflections appear
4. Check for lazy loading (not all 1000 at once)

**Pass Criteria**:
- [ ] First reflections appear quickly (< 500ms)
- [ ] Smooth scrolling
- [ ] No UI freeze
- [ ] Memory usage reasonable (< 200MB for tab)

#### 3. Scroll Performance
1. In History view, scroll down
2. Continue scrolling through many reflections
3. Monitor for lag or jank
4. Check Chrome DevTools Performance tab

**Pass Criteria**:
- [ ] Smooth 60fps scrolling
- [ ] No dropped frames
- [ ] Lazy loading works (loads more as you scroll)
- [ ] No memory leaks

#### 4. Search/Filter Performance
1. Use any search or filter features
2. Type search query
3. Note response time

**Pass Criteria**:
- [ ] Search results appear quickly (< 100ms)
- [ ] Typing is not blocked
- [ ] UI remains responsive

#### 5. Save Performance
1. Compose new reflection
2. Save it
3. Note save time

**Pass Criteria**:
- [ ] Saves in < 100ms
- [ ] No UI freeze
- [ ] Appears in History immediately

#### 6. Export Performance (100 reflections)
1. Export first 100 reflections
2. Time the export
3. Verify file downloads

**Pass Criteria**:
- [ ] Export completes in < 10 seconds (SC-003)
- [ ] UI remains responsive during export
- [ ] File is valid and readable

#### 7. Memory Usage Over Time
1. Open browser Task Manager (Shift+Esc in Chrome)
2. Use app normally for 5 minutes
3. Navigate between views
4. Create reflections
5. Monitor memory usage

**Pass Criteria**:
- [ ] Memory stable (no continuous growth)
- [ ] No memory leaks
- [ ] Total memory < 300MB for tab

### Performance Metrics

Use the built-in performance monitor:

```javascript
// In browser console
window.__performanceMetrics.printReport()
```

**Pass Criteria**:
- [ ] Average page load < 2000ms
- [ ] Average interaction < 100ms
- [ ] No more than 5% slow operations
- [ ] No performance warnings in console

### Document Performance Issues

If issues found, document:
- What action triggered it
- How long it took
- System specs (CPU, RAM, browser)
- Any error messages
- Possible causes

---

## Final Checklist

After completing all manual tests:

### T108: Screen Reader
- [ ] All major user journeys tested
- [ ] Issues documented
- [ ] Critical issues fixed
- [ ] Passes basic screen reader usage

### T109: Network Calls
- [ ] Local mode verified privacy
- [ ] No unexpected network calls
- [ ] Online mode only calls authorized APIs
- [ ] Export stays local

### T110: Performance
- [ ] 1000+ reflections generated
- [ ] Load time < 2s verified
- [ ] Interactions < 100ms verified
- [ ] No degradation with large dataset
- [ ] Memory usage acceptable

### Documentation
- [ ] Update tasks.md with results
- [ ] Document any issues found
- [ ] Create GitHub issues for bugs
- [ ] Update user guide if needed

---

## Reporting Results

Create a summary report:

```markdown
# Phase 8 Testing Results

## T108: Screen Reader Testing
- Platform: [macOS VoiceOver / Windows NVDA]
- Date: [YYYY-MM-DD]
- Result: [PASS / FAIL]
- Issues: [List any issues]

## T109: Network Call Verification
- Browser: [Chrome / Firefox / Safari]
- Date: [YYYY-MM-DD]
- Result: [PASS / FAIL]
- Unexpected calls: [None / List if any]

## T110: Performance Validation
- Dataset: [1000 reflections]
- Date: [YYYY-MM-DD]
- Load time: [X ms]
- Interaction time: [X ms]
- Result: [PASS / FAIL]
- Issues: [List any issues]
```

Save this report as: `/docs/phase8-testing-report.md`
