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
  /** Chinese display name. */
  nameZh: string;
  /** Exported symbols that consumers import. */
  exports: string[];
  /** Repository-relative source path. */
  file: string;
  /** Physical material the specimen imitates. */
  material?: string;
  /** Short caption shown on the specimen frame footer. */
  note?: string;
  summary: string;
  summaryZh: string;
  interaction: string;
  interactionZh: string;
  wear: string;
  wearZh: string;
  /** Curated preset wear when the page first loads, 0–100. */
  initialWear?: number;
  /** Notable props / composition helpers worth knowing before you search the source. */
  api?: string[];
  /** Extra search terms (aliases, Chinese keywords, material, file name). */
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
    nameZh: "触发按钮",
    exports: ["WearButtonSpecimen"],
    file: "components/wear/action-specimens.tsx",
    material: "PAINTED STEEL",
    note: "UNIFORM SURFACE FADE",
    summary: "A single push button that records how many times it has been pressed.",
    summaryZh: "最基础的按压控件，记录它被按下过多少次。",
    interaction: "Press the ENGAGE button.",
    interactionZh: "按下 ENGAGE 按钮。",
    wear: "Every press adds a flat increment (0.034) to the wear level, so the whole painted surface fades evenly instead of wearing in one spot.",
    wearZh: "每次按压累加固定磨损量（0.034），整块漆面均匀褪色，而不是局部磨损。",
    initialWear: 62,
    api: ["record: WearRecord", "markUse(id, intensity?)", "onReset()"],
    keywords: ["button", "press", "click", "paint", "painted steel", "按钮", "按压", "漆面"],
  },
  {
    slug: "specimen-toggle",
    index: "02",
    kind: "specimen",
    name: "Two-State Lever",
    nameZh: "双态拨杆",
    exports: ["WearToggleSpecimen"],
    file: "components/wear/action-specimens.tsx",
    material: "BAKELITE",
    note: "REST-SIDE FRICTION",
    summary: "A switch that wears the material beside whichever side the lever rests on.",
    summaryZh: "开关磨损集中在拨杆停靠的那一侧，而不是整体平均磨损。",
    interaction: "Toggle the lever between OFF and ON.",
    interactionZh: "在 OFF 与 ON 之间切换拨杆。",
    wear: "Wear lands on the trace segments next to the resting side — indices 3–5 for OFF, 18–20 for ON — so the baldest patch always reveals the preferred position.",
    wearZh: "磨损落在停靠一侧的轨迹段（OFF 对应索引 3–5，ON 对应索引 18–20），因此最亮的那块永远说明你更常用哪一档。",
    initialWear: 70,
    api: ["record: WearRecord", "markTrace(id, position, intensity?, countAsUse?)", "onReset()"],
    keywords: ["switch", "toggle", "lever", "bakelite", "off", "on", "拨杆", "开关", "两态", "胶木"],
  },
  {
    slug: "specimen-slider",
    index: "03",
    kind: "specimen",
    name: "Linear Calibrator",
    nameZh: "线性校准器",
    exports: ["WearSliderSpecimen"],
    file: "components/wear/linear-specimens.tsx",
    material: "BRASS / RUBBER",
    note: "TRAVEL HEATMAP",
    summary: "A slider whose rail builds a continuous friction map from the paths you drag.",
    summaryZh: "滑块轨道会把你拖动过的路径累积成一张连续的摩擦热力图。",
    interaction: "Drag the handle; releasing counts as a completed actuation.",
    interactionZh: "拖动滑块；松手时记为一次完整操作。",
    wear: "`markTrace` deposits wear along the travel path on every change, and `markUse` adds a larger increment when the drag is committed.",
    wearZh: "拖动过程中 markTrace 沿路径沉积磨损，松手提交时 markUse 再追加一次较大增量。",
    initialWear: 92,
    api: ["record: WearRecord", "traceGradient(trace, color?, baseAlpha?)", "onReset()"],
    keywords: ["slider", "range", "drag", "travel", "heatmap", "brass", "rubber", "滑块", "拖动", "行程", "热力图"],
  },
  {
    slug: "specimen-input",
    index: "04",
    kind: "specimen",
    name: "Field Terminal",
    nameZh: "输入终端",
    exports: ["WearInputSpecimen"],
    file: "components/wear/action-specimens.tsx",
    material: "ANODIZED ALLOY",
    note: "GLYPH-POSITION ABRASION",
    summary: "A text field that wears only the horizontal band each typed glyph occupies.",
    summaryZh: "输入框只磨损每个字素实际占据的那一段横向区域。",
    interaction: "Type or erase text; IME composition is handled so Chinese input wears on commit.",
    interactionZh: "输入或删除文字；已处理输入法合成事件，中文在提交时才会磨损。",
    wear: "Glyph width is measured on a canvas, so wear zones follow real font metrics rather than a fixed character grid. Erasing wears the removed position too — both directions leave evidence.",
    wearZh: "通过 canvas 测量字素宽度，磨损区域跟随真实字体度量而非等宽网格；删除也会磨损被移除的位置，写入和擦除同样留下痕迹。",
    initialWear: 70,
    api: ["record: WearRecord", "markInputGlyph(start, end, intensity?)", "onReset()"],
    keywords: ["input", "text", "type", "erase", "glyph", "ime", "输入框", "打字", "删除", "字素", "输入法"],
  },
  {
    slug: "specimen-tabs",
    index: "05",
    kind: "specimen",
    name: "Mode Register",
    nameZh: "模式寄存器",
    exports: ["WearTabsSpecimen"],
    file: "components/wear/navigation-specimens.tsx",
    material: "PRINTED ABS",
    note: "FREQUENCY EXPOSURE",
    summary: "Tabs that each fade independently according to how often you pick them.",
    summaryZh: "每个标签独立褪色，常用的标签磨损得更重。",
    interaction: "Select SIGNAL, HISTORY, or NOTES.",
    interactionZh: "在 SIGNAL / HISTORY / NOTES 之间切换。",
    wear: "Each tab owns a discrete peak in the shared trace array (indices 0, 12, 23), so the three tabs never share wear.",
    wearZh: "三个标签各自占用轨迹数组中的独立峰值（索引 0 / 12 / 23），彼此互不共享磨损。",
    initialWear: 100,
    api: ["record: WearRecord", "markTrace(id, position, intensity?, countAsUse?)", "onReset()"],
    keywords: ["tabs", "tab", "switch", "frequency", "register", "标签页", "选项卡", "频次"],
  },
  {
    slug: "specimen-navigation",
    index: "06",
    kind: "specimen",
    name: "Navigation Rail",
    nameZh: "导航栏",
    exports: ["WearNavigationSpecimen"],
    file: "components/wear/navigation-specimens.tsx",
    material: "POWDER COAT",
    note: "ROUTE FREQUENCY",
    summary: "A four-item nav rail where each destination develops its own local contact wear.",
    summaryZh: "四项导航栏，每个目的地各自累积局部的接触磨损。",
    interaction: "Choose MONITOR, ARCHIVE, CHANNELS, or CONFIG.",
    interactionZh: "选择 MONITOR / ARCHIVE / CHANNELS / CONFIG。",
    wear: "Four route anchors sit at indices 0, 8, 15, and 23; selecting a route raises that anchor plus a soft shoulder on its immediate neighbours.",
    wearZh: "四个路由锚点位于索引 0 / 8 / 15 / 23，点击时抬高该锚点，并让相邻一段产生柔和的过渡磨损。",
    initialWear: 98,
    api: ["record: WearRecord", "markTrace(id, position, intensity?, countAsUse?)", "onReset()"],
    keywords: ["navigation", "nav", "rail", "menu", "route", "powder coat", "导航", "侧边栏", "菜单", "路由"],
  },
  {
    slug: "specimen-card",
    index: "07",
    kind: "specimen",
    name: "Reference Folio",
    nameZh: "档案卡片",
    exports: ["WearCardSpecimen"],
    file: "components/wear/object-specimens.tsx",
    material: "ARCHIVAL PAPER",
    note: "FIBER WEAR / OXIDATION",
    summary: "An expandable paper card that yellows and softens as it is reopened.",
    summaryZh: "可展开的纸质卡片，反复开合会泛黄、起毛、加深折痕。",
    interaction: "Click or press Enter / Space to open and close the folio.",
    interactionZh: "点击，或按 Enter / 空格 开合卡片。",
    wear: "Each opening adds 0.1 of the folio budget, but the visual effect is capped at 62% so the case file stays readable no matter how often it is opened.",
    wearZh: "每次开合增加 0.1 的磨损预算，但视觉上限锁定在 62%，保证无论打开多少次档案都仍然清晰可读。",
    initialWear: 70,
    api: ["record: WearRecord", "markUse(id, intensity?)", "onReset()"],
    keywords: ["card", "folio", "paper", "open", "expand", "accordion", "卡片", "纸", "展开", "折叠"],
  },
  {
    slug: "specimen-choice",
    index: "08",
    kind: "specimen",
    name: "Selection Bank",
    nameZh: "选择组",
    exports: ["WearChoiceSpecimen"],
    file: "components/wear/action-specimens.tsx",
    material: "ENAMELED METAL",
    note: "CONTACT HALO",
    summary: "A checkbox and a radio pair that grow a shared contact halo as they are selected.",
    summaryZh: "复选框与单选组共享同一圈接触光晕，选得越多，光晕越明显。",
    interaction: "Tick LOG TRAJECTORY, or switch between SOFT and HARD.",
    interactionZh: "勾选 LOG TRAJECTORY，或在 SOFT / HARD 之间切换。",
    wear: "Both controls write into the same `choice` record, so the halo reflects total selection activity across the bank.",
    wearZh: "两种控件写入同一条 choice 记录，因此光晕反映整组选择的总体活跃度。",
    initialWear: 70,
    api: ["record: WearRecord", "markUse(id, intensity?)", "onReset()"],
    keywords: ["checkbox", "radio", "choice", "selection", "halo", "enamel", "复选框", "单选", "选择", "光晕"],
  },
  {
    slug: "specimen-scrollbar",
    index: "09",
    kind: "specimen",
    name: "Travel Log",
    nameZh: "滚动日志",
    exports: ["WearScrollbarSpecimen"],
    file: "components/wear/linear-specimens.tsx",
    material: "MACHINED RAIL",
    note: "SCROLL PATH MEMORY",
    summary: "A scroll region that polishes the sections your thumb actually travelled through.",
    summaryZh: "滚动区域会把你实际滚过的那几段轨道抛光。",
    interaction: "Scroll inside the log sheet.",
    interactionZh: "在日志面板内滚动。",
    wear: "Scroll position is sampled at most every 80 ms; faster travel deposits more wear at that position, and long jumps also count as an actuation.",
    wearZh: "滚动位置最多每 80ms 采样一次；滚动越快该位置磨损越重，长距离跳动同时计为一次操作。",
    initialWear: 78,
    api: ["record: WearRecord", "markUse(id, intensity?)", "markTrace(id, position, intensity?, countAsUse?)"],
    keywords: ["scroll", "scrollbar", "scroll area", "rail", "overflow", "滚动", "滚动条", "轨道"],
  },
  {
    slug: "specimen-knob",
    index: "10",
    kind: "specimen",
    name: "Rotary Attenuator",
    nameZh: "旋钮衰减器",
    exports: ["WearKnobSpecimen"],
    file: "components/wear/object-specimens.tsx",
    material: "KNURLED ALUMINUM",
    note: "DIRECT WEAR CONTROL",
    summary: "A rotary knob that dials its own wear level directly instead of accumulating it.",
    summaryZh: "旋钮直接控制自身磨损等级，而不是靠累积。",
    interaction: "Drag the knob, or use the left / right arrow keys for 2% steps.",
    interactionZh: "拖动旋钮，或用左右方向键以 2% 步进调节。",
    wear: "This is the one specimen where position *is* the wear level: the conic-gradient bezel, the rotor finish, and the readout all follow the same 0–100 value.",
    wearZh: "这是唯一一个「位置即磨损等级」的样本：锥形渐变表圈、旋钮表面与读数都跟随同一个 0–100 数值。",
    initialWear: 62,
    api: ["record: WearRecord", "setKnobWear(level)", "markUse(id, intensity?)", "onReset()"],
    keywords: ["knob", "rotary", "dial", "attenuator", "drag", "旋钮", "旋转", "表圈", "拖拽"],
  },
];

export const PRIMITIVE_ENTRIES: CatalogEntry[] = [
  {
    slug: "ui-alert-dialog",
    index: "11",
    kind: "primitive",
    name: "Alert Dialog",
    nameZh: "警告对话框",
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
    summaryZh: "基于 Radix Alert Dialog 的模态确认层，用于不可逆或需要阻断的操作。",
    interaction: "Trigger opens the overlay; Action and Cancel close it.",
    interactionZh: "Trigger 打开浮层，Action / Cancel 关闭。",
    wear: "Not wear-aware — a modal is a decision surface, not a surface that remembers use.",
    wearZh: "不参与磨损系统——模态框是决策面，不是被反复使用的器物面。",
    api: [
      "Compose: Header > Media + Title + Description",
      "Action / Cancel reuse Button variants",
    ],
    keywords: ["dialog", "modal", "alert", "confirm", "radix", "对话框", "弹窗", "确认", "模态"],
  },
  {
    slug: "ui-button",
    index: "12",
    kind: "primitive",
    name: "Button",
    nameZh: "按钮",
    exports: ["Button", "buttonVariants"],
    file: "components/ui/button.tsx",
    summary: "Variant-driven button. The wear specimens build their painted-metal push button on top of it.",
    summaryZh: "基于 variant 的按钮，磨损样本中的漆面按钮就是在它之上构建的。",
    interaction: "Standard click / keyboard activation; supports `asChild` to render as a link.",
    interactionZh: "标准点击与键盘激活；支持 asChild 渲染为链接。",
    wear: "Not wear-aware by itself — pass a className and drive the surface from a WearRecord.",
    wearZh: "本身不带磨损，需要通过 className 配合 WearRecord 驱动表面。",
    api: [
      "variant: default | destructive | outline | secondary | ghost | link",
      "size: default | sm | lg | icon | icon-xs | icon-sm | icon-lg",
      "asChild?: boolean",
    ],
    keywords: ["button", "cta", "variant", "buttonVariants", "按钮", "变体", "asChild"],
  },
  {
    slug: "ui-card",
    index: "13",
    kind: "primitive",
    name: "Card",
    nameZh: "卡片",
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
    summaryZh: "分组内容的容器。样本外框由 Card + CardHeader + CardContent + footer 组合而成。",
    interaction: "Presentational only; the folio specimen adds role=\"button\" and keyboard handling itself.",
    interactionZh: "纯展示组件；档案卡片样本自行追加 role=\"button\" 与键盘处理。",
    wear: "Not wear-aware — SpecimenFrame pushes `--level` into a custom property for the CSS wear rendering.",
    wearZh: "不直接参与磨损；由样本外框写入 --level 自定义属性交给 CSS 渲染。",
    api: ["CardAction renders top-right header slot", "data-slot attributes on every part"],
    keywords: ["card", "panel", "container", "surface", "卡片", "容器", "面板"],
  },
  {
    slug: "ui-checkbox",
    index: "14",
    kind: "primitive",
    name: "Checkbox",
    nameZh: "复选框",
    exports: ["Checkbox"],
    file: "components/ui/checkbox.tsx",
    summary: "Radix Checkbox with the checked indicator, used by the Selection Bank specimen.",
    summaryZh: "带勾选指示器的 Radix 复选框，用于「选择组」样本。",
    interaction: "Click or Space toggles; onCheckedChange reports boolean.",
    interactionZh: "点击或空格切换；onCheckedChange 返回布尔值。",
    wear: "Not wear-aware — the specimen wraps it in a `.choice-contact` halo.",
    wearZh: "本身不带磨损，样本用 .choice-contact 光晕包裹它。",
    api: ["checked / defaultChecked / onCheckedChange", "disabled, aria-invalid states"],
    keywords: ["checkbox", "tick", "check", "radix", "复选框", "勾选"],
  },
  {
    slug: "ui-input",
    index: "15",
    kind: "primitive",
    name: "Input",
    nameZh: "输入框",
    exports: ["Input"],
    file: "components/ui/input.tsx",
    summary: "Text input with focus ring and invalid styling; the Field Terminal measures glyphs against it.",
    summaryZh: "带聚焦环与错误态样式的文本输入框，输入终端会基于它测量字素宽度。",
    interaction: "Native input props; supports onChange, onCompositionStart/End for IME.",
    interactionZh: "原生 input 属性；支持 onChange 与输入法合成事件。",
    wear: "Not wear-aware — glyph-position wear is drawn by a sibling overlay track.",
    wearZh: "本身不带磨损；字素位置的磨损由同级覆盖轨道绘制。",
    api: ["Forwards ref (used for canvas font measurement)", "type, placeholder, aria-invalid"],
    keywords: ["input", "text", "field", "form", "输入框", "表单", "文本"],
  },
  {
    slug: "ui-radio-group",
    index: "16",
    kind: "primitive",
    name: "Radio Group",
    nameZh: "单选组",
    exports: ["RadioGroup", "RadioGroupItem"],
    file: "components/ui/radio-group.tsx",
    summary: "Radix Radio Group pair used by the Selection Bank for mutually exclusive modes.",
    summaryZh: "Radix 单选组，供「选择组」样本实现互斥模式选择。",
    interaction: "Arrow keys move the selection; onValueChange reports the value.",
    interactionZh: "方向键移动选中项；onValueChange 返回值。",
    wear: "Not wear-aware — shares the specimen's contact halo.",
    wearZh: "本身不带磨损，与样本共享同一圈接触光晕。",
    api: ["value / defaultValue / onValueChange", "RadioGroupItem inherits native radio props"],
    keywords: ["radio", "radio group", "option", "radix", "单选", "单选组", "选项"],
  },
  {
    slug: "ui-scroll-area",
    index: "17",
    kind: "primitive",
    name: "Scroll Area",
    nameZh: "滚动区域",
    exports: ["ScrollArea", "ScrollBar"],
    file: "components/ui/scroll-area.tsx",
    summary: "Styled scroll container. The Travel Log listens to its viewport to map scroll position into wear.",
    summaryZh: "样式化滚动容器；滚动日志监听其 viewport，把滚动位置映射为磨损。",
    interaction: "Scrolls natively; `onScrollCapture` lets the specimen sample positions.",
    interactionZh: "原生滚动；onScrollCapture 让样本采样位置。",
    wear: "Not wear-aware — the specimen maps viewport scrollTop to the trace array.",
    wearZh: "本身不带磨损；由样本把 viewport 的 scrollTop 映射到轨迹数组。",
    api: ["type=\"always\" keeps the scrollbar visible for wear display", "data-slot=\"scroll-area-viewport\""],
    keywords: ["scroll", "scrollarea", "overflow", "viewport", "滚动", "滚动区", "视口"],
  },
  {
    slug: "ui-slider",
    index: "18",
    kind: "primitive",
    name: "Slider",
    nameZh: "滑块",
    exports: ["Slider"],
    file: "components/ui/slider.tsx",
    summary: "Radix Slider with multi-thumb support; drives the Linear Calibrator's travel heatmap.",
    summaryZh: "支持多滑块的 Radix 滑块，驱动线性校准器的行程热力图。",
    interaction: "Drag or arrow-key the handle; onValueCommit fires once the drag ends.",
    interactionZh: "拖动或用方向键调节；拖动结束时触发 onValueCommit。",
    wear: "Not wear-aware — onValueChange deposits path wear, onValueCommit adds the actuation.",
    wearZh: "本身不带磨损；onValueChange 沉积路径磨损，onValueCommit 追加一次操作。",
    api: ["value / defaultValue as number[]", "min, max, step, onValueCommit"],
    keywords: ["slider", "range", "thumb", "drag", "radix", "滑块", "拖动", "区间"],
  },
  {
    slug: "ui-switch",
    index: "19",
    kind: "primitive",
    name: "Switch",
    nameZh: "开关",
    exports: ["Switch"],
    file: "components/ui/switch.tsx",
    summary: "Radix Switch toggle; the Two-State Lever wraps it with a wear shell on both resting sides.",
    summaryZh: "Radix 开关；双态拨杆在它两侧包上带磨损的外壳。",
    interaction: "Click or Space toggles; onCheckedChange reports the new state.",
    interactionZh: "点击或空格切换；onCheckedChange 返回新状态。",
    wear: "Not wear-aware — the specimen pushes --left-wear / --right-wear into the shell.",
    wearZh: "本身不带磨损；样本把 --left-wear / --right-wear 写入外壳。",
    api: ["size: default | sm", "checked / onCheckedChange"],
    keywords: ["switch", "toggle", "on off", "radix", "开关", "切换"],
  },
  {
    slug: "ui-tabs",
    index: "20",
    kind: "primitive",
    name: "Tabs",
    nameZh: "标签页",
    exports: ["Tabs", "TabsList", "TabsTrigger", "TabsContent", "tabsListVariants"],
    file: "components/ui/tabs.tsx",
    summary: "Radix Tabs with default and line list variants; the Mode Register exposes each tab's own wear.",
    summaryZh: "Radix 标签页，提供 default 与 line 两种列表变体；模式寄存器让每个标签拥有独立磨损。",
    interaction: "Click or arrow-key between triggers; onValueChange reports the active value.",
    interactionZh: "点击或用方向键切换；onValueChange 返回当前值。",
    wear: "Not wear-aware — each trigger receives a --tab-wear custom property.",
    wearZh: "本身不带磨损；每个 trigger 接收一个 --tab-wear 自定义属性。",
    api: ["TabsList variant: default | line", "orientation: horizontal | vertical"],
    keywords: ["tabs", "tab", "segmented", "radix", "标签页", "选项卡", "分段"],
  },
];

export const COMPONENT_CATALOG: CatalogEntry[] = [
  ...SPECIMEN_ENTRIES,
  ...PRIMITIVE_ENTRIES,
];

export const CATALOG_FILTERS = [
  { id: "all", label: "ALL", labelZh: "全部" },
  { id: "specimen", label: "SPECIMENS", labelZh: "磨损样本" },
  { id: "primitive", label: "PRIMITIVES", labelZh: "基础组件" },
] as const;

export type CatalogFilterId = (typeof CATALOG_FILTERS)[number]["id"];

/** Free-text search across name, Chinese name, file, exports, and keywords. */
export function matchesQuery(entry: CatalogEntry, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    entry.slug,
    entry.index,
    entry.name,
    entry.nameZh,
    entry.file,
    entry.material ?? "",
    entry.note ?? "",
    entry.summary,
    entry.summaryZh,
    entry.interaction,
    entry.interactionZh,
    entry.wear,
    entry.wearZh,
    ...entry.exports,
    ...(entry.api ?? []),
    ...entry.keywords,
  ]
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((token) => haystack.includes(token));
}
