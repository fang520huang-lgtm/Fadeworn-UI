# Fadeworn UI

**An interface that remembers how it was used.**

Fadeworn UI is an interaction experiment about interfaces that record their own history. Clicks, drags, selections, typing, and scrolling alter each control through material-specific wear instead of decorative random distress.

The showcase opens with a curated initial-wear preset. Its state is session-only: refreshing the page restores that preset, while **No Wear** clears every surface for a clean comparison.

> The interface remembers how it was used, until there is nothing left to remember.

---

## Run it

Fadeworn UI requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). That single page is the whole demo. If the development server is already running, Windows users can also double-click `Open Fadeworn UI.html` in the project root.

### Publish it

Every route is static, so the demo runs on any static host.

| Target | How |
| --- | --- |
| **GitHub Pages** | Push to `master`. The included workflow publishes to `https://fang520huang-lgtm.github.io/Fadeworn-UI/`. Enable Pages once under **Settings → Pages → Source: GitHub Actions**, then every push deploys automatically. |
| **Vercel / Cloudflare Pages** | Import the repository, keep the build command `npm run build`, and deploy. No configuration needed. |
| **Any static host** | `npm run build:static` writes a self-contained site to `out/`. |

For custom domains, DNS records, and where to buy a domain, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## The ten components

Search across names, file paths, materials, and behaviour: `knob`, `paper`, `brass`, `heatmap`, `glyph`, `halo`.

| # | Component | Material | Records |
| --- | --- | --- | --- |
| 01 | [Button](docs/COMPONENTS.md#01--button) | Painted steel | Press count → uniform surface fade |
| 02 | [Toggle](docs/COMPONENTS.md#02--toggle) | Bakelite | Rest-side friction |
| 03 | [Slider](docs/COMPONENTS.md#03--slider) | Brass / rubber | Travel friction heatmap |
| 04 | [Input](docs/COMPONENTS.md#04--input) | Anodized alloy | Glyph-position abrasion |
| 05 | [Tabs](docs/COMPONENTS.md#05--tabs) | Printed ABS | Per-tab frequency exposure |
| 06 | [Navigation](docs/COMPONENTS.md#06--navigation) | Powder coat | Per-route contact wear |
| 07 | [Card](docs/COMPONENTS.md#07--card) | Archival paper | Fiber wear and oxidation |
| 08 | [Checkbox / Radio](docs/COMPONENTS.md#08--checkbox--radio) | Enameled metal | Contact halo |
| 09 | [Scrollbar](docs/COMPONENTS.md#09--scrollbar) | Machined rail | Scroll path memory |
| 10 | [Knob](docs/COMPONENTS.md#10--knob) | Knurled aluminum | Direct wear control |

[docs/COMPONENTS.md](docs/COMPONENTS.md) documents each one in full: source file, anchor, interaction, wear behaviour, preset level, and props. Selecting a row in the Wear Log jumps to that specimen on the page.

---

## Project structure

```text
app/
  layout.tsx                Page metadata and document shell
  page.tsx                  The whole showcase: hero, specimens, wear log, notes
  globals.css               Visual system, materials, wear rendering
components/
  wear/                     The ten interactive specimens and their shared frame
  ui/                       Reusable shadcn/ui primitives they are built on
hooks/
  use-wear-system.ts        Wear state, interaction mapping, and presets
docs/
  COMPONENTS.md             Reference for the ten components
  WEAR-SYSTEM.md            How wear works
  DEPLOYMENT.md             Deployment and domain guide
public/
  knob-bezel-wear.svg       Fixed-ring wear texture for the rotary control
  favicon.svg
```

## Quality checks

```bash
npm run lint
npm run build
```

---

## Wear system

Every specimen owns a `WearRecord` with a usage count, overall wear level, last-use timestamp, and interaction-specific traces. Linear controls accumulate values across a segmented travel map, the terminal stores glyph-width-aware wear zones, and frequency-based controls keep independent local peaks.

Wear is written through three channels — `markUse` for flat accumulation, `markTrace` for positional accumulation, and `markInputGlyph` for glyph bands. `getWearLevelForDisplay` then normalizes these different histories for the inspector without changing their visual behaviour.

The presentation therefore describes history, never disabled, error, or loading state. At maximum wear, labels, active states, focus rings, and every control remain clear.

Read [docs/WEAR-SYSTEM.md](docs/WEAR-SYSTEM.md) for the data model, increments, rendering custom properties, presets, and accessibility notes.

## Design principle

> The interface remembers how it was used, until there is nothing left to remember.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The short version: wear is history, not state — keep it legible, keep it out of the way of function, and respect `prefers-reduced-motion`.

## License

[MIT](LICENSE).
