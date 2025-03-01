let siteData = {};

// Initialize extension and set default values
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ blockedSites: [], siteData: {} });
  console.log("Extension installed!");
});

// ✅ Corrected: Added `tabId` as the first parameter
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    const url = new URL(tab.url);
    const hostname = url.hostname;

    chrome.storage.local.get("siteData", (data) => {
      let sites = data.siteData || {};

      if (!sites[hostname]) {
        sites[hostname] = { timeSpent: 0, lastVisit: Date.now() };
      }
      sites[hostname].lastVisit = Date.now();

      chrome.storage.local.set({ siteData: sites });
    });
  }
});

// ✅ Use Alarms Instead of setInterval()
chrome.alarms.create("trackTime", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "trackTime") {
    chrome.storage.local.get("siteData", (data) => {
      let sites = data.siteData || {};

      for (const site in sites) {
        if (Date.now() - sites[site].lastVisit < 60000) {
          sites[site].timeSpent += 1; // Increment time spent
        }
      }

      chrome.storage.local.set({ siteData: sites });
    });
  }
});

console.log("Background service worker running...");
