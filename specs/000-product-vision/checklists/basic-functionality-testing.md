# Manual Testing Checklist - Basic Functionality

**Purpose**: Verify all core features work correctly for end-to-end user workflows  
**Target**: Life-Laboratory v1.0 MVP  
**Created**: 2026-01-11  
**Status**: Ready for Testing

## Prerequisites

Before starting manual tests:

- [ ] Backend server running on http://localhost:3000
- [ ] Frontend server running on http://localhost:5173
- [ ] Ollama installed and running (for local AI tests)
- [ ] Browser: Chrome, Firefox, or Safari (latest version)
- [ ] Fresh browser session (clear cache/cookies for clean test)

### Setup Instructions

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - Ollama (if testing AI features)
ollama serve
ollama pull llama2
```

---

## Test Session Information

**Tester Name**: _________________  
**Date**: _________________  
**Environment**: macOS / Windows / Linux  
**Browser**: Chrome / Firefox / Safari / Edge  
**Browser Version**: _________________

---

## 1. Application Startup & Navigation

### 1.1 Initial Load
**Objective**: Verify application loads successfully

**Steps**:
1. Open http://localhost:5173 in browser
2. Wait for application to load

**Expected Results**:
- [ ] Application loads within 3 seconds
- [ ] No JavaScript errors in console
- [ ] Navigation bar visible with links: Compose, History, Settings, Export, Coach
- [ ] Default view is Compose
- [ ] Application title "Laboratory of Life" visible

**Actual Results**:
```
Load time: ___ seconds
Errors (if any): ___________
Status: PASS / FAIL
```

---

### 1.2 Navigation Between Views
**Objective**: Verify all main navigation works

**Steps**:
1. Click "History" navigation link
2. Click "Settings" navigation link
3. Click "Export" navigation link
4. Click "Coach" navigation link
5. Click "Compose" navigation link

**Expected Results**:
- [ ] Each view loads without errors
- [ ] Active navigation link is highlighted
- [ ] Browser back button works
- [ ] No content from previous view remains visible
- [ ] URL updates correctly for each view

**Actual Results**:
```
Navigation test: PASS / FAIL
Issues: ___________
```

---

## 2. Creating Reflections

### 2.1 Create Plain Text Reflection
**Objective**: Verify basic text reflection creation

**Steps**:
1. Navigate to Compose view
2. Ensure "Plain Text" mode is selected
3. Type: "Today was a good day. I learned something new about myself."
4. Press Cmd/Ctrl+Enter (or click Save button)
5. Wait for save confirmation

**Expected Results**:
- [ ] Text appears in editor as typed
- [ ] Save button is enabled when text is entered
- [ ] Success message appears after save
- [ ] Reflection is saved (check History)
- [ ] Editor clears after save (or shows saved reflection)

**Actual Results**:
```
Save time: ___ seconds
Confirmation message: ___________
Status: PASS / FAIL
```

---

### 2.2 Create Markdown Reflection
**Objective**: Verify Markdown editing works

**Steps**:
1. Navigate to Compose view
2. Switch to "Markdown" mode
3. Type the following:
   ```
   # Today's Reflection
   
   I feel **confident** about my progress. I've learned:
   - How to be more patient
   - How to listen better
   - How to accept uncertainty
   ```
4. Toggle preview mode (Cmd/Ctrl+P or Preview button)
5. Save reflection

**Expected Results**:
- [ ] Markdown toolbar appears when Markdown mode selected
- [ ] Can type Markdown syntax freely
- [ ] Preview renders correctly:
  - Heading is larger and bold
  - "confident" is bold
  - Bullet list is properly formatted
- [ ] Can toggle between Edit and Preview modes
- [ ] Reflection saves with Markdown preserved

**Actual Results**:
```
Toolbar visible: YES / NO
Preview renders correctly: YES / NO
Save successful: YES / NO
Status: PASS / FAIL
```

---

### 2.3 Create Visual Reflection
**Objective**: Verify image import functionality

**Steps**:
1. Navigate to Compose view
2. Switch from "Text" to "Visual" mode
3. Click "Choose Image" or drag an image file (JPEG/PNG, < 10MB)
4. Add optional caption: "Sunset from my window"
5. Save reflection

**Expected Results**:
- [ ] File picker opens when clicking Choose Image
- [ ] Drag-and-drop zone is visible
- [ ] Image preview appears after selection
- [ ] Supported formats: JPEG, PNG, GIF, WebP
- [ ] File size limit enforced (10MB max)
- [ ] Caption field is optional
- [ ] Visual reflection saves successfully

**Actual Results**:
```
Image format tested: ___________
File size: ___ MB
Upload successful: YES / NO
Status: PASS / FAIL
```

---

## 3. Viewing History

### 3.1 View Reflection List
**Objective**: Verify History view displays reflections

**Steps**:
1. Create at least 3 reflections (mix of text and visual)
2. Navigate to History view
3. Observe the reflection list

**Expected Results**:
- [ ] All reflections are visible in reverse chronological order (newest first)
- [ ] Each reflection shows:
  - Date and time
  - Preview of content (first 100-150 characters for text)
  - Thumbnail for visual reflections
- [ ] Can scroll through list
- [ ] List loads quickly (< 2 seconds)

**Actual Results**:
```
Number of reflections displayed: ___
Load time: ___ seconds
Order correct: YES / NO
Status: PASS / FAIL
```

---

### 3.2 Open and View Reflection
**Objective**: Verify individual reflection viewing

**Steps**:
1. In History view, click on a reflection
2. View full reflection content
3. Return to History (back button or navigation)

**Expected Results**:
- [ ] Reflection opens in full view
- [ ] All content is visible (no truncation)
- [ ] For Markdown: formatting is rendered correctly
- [ ] For visual: full image is displayed
- [ ] Can navigate back to History list
- [ ] Reflection remains selected in list

**Actual Results**:
```
Content displays correctly: YES / NO
Navigation works: YES / NO
Status: PASS / FAIL
```

---

### 3.3 Delete Reflection
**Objective**: Verify reflection deletion

**Steps**:
1. In History view, select a reflection
2. Click delete button
3. Confirm deletion in dialog
4. Verify reflection is removed

**Expected Results**:
- [ ] Confirmation dialog appears with clear warning
- [ ] Must confirm before deletion (not immediate)
- [ ] After confirmation, reflection is removed from list
- [ ] Cannot undo deletion (warning states this)
- [ ] No errors in console

**Actual Results**:
```
Confirmation dialog appeared: YES / NO
Deletion successful: YES / NO
Status: PASS / FAIL
```

---

## 4. AI Features

### 4.1 AI Mirror - Local Mode (Ollama)
**Objective**: Verify local AI feedback works

**Prerequisites**:
- [ ] Ollama running: `ollama serve`
- [ ] Model available: `ollama list` shows llama2 or similar
- [ ] Settings → AI Provider set to "Local"

**Steps**:
1. Create a reflection: "I'm feeling uncertain about my career path."
2. Click "Ask AI Mirror" button
3. Wait for AI response

**Expected Results**:
- [ ] AI Mirror button is visible and enabled
- [ ] Loading indicator appears while processing
- [ ] AI response appears within 10 seconds
- [ ] Response is:
  - Reflective, not directive
  - Gentle and non-judgmental
  - Relevant to the reflection content
- [ ] Privacy badge shows "Local processing only"
- [ ] No external network calls (check DevTools Network tab)

**Actual Results**:
```
Response time: ___ seconds
Response quality: Good / Acceptable / Poor
Privacy preserved: YES / NO
Status: PASS / FAIL
```

---

### 4.2 AI Mirror - Online Mode
**Objective**: Verify online AI with privacy warnings

**Prerequisites**:
- [ ] OpenAI or Anthropic API key configured in Settings

**Steps**:
1. Go to Settings
2. Change AI Provider to "Online"
3. Select provider (OpenAI or Anthropic)
4. Enter API key
5. Save settings
6. Create reflection and click "Ask AI Mirror"

**Expected Results**:
- [ ] Warning dialog appears: "This will send your reflection to [provider]"
- [ ] Must acknowledge warning before proceeding
- [ ] Cannot proceed without confirmation
- [ ] After confirmation, AI response appears
- [ ] Response is similar quality to local AI
- [ ] Privacy badge shows "Online AI - Data leaves device"

**Actual Results**:
```
Warning displayed: YES / NO
User must confirm: YES / NO
Privacy warning clear: YES / NO
Status: PASS / FAIL
```

---

### 4.3 AI Rephrasing (Markdown Feature)
**Objective**: Verify AI-powered text rephrasing

**Prerequisites**:
- [ ] Ollama running (local mode) or online AI configured

**Steps**:
1. Navigate to Compose, enable Markdown mode
2. Type: "I'm really struggling with this difficult problem and feeling overwhelmed."
3. Select all text (Cmd/Ctrl+A)
4. Click "Rephrase" button (✨ purple button in toolbar)
5. In dialog, select "More Positive" style
6. Click Rephrase
7. Review 2-3 suggestions
8. Click "Accept" on one suggestion

**Expected Results**:
- [ ] Rephrase dialog opens with selected text
- [ ] Three styles available: Clearer, More Positive, More Constructive
- [ ] Loading spinner while processing
- [ ] 2-3 suggestions appear within 5-10 seconds
- [ ] Suggestions maintain first-person perspective
- [ ] Suggestions are more positive in tone
- [ ] Clicking Accept replaces original text
- [ ] Can cancel without changing text

**Actual Results**:
```
Styles available: ___________
Processing time: ___ seconds
Suggestions received: ___
Text replaced correctly: YES / NO
Status: PASS / FAIL
```

---

## 5. Settings & Configuration

### 5.1 Change Settings
**Objective**: Verify settings can be modified

**Steps**:
1. Navigate to Settings view
2. Review available settings:
   - AI Provider (Local/Online)
   - AI Model selection
   - Storage location
3. Change a setting (e.g., AI provider)
4. Save changes
5. Reload page and verify setting persisted

**Expected Results**:
- [ ] All settings are visible and editable
- [ ] Save button becomes enabled when changes are made
- [ ] Success message after saving
- [ ] Settings persist after page reload
- [ ] Changes take effect immediately (where applicable)

**Actual Results**:
```
Settings saved: YES / NO
Persistence verified: YES / NO
Status: PASS / FAIL
```

---

### 5.2 Storage Location Selection
**Objective**: Verify storage location can be changed

**Steps**:
1. Go to Settings → Storage Location
2. Note current location
3. Select different location (iCloud, Custom, or default)
4. If custom, enter path: `/tmp/life-lab-test`
5. Save settings
6. Create a new reflection
7. Verify reflection is stored in new location

**Expected Results**:
- [ ] Storage location options are clear
- [ ] Custom path can be entered
- [ ] Warning shown about location switching (data not migrated)
- [ ] Reflections saved to new location
- [ ] Old reflections remain in original location (not moved)
- [ ] Can switch back to original location

**Actual Results**:
```
Location changed successfully: YES / NO
Reflection saved to new location: YES / NO
Warning displayed: YES / NO
Status: PASS / FAIL
```

---

## 6. Export Functionality

### 6.1 Export All Reflections
**Objective**: Verify data export works

**Steps**:
1. Create at least 3 reflections (plain text, Markdown, visual)
2. Navigate to Export view
3. Choose export format (single Markdown file)
4. Click "Export to Markdown"
5. Open downloaded file

**Expected Results**:
- [ ] Export button is enabled
- [ ] File downloads successfully
- [ ] File is named with timestamp (e.g., `reflections-2026-01-11.md`)
- [ ] File contains all reflections
- [ ] Plain text reflections are readable
- [ ] Markdown reflections preserve formatting
- [ ] Visual reflections include image references or base64 data
- [ ] File is valid Markdown

**Actual Results**:
```
Export successful: YES / NO
File format: ___________
All reflections included: YES / NO
Status: PASS / FAIL
```

---

### 6.2 Delete All Reflections
**Objective**: Verify delete all functionality with safety measures

**Steps**:
1. Navigate to Export view
2. Click "Delete All Reflections" button
3. Read warning message
4. Type required confirmation text: "DELETE_ALL"
5. Confirm deletion
6. Verify all reflections deleted

**Expected Results**:
- [ ] Strong warning message displayed
- [ ] Must type "DELETE_ALL" exactly (case-sensitive)
- [ ] Cannot proceed without correct text
- [ ] Second confirmation dialog appears
- [ ] After confirmation, all reflections removed
- [ ] History view shows empty state
- [ ] Action is irreversible (documented in warning)

**Actual Results**:
```
Warning clear and strong: YES / NO
Confirmation required: YES / NO
All data deleted: YES / NO
Status: PASS / FAIL
```

---

## 7. Coach Personas

### 7.1 Select and Chat with Coach
**Objective**: Verify coach persona functionality

**Steps**:
1. Navigate to Coach view
2. Select a persona (e.g., "Stoic Coach")
3. Click "Select Prompt" to choose a coaching style
4. Click "Chat" button
5. Send message: "I need advice on managing stress"
6. Wait for response
7. Send another message to test conversation flow

**Expected Results**:
- [ ] Multiple personas available
- [ ] Can select different prompts for each persona
- [ ] Prompt selector dialog opens
- [ ] Can preview and copy prompts
- [ ] Chat dialog opens with selected persona
- [ ] Response appears within reasonable time (5-10 seconds)
- [ ] Response matches persona style
- [ ] Can send multiple messages
- [ ] Conversation context is maintained

**Actual Results**:
```
Personas available: ___________
Prompt selection works: YES / NO
Chat functional: YES / NO
Response quality: Good / Acceptable / Poor
Status: PASS / FAIL
```

---

### 7.2 External ChatGPT Link
**Objective**: Verify external ChatGPT link generation

**Steps**:
1. In Coach view, select a persona
2. Click "Chat with ChatGPT" or similar external option
3. Observe generated link

**Expected Results**:
- [ ] Link opens in new tab
- [ ] Link includes pre-filled prompt
- [ ] Prompt matches selected persona
- [ ] User is taken to ChatGPT interface
- [ ] Privacy notice visible (data leaves application)

**Actual Results**:
```
Link generated: YES / NO
Prompt included: YES / NO
Privacy notice shown: YES / NO
Status: PASS / FAIL
```

---

## 8. Accessibility

### 8.1 Keyboard Navigation
**Objective**: Verify full keyboard accessibility

**Steps**:
1. Close all dialogs, refresh page
2. Use only keyboard to navigate entire application:
   - Tab to move forward
   - Shift+Tab to move backward
   - Enter/Space to activate buttons
   - Arrow keys in lists
   - Esc to close dialogs
3. Test each main view (Compose, History, Settings, Export, Coach)

**Expected Results**:
- [ ] Can reach every interactive element via Tab
- [ ] Focus indicators are clearly visible
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Enter/Space activates all buttons
- [ ] Arrow keys navigate lists
- [ ] Esc closes all dialogs
- [ ] No keyboard traps (can always navigate away)
- [ ] Shortcuts work: Cmd/Ctrl+Enter (save), Cmd/Ctrl+B (bold), etc.

**Actual Results**:
```
All elements reachable: YES / NO
Focus indicators visible: YES / NO
Keyboard shortcuts work: YES / NO
Status: PASS / FAIL
```

---

### 8.2 Visual Accessibility
**Objective**: Verify visual accessibility features

**Steps**:
1. Review color contrast throughout application
2. Increase browser text size to 200%
3. Resize browser window to 320px width (mobile)
4. Check for text readability

**Expected Results**:
- [ ] Sufficient color contrast (4.5:1 for text)
- [ ] Text remains readable at 200% zoom
- [ ] No horizontal scrolling required
- [ ] All content reflows at 320px width
- [ ] No text overlap or truncation
- [ ] UI remains functional at small sizes

**Actual Results**:
```
Contrast sufficient: YES / NO
Text scaling works: YES / NO
Mobile responsive: YES / NO
Status: PASS / FAIL
```

---

## 9. Error Handling

### 9.1 Network Errors
**Objective**: Verify graceful error handling

**Steps**:
1. Stop backend server
2. Try to save a reflection
3. Observe error message
4. Restart backend server
5. Try saving again

**Expected Results**:
- [ ] Error message appears (not silent failure)
- [ ] Message is clear and non-technical
- [ ] Message suggests solution ("Check backend server")
- [ ] User's data is not lost
- [ ] Can retry after server restart
- [ ] No application crash

**Actual Results**:
```
Error message clear: YES / NO
Data preserved: YES / NO
Recovery successful: YES / NO
Status: PASS / FAIL
```

---

### 9.2 AI Service Unavailable
**Objective**: Verify AI error handling

**Steps**:
1. Stop Ollama: `pkill ollama` (or stop service)
2. Try to use AI Mirror or Rephrase
3. Observe error message
4. Restart Ollama
5. Verify recovery

**Expected Results**:
- [ ] Error message appears
- [ ] Message explains AI service unavailable
- [ ] Original text/content preserved
- [ ] Can continue using app (AI optional)
- [ ] After restart, AI features work again
- [ ] No data loss

**Actual Results**:
```
Error handled gracefully: YES / NO
App remains functional: YES / NO
Recovery successful: YES / NO
Status: PASS / FAIL
```

---

## 10. Performance

### 10.1 Basic Performance Checks
**Objective**: Verify acceptable performance

**Steps**:
1. Measure application load time
2. Create 50+ reflections (can use script or manual)
3. Navigate to History view, measure load time
4. Open and close several reflections
5. Try all features with 50+ reflections

**Expected Results**:
- [ ] Initial app load: < 3 seconds
- [ ] History with 50 reflections: < 2 seconds
- [ ] Opening reflection: < 500ms
- [ ] Saving reflection: < 1 second
- [ ] No noticeable lag during typing
- [ ] Smooth scrolling in History

**Actual Results**:
```
App load: ___ seconds
History load (50 items): ___ seconds
Interaction lag: YES / NO
Status: PASS / FAIL
```

---

## Test Summary

### Overall Results

**Total Test Sections**: 10  
**Sections Passed**: ___ / 10  
**Sections Failed**: ___ / 10  
**Sections Blocked**: ___ / 10

### Critical Issues Found

Priority: **CRITICAL** / **HIGH** / **MEDIUM** / **LOW**

1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Minor Issues Found

1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Suggested Improvements

1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

---

## Sign-Off

### Test Completion

- [ ] All basic functionality tests completed
- [ ] All critical issues documented
- [ ] Test results recorded
- [ ] Ready for advanced testing (if applicable)

**Overall Status**: ✅ PASS / ⚠️ PASS WITH ISSUES / ❌ FAIL

**Tested By**: _________________  
**Date**: _________________  
**Time Spent**: ___ hours  

**Recommendation**:
- [ ] Ready for production
- [ ] Needs minor fixes before production
- [ ] Needs major fixes before production
- [ ] Not ready for production

---

## Notes

```
Additional observations, comments, or context:

```

---

## Appendix: Test Data

### Sample Reflections Used

**Plain Text**:
```
Today was a good day. I learned something new about myself.
```

**Markdown**:
```
# Today's Reflection

I feel **confident** about my progress. I've learned:
- How to be more patient
- How to listen better
- How to accept uncertainty
```

**Visual**: 
- Image file: `sunset.jpg` (2MB, 1920x1080)
- Caption: "Sunset from my window"

### Test Environment Details

```
Operating System: ___________
Node.js Version: ___________
Browser Version: ___________
Ollama Version: ___________
Screen Resolution: ___________
```

---

**End of Manual Testing Checklist - Basic Functionality**
