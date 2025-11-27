# Feature Specification: Rich Text Editor with Markdown Support

**Feature Branch**: `001-rich-text-editor`  
**Created**: November 27, 2025  
**Status**: Draft  
**Input**: User description: "Add rich text editing with Markdown support, formatting toolbar, and AI-powered rephrasing to help users write clearer, more structured reflections with a calm editing experience"

## Purpose

Enhance the reflection writing experience by providing rich text editing capabilities with Markdown support, a calm formatting toolbar, and AI-powered rephrasing. This empowers users to write more structured, expressive reflections while maintaining the application's core principle of calm, distraction-free UX.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Markdown Editing with Live Preview (Priority: P1)

Users can write reflections using Markdown syntax and see a live preview of the formatted output, allowing them to structure their thoughts with headings, lists, emphasis, and links without leaving the writing flow.

**Why this priority**: Core functionality that enables structured writing. Without this, users cannot benefit from any formatting features. This alone provides immediate value by supporting Markdown-savvy users.

**Independent Test**: Create a new reflection, type Markdown syntax (headings, lists, bold, italic), toggle between edit and preview modes, verify formatting renders correctly, save reflection and confirm Markdown is preserved.

**Acceptance Scenarios**:

1. **Given** user is composing a new reflection, **When** they type `# Heading` and press Enter, **Then** the preview shows a formatted heading
2. **Given** user types `**bold text**`, **When** they view preview, **Then** text appears bold
3. **Given** user types `- Item 1\n- Item 2`, **When** they view preview, **Then** a bulleted list appears
4. **Given** user has Markdown content, **When** they toggle between edit and preview modes, **Then** transition is smooth (< 200ms) with no content loss
5. **Given** user saves a reflection with Markdown, **When** they view it later in history, **Then** Markdown is preserved and renders correctly

---

### User Story 2 - Formatting Toolbar for Non-Markdown Users (Priority: P2)

Users unfamiliar with Markdown can format text using a calm, minimalist toolbar with buttons for common formatting (headings, bold, italic, lists, links), making rich text editing accessible to everyone.

**Why this priority**: Expands accessibility to non-technical users. Can be implemented independently after P1 by adding toolbar UI that inserts Markdown syntax. Delivers value even if AI rephrasing (P3) isn't implemented yet.

**Independent Test**: Open reflection editor, click toolbar buttons (Bold, Italic, Heading), verify Markdown syntax is inserted at cursor position, type text, verify formatting appears in preview, save and confirm persistence.

**Acceptance Scenarios**:

1. **Given** user has text selected, **When** they click Bold button, **Then** text is wrapped with `**` markers and appears bold in preview
2. **Given** cursor is at empty line, **When** user clicks "Heading 1" button, **Then** `# ` is inserted and cursor is positioned after it
3. **Given** cursor is in text, **When** user clicks List button, **Then** line starts with `- ` and becomes a list item
4. **Given** user has text selected, **When** they click Link button, **Then** a dialog appears for URL input, and `[text](url)` is inserted
5. **Given** user is typing, **When** they use keyboard shortcuts (Cmd+B for bold, Cmd+I for italic), **Then** formatting is applied without mouse interaction

---

### User Story 3 - AI-Powered Text Rephrasing (Priority: P3)

Users can select text and request AI to rephrase it for clarity, positivity, or constructiveness, helping them express difficult thoughts in healthier ways while maintaining their authentic voice.

**Why this priority**: Enhancement feature that builds on P1 and P2. Requires existing editor to be functional. Provides significant value for users struggling to articulate emotions but not essential for basic rich text editing.

**Independent Test**: Write a reflection with negative phrasing, select problematic text, click "Rephrase" button, choose rephrasing style (clearer, more positive, more constructive), verify AI suggests alternatives, accept or reject suggestions, save reflection.

**Acceptance Scenarios**:

1. **Given** user has text selected, **When** they click "Rephrase" button, **Then** a calm dialog appears with rephrasing options (Clearer, More Positive, More Constructive)
2. **Given** user chooses "More Positive", **When** AI processes request, **Then** 2-3 alternative phrasings are suggested within 3 seconds
3. **Given** AI suggests rephrasing, **When** user hovers over suggestion, **Then** preview shows how it would appear in context
4. **Given** user accepts a suggestion, **When** they click Accept, **Then** original text is replaced smoothly with subtle animation
5. **Given** user rejects suggestions, **When** they click Cancel or press Escape, **Then** dialog closes and original text remains unchanged
6. **Given** rephrasing request fails (AI unavailable), **When** error occurs, **Then** gentle error message appears: "AI service unavailable. Your original text is preserved."

---

### Edge Cases

- What happens when user types very long Markdown document (10,000+ words) - does preview still render smoothly?
- How does system handle invalid Markdown syntax (unclosed emphasis markers, broken links)?
- What happens when AI rephrasing service is unavailable or times out?
- How does editor behave when user pastes rich text from external source (Word, web page)?
- What happens when user switches between edit and preview rapidly (within 100ms)?
- How does system handle Markdown in existing reflections created before this feature?
- What happens when user selects text spanning multiple formatting elements for rephrasing?
- How does editor handle undo/redo with both manual edits and AI-suggested changes?

## Requirements *(mandatory)*

### Functional Requirements - Editor Core (P1)

- **FR-001**: System MUST support standard Markdown syntax including headings (h1-h6), bold, italic, lists (ordered and unordered), links, blockquotes, and code blocks
- **FR-002**: Editor MUST provide live preview mode that updates within 200ms of typing pause
- **FR-003**: Users MUST be able to toggle between edit mode (Markdown source) and preview mode (rendered HTML) via button or keyboard shortcut (Cmd+P / Ctrl+P)
- **FR-004**: System MUST preserve Markdown syntax in stored reflections (store as plain text with Markdown, not HTML)
- **FR-005**: Preview rendering MUST sanitize HTML to prevent XSS attacks from malicious Markdown
- **FR-006**: Editor MUST maintain cursor position when switching between edit and preview modes
- **FR-007**: Editor MUST support undo/redo functionality (Cmd+Z / Ctrl+Z) for at least 50 edit operations
- **FR-008**: System MUST handle existing plain text reflections gracefully (display as-is in both edit and preview)

### Functional Requirements - Formatting Toolbar (P2)

- **FR-009**: Toolbar MUST include buttons for: Heading 1-3, Bold, Italic, Unordered List, Ordered List, Link, Blockquote
- **FR-010**: Toolbar buttons MUST be disabled when not applicable (e.g., Link button disabled when no text selected)
- **FR-011**: Clicking formatting button MUST insert Markdown syntax at cursor position or wrap selected text
- **FR-012**: Toolbar MUST support keyboard shortcuts matching common editors (Cmd/Ctrl + B for bold, I for italic, K for link)
- **FR-013**: Toolbar MUST use calm design: subtle colors, no animations except gentle hover states, icons with text labels for clarity
- **FR-014**: Toolbar MUST be keyboard navigable (Tab to focus buttons, Enter to activate) per FR-022 from product vision
- **FR-015**: Link button MUST open a calm dialog for URL input with preview of link syntax
- **FR-016**: Toolbar MUST show visual feedback when formatting is active (e.g., Bold button highlighted when cursor is in bold text)

### Functional Requirements - AI Rephrasing (P3)

- **FR-017**: Users MUST be able to select text and access "Rephrase" option via toolbar button or context menu
- **FR-018**: System MUST offer 3 rephrasing styles: "Clearer" (simplify complex language), "More Positive" (reframe negative tone), "More Constructive" (focus on growth/learning)
- **FR-019**: AI MUST generate 2-3 alternative phrasings for each request within 5 seconds
- **FR-020**: Rephrasing dialog MUST show original text and suggestions side-by-side for easy comparison
- **FR-021**: Users MUST be able to accept or reject suggestions with clear Cancel option
- **FR-022**: System MUST use local AI (Ollama) as default for rephrasing, with fallback to user's selected online AI if local unavailable
- **FR-023**: Rephrasing MUST preserve Markdown formatting in selected text (don't break bold, links, etc.)
- **FR-024**: System MUST handle rephrasing failures gracefully with message: "AI service unavailable. Your original text is preserved."
- **FR-025**: Users MUST be able to undo accepted AI suggestions via standard undo (Cmd+Z)
- **FR-026**: System MUST NOT send entire reflection to AI, only selected text (privacy requirement)

### Functional Requirements - UX Consistency

- **FR-027**: Editor MUST maintain calm UX principles: no attention-grabbing animations, gentle transitions (max 200ms), calm color palette
- **FR-028**: All new UI elements MUST follow WCAG 2.1 Level AA accessibility standards (keyboard navigation, screen reader support, focus indicators)
- **FR-029**: Editor MUST work seamlessly with existing AI mirror and export features
- **FR-030**: Markdown rendering MUST match calm visual style of existing text reflections (same fonts, spacing, colors)

### Key Entities

- **FormattedReflection**: A reflection with Markdown content
  - Contains: same fields as existing Reflection entity
  - content: Stored as plain text with Markdown syntax (e.g., "# My Day\n\nIt was **great**!")
  - No new fields needed - uses existing Reflection schema
  
- **RephrasingRequest**: An AI request for text improvement
  - originalText: The text user wants rephrased
  - style: "clearer" | "more-positive" | "more-constructive"
  - context: Optional surrounding text for context (max 200 characters before/after)
  
- **RephrasingSuggestion**: AI-generated alternative phrasing
  - originalText: What user selected
  - suggestedText: AI's alternative
  - style: Which rephrasing style was used
  - timestamp: When suggestion was generated

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Basic Functionality (P1)**:
- **SC-001**: Users can write reflections with Markdown formatting and see live preview with update time under 200ms
- **SC-002**: 100% of Markdown syntax (headings, bold, italic, lists, links, blockquotes, code) renders correctly in preview
- **SC-003**: Users can switch between edit and preview modes in under 200ms with no content loss
- **SC-004**: Existing plain text reflections display correctly without requiring migration

**Formatting Toolbar (P2)**:
- **SC-005**: 90% of users can apply basic formatting (bold, italic, heading, list) without knowing Markdown syntax
- **SC-006**: Toolbar operations (button click to Markdown insertion) complete in under 100ms
- **SC-007**: All toolbar buttons are keyboard accessible and support standard shortcuts (Cmd+B, Cmd+I, Cmd+K)
- **SC-008**: Users report formatting toolbar is easy to understand (target: 80% positive feedback)

**AI Rephrasing (P3)**:
- **SC-009**: AI generates 2-3 rephrasing suggestions within 5 seconds for typical text selections (50-200 words)
- **SC-010**: Users find AI suggestions helpful in at least 60% of rephrasing attempts
- **SC-011**: Rephrasing preserves Markdown formatting in 100% of cases
- **SC-012**: System gracefully handles AI service unavailability with clear user feedback

**UX & Accessibility (All Priorities)**:
- **SC-013**: All new UI elements pass WCAG 2.1 Level AA accessibility checks (color contrast, keyboard navigation, screen reader support)
- **SC-014**: Editor maintains calm UX principles with no attention-grabbing animations or distracting transitions
- **SC-015**: Users report editor feels "calm" and "focused" (target: 85% positive feedback)
- **SC-016**: Editor performance remains smooth with reflections up to 10,000 words

**Integration (All Priorities)**:
- **SC-017**: Markdown reflections export correctly to Markdown files with formatting preserved
- **SC-018**: AI mirror works with Markdown content (analyzes rendered text, not syntax)
- **SC-019**: Visual and text reflections maintain equal prominence (Markdown doesn't overshadow simple text)

## Assumptions

1. **Markdown Library**: Use a well-tested, security-audited Markdown parsing library (e.g., marked.js) that handles sanitization
2. **AI Integration**: Rephrasing uses existing AIMirrorService infrastructure with new system prompts for each style
3. **Storage Format**: Reflections remain stored as plain text; Markdown is just a formatting convention, not a separate mode
4. **Editor Component**: Build on existing ReflectionEditor component, extending rather than replacing it
5. **Toolbar Design**: Follow existing toolbar patterns from Visual mode (ImageImport) for consistency
6. **Performance**: Preview rendering uses debouncing (200ms delay after typing stops) to avoid performance issues
7. **Browser Support**: Target modern browsers with ES6 support (same as existing app)
8. **Markdown Scope**: Support CommonMark specification (standard Markdown) without extended features like tables or footnotes initially

## Non-Goals

These are explicitly OUT OF SCOPE for this feature:

- **NOT INCLUDED**: WYSIWYG (What You See Is What You Get) editor that hides Markdown syntax entirely
- **NOT INCLUDED**: Extended Markdown features (tables, footnotes, task lists, math equations)
- **NOT INCLUDED**: Collaborative editing or real-time sync between devices
- **NOT INCLUDED**: Markdown templates or snippets (may be future enhancement)
- **NOT INCLUDED**: AI grammar correction or spell-checking (different from rephrasing)
- **NOT INCLUDED**: Syntax highlighting in edit mode (keep edit mode clean and calm)
- **NOT INCLUDED**: Custom themes or styling for Markdown rendering (use app's existing calm style)
- **NOT INCLUDED**: Import/export of other formats (HTML, PDF, Word) - Markdown only
