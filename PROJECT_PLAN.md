# TabMind Project Plan

## 1. What we have built so far

### Completed work
- Created a Manifest V3 browser extension scaffold for Chromium/Firefox.
- Set up Vite + React build system with `popup.html`, `options.html`, and a service worker background script.
- Implemented tab fetching and grouping logic in the popup UI.
- Added fuzzy search across open tabs by title, URL, and domain.
- Built an auto-suspend system using `chrome.alarms` and `chrome.tabs.discard`.
- Implemented a syncable options page using `chrome.storage.sync`.
- Established GitHub repo branches: `main`, `dev`, `feature/tab-grouping`, and `feature/auto-suspend`.
- Published the initial scaffold and README updates to GitHub.

### Core files created
- `public/manifest.json`
- `public/background.js`
- `public/contentScript.js`
- `popup.html`
- `options.html`
- `src/main.jsx`
- `src/popup/Popup.jsx`
- `src/popup/Popup.module.css`
- `src/lib/tabService.js`
- `src/options/options.js`
- `README.md`
- `PROJECT_PLAN.md`

## 2. Where we are now

### Current focus
- Stabilize core extension behavior with a working popup UI and background automation.
- Ensure Manifest V3 compatibility and extension permissions are correct.
- Add clear documentation of features, fixes, and next steps.

### What is working
- Popup UI loads and displays tabs.
- Tab grouping by domain works.
- Search/filtering works on open tabs.
- Auto-suspend inactive tabs is configured and running through background alarms.
- Sync settings are available via `chrome.storage.sync`.

### What still needs implementation
- Full named session save/restore flow.
- Drag-and-drop tab reordering in the popup UI.
- Deeper workspace/Kanban-style UX.
- AI summarizer and session intelligence.
- Robust error handling and testing.
- GitHub branches for additional features and documentation.

## 3. Project roadmap

### Part 1: Overview and competitor comparison
- Define TabMind value proposition.
- Compare against Workona, Toby, OneTab, and other tab managers.
- Focus on tabs + sessions + productivity automation.

### Part 2: Extension architecture and MV3 design
- Keep `manifest.json` clean and permission-minimal.
- Use `background.js` service worker for alarms and tab automation.
- Keep popup UI lightweight and reactive with React.
- Use `chrome.storage.sync` for preferences and saved session metadata.

### Part 3: Feature deep dives
- Search: improve search with fuzzy matching and priority sort.
- Sessions: save named workspaces and restore them reliably.
- Zombies: auto-suspend inactive tabs with safe discard rules.
- AI summarizer: preview session content and summarize tab clusters.
- Workspaces / Kanban: UI cards and board organization.
- Sync: persist session metadata across devices.

### Part 4: Tech stack rationale
- `Manifest V3` is required and modern.
- `Vite` gives fast dev/build workflow.
- `React` enables component-driven UI.
- `CSS Modules` scope styling and avoid collisions.
- `chrome.*` APIs provide tab automation and sync.

### Part 5: SDLC and process
- Ideation → research → architecture → implementation → testing → release → iterate.
- Branch strategy:
  - `main` = production-ready
  - `dev` = integration
  - `feature/*` = isolated feature development
- Definition of Done:
  - Build passes
  - Manifest V3 valid
  - Core UI functional
  - Extensions loaded successfully
  - README and docs updated

### Part 6: Business model and launch goals
- Deliver free core extension.
- Consider premium upgrades for AI, workspace templates, export/import.
- Use a launch lifetime deal to grow early users.
- Track development costs vs. potential revenue from premium features.

### Part 7: Interview-readiness
- Prepare answers for MV3, React component design, extension architecture, storage sync, and background worker behavior.
- Prepare behavioral stories around scope management, building prototypes, and iterating on user-facing tools.

## 4. Last goal and remaining tasks

### Last goal
The current last goal is to move from a functional scaffold to a complete user workflow:
- Save and restore named session groups
- Enable comfortable tab reordering and workspace organization
- Add a stable sync model for user sessions
- Polish the popup UI and options page

### Highest-priority remaining tasks
1. `feature/session-save-restore`
   - Save current tab groups as named sessions
   - Restore tabs and group layout
2. `feature/tab-reordering`
   - Add drag-and-drop support in the popup
   - Persist order metadata if needed
3. `feature/workspaces-kanban`
   - Build a workspace board layout
   - Add task-style grouping and session labels
4. `feature/ai-summarizer`
   - Add session summary / tab preview features
5. Testing and docs
   - Add extension usage docs and developer notes
   - Create a clean launch-ready README and GitHub pages content

## 5. 34-item build tracker

| # | Task | Phase | Status | Notes |
|---|---|---|---|---|
| 1 | Create extension scaffold | Foundation | Done | Manifest V3, Vite, React setup |
| 2 | Add popup entrypoint | Foundation | Done | `popup.html`, `src/main.jsx` |
| 3 | Build basic popup UI | Foundation | Done | Search + listing |
| 4 | Add tab fetch logic | Core | Done | `chrome.tabs.query` wrapper |
| 5 | Implement grouping by domain | Core | Done | `groupTabsByDomain()` |
| 6 | Add tab search/filtering | Core | Done | Search field works |
| 7 | Add background service worker | Core | Done | `public/background.js` |
| 8 | Add alarm permission | Core | Done | `alarms` in manifest |
| 9 | Implement auto-suspend flow | Core | Done | `chrome.alarms` + discard logic |
| 10 | Build options page | Core | Done | `options.html`, `src/options/options.js` |
| 11 | Add sync settings | Core | Done | `chrome.storage.sync` usage |
| 12 | Add group metadata badges | UI | Done | popup shows domain/group title |
| 13 | Add footer status | UI | Done | Auto-suspend enabled indicator |
| 14 | Setup git repo | Foundation | Done | Initialized and committed |
| 15 | Create GitHub remote | Foundation | Done | `origin` added |
| 16 | Create branches | Foundation | Done | `dev`, feature branches |
| 17 | Push main branch | Foundation | Done | Pushed to GitHub |
| 18 | Push feature branches | Foundation | Done | Pushed to GitHub |
| 19 | Add README docs | Documentation | Done | `README.md` updated |
| 20 | Add project plan docs | Documentation | In progress | `PROJECT_PLAN.md` created |
| 21 | Add competitor comparison | Discovery | Planned | Document in plan |
| 22 | Add session save/restore logic | Feature | Pending | Highest priority |
| 23 | Add drag-and-drop reordering | Feature | Pending | Needed for workspace UX |
| 24 | Add keyboard shortcuts in popup | Feature | Pending | UX improvement |
| 25 | Add session list UI | Feature | Pending | Save/restore sessions UI |
| 26 | Add workspace board view | Feature | Planned | Kanban-style layout |
| 27 | Add AI summarizer hook | Feature | Planned | Future enhancement |
| 28 | Add error handling | Stability | Planned | Safe extension behavior |
| 29 | Add tests / validations | Stability | Planned | Manual/automated tests |
| 30 | Add build and release notes | Documentation | Planned | GitHub release docs |
| 31 | Add pricing/monetization plan | Business | Planned | Lifetime deal strategy |
| 32 | Create interview Q&A bank | Documentation | Planned | Developer readiness |
| 33 | Add workspace sync model | Stability | Planned | Sync session data across devices |
| 34 | Polish UX and branding | Launch | Planned | Final extension polish |

## 6. Recommended next steps

1. Implement session save/restore first.
2. Add drag-and-drop tab ordering and workspace views.
3. Add a session list to the popup.
4. Improve docs and competitor research.
5. Continue feature development in `feature/session-save-restore` and `feature/tab-reordering`.

---

### Quick status summary
- **Done:** extension scaffold, tab listing, search, grouping, auto-suspend, syncable settings, GitHub commit/branches.
- **Up next:** session save/restore, tab reordering, workspace UI, AI/story features.
- **Last goal:** turn the working scaffold into a complete workflow for saved tab sessions and workspace management.
