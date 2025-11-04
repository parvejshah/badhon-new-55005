import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDonors } from '@/hooks/useDonors';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BloodGroupBadge } from '@/components/BloodGroupBadge';
import { DonorStatusBadge } from '@/components/DonorStatusBadge';
import { User, Mail, Phone, Building2, GraduationCap, Calendar, Droplet } from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();
  const { getDonorProfile } = useDonors();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Try to find donor record linked to this user
      const { data: donors } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (donors) {
        const profile = await getDonorProfile(donors.id);
        setProfileData(profile);
      } else {
        setProfileData({ donor: null, donations: [] });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xl">Loading profile...</div>
      </div>
    );
  }

  const { donor, donations } = profileData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View your donor information and donation history</p>
      </div>

      {!donor ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              You don't have a donor profile yet. Please contact an administrator to set up your donor profile.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {donor.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Name</div>
                      <div className="font-medium">{donor.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Blood Group</div>
                      <BloodGroupBadge bloodGroup={donor.blood_group} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{donor.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">{donor.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Hall</div>
                      <div className="font-medium">{donor.hall}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Department</div>
                      <div className="font-medium">{donor.department}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Donations</div>
                  <div className="text-3xl font-bold text-primary">{donor.donation_count}</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Last Donation</div>
                  <div className="text-xl font-semibold">
                    {donor.last_donation_date ? format(new Date(donor.last_donation_date), 'MMM d, yyyy') : 'Never'}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="mt-1">
                    <DonorStatusBadge status={donor.status} lastDonationDate={donor.last_donation_date} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Donation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No donation history yet
                </p>
              ) : (
                <div className="space-y-4">
                  {donations.map((donation: any) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {donation.blood_requests ? donation.blood_requests.patient_name : 'Direct Donation'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {donation.blood_requests?.hospital}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {format(new Date(donation.donation_date), 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">{donation.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
