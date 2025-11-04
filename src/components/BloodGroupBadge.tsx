import { BLOOD_GROUP_COLORS } from '@/lib/bloodGroupColors';
import { Badge } from '@/components/ui/badge';

interface BloodGroupBadgeProps {
  bloodGroup: string;
  className?: string;
}

export function BloodGroupBadge({ bloodGroup, className = '' }: BloodGroupBadgeProps) {
  const colorClass = BLOOD_GROUP_COLORS[bloodGroup] || 'bg-gray-100 text-gray-800';
  
  return (
    <Badge 
      variant="outline" 
      className={`${colorClass} border font-semibold ${className}`}
    >
      {bloodGroup}
    </Badge>
  );
}
