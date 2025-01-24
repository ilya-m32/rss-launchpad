import type { Browser, Feed } from "./types";

export function getBrowser(): Browser {
  if (typeof browser !== "undefined") {
    return browser;
    // Chrome is the only who does not support browser, ugh
  } else if (typeof chrome !== "undefined") {
    return chrome;
  } else {
    throw new Error("Unsupported browser");
  }
}

const escapeMap: { [char: string]: string } = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const deescapeMap = Object.fromEntries(
  Object.entries(escapeMap).map(([a, b]) => [b, a]),
);

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => escapeMap[m]);
}

export function sanitizeFeed(feed: Feed): Feed {
  const type = /application\/(rss|atom)\+\w/.exec(feed.type)?.[1];

  return {
    title: escapeHtml(feed.title),
    type: type ?? "UNKWN",
    href: new URL(feed.href).toString(),
  };
}

export function sanitizeFeeds(inputFeeds: Feed[]): Feed[] {
  const feeds: Feed[] = [];

  for (const inputFeed of inputFeeds) {
    try {
      feeds.push(sanitizeFeed(inputFeed));
    } catch (error) {
      console.error("Error sanitizing feed:", error);
    }
  }
  return feeds;
}

export function deescapeHtml(str: string): string {
  return str.replace(
    /&amp;|&lt;|&gt;|&quot;|&#039;|&#x2F;/g,
    (match) => deescapeMap[match],
  );
}
