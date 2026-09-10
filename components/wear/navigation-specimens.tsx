"use client";

import { useState } from "react";
import { Activity, Archive, Radio, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComponentId, WearRecord } from "@/hooks/use-wear-system";
import { SpecimenFrame } from "./specimen-frame";

type Marks = {
  markUse: (id: ComponentId, intensity?: number, point?: { x: number; y: number }) => void;
  markTrace: (id: ComponentId, position: number, intensity?: number, countAsUse?: boolean) => void;
};

type Resettable = { onReset: () => void };

const tabItems = ["SIGNAL", "HISTORY", "NOTES"];

export function WearTabsSpecimen({ record, markUse, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const [tab, setTab] = useState("SIGNAL");
  return (
    <SpecimenFrame index="05" title="Mode Register" material="PRINTED ABS" note="FREQUENCY EXPOSURE" record={record} meterLevel={Math.max(0, ...record.trace)} onReset={onReset}>
      <div className="control-bay tabs-bay">
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value);
            const index = tabItems.indexOf(value);
            markUse("tabs", 1);
            markTrace("tabs", index / (tabItems.length - 1), 1.6);
          }}
        >
          <TabsList className="lab-tabs-list">
            {tabItems.map((item, index) => {
              const traceIndex = Math.round((index / (tabItems.length - 1)) * (record.trace.length - 1));
              return (
                <TabsTrigger
                  key={item}
                  value={item}
                  className="lab-tab"
                  style={{ "--tab-wear": record.trace[traceIndex] } as React.CSSProperties}
                >{item}</TabsTrigger>
              );
            })}
          </TabsList>
          {tabItems.map((item) => (
            <TabsContent key={item} value={item} className="tab-display">
              <span>{item === "SIGNAL" ? "14.82" : item === "HISTORY" ? record.usageCount : "A—17"}</span>
              <p>{item === "SIGNAL" ? "HZ / STABLE" : item === "HISTORY" ? "RECORDED VISITS" : "FIELD ANNOTATION"}</p>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SpecimenFrame>
  );
}

const navItems = [
  { label: "MONITOR", icon: Activity },
  { label: "ARCHIVE", icon: Archive },
  { label: "CHANNELS", icon: Radio },
  { label: "CONFIG", icon: Settings2 },
];

export function WearNavigationSpecimen({ record, markUse, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const [active, setActive] = useState(0);
  return (
    <SpecimenFrame index="06" title="Navigation Rail" material="POWDER COAT" note="ROUTE FREQUENCY" record={record} meterLevel={Math.max(0, ...record.trace)} onReset={onReset}>
      <div className="control-bay nav-bay">
        <nav className="lab-nav" aria-label="实验台导航">
          {navItems.map(({ label, icon: Icon }, index) => {
            const traceIndex = Math.round((index / (navItems.length - 1)) * (record.trace.length - 1));
            return (
              <button
                key={label}
                type="button"
                aria-current={active === index ? "page" : undefined}
                style={{ "--nav-wear": record.trace[traceIndex] } as React.CSSProperties}
                onClick={() => {
                  setActive(index);
                  markUse("navigation", 1);
                  markTrace("navigation", index / (navItems.length - 1), 3.8);
                }}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
                <i aria-hidden="true" />
              </button>
            );
          })}
        </nav>
      </div>
    </SpecimenFrame>
  );
}
