# Contributing

Thank you for your interest in Fadeworn UI. The project is intentionally focused, so small, well-defined contributions are the easiest to review.

## Before you start

- Search existing issues and pull requests before opening a duplicate.
- Open an issue first for a new component, a major visual change, or a change to the wear-state model.
- Keep pull requests focused on one problem. Unrelated cleanup should be submitted separately.
- Treat the interface copy as part of the design. Do not rewrite page text unless the change has been discussed explicitly.

## Local setup

Node.js 22.13 or newer is required.

```bash
git clone https://github.com/fang520huang-lgtm/Fadeworn-UI.git
cd Fadeworn-UI
npm install
npm run dev
```

The development server runs at [http://localhost:5173](http://localhost:5173).

## Project layout

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Showcase composition and page content |
| `app/globals.css` | Layout, materials, and wear rendering |
| `components/wear/` | Wear-aware specimen implementations |
| `components/ui/` | Shared shadcn/ui and Radix UI primitives |
| `hooks/use-wear-system.ts` | Wear records, interaction mapping, and presets |
| `docs/` | Usage, component, system, and deployment documentation |

## Design constraints

- **Wear records history, not state.** Never use it to communicate disabled, selected, loading, or error states.
- **Function must survive wear.** Labels, focus indicators, keyboard behavior, and hit targets must remain clear at maximum wear.
- **Interaction mappings should be explainable.** A contributor should be able to describe where wear appears and which action causes it in one or two sentences.
- **Materials should behave consistently.** Extend the existing visual language unless a proposal establishes a clear reason for a new material.
- **Motion must be optional.** Respect `prefers-reduced-motion` for every new transition or animation.
- **Wear remains session-only in the showcase.** Persistent product behavior belongs in an integrating application, not in the demo.

## Adding a specimen

1. Implement it in `components/wear/`. Add a lower-level primitive to `components/ui/` only when it is reusable outside the specimen.
2. Add the specimen to the grid in `app/page.tsx` and give `SpecimenFrame` the matching component id.
3. Register the id in `COMPONENT_IDS`, its increment table, its initial state, and any display normalization in `hooks/use-wear-system.ts`.
4. Verify pointer, keyboard, and reduced-motion behavior at both zero and maximum wear.
5. Document the component in `README.md` and `docs/COMPONENTS.md`.

## Required checks

Run these commands before opening a pull request:

```bash
npm run lint
npm run build
npm run build:static
```

For changes that affect interaction or layout, also test the production-style static output:

```bash
npx serve out
```

Describe the browsers and interaction paths you tested in the pull request. Include before-and-after screenshots for visual changes.

## Code and documentation style

- Use English for identifiers, comments, documentation, commit messages, and interface copy.
- Prefer direct, specific explanations over promotional language.
- Keep code comments focused on constraints or decisions that are not obvious from the implementation.
- Use short imperative commit subjects, such as `Fix scrollbar thumb tracking` or `Document glyph wear mapping`.

## Pull requests

A pull request should explain:

- what changed;
- why the change is needed;
- how it was tested;
- whether it changes any wear mapping, preset, or accessibility behavior.

By contributing, you agree that your contribution may be distributed under the repository's [PolyForm Noncommercial License 1.0.0](LICENSE). Do not submit code that you do not have the right to contribute under those terms.
