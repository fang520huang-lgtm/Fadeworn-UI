"use client";

import { Gauge, RotateCcw, Sparkles } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  WearButtonSpecimen,
  WearChoiceSpecimen,
  WearInputSpecimen,
  WearToggleSpecimen,
} from "@/components/wear/action-specimens";
import { WearScrollbarSpecimen, WearSliderSpecimen } from "@/components/wear/linear-specimens";
import { WearNavigationSpecimen, WearTabsSpecimen } from "@/components/wear/navigation-specimens";
import { WearCardSpecimen, WearKnobSpecimen } from "@/components/wear/object-specimens";
import { COMPONENT_IDS, type ComponentId, useWearSystem } from "@/hooks/use-wear-system";

const labels: Record<ComponentId, string> = {
  button: "Button",
  toggle: "Toggle",
  slider: "Slider",
  input: "Input",
  tabs: "Tabs",
  navigation: "Navigation",
  card: "Card",
  choice: "Checkbox / Radio",
  scrollbar: "Scrollbar",
  knob: "Knob",
};

export default function Home() {
  const { wearState, markUse, markTrace, markInputGlyph, resetOne, resetAll, accelerate, stats, hydrated } = useWearSystem();
  const averagePercent = Math.round(stats.averageWear * 100);

  return (
    <main className={`lab-shell ${hydrated ? "is-ready" : ""}`}>
      <header className="masthead">
        <a className="brand-lockup" href="#top" aria-label="Wear UI 首页">
          <span className="brand-mark" aria-hidden="true">W</span>
          <span>
            <small>HISTORY / NOT STATE</small>
            <b>WEAR UI <i>界面使用实验室</i></b>
          </span>
        </a>
        <nav className="top-nav" aria-label="页内导航">
          <a href="#specimens">标本台</a>
          <a href="#inspector">磨损记录</a>
          <a href="#notes">设计札记</a>
        </nav>
        <p className="serial">LAB—17 <span>●</span> RECORDING</p>
      </header>

      <section className="hero-grid" id="top">
        <div className="hero-copy">
          <p className="section-index">01 / ACTIVE SURFACE</p>
          <h1>每一次触碰，<br /><em>都留下证据。</em></h1>
          <p className="lede">数字界面通常假装自己从未被使用。这里，每次点击、拖动、选择和滚动都会抛光表面、磨掉涂层，形成只属于你的操作历史。</p>
          <div className="hero-actions">
            <Button className="accelerate-button" onClick={accelerate}>
              <Sparkles aria-hidden="true" /> 加速磨损
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="reset-button"><RotateCcw aria-hidden="true" /> 恢复出厂</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="reset-dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>抹去全部使用历史？</AlertDialogTitle>
                  <AlertDialogDescription>10 个组件的点击、轨迹、使用次数与磨损程度都会归零。这个操作无法撤销。</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>保留历史</AlertDialogCancel>
                  <AlertDialogAction onClick={resetAll}>确认复原</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p className="persistence-note"><span /> 磨损仅保留在当前页面，刷新后自动归零</p>
        </div>

        <div className="instrument-panel">
          <div className="panel-label"><span>LIVE WEAR MONITOR</span><span>SERIAL 17—A</span></div>
          <div className="overall-gauge">
            <div className="gauge-face" style={{ "--gauge": `${averagePercent * 3.6}deg` } as React.CSSProperties}>
              <span className="gauge-inner"><Gauge aria-hidden="true" /><b>{averagePercent}</b><small>% AVG WEAR</small></span>
            </div>
            <div className="gauge-copy">
              <p>CURRENT CONDITION</p>
              <h2>{averagePercent < 12 ? "UNMARKED" : averagePercent < 38 ? "IN SERVICE" : averagePercent < 68 ? "WELL USED" : "HEAVILY WORN"}</h2>
              <dl>
                <div><dt>总操作</dt><dd>{String(stats.interactions).padStart(4, "0")}</dd></div>
                <div><dt>最常使用</dt><dd>{labels[stats.mostUsed]}</dd></div>
                <div><dt>记录模式</dt><dd>{hydrated ? "SESSION" : "READYING"}</dd></div>
              </dl>
            </div>
          </div>
          <div className="material-strip"><span>PAINT</span><i /><span>BRASS</span><i /><span>RUBBER</span><i /><span>FIBER</span></div>
        </div>
      </section>

      <section className="gallery-section" id="specimens">
        <div className="section-heading">
          <div><p className="section-index">02 / INTERACTIVE SPECIMENS</p><h2>会记住你的控件</h2></div>
          <p>连续操作它们。相同的材质语言，产生不同的磨损机制。</p>
        </div>
        <div className="specimen-grid">
          <WearButtonSpecimen record={wearState.button} markUse={markUse} onReset={() => resetOne("button")} />
          <WearToggleSpecimen record={wearState.toggle} markUse={markUse} markTrace={markTrace} onReset={() => resetOne("toggle")} />
          <WearSliderSpecimen record={wearState.slider} markUse={markUse} markTrace={markTrace} onReset={() => resetOne("slider")} />
          <WearInputSpecimen record={wearState.input} markInputGlyph={markInputGlyph} onReset={() => resetOne("input")} />
          <WearTabsSpecimen record={wearState.tabs} markUse={markUse} markTrace={markTrace} onReset={() => resetOne("tabs")} />
          <WearNavigationSpecimen record={wearState.navigation} markUse={markUse} markTrace={markTrace} onReset={() => resetOne("navigation")} />
          <WearCardSpecimen record={wearState.card} markUse={markUse} onReset={() => resetOne("card")} />
          <WearChoiceSpecimen record={wearState.choice} markUse={markUse} markTrace={markTrace} onReset={() => resetOne("choice")} />
          <WearScrollbarSpecimen record={wearState.scrollbar} markUse={markUse} markTrace={markTrace} onReset={() => resetOne("scrollbar")} />
          <WearKnobSpecimen record={wearState.knob} markUse={markUse} markTrace={markTrace} onReset={() => resetOne("knob")} />
        </div>
      </section>

      <section className="inspector-section" id="inspector">
        <div className="inspector-copy">
          <p className="section-index">03 / WEAR INSPECTOR</p>
          <h2>你的操作，<br />塑造了这台机器。</h2>
          <p>每条横线都是独立的磨损记录。它们只反映操作历史，不代表错误、禁用或加载状态。</p>
        </div>
        <div className="wear-ledger">
          <div className="ledger-head"><span>COMPONENT</span><span>ACTUATIONS</span><span>WEAR</span></div>
          {COMPONENT_IDS.map((id, index) => {
            const record = wearState[id];
            const percent = Math.round(record.wearLevel * 100);
            return (
              <div className="ledger-row" key={id}>
                <span><i>{String(index + 1).padStart(2, "0")}</i>{labels[id]}</span>
                <b>{String(record.usageCount).padStart(3, "0")}</b>
                <span className="ledger-meter"><i style={{ width: `${percent}%` }} /><b>{percent}%</b></span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="notes-section" id="notes">
        <p className="section-index">04 / DESIGN NOTES</p>
        <div className="notes-grid">
          <h2>磨损是历史，<br /><em>不是状态。</em></h2>
          <div className="principles">
            <article><span>01</span><h3>因果可见</h3><p>点击次数、停留侧、线性轨迹与常用角度，都被映射成清晰可辨的表面变化。</p></article>
            <article><span>02</span><h3>材质有别</h3><p>喷漆金属会掉漆，黄铜会发亮，橡胶会被抛光，纸纤维会软化起皱。</p></article>
            <article><span>03</span><h3>功能不退化</h3><p>即使达到重度磨损，文字、当前状态、焦点与所有交互仍然保持清晰。</p></article>
          </div>
        </div>
        <footer className="site-footer"><span>WEAR UI / LAB—17</span><p>每个人最后得到的界面都不完全一样，因为每个人使用软件的方式不一样。</p><span>2026 / SHANGHAI</span></footer>
      </section>
    </main>
  );
}
