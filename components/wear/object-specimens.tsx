"use client";

import { useRef, useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ComponentId, WearRecord } from "@/hooks/use-wear-system";
import { SpecimenFrame } from "./specimen-frame";

type Marks = {
  markUse: (id: ComponentId, intensity?: number) => void;
  setKnobWear: (level: number) => void;
};

type Resettable = { onReset: () => void };

const FOLIO_VISUAL_LIMIT = 0.62;
const KNOB_MIN_ANGLE = -135;
const KNOB_MAX_ANGLE = 135;
const KNOB_SWEEP = KNOB_MAX_ANGLE - KNOB_MIN_ANGLE;

export function WearCardSpecimen({ record, markUse, onReset }: { record: WearRecord } & Pick<Marks, "markUse"> & Resettable) {
  const [open, setOpen] = useState(false);
  return (
    <SpecimenFrame anchor="specimen-card" index="07" title="Card" material="ARCHIVAL PAPER" note="FIBER WEAR / OXIDATION" record={record} onReset={onReset}>
      <div className="control-bay folio-bay">
        <Card
          role="button"
          tabIndex={0}
          aria-expanded={open}
          className="wear-folio"
          style={{ "--level": Math.min(record.wearLevel, FOLIO_VISUAL_LIMIT) } as React.CSSProperties}
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
          <p>Repeated opening softens the fibers, warms the exposed paper and deepens the folded spine.</p>
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
  const stops = trace.map((value, index) => {
    const angle = (index / (trace.length - 1)) * KNOB_SWEEP;
    const alpha = Math.min(0.86, value * 0.86).toFixed(2);
    return `rgba(218,211,190,${alpha}) ${angle.toFixed(1)}deg`;
  });
  return `conic-gradient(from ${KNOB_MIN_ANGLE}deg, ${stops.join(",")}, transparent ${KNOB_SWEEP}deg 360deg)`;
}

export function WearKnobSpecimen({ record, markUse, setKnobWear, onReset }: { record: WearRecord } & Marks & Resettable) {
  const value = Math.round(record.wearLevel * 100);
  const knobAngle = KNOB_MIN_ANGLE + value * (KNOB_SWEEP / 100);
  const dragging = useRef(false);
  const dragStarted = useRef(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const knobRef = useRef<HTMLButtonElement>(null);

  const updateFromPointer = (clientX: number, clientY: number) => {
    const rect = knobRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - (rect.left + rect.width / 2);
    const y = clientY - (rect.top + rect.height / 2);
    const degrees = (Math.atan2(y, x) * 180) / Math.PI + 90;
    const normalized = ((degrees + 180) % 360 + 360) % 360 - 180;
    const clamped = Math.max(KNOB_MIN_ANGLE, Math.min(KNOB_MAX_ANGLE, normalized));
    const next = Math.round(((clamped - KNOB_MIN_ANGLE) / KNOB_SWEEP) * 100);
    setKnobWear(next / 100);
  };

  return (
    <SpecimenFrame anchor="specimen-knob" index="10" title="Knob" material="KNURLED ALUMINUM" note="DIRECT WEAR CONTROL" record={record} onReset={onReset}>
      <div className="control-bay knob-bay">
        <div className="knob-scale" style={{ "--knob-wear": knobWearGradient(record.trace), "--knob-level": record.wearLevel } as React.CSSProperties}>
          <span className="knob-bezel-wear" aria-hidden="true" />
          <span className="knob-ticks" aria-hidden="true" />
          <button
            ref={knobRef}
            type="button"
            role="slider"
            className="lab-knob"
            aria-label="Rotary wear control"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            onPointerDown={(event) => {
              dragging.current = true;
              dragStarted.current = false;
              pointerStart.current = { x: event.clientX, y: event.clientY };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!dragging.current || !pointerStart.current) return;
              const distance = Math.hypot(
                event.clientX - pointerStart.current.x,
                event.clientY - pointerStart.current.y,
              );
              if (!dragStarted.current && distance < 3) return;
              dragStarted.current = true;
              updateFromPointer(event.clientX, event.clientY);
            }}
            onPointerUp={() => {
              dragging.current = false;
              pointerStart.current = null;
              if (dragStarted.current) markUse("knob", 1.3);
              dragStarted.current = false;
            }}
            onPointerCancel={() => {
              dragging.current = false;
              dragStarted.current = false;
              pointerStart.current = null;
            }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const next = Math.max(0, Math.min(100, value + (event.key === "ArrowRight" ? 2 : -2)));
              setKnobWear(next / 100);
              markUse("knob", 1);
            }}
          >
            <span className="knob-rotor" style={{ transform: `rotate(${knobAngle}deg)` }} aria-hidden="true">
              <span className="knob-cap" />
              <span className="knob-rotor-wear" />
              <span className="knob-index"><i /></span>
            </span>
          </button>
        </div>
        <div className="knob-readout"><b>{String(value).padStart(3, "0")}</b><span>WEAR LEVEL</span></div>
      </div>
    </SpecimenFrame>
  );
}
