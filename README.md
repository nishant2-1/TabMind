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

## Features

- Tab grouping by domain/topic and manual grouping UI
- Fuzzy search across open tab titles, URLs, and domains
- Auto-suspend inactive tabs via background alarm scheduling
- Named session save/restore support with future UI hooks
- Drag-and-drop tab reorder readiness in the popup
- Keyboard shortcuts for power-user actions
- Cross-device sync via `chrome.storage.sync`

## Fixes

- Ensured Manifest V3 compatibility with service worker background logic
- Added `alarms` permission and scheduled auto-suspend flow
- Added safe discard logic for inactive tabs
- Loaded auto-suspend setting from synced storage
- Added popup auto-suspend status indicator and improved grouping metadata

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
- UI is modular and ready for incremental feature expansion.  
