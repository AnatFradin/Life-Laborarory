# Accessibility Testing Checklist

## Purpose
Manual accessibility testing procedures to ensure Laboratory of Life meets WCAG 2.1 Level AA compliance and provides an excellent experience for keyboard-only and screen reader users.

## Prerequisites
- **macOS**: VoiceOver (built-in)
- **Windows**: NVDA (free, open-source) - https://www.nvaccess.org/download/
- **Automated tests**: Run `npm run test:e2e` in frontend directory

---

## Automated Testing (T068)

### axe-core Integration Tests

Run automated accessibility tests:
```bash
cd frontend
npm run test:e2e -- accessibility.spec.js
```

**Expected Results:**
- ✅ All views pass WCAG 2.1 Level AA checks
- ✅ No color contrast violations
- ✅ All form labels present and correct
- ✅ ARIA attributes used correctly
- ✅ Logical heading structure
- ✅ Images have appropriate alt text

---

## Manual Testing Scenarios

### 1. Keyboard Navigation (All Platforms)

#### Test: Complete Keyboard-Only Navigation

**Goal**: Verify all functionality is accessible without a mouse

**Steps**:
1. **Application Load**
   - [ ] Tab key moves focus to skip-to-main-content link
   - [ ] Skip link is visible when focused
   - [ ] Pressing Enter on skip link moves focus to main content

2. **Navigation**
   - [ ] Tab moves through navigation links (Compose, History, Settings, Export)
   - [ ] Arrow keys do NOT move between navigation links (use Tab)
   - [ ] Enter or Space activates navigation link
   - [ ] Active route is clearly indicated
   - [ ] Focus indicators are visible on all navigation elements

3. **Compose View**
   - [ ] Tab moves to textarea
   - [ ] Textarea has visible focus indicator
   - [ ] Can type text normally
   - [ ] Cmd/Ctrl+Enter saves reflection
   - [ ] Tab moves to "Save Reflection" button
   - [ ] Tab moves to "Get AI Feedback" button (if available)
   - [ ] Enter key activates focused button

4. **History View**
   - [ ] Tab moves to first reflection card
   - [ ] Arrow Down moves to next reflection
   - [ ] Arrow Up moves to previous reflection
   - [ ] Home key moves to first reflection
   - [ ] End key moves to last reflection
   - [ ] Enter opens selected reflection
   - [ ] Tab moves to delete button on focused card
   - [ ] Enter or Space activates delete button

5. **Export View**
   - [ ] Tab moves through all buttons
   - [ ] Enter activates focused button
   - [ ] Dialogs open with focus trapped inside

6. **Dialog Navigation**
   - [ ] Tab moves through dialog controls
   - [ ] Cannot Tab outside dialog (focus trap works)
   - [ ] Esc closes dialog
   - [ ] Focus returns to trigger element after close

7. **Keyboard Shortcuts**
   - [ ] Shift+? opens keyboard shortcuts dialog
   - [ ] All shortcuts listed in dialog work as documented

**Acceptance Criteria**:
- ✅ Every interactive element can be reached via Tab
- ✅ Enter or Space activates all buttons
- ✅ Esc closes all dialogs
- ✅ Arrow keys navigate lists
- ✅ Focus indicators are always visible
- ✅ No keyboard traps (can always navigate away)

---

### 2. VoiceOver Testing (macOS)

#### Setup VoiceOver
1. Enable: **Cmd+F5** (or System Settings → Accessibility → VoiceOver)
2. VoiceOver commands:
   - **VO** = Control + Option
   - **VO + A** = Read from current position
   - **VO + Right Arrow** = Next item
   - **VO + Left Arrow** = Previous item
   - **VO + Spacebar** = Activate element
   - **VO + H** = Next heading
   - **VO + L** = Next link

#### Test: Compose View Screen Reader

**Steps**:
1. **Page Load**
   - [ ] VoiceOver announces page title "Laboratory of Life"
   - [ ] Announces "navigation" landmark
   - [ ] Announces number of navigation links

2. **Skip Link**
   - [ ] VO+Right Arrow moves to "Skip to main content" link
   - [ ] Link purpose is announced
   - [ ] Activating link moves to main content

3. **Reflection Editor**
   - [ ] Label "Your Reflection" is announced
   - [ ] Hint text is announced via aria-describedby
   - [ ] Textarea role and purpose are clear
   - [ ] Aria-busy state announced when saving

4. **Buttons**
   - [ ] "Save Reflection" button role and state announced
   - [ ] Disabled state communicated when no content
   - [ ] "Get AI Feedback" button announced when available
   - [ ] Aria-busy announced during AI generation

5. **AI Response**
   - [ ] AI response container announced as "region"
   - [ ] Label "AI Mirror Response" announced
   - [ ] Response text is read when content changes (aria-live)
   - [ ] Loading state "Reflecting..." announced

6. **Privacy Badge**
   - [ ] "Local processing only" message announced
   - [ ] Icon is hidden from screen reader (aria-hidden)

**Acceptance Criteria**:
- ✅ All text content is announced
- ✅ All interactive elements have clear roles
- ✅ Button states (disabled, busy) are announced
- ✅ Dynamic content changes are announced (aria-live)
- ✅ Icons don't clutter screen reader output

---

#### Test: History View Screen Reader

**Steps**:
1. **Reflection List**
   - [ ] Announces "Reflections" list/region
   - [ ] Announces number of reflections
   - [ ] Each reflection announced with timestamp
   - [ ] "Has AI reflection" badge announced for reflections with AI

2. **Navigation**
   - [ ] Arrow keys move between reflections
   - [ ] Current position announced ("1 of 5")
   - [ ] Reflection preview text is announced

3. **Delete Action**
   - [ ] Delete button announced with "Delete this reflection" label
   - [ ] Confirmation dialog announced when opened
   - [ ] Dialog content and purpose clear

**Acceptance Criteria**:
- ✅ List structure is announced
- ✅ Navigation context is provided (position in list)
- ✅ All actions have clear labels

---

#### Test: Export View Screen Reader

**Steps**:
1. **Export Controls**
   - [ ] "Export All Reflections" button announced with clear label
   - [ ] "Delete All Reflections" button announced with clear label
   - [ ] Warning about permanence is announced

2. **Export Dialog**
   - [ ] Dialog role announced
   - [ ] Title "Export Reflections" announced
   - [ ] Description text announced
   - [ ] Radio group for format selection announced
   - [ ] Each radio option label announced
   - [ ] Checkbox for metadata announced with state
   - [ ] Action buttons announced

3. **Delete All Dialog**
   - [ ] Dialog role and title announced
   - [ ] Warning message announced
   - [ ] Text input label and requirement announced
   - [ ] Validation error announced if incorrect
   - [ ] Confirmation requirement is clear

**Acceptance Criteria**:
- ✅ All form controls have labels
- ✅ Radio groups have group labels
- ✅ Validation errors are announced
- ✅ Dangerous actions have clear warnings

---

### 3. NVDA Testing (Windows)

#### Setup NVDA
1. Download from https://www.nvaccess.org/download/
2. NVDA commands:
   - **Insert** = NVDA key (or CapsLock if configured)
   - **NVDA + Down Arrow** = Read next line
   - **NVDA + B** = Next button
   - **NVDA + F** = Next form field
   - **NVDA + H** = Next heading
   - **Tab** = Next focusable element

#### Test: Cross-Browser Compatibility

**Test in**:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge

**Steps**:
1. **Navigation**
   - [ ] NVDA announces all navigation elements
   - [ ] Browse mode navigation works (H, B, F keys)
   - [ ] Forms mode activates automatically in inputs

2. **Interactive Elements**
   - [ ] All buttons announced with role
   - [ ] All form fields announced with labels
   - [ ] Links announced with destination
   - [ ] Dialogs announced as modal when opened

3. **Dynamic Content**
   - [ ] Loading states announced
   - [ ] Error messages announced
   - [ ] Success confirmations announced
   - [ ] AI responses announced when updated

**Acceptance Criteria**:
- ✅ Consistent experience across all browsers
- ✅ All ARIA live regions work
- ✅ No navigation dead ends

---

## Functional Requirements Checklist

### FR-022: Full Keyboard Navigation
- [ ] Tab key navigates between all interactive elements
- [ ] Shift+Tab navigates backward
- [ ] Enter activates buttons and links
- [ ] Space activates buttons and checkboxes
- [ ] Arrow keys navigate within components (lists, radio groups)
- [ ] Escape closes dialogs
- [ ] No functionality requires a mouse

### FR-023: Visible Focus Indicators
- [ ] All interactive elements show focus indicator
- [ ] Focus indicators meet 3:1 contrast ratio
- [ ] Focus indicators are 2px or greater in thickness
- [ ] Focus is visible on all color themes

### FR-024: Screen Reader Compatible
- [ ] All images have alt text (or aria-hidden if decorative)
- [ ] All form inputs have associated labels
- [ ] All buttons have clear text or aria-label
- [ ] ARIA roles used appropriately
- [ ] ARIA states (aria-busy, aria-disabled) announced
- [ ] Dynamic content uses aria-live regions

### FR-026: Logical Tab Order
- [ ] Tab order follows visual order
- [ ] Tab order follows reading order (top to bottom, left to right)
- [ ] No tabindex values greater than 0
- [ ] tabindex="-1" only used for programmatic focus

### FR-027: Keyboard Shortcuts Documented
- [ ] Shift+? opens shortcuts dialog
- [ ] All shortcuts listed
- [ ] All shortcuts work as documented
- [ ] Shortcuts don't conflict with browser/OS shortcuts
- [ ] Shortcuts follow platform conventions (Cmd on Mac, Ctrl on Windows/Linux)

---

## WCAG 2.1 Level AA Success Criteria

### Perceivable
- [ ] 1.1.1: Non-text Content (alt text)
- [ ] 1.3.1: Info and Relationships (semantic HTML, ARIA)
- [ ] 1.3.2: Meaningful Sequence (logical reading order)
- [ ] 1.3.3: Sensory Characteristics (don't rely on shape/color alone)
- [ ] 1.4.3: Contrast (Minimum) - 4.5:1 for text
- [ ] 1.4.4: Resize Text - up to 200% without loss
- [ ] 1.4.5: Images of Text - avoid except for logos
- [ ] 1.4.10: Reflow - content works at 320px width
- [ ] 1.4.11: Non-text Contrast - 3:1 for UI components
- [ ] 1.4.12: Text Spacing - adjustable without loss
- [ ] 1.4.13: Content on Hover or Focus - dismissible, hoverable, persistent

### Operable
- [ ] 2.1.1: Keyboard - all functionality via keyboard
- [ ] 2.1.2: No Keyboard Trap - can navigate away from everything
- [ ] 2.1.4: Character Key Shortcuts - can be remapped/disabled
- [ ] 2.2.1: Timing Adjustable - no time limits
- [ ] 2.2.2: Pause, Stop, Hide - for auto-updating content
- [ ] 2.4.1: Bypass Blocks - skip-to-main link present
- [ ] 2.4.2: Page Titled - descriptive page titles
- [ ] 2.4.3: Focus Order - logical focus order
- [ ] 2.4.5: Multiple Ways - navigation available on all pages
- [ ] 2.4.6: Headings and Labels - descriptive
- [ ] 2.4.7: Focus Visible - always visible

### Understandable
- [ ] 3.1.1: Language of Page - lang attribute set
- [ ] 3.2.1: On Focus - no unexpected context changes
- [ ] 3.2.2: On Input - no unexpected context changes
- [ ] 3.2.3: Consistent Navigation - navigation consistent across pages
- [ ] 3.2.4: Consistent Identification - icons/buttons consistent
- [ ] 3.3.1: Error Identification - errors announced and clear
- [ ] 3.3.2: Labels or Instructions - form inputs labeled
- [ ] 3.3.3: Error Suggestion - helpful error messages
- [ ] 3.3.4: Error Prevention - confirmation for destructive actions

### Robust
- [ ] 4.1.1: Parsing - valid HTML
- [ ] 4.1.2: Name, Role, Value - all UI components have accessible names
- [ ] 4.1.3: Status Messages - use aria-live for dynamic updates

---

## Test Execution Tracking

### Test Session 1: [Date]
**Tester**: _____________  
**Platform**: macOS / Windows / Linux  
**Screen Reader**: VoiceOver / NVDA / JAWS  
**Browser**: Chrome / Firefox / Safari / Edge  

**Results**:
- [ ] All manual tests passed
- [ ] Issues found: _____________
- [ ] Follow-up required: Yes / No

### Test Session 2: [Date]
**Tester**: _____________  
**Platform**: macOS / Windows / Linux  
**Screen Reader**: VoiceOver / NVDA / JAWS  
**Browser**: Chrome / Firefox / Safari / Edge  

**Results**:
- [ ] All manual tests passed
- [ ] Issues found: _____________
- [ ] Follow-up required: Yes / No

---

## Issue Template

When issues are found, document them using this format:

**Issue #**: [number]  
**Severity**: Critical / High / Medium / Low  
**WCAG Criterion**: [e.g., 2.4.7 Focus Visible]  
**Location**: [View/Component]  
**Description**: [What's wrong]  
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**: [What should happen]  
**Actual Behavior**: [What actually happens]  
**Suggested Fix**: [How to fix it]

---

## Sign-Off

**Automated Tests**: ✅ / ❌  
**Manual Keyboard Tests**: ✅ / ❌  
**VoiceOver Tests (macOS)**: ✅ / ❌  
**NVDA Tests (Windows)**: ✅ / ❌  

**Final Approval**:  
- [ ] All critical and high severity issues resolved
- [ ] WCAG 2.1 Level AA compliance verified
- [ ] User Story 5 (T060-T070) complete

**Signed**: _____________  
**Date**: _____________
