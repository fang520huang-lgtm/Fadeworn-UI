"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { ComponentId, WearRecord } from "@/hooks/use-wear-system";
import { SpecimenFrame } from "./specimen-frame";

type WearAction = {
  markUse: (id: ComponentId, intensity?: number) => void;
};

type WearTrace = {
  markTrace: (id: ComponentId, position: number, intensity?: number, countAsUse?: boolean) => void;
};

type Resettable = { onReset: () => void };

const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

function splitGraphemes(value: string) {
  return Array.from(graphemeSegmenter.segment(value), ({ segment }) => segment);
}

function initialInputWearGradient(wear: number) {
  const alpha = (strength: number) => Math.min(0.9, wear * strength).toFixed(3);
  return [
    `radial-gradient(ellipse at 16% 48%, rgba(208,174,104,${alpha(0.22)}) 0%, transparent 22%)`,
    `radial-gradient(ellipse at 43% 58%, rgba(188,151,82,${alpha(0.16)}) 0%, transparent 25%)`,
    `radial-gradient(ellipse at 68% 42%, rgba(218,184,112,${alpha(0.1)}) 0%, transparent 19%)`,
    `linear-gradient(90deg, rgba(196,160,91,${alpha(1)}) 0%, rgba(196,160,91,${alpha(0.91)}) 9%, rgba(196,160,91,${alpha(0.96)}) 17%, rgba(196,160,91,${alpha(0.71)}) 31%, rgba(196,160,91,${alpha(0.76)}) 39%, rgba(196,160,91,${alpha(0.5)}) 54%, rgba(196,160,91,${alpha(0.55)}) 63%, rgba(196,160,91,${alpha(0.33)}) 72%, rgba(196,160,91,${alpha(0.18)}) 81%, rgba(196,160,91,${alpha(0.075)}) 89%, rgba(196,160,91,${alpha(0.018)}) 95%, transparent 100%)`,
  ].join(", ");
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

export function WearButtonSpecimen({ record, markUse, onReset }: { record: WearRecord } & WearAction & Resettable) {
  return (
    <SpecimenFrame id="button" index="01" title="Button" material="PAINTED STEEL" record={record} onReset={onReset}>
      <div className="control-bay button-bay">
        <Button
          className="lab-push-button"
          onClick={() => markUse("button", 1)}
        >
          <span className="button-caption"><b>Press</b></span>
        </Button>
        <p>Each press adds wear.</p>
      </div>
    </SpecimenFrame>
  );
}

export function WearToggleSpecimen({ record, markTrace, onReset }: { record: WearRecord } & WearTrace & Resettable) {
  const [checked, setChecked] = useState(false);
  const leftWear = record.trace.slice(0, 12).reduce((a, b) => a + b, 0) / 12;
  const rightWear = record.trace.slice(12).reduce((a, b) => a + b, 0) / 12;
  return (
    <SpecimenFrame id="toggle" index="02" title="Toggle" material="BAKELITE" record={record} onReset={onReset}>
      <div className="control-bay toggle-bay">
        <div className="toggle-assembly">
          <span className="toggle-label">OFF</span>
          <div className="toggle-shell" style={{ "--left-wear": leftWear, "--right-wear": rightWear } as React.CSSProperties}>
            <Switch
              checked={checked}
              aria-label="Main circuit lever"
              className="lab-switch"
              onCheckedChange={(value) => {
                setChecked(value);
                markTrace("toggle", value ? 0.82 : 0.18, 1.6, true);
              }}
            />
          </div>
          <span className="toggle-label">ON</span>
        </div>
        <p>{checked ? "On" : "Off"}</p>
      </div>
    </SpecimenFrame>
  );
}

export function WearInputSpecimen({ record, markInputGlyph, onReset }: { record: WearRecord; markInputGlyph: (start: number, end: number, intensity?: number) => void } & Resettable) {
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
    const contentWidth = Math.max(1, input.clientWidth - padding);
    const availableWidth = Math.max(1, contentWidth - 4);
    const measure = (text: string) => {
      const characterCount = splitGraphemes(text).length;
      return context.measureText(text).width + Math.max(0, characterCount - 1) * letterSpacing;
    };
    return { availableWidth, contentWidth, measure };
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
    const boundsOf = (characters: string[], index: number) => {
      const start = metrics.measure(characters.slice(0, index).join("")) / metrics.contentWidth;
      const end = metrics.measure(characters.slice(0, index + 1).join("")) / metrics.contentWidth;
      return {
        start: Math.min(1, Math.max(0, start)),
        end: Math.min(1, Math.max(0, end)),
      };
    };

    acceptedEdit.removed.forEach((_, offset) => {
      const bounds = boundsOf(previousCharacters, acceptedEdit.start + offset);
      markInputGlyph(bounds.start, bounds.end, 1);
    });
    acceptedEdit.added.forEach((_, offset) => {
      const bounds = boundsOf(acceptedCharacters, acceptedEdit.start + offset);
      markInputGlyph(bounds.start, bounds.end, 1);
    });

    committedValueRef.current = acceptedValue;
    setValue(acceptedValue);
    setAtLimit(acceptedValue !== proposedValue);
  };

  const characterCount = splitGraphemes(value).length;
  return (
    <SpecimenFrame id="input" index="04" title="Input" material="ANODIZED ALLOY" record={record} onReset={onReset}>
      <div className="control-bay input-bay">
        <label htmlFor="field-terminal">Note</label>
        <div className="input-shell">
          <span className="input-wear-track" aria-hidden="true">
            {record.glyphWear.map((zone) => {
              const isInitialBand = zone.createdAt === 0;
              return (
                <i
                  key={`${zone.start}-${zone.end}`}
                  style={{
                    left: `${zone.start * 100}%`,
                    width: `${Math.max(0.2, (zone.end - zone.start) * 100)}%`,
                    opacity: isInitialBand ? 1 : Math.min(0.9, zone.wear * 0.82),
                    background: isInitialBand ? initialInputWearGradient(zone.wear) : undefined,
                    filter: isInitialBand ? "blur(0.8px)" : undefined,
                  }}
                />
              );
            })}
          </span>
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
        <p>{atLimit ? `Width limit · ${characterCount} characters` : value.length ? `${characterCount} characters entered` : "Typing and deleting both add wear."}</p>
      </div>
    </SpecimenFrame>
  );
}

export function WearChoiceSpecimen({ record, markUse, onReset }: { record: WearRecord } & WearAction & Resettable) {
  const [checked, setChecked] = useState(false);
  const [mode, setMode] = useState("a");
  return (
    <SpecimenFrame id="choice" index="08" title="Checkbox / Radio" material="ENAMELED METAL" record={record} onReset={onReset}>
      <div className="control-bay choice-bay">
        <label className="check-line">
          <span className="choice-contact" data-hot={checked || undefined}>
            <Checkbox
              checked={checked}
              className="lab-checkbox"
              onCheckedChange={(value) => {
                setChecked(Boolean(value));
                markUse("choice", 1);
              }}
            />
          </span>
          <span><b>Track activity</b><small>Record which options you pick</small></span>
        </label>
        <RadioGroup
          value={mode}
          className="radio-line"
          onValueChange={(value) => {
            setMode(value);
            markUse("choice", 1);
          }}
        >
          <label><span className="choice-contact" data-hot={mode === "a" || undefined}><RadioGroupItem value="a" className="lab-radio" /></span>SOFT</label>
          <label><span className="choice-contact" data-hot={mode === "b" || undefined}><RadioGroupItem value="b" className="lab-radio" /></span>HARD</label>
        </RadioGroup>
      </div>
    </SpecimenFrame>
  );
}
