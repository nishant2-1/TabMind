function chromePromise(fn, options = {}) {
  return new Promise((resolve, reject) => {
    fn(options, (result) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        reject(lastError);
        return;
      }
      resolve(result);
    });
  });
}

export async function fetchAllTabs() {
  const tabs = await chromePromise(chrome.tabs.query, {});
  const groups = await chromePromise(chrome.tabGroups.query, {});
  const groupMap = groups.reduce((map, group) => {
    map[group.id] = group;
    return map;
  }, {});

  return tabs.map((tab) => {
    const domain = extractDomain(tab.url);
    const group = tab.groupId >= 0 ? groupMap[tab.groupId] : null;

    return {
      id: tab.id,
      title: tab.title || tab.url,
      url: tab.url || '',
      domain,
      groupTitle: group ? group.title || domain : 'Ungrouped',
      groupId: tab.groupId
    };
  });
}

export function groupTabsByDomain(tabs) {
  return tabs.reduce((groups, tab) => {
    const key = tab.domain || 'Unknown';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(tab);
    return groups;
  }, {});
}

export function extractDomain(url = '') {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch (error) {
    return 'Unknown';
  }
}
