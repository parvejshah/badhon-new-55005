import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
  certificateCount: number;
}

export function DownloadButton({ onClick, certificateCount }: DownloadButtonProps) {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2 text-primary">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <p className="font-medium">
          {certificateCount} certificate{certificateCount !== 1 ? 's' : ''} ready!
        </p>
      </div>
      <Button onClick={onClick} size="lg" variant="secondary">
        <Download className="mr-2 h-5 w-5" />
        Download ZIP
      </Button>
    </div>
  );
}
