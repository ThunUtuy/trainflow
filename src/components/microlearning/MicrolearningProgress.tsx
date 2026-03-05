import { Progress } from "@/components/ui/progress";

interface MicrolearningProgressProps {
  current: number;
  total: number;
}

const MicrolearningProgress = ({ current, total }: MicrolearningProgressProps) => {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="flex items-center gap-3">
      <Progress value={percent} className="h-1.5 flex-1" />
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        {current} / {total}
      </span>
    </div>
  );
};

export default MicrolearningProgress;
