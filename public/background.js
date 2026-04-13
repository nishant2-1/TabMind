// Background service worker for Tabmind.
// Responsible for auto-suspend scheduling and lightweight tab automation.

const AUTO_SUSPEND_ALARM = 'autoSuspendInactiveTabs';
const AUTO_SUSPEND_INTERVAL_MINUTES = 1;

function log(...args) {
  console.log('[Tabmind]', ...args);
}

function createSuspendAlarm() {
  chrome.alarms.create(AUTO_SUSPEND_ALARM, { periodInMinutes: AUTO_SUSPEND_INTERVAL_MINUTES });
  log('Scheduled auto-suspend alarm every', AUTO_SUSPEND_INTERVAL_MINUTES, 'minute(s).');
}

function clearSuspendAlarm() {
  chrome.alarms.clear(AUTO_SUSPEND_ALARM, (wasCleared) => {
    log('Auto-suspend alarm cleared:', wasCleared);
  });
}

function updateAutoSuspendSchedule(enabled) {
  if (enabled) {
    createSuspendAlarm();
  } else {
    clearSuspendAlarm();
  }
}

function loadAutoSuspendSetting() {
  chrome.storage.sync.get({ autoSuspend: false }, (result) => {
    updateAutoSuspendSchedule(result.autoSuspend);
  });
}

function suspendInactiveTabs() {
  chrome.tabs.query({}, (tabs) => {
    const candidates = tabs.filter((tab) => {
      return (
        tab.id != null &&
        !tab.active &&
        !tab.pinned &&
        !tab.audible &&
        !tab.discarded &&
        tab.autoDiscardable !== false
      );
    });

    log('Auto-suspend candidates:', candidates.length);

    candidates.forEach((tab) => {
      chrome.tabs.discard(tab.id, (discardedTab) => {
        const error = chrome.runtime.lastError;
        if (error) {
          console.warn('[Tabmind] discard failed for tab', tab.id, error.message);
          return;
        }
        log('Discarded tab', tab.id, discardedTab?.discarded);
      });
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  log('installed or updated');
  loadAutoSuspendSetting();
});

chrome.runtime.onStartup.addListener(() => {
  log('service worker started');
  loadAutoSuspendSetting();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.autoSuspend) {
    updateAutoSuspendSchedule(changes.autoSuspend.newValue);
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === AUTO_SUSPEND_ALARM) {
    suspendInactiveTabs();
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'organize_tabs') {
    chrome.tabs.query({}, (tabs) => {
      const tabIds = tabs.filter((tab) => tab.id != null).map((tab) => tab.id);
      chrome.tabs.group({ tabIds }, (groupId) => {
        chrome.tabGroups.update(groupId, { title: 'Auto Grouped', color: 'blue' });
      });
    });
  }
});
