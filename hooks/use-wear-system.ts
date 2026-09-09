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

const STORAGE_KEY = "wear-ui-lab/v2";
const TRACE_SEGMENTS = 24;

const increments: Record<ComponentId, number> = {
  button: 0.034,
  toggle: 0.042,
  slider: 0.009,
  input: 0.004,
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

function parseStoredState(raw: string | null): WearState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<WearState>;
    const fresh = createFreshWearState();
    for (const id of COMPONENT_IDS) {
      const saved = parsed[id];
      if (!saved) continue;
      fresh[id] = {
        usageCount: Number(saved.usageCount) || 0,
        wearLevel: clamp(Number(saved.wearLevel) || 0),
        lastUsed: saved.lastUsed ?? null,
        hitPositions: Array.isArray(saved.hitPositions)
          ? saved.hitPositions.slice(-18)
          : [],
        trace: Array.from({ length: TRACE_SEGMENTS }, (_, index) =>
          clamp(Number(saved.trace?.[index]) || 0),
        ),
      };
    }
    return fresh;
  } catch {
    return null;
  }
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
    const stored = parseStoredState(window.localStorage.getItem(STORAGE_KEY));
    const frame = window.requestAnimationFrame(() => {
      if (stored) setWearState(stored);
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    stateRef.current = wearState;
  }, [wearState]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wearState));
  }, [hydrated, wearState]);

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
        const trace = record.trace.map((value, index) => {
          const distance = Math.abs(index - center);
          const addition = distance === 0 ? 0.055 : distance === 1 ? 0.024 : 0;
          return clamp(value + addition * intensity);
        });
        return {
          ...current,
          [id]: {
            ...record,
            usageCount: record.usageCount + (countAsUse ? 1 : 0),
            wearLevel: clamp(record.wearLevel + increments[id] * intensity),
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
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const accelerate = useCallback(() => {
    setWearState((current) => {
      const next = { ...current } as WearState;
      COMPONENT_IDS.forEach((id, componentIndex) => {
        const record = current[id];
        const focus = ((componentIndex * 7 + 5) % TRACE_SEGMENTS) / (TRACE_SEGMENTS - 1);
        const center = Math.round(focus * (TRACE_SEGMENTS - 1));
        next[id] = {
          ...record,
          usageCount: record.usageCount + 28 + componentIndex * 3,
          wearLevel: clamp(Math.max(record.wearLevel, 0.62 + (componentIndex % 3) * 0.08)),
          lastUsed: Date.now(),
          hitPositions:
            id === "button"
              ? [
                  ...record.hitPositions,
                  { x: 0.44, y: 0.53, pressure: 0.9, createdAt: Date.now() },
                  { x: 0.58, y: 0.47, pressure: 0.8, createdAt: Date.now() },
                ].slice(-18)
              : record.hitPositions,
          trace: record.trace.map((value, index) =>
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
    const records = Object.values(wearState);
    const interactions = records.reduce((sum, item) => sum + item.usageCount, 0);
    const averageWear = records.reduce((sum, item) => sum + item.wearLevel, 0) / records.length;
    const mostUsed = COMPONENT_IDS.reduce((best, id) =>
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
