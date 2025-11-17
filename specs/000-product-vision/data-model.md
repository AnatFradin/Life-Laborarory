# Data Model

**Feature**: Laboratory of Life — Product Vision  
**Date**: 2025-11-11  
**Phase**: 1 (Design)

## Purpose

This document defines the domain entities, their relationships, validation rules, and state transitions extracted from the feature specification.

---

## Entities

### 1. Reflection

**Description**: A single unit of self-expression captured at a moment in time.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string (UUID) | Yes | UUID v4 format | Unique identifier |
| `timestamp` | string (ISO 8601) | Yes | Valid datetime | When reflection was created |
| `mode` | enum | Yes | One of: `text`, `visual` | Expression mode used |
| `content` | string | Conditional | Min 1 char if mode=text | Text content (for text mode) |
| `visualAttachment` | VisualAttachment | Conditional | Valid VisualAttachment if mode=visual | Image reference (for visual mode) |
| `aiInteraction` | AIInteraction | No | Valid AIInteraction if present | Optional AI mirror response |
| `metadata` | object | No | Valid Metadata object | Additional metadata |

**Validation Rules** (from FR-002, FR-003, FR-004):
- If `mode === 'text'`: `content` is required and non-empty
- If `mode === 'visual'`: `visualAttachment` is required
- `timestamp` must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
- Content in any language supported (FR-021)

**State**: Immutable after creation (no editing for V1 - see Reversibility principle, delete and recreate)

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-11-11T14:30:00Z",
  "mode": "text",
  "content": "Today I noticed a pattern in how I respond to uncertainty...",
  "aiInteraction": {
    "model": "ollama:llama2",
    "prompt": "Reflect on this: Today I noticed a pattern...",
    "response": "I hear you noticing something about your relationship with uncertainty...",
    "timestamp": "2025-11-11T14:31:00Z"
  },
  "metadata": {
    "createdFrom": "compose-view",
    "version": "1.0.0"
  }
}
```

---

### 2. VisualAttachment

**Description**: Reference to an imported image file used in a visual reflection.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `originalFilename` | string | Yes | Non-empty | Original filename when imported |
| `storedPath` | string | Yes | Valid relative path | Path relative to data directory |
| `mimeType` | string | Yes | Valid image MIME type | e.g., `image/jpeg`, `image/png` |
| `sizeBytes` | number | Yes | Positive integer | File size in bytes |
| `dimensions` | object | No | {width, height} both positive | Image dimensions if available |
| `importTimestamp` | string (ISO 8601) | Yes | Valid datetime | When image was imported |

**Validation Rules** (from FR-003, Edge Cases):
- Supported MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Max file size: 10MB (configurable)
- Image copied to local storage on import (from Assumption #8)
- If original file deleted, storedPath ensures reflection remains intact

**Example**:
```json
{
  "originalFilename": "sketch-of-tree.jpg",
  "storedPath": "visuals/2025-11/550e8400-e29b-41d4-a716-446655440000.jpg",
  "mimeType": "image/jpeg",
  "sizeBytes": 2457600,
  "dimensions": {
    "width": 1920,
    "height": 1080
  },
  "importTimestamp": "2025-11-11T14:25:00Z"
}
```

---

### 3. AIInteraction

**Description**: A request-response pair between user and AI mirror.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `model` | string | Yes | Non-empty | AI model identifier (e.g., `ollama:llama2`, `openai:gpt-4`) |
| `provider` | enum | Yes | One of: `local`, `online` | Local (Ollama) or online (OpenAI/Anthropic) |
| `prompt` | string | Yes | Non-empty | User's reflection text sent to AI |
| `response` | string | Yes | Non-empty | AI's reflective response |
| `timestamp` | string (ISO 8601) | Yes | Valid datetime | When AI response was generated |
| `systemPromptVersion` | string | Yes | Semantic version (e.g., "1.0.0") | Version of system prompt used for traceability |

**Validation Rules** (from FR-007 through FR-012):
- `provider === 'local'`: Model must start with `ollama:`
- `provider === 'online'`: Model must start with `openai:` or `anthropic:`
- Response must be non-directive (validated via system prompt, tested via SC-010, SC-011)
- Response must never contain imperative language ("you should", "you must")

**Example**:
```json
{
  "model": "ollama:llama2",
  "provider": "local",
  "prompt": "Today I noticed a pattern in how I respond to uncertainty...",
  "response": "I'm curious about this pattern you're noticing. What stands out to you most about how you respond when uncertainty arises?",
  "timestamp": "2025-11-11T14:31:00Z",
  "systemPromptVersion": "1.0.0"
}
```

**System Prompt Versioning** (Decision: Semantic Versioning):
- **Format**: `MAJOR.MINOR.PATCH` (e.g., `1.0.0`, `1.1.0`, `2.0.0`)
- **MAJOR**: Significant behavior change in AI responses
- **MINOR**: Refinements or additions to prompts
- **PATCH**: Bug fixes or typo corrections
- **Rationale**: Familiar to developers, communicates impact of changes, enables tracking response quality over time
```

---

### 4. UserPreferences

**Description**: User settings controlling AI model choice, privacy level, and UI preferences.

**Fields**:

| Field | Type | Required | Validation | Default | Description |
|-------|------|----------|-----------|---------|-------------|
| `aiProvider` | enum | Yes | One of: `local`, `online` | `local` | Default AI provider |
| `localModel` | string | No | Valid Ollama model | `llama2` | Ollama model name |
| `onlineModel` | string | No | Valid online model | null | Online AI model (null if never opted in) |
| `onlineProvider` | enum | No | One of: `openai`, `anthropic` | null | Online AI provider |
| `hasAcknowledgedOnlineWarning` | boolean | Yes | Boolean | `false` | User has seen privacy warning for online AI |
| `language` | string | Yes | ISO 639-1 code | `en` | UI language (user content any language) |
| `theme` | enum | Yes | One of: `calm-light`, `calm-dark` | `calm-light` | Color theme |

**Validation Rules** (from FR-009, Product Principles I & IV):
- Default `aiProvider` is always `local` (Ollama)
- Cannot set `onlineModel` unless `hasAcknowledgedOnlineWarning === true`
- If `aiProvider === 'online'`, must have valid `onlineModel` and `onlineProvider`

**State Transitions**:
1. **Initial state**: `aiProvider: 'local'`, no online model set
2. **User selects online AI**: Display warning → user confirms → set `hasAcknowledgedOnlineWarning: true` → allow online model selection
3. **User switches back to local**: `aiProvider: 'local'` (online config preserved for future use)

**Example**:
```json
{
  "aiProvider": "local",
  "localModel": "llama2",
  "onlineModel": null,
  "onlineProvider": null,
  "hasAcknowledgedOnlineWarning": false,
  "language": "en",
  "theme": "calm-light"
}
```

---

### 5. ExportBundle

**Description**: Complete data export package in Markdown format.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `exportTimestamp` | string (ISO 8601) | Yes | Valid datetime | When export was generated |
| `reflectionCount` | number | Yes | Non-negative integer | Total number of reflections |
| `dateRange` | object | Yes | {start, end} both valid datetimes | First and last reflection timestamps |
| `format` | string | Yes | Always `markdown` | Export format (V1 only supports Markdown) |
| `content` | string | Yes | Valid Markdown | Full export in Markdown format |
| `visualsIncluded` | boolean | Yes | Boolean | Whether visual attachments were included |
| `exportFormat` | enum | Yes | One of: `single-file`, `folder` | How visuals were exported |

**Validation Rules** (from FR-015, FR-020, SC-019):
- Export must be valid Markdown readable by any text editor
- Timestamps formatted as human-readable (e.g., "November 11, 2025 at 2:30 PM")
- Visual attachments handling (Decision: User Choice):
  - **`single-file`**: Images embedded as base64 data URIs in Markdown
  - **`folder`**: Separate folder with Markdown + image files (relative paths)
  - **Default**: `folder` (better usability, smaller Markdown file)

**Example**:
```json
{
  "exportTimestamp": "2025-11-11T15:00:00Z",
  "reflectionCount": 42,
  "dateRange": {
    "start": "2025-09-01T08:00:00Z",
    "end": "2025-11-11T14:30:00Z"
  },
  "format": "markdown",
  "content": "# My Reflections\n\n## November 11, 2025 at 2:30 PM\n\nToday I noticed...",
  "visualsIncluded": false,
  "exportFormat": "folder"
}
```

---

## Relationships

```
Reflection (1) ──┬─> (0..1) VisualAttachment
                 └─> (0..1) AIInteraction

UserPreferences (1) ──> (1) AI Provider Choice

ExportBundle (1) ──> (N) Reflection (references)
```

**Notes**:
- Reflections are self-contained (no foreign keys to other reflections)
- UserPreferences is singleton (one per user/installation)
- ExportBundle is ephemeral (generated on-demand, not persisted)

---

## Validation Schemas (Zod)

### Reflection Schema

```javascript
import { z } from 'zod';

const VisualAttachmentSchema = z.object({
  originalFilename: z.string().min(1),
  storedPath: z.string().min(1),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  sizeBytes: z.number().positive(),
  dimensions: z.object({
    width: z.number().positive(),
    height: z.number().positive()
  }).optional(),
  importTimestamp: z.string().datetime()
});

const AIInteractionSchema = z.object({
  model: z.string().min(1),
  provider: z.enum(['local', 'online']),
  prompt: z.string().min(1),
  response: z.string().min(1),
  timestamp: z.string().datetime(),
  systemPromptVersion: z.string().optional()
});

const ReflectionSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  mode: z.enum(['text', 'visual']),
  content: z.string().min(1).optional(),
  visualAttachment: VisualAttachmentSchema.optional(),
  aiInteraction: AIInteractionSchema.optional(),
  metadata: z.record(z.unknown()).optional()
}).refine(data => {
  // Conditional validation based on mode
  if (data.mode === 'text') return !!data.content && data.content.length > 0;
  if (data.mode === 'visual') return !!data.visualAttachment;
  return false;
}, {
  message: 'Invalid reflection: mode and content must match'
});
```

### UserPreferences Schema

```javascript
const UserPreferencesSchema = z.object({
  aiProvider: z.enum(['local', 'online']).default('local'),
  localModel: z.string().default('llama2').optional(),
  onlineModel: z.string().nullable().default(null),
  onlineProvider: z.enum(['openai', 'anthropic']).nullable().default(null),
  hasAcknowledgedOnlineWarning: z.boolean().default(false),
  language: z.string().length(2).default('en'),
  theme: z.enum(['calm-light', 'calm-dark']).default('calm-light')
}).refine(data => {
  // Cannot use online without acknowledging warning
  if (data.aiProvider === 'online') {
    return data.hasAcknowledgedOnlineWarning && !!data.onlineModel;
  }
  return true;
}, {
  message: 'Online AI requires acknowledged warning and selected model'
});
```

---

## Storage Structure

### File System Layout

```
data/
├── reflections/
│   ├── 2025-11/
│   │   ├── 550e8400-e29b-41d4-a716-446655440000.json  # Reflection
│   │   ├── 660f9511-f30c-52e5-b827-557766551111.json
│   │   └── 770g0622-g41d-63f6-c938-668877662222.json
│   ├── 2025-10/
│   │   └── 880h1733-h52e-74g7-d049-779988773333.json
│   └── index.json  # Optional: {month → count} mapping
├── visuals/
│   ├── 2025-11/
│   │   ├── 550e8400-e29b-41d4-a716-446655440000.jpg  # Copied on import
│   │   └── 660f9511-f30c-52e5-b827-557766551111.png
├── preferences.json  # UserPreferences (singleton)
└── exports/
    └── 2025-11-11-15-00-00-export.md  # User-triggered exports
```

**Rationale**:
- **Reflections** organized by year-month for performance (see research.md)
- **Visuals** stored alongside reflections, referenced by reflection ID
- **Preferences** single JSON file (singleton)
- **Exports** timestamped for user reference

---

## Next Steps

- **Phase 1 (continued)**: Generate API contracts in `/contracts/`
- **Phase 1 (continued)**: Generate quickstart.md for developers
- **Phase 2**: Generate tasks.md with implementation tasks
