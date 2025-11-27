# Development Requirements & Workflow

## Approval Process

**CRITICAL**: Never commit code without explicit user approval.

1. **Complete implementation** of task(s)
2. **Run all tests** (unit, integration, acceptance as applicable)
3. **Present results** to user for review
4. **Wait for approval** before committing
5. **Commit and push** only after approval

## Testing Requirements

### Unit Tests (Required for Every Task)

**When**: Run at the end of each task completion

**Backend Unit Tests**:
- Location: `backend/tests/unit/`
- Run: `cd backend && npm run test:unit`
- Coverage: Domain entities, services, utilities
- Framework: Vitest

**Frontend Unit Tests**:
- Location: `frontend/tests/unit/`
- Run: `cd frontend && npm run test:unit`
- Coverage: Composables, components, utilities
- Framework: Vitest + @vue/test-utils

**Requirements**:
- All new functions/methods must have unit tests
- Test happy path and error cases
- Mock external dependencies (API calls, file system, etc.)
- Minimum 80% code coverage for new code

### Integration Tests (Required for Backend)

**When**: Run when multiple components interact (e.g., service + repository + routes)

**Backend Integration Tests**:
- Location: `backend/tests/integration/`
- Run: `cd backend && npm run test:integration`
- Coverage: API endpoints, database operations, service coordination
- Framework: Vitest

**Requirements**:
- Test real component interactions (no mocking of internal services)
- Use test database/storage
- Test full request/response cycles
- Verify error handling

### End-to-End (E2E) Tests (Required for Frontend)

**When**: Run for user-facing features

**Frontend E2E Tests**:
- Location: `frontend/tests/e2e/`
- Run: `cd frontend && npm run test:e2e`
- Coverage: Complete user workflows
- Framework: Playwright

**Requirements**:
- Test real browser interactions
- Cover all critical user journeys
- Test across browsers (Chromium, Firefox, WebKit)
- Include accessibility checks (axe-core)

### Acceptance Tests (Required at End of Each User Story)

**When**: After completing all tasks for a user story

**Purpose**: Verify the user story's acceptance criteria are met

**Process**:
1. Reference acceptance scenarios from `spec.md`
2. Create/run acceptance tests that validate:
   - Functional requirements (FR-*)
   - Success criteria (SC-*)
   - User story goals
3. Manual testing if automated tests don't cover all scenarios
4. Document test results

**Example for User Story 1**:
- Write a reflection → verify it's saved
- Request AI feedback → verify local Ollama response
- View history → verify reflections display chronologically
- Verify no network activity (except localhost:11434)
- Confirm reflection persists after page reload

## Test Execution Order

### Per Task:
```bash
# 1. Implement task
# 2. Write unit tests
# 3. Run unit tests
cd backend && npm run test:unit
cd frontend && npm run test:unit

# 4. Fix any failures
# 5. Present to user for approval
```

### Per User Story:
```bash
# 1. Complete all tasks (with unit tests)
# 2. Write integration tests (backend)
cd backend && npm run test:integration

# 3. Write E2E tests (frontend)
cd frontend && npm run test:e2e

# 4. Run acceptance tests
npm run test:acceptance  # (to be created)

# 5. Verify all success criteria
# 6. Present to user for final approval
```

### Before Commit:
```bash
# Run all tests together
cd backend && npm test
cd frontend && npm test

# Check coverage
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```

## Test Coverage Requirements

- **Unit tests**: Minimum 80% coverage for new code
- **Integration tests**: All API endpoints covered
- **E2E tests**: All critical user journeys covered
- **Acceptance tests**: All success criteria validated

## Documentation Requirements

Every task completion must include:
1. Code implementation
2. Unit tests (passing)
3. Test coverage report
4. Brief summary of what was tested

Every user story completion must include:
1. All task implementations
2. Integration tests (passing)
3. E2E tests (passing)
4. Acceptance test results
5. Success criteria validation
6. Known issues/limitations

## Example Workflow: User Story 1

### Task T029 (ReflectionService):
1. ✅ Implement `ReflectionService.js`
2. ✅ Write `ReflectionService.test.js` (unit tests)
3. ✅ Run: `npm run test:unit -- ReflectionService.test.js`
4. ✅ Verify: All tests pass, >80% coverage
5. ⏸️ **WAIT FOR USER APPROVAL**
6. ✅ Commit after approval

### User Story 1 Complete:
1. ✅ All tasks T029-T044 completed with unit tests
2. ✅ Integration tests for reflections API
3. ✅ E2E tests for compose + history workflow
4. ✅ Acceptance tests:
   - Can write reflection and save locally ✅
   - Can get AI feedback from Ollama ✅
   - Can view history with timestamps ✅
   - No network calls except Ollama ✅
   - Data persists after reload ✅
5. ⏸️ **WAIT FOR USER APPROVAL**
6. ✅ Commit entire user story after approval

## Test File Naming Conventions

**Backend**:
- Unit: `*.test.js` in `backend/tests/unit/`
- Integration: `*.integration.test.js` in `backend/tests/integration/`
- Example: `ReflectionService.test.js`, `reflections-api.integration.test.js`

**Frontend**:
- Unit: `*.test.js` in `frontend/tests/unit/`
- Component: `*.spec.js` in `frontend/tests/unit/components/`
- E2E: `*.spec.js` in `frontend/tests/e2e/`
- Example: `useReflections.test.js`, `ReflectionEditor.spec.js`

## Continuous Integration

When CI is set up, all tests must pass before merge:
- `npm run test` (backend)
- `npm run test` (frontend)
- `npm run test:e2e` (frontend)
- Coverage thresholds enforced

## Summary

**NEVER**:
- ❌ Commit without user approval
- ❌ Complete task without unit tests
- ❌ Complete user story without acceptance tests
- ❌ Merge failing tests

**ALWAYS**:
- ✅ Write tests for all code
- ✅ Run tests before presenting to user
- ✅ Wait for explicit approval to commit
- ✅ Validate acceptance criteria
- ✅ Document test results
