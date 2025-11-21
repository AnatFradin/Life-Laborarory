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

## Future:
[ ] Read from file the coaching persona prompts (instead of hardcoded in predefined-personas.js) . Each can have more than one prompt for different situations. Each promt has an short description.
[ ] when using local AI models, open dialog to disucss with it.
[ ] Create Docker container for easy install.
[ ] Add Markdown editor, that show as md or as preview.
[ ] add Tools to help editing (headings, bold, italic, lists, etc).
[ ] Add шкала нейробаланса
[ ] add calendar view for reflections
[ ] add calendar to see how many reflections were done / how many days were reflected on
[ ] add tags to reflections and ability to filter by tags
[ ] Report for Neurobalance trends over time
[ ] Ask from user path to data storage. Define default path in user home directory.
[ ] Add tab with all known tools (how to manage stress, how to improve focus, etc).
    - Lengold collection (inlcluding media fles - play them, files, presentations, ...)
    - Quotes collection
    - ...
[ ] Create AI personal coach (Franklin / Baal Sulam / Stoic / Мужицкая / ...)
[ ] make UI more inviting to calm and do reflection
[ ] add dark mode
[ ] Add statistics about reflections (how many, average length, etc) including reference to Neurobalance.
[ ] propose tool according to reflection content and neurobalance state
[ ] Add voice input for reflections
[ ] Add option : Send reminder to reflect every day at user specified time
[ ] Summary my week / month / year in reflections
[ ] Separate gratefulless, great moment to remember, and lessons learned reflections
[ ] Is it possible to run it as application , not as web site? (Electron, Tauri, ...) ?
[ ] Option to rephrase reflections using AI to be more positive / constructive
[ ] Translate reflections to other languages using AI (hebrew, russin, english)
[ ] Export selected reflection.
[ ] Add Export / share button for one specific reflection from History. Share reflection using eMail (as text or as PDF
)
[ ] take list of available local models from ollama.
[ ] Add integration with ollama to communicate with local AI models.
[ ] Add my background story and ask if I want to copy/paste is with each AI interaction.
§