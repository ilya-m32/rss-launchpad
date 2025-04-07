class NotificationComponentImpl extends HTMLElement {
  timeoutId: NodeJS.Timeout | number | null = null;

  connectedCallback() {
    this.addEventListener("click", () => this.clear());
    this.className = "notification";
  }

  show(text: string, timeout = 3000, onClear?: Function) {
    this.textContent = text;
    this.style.opacity = "1";
    this.style.transition = "opacity 0.5s, top 0.5s";
    this.style.top = "24px";
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.clear();
      onClear?.();
      this.remove();
    }, timeout);
  }

  clear() {
    this.style.opacity = "0";
    this.style.top = "0";
    this.timeoutId = null;
  }

  disconnectedCallback() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
  }
}

export type NotificationComponent = NotificationComponentImpl;

customElements.define("notification-component", NotificationComponentImpl);
