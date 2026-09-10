# Component Index / 组件目录

Every component in Fadeworn UI, in one place, so you can find it without reading the whole tree.

本项目全部组件的查询索引：按编号、名称、文件、材质或用途定位组件，不必通读整个目录。

- **Interactive version / 可交互版本:** run the app and open [`/directory`](http://localhost:5173/directory) — it has free-text search, family filters, and clickable keywords.
- **Source of truth / 数据源:** [`lib/component-catalog.ts`](../lib/component-catalog.ts) drives both the in-app index and this document.

Two families live here:

| Family | Count | Location | What it is |
| --- | --- | --- | --- |
| **Specimens** 磨损样本 | 10 | `components/wear/` | Interactive demos that record how you use them. |
| **Primitives** 基础组件 | 10 | `components/ui/` | Reusable building blocks (shadcn/ui + Radix). No wear logic of their own. |

---

## Quick-reference table / 速查表

| # | Component | 中文 | Exports | Source |
| --- | --- | --- | --- | --- |
| 01 | Actuation Button | 触发按钮 | `WearButtonSpecimen` | [`action-specimens.tsx`](../components/wear/action-specimens.tsx) |
| 02 | Two-State Lever | 双态拨杆 | `WearToggleSpecimen` | [`action-specimens.tsx`](../components/wear/action-specimens.tsx) |
| 03 | Linear Calibrator | 线性校准器 | `WearSliderSpecimen` | [`linear-specimens.tsx`](../components/wear/linear-specimens.tsx) |
| 04 | Field Terminal | 输入终端 | `WearInputSpecimen` | [`action-specimens.tsx`](../components/wear/action-specimens.tsx) |
| 05 | Mode Register | 模式寄存器 | `WearTabsSpecimen` | [`navigation-specimens.tsx`](../components/wear/navigation-specimens.tsx) |
| 06 | Navigation Rail | 导航栏 | `WearNavigationSpecimen` | [`navigation-specimens.tsx`](../components/wear/navigation-specimens.tsx) |
| 07 | Reference Folio | 档案卡片 | `WearCardSpecimen` | [`object-specimens.tsx`](../components/wear/object-specimens.tsx) |
| 08 | Selection Bank | 选择组 | `WearChoiceSpecimen` | [`action-specimens.tsx`](../components/wear/action-specimens.tsx) |
| 09 | Travel Log | 滚动日志 | `WearScrollbarSpecimen` | [`linear-specimens.tsx`](../components/wear/linear-specimens.tsx) |
| 10 | Rotary Attenuator | 旋钮衰减器 | `WearKnobSpecimen` | [`object-specimens.tsx`](../components/wear/object-specimens.tsx) |
| 11 | Alert Dialog | 警告对话框 | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogMedia`, `AlertDialogAction`, `AlertDialogCancel` | [`alert-dialog.tsx`](../components/ui/alert-dialog.tsx) |
| 12 | Button | 按钮 | `Button`, `buttonVariants` | [`button.tsx`](../components/ui/button.tsx) |
| 13 | Card | 卡片 | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` | [`card.tsx`](../components/ui/card.tsx) |
| 14 | Checkbox | 复选框 | `Checkbox` | [`checkbox.tsx`](../components/ui/checkbox.tsx) |
| 15 | Input | 输入框 | `Input` | [`input.tsx`](../components/ui/input.tsx) |
| 16 | Radio Group | 单选组 | `RadioGroup`, `RadioGroupItem` | [`radio-group.tsx`](../components/ui/radio-group.tsx) |
| 17 | Scroll Area | 滚动区域 | `ScrollArea`, `ScrollBar` | [`scroll-area.tsx`](../components/ui/scroll-area.tsx) |
| 18 | Slider | 滑块 | `Slider` | [`slider.tsx`](../components/ui/slider.tsx) |
| 19 | Switch | 开关 | `Switch` | [`switch.tsx`](../components/ui/switch.tsx) |
| 20 | Tabs | 标签页 | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants` | [`tabs.tsx`](../components/ui/tabs.tsx) |

The `PRESET` column below is the curated wear shown on first load. Pressing **INITIAL WEAR** restores it; **NO WEAR** clears every surface.

---

## Specimens / 磨损样本

### 01 · Actuation Button / 触发按钮

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearButtonSpecimen` |
| **Live demo** | [`/#specimen-button`](../app/page.tsx) |
| **Material** | PAINTED STEEL |
| **Use it** | Press the ENGAGE button. |
| **Wear** | Every press adds a flat increment (0.034) to the wear level, so the whole painted surface fades evenly instead of wearing in one spot. |
| **Preset** | 62% |
| **Props** | `record: WearRecord`, `markUse(id, intensity?)`, `onReset()` |

每次按压累加固定磨损量（0.034），整块漆面均匀褪色，而不是局部磨损。

### 02 · Two-State Lever / 双态拨杆

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearToggleSpecimen` |
| **Live demo** | `/#specimen-toggle` |
| **Material** | BAKELITE |
| **Use it** | Toggle the lever between OFF and ON. |
| **Wear** | Wear lands on the trace segments next to the resting side — indices 3–5 for OFF, 18–20 for ON — so the baldest patch always reveals the position you prefer. |
| **Preset** | 70% |
| **Props** | `record: WearRecord`, `markTrace(id, position, intensity?, countAsUse?)`, `onReset()` |

磨损落在停靠一侧的轨迹段（OFF 对应索引 3–5，ON 对应索引 18–20），因此最亮的那块永远说明你更常用哪一档。

### 03 · Linear Calibrator / 线性校准器

| | |
| --- | --- |
| **Source** | `components/wear/linear-specimens.tsx` → `WearSliderSpecimen` |
| **Live demo** | `/#specimen-slider` |
| **Material** | BRASS / RUBBER |
| **Use it** | Drag the handle; releasing counts as a completed actuation. |
| **Wear** | `markTrace` deposits wear along the travel path on every change, and `markUse` adds a larger increment when the drag is committed. |
| **Preset** | 92% |
| **Props** | `record`, `markUse`, `markTrace`, `onReset()`; uses `traceGradient(trace, color?, baseAlpha?)` |

拖动过程中 `markTrace` 沿路径沉积磨损，松手提交时 `markUse` 再追加一次较大增量。

### 04 · Field Terminal / 输入终端

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearInputSpecimen` |
| **Live demo** | `/#specimen-input` |
| **Material** | ANODIZED ALLOY |
| **Use it** | Type or erase text; IME composition is handled so Chinese input wears on commit. |
| **Wear** | Glyph width is measured on a canvas, so wear zones follow real font metrics rather than a fixed character grid. Erasing wears the removed position too — both directions leave evidence. |
| **Preset** | 70% |
| **Props** | `record`, `markInputGlyph(start, end, intensity?)`, `onReset()` |

通过 canvas 测量字素宽度，磨损区域跟随真实字体度量而非等宽网格；删除也会磨损被移除的位置，写入和擦除同样留下痕迹。

### 05 · Mode Register / 模式寄存器

| | |
| --- | --- |
| **Source** | `components/wear/navigation-specimens.tsx` → `WearTabsSpecimen` |
| **Live demo** | `/#specimen-tabs` |
| **Material** | PRINTED ABS |
| **Use it** | Select SIGNAL, HISTORY, or NOTES. |
| **Wear** | Each tab owns a discrete peak in the shared trace array (indices 0, 12, 23), so the three tabs never share wear. |
| **Preset** | 100% |
| **Props** | `record`, `markTrace`, `onReset()` |

三个标签各自占用轨迹数组中的独立峰值（索引 0 / 12 / 23），彼此互不共享磨损。

### 06 · Navigation Rail / 导航栏

| | |
| --- | --- |
| **Source** | `components/wear/navigation-specimens.tsx` → `WearNavigationSpecimen` |
| **Live demo** | `/#specimen-navigation` |
| **Material** | POWDER COAT |
| **Use it** | Choose MONITOR, ARCHIVE, CHANNELS, or CONFIG. |
| **Wear** | Four route anchors sit at indices 0, 8, 15, and 23; selecting a route raises that anchor plus a soft shoulder on its immediate neighbours. |
| **Preset** | 98% |
| **Props** | `record`, `markTrace`, `onReset()` |

四个路由锚点位于索引 0 / 8 / 15 / 23，点击时抬高该锚点，并让相邻一段产生柔和的过渡磨损。

### 07 · Reference Folio / 档案卡片

| | |
| --- | --- |
| **Source** | `components/wear/object-specimens.tsx` → `WearCardSpecimen` |
| **Live demo** | `/#specimen-card` |
| **Material** | ARCHIVAL PAPER |
| **Use it** | Click, or press Enter / Space, to open and close the folio. |
| **Wear** | Each opening adds 0.1 of the folio budget, but the visual effect is capped at 62% so the case file stays readable no matter how often it is opened. |
| **Preset** | 70% |
| **Props** | `record`, `markUse`, `onReset()` |

每次开合增加 0.1 的磨损预算，但视觉上限锁定在 62%，保证无论打开多少次档案都仍然清晰可读。

### 08 · Selection Bank / 选择组

| | |
| --- | --- |
| **Source** | `components/wear/action-specimens.tsx` → `WearChoiceSpecimen` |
| **Live demo** | `/#specimen-choice` |
| **Material** | ENAMELED METAL |
| **Use it** | Tick LOG TRAJECTORY, or switch between SOFT and HARD. |
| **Wear** | Both controls write into the same `choice` record, so the halo reflects total selection activity across the bank. |
| **Preset** | 70% |
| **Props** | `record`, `markUse`, `onReset()` |

两种控件写入同一条 `choice` 记录，因此光晕反映整组选择的总体活跃度。

### 09 · Travel Log / 滚动日志

| | |
| --- | --- |
| **Source** | `components/wear/linear-specimens.tsx` → `WearScrollbarSpecimen` |
| **Live demo** | `/#specimen-scrollbar` |
| **Material** | MACHINED RAIL |
| **Use it** | Scroll inside the log sheet. |
| **Wear** | Scroll position is sampled at most every 80 ms; faster travel deposits more wear at that position, and long jumps also count as an actuation. |
| **Preset** | 78% |
| **Props** | `record`, `markUse`, `markTrace`, `onReset()` |

滚动位置最多每 80ms 采样一次；滚动越快该位置磨损越重，长距离跳动同时计为一次操作。

### 10 · Rotary Attenuator / 旋钮衰减器

| | |
| --- | --- |
| **Source** | `components/wear/object-specimens.tsx` → `WearKnobSpecimen` |
| **Live demo** | `/#specimen-knob` |
| **Material** | KNURLED ALUMINUM |
| **Use it** | Drag the knob, or use the left / right arrow keys for 2% steps. |
| **Wear** | This is the one specimen where position *is* the wear level: the conic-gradient bezel, the rotor finish, and the readout all follow the same 0–100 value. |
| **Preset** | 62% |
| **Props** | `record`, `setKnobWear(level)`, `markUse`, `onReset()` |

这是唯一一个「位置即磨损等级」的样本：锥形渐变表圈、旋钮表面与读数都跟随同一个 0–100 数值。

---

## Primitives / 基础组件

These are stock shadcn/ui components on Radix primitives. They are **not** wear-aware — the specimens wrap them and supply the custom properties that drive the wear rendering. Swap or restyle any of them without touching the wear system.

以下为基础组件（shadcn/ui + Radix）。它们本身不参与磨损逻辑，而是由样本组件包裹并通过 CSS 自定义属性驱动磨损渲染，因此可以独立替换或改样式。

### 11 · Alert Dialog / 警告对话框

`components/ui/alert-dialog.tsx`

Modal confirmation surface for irreversible or blocking decisions. Compose `Header > Media + Title + Description`; `Action` and `Cancel` reuse the Button variants.

模态确认层，用于不可逆或需要阻断的操作。

### 12 · Button / 按钮

`components/ui/button.tsx` — `Button`, `buttonVariants`

| Prop | Values |
| --- | --- |
| `variant` | `default` · `destructive` · `outline` · `secondary` · `ghost` · `link` |
| `size` | `default` · `sm` · `lg` · `icon` · `icon-xs` · `icon-sm` · `icon-lg` |
| `asChild` | `boolean` — render as a link or other element via Radix `Slot` |

The specimen's painted-metal push button is built on top of this.

### 13 · Card / 卡片

`components/ui/card.tsx` — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`

`SpecimenFrame` composes the card family into the frame you see on the home page. `CardAction` renders the top-right header slot.

### 14 · Checkbox / 复选框

`components/ui/checkbox.tsx` — `Checkbox`

Radix Checkbox with `checked` / `defaultChecked` / `onCheckedChange`, plus disabled and `aria-invalid` states. The Selection Bank wraps it in a `.choice-contact` halo.

### 15 · Input / 输入框

`components/ui/input.tsx` — `Input`

Forwards its ref — the Field Terminal uses that to measure canvas font metrics. Supports `type`, `placeholder`, `aria-invalid`, and IME composition events.

### 16 · Radio Group / 单选组

`components/ui/radio-group.tsx` — `RadioGroup`, `RadioGroupItem`

Arrow keys move the selection, `onValueChange` reports the value.

### 17 · Scroll Area / 滚动区域

`components/ui/scroll-area.tsx` — `ScrollArea`, `ScrollBar`

`type="always"` keeps the scrollbar visible so wear can be displayed on it. The viewport carries `data-slot="scroll-area-viewport"`, which the Travel Log matches when sampling scroll position.

### 18 · Slider / 滑块

`components/ui/slider.tsx` — `Slider`

`value` / `defaultValue` are `number[]` (multi-thumb capable). `onValueChange` deposits path wear; `onValueCommit` adds the actuation.

### 19 · Switch / 开关

`components/ui/switch.tsx` — `Switch`

`size` is `default` or `sm`. The Two-State Lever pushes `--left-wear` / `--right-wear` into the surrounding shell.

### 20 · Tabs / 标签页

`components/ui/tabs.tsx` — `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants`

`TabsList` variant is `default` or `line`; orientation is `horizontal` or `vertical`. Each trigger receives a `--tab-wear` custom property.

---

## How to add a component to the index / 如何把新组件加入目录

1. Add an entry to `SPECIMEN_ENTRIES` or `PRIMITIVE_ENTRIES` in [`lib/component-catalog.ts`](../lib/component-catalog.ts).
2. Give it a unique `slug` and fill in `summary`, `interaction`, `wear`, and `keywords` (Chinese keywords included — the search index matches both languages).
3. That is it. `/directory` picks it up automatically, and the keyword chips become clickable filters.

新增组件只需在 `lib/component-catalog.ts` 中追加一条记录，`/directory` 页面会自动收录，关键词标签也会变成可点击的筛选条件。
