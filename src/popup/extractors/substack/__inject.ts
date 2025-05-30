import type { Feed, PageSyncResult } from "../../types";

(function (): PageSyncResult {
  function deriveFeeds(): Feed[] {
    const currentUrl = URL.parse(window.location.href);
    if (!currentUrl) {
      return [];
    }

    currentUrl.search = "";
    currentUrl.pathname = "/feed";

    return [
      {
        type: "application/rss+xml",
        extractType: "derived",
        href: currentUrl.toString(),
        title: `${document.title} RSS`,
      },
    ];
  }

  return {
    feeds: deriveFeeds(),
  };
})();
