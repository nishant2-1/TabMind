# Tabmind

Tabmind is a Chromium/Firefox-compatible browser extension scaffold built with Manifest V3 and Vite. It provides a clean popup UI for grouping open tabs, searching across tabs, and managing sessions.

## Architecture

- `public/manifest.json` - extension manifest and static runtime assets.
- `public/background.js` - background service worker for tab events and automation.
- `public/contentScript.js` - lightweight content script placeholder for page-level injection.
- `popup.html` - popup UI entrypoint.
- `options.html` - options page for user preferences.
- `src/main.jsx` - popup UI root with React.
- `src/popup/Popup.jsx` - tab grouping, search, and session logic.
- `src/lib/tabService.js` - modular tab helpers and Chrome API wrappers.
- `src/options/options.js` - options page logic.

## Features Scaffolding

- Tab grouping by domain/topic
- Fuzzy tab search/filtering UI
- Auto-suspend inactive tabs via background alarm scheduling
- Session management hooks for named save/restore
- Drag-and-drop reordering support planned in UI
- Keyboard commands configured in `manifest.json`
- Sync storage via `chrome.storage.sync`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build production assets:
   ```bash
   npm run build
   ```

4. Load extension in Chromium-based browser:
   - Open `chrome://extensions`
   - Enable Developer mode
   - Load unpacked extension from `dist`

## Notes

- The extension uses Manifest V3.
- No jQuery; React + vanilla JS only.
- UI is modular and ready for incremental feature expansion.  ..
- making it as the new commit
