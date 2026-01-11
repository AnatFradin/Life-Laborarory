# Testing Checklists

This directory contains comprehensive testing checklists for the Life-Laboratory project.

## Available Checklists

### 1. Basic Functionality Testing
**File**: [`basic-functionality-testing.md`](./basic-functionality-testing.md)  
**Purpose**: Manual testing of all core features  
**When to Use**: Before releases, after major changes, or for QA validation  
**Coverage**: 
- Application startup and navigation
- Creating reflections (text, Markdown, visual)
- Viewing history
- AI features (Mirror, Rephrasing)
- Settings and configuration
- Export functionality
- Coach personas
- Accessibility
- Error handling
- Performance

**Test Scenarios**: 30+  
**Estimated Time**: 2-3 hours for complete run

---

### 2. Accessibility Testing
**File**: [`accessibility.md`](./accessibility.md)  
**Purpose**: WCAG 2.1 AA compliance verification  
**When to Use**: Before releases, after UI changes  
**Coverage**:
- Keyboard navigation
- Screen reader compatibility (VoiceOver, NVDA)
- Visual accessibility (contrast, text scaling)
- ARIA attributes and semantic HTML
- Focus management

**Test Scenarios**: 15+ manual tests + automated tests  
**Estimated Time**: 2-4 hours (includes screen reader testing)

---

### 3. Requirements Validation
**File**: [`requirements.md`](./requirements.md)  
**Purpose**: Specification quality validation  
**When to Use**: During specification phase, before planning  
**Coverage**:
- Content quality
- Requirement completeness
- Feature readiness
- Technology-agnostic validation
- Product vision alignment

**Estimated Time**: 30-60 minutes

---

## How to Use These Checklists

### For Manual Testers

1. **Choose the appropriate checklist** based on your testing goals
2. **Set up the test environment** (see Prerequisites in each checklist)
3. **Follow the test scenarios** step by step
4. **Document results** in the "Actual Results" sections
5. **Mark pass/fail** for each test
6. **Complete the summary** and sign-off sections
7. **Report issues** found during testing

### For QA Teams

- Use **basic-functionality-testing.md** for regression testing
- Use **accessibility.md** for accessibility audits
- Run both checklists before major releases
- Keep completed checklists as test evidence

### For Developers

- Reference these checklists when implementing features
- Use them to understand testing requirements
- Run relevant tests after making changes
- Add new test scenarios when new features are added

---

## Testing Workflow

```
┌─────────────────────────────────────────┐
│  1. Setup Test Environment              │
│     - Start backend/frontend servers    │
│     - Verify prerequisites               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. Execute Test Scenarios               │
│     - Follow steps in checklist         │
│     - Document actual results           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  3. Record Results                       │
│     - Mark PASS/FAIL for each test      │
│     - Note issues found                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  4. Complete Summary                     │
│     - Overall status                    │
│     - Critical issues list              │
│     - Sign-off                          │
└─────────────────────────────────────────┘
```

---

## Test Environment Requirements

### Basic Functionality Testing

- **Backend**: Node.js 18+, running on port 3000
- **Frontend**: Vite dev server on port 5173
- **AI (optional)**: Ollama with llama2 model
- **Browser**: Chrome, Firefox, or Safari (latest)
- **Time**: 2-3 hours

### Accessibility Testing

- **Additional Tools**:
  - macOS: VoiceOver (built-in)
  - Windows: NVDA (free download)
  - Browser extensions: axe DevTools (optional)
- **Time**: 2-4 hours

---

## Reporting Test Results

After completing a checklist:

1. **Fill in the summary section** at the end of the checklist
2. **Document all issues** with clear descriptions
3. **Prioritize issues** (Critical, High, Medium, Low)
4. **Sign-off** with your name and date
5. **Share results** with the team

### Issue Template

When reporting issues found:

```markdown
**Issue**: [Brief description]
**Severity**: Critical / High / Medium / Low
**Test**: [Which test scenario]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Environment**: [Browser, OS, etc.]
```

---

## Maintaining Checklists

### When to Update

- After adding new features
- When fixing bugs that require new tests
- When requirements change
- Based on tester feedback

### How to Update

1. Add new test scenarios in appropriate sections
2. Update expected results if requirements change
3. Remove obsolete tests (mark as deprecated first)
4. Keep format consistent with existing tests
5. Update version/date in checklist header

---

## Quick Reference

| Checklist | Primary Use | Time Required | Prerequisites |
|-----------|-------------|---------------|---------------|
| **Basic Functionality** | Feature validation | 2-3 hours | Running servers |
| **Accessibility** | WCAG compliance | 2-4 hours | Screen reader |
| **Requirements** | Spec validation | 30-60 min | Specification document |

---

## Additional Resources

- **Main Project Documentation**: [`../../README.md`](../../../README.md)
- **Task Execution Guide**: [`../../../TASK-EXECUTION-GUIDE.md`](../../../TASK-EXECUTION-GUIDE.md)
- **Project Status**: [`../../../PROJECT-STATUS.md`](../../../PROJECT-STATUS.md)
- **Product Vision Spec**: [`../spec.md`](../spec.md)

---

## Questions or Issues?

If you encounter problems with these checklists:

1. Check the main documentation for setup help
2. Review prerequisites carefully
3. Ensure all servers are running
4. Check for known issues in GitHub
5. Contact the development team

---

**Last Updated**: 2026-01-11  
**Maintained By**: Life-Laboratory Team
