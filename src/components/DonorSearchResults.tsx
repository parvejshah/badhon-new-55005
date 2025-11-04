import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BloodGroupBadge } from './BloodGroupBadge';
import { Phone, Mail, Building2, Calendar, Award, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DonorSearchResultsProps {
  requestId: string;
  bloodGroup: string;
  onContact: (donorId: string) => void;
}

interface SuggestedDonor {
  id: string;
  donor_id: string;
  match_score: number;
  contacted: boolean;
  response: string | null;
  donors: {
    id: string;
    name: string;
    blood_group: string;
    hall: string;
    department: string;
    phone: string;
    email: string;
    donation_count: number;
    last_donation_date: string | null;
    status: string;
    medical_eligible: boolean;
  };
}

export function DonorSearchResults({ requestId, bloodGroup, onContact }: DonorSearchResultsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestedDonors, setSuggestedDonors] = useState<SuggestedDonor[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const findDonors = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      // First, find eligible donors
      const fourMonthsAgo = new Date();
      fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
      const fourMonthsAgoISO = fourMonthsAgo.toISOString().split('T')[0];

      const { data: eligibleDonors, error: donorsError } = await supabase
        .from('donors')
        .select('*')
        .eq('blood_group', bloodGroup)
        .eq('status', 'ready')
        .eq('medical_eligible', true)
        .or(`last_donation_date.is.null,last_donation_date.lte.${fourMonthsAgoISO}`)
        .order('last_donation_date', { ascending: true, nullsFirst: false })
        .limit(10);

      if (donorsError) throw donorsError;

      if (!eligibleDonors || eligibleDonors.length === 0) {
        toast.info('No eligible donors found for this blood group');
        setSuggestedDonors([]);
        return;
      }

      // Calculate match scores and insert suggestions
      const suggestions = eligibleDonors.map(donor => {
        let score = 50; // Base score
        
        // Never donated before gets highest priority
        if (!donor.last_donation_date) {
          score += 30;
        }
        
        // More donations = more reliable
        score += Math.min(donor.donation_count * 5, 20);
        
        return {
          request_id: requestId,
          donor_id: donor.id,
          match_score: score,
          contacted: false,
        };
      });

      // Insert suggestions (ignore duplicates)
      const { error: insertError } = await supabase
        .from('suggested_donors')
        .upsert(suggestions, { onConflict: 'request_id,donor_id' });

      if (insertError) throw insertError;

      // Fetch suggestions with donor details
      const { data: suggested, error: suggestedError } = await supabase
        .from('suggested_donors')
        .select('*, donors(*)')
        .eq('request_id', requestId)
        .order('match_score', { ascending: false });

      if (suggestedError) throw suggestedError;

      setSuggestedDonors(suggested as SuggestedDonor[]);
      toast.success(`Found ${suggested?.length || 0} eligible donors!`);
    } catch (error: any) {
      toast.error('Failed to find donors: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const markContacted = async (suggestionId: string, donorId: string) => {
    try {
      const { error } = await supabase
        .from('suggested_donors')
        .update({ contacted: true })
        .eq('id', suggestionId);

      if (error) throw error;

      setSuggestedDonors(prev =>
        prev.map(s => (s.id === suggestionId ? { ...s, contacted: true } : s))
      );

      onContact(donorId);
      toast.success('Marked as contacted');
    } catch (error: any) {
      toast.error('Failed to update: ' + error.message);
    }
  };

  const updateResponse = async (suggestionId: string, response: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('suggested_donors')
        .update({ response })
        .eq('id', suggestionId);

      if (error) throw error;

      setSuggestedDonors(prev =>
        prev.map(s => (s.id === suggestionId ? { ...s, response } : s))
      );

      toast.success(`Response recorded: ${response}`);
    } catch (error: any) {
      toast.error('Failed to update: ' + error.message);
    }
  };

  if (!hasSearched) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Click below to find eligible donors for blood group <strong>{bloodGroup}</strong>
          </p>
          <Button onClick={findDonors} disabled={loading}>
            {loading ? 'Searching...' : 'Find Eligible Donors'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (suggestedDonors.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No eligible donors found. Try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested Donors ({suggestedDonors.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestedDonors.map((suggestion) => {
          const donor = suggestion.donors;
          const daysSinceLast = donor.last_donation_date
            ? Math.floor((new Date().getTime() - new Date(donor.last_donation_date).getTime()) / (1000 * 60 * 60 * 24))
            : null;

          return (
            <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{donor.name}</h4>
                    <BloodGroupBadge bloodGroup={donor.blood_group} />
                    <Badge variant="secondary">
                      <Award className="h-3 w-3 mr-1" />
                      Match: {suggestion.match_score}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {donor.hall}
                    </div>
                    <div>{donor.department}</div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {donor.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {donor.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-medium">
                      <Award className="inline h-3 w-3 mr-1" />
                      {donor.donation_count} donations
                    </span>
                    {donor.last_donation_date && (
                      <span>
                        <Calendar className="inline h-3 w-3 mr-1" />
                        Last: {format(new Date(donor.last_donation_date), 'MMM d, yyyy')} ({daysSinceLast} days ago)
                      </span>
                    )}
                    {!donor.last_donation_date && (
                      <span className="text-green-600 font-medium">First time donor!</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {!suggestion.contacted ? (
                    <Button size="sm" onClick={() => markContacted(suggestion.id, donor.id)}>
                      Mark Contacted
                    </Button>
                  ) : (
                    <Badge variant="outline">Contacted</Badge>
                  )}
                  {suggestion.contacted && !suggestion.response && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateResponse(suggestion.id, 'accepted')}
                      >
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateResponse(suggestion.id, 'declined')}
                      >
                        <XCircle className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  )}
                  {suggestion.response && (
                    <Badge className={suggestion.response === 'accepted' ? 'bg-green-600' : 'bg-red-600'}>
                      {suggestion.response}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
