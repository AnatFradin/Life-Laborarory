# Laboratory of Life - User Guide

> A calm, private space for self-reflection with AI assistance

Welcome to Laboratory of Life! This guide will help you get started and make the most of your reflective journey.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Writing Reflections](#writing-reflections)
3. [Using AI Feedback](#using-ai-feedback)
4. [Markdown Editing](#markdown-editing)
5. [Visual Reflections](#visual-reflections)
6. [Viewing Your History](#viewing-your-history)
7. [Exporting Your Data](#exporting-your-data)
8. [Settings & Privacy](#settings--privacy)
9. [Keyboard Shortcuts](#keyboard-shortcuts)
10. [Accessibility](#accessibility)

---

## Getting Started

### First Launch

When you first open Laboratory of Life, you'll see a clean, calm interface with a simple navigation menu:

- **Compose**: Write a new reflection
- **History**: View past reflections
- **Coach**: Select AI coaching personas (optional)
- **Export**: Download and manage your data
- **Settings**: Customize your experience

### Your Data is Private

All your reflections are stored locally on your device in the `data/` directory. Nothing is sent to external servers unless you explicitly choose to use online AI features.

---

## Writing Reflections

### Text Reflections

1. Click **"Compose"** in the navigation menu
2. Start typing in the text area
3. Your reflection is automatically saved as you type (debounced)
4. Press **Cmd/Ctrl + Enter** to manually save

### Writing Tips

- Write freely without judgment
- There's no "right" way to reflect
- You can use plain text or Markdown formatting
- The interface stays calm - no timers, no pressure

---

## Using AI Feedback

### Local AI (Default)

Laboratory of Life uses **Ollama** for local AI processing, which means:

- Your data never leaves your device
- Complete privacy - no internet connection needed (except to localhost)
- Free to use
- Requires Ollama to be installed and running

**To get AI feedback:**
1. Write your reflection
2. Click **"Ask AI Mirror"**
3. Wait a few seconds for a gentle, reflective response
4. The AI provides non-directive feedback - it mirrors and reflects, never tells you what to do

### Online AI (Optional)

If you prefer more capable AI models, you can switch to online providers:

1. Go to **Settings**
2. Select "Online AI"
3. Choose OpenAI or Anthropic
4. Enter your API key
5. **⚠️ Warning**: You'll see a clear message that data will leave your device

### AI Rephrasing

The rich text editor includes an AI rephrasing feature:

1. Write some text
2. Select the text you want to rephrase (or leave unselected to rephrase all)
3. Click the **"Rephrase"** button (purple) in the toolbar
4. Choose a style:
   - **Clearer**: Simpler, more concise language
   - **More Positive**: Reframe with a hopeful tone
   - **More Constructive**: Focus on growth and learning
5. Review the 2-3 suggestions
6. Click **"Accept"** on the one you like, or **"Cancel"** to keep your original text

---

## Markdown Editing

### Enabling Markdown

At the top of the Compose view, you'll see a toggle:
- **Plain Text** (default)
- **Markdown** (for formatting)

Click to switch between modes.

### Markdown Syntax

When in Markdown mode, you can use:

| Syntax | Result |
|--------|--------|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `# Heading 1` | Large heading |
| `## Heading 2` | Medium heading |
| `### Heading 3` | Small heading |
| `- item` | Bullet list |
| `1. item` | Numbered list |
| `> quote` | Blockquote |
| `` `code` `` | Inline code |
| `[text](url)` | Link |

### Using the Toolbar

Don't know Markdown? No problem! Use the formatting toolbar:

- **B** - Bold
- **I** - Italic
- **H1, H2, H3** - Headings
- **List** - Bullet list
- **1.** - Numbered list
- **Link** - Insert link
- **Quote** - Blockquote
- **Rephrase** - AI rephrasing (purple button)

### Keyboard Shortcuts

- **Cmd/Ctrl + B**: Bold
- **Cmd/Ctrl + I**: Italic
- **Cmd/Ctrl + K**: Insert link
- **Cmd/Ctrl + P**: Toggle edit/preview mode

### Live Preview

Toggle between **Edit** and **Preview** modes to see how your formatted text will look. The preview updates within 200ms of typing.

---

## Visual Reflections

### Importing Images

Not all reflection is verbal. Import visual artifacts:

1. In **Compose** view, toggle from "Text" to "Visual" mode
2. Click the image import area or drag and drop an image
3. Supported formats: JPEG, PNG, GIF, WebP, PDF
4. Maximum file size: 10MB
5. Your image is stored locally in `data/visuals/`

### Why Visual?

- Import photos that capture a moment
- Scan and save handwritten journal pages
- Keep sketches, drawings, or artwork
- Any visual that holds meaning for you

---

## Viewing Your History

### The History View

Click **"History"** to see all your past reflections:

- Sorted chronologically (newest first)
- Human-readable timestamps ("2 hours ago", "Yesterday", "March 15")
- Text and visual reflections displayed with equal prominence
- Reflections with AI feedback show a small indicator

### Navigating

**With Mouse:**
- Click on any reflection to view details

**With Keyboard:**
- **Tab**: Move between reflections
- **Arrow keys**: Navigate the list
- **Enter**: Open selected reflection
- **Delete**: Delete selected reflection (with confirmation)

---

## Exporting Your Data

### Why Export?

- Create a backup
- Move to a different device
- Switch to another journaling tool
- Have peace of mind knowing your data is portable

### How to Export

1. Go to **Export** view
2. Choose format:
   - **Single file** (default): One Markdown file with base64-encoded images
   - **Folder**: Separate Markdown file with images in a subfolder
3. Click **"Export to Markdown"**
4. Your browser downloads a `.md` file containing all reflections

### Export Format

The Markdown export is human-readable and includes:
- Timestamps
- Full reflection content
- AI interactions (if any)
- Visual attachments
- Coach persona information (if used)

---

## Settings & Privacy

### AI Provider Settings

**Local AI (Default)**
- Provider: Ollama
- Model: Choose from available models (llama2, mistral, etc.)
- Pull models with: `ollama pull <model-name>`

**Online AI (Opt-in)**
- OpenAI: Requires API key
- Anthropic: Requires API key
- **Privacy warning shown** before first use
- Clear indicator in the header when online AI is active

### Storage Location

Choose where your reflections are stored:
- **Default Local**: `data/` in the application directory
- **iCloud Drive** (macOS only): Automatic sync across Apple devices
- **Custom Location**: Any folder on your device

**Note**: When switching locations, existing files don't move automatically. Export your data first if you want to migrate.

### Privacy Status

The app shows your current privacy mode:
- 🟢 **Local-only**: All processing on your device
- 🟠 **Online AI active**: Data being sent to chosen provider

---

## Keyboard Shortcuts

### Global

- **Cmd/Ctrl + N**: New reflection (go to Compose)
- **Cmd/Ctrl + H**: View history
- **Cmd/Ctrl + E**: Export data
- **Cmd/Ctrl + ,**: Open settings
- **Escape**: Close dialogs

### Compose View

- **Cmd/Ctrl + Enter**: Save reflection
- **Cmd/Ctrl + P**: Toggle edit/preview (Markdown mode)
- **Cmd/Ctrl + B**: Bold selection (Markdown mode)
- **Cmd/Ctrl + I**: Italic selection (Markdown mode)
- **Cmd/Ctrl + K**: Insert link (Markdown mode)

### Navigation

- **Tab**: Move forward between interactive elements
- **Shift + Tab**: Move backward
- **Enter/Space**: Activate buttons
- **Arrow keys**: Navigate lists

---

## Accessibility

Laboratory of Life is designed to be fully accessible to everyone.

### Screen Reader Support

- All interactive elements have proper labels
- ARIA live regions announce dynamic content changes
- Status messages are announced when actions complete
- Keyboard navigation matches visual layout

### Keyboard Navigation

- **100% keyboard accessible** - no mouse required
- Visible focus indicators (2px blue borders)
- Logical tab order
- Skip to main content link
- Press **Shift + ?** to view all keyboard shortcuts

### Visual Design

- **WCAG 2.1 Level AA** compliant color contrast
- Minimum 4.5:1 contrast ratio for all text
- No reliance on color alone to convey information
- Calm color palette designed to reduce eye strain

### Motion

- No auto-playing animations
- No attention-grabbing effects
- Gentle transitions (< 300ms)
- Respects `prefers-reduced-motion` user preference

### Screen Magnification

- Layouts adapt to text scaling up to 200%
- No horizontal scrolling at standard zoom levels
- Touch targets at least 44×44px

---

## Troubleshooting

### "AI assistant isn't available"

**Problem**: Ollama is not running  
**Solution**:
1. Install Ollama from https://ollama.ai/
2. Start Ollama: `ollama serve`
3. Pull a model: `ollama pull llama2`
4. Refresh the app

### "AI model you selected isn't available"

**Problem**: The model hasn't been downloaded  
**Solution**:
1. Check available models: `ollama list`
2. Pull the model: `ollama pull <model-name>`
3. Go to Settings and select the model

### "Device is running low on storage"

**Problem**: Not enough disk space  
**Solution**:
1. Export your reflections first (to keep them safe)
2. Free up space on your device
3. Consider deleting older reflections you no longer need

### Slow Performance

**Problem**: Loading 1000+ reflections takes time  
**Solution**:
- Reflections are organized by month for performance
- Consider exporting and archiving older reflections
- The app is optimized for up to 1000 active reflections

---

## Tips for Meaningful Reflection

1. **No judgments**: There's no "right" way to reflect
2. **Consistency over length**: Short, regular reflections are valuable
3. **Use multiple modes**: Switch between text and visual as needed
4. **Try Markdown**: Headings and lists can help organize thoughts
5. **AI as mirror**: The AI reflects back to you; it doesn't give advice
6. **Export regularly**: Create backups for peace of mind
7. **Privacy first**: Use local AI for complete privacy

---

## Getting Help

- **Documentation**: Check this guide and the README
- **Issues**: Report bugs on GitHub
- **Philosophy**: Read "О-чем-проект.md" (in Russian) to understand the project's values

---

*Laboratory of Life is a tool for self-reflection. The AI helps you walk, but the path is yours. The meaning is yours. The life is yours.* 🌿
