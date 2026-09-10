"use client";

import { Gauge, RotateCcw, Sparkles } from "lucide-react";
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
import { COMPONENT_IDS, getWearLevelForDisplay, type ComponentId, useWearSystem } from "@/hooks/use-wear-system";

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
  const { wearState, markUse, markTrace, markInputGlyph, setKnobWear, resetOne, resetAll, applyInitialWear, stats, hydrated } = useWearSystem();
  const averagePercent = Math.round(stats.averageWear * 100);

  return (
    <main className={`lab-shell ${hydrated ? "is-ready" : ""}`}>
      <header className="masthead">
        <a className="brand-lockup" href="#top" aria-label="Fadeworn UI home">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>
            <small>HISTORY / NOT STATE</small>
            <b>FADEWORN UI <i>UI AGING LABORATORY</i></b>
          </span>
        </a>
        <nav className="top-nav" aria-label="Page navigation">
          <a href="#specimens">SPECIMENS</a>
          <a href="#inspector">WEAR LOG</a>
          <a href="#notes">DESIGN NOTES</a>
        </nav>
        <p className="serial">LAB—17 <span>●</span> RECORDING</p>
      </header>

      <section className="hero-grid" id="top">
        <div className="hero-copy">
          <p className="section-index">01 / ACTIVE SURFACE</p>
          <h1>Every touch<br /><em>leaves evidence.</em></h1>
          <p className="lede">Digital interfaces pretend they have never been used. Here, every click, drag, selection, and scroll polishes the surface, wears through the finish, and records a history that is yours alone.</p>
          <div className="hero-actions">
            <Button className="initial-wear-button" onClick={applyInitialWear}>
              <Sparkles aria-hidden="true" /> INITIAL WEAR
            </Button>
            <Button variant="outline" className="reset-button" onClick={resetAll}>
              <RotateCcw aria-hidden="true" /> NO WEAR
            </Button>
          </div>
          <p className="persistence-note"><span /> SESSION ONLY · REFRESH RESTORES INITIAL WEAR</p>
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
                <div><dt>TOTAL ACTUATIONS</dt><dd>{String(stats.interactions).padStart(4, "0")}</dd></div>
                <div><dt>MOST USED</dt><dd>{labels[stats.mostUsed]}</dd></div>
                <div><dt>MEMORY MODE</dt><dd>{hydrated ? "SESSION" : "READYING"}</dd></div>
              </dl>
            </div>
          </div>
          <div className="material-strip"><span>PAINT</span><i /><span>BRASS</span><i /><span>RUBBER</span><i /><span>FIBER</span></div>
        </div>
      </section>

      <section className="gallery-section" id="specimens">
        <div className="section-heading">
          <div><p className="section-index">02 / INTERACTIVE SPECIMENS</p><h2>Controls that remember you.</h2></div>
          <p>Keep using them. A shared material language produces ten distinct histories of wear.</p>
        </div>
        <div className="specimen-grid">
          <WearButtonSpecimen record={wearState.button} markUse={markUse} onReset={() => resetOne("button")} />
          <WearToggleSpecimen record={wearState.toggle} markTrace={markTrace} onReset={() => resetOne("toggle")} />
          <WearSliderSpecimen record={wearState.slider} markUse={markUse} markTrace={markTrace} onReset={() => resetOne("slider")} />
          <WearInputSpecimen record={wearState.input} markInputGlyph={markInputGlyph} onReset={() => resetOne("input")} />
          <WearTabsSpecimen record={wearState.tabs} markTrace={markTrace} onReset={() => resetOne("tabs")} />
          <WearNavigationSpecimen record={wearState.navigation} markTrace={markTrace} onReset={() => resetOne("navigation")} />
          <WearCardSpecimen record={wearState.card} markUse={markUse} onReset={() => resetOne("card")} />
          <WearChoiceSpecimen record={wearState.choice} markUse={markUse} onReset={() => resetOne("choice")} />
          <WearScrollbarSpecimen record={wearState.scrollbar} markUse={markUse} markTrace={markTrace} onReset={() => resetOne("scrollbar")} />
          <WearKnobSpecimen record={wearState.knob} markUse={markUse} setKnobWear={setKnobWear} onReset={() => resetOne("knob")} />
        </div>
      </section>

      <section className="inspector-section" id="inspector">
        <div className="inspector-copy">
          <p className="section-index">03 / WEAR INSPECTOR</p>
          <h2>Your use<br />shapes this machine.</h2>
          <p>Each line is an independent wear record. It reflects history—not an error, disabled control, or loading state.</p>
        </div>
        <div className="wear-ledger">
          <div className="ledger-head"><span>COMPONENT</span><span>ACTUATIONS</span><span>WEAR</span></div>
          {COMPONENT_IDS.map((id, index) => {
            const record = wearState[id];
            const percent = Math.round(getWearLevelForDisplay(id, record) * 100);
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
          <h2>Wear is history.<br /><em>Not state.</em></h2>
          <div className="principles">
            <article><span>01</span><h3>VISIBLE CAUSALITY</h3><p>Clicks, resting sides, linear travel, and working angles map directly to legible changes in the surface.</p></article>
            <article><span>02</span><h3>MATERIAL MEMORY</h3><p>Painted steel chips. Brass grows bright. Paper turns yellow with age.</p></article>
            <article><span>03</span><h3>FUNCTION ENDURES</h3><p>Even at maximum wear, labels, active states, focus, and every control remain clear.</p></article>
          </div>
        </div>
        <footer className="site-footer"><span>FADEWORN UI / LAB—17</span><p>The interface remembers how it was used, until there is nothing left to remember.</p><span>2026 / SHANGHAI</span></footer>
      </section>
    </main>
  );
}
