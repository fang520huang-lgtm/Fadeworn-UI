# Wear System

How Fadeworn UI turns interaction into history, and why that is not the same thing as state.

---

## The one rule

> Wear is history. Not state.

A disabled button, an error border, or a loading spinner describes what a control *currently is*. Wear describes what has *happened to* a control. That distinction drives every decision in this codebase:

- Wear never blocks interaction. At 100% wear, labels, focus rings, active states, and hit targets all behave exactly as they do at 0%.
- Wear is monotonic. It accumulates and is never decremented by normal use.
- Wear is session-only. Refreshing restores the curated preset; nothing is written to storage or a server.

---

## Data model

Everything lives in one hook: [`hooks/use-wear-system.ts`](../hooks/use-wear-system.ts).

```ts
type WearRecord = {
  usageCount: number;              // how many actuations were recorded
  wearLevel: number;               // 0–1 scalar used by flat-increment components
  lastUsed: number | null;         // timestamp, or null if never touched
  trace: number[];                 // 24 segments for position-dependent wear
  glyphWear: InputGlyphWear[];     // per-glyph bands for the text field
};

type WearState = Record<ComponentId, WearRecord>;
```

`ComponentId` is a union of the ten specimen ids: `button`, `toggle`, `slider`, `input`, `tabs`, `navigation`, `card`, `choice`, `scrollbar`, `knob`.

---

## The three write channels

### 1. `markUse(id, intensity = 1)` — flat accumulation

For controls where "used once" is the only meaningful unit: button, card, choice.

| Component | Increment per use |
| --- | --- |
| `button` | `0.034` |
| `card` | `0.1` of a budget capped at 62% visual |
| `choice` | `0.035` |
| everything else | `increments[id]` |

It also increments `usageCount` and stamps `lastUsed`.

### 2. `markTrace(id, position, intensity = 1, countAsUse = false)` — positional accumulation

For controls where *where* you interacted matters: toggle, slider, tabs, navigation, scrollbar.

`position` is normalized to 0–1 and mapped onto the 24-segment `trace` array. The segment at that position takes the full increment; its immediate neighbours take a smaller one, which is what makes the heatmaps look like friction instead of dots.

Three components override the default spread:

| Component | Behaviour |
| --- | --- |
| `toggle` | Writes only to the resting side: indices 3–5 (OFF) or 18–20 (ON). |
| `tabs` | Three discrete peaks at indices 0, 12, 23 — one per tab. |
| `navigation` | Four anchors at indices 0, 8, 15, 23, each with a soft shoulder. |

Pass `countAsUse: true` when the trace deposit should also count as an actuation.

### 3. `markInputGlyph(start, end, intensity = 1)` — glyph-position accumulation

Exclusive to `input`. The Field Terminal measures each grapheme with canvas `measureText` against the input's computed font, converts the result to a 0–1 horizontal band, and records that band. Matching bands merge and accumulate; the list keeps the most recent 96 zones.

Erasing calls the same function for the removed range, so deletion leaves evidence too.

---

## Derived display level

A single `wearLevel` scalar cannot describe all ten components, so [`getWearLevelForDisplay(id, record)`](../hooks/use-wear-system.ts) normalizes each history for the inspector:

| Component | Displayed level comes from |
| --- | --- |
| `input` | Highest `glyphWear` zone |
| `tabs`, `navigation` | Highest of that component's visible trace anchors |
| `slider`, `scrollbar` | Highest segment in `trace` |
| `card` | `wearLevel` re-normalized against the 62% visual cap |
| `knob` | `max(wearLevel, …trace)` |
| all others | `wearLevel` |

This only affects what the **Wear Log** reports. It never changes how a component renders.

---

## Rendering

React never animates the wear surfaces. Components push numbers into CSS custom properties and the stylesheet does the rest:

| Custom property | Set by | Consumed by |
| --- | --- | --- |
| `--level` | `SpecimenFrame`, the folio | Painted-metal and paper finishes |
| `--left-wear`, `--right-wear` | Two-State Lever | Rest-side friction on the switch shell |
| `--tab-wear` | Mode Register | Per-tab fade |
| `--nav-wear` | Navigation Rail | Per-route contact wear |
| `--knob-wear`, `--knob-level` | Rotary Attenuator | Conic-gradient bezel and rotor finish |
| `--gauge` | Live Wear Monitor | Overall gauge sweep |

Everything else — slider heatmaps, the scroll rail, glyph zones — is generated as a gradient string by the component or by `traceGradient(trace, color?, baseAlpha?)`.

---

## Presets and reset

| Action | Effect |
| --- | --- |
| First load | `createInitialWearState()` — a curated preset so the lab never opens empty. |
| **INITIAL WEAR** | Re-applies that preset. |
| **NO WEAR** | `createFreshWearState()` — every surface cleared for comparison. |
| Per-specimen reset | `resetOne(id)` — one record returned to zero. |

State lives in `useState` only. There is no persistence layer, by design: the experiment is about a history you can observe, not one you accumulate forever.

---

## Accessibility

- Wear is decorative: it is expressed through custom properties consumed by background and shadow layers, never through text opacity or contrast.
- `prefers-reduced-motion: reduce` disables the transitions and the animated average readout.
- Every specimen keeps its ARIA role, label, and keyboard path at any wear level.
- The whole lab is operable without a pointer: buttons, switches, sliders, tabs, the folio, and the knob all respond to standard keyboard input.

---

## Extending it

To add a new wear-aware component:

1. Add its id to `COMPONENT_IDS` in `hooks/use-wear-system.ts`. TypeScript will then require an entry in `increments` and in the preset builder.
2. Choose a write channel — flat (`markUse`), positional (`markTrace`), or custom (add a function alongside `markInputGlyph`).
3. Decide how `getWearLevelForDisplay` should normalize it.
4. Render it by pushing a custom property into your element and styling the surface in `app/globals.css`.
5. Register it in [`lib/component-catalog.ts`](COMPONENTS.md) so it appears in the component index.
