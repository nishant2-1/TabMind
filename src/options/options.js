const state = {
  autoSuspend: false,
  sessionRestore: true
};

const form = document.createElement('div');
form.innerHTML = `
  <section style="font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 36px auto;">
    <h1>Tabmind Settings</h1>
    <p>Configure sync and tab management preferences.</p>
    <label style="display:block; margin: 20px 0;">
      <input type="checkbox" id="autoSuspend" />
      Auto-suspend inactive tabs
    </label>
    <label style="display:block; margin: 20px 0;">
      <input type="checkbox" id="sessionRestore" />
      Enable named session save/restore
    </label>
    <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px; align-items: center;">
      <button id="saveButton" style="padding: 10px 18px; border: none; border-radius: 10px; background: #2563eb; color: white; cursor: pointer;">Save settings</button>
      <button id="clearSessionsButton" style="padding: 10px 18px; border: none; border-radius: 10px; background: #ef4444; color: white; cursor: pointer;">Clear saved sessions</button>
    </div>
    <div id="status" style="margin-top: 12px; color: #374151;"></div>
  </section>
`;

document.getElementById('options-root').appendChild(form);

const autoSuspendInput = document.getElementById('autoSuspend');
const sessionRestoreInput = document.getElementById('sessionRestore');
const saveButton = document.getElementById('saveButton');
const clearSessionsButton = document.getElementById('clearSessionsButton');
const statusNode = document.getElementById('status');

function setStatus(message) {
  statusNode.textContent = message;
}

chrome.storage.sync.get(['autoSuspend', 'sessionRestore'], (result) => {
  autoSuspendInput.checked = result.autoSuspend ?? state.autoSuspend;
  sessionRestoreInput.checked = result.sessionRestore ?? state.sessionRestore;
});

saveButton.addEventListener('click', () => {
  chrome.storage.sync.set(
    {
      autoSuspend: autoSuspendInput.checked,
      sessionRestore: sessionRestoreInput.checked
    },
    () => {
      setStatus('Options saved.');
      setTimeout(() => setStatus(''), 2000);
    }
  );
});

clearSessionsButton.addEventListener('click', () => {
  chrome.storage.sync.set({ savedSessions: [] }, () => {
    setStatus('Saved sessions cleared.');
    setTimeout(() => setStatus(''), 2000);
  });
});
