# Using Fadeworn UI in Another Project

Fadeworn UI is currently distributed as source code, not as an npm package. This guide explains how to reuse the implementation without treating the showcase as a packaged component library.

## Choose an integration approach

### Reuse the complete specimen system

Choose this approach when you want the existing controls, material treatments, reset behavior, and inspector data.

Start by copying these files into a Next.js or React project:

```text
components/wear/
components/ui/button.tsx
components/ui/card.tsx
components/ui/checkbox.tsx
components/ui/input.tsx
components/ui/radio-group.tsx
components/ui/scroll-area.tsx
components/ui/slider.tsx
components/ui/switch.tsx
components/ui/tabs.tsx
hooks/use-wear-system.ts
lib/utils.ts
```

The source expects the `@/*` import alias to point to the project root. Keep that alias, or change the imports to match your project structure.

The specimen files use the following runtime dependencies:

```bash
npm install radix-ui lucide-react class-variance-authority clsx tailwind-merge
```

They also use Tailwind CSS utility classes. The reference project uses Tailwind CSS 4 and `tw-animate-css`; merge those tools into your existing styling setup rather than replacing a working project configuration.

Finally, merge the styles you need from `app/globals.css`. A complete specimen needs:

- the color variables under `:root` and their `@theme inline` mappings, unless your project supplies equivalent tokens;
- the shared `.specimen-*` and `.control-bay` rules;
- the rules for the selected control, such as `.lab-push-button` or `.lab-scroll-area`;
- the relevant responsive and reduced-motion rules near the end of the stylesheet.

Do not replace an existing global stylesheet without reviewing the shared `html`, `body`, `a`, and focus rules. They are part of the showcase theme, not requirements of the wear-state engine.

### Reuse only the wear-state engine

Choose this approach when you want your own components and visual design. Copy `hooks/use-wear-system.ts`, then connect the returned records and mutation functions to your controls.

```tsx
"use client";

import { useWearSystem } from "@/hooks/use-wear-system";

export function WearAwareAction() {
  const { wearState, markUse, resetOne } = useWearSystem();
  const record = wearState.button;

  return (
    <div
      className="wear-aware-surface"
      style={{ "--wear": record.wearLevel } as React.CSSProperties}
    >
      <button onClick={() => markUse("button")}>Run action</button>
      <button onClick={() => resetOne("button")}>Reset wear</button>
      <span>{record.usageCount} uses</span>
    </div>
  );
}
```

Your CSS can consume the custom property in any way that preserves legibility:

```css
.wear-aware-surface {
  background-color: color-mix(
    in srgb,
    var(--surface-worn) calc(var(--wear) * 100%),
    var(--surface-new)
  );
}
```

The example uses the existing `button` record. To model a new kind of component, add an id to `COMPONENT_IDS`, define its increment and initial state, and decide how `getWearLevelForDisplay` should normalize it. [WEAR-SYSTEM.md](WEAR-SYSTEM.md#extending-it) covers those steps.

## Connect an existing specimen

Each exported specimen receives its wear record and only the mutation functions it needs. A parent client component owns the hook:

```tsx
"use client";

import { WearSliderSpecimen } from "@/components/wear/linear-specimens";
import { useWearSystem } from "@/hooks/use-wear-system";

export function Example() {
  const { wearState, markUse, markTrace, resetOne } = useWearSystem();

  return (
    <WearSliderSpecimen
      record={wearState.slider}
      markUse={markUse}
      markTrace={markTrace}
      onReset={() => resetOne("slider")}
    />
  );
}
```

The full prop contract for every specimen is listed in [COMPONENTS.md](COMPONENTS.md).

## Pick the correct write function

| Interaction | Function | Typical use |
| --- | --- | --- |
| A use has no meaningful position | `markUse(id, intensity?)` | Buttons, cards, and grouped choices |
| The interaction occurs along a path or at an anchor | `markTrace(id, position, intensity?, countAsUse?)` | Sliders, tabs, navigation, and scrollbars |
| Text wear follows measured glyph positions | `markInputGlyph(start, end, intensity?)` | Text inputs |
| A value directly represents the wear amount | `setKnobWear(level)` | The rotary control |

Positions and levels are normalized to the `0–1` range.

## Presets and persistence

`useWearSystem()` starts with `createInitialWearState()`. The returned controls provide three reset paths:

- `applyInitialWear()` restores the curated showcase preset.
- `resetAll()` creates an unworn state for every record.
- `resetOne(id)` clears a single record.

State is intentionally session-only. If your product needs persistence, add it at the application boundary and keep the stored `WearState` schema versioned. Persistence is outside the scope of this reference implementation.

## Accessibility requirements

Wear should communicate interaction history without changing meaning or function:

- Keep text, focus indicators, active states, and hit targets legible at maximum wear.
- Do not use wear to indicate disabled, loading, selected, or error states.
- Preserve the original keyboard behavior and ARIA semantics of the underlying control.
- Provide a reduced-motion path for any transition introduced by the visual treatment.

## Maintaining a source-based integration

Copied source does not receive automatic updates. Record the commit you copied from, preserve the MIT license notice, and review upstream changes manually when upgrading. If the project later publishes a versioned package, this document will be updated with a package-based installation path.
