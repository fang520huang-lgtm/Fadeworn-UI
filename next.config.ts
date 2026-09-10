import type { NextConfig } from "next";

/**
 * Fadeworn UI has two build paths:
 *
 *   1. `npm run build`  — vinext + Cloudflare (see `vite.config.ts`). This is
 *      the default and does not read this file.
 *   2. `npm run build:static` — a plain Next.js static export used for GitHub
 *      Pages and any other static host. It sets `STATIC_EXPORT=1`.
 *
 * Every route is fully static, so the export needs no server runtime. Internal
 * links are written as relative hrefs, which is what keeps the same build
 * working both at a domain root and at a project subpath such as
 * `https://<user>.github.io/Fadeworn-UI/`.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

/**
 * GitHub Pages serves project sites from `https://<user>.github.io/<repo>/`,
 * so the emitted asset URLs need that prefix. The deploy workflow sets this to
 * `/Fadeworn-UI`. Leave it unset when deploying to a domain root (Vercel,
 * Cloudflare Pages, or a GitHub Pages custom domain) so assets resolve at `/`.
 */
const basePath = process.env.PAGES_BASE_PATH?.replace(/\/$/, "") || undefined;

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath,
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
