# Components

The ten wear-aware specimens that make up Fadeworn UI. Each one lives in `components/wear/` and is rendered on the single page at the site root; select a row in the **Wear Log** to jump to it.

The `Preset` figure is the curated wear shown on first load. **INITIAL WEAR** restores it; **NO WEAR** clears every surface.

| # | Component | Export | Material | Preset |
| --- | --- | --- | --- | --- |
| 01 | [Actuation Button](#01--actuation-button) | `WearButtonSpecimen` | Painted steel | 62% |
| 02 | [Two-State Lever](#02--two-state-lever) | `WearToggleSpecimen` | Bakelite | 70% |
| 03 | [Linear Calibrator](#03--linear-calibrator) | `WearSliderSpecimen` | Brass / rubber | 92% |
| 04 | [Field Terminal](#04--field-terminal) | `WearInputSpecimen` | Anodized alloy | 70% |
| 05 | [Mode Register](#05--mode-register) | `WearTabsSpecimen` | Printed ABS | 100% |
| 06 | [Navigation Rail](#06--navigation-rail) | `WearNavigationSpecimen` | Powder coat | 98% |
| 07 | [Reference Folio](#07--reference-folio) | `WearCardSpecimen` | Archival paper | 70% |
| 08 | [Selection Bank](#08--selection-bank) | `WearChoiceSpecimen` | Enameled metal | 70% |
| 09 | [Travel Log](#09--travel-log) | `WearScrollbarSpecimen` | Machined rail | 78% |
| 10 | [Rotary Attenuator](#10--rotary-attenuator) | `WearKnobSpecimen` | Knurled aluminum | 62% |

Every specimen shares one frame. `SpecimenFrame` supplies the number, title, material, footer note, reset button, and the `--level` custom property that the stylesheet reads.

---

## 01 · Actuation Button

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearButtonSpecimen` |
| **Anchor** | `#specimen-button` |
| **Material** | Painted steel |
| **Use it** | Press the ENGAGE button. |
| **Wear** | Every press adds a flat increment (0.034) to the wear level, so the whole painted surface fades evenly instead of wearing in one spot. |
| **Preset** | 62% |
| **Props** | `record: WearRecord`, `markUse(id, intensity?)`, `onReset()` |

---

## 02 · Two-State Lever

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearToggleSpecimen` |
| **Anchor** | `#specimen-toggle` |
| **Material** | Bakelite |
| **Use it** | Toggle the lever between OFF and ON. |
| **Wear** | Wear lands on the trace segments next to the resting side — indices 3–5 for OFF, 18–20 for ON — so the baldest patch always reveals the position you prefer. |
| **Preset** | 70% |
| **Props** | `record: WearRecord`, `markTrace(id, position, intensity?, countAsUse?)`, `onReset()` |

---

## 03 · Linear Calibrator

| | |
| --- | --- |
| **Source** | `components/wear/linear-specimens.tsx` → `WearSliderSpecimen` |
| **Anchor** | `#specimen-slider` |
| **Material** | Brass / rubber |
| **Use it** | Drag the handle; releasing counts as a completed actuation. |
| **Wear** | `markTrace` deposits wear along the travel path on every change, and `markUse` adds a larger increment when the drag is committed. |
| **Preset** | 92% |
| **Props** | `record`, `markUse`, `markTrace`, `onReset()`; uses `traceGradient(trace, color?, baseAlpha?)` |

---

## 04 · Field Terminal

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearInputSpecimen` |
| **Anchor** | `#specimen-input` |
| **Material** | Anodized alloy |
| **Use it** | Type or erase text. IME composition is handled so composed input wears on commit. |
| **Wear** | Glyph width is measured on a canvas, so wear zones follow real font metrics rather than a fixed character grid. Erasing wears the removed position too — both directions leave evidence. |
| **Preset** | 70% |
| **Props** | `record`, `markInputGlyph(start, end, intensity?)`, `onReset()` |

---

## 05 · Mode Register

| | |
| --- | --- |
| **Source** | `components/wear/navigation-specimens.tsx` → `WearTabsSpecimen` |
| **Anchor** | `#specimen-tabs` |
| **Material** | Printed ABS |
| **Use it** | Select SIGNAL, HISTORY, or NOTES. |
| **Wear** | Each tab owns a discrete peak in the shared trace array (indices 0, 12, 23), so the three tabs never share wear. |
| **Preset** | 100% |
| **Props** | `record`, `markTrace`, `onReset()` |

---

## 06 · Navigation Rail

| | |
| --- | --- |
| **Source** | `components/wear/navigation-specimens.tsx` → `WearNavigationSpecimen` |
| **Anchor** | `#specimen-navigation` |
| **Material** | Powder coat |
| **Use it** | Choose MONITOR, ARCHIVE, CHANNELS, or CONFIG. |
| **Wear** | Four route anchors sit at indices 0, 8, 15, and 23; selecting a route raises that anchor plus a soft shoulder on its immediate neighbours. |
| **Preset** | 98% |
| **Props** | `record`, `markTrace`, `onReset()` |

---

## 07 · Reference Folio

| | |
| --- | --- |
| **Source** | `components/wear/object-specimens.tsx` → `WearCardSpecimen` |
| **Anchor** | `#specimen-card` |
| **Material** | Archival paper |
| **Use it** | Click, or press Enter / Space, to open and close the folio. |
| **Wear** | Each opening adds 0.1 of the folio budget, but the visual effect is capped at 62% so the case file stays readable no matter how often it is opened. |
| **Preset** | 70% |
| **Props** | `record`, `markUse`, `onReset()` |

---

## 08 · Selection Bank

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearChoiceSpecimen` |
| **Anchor** | `#specimen-choice` |
| **Material** | Enameled metal |
| **Use it** | Tick LOG TRAJECTORY, or switch between SOFT and HARD. |
| **Wear** | Both controls write into the same `choice` record, so the halo reflects total selection activity across the bank. |
| **Preset** | 70% |
| **Props** | `record`, `markUse`, `onReset()` |

---

## 09 · Travel Log

| | |
| --- | --- |
| **Source** | `components/wear/linear-specimens.tsx` → `WearScrollbarSpecimen` |
| **Anchor** | `#specimen-scrollbar` |
| **Material** | Machined rail |
| **Use it** | Scroll inside the log sheet. |
| **Wear** | Scroll position is sampled at most every 80 ms; faster travel deposits more wear at that position, and long jumps also count as an actuation. |
| **Preset** | 78% |
| **Props** | `record`, `markUse`, `markTrace`, `onReset()` |

---

## 10 · Rotary Attenuator

| | |
| --- | --- |
| **Source** | `components/wear/object-specimens.tsx` → `WearKnobSpecimen` |
| **Anchor** | `#specimen-knob` |
| **Material** | Knurled aluminum |
| **Use it** | Drag the knob, or use the left / right arrow keys for 2% steps. |
| **Wear** | This is the one specimen where position *is* the wear level: the conic-gradient bezel, the rotor finish, and the readout all follow the same 0–100 value. |
| **Preset** | 62% |
| **Props** | `record`, `setKnobWear(level)`, `markUse`, `onReset()` |

---

## Adding a component

1. Build it in `components/wear/`.
2. Add it to the grid in `app/page.tsx` and pass an `anchor` to `SpecimenFrame`.
3. Add its id to `COMPONENT_IDS` in `hooks/use-wear-system.ts`, then give it an entry in `increments`.
4. Document it here and in `README.md`.
