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
    extractType: feed.extractType,
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

export function getTranslation(tag: string, subs?: string | string[]) {
  const browser = getBrowser();
  return browser.i18n.getMessage(tag, subs);
}

export function applyTranslations<T extends HTMLElement>(element: T): T {
  for (const iter of Array.from(
    element.querySelectorAll("[data-trans-text], [data-trans-aria-label], [data-trans-attr-title]"),
  ) as HTMLElement[]) {
    if (iter.dataset.transText) {
      const newText = getTranslation(iter.dataset.transText);
      if (newText) {
        iter.textContent = newText;
      } else {
        console.warn("Missing translation tag", iter.dataset.transText);
      }
    }

    if (iter.dataset.transAriaLabel) {
      const newLabel = getTranslation(iter.dataset.transAriaLabel);
      if (newLabel) {
        iter.ariaLabel = newLabel;
      } else {
        console.warn("Missing translation tag", iter.dataset.transAriaLabel);
      }
    }

    for (const [key, value] of Object.entries(iter.dataset)) {
      if (key.startsWith('transAttr')) {
        const newAttrValue = value && getTranslation(value);

        if (!newAttrValue) {
          console.warn("Missing translation tag", {key, value});
          continue;
        }
        const attrName = key.slice('transAttr'.length).toLowerCase();
        iter.setAttribute(attrName, newAttrValue);
      }
    }

  }

  return element;
}

export function createByTemplate<T extends HTMLElement>(templateId: string): T {
  const template = document.getElementById(templateId);
  if (!(template instanceof HTMLTemplateElement)) {
    throw Error(`Could not find template tag for #${templateId}`);
  }
  return applyTranslations(template.content.cloneNode(true) as T);
}
