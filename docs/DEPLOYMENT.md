# Deployment and Domains

This guide covers two things: **how to put the site on the public web**, and **how to point your own domain at it**.

It assumes the code is already pushed to the GitHub repository `fang520huang-lgtm/Fadeworn-UI`.

---

## First: this project runs as a pure static site

Every interaction lives in the browser. There is no database, no backend endpoint, and no server-rendered live data. The build output is just HTML, CSS, and JavaScript, which means it runs on any static host.

Three useful consequences:

- Hosting is free — the free tiers of every platform below are more than enough.
- Any static host works, with no platform-specific code.
- Visitors get plain files, so pages are fast and cannot fail because of a server error.

---

## Option A: GitHub Pages (free, built into the repository)

**Best for:** getting a working public URL without signing up for anything new.

The repository already contains `.github/workflows/deploy-pages.yml`. GitHub only needs to be told once that Pages should use it:

1. Open the repository → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Go to the **Actions** tab. The “Deploy to GitHub Pages” workflow runs on every push to `master`; if the last run failed at the *Configure Pages* step, click **Re-run all jobs**.

The workflow tries to enable Pages by itself, but GitHub only permits that for some accounts, so step 1 may be required once. After that, every push publishes automatically.

The site will be available at:

```text
https://fang520huang-lgtm.github.io/Fadeworn-UI/
```

### Using your own domain with GitHub Pages

1. In **Settings → Pages → Custom domain**, enter your domain, for example `fadeworn.com`, and save.
2. At your domain registrar, add DNS records.

   For the apex domain (`fadeworn.com`), add four A records:

   ```text
   A   @   185.199.108.153
   A   @   185.199.109.153
   A   @   185.199.110.153
   A   @   185.199.111.153
   ```

   For the subdomain (`www.fadeworn.com`), add one CNAME record:

   ```text
   CNAME   www   fang520huang-lgtm.github.io
   ```

3. Wait for DNS to propagate — usually 10 minutes to an hour, occasionally up to 24 hours.
4. Return to **Settings → Pages** and tick **Enforce HTTPS**.

GitHub issues and renews the HTTPS certificate for you; you never buy one.

> Note: GitHub Pages cannot issue a free certificate for every top-level domain ending (some country-code domains such as `.cn` are affected). If HTTPS cannot be enabled, use Option B instead.

---

## Option B: Vercel or Cloudflare Pages (recommended long term)

**Best for:** faster delivery, preview builds for every commit, and the smoothest custom-domain setup.

Both platforms work almost identically:

1. Open [vercel.com](https://vercel.com) or [pages.cloudflare.com](https://pages.cloudflare.com) and sign in with GitHub.
2. Choose **Import Git Repository** (Vercel) or **Create application → Pages → Connect to Git** (Cloudflare).
3. Select the `Fadeworn-UI` repository. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework | Next.js |
   | Build command | `npm run build` |
   | Output directory | Leave empty on Vercel; `out` on Cloudflare |
   | Node version | `22` |

4. Click **Deploy**. You get a free subdomain such as `fadeworn-ui.vercel.app` or `fadeworn-ui.pages.dev`.

After that, every `git push` rebuilds and publishes automatically, and each commit gets its own preview URL for sharing work in progress.

### Using your own domain with Vercel or Cloudflare

1. Buy a domain from a registrar (see the next section).
2. In the platform's **Domains** / **Custom domains** panel, add your domain.
3. The platform shows the DNS record to create. It is usually a single CNAME:

   ```text
   CNAME   @     cname.vercel-dns.com
   ```

   Cloudflare Pages may instead ask you to move the domain's nameservers to Cloudflare.
4. Save and wait for propagation. The platform issues and renews the HTTPS certificate automatically.

> Cloudflare's advantage: if you register the domain there and host DNS with them, pointing it at the site is a couple of clicks and you get their CDN. Vercel's advantage: the most complete Next.js support and the clearest UI.

---

## Where to buy a domain

| Registrar | Notes |
| --- | --- |
| [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) | Renews at cost with no markup; free DNS and CDN. The least fuss overall. |
| [Namecheap](https://www.namecheap.com/) | Friendly interface, frequent discounts, accepts most payment methods. |
| [Alibaba Cloud](https://wanwang.aliyun.com/) · [Tencent Cloud](https://dnspod.cloud.tencent.com/) | Convenient if you need mainland China hosting and filing. |

Typical pricing: a `.com` runs about 10–13 USD per year; `.dev` and `.app` are a little more.

### Two things that trip people up

1. **An apex domain cannot use a CNAME.** The DNS specification forbids it. GitHub Pages solves this with A records (listed above); Vercel and Cloudflare solve it with ANAME / ALIAS records or by hosting your DNS.
2. **Mainland China hosting requires an ICP filing.** If your domain points at a server located in mainland China (Alibaba Cloud ECS, Tencent Cloud, and so on), you must complete the filing first or traffic will be blocked. GitHub Pages, Vercel, and Cloudflare Pages are all hosted outside mainland China, so no filing is needed — but access speed from there depends on the network.

---

## Want the prettiest possible URL?

If you would rather publish at `fadeworn.com` than at `fang520huang-lgtm.github.io/Fadeworn-UI/`, the shortest path is:

1. Buy the domain at Cloudflare or Namecheap.
2. Deploy with Option B to Cloudflare Pages or Vercel.
3. Add the domain in the platform's **Domains** panel and create the DNS record it asks for.
4. Wait for the HTTPS certificate (usually a few minutes).

No code changes and no manual SSL certificates are involved.

---

## Verifying the deployment locally

Before pushing, you can check that the static output is correct:

```bash
# Plain local preview
npm run build:static
npx serve out          # or: python -m http.server 8099 --directory out

# Simulate the GitHub Pages project subpath
PAGES_BASE_PATH=/Fadeworn-UI npm run build:static
```

Open the address it prints and confirm that the page loads with its styles and images intact.

> `PAGES_BASE_PATH` is only needed when publishing to a project subpath such as `https://<user>.github.io/<repo>/`. When deploying to a domain root (Vercel, Cloudflare Pages, or a GitHub Pages custom domain), leave it unset — otherwise asset URLs gain an extra path segment.
