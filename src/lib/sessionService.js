import { chromePromise } from './tabService';

function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function getSavedSessions() {
  const result = await chromePromise(chrome.storage.sync.get, { savedSessions: [] });
  return result.savedSessions || [];
}

export async function saveSession(name, tabs) {
  const sessions = await getSavedSessions();
  const session = {
    id: generateSessionId(),
    name,
    createdAt: Date.now(),
    tabCount: tabs.length,
    tabs: tabs.map((tab) => ({
      url: tab.url,
      title: tab.title,
      domain: tab.domain,
      groupTitle: tab.groupTitle
    }))
  };

  const updatedSessions = [session, ...sessions];
  await chromePromise(chrome.storage.sync.set, { savedSessions: updatedSessions });
  return updatedSessions;
}

export async function deleteSession(sessionId) {
  const sessions = await getSavedSessions();
  const updatedSessions = sessions.filter((session) => session.id !== sessionId);
  await chromePromise(chrome.storage.sync.set, { savedSessions: updatedSessions });
  return updatedSessions;
}

export async function clearSavedSessions() {
  await chromePromise(chrome.storage.sync.set, { savedSessions: [] });
  return [];
}

export async function restoreSession(session) {
  if (!session || !session.tabs || session.tabs.length === 0) {
    throw new Error('Invalid session data.');
  }

  const activeTabs = await chromePromise(chrome.tabs.query, { active: true, currentWindow: true });
  const currentWindowId = activeTabs[0]?.windowId;

  const createdTabs = [];
  for (const tab of session.tabs) {
    const createdTab = await chromePromise(chrome.tabs.create, {
      url: tab.url,
      active: false,
      windowId: currentWindowId
    });
    createdTabs.push(createdTab);
  }

  if (createdTabs.length > 1) {
    const tabIds = createdTabs.map((tab) => tab.id).filter((id) => id != null);
    const groupId = await chromePromise(chrome.tabs.group, { tabIds });
    await chromePromise(chrome.tabGroups.update, {
      groupId,
      title: session.name,
      color: 'purple'
    });
  }

  return createdTabs;
}
