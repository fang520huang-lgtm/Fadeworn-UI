"use client";

import { useRef, useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ComponentId, WearRecord } from "@/hooks/use-wear-system";
import { SpecimenFrame } from "./specimen-frame";

type Marks = {
  markUse: (id: ComponentId, intensity?: number, point?: { x: number; y: number }) => void;
  markTrace: (id: ComponentId, position: number, intensity?: number, countAsUse?: boolean) => void;
};

type Resettable = { onReset: () => void };

export function WearCardSpecimen({ record, markUse, onReset }: { record: WearRecord } & Pick<Marks, "markUse"> & Resettable) {
  const [open, setOpen] = useState(false);
  return (
    <SpecimenFrame index="07" title="Reference Folio" material="FIBER BOARD" note="EDGE FATIGUE / CREASES" record={record} onReset={onReset}>
      <div className="control-bay folio-bay">
        <Card
          role="button"
          tabIndex={0}
          aria-expanded={open}
          className="wear-folio"
          onClick={() => {
            setOpen((value) => !value);
            markUse("card", 1);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen((value) => !value);
              markUse("card", 1);
            }
          }}
        >
          <span className="folio-spine" aria-hidden="true" />
          <div className="folio-topline"><FileText aria-hidden="true" /><span>CASE FILE / 017</span><ChevronDown className={open ? "is-open" : ""} aria-hidden="true" /></div>
          <h4>Interface material<br />fatigue study</h4>
          <p>Repeated opening softens the edge, deepens the spine and leaves diagonal page creases.</p>
          <div className={`folio-detail ${open ? "is-open" : ""}`}>
            <span>OBSERVATION</span>
            <b>History remains legible after surface loss.</b>
          </div>
          <span className="folio-corner" aria-hidden="true" />
        </Card>
      </div>
    </SpecimenFrame>
  );
}

function knobWearGradient(trace: number[]) {
  const circularTrace = [...trace, trace[0]];
  const stops = circularTrace.map((value, index) => {
    const angle = (index / trace.length) * 360;
    const alpha = Math.min(0.82, 0.035 + value * 0.8).toFixed(2);
    return `rgba(218,179,99,${alpha}) ${angle.toFixed(1)}deg`;
  });
  return `conic-gradient(from -135deg, ${stops.join(",")})`;
}

export function WearKnobSpecimen({ record, markUse, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const [value, setValue] = useState(42);
  const dragging = useRef(false);
  const knobRef = useRef<HTMLButtonElement>(null);

  const updateFromPointer = (clientX: number, clientY: number) => {
    const rect = knobRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - (rect.left + rect.width / 2);
    const y = clientY - (rect.top + rect.height / 2);
    let degrees = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;
    const clamped = Math.max(0, Math.min(270, degrees <= 315 ? degrees : 0));
    const next = Math.round((clamped / 270) * 100);
    setValue(next);
    const jitteredPosition = Math.max(0, Math.min(1, next / 100 + (Math.random() - 0.5) * 0.16));
    markTrace("knob", jitteredPosition, 0.75);
  };

  return (
    <SpecimenFrame index="10" title="Rotary Attenuator" material="KNURLED ALUMINUM" note="ANGULAR MEMORY" record={record} onReset={onReset}>
      <div className="control-bay knob-bay">
        <div className="knob-scale" style={{ "--knob-wear": knobWearGradient(record.trace) } as React.CSSProperties}>
          <span className="knob-ticks" aria-hidden="true" />
          <button
            ref={knobRef}
            type="button"
            role="slider"
            className="lab-knob"
            aria-label="旋转衰减器"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            onPointerDown={(event) => {
              dragging.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              updateFromPointer(event.clientX, event.clientY);
            }}
            onPointerMove={(event) => {
              if (dragging.current) updateFromPointer(event.clientX, event.clientY);
            }}
            onPointerUp={() => {
              dragging.current = false;
              markUse("knob", 1.3);
            }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const next = Math.max(0, Math.min(100, value + (event.key === "ArrowRight" ? 2 : -2)));
              setValue(next);
              const jitteredPosition = Math.max(0, Math.min(1, next / 100 + (Math.random() - 0.5) * 0.16));
              markTrace("knob", jitteredPosition, 1, true);
            }}
          >
            <span className="knob-index" style={{ transform: `rotate(${-135 + value * 2.7}deg)` }}><i /></span>
            <span className="knob-cap" />
          </button>
        </div>
        <div className="knob-readout"><b>{String(value).padStart(3, "0")}</b><span>ATTENUATION</span></div>
      </div>
    </SpecimenFrame>
  );
}
