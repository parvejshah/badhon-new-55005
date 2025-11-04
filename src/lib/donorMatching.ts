import { supabase } from '@/integrations/supabase/client';

export interface Donor {
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

export async function findEligibleDonors(
  bloodGroup: string,
  hallFilter?: string
): Promise<Donor[]> {
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
  const fourMonthsAgoISO = fourMonthsAgo.toISOString().split('T')[0];

  let query = supabase
    .from('donors')
    .select('*')
    .eq('blood_group', bloodGroup)
    .eq('status', 'ready');

  // Filter by 4-month cooldown: either never donated OR last donation >= 4 months ago
  query = query.or(`last_donation_date.is.null,last_donation_date.lte.${fourMonthsAgoISO}`);

  if (hallFilter) {
    query = query.eq('hall', hallFilter);
  }

  query = query.order('last_donation_date', { ascending: true, nullsFirst: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error finding eligible donors:', error);
    return [];
  }

  return data || [];
}

export function calculateDaysSinceLastDonation(lastDonationDate: string | null): number | null {
  if (!lastDonationDate) return null;
  
  const last = new Date(lastDonationDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function isEligibleToDonate(lastDonationDate: string | null): boolean {
  if (!lastDonationDate) return true;
  
  const days = calculateDaysSinceLastDonation(lastDonationDate);
  return days !== null && days >= 120; // 4 months = ~120 days
}
