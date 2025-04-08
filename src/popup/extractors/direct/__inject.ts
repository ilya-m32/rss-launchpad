import type { Feed, PageSyncResult } from "../../types";

(function (): PageSyncResult {
  const MIME_TYPES = new Set(["application/rss+xml", "application/atom+xml"]);

  function getFeedFromElement(element: HTMLLinkElement): Feed {
    return {
      type: element.type,
      extractType: "direct",
      href: element.href,
      title: element.title,
    };
  }

  function getFeedLinks() {
    const feeds = [];

    const elements: HTMLLinkElement[] = Array.from(
      document.querySelectorAll(`link[rel="alternate"]`),
    );
    for (const element of elements) {
      if (MIME_TYPES.has(element.type)) {
        feeds.push(getFeedFromElement(element));
      }
    }

    return feeds;
  }

  return {
    feeds: getFeedLinks(),
  };
})();
