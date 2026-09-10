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
const INITIAL_SLIDER_TRACE = [
  0.08, 0.07, 0.09, 0.08, 0.1, 0.13,
  0.3, 0.18, 0.09, 0.08, 0.1, 0.09,
  0.16, 0.36, 0.27, 0.12, 0.26, 0.68,
  0.76, 0.38, 0.31, 0.13, 0.06, 0.04,
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

    const focus = ((componentIndex * 7 + 5) % TRACE_SEGMENTS) / (TRACE_SEGMENTS - 1);
    const center = Math.round(focus * (TRACE_SEGMENTS - 1));
    next[id] = {
      ...record,
      usageCount: 28 + componentIndex * 3,
      wearLevel: 0.62 + (componentIndex % 3) * 0.08,
      trace: record.trace.map((value, index) =>
        Math.max(value, 0.12 + Math.max(0, 0.76 - Math.abs(index - center) * 0.105)),
      ),
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
        const hitPositions = point
          ? [
              ...record.hitPositions,
              {
                x: clamp(point.x),
                y: clamp(point.y),
                pressure: clamp(0.35 + intensity * 0.25),
                createdAt: Date.now(),
              },
            ].slice(-18)
          : record.hitPositions;
        return {
          ...current,
          [id]: {
            ...record,
            usageCount: record.usageCount + 1,
            wearLevel: clamp(record.wearLevel + increments[id] * intensity),
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
        const center = Math.round(clamp(position) * (TRACE_SEGMENTS - 1));
        const toggleIndices = center < TRACE_SEGMENTS / 2
          ? TOGGLE_LEFT_TRACE_INDICES
          : TOGGLE_RIGHT_TRACE_INDICES;
        const trace = record.trace.map((value, index) => {
          if (id === "toggle") {
            return toggleIndices.includes(index) ? clamp(value + 0.2) : value;
          }
          const distance = Math.abs(index - center);
          const addition = distance === 0 ? 0.055 : distance === 1 ? 0.024 : 0;
          return clamp(value + addition * intensity);
        });
        return {
          ...current,
          [id]: {
            ...record,
            usageCount: record.usageCount + (countAsUse ? 1 : 0),
            wearLevel: id === "toggle"
              ? clamp(record.wearLevel + 0.1)
              : clamp(record.wearLevel + increments[id] * intensity),
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
    const averageWear = records.reduce((sum, item) => sum + item.wearLevel, 0) / records.length;
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
                wearPercent: Math.round(stateRef.current[id].wearLevel * 100),
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
