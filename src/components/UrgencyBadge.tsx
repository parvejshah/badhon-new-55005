import { Badge } from '@/components/ui/badge';

interface UrgencyBadgeProps {
  urgency: string;
  className?: string;
}

const URGENCY_STYLES: Record<string, string> = {
  critical: 'bg-red-500 text-white animate-pulse',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-green-500 text-white',
};

export function UrgencyBadge({ urgency, className = '' }: UrgencyBadgeProps) {
  const urgencyStyle = URGENCY_STYLES[urgency] || URGENCY_STYLES.medium;
  
  return (
    <Badge className={`${urgencyStyle} ${className}`}>
      {urgency.toUpperCase()}
    </Badge>
  );
}
