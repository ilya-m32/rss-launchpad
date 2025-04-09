import type { Feed, PageSyncResult } from "../../types";

(function (): PageSyncResult {
  const BASE_URL = "https://www.youtube.com/feeds/videos.xml";

  function deriveChannelFeed(): Feed[] {
    const hrefElements = Array.from(document.querySelectorAll<HTMLLinkElement>("a[href]"));
    const derivedFeeds = new Map<string, Feed>();

    for (const elem of hrefElements) {
      const channelMatch = elem.href.match(/\/channel\/(.+)\/about/);
      if (!channelMatch || channelMatch.length < 2) continue;

      const rssUrl = new URL(BASE_URL);
      const [_, channelId] = channelMatch;
      rssUrl.searchParams.set("channel_id", channelId);
      const href = rssUrl.toString();
      if (derivedFeeds.has(href)) continue;

      derivedFeeds.set(href, {
        type: "application/rss+xml",
        extractType: "derived",
        href,
        title: elem.textContent ?? "??",
      });
    }

    return Array.from(derivedFeeds.values());
  }

  return {
    feeds: deriveChannelFeed(),
  };
})();
