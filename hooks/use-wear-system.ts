"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const COMPONENT_IDS = [
  "button",
  "toggle",
  "slider",
  "input",
  "tabs",
  "navigation",
  "card",
  "choice",
  "scrollbar",
  "knob",
] as const;

export type ComponentId = (typeof COMPONENT_IDS)[number];

export type WearPoint = {
  x: number;
  y: number;
  pressure: number;
  createdAt: number;
};

export type InputGlyphWear = {
  start: number;
  end: number;
  wear: number;
  createdAt: number;
};

export type WearRecord = {
  usageCount: number;
  wearLevel: number;
  lastUsed: number | null;
  hitPositions: WearPoint[];
  trace: number[];
  glyphWear: InputGlyphWear[];
};

export type WearState = Record<ComponentId, WearRecord>;

const LEGACY_STORAGE_KEY = "wear-ui-lab/v2";
const TRACE_SEGMENTS = 24;
const WEARABLE_COMPONENT_IDS = COMPONENT_IDS;

const increments: Record<ComponentId, number> = {
  button: 0.034,
  toggle: 0.042,
  slider: 0.009,
  input: 0.012,
  tabs: 0.028,
  navigation: 0.025,
  card: 0.036,
  choice: 0.035,
  scrollbar: 0.006,
  knob: 0.01,
};

const TOGGLE_LEFT_TRACE_INDICES = [3, 4, 5];
const TOGGLE_RIGHT_TRACE_INDICES = [18, 19, 20];
const INPUT_GLYPH_WEAR_INCREMENT = 0.055;
const CLICK_WEAR_INCREMENT = 0.1;
const FOLIO_VISUAL_LIMIT = 0.62;
const TAB_TRACE_INDICES = [0, 12, 23];
const NAVIGATION_TRACE_INDICES = [0, 8, 15, 23];
const DIRECT_CLICK_COMPONENTS = new Set<ComponentId>(["button", "card", "choice"]);
const INITIAL_SLIDER_TRACE = [
  0.03, 0.04, 0.04, 0.05, 0.18, 0.42,
  0.58, 0.62, 0.56, 0.48, 0.42, 0.36,
  0.44, 0.58, 0.78, 0.88, 0.84, 0.88,
  0.92, 0.72, 0.6, 0.5, 0.42, 0.2,
];
const INITIAL_KNOB_TRACE = [
  0.68, 0.75, 0.66, 0.52, 0.38, 0.27,
  0.18, 0.12, 0.09, 0.11, 0.16, 0.23,
  0.3, 0.24, 0.17, 0.12, 0.09, 0.07,
  0.06, 0.07, 0.09, 0.12, 0.14, 0.1,
];

function emptyRecord(): WearRecord {
  return {
    usageCount: 0,
    wearLevel: 0,
    lastUsed: null,
    hitPositions: [],
    trace: Array.from({ length: TRACE_SEGMENTS }, () => 0),
    glyphWear: [],
  };
}

export function createFreshWearState(): WearState {
  return Object.fromEntries(
    COMPONENT_IDS.map((id) => [id, emptyRecord()]),
  ) as WearState;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function toggleWearLevel(trace: number[]) {
  const averageAt = (indices: number[]) =>
    indices.reduce((sum, index) => sum + trace[index], 0) / indices.length;
  return clamp(
    (averageAt(TOGGLE_LEFT_TRACE_INDICES) + averageAt(TOGGLE_RIGHT_TRACE_INDICES)) / 2,
  );
}

function visibleTraceLevel(id: "tabs" | "navigation", trace: number[]) {
  const indices = id === "tabs" ? TAB_TRACE_INDICES : NAVIGATION_TRACE_INDICES;
  return clamp(Math.max(0, ...indices.map((index) => trace[index] ?? 0)));
}

function knobTraceForLevel(level: number) {
  const peak = Math.max(...INITIAL_KNOB_TRACE);
  return INITIAL_KNOB_TRACE.map((value) => clamp((value / peak) * level));
}

export function getWearLevelForDisplay(id: ComponentId, record: WearRecord) {
  if (id === "input") {
    return clamp(Math.max(0, ...record.glyphWear.map((zone) => zone.wear)));
  }
  if (id === "tabs" || id === "navigation") {
    return visibleTraceLevel(id, record.trace);
  }
  if (id === "slider" || id === "scrollbar") {
    return clamp(Math.max(0, ...record.trace));
  }
  if (id === "card") {
    return clamp(Math.min(record.wearLevel, FOLIO_VISUAL_LIMIT) / FOLIO_VISUAL_LIMIT);
  }
  if (id === "knob") {
    return clamp(Math.max(record.wearLevel, ...record.trace));
  }
  return clamp(record.wearLevel);
}

export function createInitialWearState(): WearState {
  const next = createFreshWearState();

  WEARABLE_COMPONENT_IDS.forEach((id, componentIndex) => {
    const record = next[id];
    if (id === "toggle") {
      const toggleTrace = record.trace.map((value, index) =>
        TOGGLE_LEFT_TRACE_INDICES.includes(index) || TOGGLE_RIGHT_TRACE_INDICES.includes(index)
          ? 0.7
          : value,
      );
      next[id] = {
        ...record,
        usageCount: 28 + componentIndex * 3,
        wearLevel: toggleWearLevel(toggleTrace),
        trace: toggleTrace,
      };
      return;
    }

    if (id === "input") {
      next[id] = {
        ...record,
        usageCount: 40,
        wearLevel: 0.7,
        glyphWear: [{
          start: 0,
          end: 0.6,
          wear: 0.7,
          createdAt: 0,
        }],
      };
      return;
    }

    if (id === "slider") {
      next[id] = {
        ...record,
        usageCount: 28 + componentIndex * 3,
        wearLevel: 0.76,
        trace: INITIAL_SLIDER_TRACE.slice(),
      };
      return;
    }

    if (id === "tabs") {
      const tabTrace = record.trace.map((_, index) => {
        if (index === TAB_TRACE_INDICES[0]) return 0.7;
        if (index === TAB_TRACE_INDICES[1]) return 1;
        if (index === TAB_TRACE_INDICES[2]) return 0.3;
        return 0;
      });
      next[id] = {
        ...record,
        usageCount: 28 + componentIndex * 3,
        wearLevel: visibleTraceLevel("tabs", tabTrace),
        trace: tabTrace,
      };
      return;
    }

    const focus = ((componentIndex * 7 + 5) % TRACE_SEGMENTS) / (TRACE_SEGMENTS - 1);
    const center = Math.round(focus * (TRACE_SEGMENTS - 1));
    const baseTrace = record.trace.map((value, index) =>
      Math.max(value, 0.12 + Math.max(0, 0.76 - Math.abs(index - center) * 0.105)),
    );

    if (id === "card") {
      next[id] = {
        ...record,
        usageCount: 28 + componentIndex * 3,
        wearLevel: 0.62 * 0.7,
        trace: baseTrace,
      };
      return;
    }

    if (id === "knob") {
      const initialKnobLevel = 0.62;
      next[id] = {
        ...record,
        usageCount: 28 + componentIndex * 3,
        wearLevel: initialKnobLevel,
        trace: knobTraceForLevel(initialKnobLevel),
      };
      return;
    }

    if (id === "navigation") {
      const navigationCenters = [0, 1 / 3, 2 / 3, 1]
        .map((position) => Math.round(position * (TRACE_SEGMENTS - 1)));
      const navigationTrace = baseTrace.map((value, index) => {
        const distance = Math.min(...navigationCenters.map((clickCenter) => Math.abs(index - clickCenter)));
        const addition = distance === 0 ? 0.055 : distance === 1 ? 0.024 : 0;
        return clamp(value + addition * 3.8);
      });
      next[id] = {
        ...record,
        usageCount: 28 + componentIndex * 3 + navigationCenters.length,
        wearLevel: visibleTraceLevel("navigation", navigationTrace),
        trace: navigationTrace,
      };
      return;
    }

    next[id] = {
      ...record,
      usageCount: 28 + componentIndex * 3,
      wearLevel: 0.62 + (componentIndex % 3) * 0.08,
      trace: baseTrace,
    };
  });

  return next;
}

type ModelContext = {
  registerTool?: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: Record<string, unknown>;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options?: { signal: AbortSignal },
  ) => void | Promise<void>;
};

function assertNoOptions(input: unknown) {
  if (input === undefined) return;
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("Expected an empty object.");
  }
  if (Object.keys(input as Record<string, unknown>).length > 0) {
    throw new Error("This tool does not accept options.");
  }
}

export function useWearSystem() {
  const [wearState, setWearState] = useState<WearState>(createInitialWearState);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(wearState);

  useEffect(() => {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    const frame = window.requestAnimationFrame(() => {
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    stateRef.current = wearState;
  }, [wearState]);

  const markUse = useCallback(
    (id: ComponentId, intensity = 1, point?: { x: number; y: number }) => {
      setWearState((current) => {
        const record = current[id];
        const wearIntensity = id === "knob" ? intensity / 3 : intensity;
        const hitPositions = point
          ? [
              ...record.hitPositions,
              {
                x: clamp(point.x),
                y: clamp(point.y),
                pressure: clamp(0.35 + wearIntensity * 0.25),
                createdAt: Date.now(),
              },
            ].slice(-18)
          : record.hitPositions;
        return {
          ...current,
          [id]: {
            ...record,
            usageCount: record.usageCount + 1,
            wearLevel: clamp(record.wearLevel + (
              DIRECT_CLICK_COMPONENTS.has(id)
                ? id === "card" ? FOLIO_VISUAL_LIMIT * CLICK_WEAR_INCREMENT : CLICK_WEAR_INCREMENT
                : id === "knob" ? 0 : increments[id] * wearIntensity
            )),
            lastUsed: Date.now(),
            hitPositions,
          },
        };
      });
    },
    [],
  );

  const markTrace = useCallback(
    (id: ComponentId, position: number, intensity = 1, countAsUse = false) => {
      setWearState((current) => {
        const record = current[id];
        const wearIntensity = id === "knob" ? intensity / 3 : intensity;
        const center = Math.round(clamp(position) * (TRACE_SEGMENTS - 1));
        const toggleIndices = center < TRACE_SEGMENTS / 2
          ? TOGGLE_LEFT_TRACE_INDICES
          : TOGGLE_RIGHT_TRACE_INDICES;
        const isLocalClick = id === "tabs" || id === "navigation";
        const trace = record.trace.map((value, index) => {
          if (id === "toggle") {
            return toggleIndices.includes(index) ? clamp(value + 0.2) : value;
          }
          const distance = Math.abs(index - center);
          if (isLocalClick) {
            const addition = distance === 0 ? CLICK_WEAR_INCREMENT : distance === 1 ? 0.04 : 0;
            return clamp(value + addition);
          }
          const addition = distance === 0 ? 0.055 : distance === 1 ? 0.024 : 0;
          return clamp(value + addition * wearIntensity);
        });
        return {
          ...current,
          [id]: {
            ...record,
            usageCount: record.usageCount + (countAsUse ? 1 : 0),
            wearLevel: id === "toggle"
              ? clamp(record.wearLevel + CLICK_WEAR_INCREMENT)
              : isLocalClick
                ? visibleTraceLevel(id, trace)
                : clamp(record.wearLevel + increments[id] * wearIntensity),
            lastUsed: Date.now(),
            trace,
          },
        };
      });
    },
    [],
  );

  const markInputGlyph = useCallback((start: number, end: number, intensity = 1) => {
    setWearState((current) => {
      const record = current.input;
      const normalizedStart = Math.round(clamp(start) * 10000) / 10000;
      const normalizedEnd = Math.round(clamp(Math.max(end, start + 0.001)) * 10000) / 10000;
      const matchIndex = record.glyphWear.findIndex((zone) =>
        Math.abs(zone.start - normalizedStart) < 0.001
        && Math.abs(zone.end - normalizedEnd) < 0.001,
      );
      const glyphWear = matchIndex >= 0
        ? record.glyphWear.map((zone, index) => index === matchIndex
          ? {
              ...zone,
              wear: clamp(zone.wear + INPUT_GLYPH_WEAR_INCREMENT * intensity),
              createdAt: Date.now(),
            }
          : zone)
        : [
            ...record.glyphWear,
            {
              start: normalizedStart,
              end: normalizedEnd,
              wear: clamp(INPUT_GLYPH_WEAR_INCREMENT * intensity),
              createdAt: Date.now(),
            },
          ].slice(-96);

      return {
        ...current,
        input: {
          ...record,
          usageCount: record.usageCount + 1,
          wearLevel: clamp(record.wearLevel + increments.input * intensity),
          lastUsed: Date.now(),
          glyphWear,
        },
      };
    });
  }, []);

  const setKnobWear = useCallback((level: number) => {
    const normalizedLevel = clamp(level);
    setWearState((current) => ({
      ...current,
      knob: {
        ...current.knob,
        wearLevel: normalizedLevel,
        trace: knobTraceForLevel(normalizedLevel),
        lastUsed: Date.now(),
      },
    }));
  }, []);

  const resetAll = useCallback(() => {
    const fresh = createFreshWearState();
    setWearState(fresh);
  }, []);

  const resetOne = useCallback((id: ComponentId) => {
    setWearState((current) => ({
      ...current,
      [id]: emptyRecord(),
    }));
  }, []);

  const applyInitialWear = useCallback(() => {
    setWearState(createInitialWearState());
  }, []);

  const stats = useMemo(() => {
    const records = WEARABLE_COMPONENT_IDS.map((id) => wearState[id]);
    const interactions = records.reduce((sum, item) => sum + item.usageCount, 0);
    const averageWear = WEARABLE_COMPONENT_IDS.reduce(
      (sum, id) => sum + getWearLevelForDisplay(id, wearState[id]),
      0,
    ) / records.length;
    const mostUsed = WEARABLE_COMPONENT_IDS.reduce((best, id) =>
      wearState[id].usageCount > wearState[best].usageCount ? id : best,
    );
    return { interactions, averageWear, mostUsed };
  }, [wearState]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = async () => {
      await context.registerTool?.(
        {
          name: "inspect_wear_history",
          title: "Inspect wear history",
          description: "Read the current interaction count and wear level for every UI specimen.",
          inputSchema: { type: "object", properties: {}, additionalProperties: false },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          execute: (input) => {
            assertNoOptions(input);
            return {
              components: COMPONENT_IDS.map((id) => ({
                id,
                uses: stateRef.current[id].usageCount,
                wearPercent: Math.round(getWearLevelForDisplay(id, stateRef.current[id]) * 100),
              })),
            };
          },
        },
        { signal: lifecycle.signal },
      );
      await context.registerTool?.(
        {
          name: "apply_initial_wear",
          title: "Apply initial wear",
          description: "Restore every visible specimen to the curated initial-wear preset.",
          inputSchema: { type: "object", properties: {}, additionalProperties: false },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute: (input) => {
            assertNoOptions(input);
            applyInitialWear();
            return { status: "initial_wear_applied" };
          },
        },
        { signal: lifecycle.signal },
      );
    };
    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, [applyInitialWear]);

  return {
    wearState,
    hydrated,
    stats,
    markUse,
    markTrace,
    markInputGlyph,
    setKnobWear,
    resetOne,
    resetAll,
    applyInitialWear,
  };
}

export function traceGradient(trace: number[], color = "196, 160, 91", baseAlpha = 0.04) {
  const stops = trace.flatMap((value, index) => {
    const from = (index / trace.length) * 100;
    const to = ((index + 1) / trace.length) * 100;
    const alpha = Math.min(0.9, baseAlpha + value * 0.82).toFixed(3);
    return [`rgba(${color},${alpha}) ${from}%`, `rgba(${color},${alpha}) ${to}%`];
  });
  return `linear-gradient(90deg, ${stops.join(",")})`;
}
