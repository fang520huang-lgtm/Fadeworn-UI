# Component Index

Every component in Fadeworn UI, in one place, so you can find it without reading the whole tree.

- **Interactive version:** run the app and open [`/directory`](http://localhost:5173/directory) — it has free-text search, family filters, and clickable keyword chips.
- **Source of truth:** [`lib/component-catalog.ts`](../lib/component-catalog.ts) drives both the in-app index and this document.

Two families live here:

| Family | Count | Location | What it is |
| --- | --- | --- | --- |
| **Specimens** | 10 | `components/wear/` | Interactive demos that record how you use them. |
| **Primitives** | 10 | `components/ui/` | Reusable building blocks (shadcn/ui + Radix). No wear logic of their own. |

---

## Quick reference

| # | Component | Exports | Source |
| --- | --- | --- | --- |
| 01 | Actuation Button | `WearButtonSpecimen` | [`action-specimens.tsx`](../components/wear/action-specimens.tsx) |
| 02 | Two-State Lever | `WearToggleSpecimen` | [`action-specimens.tsx`](../components/wear/action-specimens.tsx) |
| 03 | Linear Calibrator | `WearSliderSpecimen` | [`linear-specimens.tsx`](../components/wear/linear-specimens.tsx) |
| 04 | Field Terminal | `WearInputSpecimen` | [`action-specimens.tsx`](../components/wear/action-specimens.tsx) |
| 05 | Mode Register | `WearTabsSpecimen` | [`navigation-specimens.tsx`](../components/wear/navigation-specimens.tsx) |
| 06 | Navigation Rail | `WearNavigationSpecimen` | [`navigation-specimens.tsx`](../components/wear/navigation-specimens.tsx) |
| 07 | Reference Folio | `WearCardSpecimen` | [`object-specimens.tsx`](../components/wear/object-specimens.tsx) |
| 08 | Selection Bank | `WearChoiceSpecimen` | [`action-specimens.tsx`](../components/wear/action-specimens.tsx) |
| 09 | Travel Log | `WearScrollbarSpecimen` | [`linear-specimens.tsx`](../components/wear/linear-specimens.tsx) |
| 10 | Rotary Attenuator | `WearKnobSpecimen` | [`object-specimens.tsx`](../components/wear/object-specimens.tsx) |
| 11 | Alert Dialog | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogMedia`, `AlertDialogAction`, `AlertDialogCancel` | [`alert-dialog.tsx`](../components/ui/alert-dialog.tsx) |
| 12 | Button | `Button`, `buttonVariants` | [`button.tsx`](../components/ui/button.tsx) |
| 13 | Card | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` | [`card.tsx`](../components/ui/card.tsx) |
| 14 | Checkbox | `Checkbox` | [`checkbox.tsx`](../components/ui/checkbox.tsx) |
| 15 | Input | `Input` | [`input.tsx`](../components/ui/input.tsx) |
| 16 | Radio Group | `RadioGroup`, `RadioGroupItem` | [`radio-group.tsx`](../components/ui/radio-group.tsx) |
| 17 | Scroll Area | `ScrollArea`, `ScrollBar` | [`scroll-area.tsx`](../components/ui/scroll-area.tsx) |
| 18 | Slider | `Slider` | [`slider.tsx`](../components/ui/slider.tsx) |
| 19 | Switch | `Switch` | [`switch.tsx`](../components/ui/switch.tsx) |
| 20 | Tabs | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants` | [`tabs.tsx`](../components/ui/tabs.tsx) |

The `Preset` column below is the curated wear shown on first load. Pressing **INITIAL WEAR** restores it; **NO WEAR** clears every surface.

---

## Specimens

### 01 · Actuation Button

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearButtonSpecimen` |
| **Live demo** | `/#specimen-button` |
| **Material** | PAINTED STEEL |
| **Use it** | Press the ENGAGE button. |
| **Wear** | Every press adds a flat increment (0.034) to the wear level, so the whole painted surface fades evenly instead of wearing in one spot. |
| **Preset** | 62% |
| **Props** | `record: WearRecord`, `markUse(id, intensity?)`, `onReset()` |

### 02 · Two-State Lever

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearToggleSpecimen` |
| **Live demo** | `/#specimen-toggle` |
| **Material** | BAKELITE |
| **Use it** | Toggle the lever between OFF and ON. |
| **Wear** | Wear lands on the trace segments next to the resting side — indices 3–5 for OFF, 18–20 for ON — so the baldest patch always reveals the position you prefer. |
| **Preset** | 70% |
| **Props** | `record: WearRecord`, `markTrace(id, position, intensity?, countAsUse?)`, `onReset()` |

### 03 · Linear Calibrator

| | |
| --- | --- |
| **Source** | `components/wear/linear-specimens.tsx` → `WearSliderSpecimen` |
| **Live demo** | `/#specimen-slider` |
| **Material** | BRASS / RUBBER |
| **Use it** | Drag the handle; releasing counts as a completed actuation. |
| **Wear** | `markTrace` deposits wear along the travel path on every change, and `markUse` adds a larger increment when the drag is committed. |
| **Preset** | 92% |
| **Props** | `record`, `markUse`, `markTrace`, `onReset()`; uses `traceGradient(trace, color?, baseAlpha?)` |

### 04 · Field Terminal

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearInputSpecimen` |
| **Live demo** | `/#specimen-input` |
| **Material** | ANODIZED ALLOY |
| **Use it** | Type or erase text. IME composition is handled so composed input wears on commit. |
| **Wear** | Glyph width is measured on a canvas, so wear zones follow real font metrics rather than a fixed character grid. Erasing wears the removed position too — both directions leave evidence. |
| **Preset** | 70% |
| **Props** | `record`, `markInputGlyph(start, end, intensity?)`, `onReset()` |

### 05 · Mode Register

| | |
| --- | --- |
| **Source** | `components/wear/navigation-specimens.tsx` → `WearTabsSpecimen` |
| **Live demo** | `/#specimen-tabs` |
| **Material** | PRINTED ABS |
| **Use it** | Select SIGNAL, HISTORY, or NOTES. |
| **Wear** | Each tab owns a discrete peak in the shared trace array (indices 0, 12, 23), so the three tabs never share wear. |
| **Preset** | 100% |
| **Props** | `record`, `markTrace`, `onReset()` |

### 06 · Navigation Rail

| | |
| --- | --- |
| **Source** | `components/wear/navigation-specimens.tsx` → `WearNavigationSpecimen` |
| **Live demo** | `/#specimen-navigation` |
| **Material** | POWDER COAT |
| **Use it** | Choose MONITOR, ARCHIVE, CHANNELS, or CONFIG. |
| **Wear** | Four route anchors sit at indices 0, 8, 15, and 23; selecting a route raises that anchor plus a soft shoulder on its immediate neighbours. |
| **Preset** | 98% |
| **Props** | `record`, `markTrace`, `onReset()` |

### 07 · Reference Folio

| | |
| --- | --- |
| **Source** | `components/wear/object-specimens.tsx` → `WearCardSpecimen` |
| **Live demo** | `/#specimen-card` |
| **Material** | ARCHIVAL PAPER |
| **Use it** | Click, or press Enter / Space, to open and close the folio. |
| **Wear** | Each opening adds 0.1 of the folio budget, but the visual effect is capped at 62% so the case file stays readable no matter how often it is opened. |
| **Preset** | 70% |
| **Props** | `record`, `markUse`, `onReset()` |

### 08 · Selection Bank

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearChoiceSpecimen` |
| **Live demo** | `/#specimen-choice` |
| **Material** | ENAMELED METAL |
| **Use it** | Tick LOG TRAJECTORY, or switch between SOFT and HARD. |
| **Wear** | Both controls write into the same `choice` record, so the halo reflects total selection activity across the bank. |
| **Preset** | 70% |
| **Props** | `record`, `markUse`, `onReset()` |

### 09 · Travel Log

| | |
| --- | --- |
| **Source** | `components/wear/linear-specimens.tsx` → `WearScrollbarSpecimen` |
| **Live demo** | `/#specimen-scrollbar` |
| **Material** | MACHINED RAIL |
| **Use it** | Scroll inside the log sheet. |
| **Wear** | Scroll position is sampled at most every 80 ms; faster travel deposits more wear at that position, and long jumps also count as an actuation. |
| **Preset** | 78% |
| **Props** | `record`, `markUse`, `markTrace`, `onReset()` |

### 10 · Rotary Attenuator

| | |
| --- | --- |
| **Source** | `components/wear/object-specimens.tsx` → `WearKnobSpecimen` |
| **Live demo** | `/#specimen-knob` |
| **Material** | KNURLED ALUMINUM |
| **Use it** | Drag the knob, or use the left / right arrow keys for 2% steps. |
| **Wear** | This is the one specimen where position *is* the wear level: the conic-gradient bezel, the rotor finish, and the readout all follow the same 0–100 value. |
| **Preset** | 62% |
| **Props** | `record`, `setKnobWear(level)`, `markUse`, `onReset()` |

---

## Primitives

These are stock shadcn/ui components on Radix primitives. They are **not** wear-aware — the specimens wrap them and supply the custom properties that drive the wear rendering. Swap or restyle any of them without touching the wear system.

### 11 · Alert Dialog

`components/ui/alert-dialog.tsx`

Modal confirmation surface for irreversible or blocking decisions. Compose `Header > Media + Title + Description`; `Action` and `Cancel` reuse the Button variants.

### 12 · Button

`components/ui/button.tsx` — `Button`, `buttonVariants`

| Prop | Values |
| --- | --- |
| `variant` | `default` · `destructive` · `outline` · `secondary` · `ghost` · `link` |
| `size` | `default` · `sm` · `lg` · `icon` · `icon-xs` · `icon-sm` · `icon-lg` |
| `asChild` | `boolean` — render as a link or other element via Radix `Slot` |

The specimen's painted-metal push button is built on top of this.

### 13 · Card

`components/ui/card.tsx` — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`

`SpecimenFrame` composes the card family into the frame you see on the home page. `CardAction` renders the top-right header slot.

### 14 · Checkbox

`components/ui/checkbox.tsx` — `Checkbox`

Radix Checkbox with `checked` / `defaultChecked` / `onCheckedChange`, plus disabled and `aria-invalid` states. The Selection Bank wraps it in a `.choice-contact` halo.

### 15 · Input

`components/ui/input.tsx` — `Input`

Forwards its ref — the Field Terminal uses that to measure canvas font metrics. Supports `type`, `placeholder`, `aria-invalid`, and IME composition events.

### 16 · Radio Group

`components/ui/radio-group.tsx` — `RadioGroup`, `RadioGroupItem`

Arrow keys move the selection, `onValueChange` reports the value.

### 17 · Scroll Area

`components/ui/scroll-area.tsx` — `ScrollArea`, `ScrollBar`

`type="always"` keeps the scrollbar visible so wear can be displayed on it. The viewport carries `data-slot="scroll-area-viewport"`, which the Travel Log matches when sampling scroll position.

### 18 · Slider

`components/ui/slider.tsx` — `Slider`

`value` / `defaultValue` are `number[]` (multi-thumb capable). `onValueChange` deposits path wear; `onValueCommit` adds the actuation.

### 19 · Switch

`components/ui/switch.tsx` — `Switch`

`size` is `default` or `sm`. The Two-State Lever pushes `--left-wear` / `--right-wear` into the surrounding shell.

### 20 · Tabs

`components/ui/tabs.tsx` — `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants`

`TabsList` variant is `default` or `line`; orientation is `horizontal` or `vertical`. Each trigger receives a `--tab-wear` custom property.

---

## Adding a component to the index

1. Add an entry to `SPECIMEN_ENTRIES` or `PRIMITIVE_ENTRIES` in [`lib/component-catalog.ts`](../lib/component-catalog.ts).
2. Give it a unique `slug` and fill in `summary`, `interaction`, `wear`, and `keywords` — the keywords become the clickable filter chips, so include aliases a newcomer might type.
3. That is it. `/directory` picks it up automatically.
