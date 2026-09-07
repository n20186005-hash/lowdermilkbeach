// open-next.config.ts generated for @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const cloudflareConfig = defineCloudflareConfig({
  // For best results consider enabling R2 caching
  // See https://opennext.js.org/cloudflare/caching for more details
  // incrementalCache: r2IncrementalCache
});

export default {
  ...cloudflareConfig,
  // `package.json` aliases the `build` script to `opennextjs-cloudflare build`
  // so that a plain `npm run build` produces the OpenNext worker.
  // Therefore OpenNext must build the Next.js app directly (`next build`) instead
  // of running `npm run build`, which would recurse into `opennextjs-cloudflare build`.
  buildCommand: "next build",
};
