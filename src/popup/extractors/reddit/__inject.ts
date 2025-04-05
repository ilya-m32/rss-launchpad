import type { Feed, PageSyncResult } from "../../types";

(function (): PageSyncResult {
  function deriveFeeds(): Feed[] {
    const currentUrl = new URL(window.location.href, 'https://reddit.com');
    // ignoring search params
    currentUrl.search = '';
    const pathParts = currentUrl.pathname.split('/').filter(Boolean);
    const derivedFeeds: Feed[] = [];

    console.log(pathParts);

    // Is it a home page?
    if (!pathParts.length) {
      const rssUrl = new URL(currentUrl.toString());
      rssUrl.pathname = rssUrl.pathname + ".rss";
      const href = rssUrl.toString();

      derivedFeeds.push({
        type: "application/rss+xml",
        extractType: "derived",
        href,
        title: `${document.title}`,
      });
    }

    // is it a subreddit?
    if (pathParts[0] === 'r' && pathParts[1]) {
      const rssUrl = new URL(currentUrl.toString());
      rssUrl.pathname = `/${pathParts[0]}/${pathParts[1]}/.rss`;

      const href = rssUrl.toString();
      derivedFeeds.push({
        type: "application/rss+xml",
        extractType: "derived",
        href,
        title: `Subreddit ${pathParts[1]}`,
      });
    }

    // is it a user profile
    if (pathParts[0] === 'user' && pathParts[1]) {
      const rssUrl = new URL(currentUrl.toString());
      rssUrl.pathname = `/${pathParts[0]}/${pathParts[1]}/.rss`;

      const href = rssUrl.toString();
      derivedFeeds.push({
        type: "application/rss+xml",
        extractType: "derived",
        href,
        title: `User ${pathParts[1]}`,
      });
    }

    return derivedFeeds;
  }

  return {
    feeds: deriveFeeds(),
  };
})();
