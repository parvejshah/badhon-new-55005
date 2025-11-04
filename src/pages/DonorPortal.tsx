import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BloodGroupBadge } from '@/components/BloodGroupBadge';
import { toast } from 'sonner';
import { Heart, Calendar, Phone, Mail, Building2, User, FileText, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function DonorPortal() {
  const { user, isAdmin, isVolunteer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [donorProfile, setDonorProfile] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  
  const canEditAvailability = isAdmin || isVolunteer;
  
  const [formData, setFormData] = useState({
    name: '',
    blood_group: '',
    hall: '',
    department: '',
    phone: '',
    email: '',
    status: 'ready',
    medical_eligible: true,
    availability_notes: '',
  });

  useEffect(() => {
    if (user) {
      loadDonorProfile();
    }
  }, [user]);

  const loadDonorProfile = async () => {
    setLoading(true);
    try {
      const { data: donor, error: donorError } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (donorError) throw donorError;

      if (donor) {
        setDonorProfile(donor);
        setFormData({
          name: donor.name,
          blood_group: donor.blood_group,
          hall: donor.hall,
          department: donor.department,
          phone: donor.phone,
          email: donor.email,
          status: donor.status,
          medical_eligible: donor.medical_eligible,
          availability_notes: donor.availability_notes || '',
        });

        // Load donation history
        const { data: donationData, error: donationError } = await supabase
          .from('donations')
          .select('*, blood_requests(*)')
          .eq('donor_id', donor.id)
          .order('donation_date', { ascending: false });

        if (donationError) throw donationError;
        setDonations(donationData || []);
      }
    } catch (error: any) {
      toast.error('Failed to load profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (donorProfile) {
        // Build update object based on user permissions
        const updates: any = {
          name: formData.name,
          phone: formData.phone,
          hall: formData.hall,
          department: formData.department,
        };

        // Only admins/volunteers can update availability settings
        if (canEditAvailability) {
          updates.status = formData.status;
          updates.medical_eligible = formData.medical_eligible;
          updates.availability_notes = formData.availability_notes;
        }

        const { error } = await supabase
          .from('donors')
          .update(updates)
          .eq('id', donorProfile.id);

        if (error) throw error;
        toast.success('Profile updated successfully!');
      } else {
        // Create new profile
        const { error } = await supabase
          .from('donors')
          .insert({
            user_id: user?.id,
            ...formData,
          });

        if (error) throw error;
        toast.success('Profile created successfully!');
      }
      
      await loadDonorProfile();
    } catch (error: any) {
      toast.error('Failed to save profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const daysSinceLastDonation = donorProfile?.last_donation_date
    ? Math.floor((new Date().getTime() - new Date(donorProfile.last_donation_date).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const isEligibleToDonate = !donorProfile?.last_donation_date || (daysSinceLastDonation && daysSinceLastDonation >= 120);

  const halls = [
    'Shaheed Rafiq Hall', 'Jinnah Hall', 'Amar Ekushey Hall',
    'Shahid Salam-Barkat Hall', 'Suhrawardy Hall', 'Shaheed Sergeant Zahurul Haq Hall',
    'Fazlul Huq Muslim Hall', 'Haji Muhammad Mohsin Hall', 'Bishwakabi Rabindranath Hall',
    'Shamsun Nahar Hall', 'Bangladesh-Kuwait Maitree Hall', 'Bangabandhu Sheikh Mujibur Rahman Hall',
    'Begum Fazilatunnesa Mujib Hall', 'Dr. Muhammad Shahidullah Hall', 'Ruqayyah Hall',
    'Bangamata Sheikh Fazilatunnessa Mujib Hall', 'Kabi Jasimuddin Hall', 'Kabi Sufia Kamal Hall',
    'Masterda Surya Sen Hall'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          Donor Portal
        </h1>
        <p className="text-muted-foreground">Manage your donor profile and availability</p>
      </div>

      {donorProfile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{donorProfile.donation_count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Last Donation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">
                {donorProfile.last_donation_date ? format(new Date(donorProfile.last_donation_date), 'MMM d, yyyy') : 'Never'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Eligibility Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-semibold ${isEligibleToDonate ? 'text-green-600' : 'text-orange-600'}`}>
                {isEligibleToDonate ? '✓ Eligible' : `Wait ${120 - (daysSinceLastDonation || 0)} days`}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your details and availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="inline h-4 w-4 mr-1" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood Group</Label>
              <Select
                value={formData.blood_group}
                onValueChange={(value) => setFormData({ ...formData, blood_group: value })}
                disabled={!!donorProfile}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {donorProfile && <p className="text-xs text-muted-foreground">Blood group cannot be changed</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hall">
                <Building2 className="inline h-4 w-4 mr-1" />
                Hall
              </Label>
              <Select
                value={formData.hall}
                onValueChange={(value) => setFormData({ ...formData, hall: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hall" />
                </SelectTrigger>
                <SelectContent>
                  {halls.map((hall) => (
                    <SelectItem key={hall} value={hall}>{hall}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Your department"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Your email"
                disabled={!!donorProfile}
              />
              {donorProfile && <p className="text-xs text-muted-foreground">Email cannot be changed</p>}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Availability Settings
            </h3>

            {!canEditAvailability && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Availability settings can only be updated by administrators and volunteers.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Current Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={!canEditAvailability}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ready">Ready - Available to donate</SelectItem>
                  <SelectItem value="unavailable">Unavailable - Cannot donate right now</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="medical_eligible" className="flex flex-col space-y-1">
                <span>Medically Eligible</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Are you currently in good health and eligible to donate?
                </span>
              </Label>
              <Switch
                id="medical_eligible"
                checked={formData.medical_eligible}
                onCheckedChange={(checked) => setFormData({ ...formData, medical_eligible: checked })}
                disabled={!canEditAvailability}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                <FileText className="inline h-4 w-4 mr-1" />
                Availability Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.availability_notes}
                onChange={(e) => setFormData({ ...formData, availability_notes: e.target.value })}
                placeholder="Any special notes about your availability (e.g., exam period, travel plans)"
                rows={3}
                disabled={!canEditAvailability}
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

      {donations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Donation History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      {donation.blood_requests?.patient_name || 'Direct Donation'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {donation.blood_requests?.hospital || 'No hospital info'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{format(new Date(donation.donation_date), 'MMM d, yyyy')}</div>
                    <div className="text-sm text-muted-foreground capitalize">{donation.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
