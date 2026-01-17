# Plan: Refactor UI to Three-Column Layout with Sidebar Navigation and Formatting Guide

Transform the current horizontal-navigation layout into a modern three-column interface with persistent sidebar navigation, main content area, and collapsible formatting guide, matching the uploaded UI design.

## Steps

### 1. Create AppSidebar component for left navigation panel
- Build vertical navigation menu with icons (Journal, Insights, Settings)
- Add AI Coaches section with persona cards (Socrates, Marcus, Maya)
- Implement collapse/expand functionality with arrow button
- Style with ~280px width, smooth transitions, purple accent colors
- Add tests for navigation and collapse behavior

### 2. Create MarkdownFormattingGuide component for right panel
- Build collapsible sidebar showing markdown syntax reference
- Organize into sections: BASIC (bold, italic, heading), LISTS (bulleted, numbered, task), ADVANCED (quote, link, code)
- Display syntax examples with code highlighting (e.g., `**text**`, `# Title`)
- Style with ~300px width, subtle background, toggleable visibility
- Add tests for toggle and content display

### 3. Restructure App.vue to three-column grid layout
- Replace horizontal navigation with AppSidebar (left column, fixed)
- Keep main content in center (flexible width)
- Add MarkdownFormattingGuide slot (right column, conditional)
- Update from single-column to `display: grid; grid-template-columns: 280px 1fr auto`
- Remove existing horizontal navigation bar
- Update responsive breakpoints for tablet/mobile (collapse sidebars)

### 4. Refactor ComposeView.vue header and actions
- Replace "Compose" h2 with inline title input field ("Title of your reflection...")
- Move mode selector to compact pills/tabs instead of large cards
- Reposition "Complete Entry" button to header (primary purple button, right-aligned)
- Add date display and auto-save indicator to header
- Update ReflectionEditor.vue to integrate with new header layout

### 5. Update color scheme and typography for purple accent theme
- Add purple primary color variables to main.css (`--color-accent-purple: #6366f1`)
- Update button styles for "Complete Entry" with purple gradient
- Update active navigation state to use purple instead of green
- Update AI Coach section to use purple theme
- Maintain existing warm, calm color palette for backgrounds

### 6. Add responsive behavior and mobile adaptations
- Implement hamburger menu for mobile (<768px) to toggle AppSidebar
- Auto-hide MarkdownFormattingGuide on tablets (<1024px)
- Add swipe gestures for sidebar navigation
- Test all breakpoints and update grid layout accordingly
- Add E2E tests for responsive behavior

## Further Considerations

1. **Split-view editor option?** The uploaded UI shows single-pane editing. Should we add optional side-by-side markdown preview, or keep the toggle approach?

2. **Insights tab implementation?** The navigation shows "Insights" - should this be a new statistics/analytics view, or repurpose existing HistoryView with data visualization?

3. **Migration path for existing users?** Current horizontal navigation is familiar - should we add a one-time tutorial or preference to switch layouts?

## Current UI Structure (Reference)

**Navigation:** Horizontal tabs in header (Compose, History, AI Coach, Settings, Export)
**Layout:** Single column, max-width 1200px, centered
**ComposeView:** Stacked vertically (mode selector cards → editor → actions → AI panel)
**MarkdownEditor:** Toolbar inside editor header, toggle between Edit/Preview modes
**No sidebar navigation:** All navigation is horizontal at top

## Target UI Structure

**Navigation:** Vertical sidebar with icons + labels, collapsible
**Layout:** Three columns - sidebar (280px) | main content (flexible) | formatting guide (300px)
**ComposeView:** Compact header with title input + actions, inline mode selector, prominent "Complete Entry" button
**MarkdownEditor:** Enhanced with persistent formatting guide, potentially split-view
**AI Coaches:** Accessible from sidebar with persona cards

## Technical Considerations

- **Vue 3 Composition API:** Continue using composables pattern
- **Radix Vue:** Use for collapsible panels and dialogs
- **Design Tokens:** Extend existing CSS custom properties for purple theme
- **Accessibility:** Maintain WCAG 2.1 AA compliance, keyboard navigation for sidebar
- **Testing:** Add unit tests for new components, E2E tests for layout changes
- **Migration:** Ensure backward compatibility with existing data and preferences
