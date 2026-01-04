# Feature Specification: Dynamic Coach Prompts

**Feature ID:** 002-dynamic-coach-prompts  
**Status:** Planning → Implementation  
**Created:** 2025-12-01  
**Branch:** `002-dynamic-coach-prompts`

---

## 📋 Overview

### Problem Statement
Currently, coaching personas have a single, hardcoded system prompt in `predefined-personas.js`. This creates several limitations:
- Users cannot customize coaching approaches without modifying code
- Each coach can only have one coaching style/situation
- No flexibility for different coaching contexts (e.g., career vs. relationships)
- Users who want to manually use prompts with ChatGPT must copy from the code or UI

### Solution
Implement a flexible prompt management system that:
- Reads prompts from external configuration files
- Supports multiple prompt variants per coach persona
- Allows users to select which prompt to use for different situations
- Provides easy copy-to-clipboard for manual ChatGPT usage
- Enables interactive chat with local AI models (Ollama)

---

## 🎯 User Stories

### US1: File-Based Prompts ✅ **PARTIALLY IMPLEMENTED**
**As a user**, I want coach personas to read prompts from files  
**So that** I can customize and extend coaching approaches without code changes

**Acceptance Criteria:**
- ✅ **DONE** - Prompts can be loaded from `.txt` files (not JSON yet)
- ✅ **DONE** - System falls back to hardcoded prompts if file not found
- ❌ **TODO** - File changes are detected and prompts reload without server restart (development mode)
- ⚠️ **PARTIAL** - Invalid prompt files fail silently and use fallback (no error messages yet)

**Current Implementation:**
- `backend/src/domain/entities/prompt-loader.js` - loads prompts from `.txt` files
- `backend/src/domain/entities/persona-prompts/` - directory for prompt files
- `GET /api/personas/:id/prompt` - API endpoint to get prompt (with file detection)

### US2: Multiple Prompts per Coach ❌ **NOT IMPLEMENTED**
**As a user**, I want each coach to have multiple prompt options  
**So that** I can choose the right coaching approach for my current situation

**Acceptance Criteria:**
- ❌ **TODO** - Each coach can have 1-N prompt variants
- ❌ **TODO** - Each variant has a title, description, and use-case tags
- ❌ **TODO** - UI shows all available prompts for a selected coach
- ❌ **TODO** - User can preview full prompt text before selecting
- ❌ **TODO** - Selected prompt is used for AI interactions

**Current Status:** Each persona only has ONE prompt (either inline or from file)

### US3: Copy Prompt to Clipboard ❌ **NOT IMPLEMENTED**
**As a user**, I want to copy any prompt to clipboard  
**So that** I can manually paste it into ChatGPT or other AI tools

**Acceptance Criteria:**
- ❌ **TODO** - Each prompt has a "Copy" button
- ❌ **TODO** - Clipboard copy includes the full system prompt
- ❌ **TODO** - Success feedback shown after copy (toast/notification)
- ❌ **TODO** - Works in all modern browsers with clipboard API

**Current Status:** 
- ✅ **DONE** - PromptViewDialog shows full prompt text (but no copy button)
- ❌ **TODO** - No clipboard functionality yet

### US4: Chat with Local AI Models ❌ **NOT IMPLEMENTED**
**As a user using local AI**, I want to open a chat window  
**So that** I can have an interactive conversation with the coach

**Acceptance Criteria:**
- ❌ **TODO** - Chat window opens with selected prompt pre-loaded
- ❌ **TODO** - User can send messages and receive AI responses
- ❌ **TODO** - Message history is maintained during the session
- ❌ **TODO** - Supports streaming responses (text appears as it's generated)
- ❌ **TODO** - Works with Ollama local models
- ❌ **TODO** - Chat can be closed and conversation is not persisted

**Current Status:** No chat window exists - only ChatGPT link generation for external use

---

## 🏗️ Technical Architecture

### ✅ Already Implemented

#### Existing File-Based Prompt System
**Location:** `backend/src/domain/entities/`

**Current Implementation:**
- `prompt-loader.js` - Loads prompts from `.txt` files
- `persona-prompts/` - Directory for individual prompt files (e.g., `tatyana-muzhitskaya.txt`)
- **Limitation:** Only ONE prompt per persona (not multiple variants)

#### Existing Components
- ✅ `CoachPersona` entity with validation (Zod schema)
- ✅ 7 predefined personas in `predefined-personas.js`
- ✅ `GET /api/personas` - List all personas
- ✅ `GET /api/personas/:id` - Get single persona
- ✅ `GET /api/personas/:id/prompt` - Get prompt (with file loading)
- ✅ `PromptViewDialog.vue` - Shows full prompt text
- ✅ `PersonaCard.vue` - Displays persona with "View Prompt" button
- ✅ `CoachView.vue` - Main coach selection view
- ✅ `ChatGPTLinkGenerator` - Generates external ChatGPT links

---

### 🚧 Needed Additions

### File Structure
```
data/
  coach-prompts/
    prompts.json              # Main prompt configuration
    custom-prompts.json       # Optional user customizations
```

### Prompt File Schema (JSON)

```json
{
  "$schema": "./prompt-schema.json",
  "version": "1.0.0",
  "personas": {
    "stoic-coach": {
      "prompts": [
        {
          "id": "stoic-daily-reflection",
          "title": "Daily Reflection",
          "description": "General daily reflection focusing on Stoic principles",
          "tags": ["daily", "general", "virtue"],
          "isDefault": true,
          "systemPrompt": "You are a Stoic coach inspired by Marcus Aurelius..."
        },
        {
          "id": "stoic-adversity",
          "title": "Facing Adversity",
          "description": "Specific guidance for difficult situations and challenges",
          "tags": ["challenges", "resilience", "control"],
          "isDefault": false,
          "systemPrompt": "You are a Stoic coach helping someone face adversity..."
        }
      ]
    },
    "compassionate-listener": {
      "prompts": [
        {
          "id": "listener-general",
          "title": "Empathic Listening",
          "description": "General empathic and validating approach",
          "tags": ["empathy", "validation", "general"],
          "isDefault": true,
          "systemPrompt": "You are a compassionate listener inspired by Carl Rogers..."
        }
      ]
    }
  }
}
```

### Backend Components

#### 1. PromptFileService
**Location:** `backend/src/domain/services/PromptFileService.js`

**Responsibilities:**
- Load and parse prompt files from `data/coach-prompts/`
- Validate prompt schema
- Merge custom prompts with defaults
- Cache prompts for performance
- Reload prompts when files change (dev mode)

**Key Methods:**
```javascript
class PromptFileService {
  async loadPrompts()
  async getPromptsForPersona(personaId)
  async getPromptById(personaId, promptId)
  getDefaultPromptForPersona(personaId)
  validatePromptSchema(promptData)
}
```

#### 2. Updated API Endpoints

**GET `/api/personas/:id/prompts`**
- Returns all available prompts for a persona
- Response includes prompt metadata (title, description, tags)
- Full prompt text can be optionally included

**GET `/api/personas/:id/prompts/:promptId`**
- Returns full details of a specific prompt
- Used when user wants to view/copy a specific prompt

**POST `/api/ai/chat`** (NEW)
- Start chat session with selected prompt
- Accepts: `{ personaId, promptId, message }`
- Returns streaming response or full response

### Frontend Components

#### 1. PromptSelectorDialog.vue
**Location:** `frontend/src/components/PromptSelectorDialog.vue`

**Features:**
- Card-based selection UI (similar to Settings)
- Shows prompt title, description, and tags
- Preview button to see full prompt
- Copy button for clipboard
- "Chat" button to open chat window
- Accessible keyboard navigation

#### 2. CoachChatDialog.vue
**Location:** `frontend/src/components/CoachChatDialog.vue`

**Features:**
- Modal dialog for AI chat
- Message input area
- Chat history display
- Streaming response support
- Loading states
- Error handling
- Close/cancel functionality

#### 3. Updated Components
- **PersonaCard.vue**: Add button to open prompt selector
- **PromptViewDialog.vue**: Update to handle multiple prompts
- **CoachView.vue**: Integrate new dialog components

---

## 🎨 User Interface Design

### Prompt Selection Flow

```
CoachView
  ↓
PersonaCard (Click "Select Prompt")
  ↓
PromptSelectorDialog
  ├─ Prompt Option 1 (Card)
  │   ├─ Title & Description
  │   ├─ Tags
  │   ├─ [Preview] [Copy] [Chat]
  ├─ Prompt Option 2 (Card)
  └─ [Use Selected Prompt]
```

### Chat Window Flow

```
Click "Chat" on Prompt
  ↓
CoachChatDialog Opens
  ├─ Coach Info Header
  ├─ Chat Messages Area
  │   ├─ User Message
  │   ├─ AI Response
  │   └─ ...
  ├─ Message Input
  └─ [Send] [Close]
```

### UI Mockup (Text)

```
┌─────────────────────────────────────────┐
│  🏛️ Stoic Coach - Select Prompt         │
├─────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ ✓ Daily Reflection          [DEFAULT]│ │
│  │ General daily reflection focusing  │ │
│  │ on Stoic principles               │ │
│  │ 🏷️ daily · general · virtue        │ │
│  │ [Preview] [Copy] [Chat]           │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ ○ Facing Adversity                 │ │
│  │ Specific guidance for difficult    │ │
│  │ situations and challenges          │ │
│  │ 🏷️ challenges · resilience · control│ │
│  │ [Preview] [Copy] [Chat]           │ │
│  └────────────────────────────────────┘ │
│                                          │
│          [Use Selected Prompt]          │
└─────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Load Prompts on Startup
```
Server Start
  → PromptFileService.loadPrompts()
  → Read data/coach-prompts/prompts.json
  → Validate schema
  → Merge with hardcoded defaults
  → Cache in memory
```

### 2. User Selects Coach
```
User clicks coach card
  → Frontend requests /api/personas/:id/prompts
  → Backend returns prompt list
  → PromptSelectorDialog displays options
  → User selects a prompt
  → Selected prompt ID stored in component state
```

### 3. Copy Prompt
```
User clicks "Copy"
  → navigator.clipboard.writeText(promptText)
  → Show success toast
  → User can paste into ChatGPT
```

### 4. Start Chat
```
User clicks "Chat"
  → CoachChatDialog opens
  → Load selected prompt
  → User types message
  → POST /api/ai/chat { personaId, promptId, message }
  → Backend uses OllamaAdapter
  → Stream response back
  → Display in chat UI
```

---

## 📊 Data Model

### Prompt Entity
```typescript
interface Prompt {
  id: string;                // Unique identifier
  title: string;             // Display name
  description: string;       // What this prompt is for
  tags: string[];            // Use-case tags
  isDefault: boolean;        // Default for this persona
  systemPrompt: string;      // Full AI system prompt
}
```

### Persona with Prompts
```typescript
interface PersonaWithPrompts {
  id: string;
  name: string;
  style: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
  prompts: Prompt[];         // Array of available prompts
  defaultPrompt: Prompt;     // Quick access to default
}
```

---

## ✅ Testing Strategy

### Unit Tests
- PromptFileService: load, validate, merge, cache
- API endpoints: prompts list, single prompt, chat
- PromptSelectorDialog: selection, preview, copy
- CoachChatDialog: send message, receive response, streaming

### Integration Tests
- End-to-end prompt selection flow
- Chat conversation with mock AI
- Clipboard functionality
- File reload on changes

### E2E Tests
- Select coach → view prompts → copy to clipboard
- Select coach → choose prompt → start chat
- Invalid prompt file handling

---

## 🚀 Implementation Phases

### Phase 1: Backend Foundation (2 days)
- [x] ✅ **DONE** - Create prompt file schema and example data (simple .txt files exist)
- [ ] ❌ **TODO** - Migrate to JSON format with multiple prompts per persona
- [ ] ❌ **TODO** - Implement PromptFileService (enhance existing prompt-loader.js)
- [ ] ❌ **TODO** - Update API endpoints for multiple prompts per persona
  - [ ] `GET /api/personas/:id/prompts` - List all prompts for a persona
  - [ ] `GET /api/personas/:id/prompts/:promptId` - Get specific prompt
- [x] ✅ **DONE** - Add unit tests (existing tests for personas)
- [ ] ❌ **TODO** - Add integration tests for new prompt endpoints

### Phase 2: Frontend - Prompt Selection (2 days)
- [ ] ❌ **TODO** - Create PromptSelectorDialog component
- [x] ✅ **DONE** - Update PersonaCard to open prompt viewer (opens PromptViewDialog)
- [ ] ❌ **TODO** - Implement clipboard copy functionality in PromptViewDialog
- [ ] ❌ **TODO** - Add UI tests
- [x] ✅ **DONE** - Style and polish (PromptViewDialog exists with styling)

### Phase 3: Frontend - Chat Window (2 days)
- [ ] ❌ **TODO** - Create CoachChatDialog component
- [ ] ❌ **TODO** - Implement chat API integration
- [ ] ❌ **TODO** - Add streaming response support
- [ ] ❌ **TODO** - Handle loading and error states
- [ ] ❌ **TODO** - Add tests

### Phase 4: Polish & Documentation (1 day)
- [x] ✅ **DONE** - Create example prompts (7 personas exist, 1 has external file)
- [ ] ❌ **TODO** - Convert all personas to JSON format with multiple variants
- [ ] ❌ **TODO** - Update user documentation
- [ ] ❌ **TODO** - Add developer documentation
- [ ] ❌ **TODO** - Performance testing
- [ ] ❌ **TODO** - Bug fixes

---

## 🔒 Security & Privacy

- Prompt files stored locally, never uploaded
- Chat conversations are ephemeral (not saved)
- Local AI models keep data on device
- No external API calls unless user chooses
- Validate all prompt inputs to prevent injection

---

## 🎯 Success Metrics

- Users can successfully load and use custom prompts
- Copy-to-clipboard works in 95%+ of browsers
- Chat window provides smooth, responsive experience
- Zero security vulnerabilities in prompt handling
- All tests passing (unit, integration, e2e)

---

## 📝 Future Enhancements

- Import/export prompt collections
- Share prompts with community
- Prompt templates and variables
- Chat history persistence (optional)
- Multi-turn conversation memory
- Voice input/output for chat
- Prompt marketplace/gallery

---

## 📚 References

- [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Server-Sent Events for Streaming](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [JSON Schema Validation](https://json-schema.org/)
