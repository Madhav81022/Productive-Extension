chrome.storage.local.get("blockedSites", ({ blockedSites }) => {
    const url = window.location.hostname;
    if (blockedSites.includes(url)) {
      document.body.innerHTML = "<h1>Blocked Site</h1><p>This website is blocked to boost your productivity.</p>";
    }
  });
  