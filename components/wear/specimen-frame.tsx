import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { WearRecord } from "@/hooks/use-wear-system";

type SpecimenFrameProps = {
  /** Anchor id so the Wear Log rows can jump straight to this specimen. */
  anchor: string;
  index: string;
  title: string;
  material: string;
  note: string;
  record: WearRecord;
  children: ReactNode;
  className?: string;
  onReset?: () => void;
};

export function SpecimenFrame({
  anchor,
  index,
  title,
  material,
  note,
  record,
  children,
  className = "",
  onReset,
}: SpecimenFrameProps) {
  return (
    <Card
      id={anchor}
      className={`specimen-card ${className}`}
      style={{ "--level": record.wearLevel } as React.CSSProperties}
    >
      <CardHeader className="specimen-card__head">
        <div>
          <p className="specimen-no">{index} / {material}</p>
          <h3>{title}</h3>
        </div>
        <div className="specimen-head-actions">
          {onReset ? (
            <button className="specimen-reset" type="button" onClick={onReset} aria-label={`Reset ${title}`} title="Reset this specimen">
              <RotateCcw aria-hidden="true" />
            </button>
          ) : null}
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
