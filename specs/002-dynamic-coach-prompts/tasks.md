# Implementation Tasks: Dynamic Coach Prompts

**Feature:** 002-dynamic-coach-prompts  
**Total Estimated Time:** 7-8 days  
**Start Date:** 2025-12-01

---

## 📋 Task Overview

| Phase | Tasks | Estimated Time | Status |
|-------|-------|----------------|--------|
| Phase 0: Planning | T001-T004 | 0.5 days | ✅ Completed |
| Phase 1: Backend | T005-T020 | 2 days | ⚠️ Partially Started |
| Phase 2: Prompt Selection UI | T021-T035 | 2 days | ⚠️ Partially Started |
| Phase 3: Chat Window | T036-T050 | 2 days | ⏳ Not Started |
| Phase 4: Polish & Docs | T051-T060 | 1 day | ⏳ Not Started |

---

## Phase 0: Planning & Specification (0.5 days)

### T001: Create Feature Specification ✅
**Status:** Completed  
**Files:** `specs/002-dynamic-coach-prompts/spec.md`  
**Details:**
- User stories defined
- Technical architecture documented
- UI design mockups created
- Data models specified

### T002: Create Implementation Plan ✅
**Status:** Completed  
**Files:** `specs/002-dynamic-coach-prompts/tasks.md`  
**Details:**
- Break down into phases
- Estimate each task
- Define dependencies
- Create task checklist

### T003: Create Development Plan ✅
**Status:** Completed  
**Files:** `specs/002-dynamic-coach-prompts/plan.md`  
**Details:**
- Document development approach
- Define milestones
- Risk assessment
- Timeline estimation

### T004: Commit Specifications ✅
**Status:** Completed  
**Command:** `git add specs/ && git commit -m "docs: add Dynamic Coach Prompts specification"`  
**Details:**
- Commit all spec files
- Push to feature branch

---

## Phase 1: Backend Foundation (2 days)

### File Structure Setup

#### T005: Create Prompt Data Directory ⚠️
**Estimated Time:** 15 min  
**Status:** Partially Complete (different structure)  
**Files:**
- `backend/src/domain/entities/persona-prompts/` (directory)
- Implemented in different location

**Implementation:**
```bash
mkdir -p data/coach-prompts
touch data/coach-prompts/.gitkeep
```

#### T006: Create Prompt Schema File
**Estimated Time:** 30 min  
**Files:** `data/coach-prompts/prompt-schema.json`

**Implementation:**
- Define JSON schema for prompt validation
- Include all required fields
- Add examples and documentation

#### T007: Create Example Prompts File
**Estimated Time:** 1 hour  
**Files:** `data/coach-prompts/prompts.json`

**Implementation:**
- Create prompts for 2-3 personas
- Each persona has 2-3 prompt variants
- Include all metadata (title, description, tags)
- Mark default prompts

### Backend Service Implementation

#### T008: Create PromptFileService Class
**Estimated Time:** 2 hours  
**Files:** `backend/src/domain/services/PromptFileService.js`

**Methods to Implement:**
```javascript
class PromptFileService {
  constructor(promptFilePath)
  async loadPrompts()
  async reloadPrompts()
  getPromptsForPersona(personaId)
  getPromptById(personaId, promptId)
  getDefaultPromptForPersona(personaId)
  validatePromptSchema(promptData)
  mergeWithDefaults(filePrompts)
}
```

**Key Features:**
- File I/O with error handling
- Schema validation
- Caching for performance
- Merge file prompts with hardcoded defaults
- Watch for file changes (dev mode)

#### T009: Add Prompt Validation Logic
**Estimated Time:** 1 hour  
**Files:** `backend/src/domain/services/PromptFileService.js`

**Validation Rules:**
- Required fields present
- Valid persona IDs
- Unique prompt IDs per persona
- At least one default prompt per persona
- Valid JSON structure

#### T010: Integrate PromptFileService into Server
**Estimated Time:** 30 min  
**Files:** `backend/src/server.js`

**Implementation:**
- Initialize PromptFileService on startup
- Load prompts during bootstrap
- Handle load errors gracefully
- Make service available to routes

### API Endpoints

#### T011: Create GET /api/personas/:id/prompts
**Estimated Time:** 1 hour  
**Files:** `backend/src/adapters/http/routes/personas.js`

**Request:** `GET /api/personas/stoic-coach/prompts`

**Response:**
```json
{
  "success": true,
  "data": {
    "personaId": "stoic-coach",
    "prompts": [
      {
        "id": "stoic-daily-reflection",
        "title": "Daily Reflection",
        "description": "...",
        "tags": ["daily", "general"],
        "isDefault": true
      }
    ]
  }
}
```

#### T012: Create GET /api/personas/:id/prompts/:promptId
**Estimated Time:** 45 min  
**Files:** `backend/src/adapters/http/routes/personas.js`

**Request:** `GET /api/personas/stoic-coach/prompts/stoic-daily-reflection`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "stoic-daily-reflection",
    "title": "Daily Reflection",
    "description": "...",
    "tags": ["daily", "general"],
    "isDefault": true,
    "systemPrompt": "Full prompt text here..."
  }
}
```

#### T013: Update Existing /api/personas/:id/prompt Endpoint ✅
**Estimated Time:** 30 min  
**Status:** Completed  
**Files:** `backend/src/adapters/http/routes/personas.js`

**Changes:**
- Use prompt-loader.js to get prompt from file
- Maintain backward compatibility
- Falls back to inline prompt

#### T014: Create POST /api/ai/chat Endpoint
**Estimated Time:** 1.5 hours  
**Files:** `backend/src/adapters/http/routes/ai-chat.js`

**Request:**
```json
{
  "personaId": "stoic-coach",
  "promptId": "stoic-daily-reflection",
  "message": "I had a difficult day today..."
}
```

**Response:** Streaming or full response from AI

**Implementation:**
- Validate request body
- Load specified prompt
- Call OllamaAdapter with prompt + message
- Stream response back to client
- Error handling

### Testing

#### T015: Unit Tests for PromptFileService
**Estimated Time:** 2 hours  
**Files:** `backend/tests/unit/PromptFileService.test.js`

**Test Cases:**
- Load valid prompt file successfully
- Handle missing file gracefully
- Validate schema correctly
- Reject invalid prompt data
- Merge with defaults properly
- Cache prompts efficiently
- Get prompts for persona
- Get default prompt
- Get specific prompt by ID

#### T016: Unit Tests for Persona API Endpoints
**Estimated Time:** 1.5 hours  
**Files:** `backend/tests/unit/personas-api.test.js`

**Test Cases:**
- GET /api/personas/:id/prompts returns all prompts
- GET /api/personas/:id/prompts/:promptId returns specific prompt
- Invalid persona ID returns 404
- Invalid prompt ID returns 404
- Updated /api/personas/:id/prompt works with files

#### T017: Integration Tests for Chat Endpoint
**Estimated Time:** 1.5 hours  
**Files:** `backend/tests/integration/ai-chat-api.integration.test.js`

**Test Cases:**
- POST /api/ai/chat with valid data succeeds
- Chat uses correct prompt
- Invalid persona/prompt IDs return errors
- AI response is returned
- Error handling for AI failures

#### T018: Test Prompt File Validation
**Estimated Time:** 1 hour  
**Files:** `backend/tests/unit/PromptFileService.test.js`

**Test Cases:**
- Missing required fields rejected
- Duplicate prompt IDs rejected
- No default prompt rejected
- Multiple defaults per persona rejected
- Invalid JSON rejected

#### T019: Test Error Handling
**Estimated Time:** 1 hour  
**Files:** `backend/tests/unit/PromptFileService.test.js`

**Test Cases:**
- Corrupted file handled gracefully
- Permission errors handled
- Network errors (if remote) handled
- Falls back to hardcoded prompts

#### T020: Run All Backend Tests
**Estimated Time:** 30 min  
**Command:** `cd backend && npm test`

**Success Criteria:**
- All existing tests still pass
- All new tests pass
- Code coverage maintained or improved

---

## Phase 2: Prompt Selection UI (2 days)

### Component Creation

#### T021: Create PromptSelectorDialog Component ⚠️
**Estimated Time:** 2 hours  
**Status:** Partially Complete (PromptViewDialog exists - view only, no selection)  
**Files:** `frontend/src/components/PromptViewDialog.vue` (exists)

**What exists:**
- ✅ Modal dialog using Radix Vue
- ✅ Props: `persona`, `open`
- ✅ Emits: `update:open`
- ✅ Fetch prompt on open
- ✅ Loading state
- ✅ Error state
- ❌ No multi-prompt selection (shows single prompt only)
- ❌ No modelValue for selection
- ❌ No select emit

**Still needed:**
- Rename/refactor to support multiple prompts
- Add selection logic
- Emit selected prompt

#### T022: Design Prompt Card Layout
**Estimated Time:** 1.5 hours  
**Files:** `frontend/src/components/PromptSelectorDialog.vue`

**Layout:**
```vue
<div class="prompt-card" :class="{ selected: isSelected }">
  <div class="prompt-header">
    <RadioIndicator />
    <span class="prompt-title">Daily Reflection</span>
    <Badge v-if="isDefault">DEFAULT</Badge>
  </div>
  <p class="prompt-description">General daily reflection...</p>
  <div class="prompt-tags">
    <Tag>daily</Tag>
    <Tag>general</Tag>
  </div>
  <div class="prompt-actions">
    <Button @click="preview">Preview</Button>
    <Button @click="copy">Copy</Button>
    <Button @click="chat">Chat</Button>
  </div>
</div>
```

#### T023: Implement Prompt Selection Logic
**Estimated Time:** 1 hour  
**Files:** `frontend/src/components/PromptSelectorDialog.vue`

**Implementation:**
- Track selected prompt ID in state
- Update on card click
- Visual feedback for selection
- Emit selection to parent
- "Use Selected Prompt" button

#### T024: Add Preview Functionality ✅
**Estimated Time:** 1 hour  
**Status:** Completed  
**Files:** `frontend/src/components/PromptViewDialog.vue`

**Implementation:**
- ✅ Shows full prompt text in scrollable area
- ✅ Displays file-loaded badge when loaded from external file
- ✅ Clean modal presentation

#### T025: Implement Copy to Clipboard
**Estimated Time:** 1.5 hours  
**Files:** 
- `frontend/src/components/PromptSelectorDialog.vue`
- `frontend/src/composables/useClipboard.js`

**Implementation:**
```javascript
// composables/useClipboard.js
export function useClipboard() {
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  return { copy };
}
```

**Features:**
- Use Clipboard API
- Fallback for older browsers
- Success toast notification
- Error handling

#### T026: Add Toast Notification System
**Estimated Time:** 1 hour  
**Files:**
- `frontend/src/components/Toast.vue`
- `frontend/src/composables/useToast.js`

**Implementation:**
- Simple toast component
- Auto-dismiss after 3 seconds
- Success/error variants
- Global toast service

#### T027: Style PromptSelectorDialog
**Estimated Time:** 2 hours  
**Files:** `frontend/src/components/PromptSelectorDialog.vue`

**Styling:**
- Card-based design (similar to SettingsView)
- Selected state: blue border, checkmark
- Hover effects
- Responsive layout
- Accessible focus states
- Color scheme matches app theme

#### T028: Update PersonaCard Component ⚠️
**Estimated Time:** 1 hour  
**Status:** Partially Complete  
**Files:** `frontend/src/components/PersonaCard.vue`

**What exists:**
- ✅ "View Prompt" button exists
- ✅ Opens PromptViewDialog on click
- ✅ Passes persona data to dialog

**Still needed:**
- Change to "Select Prompt" button
- Open PromptSelectorDialog (once created)
- Support multiple prompts per persona

#### T029: Update CoachView Integration
**Estimated Time:** 1 hour  
**Files:** `frontend/src/views/CoachView.vue`

**Changes:**
- Import PromptSelectorDialog
- Add dialog state management
- Handle prompt selection
- Store selected prompt per persona
- Use selected prompt for AI interactions

#### T030: Create usePrompts Composable
**Estimated Time:** 1.5 hours  
**Files:** `frontend/src/composables/usePrompts.js`

**Features:**
```javascript
export function usePrompts(personaId) {
  const prompts = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedPrompt = ref(null);
  
  const fetchPrompts = async () => { ... };
  const fetchPromptById = async (promptId) => { ... };
  const selectPrompt = (prompt) => { ... };
  
  return {
    prompts,
    loading,
    error,
    selectedPrompt,
    fetchPrompts,
    fetchPromptById,
    selectPrompt
  };
}
```

### Testing

#### T031: Unit Tests for PromptSelectorDialog
**Estimated Time:** 2 hours  
**Files:** `frontend/tests/unit/PromptSelectorDialog.test.js`

**Test Cases:**
- Component renders correctly
- Fetches prompts on open
- Displays prompt cards
- Selection updates state
- Preview shows full prompt
- Copy button calls clipboard API
- Chat button emits event
- Loading state displayed
- Error state displayed

#### T032: Unit Tests for useClipboard
**Estimated Time:** 45 min  
**Files:** `frontend/tests/unit/useClipboard.test.js`

**Test Cases:**
- Successful copy
- Failed copy
- Browser without clipboard API
- Returns correct status

#### T033: Unit Tests for usePrompts
**Estimated Time:** 1 hour  
**Files:** `frontend/tests/unit/usePrompts.test.js`

**Test Cases:**
- Fetch prompts successfully
- Handle fetch errors
- Select prompt updates state
- Fetch single prompt by ID

#### T034: Integration Tests for Prompt Selection
**Estimated Time:** 1.5 hours  
**Files:** `frontend/tests/e2e/prompt-selection.e2e.test.js`

**Test Cases:**
- Open prompt selector from coach card
- Select different prompts
- Copy prompt to clipboard
- Close dialog
- Use selected prompt

#### T035: Run All Frontend Tests
**Estimated Time:** 30 min  
**Command:** `cd frontend && npm test`

**Success Criteria:**
- All existing tests pass
- All new tests pass
- No console errors

---

## Phase 3: Chat Window (2 days)

### Component Creation

#### T036: Create CoachChatDialog Component
**Estimated Time:** 2 hours  
**Files:** `frontend/src/components/CoachChatDialog.vue`

**Features:**
- Modal dialog
- Props: `persona`, `prompt`, `open`
- Chat message display area
- Message input field
- Send button
- Loading indicators
- Error handling

#### T037: Design Chat Message Layout
**Estimated Time:** 1.5 hours  
**Files:** `frontend/src/components/CoachChatDialog.vue`

**Layout:**
```vue
<div class="chat-messages">
  <div class="message user-message">
    <p>I had a difficult day today...</p>
    <span class="timestamp">2:30 PM</span>
  </div>
  <div class="message ai-message">
    <div class="avatar">🏛️</div>
    <div class="content">
      <p>I hear that you're experiencing difficulties...</p>
      <span class="timestamp">2:30 PM</span>
    </div>
  </div>
</div>
```

#### T038: Implement Message State Management
**Estimated Time:** 1 hour  
**Files:** `frontend/src/components/CoachChatDialog.vue`

**State:**
```javascript
const messages = ref([]);
const currentMessage = ref('');
const isSending = ref(false);
const error = ref(null);
```

#### T039: Create Chat API Service
**Estimated Time:** 1.5 hours  
**Files:** `frontend/src/services/chatApi.js`

**Methods:**
```javascript
export async function sendChatMessage({ personaId, promptId, message }) {
  const response = await api.post('/ai/chat', {
    personaId,
    promptId,
    message
  });
  return response.data;
}

export async function* streamChatMessage({ personaId, promptId, message }) {
  // Streaming implementation
  const response = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    body: JSON.stringify({ personaId, promptId, message }),
    headers: { 'Content-Type': 'application/json' }
  });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value);
  }
}
```

#### T040: Implement Send Message Functionality
**Estimated Time:** 2 hours  
**Files:** `frontend/src/components/CoachChatDialog.vue`

**Implementation:**
- Validate message input
- Add user message to chat
- Call chat API
- Handle streaming response
- Add AI response to chat
- Scroll to bottom
- Clear input field
- Error handling

#### T041: Add Streaming Response Support
**Estimated Time:** 2 hours  
**Files:** `frontend/src/components/CoachChatDialog.vue`

**Implementation:**
- Stream AI response word-by-word
- Display typing indicator
- Update message as chunks arrive
- Handle stream errors
- Graceful fallback to non-streaming

#### T042: Implement Auto-Scroll
**Estimated Time:** 45 min  
**Files:** `frontend/src/components/CoachChatDialog.vue`

**Implementation:**
```javascript
const messagesContainer = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = 
        messagesContainer.value.scrollHeight;
    }
  });
};

watch(messages, scrollToBottom, { deep: true });
```

#### T043: Add Message Timestamps
**Estimated Time:** 30 min  
**Files:** `frontend/src/components/CoachChatDialog.vue`

**Implementation:**
- Format timestamps (e.g., "2:30 PM")
- Show relative time (e.g., "just now")
- Update timestamps reactively

#### T044: Style CoachChatDialog
**Estimated Time:** 2 hours  
**Files:** `frontend/src/components/CoachChatDialog.vue`

**Styling:**
- Modern chat interface
- User messages: right-aligned, blue background
- AI messages: left-aligned, gray background
- Avatar icons for AI
- Smooth animations
- Responsive design
- Loading states
- Error states

#### T045: Integrate Chat into PromptSelectorDialog
**Estimated Time:** 1 hour  
**Files:** `frontend/src/components/PromptSelectorDialog.vue`

**Changes:**
- Add "Chat" button to each prompt card
- Open CoachChatDialog on click
- Pass persona and prompt data
- Handle dialog state

#### T046: Add Chat Button to CoachView
**Estimated Time:** 30 min  
**Files:** `frontend/src/views/CoachView.vue`

**Changes:**
- Option to start chat directly
- Uses selected or default prompt
- Quick access to chat feature

### Testing

#### T047: Unit Tests for CoachChatDialog
**Estimated Time:** 2 hours  
**Files:** `frontend/tests/unit/CoachChatDialog.test.js`

**Test Cases:**
- Component renders
- Messages display correctly
- Send message adds to chat
- Streaming updates message
- Auto-scroll works
- Error handling
- Loading states

#### T048: Unit Tests for Chat API
**Estimated Time:** 1 hour  
**Files:** `frontend/tests/unit/chatApi.test.js`

**Test Cases:**
- sendChatMessage calls API correctly
- streamChatMessage yields chunks
- Error handling
- Request format validation

#### T049: Integration Tests for Chat Flow
**Estimated Time:** 1.5 hours  
**Files:** `frontend/tests/e2e/chat-flow.e2e.test.js`

**Test Cases:**
- Open chat from prompt selector
- Send message and receive response
- Multiple messages in conversation
- Close chat dialog
- Error scenarios

#### T050: Run All Tests
**Estimated Time:** 30 min  
**Commands:**
- `cd backend && npm test`
- `cd frontend && npm test`

**Success Criteria:**
- All tests pass
- No regressions
- Good code coverage

---

## Phase 4: Polish & Documentation (1 day)

### Sample Data & Examples

#### T051: Create Comprehensive Prompts File
**Estimated Time:** 2 hours  
**Files:** `data/coach-prompts/prompts.json`

**Implementation:**
- All 7 personas from predefined-personas.js
- 2-4 prompt variants per persona
- High-quality prompt text
- Meaningful tags and descriptions
- Clear use-case differentiation

#### T052: Create Custom Prompts Example
**Estimated Time:** 30 min  
**Files:** `data/coach-prompts/custom-prompts.example.json`

**Implementation:**
- Template for user customizations
- Comments explaining structure
- Example custom persona
- Documentation references

### Documentation

#### T053: Create User Guide
**Estimated Time:** 1.5 hours  
**Files:** `specs/002-dynamic-coach-prompts/user-guide.md`

**Content:**
- How to select prompts
- How to copy to ChatGPT
- How to use chat feature
- Screenshots/GIFs
- Troubleshooting

#### T054: Create Developer Guide
**Estimated Time:** 1 hour  
**Files:** `specs/002-dynamic-coach-prompts/developer-guide.md`

**Content:**
- How to add custom prompts
- Prompt file schema explanation
- API documentation
- Code examples
- Extension points

#### T055: Update Main README
**Estimated Time:** 30 min  
**Files:** `README.md`

**Changes:**
- Add Dynamic Coach Prompts feature
- Link to user guide
- Update screenshots
- Mention chat capability

#### T056: Update Copilot Instructions
**Estimated Time:** 15 min  
**Files:** `.github/copilot-instructions.md`

**Changes:**
- Add prompt file patterns
- Document chat components
- Note clipboard functionality

### Final Testing & Polish

#### T057: Manual Testing Checklist
**Estimated Time:** 2 hours  
**Files:** `specs/002-dynamic-coach-prompts/testing-checklist.md`

**Test All Scenarios:**
- [ ] Load prompts from file
- [ ] Select different prompts for each persona
- [ ] Copy prompt to clipboard (verify paste)
- [ ] Chat with each persona
- [ ] Send multiple messages
- [ ] Streaming responses work
- [ ] Error handling (invalid file, AI errors)
- [ ] Fallback to hardcoded prompts
- [ ] UI responsive on mobile
- [ ] Accessibility (keyboard navigation, screen readers)

#### T058: Performance Testing
**Estimated Time:** 1 hour  

**Metrics:**
- [ ] Prompt loading time < 100ms
- [ ] Chat response starts < 1s
- [ ] Streaming smooth (no stutters)
- [ ] No memory leaks
- [ ] File caching works

#### T059: Accessibility Audit
**Estimated Time:** 1 hour  

**Checks:**
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Screen reader friendly
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

#### T060: Final Bug Fixes
**Estimated Time:** 2 hours  

**Activities:**
- Fix any issues from testing
- Code cleanup
- Remove console.logs
- Final commit

---

## 📊 Progress Tracking

### Phase Completion
- [X] Phase 0: Planning (0.5 days) - COMPLETED
- [~] Phase 1: Backend (2 days) - Partial: prompt-loader exists, single .txt file support
- [~] Phase 2: Prompt Selection UI (2 days) - Partial: PromptViewDialog exists (view only, no selector)
- [ ] Phase 3: Chat Window (2 days)
- [ ] Phase 4: Polish & Docs (1 day)

### Total Progress: 6 / 60 tasks completed (~10%)

**Completed:** T001, T002, T003, T004, T013, T024  
**Partially Complete:** T005 (prompts dir), T021 (PromptViewDialog exists, needs selector), T028 (View button exists)  
**In Progress:** None  
**Blocked:** None

**Note:** Several foundational pieces exist but need expansion:
- Basic prompt loading from .txt files works (prompt-loader.js)
- PromptViewDialog displays single prompts
- Need to add multi-prompt support, selection UI, and chat features

---

## 🚀 Next Steps

1. Complete T002 (this file)
2. Create T003 (plan.md)
3. Commit all specifications (T004)
4. Begin Phase 1: Backend implementation

---

## 📝 Notes

- Keep tests updated as you implement
- Commit frequently with clear messages
- Update this file as tasks complete
- Mark blockers immediately
- Ask for clarification if requirements unclear
