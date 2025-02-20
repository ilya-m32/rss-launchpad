import { generateFeedUrl } from "../openers/index.js";
import { settings } from "../settings/index.js";
import type { Feed, ISettings } from "../types";
import { createByTemplate, deescapeHtml } from "../utils.js";
import type { NotificationComponent } from "./notification";

class FeedListComponentImpl extends HTMLElement {
  private settings = settings;

  onConnect = () => {
    const settingsState = this.settings.toJSON();
    this.updateLinks(settingsState);
  };

  connectedCallback() {
    this.addEventListener("click", this.onCopyFeedLink);
    this.settings.subscribe(this.onConnect);
    this.onConnect();
  }

  disconnectedCallback() {
    this.settings.unsubscribe(this.onConnect);
  }

  private onCopyFeedLink = (event: MouseEvent) => {
    const { target } = event;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const link = target.dataset.link;
    if (!link) {
      return;
    }

    if (target.classList.contains("feed__copy")) {
      this.onCopyClick(link);
    }
  };

  private onCopyClick(link: string) {
    const notification = document.createElement(
      "notification-component",
    ) as NotificationComponent;
    this.appendChild(notification);

    function onClear() {
      notification.remove();
    }

    navigator.clipboard.writeText(link).then(
      () => notification.show("Link copied!", onClear),
      () => notification.show("Failed to copy selected link", onClear),
    );
  }

  private updateLinks(settingState: ISettings) {
    for (const elem of Array.from(
      this.querySelectorAll(".feed__open"),
    ) as Iterable<HTMLAnchorElement>) {
      elem.href = generateFeedUrl(
        settingState,
        elem.dataset.baseUrl!,
      ).toString();
    }
  }

  setFeeds(feeds: Feed[]) {
    this.render(feeds);
  }

  render(feeds: Feed[]) {
    if (!feeds.length) {
      this.replaceChildren(createByTemplate("template-feed_state_empty"));
      return;
    }

    const list = createByTemplate<HTMLUListElement>("template-feeds");

    for (const feed of feeds) {
      const listItem = createByTemplate<HTMLLIElement>("template-feed__item");

      listItem.querySelector(".feed__name")!.textContent =
        `[${feed.type.toUpperCase()}] ${deescapeHtml(feed.title)}`;
      listItem
        .querySelector(".feed__copy")!
        .setAttribute("data-link", feed.href);
      listItem
        .querySelector(".feed__open")!
        .setAttribute("data-base-url", feed.href);

      list.appendChild(listItem);
    }

    this.replaceChildren(list);
  }
}

export type FeedListComponent = FeedListComponentImpl;

customElements.define("feed-list", FeedListComponentImpl);
