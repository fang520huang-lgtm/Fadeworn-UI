"use client";

import { useState } from "react";
import { Activity, Archive, Radio, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWearLevelForDisplay, type ComponentId, type WearRecord } from "@/hooks/use-wear-system";
import { SpecimenFrame } from "./specimen-frame";

type Marks = {
  markUse: (id: ComponentId, intensity?: number, point?: { x: number; y: number }) => void;
  markTrace: (id: ComponentId, position: number, intensity?: number, countAsUse?: boolean) => void;
};

type Resettable = { onReset: () => void };

const tabItems = ["SIGNAL", "HISTORY", "NOTES"];

export function WearTabsSpecimen({ record, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const [tab, setTab] = useState("SIGNAL");
  const tabWear = tabItems.map((_, index) => {
    const traceIndex = Math.round((index / (tabItems.length - 1)) * (record.trace.length - 1));
    return record.trace[traceIndex] ?? 0;
  });
  return (
    <SpecimenFrame index="05" title="Mode Register" material="PRINTED ABS" note="FREQUENCY EXPOSURE" record={record} meterLevel={getWearLevelForDisplay("tabs", record)} onReset={onReset}>
      <div className="control-bay tabs-bay">
        <Tabs
          value={tab}
          onValueChange={setTab}
        >
          <TabsList className="lab-tabs-list">
            {tabItems.map((item, index) => {
              return (
                <TabsTrigger
                  key={item}
                  value={item}
                  className="lab-tab"
                  style={{ "--tab-wear": tabWear[index] } as React.CSSProperties}
                  onClick={() => markTrace("tabs", index / (tabItems.length - 1), 1, true)}
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

export function WearNavigationSpecimen({ record, markTrace, onReset }: { record: WearRecord } & Marks & Resettable) {
  const [active, setActive] = useState(0);
  const navigationWear = navItems.map((_, index) => {
    const traceIndex = Math.round((index / (navItems.length - 1)) * (record.trace.length - 1));
    return record.trace[traceIndex] ?? 0;
  });
  return (
    <SpecimenFrame index="06" title="Navigation Rail" material="POWDER COAT" note="ROUTE FREQUENCY" record={record} meterLevel={getWearLevelForDisplay("navigation", record)} onReset={onReset}>
      <div className="control-bay nav-bay">
        <nav className="lab-nav" aria-label="Laboratory navigation">
          {navItems.map(({ label, icon: Icon }, index) => {
            return (
              <button
                key={label}
                type="button"
                aria-current={active === index ? "page" : undefined}
                style={{ "--nav-wear": navigationWear[index] } as React.CSSProperties}
                onClick={() => {
                  setActive(index);
                  markTrace("navigation", index / (navItems.length - 1), 1, true);
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
