This file is private developer file, MUST NOT be used by AI Copilot 


## Running the Application

Run the development server for backend:
`cd /Users/anatfradin/Git/Life-Laborarory/backend && npm run dev`

Access the Server: http://localhost:3000

Run the development server for frontend:
`cd /Users/anatfradin/Git/Life-Laborarory/frontend && npm run dev`

Access application: http://localhost:5173/

## Running Tests

Backend tests:
```bash
cd backend
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test            # All tests
npm run test:coverage   # With coverage report
```

Frontend tests:
```bash
cd frontend
npm run test:unit       # Unit tests only
npm run test:e2e        # E2E tests (Playwright)
npm run test           # All tests
npm run test:coverage  # With coverage report
```

To review using AI
`github/copilot`

## Future tasks:
[X] ✅ add option to set where to store data (default: user home directory) - **DONE: Settings with storage location selection (local/iCloud/custom)**
[ ] add templates for reflections (guided questions)
[~] ⚠️ Read from file the coaching persona prompts (instead of hardcoded in predefined-personas.js) - **PARTIAL: Single .txt files work, need JSON with multiple variants per persona**
[ ] ❌ Each can have more than one prompt for different situations. Each promt has an short description. - **TODO: Part of 002-dynamic-coach-prompts feature**
[ ] ❌ when using local AI models, open dialog to disucss with it. - **TODO: CoachChatDialog needed**
[ ] Create Docker container for easy install.
[X] ✅ Add Markdown editor, that show as md or as preview. - **DONE: MarkdownEditor with toggle**
[X] ✅ add Tools to help editing text (headings, bold, italic, lists, etc). - **DONE: MarkdownToolbar**
[ ] Add шкала нейробаланса
[ ] add calendar view for reflections
[ ] add calendar to see how many reflections were done / how many days were reflected on
[ ] add tags to reflections and ability to filter by tags
[ ] Report for Neurobalance trends over time
[X] ✅ Ask from user path to data storage. Define default path in user home directory. - **DONE: Settings with storage path configuration**
[ ] Add tab with all known tools (how to manage stress, how to improve focus, etc).
    - Lengold collection (inlcluding media fles - play them, files, presentations, ...)
    - Quotes collection
    - ...
[~] ⚠️ make UI more inviting to calm and do reflection - **PARTIAL: UI redesign done in Phase 8, can be improved further**
[ ] add dark mode
[ ] Add statistics about reflections (how many, average length, etc) including reference to Neurobalance.
[ ] propose tool according to reflection content and neurobalance state
[ ] Add voice input for reflections
[ ] Add option : Send reminder to reflect every day at user specified time
[ ] Summary my week / month / year in reflections
[ ] Separate gratefulless, great moment to remember, and lessons learned reflections
[ ] Is it possible to run it as application , not as web site? (Electron, Tauri, ...) ?
[X] ✅ Option to rephrase reflections using AI to be more positive / constructive - **DONE: Rephrase feature with 3 styles**
[ ] Translate reflections to other languages using AI (hebrew, russin, english)
[X] ✅ Export selected reflection. - **DONE: Export view with Markdown export**
[X] ✅ Add Export / share button for one specific reflection from History. Share reflection using eMail (as text or as PDF) - **DONE: Export functionality exists**
[X] ✅ take list of available local models from ollama. - **DONE: Settings loads Ollama models**
[X] ✅ Add integration with ollama to communicate with local AI models. - **DONE: OllamaAdapter for AI mirror**
[ ] Add my background story and ask if I want to copy/paste is with each AI interaction.
[X] ✅ Add option to have visual and text reflections in the same reflection. - **DONE: Visual attachment support**
[X] ✅ in the history, no need to show big preview or reflection text. Just show icon that it is visual or text, and first line of text. - **DONE: Compact history view**
[ ] add reflection template. With guided questions
[ ] add option to add image in the middle of the text reflection.
[X] ✅ verify that model answers in language that was used to write the reflection (in rephrase) - **DONE: Language preservation added to prompts**
[ ] Baal Sulam shortcut for conversation with AI coach
[ ] When going to settings from the middle of reflection, and than back to the reflection, the text is lost. Fix it.
[ ] add text reviewed by AI to improve grammar.
 ß
§