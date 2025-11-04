import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Donor {
  id: string;
  user_id?: string;
  name: string;
  blood_group: string;
  hall: string;
  department: string;
  phone: string;
  email: string;
  last_donation_date: string | null;
  donation_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DonorFilters {
  bloodGroup?: string;
  hall?: string;
  status?: string;
  search?: string;
}

export function useDonors() {
  const [loading, setLoading] = useState(false);

  const fetchDonors = async (filters?: DonorFilters): Promise<Donor[]> => {
    setLoading(true);
    try {
      let query = supabase.from('donors').select('*');

      if (filters?.bloodGroup) {
        query = query.eq('blood_group', filters.bloodGroup);
      }
      if (filters?.hall) {
        query = query.eq('hall', filters.hall);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error('Failed to fetch donors: ' + error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createDonor = async (donor: Omit<Donor, 'id' | 'created_at' | 'updated_at'>): Promise<Donor | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('donors')
        .insert(donor)
        .select()
        .single();

      if (error) throw error;
      toast.success('Donor created successfully!');
      return data;
    } catch (error: any) {
      toast.error('Failed to create donor: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDonor = async (id: string, updates: Partial<Donor>): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('donors')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Donor updated successfully!');
      return true;
    } catch (error: any) {
      toast.error('Failed to update donor: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDonor = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Donor deleted successfully!');
      return true;
    } catch (error: any) {
      toast.error('Failed to delete donor: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getDonorById = async (id: string): Promise<Donor | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error('Failed to fetch donor: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDonorProfile = async (id: string) => {
    setLoading(true);
    try {
      const { data: donor, error: donorError } = await supabase
        .from('donors')
        .select('*')
        .eq('id', id)
        .single();

      if (donorError) throw donorError;

      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('*, blood_requests(*)')
        .eq('donor_id', id)
        .order('donation_date', { ascending: false });

      if (donationsError) throw donationsError;

      return { donor, donations: donations || [] };
    } catch (error: any) {
      toast.error('Failed to fetch donor profile: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchDonors,
    createDonor,
    updateDonor,
    deleteDonor,
    getDonorById,
    getDonorProfile,
  };
}
