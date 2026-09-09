import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { WearRecord } from "@/hooks/use-wear-system";

type SpecimenFrameProps = {
  index: string;
  title: string;
  material: string;
  note: string;
  record: WearRecord;
  children: ReactNode;
  className?: string;
};

export function SpecimenFrame({
  index,
  title,
  material,
  note,
  record,
  children,
  className = "",
}: SpecimenFrameProps) {
  const percent = Math.round(record.wearLevel * 100);
  return (
    <Card className={`specimen-card ${className}`} style={{ "--level": record.wearLevel } as React.CSSProperties}>
      <CardHeader className="specimen-card__head">
        <div>
          <p className="specimen-no">{index} / {material}</p>
          <h3>{title}</h3>
        </div>
        <div className="mini-gauge" aria-label={`磨损 ${percent}%`}>
          <span style={{ height: `${Math.max(3, percent)}%` }} />
          <b>{percent}%</b>
        </div>
      </CardHeader>
      <CardContent className="specimen-card__body">{children}</CardContent>
      <footer className="specimen-card__foot">
        <span>{note}</span>
        <span>{String(record.usageCount).padStart(3, "0")} USES</span>
      </footer>
    </Card>
  );
}

export function HitMarks({ record }: { record: WearRecord }) {
  return (
    <span className="hit-layer" aria-hidden="true">
      {record.hitPositions.map((point, index) => (
        <i
          key={`${point.createdAt}-${index}`}
          style={{
            left: `${point.x * 100}%`,
            top: `${point.y * 100}%`,
            opacity: Math.min(0.9, 0.18 + point.pressure * record.wearLevel),
            transform: `translate(-50%, -50%) scale(${0.65 + point.pressure * 0.7})`,
          }}
        />
      ))}
    </span>
  );
}
