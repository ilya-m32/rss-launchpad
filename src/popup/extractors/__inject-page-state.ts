import type { PageStateResult } from "../types";

(function (): PageStateResult {
  return {
    url: window.location.href,
  };
})();
