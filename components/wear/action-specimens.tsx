"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { ComponentId, WearRecord } from "@/hooks/use-wear-system";
import { SpecimenFrame } from "./specimen-frame";

type Marks = {
  markUse: (id: ComponentId, intensity?: number, point?: { x: number; y: number }) => void;
  markTrace: (id: ComponentId, position: number, intensity?: number, countAsUse?: boolean) => void;
};

type Resettable = { onReset: () => void };

export function WearButtonSpecimen({ record, markUse, onReset }: { record: WearRecord } & Pick<Marks, "markUse"> & Resettable) {
  return (
    <SpecimenFrame index="01" title="Actuation Button" material="PAINTED STEEL" note="UNIFORM SURFACE FADE" record={record} onReset={onReset}>
      <div className="control-bay button-bay">
        <Button
          className="lab-push-button"
          onClick={() => markUse("button", 1)}
        >
          <span className="button-caption"><b>ENGAGE</b><small>HOLD / TEST</small></span>
        </Button>
        <p>每次点击让整块表面均匀褪色</p>
      </div>
    </SpecimenFrame>
  );
}

export function WearToggleSpecimen({ record, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const [checked, setChecked] = useState(false);
  const leftWear = record.trace.slice(0, 12).reduce((a, b) => a + b, 0) / 12;
  const rightWear = record.trace.slice(12).reduce((a, b) => a + b, 0) / 12;
  return (
    <SpecimenFrame index="02" title="Two-State Lever" material="BAKELITE" note="REST-SIDE FRICTION" record={record} onReset={onReset}>
      <div className="control-bay toggle-bay">
        <div className="toggle-assembly">
          <span className="toggle-label">OFF</span>
          <div className="toggle-shell" style={{ "--left-wear": leftWear, "--right-wear": rightWear } as React.CSSProperties}>
            <Switch
              checked={checked}
              aria-label="主电路切换"
              className="lab-switch"
              onCheckedChange={(value) => {
                setChecked(value);
                markTrace("toggle", value ? 0.82 : 0.18, 1.6, true);
              }}
            />
          </div>
          <span className="toggle-label">ON</span>
        </div>
        <p>{checked ? "CIRCUIT CLOSED" : "CIRCUIT OPEN"}</p>
      </div>
    </SpecimenFrame>
  );
}

export function WearInputSpecimen({ record, onReset }: { record: WearRecord } & Resettable) {
  const [value, setValue] = useState("");
  return (
    <SpecimenFrame index="04" title="Field Terminal" material="ANODIZED ALLOY" note="MONITORED / NO AGING" record={record} onReset={onReset}>
      <div className="control-bay input-bay">
        <label htmlFor="field-terminal">OPERATOR NOTE</label>
        <div className="input-shell">
          <Input
            id="field-terminal"
            className="lab-input"
            value={value}
            placeholder="Type to leave a trace…"
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        </div>
        <p>{value.length ? `${value.length} CHARACTERS ENTERED` : "NO SURFACE AGING"}</p>
      </div>
    </SpecimenFrame>
  );
}

export function WearChoiceSpecimen({ record, markUse, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const [checked, setChecked] = useState(false);
  const [mode, setMode] = useState("a");
  return (
    <SpecimenFrame index="08" title="Selection Bank" material="ENAMELED METAL" note="CONTACT HALO" record={record} onReset={onReset}>
      <div className="control-bay choice-bay">
        <label className="check-line">
          <span className="choice-contact" data-hot={checked || undefined}>
            <Checkbox
              checked={checked}
              className="lab-checkbox"
              onCheckedChange={(value) => {
                setChecked(Boolean(value));
                markUse("choice", 1);
                markTrace("choice", 0.16, 1.2);
              }}
            />
          </span>
          <span><b>LOG TRAJECTORY</b><small>Preserve every motion sample</small></span>
        </label>
        <RadioGroup
          value={mode}
          className="radio-line"
          onValueChange={(value) => {
            setMode(value);
            markUse("choice", 1);
            markTrace("choice", value === "a" ? 0.55 : 0.88, 1.2);
          }}
        >
          <label><span className="choice-contact" data-hot={mode === "a" || undefined}><RadioGroupItem value="a" className="lab-radio" /></span>SOFT</label>
          <label><span className="choice-contact" data-hot={mode === "b" || undefined}><RadioGroupItem value="b" className="lab-radio" /></span>HARD</label>
        </RadioGroup>
      </div>
    </SpecimenFrame>
  );
}
