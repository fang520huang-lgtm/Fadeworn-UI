"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { traceGradient, type ComponentId, type WearRecord } from "@/hooks/use-wear-system";
import { SpecimenFrame } from "./specimen-frame";

type Marks = {
  markUse: (id: ComponentId, intensity?: number, point?: { x: number; y: number }) => void;
  markTrace: (id: ComponentId, position: number, intensity?: number, countAsUse?: boolean) => void;
};

type Resettable = { onReset: () => void };

const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

function splitGraphemes(value: string) {
  return Array.from(graphemeSegmenter.segment(value), ({ segment }) => segment);
}

function textEdit(previous: string[], next: string[]) {
  let start = 0;
  while (start < previous.length && start < next.length && previous[start] === next[start]) {
    start += 1;
  }

  let suffixLength = 0;
  while (
    suffixLength < previous.length - start
    && suffixLength < next.length - start
    && previous[previous.length - 1 - suffixLength] === next[next.length - 1 - suffixLength]
  ) {
    suffixLength += 1;
  }

  return {
    start,
    removed: previous.slice(start, previous.length - suffixLength),
    added: next.slice(start, next.length - suffixLength),
    prefix: next.slice(0, start),
    suffix: suffixLength ? next.slice(next.length - suffixLength) : [],
  };
}

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

export function WearInputSpecimen({ record, markTrace, onReset }: { record: WearRecord } & Pick<Marks, "markTrace"> & Resettable) {
  const [value, setValue] = useState("");
  const [atLimit, setAtLimit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const committedValueRef = useRef("");
  const composingRef = useRef(false);

  const getTextMetrics = () => {
    const input = inputRef.current;
    if (!input) return null;
    const styles = window.getComputedStyle(input);
    canvasRef.current ??= document.createElement("canvas");
    const context = canvasRef.current.getContext("2d");
    if (!context) return null;
    context.font = [
      styles.fontStyle,
      styles.fontVariant,
      styles.fontWeight,
      styles.fontSize,
      styles.fontFamily,
    ].join(" ");
    const letterSpacing = Number.parseFloat(styles.letterSpacing) || 0;
    const padding = (Number.parseFloat(styles.paddingLeft) || 0)
      + (Number.parseFloat(styles.paddingRight) || 0);
    const availableWidth = Math.max(1, input.clientWidth - padding - 4);
    const measure = (text: string) => {
      const characterCount = splitGraphemes(text).length;
      return context.measureText(text).width + Math.max(0, characterCount - 1) * letterSpacing;
    };
    return { availableWidth, measure };
  };

  const commitValue = (proposedValue: string) => {
    const metrics = getTextMetrics();
    if (!metrics) {
      committedValueRef.current = proposedValue;
      setValue(proposedValue);
      return;
    }

    const previousValue = committedValueRef.current;
    const proposedCharacters = splitGraphemes(proposedValue);
    let acceptedValue = proposedValue;

    if (metrics.measure(proposedValue) > metrics.availableWidth) {
      const proposedEdit = textEdit(splitGraphemes(previousValue), proposedCharacters);
      const acceptedCharacters: string[] = [];
      for (const character of proposedEdit.added) {
        const candidate = [
          ...proposedEdit.prefix,
          ...acceptedCharacters,
          character,
          ...proposedEdit.suffix,
        ].join("");
        if (metrics.measure(candidate) > metrics.availableWidth) break;
        acceptedCharacters.push(character);
      }
      const fittedValue = [
        ...proposedEdit.prefix,
        ...acceptedCharacters,
        ...proposedEdit.suffix,
      ].join("");
      acceptedValue = metrics.measure(fittedValue) <= metrics.availableWidth
        ? fittedValue
        : previousValue;
    }

    const previousCharacters = splitGraphemes(previousValue);
    const acceptedCharacters = splitGraphemes(acceptedValue);
    const acceptedEdit = textEdit(previousCharacters, acceptedCharacters);
    const positionOf = (characters: string[], index: number) => {
      const before = metrics.measure(characters.slice(0, index).join(""));
      const after = metrics.measure(characters.slice(0, index + 1).join(""));
      return Math.min(1, Math.max(0, ((before + after) / 2) / metrics.availableWidth));
    };

    acceptedEdit.removed.forEach((_, offset) => {
      markTrace("input", positionOf(previousCharacters, acceptedEdit.start + offset), 1, true);
    });
    acceptedEdit.added.forEach((_, offset) => {
      markTrace("input", positionOf(acceptedCharacters, acceptedEdit.start + offset), 1, true);
    });

    committedValueRef.current = acceptedValue;
    setValue(acceptedValue);
    setAtLimit(acceptedValue !== proposedValue);
  };

  const characterCount = splitGraphemes(value).length;
  return (
    <SpecimenFrame index="04" title="Field Terminal" material="ANODIZED ALLOY" note="GLYPH-POSITION ABRASION" record={record} onReset={onReset}>
      <div className="control-bay input-bay">
        <label htmlFor="field-terminal">OPERATOR NOTE</label>
        <div className="input-shell">
          <span
            className="input-wear-track"
            style={{ backgroundImage: traceGradient(record.trace, "196, 160, 91", 0) }}
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            id="field-terminal"
            className="lab-input"
            value={value}
            placeholder="Type to leave a trace…"
            onCompositionStart={() => {
              composingRef.current = true;
            }}
            onCompositionEnd={(event) => {
              composingRef.current = false;
              commitValue(event.currentTarget.value);
            }}
            onChange={(event) => {
              const isComposing = composingRef.current
                || Boolean((event.nativeEvent as InputEvent).isComposing);
              if (isComposing) {
                setValue(event.target.value);
                return;
              }
              commitValue(event.target.value);
            }}
          />
        </div>
        <p>{atLimit ? `WIDTH LIMIT · ${characterCount} GLYPHS` : value.length ? `${characterCount} GLYPHS ENTERED` : "TYPE OR ERASE TO WEAR"}</p>
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
