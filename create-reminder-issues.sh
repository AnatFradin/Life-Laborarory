#!/bin/bash

# Script to create GitHub issues from reminder-for-me.md
set -e

REPO="AnatFradin/Life-Laborarory"

echo "Creating GitHub issues from reminder-for-me.md..."
echo ""

# Issue: Markdown editor with preview
gh issue create --repo "$REPO" \
  --title "Add Markdown editor with live preview toggle" \
  --label "enhancement,markdown,ui-ux" \
  --body "## Description
Add Markdown editor that can switch between editing mode and preview mode.

## Tasks
1. Implement Markdown editor component
2. Add preview toggle button
3. Implement live preview rendering
4. Add unit tests for editor component
5. Add E2E tests for editing workflow

## Acceptance Criteria
- [ ] Toggle between edit and preview modes
- [ ] Markdown syntax highlighting
- [ ] Live preview rendering
- [ ] Smooth transitions between modes
- [ ] Tests for all functionality

## Related
- Spec: 001-rich-text-editor (already partially implemented)"

echo "✅ Created issue: Markdown editor with preview"

# Issue: Markdown editing tools
gh issue create --repo "$REPO" \
  --title "Add Markdown editing toolbar (headings, bold, italic, lists)" \
  --label "enhancement,markdown,ui-ux" \
  --body "## Description
Add toolbar with formatting tools to help edit Markdown content (headings, bold, italic, lists, etc.).

## Tasks
1. Design toolbar UI
2. Implement formatting buttons
3. Add keyboard shortcuts
4. Handle text selection and insertion
5. Add unit tests for toolbar
6. Add E2E tests for formatting

## Acceptance Criteria
- [ ] Toolbar with common formatting buttons
- [ ] Keyboard shortcuts (Cmd+B, Cmd+I, etc.)
- [ ] Works with text selection
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Tests for all tools

## Related
- Spec: 001-rich-text-editor (already partially implemented)"

echo "✅ Created issue: Markdown editing tools"

# Issue: Neurobalance scale
gh issue create --repo "$REPO" \
  --title "Add Neurobalance scale (шкала нейробаланса)" \
  --label "enhancement,neurobalance" \
  --body "## Description
Add Neurobalance scale feature to track emotional and mental state.

## Tasks
1. Define Neurobalance data model
2. Create UI component for scale input
3. Store Neurobalance data with reflections
4. Add unit tests for data model
5. Add component tests
6. Update export functionality

## Acceptance Criteria
- [ ] Neurobalance scale UI component
- [ ] Data stored with each reflection
- [ ] Accessible and user-friendly
- [ ] Tests for all functionality
- [ ] Documentation updated

## Prerequisites
- Define what Neurobalance scale measures
- Design scale UI (1-10, emojis, etc.)"

echo "✅ Created issue: Neurobalance scale"

# Issue: Calendar view for reflections
gh issue create --repo "$REPO" \
  --title "Add calendar view for reflections" \
  --label "enhancement,calendar,ui-ux" \
  --body "## Description
Add calendar view to see reflections organized by date.

## Tasks
1. Choose/implement calendar component
2. Integrate with reflection data
3. Show reflection indicators on calendar
4. Navigate to reflection on date click
5. Add unit tests
6. Add E2E tests

## Acceptance Criteria
- [ ] Calendar view showing reflection dates
- [ ] Visual indicators for days with reflections
- [ ] Click date to view/edit reflection
- [ ] Month/year navigation
- [ ] Responsive design
- [ ] Tests for all functionality"

echo "✅ Created issue: Calendar view"

# Issue: Streak calendar
gh issue create --repo "$REPO" \
  --title "Add streak calendar to track reflection consistency" \
  --label "enhancement,calendar,statistics" \
  --body "## Description
Add calendar view showing reflection streaks and consistency (how many reflections were done / how many days were reflected on).

## Tasks
1. Calculate streak statistics
2. Design streak visualization
3. Implement calendar with streak indicators
4. Add statistics display
5. Add unit tests for calculations
6. Add component tests

## Acceptance Criteria
- [ ] Calendar showing reflection activity
- [ ] Current streak count displayed
- [ ] Longest streak tracked
- [ ] Visual feedback for streaks
- [ ] Tests for streak calculations"

echo "✅ Created issue: Streak calendar"

# Issue: Tags and filtering
gh issue create --repo "$REPO" \
  --title "Add tags to reflections and filtering" \
  --label "enhancement,tags" \
  --body "## Description
Add ability to tag reflections and filter by tags.

## Tasks
1. Update data model to support tags
2. Create tag input component
3. Implement tag storage
4. Add filtering UI
5. Add search/filter functionality
6. Add unit tests
7. Add E2E tests

## Acceptance Criteria
- [ ] Add/remove tags on reflections
- [ ] Tag autocomplete suggestions
- [ ] Filter reflections by tags
- [ ] Tag management (rename, delete)
- [ ] Tests for all functionality

## Prerequisites
- Update Reflection entity model
- Migrate existing data"

echo "✅ Created issue: Tags and filtering"

# Issue: Neurobalance trends
gh issue create --repo "$REPO" \
  --title "Add Neurobalance trends report over time" \
  --label "enhancement,neurobalance,statistics" \
  --body "## Description
Add report showing Neurobalance trends over time with visualization.

## Tasks
1. Design trend visualization (charts)
2. Calculate statistics from Neurobalance data
3. Implement trend view
4. Add filtering by date range
5. Add unit tests
6. Add component tests

## Acceptance Criteria
- [ ] Chart showing Neurobalance over time
- [ ] Statistics (average, trends, patterns)
- [ ] Filter by date range
- [ ] Export trend data
- [ ] Tests for calculations and visualization

## Prerequisites
- Neurobalance scale feature (issue #TBD)
- Historical Neurobalance data"

echo "✅ Created issue: Neurobalance trends"

# Issue: Data storage path configuration
gh issue create --repo "$REPO" \
  --title "Add user-configurable data storage path" \
  --label "enhancement,storage" \
  --body "## Description
Ask user for data storage path on first run. Define default path in user home directory.

## Tasks
1. Create settings for storage path
2. Implement path selection dialog
3. Set default path in user home
4. Migrate existing data if needed
5. Add validation and error handling
6. Add unit tests
7. Add E2E tests

## Acceptance Criteria
- [ ] First-run wizard for path selection
- [ ] Default path in user home directory
- [ ] Settings to change path later
- [ ] Data migration support
- [ ] Validation (writable, sufficient space)
- [ ] Tests for all scenarios

## Related
- Partially implemented: iCloud/local storage switching exists"

echo "✅ Created issue: Data storage path"

# Issue: Tools tab
gh issue create --repo "$REPO" \
  --title "Add tab with personal development tools collection" \
  --label "enhancement,feature-request" \
  --body "## Description
Add tab with all known tools (how to manage stress, improve focus, etc.) including:
- Lengold collection (media files - play them, files, presentations)
- Quotes collection
- Other resources

## Tasks
1. Design tools tab UI
2. Create tool categories
3. Implement tool library
4. Add media player for audio/video
5. Add document viewer
6. Add search/filter
7. Add unit tests
8. Add E2E tests

## Acceptance Criteria
- [ ] Tools tab in main navigation
- [ ] Organized categories
- [ ] Media playback support
- [ ] Document viewing
- [ ] Search and filter
- [ ] Tests for all functionality

## Prerequisites
- Define tool data model
- Collect and organize resources"

echo "✅ Created issue: Tools tab"

# Issue: AI personal coach personas
gh issue create --repo "$REPO" \
  --title "Create additional AI personal coach personas" \
  --label "enhancement,ai,feature-request" \
  --body "## Description
Create additional AI personal coach personas:
- Franklin
- Baal Sulam
- Stoic (already exists)
- Мужицкая
- Others

## Tasks
1. Research each persona's philosophy/style
2. Write coaching prompts for each
3. Add to persona collection
4. Create tests
5. Update documentation

## Acceptance Criteria
- [ ] At least 4 new personas added
- [ ] Each has complete prompt/description
- [ ] Consistent with existing personas
- [ ] Tests for persona loading
- [ ] Documentation updated

## Related
- Spec: 002-dynamic-coach-prompts
- Current personas: Stoic, Compassionate Listener, etc."

echo "✅ Created issue: AI coach personas"

# Issue: UI improvements for calm reflection
gh issue create --repo "$REPO" \
  --title "Make UI more inviting to calm and reflection" \
  --label "enhancement,ui-ux,design" \
  --body "## Description
Improve UI to be more inviting, calming, and conducive to reflection.

## Tasks
1. Review current UI/UX
2. Research calm design patterns
3. Update color palette
4. Improve spacing and typography
5. Add calming animations
6. Implement changes
7. User testing

## Acceptance Criteria
- [ ] Warm, calming color scheme
- [ ] Generous spacing
- [ ] Smooth transitions
- [ ] No aggressive elements
- [ ] Maintains accessibility
- [ ] User feedback positive

## Related
- UI-UX-IMPROVEMENTS.md (already has many suggestions)
- Some improvements already implemented"

echo "✅ Created issue: Calm UI improvements"

# Issue: Dark mode
gh issue create --repo "$REPO" \
  --title "Add dark mode theme" \
  --label "enhancement,ui-ux,design" \
  --body "## Description
Add dark mode theme with auto-switching based on system preference.

## Tasks
1. Design dark mode palette
2. Implement theme switching
3. Add theme toggle UI
4. Persist user preference
5. Auto-detect system preference
6. Update all components
7. Add tests

## Acceptance Criteria
- [ ] Complete dark mode theme
- [ ] Manual toggle in settings
- [ ] Auto-detect system preference
- [ ] Smooth theme transitions
- [ ] All components support both themes
- [ ] Tests for theme switching"

echo "✅ Created issue: Dark mode"

# Issue: Reflection statistics
gh issue create --repo "$REPO" \
  --title "Add reflection statistics dashboard" \
  --label "enhancement,statistics" \
  --body "## Description
Add statistics about reflections (count, average length, trends) including reference to Neurobalance state.

## Tasks
1. Design statistics dashboard
2. Calculate statistics
3. Create visualization components
4. Add filtering options
5. Add unit tests
6. Add component tests

## Acceptance Criteria
- [ ] Total reflections count
- [ ] Average reflection length
- [ ] Activity trends over time
- [ ] Neurobalance statistics
- [ ] Visual charts/graphs
- [ ] Filter by date range
- [ ] Tests for all calculations"

echo "✅ Created issue: Statistics dashboard"

# Issue: Propose tools based on content
gh issue create --repo "$REPO" \
  --title "Propose tools based on reflection content and Neurobalance" \
  --label "enhancement,ai,neurobalance" \
  --body "## Description
Analyze reflection content and Neurobalance state to propose relevant tools (stress management, focus improvement, etc.).

## Tasks
1. Implement content analysis
2. Create recommendation engine
3. Build UI for suggestions
4. Add unit tests
5. Add integration tests

## Acceptance Criteria
- [ ] Analyze reflection content
- [ ] Consider Neurobalance state
- [ ] Suggest relevant tools
- [ ] Explain why tools are suggested
- [ ] Tests for recommendation logic

## Prerequisites
- Tools collection (issue #TBD)
- Neurobalance scale (issue #TBD)
- AI analysis capability"

echo "✅ Created issue: Tool recommendations"

# Issue: Voice input
gh issue create --repo "$REPO" \
  --title "Add voice input for reflections" \
  --label "enhancement,voice,accessibility" \
  --body "## Description
Add voice input capability for creating reflections using speech-to-text.

## Tasks
1. Research speech-to-text APIs
2. Implement voice recording
3. Add speech-to-text conversion
4. Create UI controls
5. Handle errors and permissions
6. Add tests

## Acceptance Criteria
- [ ] Record voice input
- [ ] Convert speech to text
- [ ] Support multiple languages
- [ ] Handle permissions properly
- [ ] Good error handling
- [ ] Tests for voice features

## Technical Considerations
- Use Web Speech API or cloud service
- Privacy: prefer local processing"

echo "✅ Created issue: Voice input"

# Issue: Daily reminder
gh issue create --repo "$REPO" \
  --title "Add daily reflection reminder at user-specified time" \
  --label "enhancement,feature-request" \
  --body "## Description
Send reminder to reflect every day at user-specified time.

## Tasks
1. Implement notification system
2. Add time picker in settings
3. Schedule daily reminders
4. Handle permissions
5. Add tests

## Acceptance Criteria
- [ ] User can set reminder time
- [ ] Daily notification at specified time
- [ ] Request notification permission
- [ ] Enable/disable reminders
- [ ] Tests for reminder scheduling

## Technical Considerations
- Use Notification API
- Consider desktop vs mobile
- Respect do-not-disturb settings"

echo "✅ Created issue: Daily reminder"

# Issue: Period summaries
gh issue create --repo "$REPO" \
  --title "Generate weekly/monthly/yearly reflection summaries" \
  --label "enhancement,ai,statistics" \
  --body "## Description
Generate AI-powered summaries of reflections for week/month/year periods.

## Tasks
1. Implement period selection
2. Aggregate reflections
3. Generate AI summary
4. Create summary view
5. Add export option
6. Add tests

## Acceptance Criteria
- [ ] Select week/month/year period
- [ ] Generate comprehensive summary
- [ ] Highlight key themes/patterns
- [ ] Export summaries
- [ ] Tests for summary generation

## Prerequisites
- AI integration for summarization
- Sufficient reflection data"

echo "✅ Created issue: Period summaries"

# Issue: Separate reflection types
gh issue create --repo "$REPO" \
  --title "Separate gratitude, great moments, and lessons learned reflections" \
  --label "enhancement,feature-request" \
  --body "## Description
Create separate types for different reflection categories: gratitude, great moments to remember, and lessons learned.

## Tasks
1. Update data model with reflection types
2. Add type selector in UI
3. Add filtering by type
4. Update storage format
5. Migrate existing data
6. Add tests

## Acceptance Criteria
- [ ] Multiple reflection types supported
- [ ] Type selector when creating
- [ ] Filter by type in history
- [ ] Backward compatibility
- [ ] Tests for all types

## Related
- Reflection entity model update needed"

echo "✅ Created issue: Reflection types"

# Issue: Desktop application
gh issue create --repo "$REPO" \
  --title "Create desktop application (Electron or Tauri)" \
  --label "enhancement,devops,feature-request" \
  --body "## Description
Package application as desktop app instead of web-only, using Electron or Tauri.

## Tasks
1. Evaluate Electron vs Tauri
2. Set up build configuration
3. Implement native features
4. Handle file system access
5. Create installers
6. Add tests
7. Update documentation

## Acceptance Criteria
- [ ] Desktop app builds for macOS/Windows/Linux
- [ ] Native file system access
- [ ] System tray integration
- [ ] Auto-updates
- [ ] Installers created
- [ ] Documentation updated

## Technical Considerations
- Tauri is lighter than Electron
- Consider privacy implications"

echo "✅ Created issue: Desktop application"

# Issue: AI translation
gh issue create --repo "$REPO" \
  --title "Add AI translation for reflections (Hebrew, Russian, English)" \
  --label "enhancement,ai,feature-request" \
  --body "## Description
Translate reflections to other languages using AI (Hebrew, Russian, English).

## Tasks
1. Implement translation service
2. Add language selector UI
3. Handle translation requests
4. Cache translations
5. Add tests

## Acceptance Criteria
- [ ] Translate reflections on demand
- [ ] Support Hebrew, Russian, English
- [ ] Cache translated versions
- [ ] Maintain original formatting
- [ ] Tests for translation

## Technical Considerations
- Use local Ollama or external service
- Privacy warning for external services"

echo "✅ Created issue: AI translation"

# Issue: Single reflection export/share
gh issue create --repo "$REPO" \
  --title "Add export/share for individual reflections via email" \
  --label "enhancement,export" \
  --body "## Description
Add Export/Share button for specific reflections from History. Share reflection using email (as text or PDF).

## Tasks
1. Add export button to reflection view
2. Implement PDF generation
3. Add email sharing
4. Add format options
5. Add tests

## Acceptance Criteria
- [ ] Export button on each reflection
- [ ] Export as text or PDF
- [ ] Share via email
- [ ] Format preserved
- [ ] Tests for export formats

## Related
- Export functionality already exists for batch export"

echo "✅ Created issue: Single reflection export"

# Issue: Ollama model list
gh issue create --repo "$REPO" \
  --title "Get list of available models from Ollama" \
  --label "enhancement,ai" \
  --body "## Description
Take list of available local models from Ollama instead of hardcoding.

## Tasks
1. Call Ollama API to list models
2. Update model selector UI
3. Handle Ollama not running
4. Add caching
5. Add tests

## Acceptance Criteria
- [ ] Fetch models from Ollama dynamically
- [ ] Show available models in UI
- [ ] Handle errors gracefully
- [ ] Cache model list
- [ ] Tests for model fetching

## Technical
- Ollama API: GET /api/tags"

echo "✅ Created issue: Ollama model list"

# Issue: Background story integration
gh issue create --repo "$REPO" \
  --title "Add personal background story for AI context" \
  --label "enhancement,ai" \
  --body "## Description
Add user's background story with option to include it with each AI interaction for better context.

## Tasks
1. Create background story editor
2. Store background securely
3. Add toggle to include with AI
4. Implement context injection
5. Add tests

## Acceptance Criteria
- [ ] Editor for background story
- [ ] Secure storage
- [ ] Toggle to include/exclude
- [ ] Privacy warnings
- [ ] Tests for context injection

## Privacy Considerations
- Make it optional
- Clear privacy implications
- Local storage only"

echo "✅ Created issue: Background story"

# Issue: Mixed visual and text reflections
gh issue create --repo "$REPO" \
  --title "Support visual and text content in same reflection" \
  --label "enhancement,feature-request" \
  --body "## Description
Allow having both visual and text reflections in the same reflection entry.

## Tasks
1. Update data model
2. Implement mixed content UI
3. Update storage format
4. Add image gallery view
5. Update export
6. Add tests

## Acceptance Criteria
- [ ] Add images to text reflections
- [ ] Add text to visual reflections
- [ ] Unified editing experience
- [ ] Export includes all content
- [ ] Tests for mixed content

## Related
- Visual attachment feature exists"

echo "✅ Created issue: Mixed content reflections"

# Issue: History preview optimization
gh issue create --repo "$REPO" \
  --title "Optimize history view: show icons and first line only" \
  --label "enhancement,performance,ui-ux" \
  --body "## Description
In history view, don't show big preview of reflection text. Just show icon (visual/text indicator) and first line of text for better performance and UX.

## Tasks
1. Update history card component
2. Show type icon
3. Show first line only
4. Optimize rendering
5. Add tests

## Acceptance Criteria
- [ ] Icon for text/visual/mixed type
- [ ] First line preview only
- [ ] Better scroll performance
- [ ] Click to expand/view full
- [ ] Tests for optimized view

## Related
- Performance improvements
- History view component"

echo "✅ Created issue: History preview optimization"

echo ""
echo "✅ Successfully created all issues from reminder-for-me.md!"
echo ""
echo "Total issues created: 28"
