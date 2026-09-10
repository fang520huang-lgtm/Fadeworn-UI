"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search, X } from "lucide-react";
import {
  CATALOG_FILTERS,
  COMPONENT_CATALOG,
  type CatalogFilterId,
  matchesQuery,
  REPO,
  sourceUrl,
} from "@/lib/component-catalog";

const KIND_LABEL: Record<string, string> = {
  specimen: "SPECIMEN",
  primitive: "PRIMITIVE",
};

export default function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CatalogFilterId>("all");

  const results = useMemo(
    () =>
      COMPONENT_CATALOG.filter(
        (entry) => (filter === "all" || entry.kind === filter) && matchesQuery(entry, query),
      ),
    [filter, query],
  );

  const counts = useMemo(
    () => ({
      all: COMPONENT_CATALOG.length,
      specimen: COMPONENT_CATALOG.filter((entry) => entry.kind === "specimen").length,
      primitive: COMPONENT_CATALOG.filter((entry) => entry.kind === "primitive").length,
    }),
    [],
  );

  return (
    <main className="lab-shell is-ready directory-shell">
      <header className="masthead directory-masthead">
        <a className="brand-lockup" href="../" aria-label="Back to Fadeworn UI">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>
            <small>HISTORY / NOT STATE</small>
            <b>FADEWORN UI <i>COMPONENT INDEX</i></b>
          </span>
        </a>
        <nav className="top-nav" aria-label="Page navigation">
          <a href="../#specimens">SPECIMENS</a>
          <a href="#catalog">CATALOG</a>
          <a href={REPO.url} target="_blank" rel="noreferrer">SOURCE</a>
        </nav>
        <p className="serial">{results.length} / {counts.all} <span>●</span> INDEXED</p>
      </header>

      <section className="directory-intro">
        <p className="section-index">QUICK LOOKUP</p>
        <h1>Every component,<br /><em>one query away.</em></h1>
        <p className="lede">
          Search by name, file, material, export, or what it does. Each entry links straight to its
          source file and, for wear specimens, to the live demo. Click a keyword to turn it into a filter.
        </p>

        <div className="directory-controls">
          <label className="directory-search">
            <Search aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder="Search components…"
              aria-label="Search components"
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X aria-hidden="true" />
              </button>
            ) : null}
          </label>
          <div className="directory-filters" role="group" aria-label="Filter by component family">
            {CATALOG_FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
              >
                {option.label} <i>{counts[option.id]}</i>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="directory-section" id="catalog">
        {results.length === 0 ? (
          <p className="directory-empty">
            No component matches “{query}”. Try a material (paper, brass, rubber), a control name
            (slider, toggle, knob), or a behaviour (heatmap, glyph, halo).
          </p>
        ) : (
          <ol className="directory-grid">
            {results.map((entry) => (
              <li className="directory-card" id={entry.slug} key={entry.slug}>
                <header className="directory-card__head">
                  <span className="directory-card__no">{entry.index}</span>
                  <div>
                    <h2>{entry.name}</h2>
                    <p>{entry.file}</p>
                  </div>
                  <span className={`directory-badge is-${entry.kind}`}>{KIND_LABEL[entry.kind]}</span>
                </header>

                {entry.kind === "specimen" ? (
                  <div className="directory-card__material">
                    <span>{entry.material}</span>
                    <i aria-hidden="true" />
                    <span>{entry.note}</span>
                    {typeof entry.initialWear === "number" ? (
                      <b title="Curated initial wear on page load">
                        <em style={{ width: `${entry.initialWear}%` }} />
                        {entry.initialWear}% PRESET
                      </b>
                    ) : null}
                  </div>
                ) : null}

                <p className="directory-card__summary">{entry.summary}</p>

                <dl className="directory-card__facts">
                  <div>
                    <dt>HOW IT IS USED</dt>
                    <dd>{entry.interaction}</dd>
                  </div>
                  <div>
                    <dt>WHAT WEAR IT RECORDS</dt>
                    <dd>{entry.wear}</dd>
                  </div>
                </dl>

                <div className="directory-card__exports">
                  <span>EXPORTS</span>
                  <div>
                    {entry.exports.map((symbol) => (
                      <code key={symbol}>{symbol}</code>
                    ))}
                  </div>
                </div>

                {entry.api?.length ? (
                  <ul className="directory-card__api">
                    {entry.api.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : null}

                <p className="directory-card__keywords">
                  {entry.keywords.slice(0, 8).map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => {
                        setQuery(keyword);
                        setFilter("all");
                      }}
                    >
                      {keyword}
                    </button>
                  ))}
                </p>

                <footer className="directory-card__foot">
                  <a href={sourceUrl(entry.file)} target="_blank" rel="noreferrer">
                    SOURCE <ExternalLink aria-hidden="true" />
                  </a>
                  {entry.kind === "specimen" ? (
                    <a href={`../#${entry.slug}`}>LIVE DEMO <ExternalLink aria-hidden="true" /></a>
                  ) : null}
                </footer>
              </li>
            ))}
          </ol>
        )}
      </section>

      <footer className="site-footer directory-footer">
        <span>FADEWORN UI / COMPONENT INDEX</span>
        <p>The interface remembers how it was used, until there is nothing left to remember.</p>
        <a href="../">← BACK TO THE LAB</a>
      </footer>
    </main>
  );
}
