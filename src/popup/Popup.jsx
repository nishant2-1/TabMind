import React, { useEffect, useMemo, useState } from 'react';
import styles from './Popup.module.css';
import { chromePromise, fetchAllTabs, groupTabsByDomain } from '../lib/tabService';
import {
  getSavedSessions,
  saveSession as saveSessionData,
  deleteSession,
  restoreSession
} from '../lib/sessionService';

function reorderTabsInArray(allTabs, fromId, toId) {
  const updated = [...allTabs];
  const fromIndex = updated.findIndex((tab) => tab.id === fromId);
  const toIndex = updated.findIndex((tab) => tab.id === toId);

  if (fromIndex < 0 || toIndex < 0) {
    return updated;
  }

  const [movedTab] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, movedTab);
  return updated;
}

function Popup() {
  const [tabs, setTabs] = useState([]);
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [autoSuspendEnabled, setAutoSuspendEnabled] = useState(false);
  const [savedSessions, setSavedSessions] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [isLoading, setIsLoading] = useState(true);
  const [draggingTabId, setDraggingTabId] = useState(null);
  const [currentWindowId, setCurrentWindowId] = useState(null);

  useEffect(() => {
    async function loadTabs() {
      setIsLoading(true);
      const fetchedTabs = await fetchAllTabs();
      setTabs(fetchedTabs);
      setIsLoading(false);
    }

    loadTabs();
  }, []);

  useEffect(() => {
    async function loadData() {
      const sessions = await getSavedSessions();
      setSavedSessions(sessions);

      chrome.storage.sync.get({ autoSuspend: false }, (result) => {
        setAutoSuspendEnabled(result.autoSuspend);
      });

      chrome.tabs.query({ active: true, currentWindow: true }, (currentTabs) => {
        setCurrentWindowId(currentTabs[0]?.windowId ?? null);
      });
    }

    loadData();
  }, []);

  const groups = useMemo(() => groupTabsByDomain(tabs), [tabs]);

  const filteredTabs = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();

    return tabs.filter((tab) => {
      const inGroup = activeGroup === 'All' || tab.domain === activeGroup;
      const matchesSearch =
        !lowerSearch ||
        tab.title.toLowerCase().includes(lowerSearch) ||
        tab.url.toLowerCase().includes(lowerSearch) ||
        tab.domain.toLowerCase().includes(lowerSearch);

      return inGroup && matchesSearch;
    });
  }, [tabs, search, activeGroup]);

  const saveCurrentSession = async () => {
    const name = sessionName.trim() || `Workspace ${new Date().toLocaleString()}`;
    const currentTabs = tabs.map((tab) => ({
      url: tab.url,
      title: tab.title,
      domain: tab.domain,
      groupTitle: tab.groupTitle
    }));

    const sessions = await saveSessionData(name, currentTabs);
    setSavedSessions(sessions);
    setSessionName('');
  };

  const restoreSavedSession = async (sessionId) => {
    const session = savedSessions.find((sessionItem) => sessionItem.id === sessionId);
    if (!session) {
      return;
    }

    await restoreSession(session);
    window.close();
  };

  const deleteSavedSession = async (sessionId) => {
    const sessions = await deleteSession(sessionId);
    setSavedSessions(sessions);
  };

  const handleDragStart = (event, tabId) => {
    setDraggingTabId(tabId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event, targetTabId) => {
    event.preventDefault();
    if (!draggingTabId || draggingTabId === targetTabId) {
      setDraggingTabId(null);
      return;
    }

    const updatedTabs = reorderTabsInArray(tabs, draggingTabId, targetTabId);
    setTabs(updatedTabs);

    const movedTab = updatedTabs.find((tab) => tab.id === draggingTabId);
    const targetIndex = updatedTabs.findIndex((tab) => tab.id === targetTabId);

    if (movedTab && movedTab.windowId === currentWindowId) {
      try {
        await chromePromise(chrome.tabs.move, {
          tabId: movedTab.id,
          index: targetIndex
        });
      } catch (error) {
        console.warn('Tab reorder failed', error);
      }
    }

    setDraggingTabId(null);
  };

  const openInNewTab = (tabId) => {
    chrome.tabs.update(tabId, { active: true });
    window.close();
  };

  const renderKanbanBoard = () => (
    <div className={styles.board}>
      {Object.keys(groups).map((group) => (
        <section key={group} className={styles.boardColumn}>
          <h2 className={styles.boardTitle}>{group}</h2>
          {groups[group].map((tab) => (
            <article key={tab.id} className={styles.boardCard}>
              <button className={styles.tabAction} onClick={() => openInNewTab(tab.id)}>
                <div>
                  <div className={styles.tabTitle}>{tab.title || 'Untitled tab'}</div>
                  <div className={styles.tabMeta}>{tab.groupTitle}</div>
                </div>
              </button>
            </article>
          ))}
        </section>
      ))}
    </div>
  );

  return (
    <div className={styles.popup}>
      <header className={styles.header}>
        <h1>Tabmind</h1>
        <p>Workspace-style tab management with saved sessions and drag reorder.</p>
      </header>

      <section className={styles.controls}>
        <input
          type="search"
          placeholder="Search open tabs..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.controlRow}>
          <button
            className={viewMode === 'list' ? styles.activeGroup : styles.groupButton}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
          <button
            className={viewMode === 'kanban' ? styles.activeGroup : styles.groupButton}
            onClick={() => setViewMode('kanban')}
          >
            Workspace
          </button>
        </div>

        <div className={styles.sessionControls}>
          <input
            type="text"
            placeholder="New session name"
            value={sessionName}
            onChange={(event) => setSessionName(event.target.value)}
            className={styles.sessionInput}
          />
          <button className={styles.saveButton} onClick={saveCurrentSession}>
            Save session
          </button>
        </div>
      </section>

      <section className={styles.sessionPanel}>
        <div className={styles.sessionPanelHeader}>
          <h2>Saved sessions</h2>
          <span>{savedSessions.length} saved</span>
        </div>
        {savedSessions.length === 0 ? (
          <div className={styles.status}>No saved sessions yet. Save your current workspace above.</div>
        ) : (
          <div className={styles.sessionList}>
            {savedSessions.map((session) => (
              <article key={session.id} className={styles.sessionCard}>
                <div>
                  <div className={styles.sessionName}>{session.name}</div>
                  <div className={styles.sessionMeta}>{session.tabCount} tabs · saved {new Date(session.createdAt).toLocaleString()}</div>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.restoreButton} onClick={() => restoreSavedSession(session.id)}>
                    Restore
                  </button>
                  <button className={styles.deleteButton} onClick={() => deleteSavedSession(session.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.results}>
        {isLoading ? (
          <div className={styles.status}>Loading tabs...</div>
        ) : viewMode === 'kanban' ? (
          renderKanbanBoard()
        ) : filteredTabs.length === 0 ? (
          <div className={styles.status}>No matching tabs found.</div>
        ) : (
          filteredTabs.map((tab) => (
            <article
              key={tab.id}
              className={styles.tabCard}
              draggable
              onDragStart={(event) => handleDragStart(event, tab.id)}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, tab.id)}
            >
              <button className={styles.tabAction} onClick={() => openInNewTab(tab.id)}>
                <div>
                  <div className={styles.tabTitle}>{tab.title || 'Untitled tab'}</div>
                  <div className={styles.tabMeta} title={tab.url}>
                    {tab.domain}
                  </div>
                </div>
                <div className={styles.tabBadge}>{tab.groupTitle || 'Ungrouped'}</div>
              </button>
            </article>
          ))
        )}
      </section>

      <footer className={styles.footer}>
        <span>{tabs.length} tabs loaded</span>
        <span className={styles.footerStatus}>
          Auto-suspend: {autoSuspendEnabled ? 'enabled' : 'disabled'}
        </span>
      </footer>
    </div>
  );
}

export default Popup;
