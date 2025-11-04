import { BloodGroupBadge } from '@/components/BloodGroupBadge';
import { DonorStatusBadge } from '@/components/DonorStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail } from 'lucide-react';
import { calculateDaysSinceLastDonation } from '@/lib/donorMatching';

interface Donor {
  id: string;
  name: string;
  blood_group: string;
  hall: string;
  department: string;
  phone: string;
  email: string;
  last_donation_date: string | null;
  donation_count: number;
  status: string;
}

interface DonorSearchResultsProps {
  donors: Donor[];
  onContactDonor: (donor: Donor) => void;
}

export function DonorSearchResults({ donors, onContactDonor }: DonorSearchResultsProps) {
  if (donors.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No eligible donors found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">
        {donors.length} Eligible Donor{donors.length !== 1 ? 's' : ''} Found
      </h3>
      
      {donors.map((donor) => {
        const daysSince = calculateDaysSinceLastDonation(donor.last_donation_date);
        
        return (
          <Card key={donor.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{donor.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {donor.department} • {donor.hall}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <BloodGroupBadge bloodGroup={donor.blood_group} />
                  <DonorStatusBadge status={donor.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${donor.phone}`} className="hover:text-primary">
                    {donor.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${donor.email}`} className="hover:text-primary truncate">
                    {donor.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{donor.donation_count}</span> donations
                  {daysSince && (
                    <span className="text-muted-foreground ml-2">
                      • Last donated {daysSince} days ago
                    </span>
                  )}
                  {!donor.last_donation_date && (
                    <span className="text-muted-foreground ml-2">
                      • Never donated
                    </span>
                  )}
                </div>
              </div>
              
              <Button
                onClick={() => onContactDonor(donor)}
                className="w-full"
                variant="outline"
              >
                Contact Donor
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
