import { createByTemplate } from "../utils.js";

class FailedStateComponentImpl extends HTMLElement {
  public onRefresh?: () => void;
  public setReason(reason: typeof this.reason) {
    this.reason = reason;

    if (this.isConnected) {
      this.render();
    }
  }

  private reason: "permission" | "other" = "other";
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
    let template = "failed-state";
    if (this.reason === "permission") {
      template = "failed-state_type_no-access";
    }

    this.replaceChildren(createByTemplate(template));
  }
}

export type FailedStateComponent = FailedStateComponentImpl;

customElements.define("failed-state", FailedStateComponentImpl);
