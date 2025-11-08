# Laboratory of Life - Application Spec

## What We're Building

Build an application that helps people reflect on their daily experiences through AI-powered conversations. The application serves as a mirror for self-discovery, allowing users to express themselves through multiple interaction modes (chat, voice, forms) while maintaining complete privacy and control over their personal data.

## Core Experience

Users engage in reflective conversations about their day, thoughts, and experiences. The AI acts as a thoughtful mirror - reflecting back insights without judgment, diagnosis, or prescription. Every conversation is stored locally on the user's device, creating a permanent, searchable trace of their personal evolution over time.

### Multiple Forms of Expression

- **Chat Interface**: Primary mode for written reflection and conversation
- **Voice Input**: Speak naturally instead of typing
- **Images & Photos**: Attach images to reflections to capture visual moments from the day - photos of places, people, objects that are part of the memory. Users can add both images and text together in the same reflection
- **Structured Forms**: Optional guided prompts for specific reflection types (daily review, gratitude, decision-making)
- All modes create the same underlying data structure - just different entry points

### Calm, Judgment-Free Environment

- Clean, minimal interface with soft colors and generous whitespace
- No urgency signals: no notifications, no streaks, no "you haven't reflected today" reminders
- Conversational tone that's warm and curious, never prescriptive or diagnostic
- The AI never suggests therapy, diagnoses conditions, or acts as a medical tool

### Privacy & Data Control

- All personal reflection data stored locally in JSON files on the user's device
- Images stored locally alongside reflection data, never uploaded unless user explicitly enables cloud sync
- Optional: Users can place data folder in iCloud Drive for automatic sync across their own devices
- No user accounts required
- No analytics or telemetry sent to external servers
- AI model runs locally by default (Ollama), with explicit opt-in for cloud AI APIs

### Trace of Becoming

- All conversations preserved permanently in local storage
- Full-text search across all historical reflections
- Export any conversation or date range to Markdown (images exported alongside)
- Timeline view showing evolution of thoughts over weeks/months, with visual previews of attached images

### Reversibility

- Undo any action (edit or delete messages, rename conversations, move entries)
- Edit any past reflection - original and edited versions both preserved
- Delete conversations with confirmation (soft delete with recovery period)

### Accessibility

- Full keyboard navigation support
- Screen reader compatible
- WCAG 2.1 AA compliance minimum
- Works without mouse or voice input

### Simplicity

- Single-page application that loads instantly
- No setup wizards or configuration required on first launch
- Works offline after initial load
- No dependencies on external services for core functionality

## What This Is NOT

- **Not a medical or therapeutic tool**: No diagnosis, treatment suggestions, or crisis intervention
- **Not a productivity system**: No task management, goal tracking, or performance metrics
- **Not a social platform**: No sharing, communities, or social features
- **Not gamified**: No points, streaks, achievements, or competitive elements
- **Not cloud-based**: No required sign-up, no data uploaded to servers by default
- **Not ad-supported or data-mining**: No analytics collection, no behavioral tracking

## Quality Standards

### Performance
- Application loads in under 2 seconds on standard hardware
- UI interactions respond within 100ms
- Chat messages appear instantly (before AI response)
- Search returns results within 500ms for up to 10,000 entries

### Privacy
- No telemetry or analytics by default
- No network calls with personal data unless user explicitly enables cloud AI
- Local data files encrypted at rest (OS-level encryption)
- Clear indication when cloud AI is active vs local

### Tone
- Conversational language: "Let's explore that" not "Analyzing input..."
- Questions that open possibilities rather than close them
- No medical/therapeutic language
- No urgency or scarcity language

### Accessibility
- All features accessible via keyboard
- Screen reader announces all state changes
- Color is never the only indicator of state
- Text meets WCAG AA contrast requirements

## Success Criteria

The application is successful when:
1. A user can start reflecting within 10 seconds of first opening the app (no setup required)
2. A user can find a reflection from 6 months ago within 30 seconds using search
3. A user can export their entire reflection history to readable Markdown files with images preserved
4. A user can switch between typing, speaking, and adding images mid-conversation seamlessly
5. A user with keyboard-only navigation can access every feature (including image upload via file picker)
6. The application works identically whether using local AI or cloud AI (except response quality)
7. A user's data remains on their device and under their control at all times

## Technical Boundaries

### Must Use
- Local storage for personal data (JSON files)
- Local AI by default (Ollama)
- Modern web technologies (no IE11 support required)

### Must Support
- macOS initially (primary platform)
- Keyboard and mouse input
- Screen readers

### May Support Later
- Other desktop platforms (Windows, Linux)
- Mobile devices
- Touch input
- Voice output (AI speaking responses)
