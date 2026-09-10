import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ComponentId, WearRecord } from "@/hooks/use-wear-system";

type SpecimenFrameProps = {
  /** Wear component id. The element gets `id="specimen-<id>"` for Wear Log jumps. */
  id: ComponentId;
  index: string;
  title: string;
  material: string;
  /** Optional hint shown on the left of the footer. */
  hint?: string;
  record: WearRecord;
  children: ReactNode;
  className?: string;
  onReset?: () => void;
};

export function SpecimenFrame({
  id,
  index,
  title,
  material,
  hint,
  record,
  children,
  className = "",
  onReset,
}: SpecimenFrameProps) {
  return (
    <Card
      id={`specimen-${id}`}
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
            <button className="specimen-reset" type="button" onClick={onReset} aria-label={`Reset ${title}`} title="Reset this component">
              <RotateCcw aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="specimen-card__body">{children}</CardContent>
      <footer className="specimen-card__foot">
        <span>{hint}</span>
        <span>{String(record.usageCount).padStart(3, "0")} USES</span>
      </footer>
    </Card>
  );
}
