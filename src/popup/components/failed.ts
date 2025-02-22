import { createByTemplate } from "../utils.js";

class FailedStateComponentImpl extends HTMLElement {
  public onRefresh?: () => void;

  private onClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    this.onRefresh?.();
    target.disabled = true;
  };

  connectedCallback() {
    this.render();
    this.addEventListener("click", this.onClick);
  }

  render() {
    this.replaceChildren(createByTemplate("failed-state"));
  }
}

export type FailedStateComponent = FailedStateComponentImpl;

customElements.define("failed-state", FailedStateComponentImpl);
