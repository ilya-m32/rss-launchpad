import type { PageStateResult } from "../types";

(function (): PageStateResult {
  const generator = document.head.querySelector<HTMLMetaElement>('meta[name="generator"]')?.content;

  return {
    url: window.location.href,
    siteType: {
      isWordpressBased: !!(generator && /wordpress/i.test(generator)),
    },
  };
})();
