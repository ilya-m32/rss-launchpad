import type { Feed, PageSyncResult } from "../../types";

(function (): PageSyncResult {
  function deriveFeeds(): Feed[] {
    const currentUrl = URL.parse(window.location.href);
    if (!currentUrl) {
      return [];
    }

    const channelNameMatch = /channel\/([^\/]+)(\/)?/.exec(currentUrl.pathname);
    const channelName = channelNameMatch ? channelNameMatch[1] : null;

    if (!channelName) {
      return [];
    }

    currentUrl.search = "?showall=1";
    currentUrl.pathname = `/feeds/rss/channel/${channelName}`;

    return [
      {
        type: "application/rss+xml",
        extractType: "derived",
        href: currentUrl.toString(),
        title: `${channelName} RSS`,
      },
    ];
  }

  return {
    feeds: deriveFeeds(),
  };
})();
