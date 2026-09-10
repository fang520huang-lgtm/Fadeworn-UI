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
import { useAnimatedNumber } from "@/hooks/use-animated-number";
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
  const animatedAverage = useAnimatedNumber(averagePercent);
  const displayedAverage = Math.round(animatedAverage);

  return (
    <main className={`lab-shell ${hydrated ? "is-ready" : ""}`}>
      <header className="masthead">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>
            <small>HISTORY / NOT STATE</small>
            <b>FADEWORN UI</b>
          </span>
        </div>
        <p className="serial">LAB—17 <span>●</span> RECORDING</p>
      </header>

      <section className="hero-grid" id="top">
        <div className="hero-copy">
          <p className="section-index">01 / ACTIVE SURFACE</p>
          <h1>Every touch<br /><em>leaves evidence.</em></h1>
          <p className="lede">Use the controls below.<br />Every click, drag, keystroke, and scroll leaves a visible trace.</p>
          <div className="hero-actions">
            <Button className="initial-wear-button" onClick={applyInitialWear}>
              <Sparkles aria-hidden="true" /> INITIAL WEAR
            </Button>
            <Button variant="outline" className="reset-button" onClick={resetAll}>
              <RotateCcw aria-hidden="true" /> NO WEAR
            </Button>
            <Button variant="outline" className="github-button" asChild>
              <a href="https://github.com/fang520huang-lgtm/Fadeworn-UI" target="_blank" rel="noreferrer">
                <GitHubMark /> GITHUB
              </a>
            </Button>
          </div>
          <p className="persistence-note"><span /> SESSION ONLY · REFRESH RESTORES INITIAL WEAR</p>
        </div>

        <div className="instrument-panel">
          <div className="panel-label"><span>LIVE WEAR MONITOR</span><span>SERIAL 17—A</span></div>
          <div className="overall-gauge">
            <div className="gauge-face" style={{ "--gauge": `${animatedAverage * 3.6}deg` } as React.CSSProperties}>
              <span className="gauge-inner"><Gauge aria-hidden="true" /><b>{displayedAverage}</b><small>% AVG WEAR</small></span>
            </div>
            <div className="gauge-copy">
              <p>CURRENT CONDITION</p>
              <h2>{displayedAverage < 12 ? "UNMARKED" : displayedAverage < 38 ? "IN SERVICE" : displayedAverage < 68 ? "WELL USED" : "HEAVILY WORN"}</h2>
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
          <div><p className="section-index">02 / INTERACTIVE SPECIMENS</p><h2>Controls that remember how they’re used.</h2></div>
          <p>Interact with each component to see how different materials wear over time.</p>
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
          <h2>Your interactions<br />leave a trace.</h2>
          <p>Each component tracks wear independently. Wear reflects interaction history, not a disabled or loading state.</p>
        </div>
        <div className="wear-ledger">
          <div className="ledger-head"><span>COMPONENT</span><span>ACTUATIONS</span><span>WEAR</span></div>
          {COMPONENT_IDS.map((id, index) => {
            const record = wearState[id];
            const percent = Math.round(getWearLevelForDisplay(id, record) * 100);
            return (
              <a
                className="ledger-row"
                key={id}
                href={`#specimen-${id}`}
                title={`Jump to ${labels[id]}`}
              >
                <span><i>{String(index + 1).padStart(2, "0")}</i>{labels[id]}</span>
                <b>{String(record.usageCount).padStart(3, "0")}</b>
                <span className="ledger-meter"><i style={{ width: `${percent}%` }} /><b>{percent}%</b></span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="notes-section" id="notes">
        <p className="section-index">04 / DESIGN NOTES</p>
        <div className="notes-grid">
          <h2>Wear is history.<br /><em>Not state.</em></h2>
          <div className="principles">
            <article><span>01</span><h3>VISIBLE CAUSE &amp; EFFECT</h3><p>Every interaction leaves a visible mark where it happened.</p></article>
            <article><span>02</span><h3>MATERIAL MEMORY</h3><p>Paint chips. Brass polishes. Paper yellows. Each material remembers use differently.</p></article>
            <article><span>03</span><h3>FUNCTION ENDURES</h3><p>Even when heavily worn, every control remains readable and usable.</p></article>
          </div>
        </div>
        <footer className="site-footer">
          <span>FADEWORN UI / LAB—17</span>
          <p>The interface remembers how it was used, until there is nothing left to remember.</p>
          <div className="footer-links">
            <a href="https://github.com/fang520huang-lgtm/Fadeworn-UI" target="_blank" rel="noreferrer">SOURCE ON GITHUB ↗</a>
            <a href="https://github.com/fang520huang-lgtm" target="_blank" rel="noreferrer">BY @FANG520HUANG-LGTM ↗</a>
          </div>
        </footer>
      </section>
    </main>
  );
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .7a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.24c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .7Z" />
    </svg>
  );
}
