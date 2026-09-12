"use client";

import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";

const previews = [
  {
    id: "toggle",
    label: "Toggle",
    src: "./toggle-wear-demo.gif",
    alt: "A Toggle developing visible wear through repeated use",
    durationMs: 4890,
  },
  {
    id: "slider",
    label: "Slider",
    src: "./slider-wear-demo.gif",
    alt: "A Slider developing a visible wear trail as it moves",
    durationMs: 8000,
  },
  {
    id: "knob",
    label: "Knob",
    src: "./knob-wear-demo.gif",
    alt: "A Knob turning from zero to one hundred and back as material wear develops",
    durationMs: 8940,
  },
] as const;

export function HeroWearPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const activePreview = previews[activeIndex];

  useEffect(() => {
    if (!isLoaded) return;
    const timer = window.setTimeout(() => {
      setIsLoaded(false);
      setActiveIndex((current) => (current + 1) % previews.length);
      setCycle((current) => current + 1);
    }, activePreview.durationMs);
    return () => window.clearTimeout(timer);
  }, [activePreview.durationMs, isLoaded, cycle]);

  const selectPreview = (index: number) => {
    setIsLoaded(false);
    setActiveIndex(index);
    setCycle((current) => current + 1);
  };

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % previews.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + previews.length) % previews.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = previews.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    selectPreview(nextIndex);
    window.requestAnimationFrame(() => {
      document.getElementById(`hero-preview-tab-${previews[nextIndex].id}`)?.focus();
    });
  };

  return (
    <section
      className={`hero-wear-preview ${isLoaded ? "is-running" : ""}`}
      style={{ "--preview-duration": `${activePreview.durationMs}ms` } as CSSProperties}
      aria-label="Animated wear demonstrations"
    >
      <div
        id="hero-preview-panel"
        className="hero-wear-preview__panel"
        role="tabpanel"
        aria-labelledby={`hero-preview-tab-${activePreview.id}`}
      >
        {/* Relative public paths work both at / and under the GitHub Pages repository path. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`${activePreview.id}-${cycle}`}
          src={activePreview.src}
          alt={activePreview.alt}
          width="800"
          height="613"
          loading="eager"
          fetchPriority={activeIndex === 0 ? "high" : "auto"}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      <div className="hero-wear-preview__indicators" role="tablist" aria-label="Choose a component demonstration">
        {previews.map((preview, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={preview.id}
              id={`hero-preview-tab-${preview.id}`}
              className="hero-wear-preview__indicator"
              type="button"
              role="tab"
              aria-label={`Show ${preview.label} demonstration`}
              aria-selected={selected}
              aria-controls="hero-preview-panel"
              tabIndex={selected ? 0 : -1}
              title={preview.label}
              onClick={() => selectPreview(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
            />
          );
        })}
      </div>
    </section>
  );
}
