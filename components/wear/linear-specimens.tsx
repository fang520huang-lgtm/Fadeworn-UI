"use client";

import { useRef, useState } from "react";
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
];

export function WearScrollbarSpecimen({ record, markUse, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const lastPosition = useRef(0);
  const lastSample = useRef(0);
  return (
    <SpecimenFrame id="scrollbar" index="09" title="Scrollbar" material="MACHINED RAIL" record={record} onReset={onReset}>
      <div className="control-bay scroll-bay">
        <div className="scroll-frame">
          <ScrollArea
            className="lab-scroll-area"
            type="always"
            onScrollCapture={(event) => {
              const target = event.target as HTMLElement;
              if (!target.matches("[data-slot='scroll-area-viewport']")) return;
              const now = performance.now();
              if (now - lastSample.current < 80) return;
              const max = target.scrollHeight - target.clientHeight;
              const position = max > 0 ? target.scrollTop / max : 0;
              const distance = Math.abs(position - lastPosition.current);
              markTrace("scrollbar", position, Math.max(0.35, distance * 5), true);
              if (distance > 0.16) markUse("scrollbar", 0.6);
              lastPosition.current = position;
              lastSample.current = now;
            }}
          >
            <div className="log-sheet">
              {logLines.map(([number, line]) => (
                <p key={number}><span>{number}</span><b>{line}</b></p>
              ))}
            </div>
          </ScrollArea>
          <span className="scroll-ghost" style={{ backgroundImage: recordTraceVertical(record.trace) }} aria-hidden="true" />
        </div>
        <p>Scroll to wear the track.</p>
      </div>
    </SpecimenFrame>
  );
}

function recordTraceVertical(trace: number[]) {
  const stops = trace.map((value, index) => {
    const at = (index / (trace.length - 1)) * 100;
    const alpha = Math.min(0.88, 0.04 + value * 0.86).toFixed(2);
    return `rgba(211,177,105,${alpha}) ${at.toFixed(1)}%`;
  });
  return `linear-gradient(180deg, ${stops.join(",")})`;
}
