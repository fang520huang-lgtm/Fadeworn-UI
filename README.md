# Fadeworn UI

**An interface that remembers how it was used.**

[中文说明 / Chinese README](README.zh-CN.md)

Fadeworn UI is an interaction experiment about interfaces that record their own history. Clicks, drags, selections, typing, and scrolling alter each control through material-specific wear instead of decorative random distress.

The showcase opens with a curated initial-wear preset. Its state is session-only: refreshing the page restores that preset, while **No Wear** clears every surface for a clean comparison.

> The interface remembers how it was used, until there is nothing left to remember.

---

## Find a component

There are twenty components, and two ways to look them up:

- **In the app:** open [`/directory`](http://localhost:5173/directory) once the dev server is running. It has free-text search, family filters, clickable keyword chips, and a deep link to each specimen.
- **In the repo:** read [docs/COMPONENTS.md](docs/COMPONENTS.md) for the same catalog with source paths and props.

Search works in English and Chinese: try `knob`, `paper`, `brass`, or `旋钮`, `复选框`, `热力图`.

| # | Specimen | 中文 | Material | Records |
| --- | --- | --- | --- | --- |
| 01 | [Actuation Button](docs/COMPONENTS.md#01--actuation-button--触发按钮) | 触发按钮 | Painted steel | Press count → uniform surface fade |
| 02 | [Two-State Lever](docs/COMPONENTS.md#02--two-state-lever--双态拨杆) | 双态拨杆 | Bakelite | Rest-side friction |
| 03 | [Linear Calibrator](docs/COMPONENTS.md#03--linear-calibrator--线性校准器) | 线性校准器 | Brass / rubber | Travel friction heatmap |
| 04 | [Field Terminal](docs/COMPONENTS.md#04--field-terminal--输入终端) | 输入终端 | Anodized alloy | Glyph-position abrasion |
| 05 | [Mode Register](docs/COMPONENTS.md#05--mode-register--模式寄存器) | 模式寄存器 | Printed ABS | Per-tab frequency exposure |
| 06 | [Navigation Rail](docs/COMPONENTS.md#06--navigation-rail--导航栏) | 导航栏 | Powder coat | Per-route contact wear |
| 07 | [Reference Folio](docs/COMPONENTS.md#07--reference-folio--档案卡片) | 档案卡片 | Archival paper | Fiber wear and oxidation |
| 08 | [Selection Bank](docs/COMPONENTS.md#08--selection-bank--选择组) | 选择组 | Enameled metal | Contact halo |
| 09 | [Travel Log](docs/COMPONENTS.md#09--travel-log--滚动日志) | 滚动日志 | Machined rail | Scroll path memory |
| 10 | [Rotary Attenuator](docs/COMPONENTS.md#10--rotary-attenuator--旋钮衰减器) | 旋钮衰减器 | Knurled aluminum | Direct wear control |

Ten reusable primitives live alongside them in `components/ui/` — button, card, input, checkbox, radio group, switch, slider, tabs, scroll area, and alert dialog. They are stock shadcn/ui on Radix and carry no wear logic of their own; the specimens wrap them and drive the wear rendering through CSS custom properties. See the [full catalog](docs/COMPONENTS.md) for every export and prop.

---

## Run locally

Fadeworn UI requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). If the development server is already running, Windows users can also double-click `Open Fadeworn UI.html` in the project root.

## Quality checks

```bash
npm run lint
npm run build
```

## Deploy

Every route is fully static, so this project runs on any static host.

| Target | How |
| --- | --- |
| **GitHub Pages** | Push to `master`. The included workflow builds and publishes to `https://<user>.github.io/Fadeworn-UI/`. Enable it once under **Settings → Pages → Source: GitHub Actions**. |
| **Vercel / Cloudflare Pages** | Import the repository, keep the build command `npm run build`, and deploy. Zero configuration. |
| **Any static host** | `npm run build:static` writes a self-contained site to `out/`. |

For custom domains, DNS records, ICP filing notes, and where to buy a domain, see [docs/DEPLOYMENT.zh-CN.md](docs/DEPLOYMENT.zh-CN.md) (written in Chinese).

---

## Project structure

```text
app/
  layout.tsx                Page metadata and document shell
  page.tsx                  Showcase composition
  directory/page.tsx        Searchable component index ( /directory )
  globals.css               Visual system, materials, wear rendering
components/
  ui/                       Reusable UI primitives
  wear/                     Ten interactive specimens and shared frame
hooks/
  use-wear-system.ts        Wear state, interaction mapping, and presets
lib/
  component-catalog.ts      Component index data (drives /directory and docs)
docs/
  COMPONENTS.md             Component reference
  WEAR-SYSTEM.md            How wear works
  DEPLOYMENT.zh-CN.md       Deployment and domain guide
public/
  knob-bezel-wear.svg       Fixed-ring wear texture for the rotary control
  favicon.svg
```

### How the index stays in sync

`lib/component-catalog.ts` is the single source of truth. `/directory` renders it directly, and `docs/COMPONENTS.md` mirrors it for readers on GitHub. Adding one entry there makes a component searchable in both places.

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
