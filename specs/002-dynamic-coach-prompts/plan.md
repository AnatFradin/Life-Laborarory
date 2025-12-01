# Development Plan: Dynamic Coach Prompts

**Feature ID:** 002-dynamic-coach-prompts  
**Branch:** `002-dynamic-coach-prompts`  
**Estimated Duration:** 7-8 days  
**Start Date:** 2025-12-01  
**Target Completion:** 2025-12-09

---

## 🎯 Goals

### Primary Objectives
1. Enable file-based prompt management for coach personas
2. Support multiple prompt variants per coach
3. Provide copy-to-clipboard for manual ChatGPT usage
4. Implement interactive chat with local AI models

### Success Criteria
- ✅ All existing functionality remains working
- ✅ Users can load and select custom prompts
- ✅ Copy-to-clipboard works across browsers
- ✅ Chat window provides smooth UX
- ✅ All tests passing (483+ total tests)
- ✅ Zero security vulnerabilities
- ✅ Performance benchmarks met

---

## 📅 Timeline

### Week 1: Implementation
| Day | Phase | Focus Areas | Deliverables |
|-----|-------|-------------|--------------|
| Day 1 | Planning | Specs, architecture, task breakdown | Complete documentation |
| Day 2-3 | Backend | File service, API endpoints, tests | Working backend APIs |
| Day 4-5 | Frontend (Selection) | Prompt selector UI, clipboard | Prompt selection works |
| Day 6-7 | Frontend (Chat) | Chat window, streaming, tests | Chat feature complete |
| Day 8 | Polish | Testing, docs, bug fixes | Production-ready |

### Milestones
- **M1:** Specifications complete *(Day 1)* ✅
- **M2:** Backend foundation ready *(Day 3)*
- **M3:** Prompt selection UI working *(Day 5)*
- **M4:** Chat feature functional *(Day 7)*
- **M5:** Feature complete and tested *(Day 8)*

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vue 3)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CoachView.vue                                              │
│    ├─> PersonaCard.vue                                      │
│    │     └─> PromptSelectorDialog.vue                       │
│    │           ├─> Preview prompt                           │
│    │           ├─> Copy to clipboard (useClipboard)         │
│    │           └─> Open chat (CoachChatDialog)              │
│    │                                                         │
│    └─> CoachChatDialog.vue                                  │
│          ├─> Message display                                │
│          ├─> Message input                                  │
│          └─> Streaming responses                            │
│                                                              │
│  Composables:                                               │
│    - usePrompts.js (fetch, select prompts)                  │
│    - useClipboard.js (copy functionality)                   │
│    - useChat.js (chat state management)                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP / SSE
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Node.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  API Routes:                                                │
│    GET  /api/personas/:id/prompts                           │
│    GET  /api/personas/:id/prompts/:promptId                 │
│    POST /api/ai/chat                                        │
│                                                              │
│  Services:                                                  │
│    PromptFileService                                        │
│      ├─> Load prompts from file                             │
│      ├─> Validate schema                                    │
│      ├─> Merge with defaults                                │
│      ├─> Cache prompts                                      │
│      └─> Watch for file changes                             │
│                                                              │
│    AIMirrorService / OllamaAdapter                          │
│      └─> Chat with local models                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ File I/O
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  data/coach-prompts/                                        │
│    ├─> prompts.json (main prompt library)                   │
│    ├─> custom-prompts.json (user additions)                 │
│    └─> prompt-schema.json (validation schema)               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**1. Application Startup:**
```
Server Start
  → PromptFileService.loadPrompts()
  → Read data/coach-prompts/prompts.json
  → Validate against schema
  → Merge with hardcoded defaults (predefined-personas.js)
  → Cache in memory
```

**2. User Selects Prompt:**
```
User clicks PersonaCard
  → Open PromptSelectorDialog
  → Fetch /api/personas/:id/prompts
  → Display prompt options
  → User selects prompt
  → Selected prompt stored in component state
```

**3. Copy to Clipboard:**
```
User clicks "Copy" button
  → Fetch full prompt text
  → navigator.clipboard.writeText(prompt)
  → Show success toast
  → User pastes into ChatGPT
```

**4. Chat with AI:**
```
User clicks "Chat" button
  → Open CoachChatDialog with selected prompt
  → User types message
  → POST /api/ai/chat { personaId, promptId, message }
  → Backend loads prompt, calls Ollama
  → Stream response back (SSE or chunked)
  → Display in chat UI
```

---

## 🔧 Technical Decisions

### File Format: JSON
**Reasoning:**
- Easy to parse and validate
- Human-readable and editable
- Good schema validation tools
- Native JavaScript support

**Alternative Considered:** YAML (more user-friendly but requires parser)

### Caching Strategy: In-Memory
**Reasoning:**
- Fast access (no file I/O on each request)
- Prompts don't change frequently
- Small data size (< 1MB total)
- File watching for dev mode

**Alternative Considered:** Read-on-demand (slower but always fresh)

### Chat Implementation: Server-Sent Events
**Reasoning:**
- Built-in browser support
- Simpler than WebSockets
- One-way streaming sufficient
- Easy error handling

**Alternative Considered:** WebSockets (overkill for this use case)

### UI Framework: Radix Vue
**Reasoning:**
- Already used in project
- Accessible by default
- Composable primitives
- Consistent with SettingsView

---

## 🧪 Testing Strategy

### Test Pyramid

```
         /\
        /  \
       / E2E \       5 tests
      /______\
     /        \
    /  Integ   \     10 tests
   /____________\
  /              \
 /   Unit Tests   \  30 tests
/__________________\
```

### Test Coverage Goals
- **Backend:** > 85% coverage
- **Frontend:** > 80% coverage
- **Critical Paths:** 100% coverage

### Critical Paths to Test
1. Prompt file loading and validation
2. API endpoints for prompts
3. Prompt selection UI flow
4. Clipboard copy functionality
5. Chat message send/receive
6. Streaming responses
7. Error handling (file errors, AI errors, network errors)

### Test Tools
- **Backend:** Vitest, Supertest
- **Frontend:** Vitest, Vue Test Utils, Playwright (E2E)
- **Mocking:** Mock file system, Mock Ollama responses

---

## ⚠️ Risks & Mitigations

### Risk 1: Clipboard API Compatibility
**Impact:** High (core feature)  
**Probability:** Medium (older browsers)  
**Mitigation:**
- Use modern Clipboard API
- Provide fallback (textarea copy)
- Test on multiple browsers
- Clear browser requirements in docs

### Risk 2: Streaming Performance
**Impact:** Medium (UX quality)  
**Probability:** Low  
**Mitigation:**
- Implement chunking properly
- Test with slow connections
- Add loading indicators
- Graceful fallback to non-streaming

### Risk 3: File Schema Evolution
**Impact:** Medium (maintenance)  
**Probability:** High (features evolve)  
**Mitigation:**
- Version schema explicitly
- Backward compatibility checks
- Migration scripts if needed
- Comprehensive validation

### Risk 4: Chat State Management
**Impact:** Medium (bugs, memory leaks)  
**Probability:** Medium  
**Mitigation:**
- Use Vue composables properly
- Clean up on unmount
- Limit message history
- Memory profiling

### Risk 5: Breaking Existing Functionality
**Impact:** High (regressions)  
**Probability:** Low (good test coverage)  
**Mitigation:**
- Run all existing tests before each commit
- Manual regression testing
- Staged rollout
- Quick rollback plan

---

## 🔐 Security Considerations

### Prompt Injection Prevention
- Validate all prompt inputs
- Sanitize user messages
- Limit prompt length
- No code execution in prompts

### File Access Security
- Only read from designated directory
- Validate file paths (no traversal)
- Limit file size (< 10MB)
- No executable files

### Chat Security
- No persistent storage of chats
- Local AI only (no data leaving device)
- Rate limiting on chat API
- Input validation and sanitization

---

## 📊 Performance Targets

### Load Times
- Prompt file load: < 100ms
- Prompts API response: < 50ms
- Chat API first response: < 1s
- UI render time: < 16ms (60fps)

### Resource Usage
- Prompt cache size: < 5MB
- Chat memory: < 10MB per session
- CPU: < 5% idle, < 30% active chat

### Scalability
- Support up to 100 prompts per persona
- Handle 50+ concurrent chat sessions
- File size limit: 10MB

---

## 🎨 UI/UX Principles

### Design System
- Consistent with existing app design
- Card-based selection (like SettingsView)
- Blue accent color (#6366f1)
- Smooth animations (0.2s transitions)
- Responsive design (mobile-first)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly
- Focus indicators visible
- Color contrast > 4.5:1

### User Feedback
- Loading indicators for async operations
- Success/error toasts for actions
- Disabled states for unavailable actions
- Clear error messages

---

## 📝 Documentation Plan

### User Documentation
1. **User Guide** - How to use prompts and chat
2. **FAQ** - Common questions
3. **Troubleshooting** - Error solutions
4. **Video Demo** - Screen recording (optional)

### Developer Documentation
1. **API Reference** - Endpoint documentation
2. **Prompt Schema** - File format spec
3. **Architecture** - System design
4. **Contributing** - How to add features

### Code Documentation
- JSDoc for all public methods
- Component prop documentation
- Inline comments for complex logic
- README updates

---

## 🚀 Deployment Strategy

### Pre-Deployment Checklist
- [ ] All tests passing (backend + frontend)
- [ ] Manual testing complete
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Example prompts created
- [ ] No console errors/warnings

### Rollout Plan
1. **Merge to master** after all tests pass
2. **Tag release** (v0.3.0 - Dynamic Prompts)
3. **Update changelog**
4. **Deploy to production** (if applicable)
5. **Monitor for errors** (first 24 hours)

### Rollback Plan
- Keep feature branch for quick revert
- Git tag for rollback point
- Backup current prompts file
- Documented rollback steps

---

## 🔄 Future Enhancements

### Phase 2 (Future)
- **Import/Export Prompts** - Share with others
- **Prompt Templates** - Variables and placeholders
- **Chat History** - Optional persistence
- **Voice I/O** - Speak to coach
- **Multi-turn Memory** - Context-aware conversations
- **Prompt Marketplace** - Community sharing

### Technical Debt to Address
- Refactor predefined-personas.js
- Improve error handling
- Add more granular permissions
- Optimize caching strategy

---

## 👥 Stakeholders & Communication

### Internal Team
- **Developer (You):** Implementation
- **GitHub Copilot:** Code assistance
- **Users:** Testing and feedback

### Communication Plan
- Daily progress updates (commit messages)
- Feature complete notification
- Known issues documented
- Release notes published

---

## ✅ Definition of Done

A task is considered "done" when:
- [ ] Code implemented and working
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Manual testing complete
- [ ] Code reviewed (self-review)
- [ ] Documentation updated
- [ ] No new console errors
- [ ] Committed with clear message

The feature is "done" when:
- [ ] All tasks completed (60/60)
- [ ] All tests passing (483+)
- [ ] Performance targets met
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] User acceptance criteria met
- [ ] Merged to master

---

## 📚 References

### Technical Resources
- [Clipboard API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [Ollama API Docs](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Server-Sent Events - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [JSON Schema](https://json-schema.org/)
- [Radix Vue](https://www.radix-vue.com/)

### Project References
- [Feature Spec](./spec.md)
- [Task List](./tasks.md)
- [Phase 1 Spec](../001-rich-text-editor/spec.md) - Reference for similar patterns

---

**Last Updated:** 2025-12-01  
**Status:** Planning Complete, Ready to Start Implementation
