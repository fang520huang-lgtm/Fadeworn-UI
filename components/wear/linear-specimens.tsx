"use client";

import { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import type { ComponentId, WearRecord } from "@/hooks/use-wear-system";
import { traceGradient } from "@/hooks/use-wear-system";
import { SpecimenFrame } from "./specimen-frame";

type Marks = {
  markUse: (id: ComponentId, intensity?: number, point?: { x: number; y: number }) => void;
  markTrace: (id: ComponentId, position: number, intensity?: number, countAsUse?: boolean) => void;
};

type Resettable = { onReset: () => void };

export function WearSliderSpecimen({ record, markUse, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const [value, setValue] = useState([36]);
  return (
    <SpecimenFrame index="03" title="Linear Calibrator" material="BRASS / RUBBER" note="TRAVEL HEATMAP" record={record} onReset={onReset}>
      <div className="control-bay slider-bay">
        <div className="dial-readout"><span>OUTPUT</span><b>{String(value[0]).padStart(2, "0")}</b><small>%</small></div>
        <div className="slider-shell">
          <span className="trace-strip" style={{ backgroundImage: traceGradient(record.trace) }} aria-hidden="true" />
          <Slider
            aria-label="输出校准"
            className="lab-slider"
            value={value}
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
  ["00:03", "SURFACE INITIALIZED"],
  ["00:08", "POINTER CONTACT / A1"],
  ["00:14", "FRICTION SAMPLE SAVED"],
  ["00:21", "EDGE LOSS DETECTED"],
  ["00:34", "CONTACT PRESSURE 0.82"],
  ["00:47", "TRACE CONSOLIDATED"],
  ["01:05", "MATERIAL RESPONSE OK"],
  ["01:18", "LOCAL POLISH +0.04"],
  ["01:41", "USAGE MEMORY WRITTEN"],
  ["02:03", "AWAITING OPERATOR"],
];

export function WearScrollbarSpecimen({ record, markUse, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const lastPosition = useRef(0);
  const lastSample = useRef(0);
  return (
    <SpecimenFrame index="09" title="Travel Log" material="MACHINED RAIL" note="SCROLL PATH MEMORY" record={record} onReset={onReset}>
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
              {logLines.map(([time, line], index) => (
                <p key={line}><span>{time}</span><b>{line}</b><i>{String(index + 1).padStart(2, "0")}</i></p>
              ))}
            </div>
          </ScrollArea>
          <span className="scroll-ghost" style={{ backgroundImage: recordTraceVertical(record.trace) }} aria-hidden="true" />
        </div>
        <p>滚动经过的区段会形成纵向抛光带</p>
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
