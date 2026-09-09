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

export type WearRecord = {
  usageCount: number;
  wearLevel: number;
  lastUsed: number | null;
  hitPositions: WearPoint[];
  trace: number[];
};

export type WearState = Record<ComponentId, WearRecord>;

const LEGACY_STORAGE_KEY = "wear-ui-lab/v2";
const TRACE_SEGMENTS = 24;
const WEARABLE_COMPONENT_IDS = COMPONENT_IDS.filter(
  (id): id is Exclude<ComponentId, "input"> => id !== "input",
);

const increments: Record<ComponentId, number> = {
  button: 0.034,
  toggle: 0.042,
  slider: 0.009,
  input: 0,
  tabs: 0.028,
  navigation: 0.025,
  card: 0.036,
  choice: 0.035,
  scrollbar: 0.006,
  knob: 0.01,
};

function emptyRecord(): WearRecord {
  return {
    usageCount: 0,
    wearLevel: 0,
    lastUsed: null,
    hitPositions: [],
    trace: Array.from({ length: TRACE_SEGMENTS }, () => 0),
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
  const [wearState, setWearState] = useState<WearState>(createFreshWearState);
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
        const wearLevel = clamp(record.wearLevel + increments[id] * intensity);
        const canAddWear = wearLevel > record.wearLevel;
        const hitPositions = point && canAddWear
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
            wearLevel,
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
        const requestedWear = increments[id] * intensity;
        const wearLevel = clamp(record.wearLevel + requestedWear);
        const appliedWear = wearLevel - record.wearLevel;
        const appliedIntensity = requestedWear > 0
          ? intensity * (appliedWear / requestedWear)
          : 0;
        const center = Math.round(clamp(position) * (TRACE_SEGMENTS - 1));
        const trace = record.trace.map((value, index) => {
          const distance = Math.abs(index - center);
          const addition = distance === 0 ? 0.055 : distance === 1 ? 0.024 : 0;
          return clamp(value + addition * appliedIntensity);
        });
        return {
          ...current,
          [id]: {
            ...record,
            usageCount: record.usageCount + (countAsUse ? 1 : 0),
            wearLevel,
            lastUsed: Date.now(),
            trace,
          },
        };
      });
    },
    [],
  );

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

  const accelerate = useCallback(() => {
    setWearState((current) => {
      const next = { ...current } as WearState;
      WEARABLE_COMPONENT_IDS.forEach((id, componentIndex) => {
        const record = current[id];
        const isFullyWorn = record.wearLevel >= 1;
        const focus = ((componentIndex * 7 + 5) % TRACE_SEGMENTS) / (TRACE_SEGMENTS - 1);
        const center = Math.round(focus * (TRACE_SEGMENTS - 1));
        next[id] = {
          ...record,
          usageCount: record.usageCount + 28 + componentIndex * 3,
          wearLevel: clamp(Math.max(record.wearLevel, 0.62 + (componentIndex % 3) * 0.08)),
          lastUsed: Date.now(),
          hitPositions: record.hitPositions,
          trace: isFullyWorn ? record.trace : record.trace.map((value, index) =>
            clamp(
              Math.max(
                value,
                0.12 + Math.max(0, 0.76 - Math.abs(index - center) * 0.105),
              ),
            ),
          ),
        };
      });
      return next;
    });
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
          name: "accelerate_wear",
          title: "Accelerate wear",
          description: "Age every visible specimen to demonstrate a heavily used interface.",
          inputSchema: { type: "object", properties: {}, additionalProperties: false },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute: (input) => {
            assertNoOptions(input);
            accelerate();
            return { status: "accelerated" };
          },
        },
        { signal: lifecycle.signal },
      );
    };
    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, [accelerate]);

  return {
    wearState,
    hydrated,
    stats,
    markUse,
    markTrace,
    resetOne,
    resetAll,
    accelerate,
  };
}

export function traceGradient(trace: number[], color = "196, 160, 91") {
  const stops = trace.flatMap((value, index) => {
    const from = (index / trace.length) * 100;
    const to = ((index + 1) / trace.length) * 100;
    const alpha = Math.min(0.9, 0.04 + value * 0.82).toFixed(3);
    return [`rgba(${color},${alpha}) ${from}%`, `rgba(${color},${alpha}) ${to}%`];
  });
  return `linear-gradient(90deg, ${stops.join(",")})`;
}
