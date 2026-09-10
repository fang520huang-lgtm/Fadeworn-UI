# Fadeworn UI · 磨损界面

**一个会记住自己被怎么使用的界面。**

[English README](README.md)

Fadeworn UI 是一个关于「界面如何留下使用痕迹」的交互实验。点击、拖拽、选择、输入、滚动，都会通过材质化的磨损改变控件本身——而不是随机撒上装饰性的做旧纹理。

页面首次打开时带着一套精心调好的初始磨损。这些状态只存在于当前会话：刷新页面会恢复初始预设，点击 **NO WEAR** 则把所有表面擦干净，方便做对照。

> 界面记得自己被如何使用，直到再没有什么可记住的。

---

## 怎么找组件

整个项目共 20 个组件，有两种查询方式：

- **在页面里查：** 启动开发服务器后打开 [`/directory`](http://localhost:5173/directory)。支持全文搜索、按类别筛选、点击关键词标签继续筛选，并且每个样本都能一键跳到现场演示。
- **在仓库里查：** 见 [docs/COMPONENTS.md](docs/COMPONENTS.md)，同样的目录，附源码路径与属性说明。

搜索同时支持中英文：可以搜 `knob`、`paper`、`brass`，也可以搜 `旋钮`、`复选框`、`热力图`。

| # | 样本 | English | 材质 | 记录什么 |
| --- | --- | --- | --- | --- |
| 01 | [触发按钮](docs/COMPONENTS.md#01--actuation-button--触发按钮) | Actuation Button | 漆面钢 | 按下次数 → 整面均匀褪色 |
| 02 | [双态拨杆](docs/COMPONENTS.md#02--two-state-lever--双态拨杆) | Two-State Lever | 胶木 | 停靠侧摩擦 |
| 03 | [线性校准器](docs/COMPONENTS.md#03--linear-calibrator--线性校准器) | Linear Calibrator | 黄铜 / 橡胶 | 行程摩擦热力图 |
| 04 | [输入终端](docs/COMPONENTS.md#04--field-terminal--输入终端) | Field Terminal | 阳极氧化合金 | 字素位置磨损 |
| 05 | [模式寄存器](docs/COMPONENTS.md#05--mode-register--模式寄存器) | Mode Register | 打印 ABS | 每个标签的频次曝光 |
| 06 | [导航栏](docs/COMPONENTS.md#06--navigation-rail--导航栏) | Navigation Rail | 粉末喷涂 | 每条路由的接触磨损 |
| 07 | [档案卡片](docs/COMPONENTS.md#07--reference-folio--档案卡片) | Reference Folio | 档案纸 | 纤维磨损与氧化 |
| 08 | [选择组](docs/COMPONENTS.md#08--selection-bank--选择组) | Selection Bank | 搪瓷金属 | 接触光晕 |
| 09 | [滚动日志](docs/COMPONENTS.md#09--travel-log--滚动日志) | Travel Log | 机加工导轨 | 滚动路径记忆 |
| 10 | [旋钮衰减器](docs/COMPONENTS.md#10--rotary-attenuator--旋钮衰减器) | Rotary Attenuator | 滚花铝 | 直接控制磨损等级 |

除此之外还有 10 个可复用基础组件，放在 `components/ui/`：button、card、input、checkbox、radio group、switch、slider、tabs、scroll area、alert dialog。它们是基于 Radix 的 shadcn/ui 标准组件，本身不含磨损逻辑；磨损样本包裹它们，并通过 CSS 自定义属性驱动表面的磨损渲染。完整的导出名与属性见[组件目录](docs/COMPONENTS.md)。

---

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

打开 [http://localhost:5173](http://localhost:5173)。如果开发服务器已经在运行，Windows 用户也可以直接双击项目根目录下的 `Open Fadeworn UI.html`。

## 质量检查

```bash
npm run lint
npm run build
```

## 部署

所有页面都是纯静态的，因此可以部署到任何静态托管上。

| 目标平台 | 做法 |
| --- | --- |
| **GitHub Pages** | 推送到 `master` 即可。仓库自带的流程会构建并发布到 `https://<用户名>.github.io/Fadeworn-UI/`。首次需要在仓库 **Settings → Pages → Source** 里选择 **GitHub Actions**。 |
| **Vercel / Cloudflare Pages** | 导入仓库，构建命令保持 `npm run build`，直接部署，无需额外配置。 |
| **任意静态托管** | 运行 `npm run build:static`，会在 `out/` 生成一个自包含的站点。 |

关于**绑定自己的域名**、DNS 记录怎么填、要不要备案、去哪买域名，请看 [docs/DEPLOYMENT.zh-CN.md](docs/DEPLOYMENT.zh-CN.md)。

---

## 目录结构

```text
app/
  layout.tsx                页面元信息与文档外壳
  page.tsx                  实验室首页的编排
  directory/page.tsx        可搜索的组件目录（ /directory ）
  globals.css               视觉系统、材质与磨损渲染
components/
  ui/                       可复用基础组件
  wear/                     十个交互样本与共享外框
hooks/
  use-wear-system.ts        磨损状态、交互映射与预设
lib/
  component-catalog.ts      组件目录数据（同时驱动 /directory 与文档）
docs/
  COMPONENTS.md             组件参考
  WEAR-SYSTEM.md            磨损系统说明
  DEPLOYMENT.zh-CN.md       部署与域名指南
public/
  knob-bezel-wear.svg       旋钮的固定表圈磨损纹理
  favicon.svg
```

### 目录为什么不会过期

`lib/component-catalog.ts` 是唯一数据源。`/directory` 直接渲染它，`docs/COMPONENTS.md` 与它保持同步。只要在那里加一条记录，两个地方就都能搜到新组件。

---

## 磨损系统

每个样本都持有一条 `WearRecord`，包含使用次数、总体磨损等级、最后使用时间，以及交互相关的轨迹。线性控件在分段行程图上累加，输入终端保存按字素宽度划分的磨损区，频次型控件则各自保留独立的局部峰值。

磨损通过三条通道写入：`markUse` 负责平均累积，`markTrace` 负责位置累积，`markInputGlyph` 负责字素区间。`getWearLevelForDisplay` 再把这些不同的历史归一化给磨损日志显示，同时不改变它们的视觉表现。

因此界面表达的是**历史**，而不是禁用、错误或加载状态。即使在最大磨损下，标签、激活态、聚焦环和所有控件依然清晰可用。

数据模型、增量、渲染用的自定义属性、预设与无障碍说明见 [docs/WEAR-SYSTEM.md](docs/WEAR-SYSTEM.md)。

## 设计原则

> 界面记得自己被如何使用，直到再没有什么可记住的。

## 参与贡献

见 [CONTRIBUTING.md](CONTRIBUTING.md)。一句话版本：磨损是历史而非状态——保持可读、不要妨碍功能、尊重 `prefers-reduced-motion`。

## 许可证

[MIT](LICENSE)。
