import { generateFeedUrl } from "../openers/index.js";
import { settings } from "../settings/index.js";
import type { Feed, ISettings } from "../types";
import { createByTemplate, deescapeHtml, getTranslation } from "../utils.js";
import type { NotificationComponent } from "./notification";

class FeedListComponentImpl extends HTMLElement {
  private settings = settings;

  onConnect = () => {
    const settingsState = this.settings.toJSON();
    this.updateOpenLinks(settingsState);
  };

  connectedCallback() {
    this.addEventListener("click", this.onCopyFeedLink);
    this.addEventListener("click", this.onDisclaimerClick);
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

  private sendNotification() {
    const notification = document.createElement("notification-component") as NotificationComponent;
    this.appendChild(notification);
    return notification;
  }

  private onDisclaimerClick = (event: MouseEvent) => {
    const { target } = event;
    if (!(target instanceof HTMLElement && target.classList.contains("feed__disclaimer"))) {
      return;
    }

    this.sendNotification().show(getTranslation("feed.derivedFeedDisclaimer"), void 0, 5000);
  };

  private onCopyClick(link: string) {
    const notification = this.sendNotification();
    navigator.clipboard.writeText(link).then(
      () => notification.show(getTranslation("feed.onSuccessFeedLinkCopy")),
      () => notification.show(getTranslation("feed.onFailedFeedLinkCopy")),
    );
  }

  private updateOpenLinks(settingState: ISettings) {
    for (const elem of Array.from(this.querySelectorAll(".feed__open")) as Iterable<HTMLAnchorElement>) {
      elem.href = generateFeedUrl(settingState, elem.dataset.baseUrl!).toString();
    }

    for (const elem of Array.from(this.querySelectorAll(".feed__copy")) as Iterable<HTMLAnchorElement>) {
      const baseUrl = elem.dataset.baseUrl!;

      elem.dataset.link = settingState.useOpenerLinksToCopy
        ? generateFeedUrl(settingState, baseUrl).toString()
        : baseUrl;
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

    const feedsElem = createByTemplate<HTMLElement>("template-feeds");
    const list = feedsElem.querySelector<HTMLUListElement>(".feeds__group")!;

    for (const feed of feeds) {
      const listItem = createByTemplate<HTMLLIElement>("template-feed__item").querySelector(".feed")!;

      listItem.querySelector(".feed__name")!.textContent = `[${feed.type.toUpperCase()}] ${deescapeHtml(feed.title)}`;
      listItem.querySelector(".feed__copy")?.setAttribute("data-base-url", feed.href);
      listItem.querySelector(".feed__open")?.setAttribute("data-base-url", feed.href);
      listItem.classList.add(`feed_type_${feed.extractType}`);

      list.appendChild(listItem);
    }

    this.replaceChildren(list);
    this.updateOpenLinks(this.settings.toJSON());
  }
}

export type FeedListComponent = FeedListComponentImpl;

customElements.define("feed-list", FeedListComponentImpl);
