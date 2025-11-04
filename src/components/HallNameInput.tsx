import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HallNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function HallNameInput({ value, onChange }: HallNameInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="hall-name" className="text-base font-medium">
        Hall Name
      </Label>
      <Input
        id="hall-name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter hall name"
        className="max-w-md"
      />
    </div>
  );
}
