# Fadeworn UI

Fadeworn UI is an interaction experiment about interfaces that remember how they are used. Clicks, drags, selections, typing, and scrolling alter each control through material-specific wear instead of decorative random distress.

The showcase opens with a curated initial-wear preset. Its state is session-only: refreshing the page restores that preset, while **No Wear** clears every surface for a clean comparison.

## Specimens

1. **Actuation Button** — repeated presses polish the full painted surface.
2. **Two-State Lever** — movement wears the exposed material beside the lever.
3. **Linear Calibrator** — travel builds a continuous friction map along the rail.
4. **Field Terminal** — typing and erasing wear the positions occupied by each glyph.
5. **Mode Register** — frequently selected tabs fade independently.
6. **Navigation Rail** — commonly used destinations develop local contact wear.
7. **Reference Folio** — repeated opening yellows and softens the paper surface.
8. **Selection Bank** — checkbox and radio use creates a contact halo.
9. **Travel Log** — scrolling polishes the sections traversed by the handle.
10. **Rotary Attenuator** — dragging the knob directly controls its wear level.

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

## Project structure

```text
app/
  layout.tsx              Page metadata and document shell
  page.tsx                Showcase composition
  globals.css             Visual system, materials, wear rendering
components/
  ui/                     Reusable UI primitives
  wear/                   Ten interactive specimens and shared frame
hooks/
  use-wear-system.ts      Wear state, interaction mapping, and presets
public/
  knob-bezel-wear.svg     Fixed-ring wear texture for the rotary control
```

## Wear system

Every specimen owns a `WearRecord` with a usage count, overall wear level, last-use timestamp, and interaction-specific traces. Linear controls accumulate values across a segmented travel map, the terminal stores glyph-width-aware wear zones, and frequency-based controls keep independent local peaks.

`getWearLevelForDisplay` normalizes these different histories for the inspector without changing their visual behavior. The presentation therefore describes history, never disabled, error, or loading state.

## Design principle

> The interface remembers how it was used, until there is nothing left to remember.
