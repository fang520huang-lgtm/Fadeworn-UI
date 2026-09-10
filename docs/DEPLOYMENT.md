# Deployment

Fadeworn UI can be exported as HTML, CSS, and JavaScript and hosted without an application server. Interaction history remains in browser memory; the showcase does not require a database or backend API.

## Build the static site

```bash
npm install
npm run build:static
```

The command writes the deployable site to `out/`. Preview that directory before publishing:

```bash
npx serve out
```

The static build uses the `output: "export"` configuration in `next.config.ts`. Features that require a Next.js runtime, such as Server Actions, request-time headers, and dynamic server rendering, cannot be added without changing the deployment model. See the [Next.js static export guide](https://nextjs.org/docs/app/guides/static-exports) for the current list of supported features.

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. It builds and deploys the `out/` directory whenever a commit is pushed to `master` or `main`.

One-time repository setup:

1. Open **Settings → Pages** in the GitHub repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the **Actions** tab and confirm that the latest **Deploy to GitHub Pages** workflow completed successfully.

The project site is published at:

```text
https://fang520huang-lgtm.github.io/Fadeworn-UI/
```

### Why the workflow sets `PAGES_BASE_PATH`

A GitHub Pages project site is served below the repository name rather than at the domain root. The workflow therefore sets:

```text
PAGES_BASE_PATH=/Fadeworn-UI
```

`next.config.ts` uses that value for `basePath` and `assetPrefix`, ensuring that scripts, styles, and public assets load from the project subpath.

If the repository name changes, the workflow automatically uses the new name. If the site later moves to a domain root, remove the `PAGES_BASE_PATH` environment variable from the workflow before redeploying.

## Other static hosts

Any service that publishes a directory of static files can host the project. Use these settings:

| Setting | Value |
| --- | --- |
| Install command | `npm install` or `npm ci` |
| Build command | `npm run build:static` |
| Output directory | `out` |
| Node.js version | `22` |

For Cloudflare Pages, select the **Next.js (Static HTML Export)** preset and replace its build command with `npm run build:static` if necessary. Cloudflare documents this path in its [static Next.js deployment guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/). For a host that serves the site from a subpath, set `PAGES_BASE_PATH` to that path during the build. Leave it unset when the site is served from the domain root.

The default `npm run build` command is different: it creates the vinext/Cloudflare Workers build used by this repository's local runtime path. It is not the static directory described above.

## Custom domains

Configure the custom domain in the hosting provider first, then add the DNS records shown by that provider. Record types and verification steps vary by platform, so follow the provider's current instructions rather than copying fixed DNS values from this repository.

For GitHub Pages:

1. Open **Settings → Pages → Custom domain**.
2. Enter the domain and complete GitHub's DNS verification steps.
3. Enable **Enforce HTTPS** after the certificate is ready.
4. Remove `PAGES_BASE_PATH` from `.github/workflows/deploy-pages.yml`, because a custom domain serves this site from `/`.

GitHub's documentation explains the required DNS records for apex domains and subdomains: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Deployment checklist

Before publishing a change:

```bash
npm run lint
npm run build
npm run build:static
```

Then verify the production-style static preview:

- scripts, styles, SVG assets, and the favicon load successfully;
- every control responds to pointer and keyboard input;
- the scrollbar thumb remains aligned during dragging and wheel scrolling;
- the page works after a direct reload at the deployment URL;
- the GitHub Pages workflow finishes with both `build` and `deploy` jobs marked successful.

Do not commit `out/`; the deployment workflow generates it from source.
