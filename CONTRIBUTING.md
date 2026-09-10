# Contributing

Thanks for looking. This project is small on purpose, so contributions are easy to review.

## Getting set up

```bash
npm install
npm run dev      # http://localhost:5173
```

Before opening a pull request, run both checks:

```bash
npm run lint
npm run build
```

## Where things live

| Path | What belongs there |
| --- | --- |
| `app/page.tsx` | Composition of the lab page — sections, layout, copy. |
| `app/globals.css` | The visual system: materials, wear rendering, layout. |
| `components/wear/` | The interactive specimens. |
| `components/ui/` | Reusable primitives. Keep these close to stock shadcn/ui. |
| `hooks/use-wear-system.ts` | All wear state and the mapping from interaction to wear. |
| `lib/component-catalog.ts` | The component index data. |
| `docs/` | Reference documentation. |

## Adding a component

1. Build it in `components/wear/` (specimen) or `components/ui/` (primitive).
2. Register it in `lib/component-catalog.ts` with a slug, a summary, the interaction, the wear behaviour, and search keywords.
3. Add it to the grid in `app/page.tsx` if it is a specimen, and give it an anchor so the index can deep-link to it.
4. Update `README.md` and `docs/COMPONENTS.md` if you introduced a new concept.

## Rules that matter here

- **Wear is history, not state.** Never use wear to communicate disabled, error, or loading. A component at 100% wear must behave exactly like one at 0%.
- **Keep interaction legible.** If you cannot describe the mapping in one sentence — "each press fades the whole surface" — it is too clever.
- **Do not gate function behind wear.** Labels, focus rings, and hit targets survive every wear level.
- **Respect `prefers-reduced-motion`.** Animations must degrade to instant state changes.
- **No persistence.** Wear is session-only by design. Do not add localStorage or a backend for it.
- **Match the materials.** New specimens should use the existing paint, brass, rubber, fiber, and enamel language rather than inventing a new one.
- **Write in English.** Code comments, documentation, and UI copy are all English.

## Commit messages

Short imperative subject lines, for example `Add rotary wear readout` or `Fix glyph wear on IME commit`.

## License

By contributing you agree that your work is released under the [MIT License](LICENSE).
