#!/bin/bash

# Script to create comprehensive GitHub issues with sub-tasks
# Repository: AnatFradin/Life-Laborarory

set -e

REPO="AnatFradin/Life-Laborarory"

echo "Creating comprehensive GitHub issues with sub-tasks..."
echo "Repository: $REPO"
echo ""

# Issue 1: Remaining QA and Testing Tasks
echo "Creating Issue 1: Remaining QA and Testing Tasks..."

ISSUE_1_BODY="This issue tracks all remaining QA and testing tasks to complete the Life-Laboratory project (87% → 100%).

## Overview

**Total Tasks:** 24  
**Estimated Time:** 7-10 hours  
**Current Status:** 87% complete (243/280 tasks)

All task details, acceptance criteria, and implementation guides are available in:
- \`TASK-EXECUTION-GUIDE.md\` - Step-by-step instructions
- \`create-issues.md\` - Detailed task descriptions
- Individual spec files in \`specs/\` directories

---

## 📋 000-product-vision: Manual Testing (3 tasks)

### Manual Testing Requirements
- [ ] **T108:** Manual screen reader testing (VoiceOver/NVDA) for all user journeys
  - Test with VoiceOver (macOS) or NVDA (Windows)
  - Verify all interactive elements properly announced
  - Test all flows: compose, history, settings, export, coach
  - Document accessibility issues
  - **Related:** \`specs/000-product-vision/tasks.md\` (T108)

- [ ] **T109:** Verify network isolation and privacy
  - Monitor network calls with DevTools
  - Test local mode: only localhost:11434 (Ollama)
  - Test plain/Markdown reflections: no network calls
  - Test online AI: verify warnings shown
  - **Related:** \`specs/000-product-vision/tasks.md\` (T109)

- [ ] **T110:** Performance validation with 1000+ reflections
  - Generate 1500+ test reflections
  - Measure History load time (< 3 seconds)
  - Test scrolling/search performance
  - Verify UI remains responsive
  - **Related:** \`specs/000-product-vision/tasks.md\` (T110)

---

## 📋 001-rich-text-editor: Testing & Documentation (19 tasks)

### Manual Testing (8 tasks)

- [ ] **T137:** Test AI rephrasing with local Ollama
  - Test all 3 styles: Clearer, More Positive, More Constructive
  - Response time < 5 seconds
  - Language preserved (multi-language test)
  - Markdown formatting preserved
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T137)

- [ ] **T138:** Test AI rephrasing with online AI (OpenAI/Anthropic)
  - Verify privacy warning dialog
  - User must acknowledge before sending
  - Test all 3 styles work
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T138)

- [ ] **T144:** Verify backward compatibility with plain text
  - Create plain text reflection
  - Verify no Markdown rendering applied
  - Edit without enabling Markdown
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T144)

- [ ] **T145:** Verify export functionality with Markdown
  - Export plain text, Markdown, visual reflections
  - Verify formatting preserved
  - Verify valid Markdown syntax
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T145)

- [ ] **T146:** Verify AI mirror analyzes Markdown content correctly
  - AI responds to meaning, not syntax
  - No mention of \"bold text\" or Markdown markers
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T146)

- [ ] **T149:** Test with large documents (10,000+ words)
  - Test typing performance (no lag)
  - Test preview rendering (< 1 second)
  - Verify UI doesn't freeze
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T149)

- [ ] **T151:** Manual keyboard-only testing
  - Navigate app using only keyboard
  - Test all shortcuts (Cmd+B, Cmd+I, Cmd+K, Cmd+P)
  - Verify logical tab order
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T151)

- [ ] **T152:** Manual VoiceOver/screen reader testing
  - Test all views with VoiceOver/NVDA
  - Verify proper labels and announcements
  - Document missing/incorrect labels
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T152)

### E2E Automated Tests (6 tasks)

**Implementation:** Complete test code provided in \`TASK-EXECUTION-GUIDE.md\` Phase 3

- [ ] **T141:** Create E2E test for Markdown editing
  - File: \`frontend/tests/e2e/markdown-editing.spec.js\`
  - Test toggle, preview, save/load, keyboard shortcuts
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T141)

- [ ] **T142:** Create E2E test for Markdown toolbar
  - File: \`frontend/tests/e2e/markdown-toolbar.spec.js\`
  - Test all buttons and shortcuts
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T142)

- [ ] **T143:** Create E2E test for AI rephrasing
  - File: \`frontend/tests/e2e/ai-rephrasing.spec.js\`
  - Test dialog, styles, accept/cancel, errors
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T143)

- [ ] **T147:** Run accessibility audit (axe-core)
  - File: \`frontend/tests/e2e/accessibility.spec.js\`
  - Verify WCAG 2.1 Level AA compliance
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T147)

- [ ] **T148:** Run performance benchmarks
  - File: \`frontend/tests/e2e/performance.spec.js\`
  - Preview < 200ms, toolbar < 100ms, app load < 2s
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T148)

- [ ] **T150:** Run security audit (XSS protection)
  - File: \`frontend/tests/e2e/security.spec.js\`
  - Test XSS payloads, verify DOMPurify sanitization
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T150)

### Quality Checks (5 tasks)

- [ ] **T154:** Run full test suite
  - Backend: \`npm test && npm run test:integration\`
  - Frontend: \`npm test && npm run test:e2e\`
  - Coverage > 80%
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T154)

- [ ] **T155:** Validate against quickstart checklist
  - Verify all P1, P2, P3 features work
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T155)

- [ ] **T207:** Test storage location switching
  - Switch between local, iCloud, custom paths
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T207)

- [ ] **T208:** Test custom storage path
  - Set custom path, create reflection, verify
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T208)

- [ ] **T209:** Test iCloud availability detection
  - Test on macOS and non-macOS systems
  - **Related:** \`specs/001-rich-text-editor/tasks.md\` (T209)

---

## 📋 002-dynamic-coach-prompts: Manual Testing (2 tasks)

- [ ] **Manual Testing Checklist - Basic Functionality:**
  - Load prompts from file
  - Select different prompts per persona
  - Copy to clipboard (verify paste)
  - Chat with each persona
  - Send multiple messages
  - Verify streaming responses
  - Test error handling
  - Verify fallback to hardcoded prompts
  - Test UI on mobile
  - **Related:** \`specs/002-dynamic-coach-prompts/tasks.md\` (T057)

- [ ] **Manual Testing Checklist - Performance & Accessibility:**
  - Prompt loading < 100ms
  - Chat response < 1s
  - Streaming smooth
  - No memory leaks
  - Keyboard navigation works
  - ARIA labels present
  - Screen reader friendly
  - Focus indicators visible
  - Color contrast meets WCAG AA
  - **Related:** \`specs/002-dynamic-coach-prompts/tasks.md\` (T058-T059)

---

## 📚 Resources

- **Execution Guide:** \`TASK-EXECUTION-GUIDE.md\`
- **Project Status:** \`PROJECT-STATUS.md\`
- **Code Review:** \`CODE-REVIEW-SUMMARY.md\`
- **Task Templates:** \`create-issues.md\`

---

## 🎯 Success Criteria

When all tasks complete:
- ✅ All features manually tested and verified
- ✅ E2E tests provide regression protection
- ✅ Accessibility WCAG 2.1 AA verified
- ✅ Performance benchmarks met
- ✅ Security validated (XSS protection)
- ✅ Ready for production deployment

---

**Labels:** \`testing\`, \`qa\`, \`manual-testing\`, \`e2e\`, \`accessibility\`, \`performance\`, \`security\`"

gh issue create \
  --repo "$REPO" \
  --title "Complete remaining QA and testing tasks (24 tasks to 100% completion)" \
  --label "testing,qa,manual-testing,e2e,accessibility,performance,security" \
  --body "$ISSUE_1_BODY"

echo "✅ Created Issue 1: Remaining QA and Testing Tasks"
echo ""

# Issue 2: UI/UX Improvements and Feature Enhancements
echo "Creating Issue 2: UI/UX Improvements..."

ISSUE_2_BODY="This issue tracks potential UI/UX improvements and feature enhancements for the Life-Laboratory project.

## Overview

This is a comprehensive list of suggested improvements based on the \`UI-UX-IMPROVEMENTS.md\` document. These are enhancement ideas for future iterations after the core project reaches 100% completion.

---

## ✅ Already Implemented

### Design System Enhancements
- [x] Warmer color palette with cream/sand tones
- [x] Better typography hierarchy
- [x] Generous spacing system (xs to 4xl)
- [x] Enhanced shadow system
- [x] Modern rounded corners
- [x] Smooth transitions

### Component Improvements
- [x] Gradient backgrounds for app header
- [x] Enhanced navigation with glowing active states
- [x] Button lift effects on hover
- [x] Card gradients and hover effects
- [x] Custom SVG illustrations for empty states
- [x] Enhanced form inputs with focus rings
- [x] Improved keyboard shortcuts dialog

---

## 🚀 Feature Suggestions for Future Iterations

### 1. Quick Stats Dashboard
- [ ] Add dashboard widget showing:
  - Total reflections count
  - Current streak (days in a row)
  - Most active month
  - Word count achievements

### 2. Search & Filter
- [ ] Full-text search across reflections
- [ ] Filter by date range
- [ ] Filter by mood/tags (if tags added)
- [ ] Sort options (newest, oldest, longest)

### 3. Themes
- [ ] Dark mode toggle
- [ ] Auto-switching based on system preference
- [ ] Custom theme builder
- [ ] High contrast mode

### 4. Export Enhancements
- [ ] PDF export with beautiful formatting
- [ ] Email scheduled summaries
- [ ] Backup reminders
- [ ] Export statistics

### 5. Rich Media Support
- [ ] Drag & drop image uploads (enhanced)
- [ ] Voice recording for reflections
- [ ] Embedded sketches/drawings
- [ ] Attachment manager

### 6. Smart Features
- [ ] Writing prompts/suggestions
- [ ] Mood tracking over time
- [ ] Word cloud visualization
- [ ] Reading time estimates

### 7. Productivity Features
- [ ] Daily reflection reminders (local notifications)
- [ ] Writing goals and streaks
- [ ] Template library for common reflection types
- [ ] Quick capture from anywhere

### 8. Accessibility Enhancements
- [ ] Font size controls
- [ ] Text-to-speech for reading reflections
- [ ] Voice input for composing
- [ ] Better keyboard navigation hints

### 9. Social Features (Optional, Privacy-Conscious)
- [ ] Share anonymized reflections (opt-in)
- [ ] Community prompts
- [ ] Reflection groups for accountability
- [ ] Mentor/coach mode

### 10. Analytics & Insights
- [ ] Personal growth trends
- [ ] Word frequency analysis
- [ ] Sentiment analysis over time
- [ ] Most productive times/days

---

## 🔧 Technical Improvements

### Performance
- [ ] Lazy loading for large reflection lists
- [ ] Virtual scrolling for history view
- [ ] Image optimization and lazy loading
- [ ] Bundle size optimization

### Progressive Enhancement
- [ ] Offline support with service workers
- [ ] Background sync
- [ ] Install as PWA
- [ ] Native app feel

### Developer Experience
- [ ] Component library documentation
- [ ] Storybook for component development
- [ ] Visual regression testing
- [ ] Expanded E2E test coverage

---

## 🎨 Design Principles to Maintain

1. **Calm Experience:** No aggressive colors or animations
2. **Privacy First:** Local-first approach emphasized
3. **Accessibility:** WCAG 2.1 AA compliance maintained
4. **Simplicity:** Max 3 choices on screen
5. **No Clutter:** Clean, focused interface
6. **Trustworthy:** Professional, polished appearance

---

## 📊 Success Metrics

- Time spent in app (engagement)
- Reflection completion rate
- Feature discovery rate
- User retention
- Accessibility score
- Performance metrics (Core Web Vitals)

---

## 📝 Notes

- These are suggestions for future iterations
- Not all features may align with the project's core philosophy
- Each feature should be evaluated for privacy implications
- Maintain calm, focused UX throughout

**Priority:** These enhancements are for post-MVP iterations. Focus on completing the 24 QA/testing tasks first.

---

**Labels:** \`enhancement\`, \`ui-ux\`, \`feature-request\`, \`future\`, \`design\`"

gh issue create \
  --repo "$REPO" \
  --title "UI/UX Improvements and Feature Enhancements (Future Iterations)" \
  --label "enhancement,ui-ux,feature-request,future,design" \
  --body "$ISSUE_2_BODY"

echo "✅ Created Issue 2: UI/UX Improvements and Feature Enhancements"
echo ""

echo "✅ Successfully created both comprehensive issues!"
echo ""
echo "Summary:"
echo "- Issue 1: Remaining QA and Testing Tasks (24 sub-tasks)"
echo "- Issue 2: UI/UX Improvements and Feature Enhancements (40+ suggestions)"
