import React, { useEffect, useMemo, useState } from 'react';
import styles from './Popup.module.css';
import { fetchAllTabs, groupTabsByDomain } from '../lib/tabService';

function Popup() {
  const [tabs, setTabs] = useState([]);
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [autoSuspendEnabled, setAutoSuspendEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    chrome.storage.sync.get({ autoSuspend: false }, (result) => {
      setAutoSuspendEnabled(result.autoSuspend);
    });
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

  const openInNewTab = (tabId) => {
    chrome.tabs.update(tabId, { active: true });
    window.close();
  };

  return (
    <div className={styles.popup}>
      <header className={styles.header}>
        <h1>Tabmind</h1>
        <p>Group, search, and manage tabs instantly.</p>
      </header>

      <section className={styles.controls}>
        <input
          type="search"
          placeholder="Search open tabs..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.groupBar}>
          <button
            className={activeGroup === 'All' ? styles.activeGroup : styles.groupButton}
            onClick={() => setActiveGroup('All')}
          >
            All
          </button>
          {Object.keys(groups).map((group) => (
            <button
              key={group}
              className={activeGroup === group ? styles.activeGroup : styles.groupButton}
              onClick={() => setActiveGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.results}>
        {isLoading ? (
          <div className={styles.status}>Loading tabs...</div>
        ) : filteredTabs.length === 0 ? (
          <div className={styles.status}>No matching tabs found.</div>
        ) : (
          filteredTabs.map((tab) => (
            <article key={tab.id} className={styles.tabCard}>
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
