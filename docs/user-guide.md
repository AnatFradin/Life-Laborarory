# 🌿 Laboratory of Life - User Guide

Welcome to Laboratory of Life, your private space for self-reflection. This guide will help you get started and make the most of the application.

## 🎯 What is Laboratory of Life?

Laboratory of Life is a calm, private tool for personal reflection. It helps you:

- Write your thoughts and feelings in a peaceful environment
- Import visual artifacts (photos, drawings, sketches) as reflections
- Get gentle, non-directive feedback from an AI mirror
- Keep all your reflections organized chronologically
- Export your data anytime, or delete what you no longer need

**Everything stays on your device** — no cloud sync, no tracking, no accounts.

## 🚀 Getting Started

### First Launch

When you first open Laboratory of Life:

1. The application creates a local data folder on your device
2. You'll see a calm, uncluttered interface with minimal choices
3. Your default view is "Compose" — ready for you to start reflecting

### Writing Your First Reflection

1. **Start typing** in the text area
2. Your work is **auto-saved** as you type (you'll see "Saved" appear)
3. Press **Cmd/Ctrl + Enter** to manually save
4. Click **"Ask AI Mirror"** for gentle, reflective feedback (optional)

The AI Mirror doesn't give advice or tell you what to do. Instead, it reflects your thoughts back to you in a curious, non-judgmental way.

## ✨ Key Features

### 📝 Expression Modes

Laboratory of Life supports two ways to express yourself:

#### Text Mode
- Write freely in the text editor
- Auto-save protects your work as you type
- Request AI feedback when you're ready
- All standard text formatting is preserved

#### Visual Mode
- Import images: photos, drawings, sketches, artwork
- Drag and drop or click to upload
- Supported formats: JPEG, PNG, GIF, WebP, PDF
- Maximum file size: 10 MB

**Both modes are treated with equal care** — no mode is more important than the other.

### 🤖 AI Mirror Options

You can choose between two AI options:

#### Local AI (Default) - Complete Privacy
- Uses Ollama running on your computer
- **Your reflections never leave your device**
- Requires Ollama to be installed and running
- Completely private and offline

#### Online AI (Optional) - More Capable
- Uses OpenAI or Anthropic via the internet
- **Your reflections are sent to the AI provider**
- More sophisticated responses
- Requires an API key

To switch between AI options, go to **Settings** → **AI Model**.

### 👥 Coach Personas (ChatGPT Integration)

If you have a ChatGPT Plus subscription, you can use predefined coaching personas:

1. Go to the **Coach** tab
2. Select a persona (Stoic Coach, Creative Mentor, etc.)
3. In **Compose**, click **"Talk to [Persona] in ChatGPT"**
4. Your reflection opens in ChatGPT with the persona's context
5. Have a conversation with the persona
6. Copy back any insights you want to keep

This feature uses your existing ChatGPT subscription — no extra API costs.

### 📚 History

View all your past reflections in chronological order:

- Click **History** in the navigation
- Browse by date (newest first)
- Click any reflection to view details
- Delete individual reflections if needed

### 📤 Data Export

Export your reflections to Markdown format:

1. Go to the **Export** tab
2. Click **"Export All Reflections"**
3. Choose format:
   - **Single file** (includes images as base64)
   - **Folder** (separate image files)
4. Your data downloads as a `.md` file

Exported files are human-readable and work with any text editor.

### 🗑️ Deleting Data

You have complete control over your data:

#### Delete Single Reflection
- In **History**, click the delete button on any reflection
- Confirm deletion
- The reflection is permanently removed

#### Delete All Data
- Go to **Export**
- Click **"Delete All"**
- Type `DELETE_ALL` to confirm
- **We recommend exporting first** — deletion is permanent

## ♿ Accessibility

Laboratory of Life is designed to be accessible to everyone:

### Keyboard Navigation
- **Tab**: Move between elements
- **Enter/Space**: Activate buttons and links
- **Escape**: Close dialogs
- **Cmd/Ctrl + Enter**: Save reflection
- **Cmd/Ctrl + N**: New reflection
- **Shift + ?**: Show keyboard shortcuts

### Screen Reader Support
- All controls have proper labels
- Status messages are announced
- Focus indicators are clearly visible
- Logical navigation order throughout

### Visual Design
- High contrast colors (WCAG 2.1 AA compliant)
- No attention-grabbing animations
- Calm color palette
- Readable font sizes

## 🔐 Privacy & Security

### What Stays Private

**Everything** stays on your device unless you explicitly choose otherwise:

- All reflections are stored locally
- Visual attachments are stored locally
- Settings and preferences are stored locally
- No analytics, tracking, or telemetry

### When Data Leaves Your Device

Data only leaves your device when you:

1. **Use online AI** — Your reflection is sent to OpenAI or Anthropic
2. **Use ChatGPT integration** — You manually copy text to ChatGPT
3. **Export data** — You download a file (still under your control)

The application will **always warn you** before sending data online.

### Local AI Privacy

When using Ollama (local AI):

- No internet connection required
- Your reflections never leave your computer
- The AI model runs entirely on your device
- Complete privacy guaranteed

## 🛠️ Settings

Customize your experience:

### AI Model
- Choose between local (Ollama) and online AI
- Select which local model to use
- Configure API keys for online AI

### Storage
- View where your data is stored
- See how much space you're using
- Change data location (advanced)

### Theme
- Light or dark mode (coming soon)
- Adjust text size (coming soon)

## 💡 Tips for Meaningful Reflection

1. **Write regularly** — Even a few sentences can be valuable
2. **Don't overthink it** — There's no "right" way to reflect
3. **Use both modes** — Sometimes words work best, sometimes images do
4. **Try AI feedback** — It might offer perspectives you hadn't considered
5. **Export periodically** — Keep backups of your journey
6. **Delete freely** — You're not obligated to keep everything

## 🤔 Common Questions

### Why isn't the AI responding?

If the local AI isn't working:

1. Check if Ollama is running: `ollama serve`
2. Make sure you've pulled a model: `ollama pull llama2`
3. Verify Ollama URL in Settings (default: `http://localhost:11434`)

### Where is my data stored?

By default: `[repository-root]/data/`

You can see the exact path in **Settings** → **Storage**.

### Can I use this on multiple devices?

Laboratory of Life is designed for single-device use. To sync between devices:

1. Export your data on Device A
2. Copy the export file to Device B
3. Manually import or recreate reflections

(Automatic sync would require cloud storage, which goes against our privacy principles.)

### What happens if I lose my data?

Your reflections are stored as JSON files in the data folder. As long as you have:

1. Regular exports (recommended)
2. Backups of your data folder
3. Time Machine or similar backup system

...your data is safe.

### Can I edit old reflections?

Currently, reflections are write-once. This preserves the "trace of becoming" — showing your journey over time. Future versions may add editing with history tracking.

### Is this a medical or therapeutic tool?

**No.** Laboratory of Life is not:

- A replacement for professional mental health care
- A diagnostic tool
- Medical or therapeutic treatment

It's a personal reflection tool. If you're struggling with mental health concerns, please seek help from qualified professionals.

## 🆘 Troubleshooting

### Application won't start

1. Check Node.js version: `node --version` (need 18+)
2. Reinstall dependencies: `npm install` in both `backend/` and `frontend/`
3. Check for port conflicts (backend uses 3000, frontend uses 5173)

### Reflections aren't loading

1. Check backend is running: `http://localhost:3000/health`
2. Verify data directory exists and is readable
3. Check browser console for errors (F12)

### Can't upload images

1. Check file size (max 10 MB)
2. Verify file type (JPEG, PNG, GIF, WebP, PDF)
3. Ensure you have disk space available

### Export isn't working

1. Check that you have reflections to export
2. Verify browser allows downloads
3. Check disk space for saving the export file

## 📞 Getting Help

If you encounter issues:

1. Check this guide
2. Review the [README.md](../README.md) for technical setup
3. Check the [Developer Quickstart](./quickstart.md) for advanced topics
4. Open an issue on GitHub with:
   - What you tried to do
   - What happened instead
   - Any error messages
   - Your OS and browser version

## 🌱 Philosophy

Laboratory of Life is built on seven principles:

1. **AI as Mirror**: Reflective, not directive
2. **Multiple Forms**: Text and visual equally valued
3. **Calm Experience**: No pressure, no rush
4. **Local-First**: Your data stays with you
5. **Trace of Becoming**: Your journey preserved
6. **Reversibility**: Export and delete freely
7. **Accessibility**: Inclusive for all

---

*Remember: The AI helps you walk, but the path is yours. The meaning is yours. The life is yours.*
