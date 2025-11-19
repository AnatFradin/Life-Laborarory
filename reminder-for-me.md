This file is private developer file, must not be used by AIv(speckit)!

review the plan and other create files. for specs-000-product-vision.

## Development Workflow

**CRITICAL RULES**:
1. ❌ **NEVER commit without explicit user approval**
2. ✅ **ALWAYS create unit tests for each task**
3. ✅ **ALWAYS run tests before requesting approval**
4. ✅ **ALWAYS create acceptance tests for each user story**
5. ✅ **Present test results with implementation for review**

See: `docs/development-requirements.md` for full details

## Running the Application

Run the development server for backend:
`cd /Users/anatfradin/Git/Life-Laborarory/backend && npm run dev`

Access the Server: http://localhost:3000

Run the development server for frontend:
`cd /Users/anatfradin/Git/Life-Laborarory/frontend && npm run dev`

Access application: http://localhost:5173/

## Running Tests

Backend tests:
```bash
cd backend
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test            # All tests
npm run test:coverage   # With coverage report
```

Frontend tests:
```bash
cd frontend
npm run test:unit       # Unit tests only
npm run test:e2e        # E2E tests (Playwright)
npm run test           # All tests
npm run test:coverage  # With coverage report
```