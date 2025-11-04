import { Badge } from '@/components/ui/badge';
import { calculateDaysSinceLastDonation, isEligibleToDonate } from '@/lib/donorMatching';

interface DonorStatusBadgeProps {
  status: string;
  lastDonationDate?: string | null;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  ready: 'bg-green-100 text-green-800 border-green-300',
  going: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  donated: 'bg-blue-100 text-blue-800 border-blue-300',
};

export function DonorStatusBadge({ status, lastDonationDate, className = '' }: DonorStatusBadgeProps) {
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.ready;
  const eligible = isEligibleToDonate(lastDonationDate || null);
  const daysSince = calculateDaysSinceLastDonation(lastDonationDate || null);
  
  let displayStatus = status;
  let tooltip = '';
  
  if (!eligible && daysSince) {
    const daysRemaining = 120 - daysSince;
    displayStatus = 'Not Eligible';
    tooltip = `Available in ${daysRemaining} days`;
  }
  
  return (
    <Badge variant="outline" className={`${statusStyle} ${className}`} title={tooltip}>
      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
    </Badge>
  );
}
