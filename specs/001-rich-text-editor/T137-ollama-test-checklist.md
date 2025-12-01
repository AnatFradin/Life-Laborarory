# T137: Test AI Rephrasing with Ollama (Local AI)

**Date**: December 1, 2025  
**Tester**: [Your Name]  
**Ollama Model**: qwen3:8b  
**Status**: In Progress

## Objective
Verify that AI rephrasing works correctly with local Ollama and that privacy is preserved (no data sent to external servers).

## Prerequisites
- [x] Ollama is running (verified: `ollama list` shows qwen3:8b)
- [x] Backend server running on http://localhost:3000
- [x] Frontend server running on http://localhost:5173
- [x] Preferences set to "local" AI provider

## Test Scenarios

### 1. Basic Rephrasing - All Text

**Steps:**
1. Open http://localhost:5173
2. Navigate to "Compose" tab
3. Type: "I feel really confused about my work and don't know what to do"
4. Click the purple ✨ **Rephrase** button (should be enabled)
5. In the dialog, verify "Clearer" is selected by default
6. Click **Rephrase** button in dialog
7. Wait for AI to process (watch for loading spinner)

**Expected Results:**
- [ ] Dialog opens with original text displayed
- [ ] Three style options visible: Clearer, More Positive, More Constructive
- [ ] "Clearer" is pre-selected
- [ ] Loading spinner appears while processing
- [ ] 2-3 rephrased suggestions appear within 5-10 seconds
- [ ] Suggestions are simpler and more concise than original
- [ ] Suggestions maintain first-person perspective
- [ ] No external API calls in browser network tab

**Actual Results:**
```
[Record what you see here]
```

---

### 2. Style Variations

**Steps:**
1. Use the same text: "I feel really confused about my work and don't know what to do"
2. Test each style:

#### Test 2a: More Positive Style
- [ ] Select "More Positive" radio button
- [ ] Click **Rephrase**
- [ ] Verify suggestions have more positive/optimistic tone
- [ ] Example: might include "opportunity", "exploring", "uncertain but curious"

#### Test 2b: More Constructive Style
- [ ] Select "More Constructive" radio button  
- [ ] Click **Rephrase**
- [ ] Verify suggestions focus on growth/learning
- [ ] Example: might mention "learning", "developing clarity", "next steps"

**Expected Results:**
- [ ] Each style produces distinctly different suggestions
- [ ] Tone changes appropriately for each style
- [ ] Original meaning preserved in all variations
- [ ] Processing time similar (5-10 seconds each)

**Actual Results:**
```
Clearer suggestions:
[Paste here]

More Positive suggestions:
[Paste here]

More Constructive suggestions:
[Paste here]
```

---

### 3. Text Replacement - Selected Text

**Steps:**
1. Type a longer reflection: 
   ```
   Today was challenging. I feel really confused about my work and don't know what to do. 
   I need to figure this out soon.
   ```
2. **Select only** the middle sentence: "I feel really confused about my work and don't know what to do."
3. Click ✨ **Rephrase** button
4. Choose a style and click Rephrase
5. Click **Accept** on one of the suggestions

**Expected Results:**
- [ ] Dialog shows only the selected sentence
- [ ] Suggestions generated for selected text only
- [ ] Clicking Accept replaces ONLY the selected sentence
- [ ] Text before and after selection remains unchanged
- [ ] Cursor positioned after replaced text

**Actual Results:**
```
Before: [Original full text]
Selected: [What was selected]
After Accept: [Final text after replacement]
```

---

### 4. Text Replacement - All Text

**Steps:**
1. Type: "I am overwhelmed and stressed"
2. **Do NOT select any text** (just click in editor to place cursor)
3. Click ✨ **Rephrase** button
4. Choose "More Positive" style
5. Click Rephrase
6. Click **Accept** on a suggestion

**Expected Results:**
- [ ] Dialog shows ALL text (entire reflection)
- [ ] Clicking Accept replaces ALL text
- [ ] New text appears in editor
- [ ] Can undo with Cmd+Z / Ctrl+Z

**Actual Results:**
```
Before: [Original]
After Accept: [Full replacement]
Undo works: [Yes/No]
```

---

### 5. Markdown Preservation

**Steps:**
1. Type text with Markdown formatting:
   ```
   I feel **really confused** about my work. I don't know if I should:
   - Try harder
   - Ask for help
   - Take a break
   ```
2. Select all or click Rephrase
3. Choose "Clearer" style
4. Click Rephrase

**Expected Results:**
- [ ] Suggestions preserve **bold** markers
- [ ] Suggestions preserve bullet list format
- [ ] Markdown syntax not mentioned in suggestions (only formatting preserved)

**Actual Results:**
```
[Paste suggestions - check if **bold** and - bullets are preserved]
```

---

### 6. Error Handling - Ollama Stopped

**Steps:**
1. In terminal, stop Ollama: `pkill ollama` (or similar)
2. Try to rephrase any text
3. Click Rephrase in dialog

**Expected Results:**
- [ ] Error message appears: "AI service unavailable. Your original text is preserved."
- [ ] Message is gentle and non-technical
- [ ] No crash or blank screen
- [ ] Can close dialog and continue editing

**Actual Results:**
```
[What error message appeared?]
```

**Cleanup:**
- [ ] Restart Ollama: `ollama serve` in terminal

---

### 7. Privacy Verification

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter for "Fetch/XHR"
4. Type and rephrase any text
5. Examine network requests

**Expected Results:**
- [ ] Only requests to `localhost:3000` visible
- [ ] NO requests to openai.com, anthropic.com, or other external APIs
- [ ] Request payload contains text and style only
- [ ] No reflection ID, metadata, or sensitive data in payload

**Actual Results:**
```
Requests seen:
1. [URL and method]
2. [URL and method]

External requests: [None expected]
```

---

### 8. Cancel and Close

**Steps:**
1. Type any text and click Rephrase
2. Wait for suggestions to load
3. Click **Cancel** button

**Expected Results:**
- [ ] Dialog closes
- [ ] Original text unchanged in editor
- [ ] Can rephrase again immediately

**Test with Escape key:**
- [ ] Press Escape key while dialog open
- [ ] Dialog closes same as Cancel

**Actual Results:**
```
[Both Cancel and Escape work: Yes/No]
```

---

### 9. Long Text Handling

**Steps:**
1. Type or paste a longer reflection (300+ words)
2. Select all and click Rephrase
3. Choose any style and process

**Expected Results:**
- [ ] Processing takes longer (10-20 seconds) but completes
- [ ] Suggestions are proportionally longer
- [ ] No timeout errors (within 30s)
- [ ] Editor handles long replacement smoothly

**Actual Results:**
```
Text length: [~X words]
Processing time: [X seconds]
Success: [Yes/No]
```

---

### 10. Rapid Successive Requests

**Steps:**
1. Type text and click Rephrase
2. While waiting for response, do NOT cancel
3. After suggestions appear, immediately click Rephrase again with different style
4. Repeat 2-3 times quickly

**Expected Results:**
- [ ] Each request completes successfully
- [ ] No race conditions or stuck loading states
- [ ] Previous suggestions cleared when new ones arrive
- [ ] No crashes or frozen UI

**Actual Results:**
```
[Any issues with rapid requests?]
```

---

## Summary

**Total Scenarios**: 10  
**Passed**: [ ]  
**Failed**: [ ]  
**Blocked**: [ ]  

### Critical Issues Found
```
[List any critical bugs or problems]
```

### Minor Issues Found
```
[List any minor issues or improvements needed]
```

### Privacy Confirmation
- [ ] Verified: All AI processing happens locally
- [ ] Verified: No external API calls detected
- [ ] Verified: Only localhost requests in network tab

### Performance Notes
```
Average response time: [X seconds]
Model: qwen3:8b
Any performance concerns: [Yes/No and details]
```

---

## Sign-off

**Tested by**: _________________  
**Date**: _________________  
**Status**: [ ] PASS / [ ] PASS with minor issues / [ ] FAIL  

**Ready for T138 (Online AI testing)**: [ ] Yes / [ ] No

---

## Notes
```
[Any additional observations or comments]
```
