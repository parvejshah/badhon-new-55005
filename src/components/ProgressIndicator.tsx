import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Generating certificates...</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
