# Feature Specification: Laboratory of Life — Product Vision

**Feature Branch**: `000-product-vision`  
**Created**: 2025-11-11  
**Status**: Draft  
**Input**: User description: "Laboratory of Life product vision: AI-assisted space for self-reflection, private by design, with calm UX and multiple expression modes"

## Purpose

This specification defines **WHAT** the Laboratory of Life product is and the product-specific requirements that all features must satisfy. It complements the Project Constitution (which defines **HOW** we build) by establishing the product principles, user experience standards, and quality expectations.

## Core Product Principles

These principles define the product's identity and must be honored in every feature:

### I. AI as Mirror, Not Guru

The system reflects and clarifies; it MUST NEVER instruct or diagnose.

**Requirements**:
- AI responses are reflective, non-directive, and use language that invites exploration
- No imperative language ("you should", "you must") or diagnostic terminology
- User chooses AI model (local via Ollama or online via API) with clear privacy implications
- Local models (Ollama) are the default; online models require explicit opt-in and warning
- When using online APIs, clearly state that reflection content leaves the device

**Rationale**: Preserves user autonomy and human dignity; the tool serves, not prescribes.

### II. Multiple Forms, One Doorway

Writing, metaphor, visual artifacts, or silence — all are valid entries to the self.

**Requirements**:
- Support diverse expression modes (text, visual import, silence/pause)
- Each mode receives equal design attention and accessibility

**Rationale**: Honors different ways of knowing and being; no single path is privileged.

### III. Calm Experience

Design for low cognitive load, gentle pace, and emotional safety.

**Requirements**:
- Minimize on-screen choices and decision points
- Use calm colors, readable contrast, and unhurried transitions
- No attention-grabbing animations, notifications, or time pressure

**Rationale**: Creates psychological safety required for authentic self-exploration.

### IV. Local-First, Private by Design

Data remains on the user's device unless intentionally exported.

**Requirements**:
- All user data stored locally (JSON or equivalent)
- No network calls transmit personal data without explicit user action
- Export and delete functions are always visible and simple

**Rationale**: Privacy is non-negotiable; trust is earned through transparency and control.

### V. Trace of Becoming

Every interaction may leave a meaningful reflection that shows growth over time.

**Requirements**:
- Interactions can persist as timestamped, retrievable records
- User controls visibility, retention, and deletion of all traces

**Rationale**: Personal growth becomes visible through accumulated reflections over time.

### VI. Reversibility

Actions should be easy to undo, delete, or export.

**Requirements**:
- All user actions are reversible (undo/delete)
- Data export to Markdown is always available
- Atomic writes prevent half-saved states

**Rationale**: Reduces anxiety; encourages experimentation; respects user sovereignty.

### VII. Accessibility and Simplicity

Clear language, visible focus, readable contrast, and keyboard navigation.

**Requirements**:
- Follow WCAG 2.1 Level AA guidelines minimum for color contrast and keyboard access
- Full keyboard navigation for all interactions
- Screen reader compatibility
- Plain language (avoid jargon, technical terms, or therapeutic vocabulary)

**Rationale**: Technology should be inclusive and dignified for all humans.

## Non-Goals

These are explicitly OUT OF SCOPE and MUST NOT be implemented:

- **MUST NOT**: Create accounts, analytics, or cloud synchronization systems
- **MUST NOT**: Implement medical, therapeutic, or diagnostic functions
- **MUST NOT**: Add gamification, scoring, streaks, or attention-grabbing features
- **MUST NOT**: Include social sharing or external tracking mechanisms

**Rationale**: These would undermine privacy, calm, and the non-directive nature of the tool.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Private Self-Reflection Session (Priority: P1)

A person opens the application to reflect on their day, write freely, and receive gentle mirroring from a local AI — all without their data leaving their device.

**Why this priority**: This is the core value proposition — a safe, private space for self-reflection.

**Independent Test**: Can be fully tested by writing a reflection, receiving AI response via local model, and verifying no network activity occurred.

**Acceptance Scenarios**:

1. **Given** user opens the application for the first time, **When** they view the interface, **Then** they see a calm, uncluttered space with clear indication of local-only processing
2. **Given** user writes a personal reflection, **When** they request AI feedback, **Then** they receive a reflective, non-directive response from local Ollama model
3. **Given** user completes a reflection session, **When** they check their data storage, **Then** all content is stored locally with no network calls made
4. **Given** user has written reflections, **When** they navigate away and return, **Then** their reflections persist and are retrievable

---

### User Story 2 - Multiple Expression Modes (Priority: P2)

A person wants to express themselves through different modalities — sometimes text, sometimes importing visual artifacts (photos, drawings, sketches), sometimes just pausing in silence.

**Why this priority**: Core differentiator that honors diverse ways of self-exploration.

**Independent Test**: Can be tested by creating entries using each mode independently (text entry, visual import, timed pause) and verifying equal treatment and accessibility.

**Acceptance Scenarios**:

1. **Given** user wants to express visually, **When** they import an image file, **Then** they can add visual reflections (photos, drawings, artwork) with the same calm UX as text mode
2. **Given** user needs silence, **When** they select pause/silence mode, **Then** they can mark a contemplative period without pressure to produce content
3. **Given** user has mixed-mode reflections, **When** they review history, **Then** all modes are presented with equal prominence and accessibility

---

### User Story 3 - Data Sovereignty and Export (Priority: P1)

A person wants complete control over their data — to export it, delete specific entries, or wipe everything — at any time, with zero friction.

**Why this priority**: Trust is earned through transparent control; this is non-negotiable for the product vision.

**Independent Test**: Can be tested by creating data, exporting to Markdown, selectively deleting entries, and performing full data wipe — all verifiable without technical knowledge.

**Acceptance Scenarios**:

1. **Given** user has reflections stored, **When** they click "Export All Data", **Then** they receive a well-formatted Markdown file with all their reflections
2. **Given** user wants to remove a specific reflection, **When** they select delete, **Then** the entry is permanently removed with confirmation dialog
3. **Given** user wants to start fresh, **When** they select "Delete All Data", **Then** all personal data is wiped with clear confirmation (2-step process)
4. **Given** user exports data, **When** they verify the export file, **Then** it includes timestamps in human-readable format and preserves all content

---

### User Story 4 - Choose AI Privacy Level (Priority: P2)

A person wants to decide whether to use local AI (complete privacy) or online AI (more capable but data leaves device) based on their current needs.

**Why this priority**: Respects user autonomy while enabling flexibility; balances privacy with capability.

**Independent Test**: Can be tested by switching between local and online models, verifying clear warnings for online use, and confirming different model behavior.

**Acceptance Scenarios**:

1. **Given** user is in settings, **When** they view AI model options, **Then** they see clear explanation of privacy implications for each choice
2. **Given** user selects online model for first time, **When** they confirm, **Then** they see explicit warning that reflections will be sent to external service
3. **Given** user has selected local model, **When** they request AI feedback, **Then** processing happens entirely offline with no network activity
4. **Given** user switches from online to local, **When** they use AI feedback, **Then** previous online model is no longer used

---

### User Story 5 - Accessible Keyboard Navigation (Priority: P1)

A person who uses keyboard-only navigation or screen readers can access all features with the same ease as mouse users.

**Why this priority**: Accessibility is core to the product vision, not an add-on.

**Independent Test**: Can be tested by navigating entire application using only keyboard, verifying all actions are accessible and announced properly to screen readers.

**Acceptance Scenarios**:

1. **Given** user navigates with keyboard only, **When** they use Tab key, **Then** focus moves logically through all interactive elements with visible indication
2. **Given** user relies on screen reader, **When** they navigate the application, **Then** all content and controls are properly announced with meaningful labels
3. **Given** user wants to write a reflection, **When** they use keyboard shortcuts, **Then** all primary actions (save, delete, AI feedback) are accessible
4. **Given** user navigates complex UI elements, **When** they use arrow keys and Enter, **Then** all interactions work without requiring mouse

---

### Edge Cases

- What happens when user writes very long reflections (10,000+ words)?
- How does system handle corrupted local storage or missing data files?
- What happens when local AI model (Ollama) is not available or fails?
- How does system behave when user switches AI models mid-reflection?
- What happens to data export when user has mixed content types (text, imported images, silence markers)?
- How does system handle rapid save/delete actions (race conditions)?
- What happens when user's device runs low on storage during a reflection session?
- How does system maintain calm UX when errors occur (network failure, disk full, etc.)?
- What happens when user imports very large image files or unsupported file formats?
- How does system handle image file references when images are moved or deleted from original location?

## Requirements *(mandatory)*

### Functional Requirements — Core Experience

- **FR-001**: System MUST provide a calm, uncluttered interface with minimal on-screen choices at any given time
- **FR-002**: System MUST support text-based reflections with autosave and manual save options
- **FR-003**: System MUST support visual expression mode by allowing users to import image files (photos, drawings, sketches, artwork) as reflections
- **FR-004**: System MUST support silence/pause mode for marking contemplative periods without content creation
- **FR-005**: System MUST display all reflections in chronological order with human-readable timestamps
- **FR-006**: System MUST use calm color palette with WCAG 2.1 Level AA contrast ratios minimum
- **FR-007**: System MUST NOT include animations that grab attention, notifications, or time pressure elements

### Functional Requirements — AI Mirror

- **FR-008**: System MUST integrate local AI model (Ollama) as default for reflective feedback
- **FR-009**: System MUST allow user to opt-in to online AI models with explicit privacy warning before first use
- **FR-010**: System MUST generate reflective, non-directive responses using carefully crafted system prompts
- **FR-011**: System MUST NEVER use imperative language ("you should", "you must") in AI responses
- **FR-012**: System MUST NEVER attempt diagnosis or therapeutic advice in AI responses
- **FR-013**: System MUST clearly indicate when AI processing is happening (local vs. online)

### Functional Requirements — Privacy & Data

- **FR-014**: System MUST store all user reflections locally in JSON or equivalent structured format
- **FR-015**: System MUST perform atomic writes to prevent data corruption or half-saved states
- **FR-016**: System MUST provide "Export All Data" function that generates well-formatted Markdown file
- **FR-017**: System MUST provide "Delete Specific Entry" function with single confirmation
- **FR-018**: System MUST provide "Delete All Data" function with two-step confirmation process
- **FR-019**: System MUST NOT make network calls for user data without explicit user-initiated action
- **FR-020**: System MUST display privacy status clearly (local-only vs. online AI active)
- **FR-021**: System MUST support data export with ISO timestamps and human-friendly display format
- **FR-022**: System MUST allow user content in any language without restriction

### Functional Requirements — Accessibility

- **FR-023**: System MUST support full keyboard navigation for all features and interactions
- **FR-024**: System MUST provide visible focus indicators for keyboard navigation (WCAG 2.1 Level AA)
- **FR-025**: System MUST provide proper ARIA labels and roles for screen reader compatibility
- **FR-026**: System MUST use plain language throughout interface (no jargon, technical terms, or therapeutic vocabulary)
- **FR-027**: System MUST maintain logical tab order through all interactive elements
- **FR-028**: System MUST support standard keyboard shortcuts (Tab, Enter, Escape, Arrow keys)

### Functional Requirements — Error Handling & Safety

- **FR-029**: System MUST display gentle, solution-focused error messages that maintain calm UX
- **FR-030**: System MUST handle missing or corrupted data files gracefully with recovery options
- **FR-031**: System MUST detect when local AI (Ollama) is unavailable and offer clear alternatives
- **FR-032**: System MUST detect crisis keywords (harm, suicide, emergency) and display static crisis resources (phone numbers, text lines) without tracking
- **FR-033**: System MUST handle low storage scenarios with advance warning before writes fail
- **FR-034**: System MUST validate data integrity on read and offer recovery/export if corruption detected

### Functional Requirements — Performance

- **FR-035**: System MUST load application interface in under 2 seconds on modest hardware (5-year-old laptop)
- **FR-036**: System MUST respond to UI interactions in under 100ms (perceived as immediate)
- **FR-037**: System MUST handle large reflection histories (1000+ entries) without performance degradation

### Key Entities

- **Reflection Entry**: A single unit of self-expression with timestamp, content (text/imported image reference/silence marker), mode type, optional AI interaction, and metadata
- **Visual Attachment**: Reference to imported image file with original filename, file path/copy, dimensions, and import timestamp
- **AI Interaction**: A request-response pair between user and AI mirror, including model type used (local/online), system prompt version, and response content
- **Export Bundle**: Complete data export package including all reflections, AI interactions, timestamps, metadata, and referenced visual files in Markdown format
- **User Preferences**: Settings controlling AI model choice, privacy level, UI preferences, and accessibility options (stored locally)

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Privacy & Trust**:
- **SC-001**: Users can verify through network monitoring that no personal data leaves device in local-only mode
- **SC-002**: 100% of user actions are reversible (undo/delete) with clear confirmation dialogs
- **SC-003**: Users can export all their data to Markdown in under 10 seconds for typical usage (100 entries)

**Calm Experience**:
- **SC-004**: Interface presents maximum of 3 primary choices on screen at any given time
- **SC-005**: Application maintains calm visual design with zero attention-grabbing animations or notifications
- **SC-006**: Users report feeling "peaceful" or "calm" when using the application (qualitative feedback)

**Accessibility**:
- **SC-007**: 100% of features are accessible via keyboard-only navigation
- **SC-008**: Application passes automated WCAG 2.1 Level AA accessibility checks
- **SC-009**: Screen reader users can complete full reflection session (write, save, review) without assistance

**AI Mirror Quality**:
- **SC-010**: 95%+ of AI responses use reflective, non-directive language (validated through prompt analysis)
- **SC-011**: Zero instances of imperative language ("should", "must") in AI responses across test cases
- **SC-012**: Users report AI responses feel "curious" and "non-judgmental" (qualitative feedback)

**Multiple Expression Modes**:
- **SC-013**: Users can create reflections in text, visual, and silence modes with equal ease (measured by completion rate)
- **SC-014**: Each expression mode receives equal design attention (measured by feature parity checklist)

**Technical Performance**:
- **SC-015**: Application loads in under 2 seconds on 5-year-old hardware
- **SC-016**: UI interactions respond in under 100ms (perceived as immediate)
- **SC-017**: System handles 1000+ reflection entries without performance degradation
- **SC-018**: Zero data loss events due to save failures or corruption (atomic writes validated)

**Data Sovereignty**:
- **SC-019**: Export function produces valid, well-formatted Markdown readable by any text editor
- **SC-020**: Delete operations are immediate and permanent (verified through data inspection)
- **SC-021**: Users can understand and exercise all data controls without technical documentation

## Ethical & Safety Rules

These rules must be honored in every feature and design decision:

**MUST NOT**: The system diagnoses, prescribes, or replaces human contact

**MUST**: If text indicates crisis (keywords: harm, suicide, emergency), display static, non-tracking crisis resources (phone numbers, text lines)

**MUST NOT**: Use "should" or "must" language in prompts presented to users

**MUST**: Every design decision preserves human dignity and autonomy

**Rationale**: The tool supports but never replaces human connection, professional help, or self-determination.

## Quality Standards by Domain

### Privacy Standards
- No telemetry, tracking, or analytics of any kind
- Clear, accessible delete and export options always visible
- No external network requests except user-initiated exports or explicitly chosen online AI
- Data encryption considerations for future (user-controlled, optional)

### Performance Standards
- Application loads instantly on modest hardware (< 2 seconds on 5-year-old laptop)
- UI interactions feel immediate (< 100ms response time)
- Local writes are atomic; data cannot be half-saved
- Data corruption scenarios have recovery mechanisms

### Tone Standards
- Language is calm, reflective, and non-directive throughout UI
- Error messages are gentle and solution-focused
- No language that judges, prescribes, or diagnoses
- Plain language without jargon or technical terms

### Data Standards
- Local JSON or equivalent for storage
- Timestamps in ISO format (YYYY-MM-DDTHH:mm:ssZ) with human-friendly display
- User content may be in any language (no language restrictions)
- Atomic writes with validation on read

## Assumptions

1. **Hardware**: Target devices are personal computers (Mac, Windows, Linux) with modest specs (5+ years old)
2. **Local AI**: Ollama is the primary local AI provider; alternatives may be considered later
3. **Storage**: Users will have sufficient local storage for typical usage (estimated 100MB for 1000 entries)
4. **Internet**: Application works fully offline except for optional online AI models
5. **Language**: UI is English; user reflections can be any language
6. **Scale**: Designed for single-user, personal use (not multi-user or collaborative)
7. **Version 1 Scope**: Text mode and local AI are minimum viable product; visual import and silence modes in future iterations
8. **Visual Storage**: Imported images will be copied to application's local storage to maintain data sovereignty and prevent broken references

## Dependencies

- **Ollama**: Local AI model provider (must be installable and runnable on target platforms)
- **File System**: Reliable local file system access for data persistence
- **Web Technologies**: Modern browser capabilities or equivalent (Electron, Tauri, etc. — implementation detail)
- **Crisis Resources**: Curated list of crisis hotlines and text services (static, non-tracking)

## Open Questions

*None at this time. This is the foundational product vision that guides all other features.*
