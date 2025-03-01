document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["siteData", "blockedSites"], ({ siteData, blockedSites }) => {
        const siteList = document.getElementById("siteList");
        siteList.innerHTML = Object.entries(siteData)
          .map(([site, data]) => `<p>${site}: ${data.timeSpent} mins</p>`)
          .join("");

        document.getElementById("blockBtn").addEventListener("click", () => {
            const input = document.getElementById("blockInput").value;
            if (input) {
                blockedSites.push(input);
                chrome.storage.local.set({ blockedSites });
            }
        });
    });
});
