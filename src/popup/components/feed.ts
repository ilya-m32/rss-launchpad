import type { Feed } from "../types";
import { deescapeHtml } from "../utils.js";
import type { NotificationComponent } from "./notification";

class FeedListComponentImpl extends HTMLElement {
  private feedTemplate = document.getElementById(
    "template-feed",
  ) as HTMLTemplateElement;

  private feedEmptyTemplate = document.getElementById(
    "template-feed_state_empty",
  ) as HTMLTemplateElement;

  connectedCallback() {
    this.addEventListener("click", this.onFeedClick.bind(this));
  }

  onFeedClick(event: MouseEvent) {
    const { target } = event;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    const link = target.dataset.link;
    if (!link) {
      return;
    }

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

  setFeeds(feeds: Feed[]) {
    this.render(feeds);
  }

  render(feeds: Feed[]) {
    if (!feeds.length) {
      this.replaceChildren(this.feedEmptyTemplate.content.cloneNode(true));
      return;
    }

    const list = document.createElement("ul");
    list.className = "feeds-list";
    list.setAttribute("role", "list");

    feeds.forEach((feed) => {
      const listItem = this.feedTemplate.content.cloneNode(
        true,
      ) as HTMLLIElement;

      listItem.firstElementChild!.classList.add(
        `feed_type_${feed.type.toLowerCase()}`,
      );
      listItem.querySelector(".feed__name")!.textContent =
        `[${feed.type.toUpperCase()}] ${deescapeHtml(feed.title)}`;
      listItem.querySelector(".feed__open")!.setAttribute("href", feed.href);
      listItem
        .querySelector(".feed__copy")!
        .setAttribute("data-link", feed.href);

      list.appendChild(listItem);
    });

    this.replaceChildren(list);
  }
}

export type FeedListComponent = FeedListComponentImpl;

customElements.define("feed-list", FeedListComponentImpl);
