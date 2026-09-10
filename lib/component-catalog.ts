/**
 * Component catalog — the single source of truth for looking up every
 * component that ships with Fadeworn UI.
 *
 * Two families live in this project:
 *   - "specimen": the ten interactive wear demos in `components/wear/`
 *   - "primitive": the reusable, unmodified shadcn/Radix building blocks in `components/ui/`
 *
 * The interactive directory at `/directory` and the Markdown reference in
 * `docs/COMPONENTS.md` are both derived from this list, so adding an entry here
 * is enough to make a component findable.
 */

export type CatalogKind = "specimen" | "primitive";

export type CatalogEntry = {
  /** Stable anchor + `/directory` deep link fragment. */
  slug: string;
  /** Display order, "01"–"20". */
  index: string;
  kind: CatalogKind;
  /** English display name. */
  name: string;
  /** Exported symbols that consumers import. */
  exports: string[];
  /** Repository-relative source path. */
  file: string;
  /** Physical material the specimen imitates. */
  material?: string;
  /** Short caption shown on the specimen frame footer. */
  note?: string;
  summary: string;
  interaction: string;
  wear: string;
  /** Curated preset wear when the page first loads, 0–100. */
  initialWear?: number;
  /** Notable props / composition helpers worth knowing before you search the source. */
  api?: string[];
  /** Extra search terms: aliases, material, control type, file name. */
  keywords: string[];
};

export const REPO = {
  owner: "fang520huang-lgtm",
  name: "Fadeworn-UI",
  url: "https://github.com/fang520huang-lgtm/Fadeworn-UI",
  branch: "master",
} as const;

export function sourceUrl(file: string) {
  return `${REPO.url}/blob/${REPO.branch}/${file}`;
}

export const SPECIMEN_ENTRIES: CatalogEntry[] = [
  {
    slug: "specimen-button",
    index: "01",
    kind: "specimen",
    name: "Actuation Button",
    exports: ["WearButtonSpecimen"],
    file: "components/wear/action-specimens.tsx",
    material: "PAINTED STEEL",
    note: "UNIFORM SURFACE FADE",
    summary: "A single push button that records how many times it has been pressed.",
    interaction: "Press the ENGAGE button.",
    wear: "Every press adds a flat increment (0.034) to the wear level, so the whole painted surface fades evenly instead of wearing in one spot.",
    initialWear: 62,
    api: ["record: WearRecord", "markUse(id, intensity?)", "onReset()"],
    keywords: ["button", "press", "click", "push", "paint", "painted steel", "action"],
  },
  {
    slug: "specimen-toggle",
    index: "02",
    kind: "specimen",
    name: "Two-State Lever",
    exports: ["WearToggleSpecimen"],
    file: "components/wear/action-specimens.tsx",
    material: "BAKELITE",
    note: "REST-SIDE FRICTION",
    summary: "A switch that wears the material beside whichever side the lever rests on.",
    interaction: "Toggle the lever between OFF and ON.",
    wear: "Wear lands on the trace segments next to the resting side — indices 3–5 for OFF, 18–20 for ON — so the baldest patch always reveals the position you prefer.",
    initialWear: 70,
    api: ["record: WearRecord", "markTrace(id, position, intensity?, countAsUse?)", "onReset()"],
    keywords: ["switch", "toggle", "lever", "bakelite", "off", "on", "two state", "action"],
  },
  {
    slug: "specimen-slider",
    index: "03",
    kind: "specimen",
    name: "Linear Calibrator",
    exports: ["WearSliderSpecimen"],
    file: "components/wear/linear-specimens.tsx",
    material: "BRASS / RUBBER",
    note: "TRAVEL HEATMAP",
    summary: "A slider whose rail builds a continuous friction map from the paths you drag.",
    interaction: "Drag the handle; releasing counts as a completed actuation.",
    wear: "`markTrace` deposits wear along the travel path on every change, and `markUse` adds a larger increment when the drag is committed.",
    initialWear: 92,
    api: ["record: WearRecord", "traceGradient(trace, color?, baseAlpha?)", "onReset()"],
    keywords: ["slider", "range", "drag", "travel", "heatmap", "brass", "rubber", "linear"],
  },
  {
    slug: "specimen-input",
    index: "04",
    kind: "specimen",
    name: "Field Terminal",
    exports: ["WearInputSpecimen"],
    file: "components/wear/action-specimens.tsx",
    material: "ANODIZED ALLOY",
    note: "GLYPH-POSITION ABRASION",
    summary: "A text field that wears only the horizontal band each typed glyph occupies.",
    interaction: "Type or erase text. IME composition is handled so composed input wears on commit.",
    wear: "Glyph width is measured on a canvas, so wear zones follow real font metrics rather than a fixed character grid. Erasing wears the removed position too — both directions leave evidence.",
    initialWear: 70,
    api: ["record: WearRecord", "markInputGlyph(start, end, intensity?)", "onReset()"],
    keywords: ["input", "text", "type", "erase", "glyph", "ime", "field", "terminal", "font metrics"],
  },
  {
    slug: "specimen-tabs",
    index: "05",
    kind: "specimen",
    name: "Mode Register",
    exports: ["WearTabsSpecimen"],
    file: "components/wear/navigation-specimens.tsx",
    material: "PRINTED ABS",
    note: "FREQUENCY EXPOSURE",
    summary: "Tabs that each fade independently according to how often you pick them.",
    interaction: "Select SIGNAL, HISTORY, or NOTES.",
    wear: "Each tab owns a discrete peak in the shared trace array (indices 0, 12, 23), so the three tabs never share wear.",
    initialWear: 100,
    api: ["record: WearRecord", "markTrace(id, position, intensity?, countAsUse?)", "onReset()"],
    keywords: ["tabs", "tab", "segmented", "frequency", "register", "mode", "abs"],
  },
  {
    slug: "specimen-navigation",
    index: "06",
    kind: "specimen",
    name: "Navigation Rail",
    exports: ["WearNavigationSpecimen"],
    file: "components/wear/navigation-specimens.tsx",
    material: "POWDER COAT",
    note: "ROUTE FREQUENCY",
    summary: "A four-item nav rail where each destination develops its own local contact wear.",
    interaction: "Choose MONITOR, ARCHIVE, CHANNELS, or CONFIG.",
    wear: "Four route anchors sit at indices 0, 8, 15, and 23; selecting a route raises that anchor plus a soft shoulder on its immediate neighbours.",
    initialWear: 98,
    api: ["record: WearRecord", "markTrace(id, position, intensity?, countAsUse?)", "onReset()"],
    keywords: ["navigation", "nav", "rail", "menu", "route", "powder coat", "sidebar"],
  },
  {
    slug: "specimen-card",
    index: "07",
    kind: "specimen",
    name: "Reference Folio",
    exports: ["WearCardSpecimen"],
    file: "components/wear/object-specimens.tsx",
    material: "ARCHIVAL PAPER",
    note: "FIBER WEAR / OXIDATION",
    summary: "An expandable paper card that yellows and softens as it is reopened.",
    interaction: "Click, or press Enter / Space, to open and close the folio.",
    wear: "Each opening adds 0.1 of the folio budget, but the visual effect is capped at 62% so the case file stays readable no matter how often it is opened.",
    initialWear: 70,
    api: ["record: WearRecord", "markUse(id, intensity?)", "onReset()"],
    keywords: ["card", "folio", "paper", "open", "expand", "accordion", "archival", "object"],
  },
  {
    slug: "specimen-choice",
    index: "08",
    kind: "specimen",
    name: "Selection Bank",
    exports: ["WearChoiceSpecimen"],
    file: "components/wear/action-specimens.tsx",
    material: "ENAMELED METAL",
    note: "CONTACT HALO",
    summary: "A checkbox and a radio pair that grow a shared contact halo as they are selected.",
    interaction: "Tick LOG TRAJECTORY, or switch between SOFT and HARD.",
    wear: "Both controls write into the same `choice` record, so the halo reflects total selection activity across the bank.",
    initialWear: 70,
    api: ["record: WearRecord", "markUse(id, intensity?)", "onReset()"],
    keywords: ["checkbox", "radio", "choice", "selection", "halo", "enamel", "bank"],
  },
  {
    slug: "specimen-scrollbar",
    index: "09",
    kind: "specimen",
    name: "Travel Log",
    exports: ["WearScrollbarSpecimen"],
    file: "components/wear/linear-specimens.tsx",
    material: "MACHINED RAIL",
    note: "SCROLL PATH MEMORY",
    summary: "A scroll region that polishes the sections your thumb actually travelled through.",
    interaction: "Scroll inside the log sheet.",
    wear: "Scroll position is sampled at most every 80 ms; faster travel deposits more wear at that position, and long jumps also count as an actuation.",
    initialWear: 78,
    api: ["record: WearRecord", "markUse(id, intensity?)", "markTrace(id, position, intensity?, countAsUse?)"],
    keywords: ["scroll", "scrollbar", "scroll area", "rail", "overflow", "travel", "log"],
  },
  {
    slug: "specimen-knob",
    index: "10",
    kind: "specimen",
    name: "Rotary Attenuator",
    exports: ["WearKnobSpecimen"],
    file: "components/wear/object-specimens.tsx",
    material: "KNURLED ALUMINUM",
    note: "DIRECT WEAR CONTROL",
    summary: "A rotary knob that dials its own wear level directly instead of accumulating it.",
    interaction: "Drag the knob, or use the left / right arrow keys for 2% steps.",
    wear: "This is the one specimen where position *is* the wear level: the conic-gradient bezel, the rotor finish, and the readout all follow the same 0–100 value.",
    initialWear: 62,
    api: ["record: WearRecord", "setKnobWear(level)", "markUse(id, intensity?)", "onReset()"],
    keywords: ["knob", "rotary", "dial", "attenuator", "drag", "aluminum", "bezel"],
  },
];

export const PRIMITIVE_ENTRIES: CatalogEntry[] = [
  {
    slug: "ui-alert-dialog",
    index: "11",
    kind: "primitive",
    name: "Alert Dialog",
    exports: [
      "AlertDialog",
      "AlertDialogTrigger",
      "AlertDialogPortal",
      "AlertDialogOverlay",
      "AlertDialogContent",
      "AlertDialogHeader",
      "AlertDialogFooter",
      "AlertDialogTitle",
      "AlertDialogDescription",
      "AlertDialogMedia",
      "AlertDialogAction",
      "AlertDialogCancel",
    ],
    file: "components/ui/alert-dialog.tsx",
    summary: "Modal confirmation surface built on Radix Alert Dialog, for irreversible or blocking decisions.",
    interaction: "Trigger opens the overlay; Action and Cancel close it.",
    wear: "Not wear-aware — a modal is a decision surface, not a surface that remembers use.",
    api: [
      "Compose: Header > Media + Title + Description",
      "Action / Cancel reuse Button variants",
    ],
    keywords: ["dialog", "modal", "alert", "confirm", "radix", "overlay"],
  },
  {
    slug: "ui-button",
    index: "12",
    kind: "primitive",
    name: "Button",
    exports: ["Button", "buttonVariants"],
    file: "components/ui/button.tsx",
    summary: "Variant-driven button. The wear specimens build their painted-metal push button on top of it.",
    interaction: "Standard click / keyboard activation; supports `asChild` to render as a link.",
    wear: "Not wear-aware by itself — pass a className and drive the surface from a WearRecord.",
    api: [
      "variant: default | destructive | outline | secondary | ghost | link",
      "size: default | sm | lg | icon | icon-xs | icon-sm | icon-lg",
      "asChild?: boolean",
    ],
    keywords: ["button", "cta", "variant", "buttonVariants", "asChild"],
  },
  {
    slug: "ui-card",
    index: "13",
    kind: "primitive",
    name: "Card",
    exports: [
      "Card",
      "CardHeader",
      "CardTitle",
      "CardDescription",
      "CardAction",
      "CardContent",
      "CardFooter",
    ],
    file: "components/ui/card.tsx",
    summary: "Container surface for grouped content. SpecimenFrame composes Card + CardHeader + CardContent + footer.",
    interaction: "Presentational only; the folio specimen adds role=\"button\" and keyboard handling itself.",
    wear: "Not wear-aware — SpecimenFrame pushes `--level` into a custom property for the CSS wear rendering.",
    api: ["CardAction renders top-right header slot", "data-slot attributes on every part"],
    keywords: ["card", "panel", "container", "surface", "group"],
  },
  {
    slug: "ui-checkbox",
    index: "14",
    kind: "primitive",
    name: "Checkbox",
    exports: ["Checkbox"],
    file: "components/ui/checkbox.tsx",
    summary: "Radix Checkbox with the checked indicator, used by the Selection Bank specimen.",
    interaction: "Click or Space toggles; onCheckedChange reports boolean.",
    wear: "Not wear-aware — the specimen wraps it in a `.choice-contact` halo.",
    api: ["checked / defaultChecked / onCheckedChange", "disabled, aria-invalid states"],
    keywords: ["checkbox", "tick", "check", "radix", "boolean"],
  },
  {
    slug: "ui-input",
    index: "15",
    kind: "primitive",
    name: "Input",
    exports: ["Input"],
    file: "components/ui/input.tsx",
    summary: "Text input with focus ring and invalid styling; the Field Terminal measures glyphs against it.",
    interaction: "Native input props; supports onChange, onCompositionStart/End for IME.",
    wear: "Not wear-aware — glyph-position wear is drawn by a sibling overlay track.",
    api: ["Forwards ref (used for canvas font measurement)", "type, placeholder, aria-invalid"],
    keywords: ["input", "text", "field", "form", "form field"],
  },
  {
    slug: "ui-radio-group",
    index: "16",
    kind: "primitive",
    name: "Radio Group",
    exports: ["RadioGroup", "RadioGroupItem"],
    file: "components/ui/radio-group.tsx",
    summary: "Radix Radio Group pair used by the Selection Bank for mutually exclusive modes.",
    interaction: "Arrow keys move the selection; onValueChange reports the value.",
    wear: "Not wear-aware — shares the specimen's contact halo.",
    api: ["value / defaultValue / onValueChange", "RadioGroupItem inherits native radio props"],
    keywords: ["radio", "radio group", "option", "radix", "exclusive"],
  },
  {
    slug: "ui-scroll-area",
    index: "17",
    kind: "primitive",
    name: "Scroll Area",
    exports: ["ScrollArea", "ScrollBar"],
    file: "components/ui/scroll-area.tsx",
    summary: "Styled scroll container. The Travel Log listens to its viewport to map scroll position into wear.",
    interaction: "Scrolls natively; `onScrollCapture` lets the specimen sample positions.",
    wear: "Not wear-aware — the specimen maps viewport scrollTop to the trace array.",
    api: ["type=\"always\" keeps the scrollbar visible for wear display", "data-slot=\"scroll-area-viewport\""],
    keywords: ["scroll", "scrollarea", "overflow", "viewport", "container"],
  },
  {
    slug: "ui-slider",
    index: "18",
    kind: "primitive",
    name: "Slider",
    exports: ["Slider"],
    file: "components/ui/slider.tsx",
    summary: "Radix Slider with multi-thumb support; drives the Linear Calibrator's travel heatmap.",
    interaction: "Drag or arrow-key the handle; onValueCommit fires once the drag ends.",
    wear: "Not wear-aware — onValueChange deposits path wear, onValueCommit adds the actuation.",
    api: ["value / defaultValue as number[]", "min, max, step, onValueCommit"],
    keywords: ["slider", "range", "thumb", "drag", "radix", "multi thumb"],
  },
  {
    slug: "ui-switch",
    index: "19",
    kind: "primitive",
    name: "Switch",
    exports: ["Switch"],
    file: "components/ui/switch.tsx",
    summary: "Radix Switch toggle; the Two-State Lever wraps it with a wear shell on both resting sides.",
    interaction: "Click or Space toggles; onCheckedChange reports the new state.",
    wear: "Not wear-aware — the specimen pushes --left-wear / --right-wear into the shell.",
    api: ["size: default | sm", "checked / onCheckedChange"],
    keywords: ["switch", "toggle", "on off", "radix", "state"],
  },
  {
    slug: "ui-tabs",
    index: "20",
    kind: "primitive",
    name: "Tabs",
    exports: ["Tabs", "TabsList", "TabsTrigger", "TabsContent", "tabsListVariants"],
    file: "components/ui/tabs.tsx",
    summary: "Radix Tabs with default and line list variants; the Mode Register exposes each tab's own wear.",
    interaction: "Click or arrow-key between triggers; onValueChange reports the active value.",
    wear: "Not wear-aware — each trigger receives a --tab-wear custom property.",
    api: ["TabsList variant: default | line", "orientation: horizontal | vertical"],
    keywords: ["tabs", "tab", "segmented", "radix", "panels"],
  },
];

export const COMPONENT_CATALOG: CatalogEntry[] = [
  ...SPECIMEN_ENTRIES,
  ...PRIMITIVE_ENTRIES,
];

export const CATALOG_FILTERS = [
  { id: "all", label: "ALL" },
  { id: "specimen", label: "SPECIMENS" },
  { id: "primitive", label: "PRIMITIVES" },
] as const;

export type CatalogFilterId = (typeof CATALOG_FILTERS)[number]["id"];

/** Free-text search across name, file, material, exports, API notes, and keywords. */
export function matchesQuery(entry: CatalogEntry, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    entry.slug,
    entry.index,
    entry.name,
    entry.file,
    entry.material ?? "",
    entry.note ?? "",
    entry.summary,
    entry.interaction,
    entry.wear,
    ...entry.exports,
    ...(entry.api ?? []),
    ...entry.keywords,
  ]
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((token) => haystack.includes(token));
}
