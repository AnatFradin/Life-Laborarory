# Data Model - Rich Text Editor

**Feature**: 001-rich-text-editor  
**Date**: November 27, 2025

## Overview

This feature **does not introduce new data entities**. It enhances existing reflection content to support Markdown formatting. All changes are **backward compatible** - plain text reflections continue to work unchanged.

---

## Core Principle

**Markdown as Plain Text Convention**: Reflections are stored as plain text. Markdown is simply a formatting convention within the text content, not a separate data type or mode.

---

## Entities

### 1. Reflection (EXISTING - No Changes)

**Purpose**: Represents a user's journal entry  
**Storage**: JSON file in `data/reflections/YYYY-MM/[uuid].json`

**Schema** (unchanged):
```json
{
  "id": "uuid-v4",
  "type": "text" | "visual",
  "content": "string",
  "timestamp": "ISO 8601 datetime",
  "tags": ["string"],
  "aiInsights": {
    "summary": "string",
    "patterns": ["string"],
    "lastAnalyzed": "ISO 8601 datetime"
  }
}
```

**Markdown Support**:
- `content` field contains plain text
- If user writes Markdown syntax, it's stored as-is: `"# Heading\n\n**Bold text**"`
- If user writes plain text, it's stored as-is: `"Just plain text"`
- No flag or indicator needed - renderer detects and handles both

**Validation Rules** (unchanged):
- `id`: Required, must be valid UUID v4
- `type`: Required, must be "text" or "visual"
- `content`: Required, non-empty string, max 100,000 characters
- `timestamp`: Required, valid ISO 8601 datetime
- `tags`: Optional array of strings
- `aiInsights`: Optional object (populated by AI mirror)

**State Transitions** (unchanged):
```
New → Draft → Saved → [Edited] → Saved
                   ↓
                Deleted (soft delete via export then remove)
```

---

### 2. EditorState (NEW - Frontend Only, Not Persisted)

**Purpose**: Manages editor UI state during editing session  
**Storage**: Vue component reactive state (not persisted)

**Schema**:
```typescript
interface EditorState {
  content: string              // Current editor content (synced with reflection.content)
  mode: 'edit' | 'preview'     // Current view mode
  cursorPosition: number       // Character offset in content string
  selectionStart: number       // Selection range start
  selectionEnd: number         // Selection range end
  isDirty: boolean             // Has unsaved changes
  lastSaved: Date | null       // Timestamp of last save
}
```

**Lifecycle**:
- Created when user opens reflection editor
- Updated on every keystroke, mode toggle, or cursor movement
- Destroyed when user closes editor
- **Not persisted** - only lives in memory during editing

**Validation Rules**:
- `content`: String, max 100,000 characters (same as Reflection)
- `mode`: Must be 'edit' or 'preview'
- `cursorPosition`: Integer, 0 ≤ position ≤ content.length
- `selectionStart/End`: Integer, 0 ≤ start ≤ end ≤ content.length

---

### 3. RephrasingRequest (NEW - P3, Not Persisted)

**Purpose**: Represents an AI rephrasing request  
**Storage**: Temporary, exists only during API call

**Schema**:
```typescript
interface RephrasingRequest {
  originalText: string          // User's selected text (max 5,000 chars)
  style: 'clearer' | 'more-positive' | 'more-constructive'
  context?: {
    before: string              // Up to 200 chars before selection
    after: string               // Up to 200 chars after selection
  }
  aiProvider: 'ollama' | 'openai' | 'anthropic'
  model: string                 // e.g., "llama3", "gpt-4"
}
```

**Validation Rules**:
- `originalText`: Required, 1-5,000 characters
- `style`: Required, must be one of the three defined styles
- `context.before/after`: Optional, max 200 chars each
- `aiProvider`: Required, must match user's AI preference
- `model`: Required, must be available model for selected provider

**Privacy Rules**:
- Only selected text sent to AI (FR-026)
- Context is optional (user can disable in settings)
- Never send reflection ID or metadata
- Request logged locally (for undo) but not persisted to disk

---

### 4. RephrasingSuggestion (NEW - P3, Not Persisted)

**Purpose**: AI-generated alternative phrasings  
**Storage**: Temporary, shown in UI, discarded after accept/reject

**Schema**:
```typescript
interface RephrasingSuggestion {
  originalText: string          // Echo of user's selection
  suggestions: string[]         // 2-3 alternative phrasings
  style: 'clearer' | 'more-positive' | 'more-constructive'
  timestamp: Date               // When generated
  tokenCount: number            // For tracking API usage (if applicable)
}
```

**Validation Rules**:
- `suggestions`: Array of 2-3 strings, each 1-10,000 characters
- `style`: Must match request style
- `timestamp`: Valid Date object
- `tokenCount`: Non-negative integer

**Lifecycle**:
1. User selects text → RephraseDialog opens
2. User chooses style → RephrasingRequest sent to AI
3. AI returns → RephrasingSuggestion displayed
4. User accepts → original text replaced in content
5. User rejects → suggestion discarded
6. RephrasingSuggestion destroyed when dialog closes

---

## Relationships

```
Reflection (existing)
    ├─ content: string (may contain Markdown syntax)
    └─ type: "text" | "visual" (unchanged)

EditorState (frontend only)
    ├─ content: synced with Reflection.content
    └─ mode: 'edit' | 'preview'

RephrasingRequest (temporary)
    ├─ originalText: substring of EditorState.content
    └─ style: user's choice

RephrasingSuggestion (temporary)
    ├─ originalText: from RephrasingRequest
    └─ suggestions: from AI response
```

**No database relationships** - all entities are either:
- Persisted as JSON files (Reflection)
- Temporary in-memory state (EditorState, RephrasingRequest, RephrasingSuggestion)

---

## Markdown Rendering Flow

```
User types in editor
    ↓
EditorState.content updated (reactive)
    ↓
Debounced (200ms) → Markdown parser
    ↓
marked.parse(content) → HTML
    ↓
DOMPurify.sanitize(html) → Safe HTML
    ↓
Render in preview pane
```

**No storage changes** - Markdown stays as plain text in `Reflection.content`

---

## Migration Strategy

**No migration needed** ✅

**Reason**: 
- Existing reflections are already plain text
- Markdown syntax (if present) is just text content
- Renderer handles both plain text and Markdown gracefully
- User Story 1, Scenario 5 requirement: "existing reflections work as-is"

**Example**:
```json
// Existing reflection (before feature)
{
  "id": "abc-123",
  "type": "text",
  "content": "Today was good.",
  "timestamp": "2025-11-01T10:00:00Z"
}

// Same reflection viewed after feature deployment
// Renders as plain text (no Markdown detected) ✅
// If user edits and adds Markdown: "# Today\n\nWas **good**."
// Still valid, no schema change ✅
```

---

## Validation Summary

| Entity | Storage | Max Size | Persisted? | Migration? |
|--------|---------|----------|------------|------------|
| **Reflection** | JSON file | 100KB | Yes | No |
| **EditorState** | Vue reactive | - | No | N/A |
| **RephrasingRequest** | API payload | 5KB | No | N/A |
| **RephrasingSuggestion** | Memory | 10KB | No | N/A |

---

## Edge Cases & Constraints

1. **Very Large Reflections** (10K+ words):
   - Preview rendering may take 200-500ms
   - Solution: Virtual scrolling if needed (research.md #8)
   - Limit: 100,000 characters (existing constraint)

2. **Invalid Markdown Syntax**:
   - marked.js handles gracefully (renders as best-effort HTML)
   - Example: `**unclosed bold` → renders with visible `**`
   - No errors thrown, UX is forgiving

3. **XSS Attacks via Markdown**:
   - Example: `<script>alert('XSS')</script>`
   - Defense: DOMPurify sanitizes to plain text
   - Test: Unit test in markdown.test.js

4. **Concurrent Edits** (same reflection, multiple windows):
   - Not supported in this feature (local-first, single-user)
   - Last save wins (existing behavior)
   - Future enhancement: conflict detection

5. **AI Rephrasing Failures**:
   - RephrasingSuggestion not returned
   - UI shows gentle error: "AI unavailable" (FR-024)
   - Original text preserved, user can retry

---

## API Contracts → See `/contracts/` Directory

The following API contracts are defined:

1. `POST /api/ai/rephrase` - Request AI rephrasing (P3)
   - Input: RephrasingRequest
   - Output: RephrasingSuggestion
   - See: `contracts/ai-rephrasing.openapi.yaml`

All other operations use existing endpoints (no new backend APIs for P1/P2).
