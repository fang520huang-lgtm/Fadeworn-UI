"use client";

import { memo, startTransition, useEffect, useRef, useState, type CSSProperties } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { traceGradient, type ComponentId, type WearRecord } from "@/hooks/use-wear-system";
import { SpecimenFrame } from "./specimen-frame";

type Marks = {
  markUse: (id: ComponentId, intensity?: number) => void;
  markTrace: (id: ComponentId, position: number, intensity?: number, countAsUse?: boolean) => void;
};

type Resettable = { onReset: () => void };

const INITIAL_SLIDER_VALUE = 76;

export function WearSliderSpecimen({ record, markUse, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const [value, setValue] = useState([INITIAL_SLIDER_VALUE]);
  const isInitialPreset = record.lastUsed === null
    && record.usageCount === 34;
  const sliderValue = isInitialPreset ? [INITIAL_SLIDER_VALUE] : value;

  return (
    <SpecimenFrame id="slider" index="03" title="Slider" material="BRASS / RUBBER" hint="Drag to wear the track." record={record} onReset={onReset}>
      <div className="control-bay slider-bay">
        <div className="dial-readout"><span>Value</span><b>{String(sliderValue[0]).padStart(2, "0")}</b><small>%</small></div>
        <div className="slider-shell">
          <span className="trace-strip" style={{ backgroundImage: traceGradient(record.trace) }} aria-hidden="true" />
          <Slider
            aria-label="Output calibration"
            className="lab-slider"
            value={sliderValue}
            onValueChange={(next) => {
              setValue(next);
              markTrace("slider", next[0] / 100, 0.7);
            }}
            onValueCommit={() => markUse("slider", 1.4)}
          />
          <div className="slider-ticks" aria-hidden="true">{Array.from({ length: 11 }, (_, i) => <i key={i} />)}</div>
        </div>
      </div>
    </SpecimenFrame>
  );
}

const logLines = [
  ["01", "Surface initialized"],
  ["02", "Pointer contact recorded"],
  ["03", "Friction sample saved"],
  ["04", "Edge loss detected"],
  ["05", "Local polish applied"],
  ["06", "Usage memory written"],
  ["07", "Travel index updated"],
  ["08", "Rail contact measured"],
  ["09", "Position sample archived"],
  ["10", "Wear profile completed"],
];

export function WearScrollbarSpecimen({ record, markUse, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  return (
    <SpecimenFrame id="scrollbar" index="09" title="Scrollbar" material="MACHINED RAIL" record={record} onReset={onReset}>
      <div className="control-bay scroll-bay">
        <div
          className="scroll-frame"
          style={{ "--scrollbar-wear": recordTraceVertical(record.trace) } as CSSProperties}
        >
          <StableScrollbarBody markUse={markUse} markTrace={markTrace} />
        </div>
        <p>Scroll to wear the track.</p>
      </div>
    </SpecimenFrame>
  );
}

/**
 * Keep Radix's viewport and thumb mounted while the surrounding wear record
 * changes. Re-rendering this tree during pointer capture can interrupt a drag
 * in optimized/static builds, so the changing wear gradient lives on the
 * parent frame and is inherited by the track instead.
 */
const StableScrollbarBody = memo(function StableScrollbarBody({ markUse, markTrace }: Marks) {
  const lastPosition = useRef(0);
  const lastSample = useRef(0);
  const pendingPosition = useRef(0);
  const pendingSamples = useRef<Array<{ position: number; intensity: number }>>([]);
  const flushTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (flushTimer.current !== null) window.clearTimeout(flushTimer.current);
  }, []);

  return (
    <ScrollArea
      className="lab-scroll-area"
      type="always"
      onScrollCapture={(event) => {
        const target = event.target as HTMLElement;
        if (!target.matches("[data-slot='scroll-area-viewport']")) return;
        syncScrollbarThumb(target);
        const now = performance.now();
        const max = target.scrollHeight - target.clientHeight;
        const position = max > 0 ? target.scrollTop / max : 0;
        pendingPosition.current = position;

        if (now - lastSample.current >= 80) {
          const distance = Math.abs(position - lastPosition.current);
          pendingSamples.current.push({ position, intensity: Math.max(0.35, distance * 5) });
          lastPosition.current = position;
          lastSample.current = now;
        }

        if (flushTimer.current !== null) window.clearTimeout(flushTimer.current);
        flushTimer.current = window.setTimeout(() => {
          const finalPosition = pendingPosition.current;
          const finalDistance = Math.abs(finalPosition - lastPosition.current);
          if (finalDistance > 0.001) {
            pendingSamples.current.push({
              position: finalPosition,
              intensity: Math.max(0.35, finalDistance * 5),
            });
            lastPosition.current = finalPosition;
          }

          const samples = pendingSamples.current.splice(0);
          flushTimer.current = null;
          if (samples.length === 0) return;

          startTransition(() => {
            samples.forEach((sample) => {
              markTrace("scrollbar", sample.position, sample.intensity, true);
              if (sample.intensity > 0.8) markUse("scrollbar", 0.6);
            });
          });
        }, 140);
      }}
    >
      <div className="log-sheet">
        {logLines.map(([number, line]) => (
          <p key={number}><span>{number}</span><b>{line}</b></p>
        ))}
      </div>
    </ScrollArea>
  );
});

function syncScrollbarThumb(viewport: HTMLElement) {
  const root = viewport.closest<HTMLElement>("[data-slot='scroll-area']");
  const scrollbar = root?.querySelector<HTMLElement>("[data-slot='scroll-area-scrollbar']");
  const thumb = scrollbar?.querySelector<HTMLElement>("[data-slot='scroll-area-thumb']");
  if (!scrollbar || !thumb) return;

  const maximumScroll = viewport.scrollHeight - viewport.clientHeight;
  const scrollbarStyle = getComputedStyle(scrollbar);
  const verticalPadding = (Number.parseFloat(scrollbarStyle.paddingTop) || 0)
    + (Number.parseFloat(scrollbarStyle.paddingBottom) || 0);
  const travel = Math.max(0, scrollbar.clientHeight - verticalPadding - thumb.offsetHeight);
  const progress = maximumScroll > 0 ? viewport.scrollTop / maximumScroll : 0;

  thumb.style.setProperty("--scrollbar-thumb-offset", `${travel * progress}px`);
}

const RAIL_BANDS = 48;

/**
 * Interpolate the 24 wear segments into finer bands and soften them slightly.
 * The stored wear is untouched — this only decides how it is drawn, so a single
 * hot segment reads as a soft mound in the final gradient.
 */
function railBands(trace: number[]) {
  const fine = Array.from({ length: RAIL_BANDS }, (_, index) => {
    const at = (index / (RAIL_BANDS - 1)) * (trace.length - 1);
    const lower = Math.floor(at);
    const upper = Math.min(trace.length - 1, lower + 1);
    return trace[lower] + (trace[upper] - trace[lower]) * (at - lower);
  });

  const soft = fine.map((value, index) => {
    const previous = fine[index - 1] ?? value;
    const next = fine[index + 1] ?? value;
    return (previous + value * 2 + next) / 4;
  });

  return soft.map((value) => {
    return Math.min(0.88, 0.04 + value * 0.86);
  });
}

/**
 * Keep the wear and the functional scrollbar in the same coordinate space.
 * A single gradient is substantially cheaper to repaint than 48 animated DOM
 * bands and cannot drift away from the Radix track.
 */
function recordTraceVertical(trace: number[]) {
  const bands = railBands(trace);
  const stops = bands.map((opacity, index) => {
    const at = (index / (bands.length - 1)) * 100;
    return `rgba(211,177,105,${(opacity * 0.66).toFixed(3)}) ${at.toFixed(2)}%`;
  });

  return `linear-gradient(180deg, ${stops.join(",")})`;
}
